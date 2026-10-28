const { Op } = require("sequelize");
const {
  Payout,
  Earning,
  Restaurant,
  Order,
  Payment,
  User,
} = require("../models");

// Helper: Mask bank account number (show only last 4 digits)
const maskAccountNumber = (accNum) => {
  if (!accNum) return "Not provided";
  const str = String(accNum).trim();
  if (str.length <= 4) return str;
  return `XXXX-XXXX-${str.slice(-4)}`;
};

/**
 * -------------------------------------------------------------
 * 1. RESTAURANT PARTNER: GET EARNINGS & SETTLEMENT DASHBOARD
 * -------------------------------------------------------------
 */
exports.getPartnerEarnings = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      where: { ownerId: req.user.id },
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant profile not found for this partner.",
      });
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch all earnings for this restaurant
    const earnings = await Earning.findAll({
      where: { restaurantId: restaurant.id },
      include: [
        {
          model: Order,
          as: "order",
          include: [{ model: User, as: "user", attributes: ["id", "name"] }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Fetch payout records for this restaurant
    const payouts = await Payout.findAll({
      where: { restaurantId: restaurant.id },
      order: [["createdAt", "DESC"]],
    });

    let grossFoodSales = 0;
    let totalCommission = 0;
    let netEarnings = 0;
    let todayEarnings = 0;
    let weekEarnings = 0;
    let monthEarnings = 0;
    let availableBalance = 0;
    let pendingSettlement = 0;
    let totalPaidOut = 0;

    const ordersBreakdown = [];

    for (const earning of earnings) {
      const isCancelledOrReversed =
        earning.status === "cancelled" || earning.status === "reversed";
      const isAccrued = earning.status === "accrued";
      const isSettled = earning.status === "settled";

      const eNet = Number(earning.restaurantEarning || 0);
      const eGross = Number(earning.grossFoodSales || 0);
      const eComm = Number(earning.platformCommission || 0);
      const created = new Date(earning.createdAt);

      if (!isCancelledOrReversed) {
        grossFoodSales += eGross;
        totalCommission += eComm;
        netEarnings += eNet;

        if (created >= startOfToday) todayEarnings += eNet;
        if (created >= startOfWeek) weekEarnings += eNet;
        if (created >= startOfMonth) monthEarnings += eNet;

        if (isAccrued) {
          availableBalance += eNet;
        } else if (isSettled) {
          pendingSettlement += 0;
        }
      }

      ordersBreakdown.push({
        id: earning.id,
        orderId: earning.orderId,
        orderNumber: `ORD-${earning.orderId}`,
        customerName: earning.order?.user?.name || "Customer",
        date: earning.createdAt,
        grossFoodSales: eGross,
        taxAmount: Number(earning.taxAmount || 0),
        discountAmount: Number(earning.discountAmount || 0),
        commissionRate: Number(earning.commissionRate || 2),
        commissionDeducted: eComm,
        netRestaurantEarning: eNet,
        status: earning.status,
        orderStatus: earning.order?.status || "unknown",
        paymentStatus: earning.order?.paymentStatus || "unknown",
      });
    }

    for (const payout of payouts) {
      if (payout.status === "paid") {
        totalPaidOut += Number(payout.approvedAmount || payout.amount || 0);
      } else if (payout.status === "pending" || payout.status === "approved" || payout.status === "processing") {
        pendingSettlement += Number(payout.amount || 0);
      }
    }

    // Adjust available balance by deducting amounts currently pending in payout requests
    const adjustedAvailableBalance = Math.max(0, Math.round((availableBalance - pendingSettlement) * 100) / 100);

    return res.json({
      success: true,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        commissionRate: restaurant.commissionRate || 2,
      },
      bankDetails: {
        accountHolderName: restaurant.accountHolderName || "",
        bankName: restaurant.bankName || "",
        accountNumberMasked: maskAccountNumber(restaurant.accountNumber),
        hasFullAccount: Boolean(restaurant.accountNumber),
        ifscCode: restaurant.ifscCode || "",
        upiId: restaurant.upiId || "",
      },
      summary: {
        todayEarnings: Math.round(todayEarnings * 100) / 100,
        weekEarnings: Math.round(weekEarnings * 100) / 100,
        monthEarnings: Math.round(monthEarnings * 100) / 100,
        grossFoodSales: Math.round(grossFoodSales * 100) / 100,
        totalCommission: Math.round(totalCommission * 100) / 100,
        netEarnings: Math.round(netEarnings * 100) / 100,
        availableBalance: adjustedAvailableBalance,
        pendingSettlement: Math.round(pendingSettlement * 100) / 100,
        totalPaidOut: Math.round(totalPaidOut * 100) / 100,
      },
      ordersBreakdown,
      payoutHistory: payouts.map((p) => ({
        id: p.id,
        payoutNumber: p.payoutNumber,
        amount: p.amount,
        approvedAmount: p.approvedAmount,
        status: p.status,
        paymentMode: p.paymentMode,
        utrNumber: p.utrNumber,
        reconciliationStatus: p.reconciliationStatus,
        failureReason: p.failureReason,
        createdAt: p.createdAt,
        completedAt: p.completedAt,
      })),
    });
  } catch (error) {
    console.error("GET PARTNER EARNINGS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * -------------------------------------------------------------
 * 2. RESTAURANT PARTNER: REQUEST A PAYOUT
 * -------------------------------------------------------------
 */
exports.requestPartnerPayout = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      where: { ownerId: req.user.id },
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found." });
    }

    if (!restaurant.accountNumber && !restaurant.upiId) {
      return res.status(400).json({
        success: false,
        message: "Please add your Bank Account or UPI ID in Profile Settings before requesting a payout.",
      });
    }

    const { amount } = req.body;
    const requestedAmount = Number(amount);

    if (!requestedAmount || requestedAmount < 100) {
      return res.status(400).json({
        success: false,
        message: "Minimum payout request amount is ₹100.",
      });
    }

    // Calculate unencumbered available balance
    const accruedEarnings = await Earning.findAll({
      where: {
        restaurantId: restaurant.id,
        status: "accrued",
      },
    });

    const totalAccrued = accruedEarnings.reduce(
      (sum, e) => sum + Number(e.restaurantEarning || 0),
      0
    );

    const activePayouts = await Payout.findAll({
      where: {
        restaurantId: restaurant.id,
        status: { [Op.in]: ["pending", "approved", "processing"] },
      },
    });

    const activePayoutSum = activePayouts.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

    const available = Math.max(0, totalAccrued - activePayoutSum);

    if (requestedAmount > available) {
      return res.status(400).json({
        success: false,
        message: `Requested amount ₹${requestedAmount} exceeds your available balance of ₹${available.toFixed(2)}.`,
      });
    }

    const payoutNumber = `PO-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const payout = await Payout.create({
      payoutNumber,
      restaurantId: restaurant.id,
      amount: requestedAmount,
      approvedAmount: requestedAmount,
      status: "pending",
      beneficiaryName: restaurant.accountHolderName || restaurant.name,
      accountNumberMasked: maskAccountNumber(restaurant.accountNumber),
      ifscCode: restaurant.ifscCode || null,
      bankName: restaurant.bankName || null,
      upiId: restaurant.upiId || null,
      paymentMode: restaurant.accountNumber ? "NEFT" : "UPI",
      reconciliationStatus: "unverified",
      initiatedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: `Payout request ${payoutNumber} submitted successfully.`,
      payout,
    });
  } catch (error) {
    console.error("REQUEST PAYOUT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * -------------------------------------------------------------
 * 3. MAIN ADMIN: GET ALL PAYOUTS & FINANCIAL OVERVIEW
 * -------------------------------------------------------------
 */
exports.getMainAdminPayouts = async (req, res) => {
  try {
    const { status, restaurantId, limit = 100 } = req.query;

    const whereClause = {};
    if (status && status !== "all") whereClause.status = status;
    if (restaurantId && restaurantId !== "all") whereClause.restaurantId = restaurantId;

    const payouts = await Payout.findAll({
      where: whereClause,
      include: [
        {
          model: Restaurant,
          as: "restaurant",
          attributes: ["id", "name", "ownerName", "restaurantPhone", "city"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
    });

    // Summary statistics
    const allPayouts = await Payout.findAll();
    const totalRequested = allPayouts.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const totalPaid = allPayouts
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + Number(p.approvedAmount || p.amount || 0), 0);
    const pendingApproval = allPayouts
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const processing = allPayouts
      .filter((p) => p.status === "approved" || p.status === "processing")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const failed = allPayouts
      .filter((p) => p.status === "failed")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    // Outstanding restaurant earnings awaiting payout
    const unliquidatedEarnings = await Earning.findAll({
      where: { status: "accrued" },
    });
    const totalUnsettledLiability = unliquidatedEarnings.reduce(
      (sum, e) => sum + Number(e.restaurantEarning || 0),
      0
    );

    return res.json({
      success: true,
      summary: {
        totalRequested: Math.round(totalRequested * 100) / 100,
        totalPaid: Math.round(totalPaid * 100) / 100,
        pendingApproval: Math.round(pendingApproval * 100) / 100,
        processing: Math.round(processing * 100) / 100,
        failed: Math.round(failed * 100) / 100,
        outstandingLiability: Math.round(totalUnsettledLiability * 100) / 100,
      },
      rows: payouts.map((p) => ({
        id: p.id,
        payoutNumber: p.payoutNumber,
        restaurantId: p.restaurantId,
        restaurantName: p.restaurant?.name || `Restaurant #${p.restaurantId}`,
        city: p.restaurant?.city || "Adilabad",
        amount: Number(p.amount || 0),
        approvedAmount: Number(p.approvedAmount || p.amount || 0),
        status: p.status,
        paymentMode: p.paymentMode,
        beneficiaryName: p.beneficiaryName,
        accountNumberMasked: p.accountNumberMasked,
        ifscCode: p.ifscCode,
        bankName: p.bankName,
        upiId: p.upiId,
        utrNumber: p.utrNumber,
        reconciliationStatus: p.reconciliationStatus,
        failureReason: p.failureReason,
        initiatedAt: p.initiatedAt,
        completedAt: p.completedAt,
        createdAt: p.createdAt,
      })),
    });
  } catch (error) {
    console.error("GET ADMIN PAYOUTS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * -------------------------------------------------------------
 * 4. MAIN ADMIN: APPROVE PAYOUT
 * -------------------------------------------------------------
 */
exports.approvePayout = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedAmount } = req.body;

    const payout = await Payout.findByPk(id);
    if (!payout) {
      return res.status(404).json({ success: false, message: "Payout not found." });
    }

    if (payout.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Payout cannot be approved from status '${payout.status}'.`,
      });
    }

    const finalAmount = approvedAmount ? Number(approvedAmount) : payout.amount;

    await payout.update({
      status: "approved",
      approvedAmount: finalAmount,
      processedBy: req.user?.email || "Admin",
    });

    return res.json({
      success: true,
      message: `Payout ${payout.payoutNumber} approved for ₹${finalAmount}.`,
      payout,
    });
  } catch (error) {
    console.error("APPROVE PAYOUT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * -------------------------------------------------------------
 * 5. MAIN ADMIN: CONFIRM PAYOUT WITH UTR REFERENCE
 * -------------------------------------------------------------
 */
exports.confirmPayout = async (req, res) => {
  try {
    const { id } = req.params;
    const { utrNumber, paymentMode } = req.body;

    if (!utrNumber || String(utrNumber).trim() === "") {
      return res.status(400).json({
        success: false,
        message: "UTR Number / Bank Transfer Reference is required to verify and confirm payout.",
      });
    }

    const payout = await Payout.findByPk(id);
    if (!payout) {
      return res.status(404).json({ success: false, message: "Payout not found." });
    }

    if (payout.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Payout is already marked as paid.",
      });
    }

    await payout.update({
      status: "paid",
      utrNumber: String(utrNumber).trim(),
      paymentMode: paymentMode || payout.paymentMode || "NEFT",
      completedAt: new Date(),
      reconciliationStatus: "matched",
      failureReason: null,
      processedBy: req.user?.email || "Admin",
    });

    // Mark accrued earnings up to the payout amount as settled
    const accruedEarnings = await Earning.findAll({
      where: {
        restaurantId: payout.restaurantId,
        status: "accrued",
      },
      order: [["createdAt", "ASC"]],
    });

    let remainingToSettle = Number(payout.approvedAmount || payout.amount);

    for (const earning of accruedEarnings) {
      if (remainingToSettle <= 0) break;
      const earningVal = Number(earning.restaurantEarning || 0);
      await earning.update({
        status: "settled",
        payoutId: payout.id,
      });
      remainingToSettle -= earningVal;
    }

    return res.json({
      success: true,
      message: `Payout ${payout.payoutNumber} marked as PAID with UTR: ${utrNumber}.`,
      payout,
    });
  } catch (error) {
    console.error("CONFIRM PAYOUT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * -------------------------------------------------------------
 * 6. MAIN ADMIN: REJECT / FAIL PAYOUT
 * -------------------------------------------------------------
 */
exports.rejectPayout = async (req, res) => {
  try {
    const { id } = req.params;
    const { failureReason } = req.body;

    const payout = await Payout.findByPk(id);
    if (!payout) {
      return res.status(404).json({ success: false, message: "Payout not found." });
    }

    await payout.update({
      status: "failed",
      failureReason: failureReason || "Rejected by Admin",
      reconciliationStatus: "discrepancy",
      processedBy: req.user?.email || "Admin",
    });

    return res.json({
      success: true,
      message: `Payout ${payout.payoutNumber} rejected.`,
      payout,
    });
  } catch (error) {
    console.error("REJECT PAYOUT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * -------------------------------------------------------------
 * 7. MAIN ADMIN: COMPLETE RECONCILIATION AUDIT REPORT
 * -------------------------------------------------------------
 */
exports.getReconciliationReport = async (req, res) => {
  try {
    const [orders, payments, earnings, payouts] = await Promise.all([
      Order.findAll({
        include: [{ model: Restaurant, as: "restaurant", attributes: ["id", "name"] }],
        order: [["createdAt", "DESC"]],
        limit: 500,
      }),
      Payment.findAll({ limit: 500 }),
      Earning.findAll({ limit: 500 }),
      Payout.findAll({ limit: 500 }),
    ]);

    const paymentMap = new Map();
    payments.forEach((p) => paymentMap.set(p.orderId, p));

    const earningMap = new Map();
    earnings.forEach((e) => earningMap.set(e.orderId, e));

    const discrepancies = [];

    // Check 1: Orders vs Payments
    for (const order of orders) {
      const payment = paymentMap.get(order.id);
      const isDelivered = order.status === "delivered";
      const isCancelled = order.status === "cancelled";

      if (isDelivered && order.paymentStatus !== "success") {
        discrepancies.push({
          type: "UNPAID_DELIVERED_ORDER",
          severity: "HIGH",
          orderId: order.id,
          restaurant: order.restaurant?.name || `Restaurant #${order.restaurantId}`,
          expectedAmount: Number(order.totalAmount),
          actualAmount: 0,
          difference: Number(order.totalAmount),
          description: `Order #${order.id} is marked Delivered but payment status is '${order.paymentStatus}'.`,
          recommendedAction: "Verify with delivery driver if cash was collected, or check gateway logs.",
        });
      }

      if (isCancelled && payment && payment.status === "success") {
        discrepancies.push({
          type: "REFUND_PENDING",
          severity: "HIGH",
          orderId: order.id,
          restaurant: order.restaurant?.name || `Restaurant #${order.restaurantId}`,
          expectedAmount: 0,
          actualAmount: Number(payment.amount),
          difference: Number(payment.amount),
          description: `Order #${order.id} is Cancelled but customer payment is marked Success.`,
          recommendedAction: "Initiate refund or verify cash was returned.",
        });
      }

      // Check 2: Orders vs Earnings
      const earning = earningMap.get(order.id);
      if (isCancelled && earning && earning.status === "accrued") {
        discrepancies.push({
          type: "ACCRUED_EARNING_ON_CANCELLED_ORDER",
          severity: "MEDIUM",
          orderId: order.id,
          restaurant: order.restaurant?.name || `Restaurant #${order.restaurantId}`,
          expectedAmount: 0,
          actualAmount: Number(earning.restaurantEarning),
          difference: Number(earning.restaurantEarning),
          description: `Earning of ₹${earning.restaurantEarning} is accrued for cancelled order #${order.id}.`,
          recommendedAction: "Cancel earning record to prevent overpayment to restaurant.",
        });
      }
    }

    // Check 3: Payouts without UTR
    for (const payout of payouts) {
      if (payout.status === "paid" && (!payout.utrNumber || payout.utrNumber.trim() === "")) {
        discrepancies.push({
          type: "UNVERIFIED_PAID_PAYOUT",
          severity: "CRITICAL",
          payoutId: payout.id,
          restaurant: `Restaurant #${payout.restaurantId}`,
          expectedAmount: Number(payout.amount),
          actualAmount: 0,
          difference: Number(payout.amount),
          description: `Payout ${payout.payoutNumber} is marked 'paid' without a bank UTR reference.`,
          recommendedAction: "Enter verified UTR from bank statement or downgrade status to Processing.",
        });
      }
    }

    return res.json({
      success: true,
      timestamp: new Date(),
      totalAuditedOrders: orders.length,
      totalDiscrepancies: discrepancies.length,
      criticalCount: discrepancies.filter((d) => d.severity === "CRITICAL").length,
      highCount: discrepancies.filter((d) => d.severity === "HIGH").length,
      mediumCount: discrepancies.filter((d) => d.severity === "MEDIUM").length,
      discrepancies,
    });
  } catch (error) {
    console.error("GET RECONCILIATION REPORT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const { Op, fn, col } = require("sequelize");
const {
  AuditLog,
  DeliveryPartner,
  Earning,
  Offer,
  Order,
  Restaurant,
  Review,
  User,
} = require("../models");

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const titleCase = (value) =>
  String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Pending";

const formatDateTime = (value) => {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

const todayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { [Op.gte]: start, [Op.lt]: end };
};

const writeAudit = async (req, action, entity, entityId) => {
  try {
    await AuditLog.create({
      action,
      entity,
      entityId,
      performedBy: req.user?.email || req.user?.name || "Main Admin",
    });
  } catch (error) {
    console.error("Audit log write failed:", error.message);
  }
};

const restaurantStatus = (restaurant) => {
  if (restaurant.isApproved) return "Approved";
  if (restaurant.isOpen === false) return "Rejected";
  return "Pending";
};

const customerStatus = (user) => (user.isActive ? "Active" : "Blocked");

const deliveryStatus = (partner) => {
  if (!partner.isActive) return "Suspended";
  if (partner.kycStatus === "approved" || partner.isVerified) return "Approved";
  if (partner.kycStatus === "rejected") return "Rejected";
  return "Pending";
};

const restaurantDocumentKeys = [
  "fssaiDocument",
  "gstDocument",
  "panCard",
  "registrationCertificate",
  "cancelledCheque",
  "menuPdf",
  "outletPhotos",
];

const deliveryDocumentKeys = [
  "aadhaarFrontPhoto",
  "aadhaarBackPhoto",
  "drivingLicensePhoto",
  "vehicleInsurance",
  "pucCertificate",
  "cancelledChequePhoto",
  "profilePhoto",
];

const countUploadedDocuments = (record, keys) =>
  keys.reduce((total, key) => {
    const value = record?.[key];
    if (Array.isArray(value)) return total + (value.length > 0 ? 1 : 0);
    return total + (value ? 1 : 0);
  }, 0);

const toPlain = (record) => record?.get ? record.get({ plain: true }) : record;

const summarizeOrders = async () => {
  const totalOrders = await Order.count();
  const deliveredOrders = await Order.count({ where: { status: "delivered" } });
  const cancelledOrders = await Order.count({ where: { status: "cancelled" } });
  const revenue = await Order.sum("totalAmount", {
    where: { paymentStatus: { [Op.in]: ["paid", "completed", "success"] } },
  });

  return {
    totalOrders,
    deliveredOrders,
    cancelledOrders,
    revenue: Number(revenue || 0),
    deliverySuccess:
      totalOrders > 0 ? `${((deliveredOrders / totalOrders) * 100).toFixed(1)}%` : "0%",
    cancellationRate:
      totalOrders > 0 ? `${((cancelledOrders / totalOrders) * 100).toFixed(1)}%` : "0%",
  };
};

exports.getDashboard = async (req, res) => {
  try {
    const [
      customers,
      restaurants,
      approvedRestaurants,
      partners,
      pendingRestaurants,
      reviewsToday,
      orderSummary,
      recentRestaurants,
      recentAudits,
    ] = await Promise.all([
      User.count({ where: { role: "customer" } }),
      Restaurant.count(),
      Restaurant.count({ where: { isApproved: true } }),
      DeliveryPartner.count(),
      Restaurant.count({ where: { isApproved: false } }),
      Review.count({ where: { createdAt: todayRange() } }),
      summarizeOrders(),
      Restaurant.findAll({ order: [["createdAt", "DESC"]], limit: 4 }),
      AuditLog.findAll({ order: [["createdAt", "DESC"]], limit: 6 }),
    ]);

    return res.json({
      success: true,
      stats: [
        { label: "Total Orders", value: orderSummary.totalOrders, change: "Live" },
        { label: "Total Revenue", value: money(orderSummary.revenue), change: "Live" },
        { label: "Active Restaurants", value: approvedRestaurants, change: `${restaurants} total` },
        { label: "Delivery Success", value: orderSummary.deliverySuccess, change: "Live" },
        { label: "Active Customers", value: customers, change: "Live" },
        { label: "Cancellation Rate", value: orderSummary.cancellationRate, change: "Live" },
      ],
      actions: [
        { label: "Review restaurant approvals", href: "/PendingApprovals", count: `${pendingRestaurants} pending` },
        { label: "Moderate reviews", href: "/Reviews", count: `${reviewsToday} today` },
        { label: "Manage delivery partners", href: "/ManagePartners", count: `${partners} partners` },
      ],
      restaurantApplications: recentRestaurants.map((restaurant) => ({
        id: restaurant.id,
        name: restaurant.name,
        city: restaurant.city || "Not available",
        documents: restaurant.gstDocument || restaurant.fssaiDocument ? "Uploaded" : "Pending",
        status: restaurantStatus(restaurant),
      })),
      auditLogs: recentAudits.map((log) => ({
        id: log.id,
        action: log.action,
        user: `${log.entity || "System"} #${log.entityId || "-"}`,
        admin: log.performedBy || "Main Admin",
        time: formatDateTime(log.createdAt),
        reason: log.entity || "Platform action",
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      include: [
        {
          model: User,
          as: "owner",
          attributes: { exclude: ["password"] },
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      success: true,
      rows: restaurants.map((restaurant) => {
        const raw = toPlain(restaurant);
        return {
          id: restaurant.id,
          name: restaurant.name,
          owner: restaurant.ownerName || restaurant.owner?.name || "Not available",
          email: restaurant.restaurantEmail || restaurant.ownerEmail || restaurant.owner?.email || "",
          phone: restaurant.restaurantPhone || restaurant.ownerPhone || restaurant.owner?.phone || "",
          city: [restaurant.city, restaurant.state].filter(Boolean).join(", ") || "Not available",
          cuisine: Array.isArray(restaurant.cuisines) ? restaurant.cuisines.join(", ") : "",
          status: restaurantStatus(restaurant),
          documents: `${countUploadedDocuments(restaurant, restaurantDocumentKeys)}/${restaurantDocumentKeys.length}`,
          gstin: restaurant.gstNumber || "Not available",
          isOpen: Boolean(restaurant.isOpen),
          submitted: formatDateTime(restaurant.createdAt),
          raw: {
            ...raw,
            status: restaurantStatus(restaurant),
            submittedFormatted: formatDateTime(restaurant.createdAt),
          },
        };
      }),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRestaurantApproval = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found" });

    const action = String(req.body?.action || "").toLowerCase();
    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ success: false, message: "Action must be approve or reject" });
    }

    await restaurant.update({ isApproved: action === "approve", isOpen: action === "approve" });
    await writeAudit(req, `${titleCase(action)} restaurant`, "Restaurant", restaurant.id);

    return res.json({
      success: true,
      restaurant,
      message:
        action === "approve"
          ? "Restaurant approved successfully"
          : "Restaurant rejected successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const customers = await User.findAll({
      where: { role: "customer" },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Order,
          as: "orders",
          required: false,
          include: [
            { model: Restaurant, as: "restaurant", attributes: ["id", "name"], required: false },
            { model: DeliveryPartner, as: "deliveryPartner", attributes: ["id", "name", "phone"], required: false },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      success: true,
      rows: customers.map((customer) => {
        const raw = toPlain(customer);
        return {
          id: customer.id,
          name: customer.name,
          email: customer.email || "",
          phone: customer.phone,
          orders: customer.orders?.length || 0,
          spent: money((customer.orders || []).reduce((sum, order) => sum + Number(order.totalAmount || 0), 0)),
          status: customerStatus(customer),
          fraud: customer.isActive ? "None" : "Blocked account",
          joined: formatDateTime(customer.createdAt),
          raw: {
            ...raw,
            status: customerStatus(customer),
            fraud: customer.isActive ? "None" : "Blocked account",
            joinedFormatted: formatDateTime(customer.createdAt),
            totalSpent: money((customer.orders || []).reduce((sum, order) => sum + Number(order.totalAmount || 0), 0)),
          },
        };
      }),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCustomerStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user || user.role !== "customer") {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    const action = String(req.body?.action || "").toLowerCase();
    if (!["activate", "block"].includes(action)) {
      return res.status(400).json({ success: false, message: "Action must be activate or block" });
    }

    await user.update({ isActive: action === "activate" });
    await writeAudit(req, `${titleCase(action)} customer`, "User", user.id);

    return res.json({ success: true, user, message: `Customer ${action}d successfully` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDeliveryPartners = async (req, res) => {
  try {
    const partners = await DeliveryPartner.findAll({ order: [["createdAt", "DESC"]] });

    return res.json({
      success: true,
      rows: partners.map((partner) => {
        const raw = toPlain(partner);
        return {
          id: partner.id,
          name: partner.name,
          email: partner.email || "",
          phone: partner.phone,
          zone: partner.preferredZone || partner.city || "Not assigned",
          status: deliveryStatus(partner),
          docs: `${countUploadedDocuments(partner, deliveryDocumentKeys)}/${deliveryDocumentKeys.length}`,
          earnings: money(0),
          rating: Number(partner.rating || 0).toFixed(1),
          vehicle: partner.vehicleType || "bike",
          available: Boolean(partner.isAvailable),
          raw: {
            ...raw,
            status: deliveryStatus(partner),
            documents: `${countUploadedDocuments(partner, deliveryDocumentKeys)}/${deliveryDocumentKeys.length}`,
            earnings: money(0),
          },
        };
      }),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDeliveryPartnerVerification = async (req, res) => {
  try {
    const partner = await DeliveryPartner.findByPk(req.params.id);
    if (!partner) return res.status(404).json({ success: false, message: "Delivery partner not found" });

    const action = String(req.body?.action || "").toLowerCase();
    if (!["approve", "reject", "suspend", "activate"].includes(action)) {
      return res.status(400).json({ success: false, message: "Invalid delivery partner action" });
    }

    const updates = {};
    if (action === "approve") Object.assign(updates, { isVerified: true, kycStatus: "approved", isActive: true });
    if (action === "reject") Object.assign(updates, { isVerified: false, kycStatus: "rejected" });
    if (action === "suspend") Object.assign(updates, { isActive: false });
    if (action === "activate") Object.assign(updates, { isActive: true });

    await partner.update(updates);
    await writeAudit(req, `${titleCase(action)} delivery partner`, "DeliveryPartner", partner.id);

    return res.json({ success: true, partner, message: "Delivery partner updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: "user", attributes: ["id", "name", "phone"], required: false },
        { model: Restaurant, as: "restaurant", attributes: ["id", "name"], required: false },
        { model: DeliveryPartner, as: "deliveryPartner", attributes: ["id", "name"], required: false },
      ],
      order: [["createdAt", "DESC"]],
      limit: Number(req.query.limit) || 200,
    });

    return res.json({
      success: true,
      rows: orders.map((order) => ({
        id: `ORD-${order.id}`,
        orderId: order.id,
        customer: order.user?.name || "Guest",
        restaurant: order.restaurant?.name || "Not available",
        status: titleCase(order.status),
        amount: money(order.totalAmount),
        payment: titleCase(order.paymentStatus),
        partner: order.deliveryPartner?.name || "Not assigned",
        placedAt: formatDateTime(order.createdAt),
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [["createdAt", "DESC"]], limit: 200 });

    return res.json({
      success: true,
      rows: orders.map((order) => ({
        id: `PAY-${order.id}`,
        order: `ORD-${order.id}`,
        method: order.paymentStatus === "cod" ? "COD" : "Online",
        amount: money(order.totalAmount),
        status: ["paid", "completed", "success"].includes(order.paymentStatus) ? "Approved" : "Pending",
        settlement: titleCase(order.paymentStatus),
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPayouts = async (req, res) => {
  try {
    const earnings = await Earning.findAll({
      include: [{ model: Order, as: "order", include: [{ model: Restaurant, as: "restaurant" }], required: false }],
      order: [["createdAt", "DESC"]],
      limit: 200,
    });

    return res.json({
      success: true,
      rows: earnings.map((earning) => ({
        id: earning.id,
        account: earning.order?.restaurant?.name || `Order #${earning.orderId || earning.id}`,
        type: "Restaurant",
        schedule: "Weekly",
        pending: money(earning.restaurantEarning),
        commission: money(earning.platformCommission),
        delivery: money(earning.deliveryEarning),
        status: "Pending",
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEarnings = async (req, res) => {
  try {
    const [orders, earnings, restaurants] = await Promise.all([
      Order.findAll({
        include: [
          { model: Restaurant, as: "restaurant", attributes: ["id", "name"], required: false },
        ],
        order: [["createdAt", "DESC"]],
        limit: 200,
      }),
      Earning.findAll({ order: [["createdAt", "DESC"]], limit: 200 }),
      Restaurant.findAll({ order: [["createdAt", "DESC"]], limit: 10 }),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    const platformFee = earnings.reduce((sum, earning) => sum + Number(earning.platformCommission || 0), 0);
    const vendorPayout = earnings.reduce((sum, earning) => sum + Number(earning.restaurantEarning || 0), 0);
    const deliveryPartnerPayout = earnings.reduce((sum, earning) => sum + Number(earning.deliveryEarning || 0), 0);

    return res.json({
      success: true,
      summary: {
        totalRevenue,
        platformFee,
        vendorPayout,
        deliveryPartnerPayout,
        netProfit: platformFee,
      },
      rows: orders.map((order) => ({
        id: `TXN-${order.id}`,
        date: formatDateTime(order.createdAt),
        description: `Order revenue${order.restaurant?.name ? ` - ${order.restaurant.name}` : ""}`,
        amount: money(order.totalAmount),
        type: ["success", "paid", "completed"].includes(order.paymentStatus) ? "credit" : "pending",
        status: titleCase(order.paymentStatus),
        category: "order",
      })),
      topVendors: restaurants.map((restaurant) => {
        const restaurantOrders = orders.filter((order) => order.restaurantId === restaurant.id);
        const revenue = restaurantOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

        return {
          name: restaurant.name,
          revenue,
          commission: revenue * 0.1,
          orders: restaurantOrders.length,
        };
      }),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGst = async (req, res) => {
  try {
    const [restaurants, orders] = await Promise.all([
      Restaurant.findAll({ order: [["createdAt", "DESC"]] }),
      Order.findAll({ order: [["createdAt", "DESC"]], limit: 500 }),
    ]);

    const paidStatuses = new Set(["success", "paid", "completed"]);
    const now = new Date();
    const isToday = (date) => {
      const value = new Date(date);
      return (
        value.getFullYear() === now.getFullYear() &&
        value.getMonth() === now.getMonth() &&
        value.getDate() === now.getDate()
      );
    };
    const isThisMonth = (date) => {
      const value = new Date(date);
      return value.getFullYear() === now.getFullYear() && value.getMonth() === now.getMonth();
    };
    const gstForOrder = (order) => Number(order.originalAmount || order.totalAmount || 0) * 0.05;
    const paidOrders = orders.filter((order) => paidStatuses.has(order.paymentStatus));
    const totalGstCollected = paidOrders.reduce((sum, order) => sum + gstForOrder(order), 0);
    const gstCollectedToday = paidOrders
      .filter((order) => isToday(order.createdAt))
      .reduce((sum, order) => sum + gstForOrder(order), 0);
    const gstCollectedThisMonth = paidOrders
      .filter((order) => isThisMonth(order.createdAt))
      .reduce((sum, order) => sum + gstForOrder(order), 0);

    return res.json({
      success: true,
      summary: {
        totalGstCollected: money(totalGstCollected),
        gstCollectedToday: money(gstCollectedToday),
        gstCollectedThisMonth: money(gstCollectedThisMonth),
        gstPendingSettlement: money(gstCollectedThisMonth),
      },
      rows: restaurants.map((restaurant) => ({
        id: restaurant.id,
        restaurant: restaurant.name,
        gstin: restaurant.gstNumber || "Not submitted",
        gstEnabled: restaurant.gstNumber ? "Yes" : "No",
        gst: "5%",
        gstType: "Exclusive",
        taxCategory: restaurant.foodType || "Food",
        status: restaurant.gstNumber ? "Verified" : "Pending",
        monthlyTax: money(
          paidOrders
            .filter((order) => order.restaurantId === restaurant.id && isThisMonth(order.createdAt))
            .reduce((sum, order) => sum + gstForOrder(order), 0)
        ),
        pendingSettlement: money(
          paidOrders
            .filter((order) => order.restaurantId === restaurant.id && isThisMonth(order.createdAt))
            .reduce((sum, order) => sum + gstForOrder(order), 0)
        ),
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: User, as: "user", attributes: ["id", "name"], required: false },
        { model: Restaurant, as: "restaurant", attributes: ["id", "name"], required: false },
      ],
      order: [["createdAt", "DESC"]],
      limit: 200,
    });

    return res.json({
      success: true,
      rows: reviews.map((review) => ({
        id: `REV-${review.id}`,
        reviewId: review.id,
        restaurant: review.restaurant?.name || "Not available",
        customer: review.user?.name || "Customer",
        rating: String(review.rating),
        issue: Number(review.rating) <= 2 ? "Low rating" : "None",
        status: Number(review.rating) <= 2 ? "Under Review" : "Approved",
        comment: review.comment || "",
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPromotions = async (req, res) => {
  try {
    const offers = await Offer.findAll({ order: [["createdAt", "DESC"]] });

    return res.json({
      success: true,
      rows: offers.map((offer) => ({
        id: offer.id,
        name: offer.title,
        type: "Coupon",
        audience: "Customers",
        code: offer.couponCode,
        discount: `${offer.discountPercent}%`,
        budget: money(Number(offer.maxDiscount || 0) * Number(offer.usageLimit || 0)),
        status: offer.isActive ? "Active" : "Draft",
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.findAll({ order: [["createdAt", "DESC"]], limit: 300 });

    return res.json({
      success: true,
      rows: logs.map((log) => ({
        id: log.id,
        action: log.action,
        user: `${log.entity || "Entity"} #${log.entityId || "-"}`,
        admin: log.performedBy || "Main Admin",
        time: formatDateTime(log.createdAt),
        reason: log.entity || "Admin action",
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const [restaurants, customers, partners, orders, revenue, fraudWatch] = await Promise.all([
      Restaurant.count(),
      User.count({ where: { role: "customer" } }),
      DeliveryPartner.count(),
      Order.count(),
      Order.sum("totalAmount"),
      User.count({ where: { isActive: false } }),
    ]);

    return res.json({
      success: true,
      rows: [
        { title: "Restaurant Reports", scope: `${restaurants} accounts`, frequency: "Daily / Monthly", status: "Approved" },
        { title: "Customer Reports", scope: `${customers} customers`, frequency: "Daily / Monthly", status: "Approved" },
        { title: "Delivery Reports", scope: `${partners} partners`, frequency: "Daily / Monthly", status: "Approved" },
        { title: "Revenue Reports", scope: money(revenue), frequency: "Daily / Monthly", status: "Approved" },
        { title: "GST Reports", scope: `${restaurants} GST profiles`, frequency: "Monthly / Quarterly", status: "Approved" },
        { title: "Fraud Reports", scope: `${fraudWatch} watched accounts`, frequency: "Daily / Monthly", status: "Approved" },
      ],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSubAdmins = async (req, res) => {
  try {
    const admins = await User.findAll({ where: { role: "admin" }, order: [["createdAt", "DESC"]] });

    return res.json({
      success: true,
      rows: admins.map((admin) => ({
        id: admin.id,
        name: admin.name,
        email: admin.email || "",
        role: "Admin",
        permissions: "Platform",
        status: admin.isActive ? "Active" : "Suspended",
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStaticModule = async (req, res) => {
  const modules = {
    fraud: [
      { caseId: "FRD-USERS", type: "Blocked Account", subject: "Inactive customers", severity: "High", action: "Review account history" },
      { caseId: "FRD-REVIEWS", type: "Low Reviews", subject: "Ratings under 2", severity: "Medium", action: "Moderate review content" },
    ],
    support: [
      { id: "TKT-LIVE", from: "Platform", subject: "Use support ticket table when enabled", status: "Open", priority: "Medium" },
    ],
    notifications: [
      { title: "Restaurant approvals due", channel: "Push", audience: "Admins", status: "Sent" },
      { title: "Document re-upload reminder", channel: "Email", audience: "Restaurants", status: "Draft" },
    ],
    "service-zones": [
      { zone: "Default Zone", pincodes: "All configured pincodes", partners: 0, status: "Active" },
    ],
    settings: [
      { title: "Platform Commission", value: "Configured in commission service" },
      { title: "Delivery Charges", value: "Configured by order distance slabs" },
      { title: "Payment Gateway", value: "Online and COD statuses tracked" },
    ],
  };

  return res.json({ success: true, rows: modules[req.params.module] || [] });
};

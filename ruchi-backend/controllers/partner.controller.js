const { Restaurant, Order, OrderItem, Dish, User, Earning, Payout } = require("../models");
const { Op } = require("sequelize");

exports.getPartnerDashboard = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      where: { ownerId: req.user.id },
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant profile not found. Please complete registration.",
      });
    }

    if (!restaurant.isApproved) {
      return res.status(403).json({
        success: false,
        code: "RESTAURANT_UNDER_REVIEW",
        message: "Your account is under review. Please wait for admin approval.",
      });
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Fetch Orders for this restaurant
    const allOrders = await Order.findAll({
      where: { restaurantId: restaurant.id },
      include: [
        { model: User, as: "user", attributes: ["id", "name", "phone", "email"] },
        {
          model: OrderItem,
          as: "orderItems",
          include: [{ model: Dish, as: "dish" }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const totalOrdersCount = allOrders.length;
    let todaysOrders = 0;
    let todaysGrossSales = 0;
    let todaysEarnings = 0;
    let todaysCommission = 0;
    let pendingOrders = 0;
    let completedOrders = 0;
    let cancelledOrders = 0;

    const orderStatusBreakdown = {
      pending: 0,
      confirmed: 0,
      preparing: 0,
      ready: 0,
      on_the_way: 0,
      delivered: 0,
      cancelled: 0,
    };

    const monthlyRevenue = Array(12).fill(0);
    const weeklyData = [
      { day: "Sun", revenue: 0, orders: 0 },
      { day: "Mon", revenue: 0, orders: 0 },
      { day: "Tue", revenue: 0, orders: 0 },
      { day: "Wed", revenue: 0, orders: 0 },
      { day: "Thu", revenue: 0, orders: 0 },
      { day: "Fri", revenue: 0, orders: 0 },
      { day: "Sat", revenue: 0, orders: 0 },
    ];

    const dishSalesMap = new Map();

    for (const order of allOrders) {
      const orderDate = new Date(order.createdAt);
      const isToday = orderDate >= startOfToday;
      const isThisMonth = orderDate >= startOfMonth;
      const isThisWeek = orderDate >= startOfWeek;
      const statusLower = String(order.status || "pending").toLowerCase();

      // Financials (98% net restaurant, 2% platform commission)
      const subtotal = Number(order.subtotal || order.originalAmount || 0);
      const commission = Number(order.platformCommission ?? (subtotal * 0.02));
      const restDiscount = Number(order.restaurantFundedDiscount || 0);
      const netEarning = Number(order.restaurantEarning ?? Math.max(0, subtotal - commission - restDiscount));

      // Status counters
      if (statusLower === "delivered") {
        completedOrders++;
        orderStatusBreakdown.delivered++;
      } else if (statusLower === "cancelled") {
        cancelledOrders++;
        orderStatusBreakdown.cancelled++;
      } else {
        pendingOrders++;
        if (statusLower === "preparing") orderStatusBreakdown.preparing++;
        else if (statusLower === "ready") orderStatusBreakdown.ready++;
        else if (statusLower === "confirmed") orderStatusBreakdown.confirmed++;
        else if (statusLower.includes("way") || statusLower.includes("out")) orderStatusBreakdown.on_the_way++;
        else orderStatusBreakdown.pending++;
      }

      if (statusLower !== "cancelled") {
        if (isToday) {
          todaysOrders++;
          todaysGrossSales += subtotal;
          todaysEarnings += netEarning;
          todaysCommission += commission;
        }

        if (isThisMonth) {
          const m = orderDate.getMonth();
          monthlyRevenue[m] += netEarning;
        }

        if (isThisWeek) {
          const d = orderDate.getDay();
          weeklyData[d].revenue += netEarning;
          weeklyData[d].orders += 1;
        }

        // Popular items tracking
        if (Array.isArray(order.orderItems)) {
          for (const item of order.orderItems) {
            const dishName = item.dish?.name || `Dish #${item.dishId}`;
            const qty = Number(item.quantity || 1);
            const price = Number(item.price || item.dish?.price || 0);
            const current = dishSalesMap.get(dishName) || { name: dishName, sales: 0, revenue: 0, category: item.dish?.category || "General" };
            current.sales += qty;
            current.revenue += qty * price;
            dishSalesMap.set(dishName, current);
          }
        }
      }
    }

    const popularItems = Array.from(dishSalesMap.values())
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // 2. Fetch Earnings & Payout records
    const earnings = await Earning.findAll({
      where: { restaurantId: restaurant.id },
      order: [["createdAt", "DESC"]],
    });

    const payouts = await Payout.findAll({
      where: { restaurantId: restaurant.id },
      order: [["createdAt", "DESC"]],
    });

    let totalGrossSales = 0;
    let totalPlatformCommission = 0;
    let totalNetEarnings = 0;
    let availableBalance = 0;
    let pendingSettlement = 0;
    let totalPaidOut = 0;

    for (const earning of earnings) {
      if (earning.status !== "cancelled" && earning.status !== "reversed") {
        totalGrossSales += Number(earning.grossFoodSales || 0);
        totalPlatformCommission += Number(earning.platformCommission || 0);
        totalNetEarnings += Number(earning.restaurantEarning || 0);

        if (earning.status === "accrued") {
          availableBalance += Number(earning.restaurantEarning || 0);
        }
      }
    }

    for (const payout of payouts) {
      if (payout.status === "paid") {
        totalPaidOut += Number(payout.approvedAmount || payout.amount || 0);
      } else if (["pending", "approved", "processing"].includes(payout.status)) {
        pendingSettlement += Number(payout.amount || 0);
      }
    }

    const adjustedAvailableBalance = Math.max(0, Math.round((availableBalance - pendingSettlement) * 100) / 100);

    // Recent orders formatted for dashboard table
    const recentOrders = allOrders.slice(0, 10).map((ord) => {
      const subtotal = Number(ord.subtotal || ord.originalAmount || 0);
      const commission = Number(ord.platformCommission ?? (subtotal * 0.02));
      const restDiscount = Number(ord.restaurantFundedDiscount || 0);
      const netEarning = Number(ord.restaurantEarning ?? Math.max(0, subtotal - commission - restDiscount));

      return {
        id: `ORD-${ord.id}`,
        rawId: ord.id,
        orderNumber: `ORD-${ord.id}`,
        customer: ord.user?.name || "Customer",
        customerPhone: ord.user?.phone || "N/A",
        deliveryAddress: ord.deliveryAddress || "Adilabad, TG",
        items: ord.orderItems?.length || 0,
        itemsDetail: ord.orderItems?.map(i => `${i.quantity}x ${i.dish?.name || 'Item'}`).join(", ") || "",
        grossFoodSales: Math.round(subtotal * 100) / 100,
        subtotal: Math.round(subtotal * 100) / 100,
        platformCommission: Math.round(commission * 100) / 100,
        netRestaurantEarning: Math.round(netEarning * 100) / 100,
        totalAmount: Number(ord.totalAmount || 0),
        deliveryFee: Number(ord.deliveryFee || 0),
        status: ord.status || "pending",
        paymentStatus: ord.paymentStatus || "pending",
        time: new Date(ord.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: ord.createdAt,
      };
    });

    const recentPayouts = payouts.slice(0, 5).map(p => ({
      id: p.id,
      payoutNumber: p.payoutNumber,
      amount: p.amount,
      approvedAmount: p.approvedAmount,
      status: p.status,
      utrNumber: p.utrNumber || "Awaiting UTR",
      createdAt: p.createdAt,
    }));

    return res.status(200).json({
      success: true,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        phone: restaurant.phone,
        cuisineType: restaurant.cuisineType,
        rating: restaurant.rating || 4.8,
        commissionRate: restaurant.commissionRate || 2,
        isOpen: restaurant.isOpen,
        isApproved: restaurant.isApproved,
      },
      orders: totalOrdersCount,
      stats: {
        todaysOrders,
        todaysGrossSales: Math.round(todaysGrossSales * 100) / 100,
        todaysEarnings: Math.round(todaysEarnings * 100) / 100,
        todaysCommission: Math.round(todaysCommission * 100) / 100,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        totalOrders: totalOrdersCount,
        grossFoodSales: Math.round(totalGrossSales * 100) / 100,
        totalCommission: Math.round(totalPlatformCommission * 100) / 100,
        netEarnings: Math.round(totalNetEarnings * 100) / 100,
        availableBalance: adjustedAvailableBalance,
        pendingSettlement: Math.round(pendingSettlement * 100) / 100,
        totalPaidOut: Math.round(totalPaidOut * 100) / 100,
        customerRating: restaurant.rating || 4.8,
      },
      orderStatusBreakdown,
      weeklyData,
      monthlyRevenueData: monthlyRevenue.map(v => Math.round(v * 100) / 100),
      popularItems,
      recentOrders,
      recentPayouts,
    });
  } catch (error) {
    console.error("GET PARTNER DASHBOARD ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

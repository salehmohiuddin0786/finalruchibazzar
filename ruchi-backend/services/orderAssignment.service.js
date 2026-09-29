const { DeliveryPartner, Order } = require("../models");

exports.assignDeliveryPartner = async (orderId) => {
  try {
    const partner = await DeliveryPartner.findOne({
      where: { isAvailable: true },
    });

    if (!partner) {
      throw new Error("No delivery partner available");
    }

    await Order.update(
      {
        deliveryPartnerId: partner.id,
      },
      { where: { id: orderId } }
    );

    await partner.update({ isAvailable: false });

    return partner;
  } catch (error) {
    throw new Error("Order assignment failed: " + error.message);
  }
};
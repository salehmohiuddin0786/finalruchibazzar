exports.validateOrderAssignmentParam = (req, res, next) => {
  const orderId = Number(req.params.id);

  if (!orderId || Number.isNaN(orderId)) {
    return res.status(400).json({
      success: false,
      message: "Valid order ID is required",
    });
  }

  req.params.id = orderId;
  return next();
};

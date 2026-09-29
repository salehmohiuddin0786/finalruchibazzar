const { Review } = require("../models");

exports.createReview = async (req, res) => {
  const review = await Review.create({
    ...req.body,
    userId: req.user.id,
  });
  res.status(201).json(review);
};
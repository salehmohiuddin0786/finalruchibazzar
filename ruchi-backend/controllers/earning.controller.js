const { Earning } = require("../models");

exports.getEarnings = async (req, res) => {
  const earnings = await Earning.findAll();
  res.json(earnings);
};
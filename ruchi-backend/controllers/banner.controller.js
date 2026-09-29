const { Banner } = require("../models");

exports.createBanner = async (req, res) => {
  const banner = await Banner.create(req.body);
  res.status(201).json(banner);
};

exports.getBanners = async (req, res) => {
  const banners = await Banner.findAll({ where: { isActive: true } });
  res.json(banners);
};
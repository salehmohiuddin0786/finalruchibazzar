const { Dish, Restaurant } = require("../models");

// ==================================================
// CREATE DISH
// ==================================================
const createDish = async (req, res) => {
  try {
    let { name, description, price, restaurantId } = req.body;

    name = name ? name.trim() : "";
    description = description ? description.trim() : "";

    price = Number(price);
    restaurantId = Number(restaurantId);

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Dish name is required"
      });
    }

    if (!price || isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid price is required"
      });
    }

    if (!restaurantId || isNaN(restaurantId)) {
      return res.status(400).json({
        success: false,
        message: "Valid restaurantId is required"
      });
    }

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    const dish = await Dish.create({
      name,
      description: description || null,
      price,
      restaurantId,
      image: req.file ? req.file.filename : null
    });

    return res.status(201).json({
      success: true,
      message: "Dish created successfully",
      data: dish
    });

  } catch (error) {
    console.error("CREATE DISH ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating dish",
      error: error.message
    });
  }
};


// ==================================================
// GET ALL DISHES (FIXED)
// ==================================================
const getAllDishes = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    if (page < 1) page = 1;
    if (limit < 1 || limit > 100) limit = 10;

    const offset = (page - 1) * limit;

    const { count, rows } = await Dish.findAndCountAll({
      include: [
        {
          model: Restaurant,
          as: "restaurant",   // 🔥 THIS IS THE FIX
          attributes: ["id", "name"]
        }
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset
    });

    return res.status(200).json({
      success: true,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      data: rows
    });

  } catch (error) {
    console.error("GET ALL DISHES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching dishes",
      error: error.message
    });
  }
};


// ==================================================
// GET DISHES BY RESTAURANT
// ==================================================
const getDishesByRestaurant = async (req, res) => {
  try {
    const restaurantId = Number(req.params.restaurantId);

    if (!restaurantId || isNaN(restaurantId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurantId"
      });
    }

    const dishes = await Dish.findAll({
      where: { restaurantId },
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json({
      success: true,
      count: dishes.length,
      data: dishes
    });

  } catch (error) {
    console.error("GET DISHES BY RESTAURANT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching restaurant dishes",
      error: error.message
    });
  }
};


// ==================================================
// UPDATE DISH
// ==================================================
const updateDish = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const dish = await Dish.findByPk(id);

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: "Dish not found"
      });
    }

    const updates = {};

    if (req.body.name) updates.name = req.body.name.trim();
    if (req.body.description !== undefined)
      updates.description = req.body.description.trim();

    if (req.body.price !== undefined) {
      const parsedPrice = Number(req.body.price);
      if (!isNaN(parsedPrice) && parsedPrice > 0) {
        updates.price = parsedPrice;
      }
    }

    if (req.file) {
      updates.image = req.file.filename;
    }

    await dish.update(updates);

    return res.status(200).json({
      success: true,
      message: "Dish updated successfully",
      data: dish
    });

  } catch (error) {
    console.error("UPDATE DISH ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating dish",
      error: error.message
    });
  }
};


// ==================================================
// DELETE DISH
// ==================================================
const deleteDish = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const dish = await Dish.findByPk(id);

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: "Dish not found"
      });
    }

    await dish.destroy();

    return res.status(200).json({
      success: true,
      message: "Dish deleted successfully"
    });

  } catch (error) {
    console.error("DELETE DISH ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting dish",
      error: error.message
    });
  }
};

module.exports = {
  createDish,
  getAllDishes,
  getDishesByRestaurant,
  updateDish,
  deleteDish
};
const db = require("../models");

const Cart = db.Cart;
const Dish = db.Dish;

/*
|--------------------------------------------------------------------------
| ADD TO CART
|--------------------------------------------------------------------------
*/
exports.addToCart = async (req, res) => {
  try {
    const { cartId, dishId, quantity } = req.body;

    if (!cartId || !dishId) {
      return res.status(400).json({
        success: false,
        message: "cartId and dishId are required",
      });
    }

    const qty = Number(quantity) || 1;

    if (qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const dish = await Dish.findByPk(dishId);

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: "Dish not found",
      });
    }

    let item = await Cart.findOne({
      where: { cartId, dishId },
    });

    if (item) {
      item.quantity += qty;
      await item.save();
    } else {
      item = await Cart.create({
        cartId,
        dishId,
        quantity: qty,
      });
    }

    const fullItem = await Cart.findByPk(item.id, {
      include: [
        {
          model: Dish,
          as: "dish",
          attributes: ["id", "name", "description", "price", "image", "restaurantId"],
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Item added to cart",
      item: fullItem,
    });

  } catch (err) {
    console.error("ADD CART ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET CART
|--------------------------------------------------------------------------
*/
exports.getCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    if (!cartId || cartId === "saved-items") {
      return res.status(400).json({
        success: false,
        message: "Valid cartId is required",
        items: [],
      });
    }

    const items = await Cart.findAll({
      where: { cartId },
      include: [
        {
          model: Dish,
          as: "dish",
          attributes: ["id", "name", "description", "price", "image", "restaurantId"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      items,
    });

  } catch (err) {
    console.error("GET CART ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
      items: [],
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE CART QUANTITY
|--------------------------------------------------------------------------
*/
exports.updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const quantity = Number(req.body.quantity);

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const item = await Cart.findByPk(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    item.quantity = quantity;
    await item.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      item,
    });

  } catch (err) {
    console.error("UPDATE CART ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| DELETE CART ITEM
|--------------------------------------------------------------------------
*/
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Cart.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item removed",
    });

  } catch (err) {
    console.error("DELETE CART ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| SAVED ITEMS TEMP FIX
|--------------------------------------------------------------------------
*/
exports.getSavedItems = async (req, res) => {
  return res.status(200).json({
    success: true,
    items: [],
  });
};

exports.saveForLater = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Save for later not implemented yet",
  });
};

exports.moveToCart = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Move to cart not implemented yet",
  });
};
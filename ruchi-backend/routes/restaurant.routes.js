const express = require("express");
const router = express.Router();

const restaurantController = require("../controllers/restaurant.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

/*
|--------------------------------------------------------------------------
| CREATE RESTAURANT
|--------------------------------------------------------------------------
*/
router.post(
  "/",
  protect,
  authorize("partner", "admin"),
  restaurantController.uploadRestaurantFiles,
  restaurantController.createRestaurant
);

/*
|--------------------------------------------------------------------------
| GET ALL RESTAURANTS
|--------------------------------------------------------------------------
*/
router.get("/", restaurantController.getAllRestaurants);

/*
|--------------------------------------------------------------------------
| GET NEARBY RESTAURANTS
|--------------------------------------------------------------------------
*/
router.get("/nearby", restaurantController.getNearbyRestaurants);

/*
|--------------------------------------------------------------------------
| GET LOGGED-IN PARTNER RESTAURANT
|--------------------------------------------------------------------------
*/
router.get(
  "/my-restaurant",
  protect,
  authorize("partner", "admin"),
  restaurantController.getMyRestaurant
);

/*
|--------------------------------------------------------------------------
| UPDATE LOGGED-IN PARTNER RESTAURANT PROFILE
| Frontend: PUT /api/restaurant/profile
|--------------------------------------------------------------------------
*/
router.put(
  "/profile",
  protect,
  authorize("partner", "admin"),
  restaurantController.uploadRestaurantFiles,
  restaurantController.updateMyRestaurantProfile
);

/*
|--------------------------------------------------------------------------
| GET RESTAURANT BY ID
| Keep this AFTER fixed routes like /profile and /my-restaurant
|--------------------------------------------------------------------------
*/
router.get("/:id", restaurantController.getRestaurantById);

/*
|--------------------------------------------------------------------------
| UPDATE RESTAURANT BY ID
|--------------------------------------------------------------------------
*/
router.put(
  "/:id/approval",
  protect,
  authorize("admin"),
  restaurantController.updateRestaurantApproval
);

/*
|--------------------------------------------------------------------------
| APPROVE OR REJECT RESTAURANT
|--------------------------------------------------------------------------
*/
router.put(
  "/:id",
  protect,
  authorize("partner", "admin"),
  restaurantController.uploadRestaurantFiles,
  restaurantController.updateRestaurant
);

/*
|--------------------------------------------------------------------------
| DELETE RESTAURANT
|--------------------------------------------------------------------------
*/
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  restaurantController.deleteRestaurant
);

module.exports = router;

-- ==============================================================================
-- RUCHI BAZAAR - PRODUCTION DATABASE SEED SCRIPT
-- Populates: Users, UserAddresses, Restaurants, Dishes, Offers, Banners,
--            DeliveryPartners, Orders, OrderItems, Earnings, Reviews
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- 1. USERS
-- Default passwords:
-- Admin:    Admin@1234
-- Partner:  Partner@1234
-- Delivery: Delivery@1234
-- Customer: Customer@1234
-- ------------------------------------------------------------------------------
INSERT INTO `Users` (`id`, `name`, `email`, `phone`, `password`, `role`, `isActive`, `isVerified`, `authProvider`, `vehicleType`, `isAvailable`, `currentLat`, `currentLng`, `rating`, `totalDeliveries`, `createdAt`, `updatedAt`)
VALUES
(1, 'Ruchi Admin', 'admin@ruchibazaar.in', '+919876543210', '$2b$10$uie2R9/dGFGI1HTx8uhG/.BktgtfcBebNbAEAuYRCRtGAu4B1F8PC', 'admin', 1, 1, 'password', NULL, 0, NULL, NULL, 5.0, 0, NOW(), NOW()),
(2, 'Chef Saleem (Restaurant Partner)', 'partner@ruchibazaar.in', '+919876543211', '$2b$10$uHmOyBQYi7UDLzP2H/Rr6.PnJup.KAWBvliZA.TgI006KSB3X2AyC', 'partner', 1, 1, 'password', NULL, 0, NULL, NULL, 5.0, 0, NOW(), NOW()),
(3, 'Raju Kumar (Delivery Hero)', 'delivery@ruchibazaar.in', '+919876543212', '$2b$10$M3wLA2X4FmClPzmHZUHpU.wMxnN8/J586F4m/2RW/4kfE7V8ToZRq', 'delivery', 1, 1, 'password', 'bike', 1, 19.6641, 78.5320, 4.9, 124, NOW(), NOW()),
(4, 'Sneha Reddy (Customer)', 'customer@ruchibazaar.in', '+919876543213', '$2b$10$iqeqcrUaz8d0Ov2TCRWhn.YeKaTJVDbZZgb2iVhXkM0c8sYAilIIa', 'customer', 1, 1, 'password', NULL, 0, NULL, NULL, 5.0, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE
`password` = VALUES(`password`),
`role` = VALUES(`role`),
`isActive` = VALUES(`isActive`),
`isVerified` = VALUES(`isVerified`),
`updatedAt` = NOW();

-- ------------------------------------------------------------------------------
-- 2. USER ADDRESSES
-- ------------------------------------------------------------------------------
INSERT INTO `UserAddresses` (`id`, `userId`, `type`, `street`, `city`, `state`, `zipCode`, `landmark`, `phone`, `contactName`, `latitude`, `longitude`, `isDefault`, `createdAt`, `updatedAt`)
VALUES
(1, 4, 'home', 'Flat 402, Sai Residency, Shanti Nagar', 'Adilabad', 'Telangana', '504001', 'Near Collectorate Complex', '+919876543213', 'Sneha Reddy', 19.6641, 78.5320, 1, NOW(), NOW()),
(2, 4, 'work', 'Unit 301, Tech Park, Gachibowli', 'Hyderabad', 'Telangana', '500032', 'Opposite Cyber Gateway', '+919876543213', 'Sneha Reddy', 17.4400, 78.3489, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updatedAt` = NOW();

-- ------------------------------------------------------------------------------
-- 3. RESTAURANTS
-- ------------------------------------------------------------------------------
INSERT INTO `Restaurants` (`id`, `ownerId`, `name`, `ownerName`, `ownerPhone`, `ownerEmail`, `restaurantPhone`, `restaurantEmail`, `address`, `landmark`, `pincode`, `city`, `state`, `latitude`, `longitude`, `logo`, `coverImage`, `cuisines`, `foodType`, `preparationTime`, `minimumOrderValue`, `deliveryRadius`, `openingTime`, `closingTime`, `dineIn`, `takeaway`, `isPhoneVerified`, `isApproved`, `isOpen`, `aboutRestaurant`, `outletPhotos`, `createdAt`, `updatedAt`)
VALUES
(1, 2, 'Paradise Biryani House', 'Saleem Ahmed', '+919876543211', 'paradise@ruchibazaar.in', '+919876543211', 'orders@paradisebiryani.com', 'Plot 42, Main Road, Near Clock Tower', 'Clock Tower', '504001', 'Adilabad', 'Telangana', 19.6641, 78.5320, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&auto=format&fit=crop&q=80', '[\"Biryani\",\"Hyderabadi\",\"Mughlai\",\"North Indian\"]', 'Non-Veg', 25, 149.00, 12.00, '11:00 AM', '11:30 PM', 1, 1, 1, 1, 1, 'Famous for slow-cooked authentic Hyderabadi Dum Biryani with aromatic spices and tender cuts.', '[\"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80\",\"https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=80\"]', NOW(), NOW()),

(2, 2, 'Pizza Corner & Italian Bistro', 'Marco Rossi', '+919876543214', 'pizzacorner@ruchibazaar.in', '+919876543214', 'hello@pizzacorner.in', 'Shop 14, Commercial Center, Hitec City', 'Next to Tech Park', '500081', 'Hyderabad', 'Telangana', 17.4485, 78.3742, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1200&auto=format&fit=crop&q=80', '[\"Pizza\",\"Italian\",\"Fast Food\",\"Pasta\"]', 'Veg/Non-Veg', 20, 199.00, 10.00, '11:30 AM', '11:00 PM', 1, 1, 1, 1, 1, 'Hand-tossed artisan wood-fired pizzas, gourmet pastas, and crunchy garlic breads.', '[\"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80\",\"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=80\"]', NOW(), NOW()),

(3, 2, 'Punjabi Dhaba & Pure Veg Rasoi', 'Harpreet Singh', '+919876543215', 'punjabirasoi@ruchibazaar.in', '+919876543215', 'orders@punjabidhaba.in', 'Gandhi Chowk, Station Road', 'Opposite Railway Station', '504001', 'Adilabad', 'Telangana', 19.6698, 78.5365, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1200&auto=format&fit=crop&q=80', '[\"North Indian\",\"Punjabi\",\"Pure Veg\",\"Thali\"]', 'Pure Veg', 20, 99.00, 8.00, '10:00 AM', '10:30 PM', 1, 1, 1, 1, 1, 'Traditional Punjabi homestyle vegetarian food cooked with pure desi ghee and fresh paneer.', '[\"https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80\"]', NOW(), NOW()),

(4, 2, 'Dragon Wok Asian Kitchen', 'Lin Chen', '+919876543216', 'dragonwok@ruchibazaar.in', '+919876543216', 'contact@dragonwok.in', 'Road No 36, Jubilee Hills', 'Near Metro Pillar 12', '500033', 'Hyderabad', 'Telangana', 17.4319, 78.4073, 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&auto=format&fit=crop&q=80', '[\"Chinese\",\"Asian\",\"Momos\",\"Noodles\"]', 'Veg/Non-Veg', 20, 149.00, 10.00, '12:00 PM', '11:00 PM', 1, 1, 1, 1, 1, 'Spicy Schezwan wok bowls, steamed Himalayan momos, and crispy chilli delights.', '[\"https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&auto=format&fit=crop&q=80\"]', NOW(), NOW()),

(5, 2, 'Sweet Cravings & Cafe', 'Pooja Sharma', '+919876543217', 'sweetcravings@ruchibazaar.in', '+919876543217', 'desserts@sweetcravings.in', 'Near Municipal Park, Subhash Road', 'Municipal Park', '504001', 'Adilabad', 'Telangana', 19.6612, 78.5301, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&auto=format&fit=crop&q=80', '[\"Desserts\",\"Bakery\",\"Coffee\",\"Beverages\",\"Burger\"]', 'Pure Veg', 15, 99.00, 8.00, '09:00 AM', '11:00 PM', 1, 1, 1, 1, 1, 'Freshly baked pastries, Belgian waffles, creamy artisanal ice creams, and cold coffees.', '[\"https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80\"]', NOW(), NOW())
ON DUPLICATE KEY UPDATE
`isApproved` = 1,
`isOpen` = 1,
`cuisines` = VALUES(`cuisines`),
`logo` = VALUES(`logo`),
`coverImage` = VALUES(`coverImage`),
`outletPhotos` = VALUES(`outletPhotos`),
`updatedAt` = NOW();

-- ------------------------------------------------------------------------------
-- 4. DISHES
-- ------------------------------------------------------------------------------
INSERT INTO `Dishes` (`id`, `restaurantId`, `name`, `description`, `price`, `image`, `isAvailable`, `createdAt`, `updatedAt`)
VALUES
-- Restaurant 1: Paradise Biryani House
(1, 1, 'Hyderabadi Chicken Dum Biryani', 'Long grain Basmati rice dum-cooked with tender spiced chicken, saffron, and fried onions. Served with Mirchi ka Salan & Raita.', 279.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(2, 1, 'Special Mutton Dum Biryani', 'Juicy pieces of tender young goat meat cooked slowly on dum with fragrant basmati and rich shahi masala.', 369.00, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(3, 1, 'Tandoori Chicken Tikka (8 Pcs)', 'Boneless chicken cubes marinated in hung curd, Kashmiri red chilli, and roasted in clay tandoor.', 249.00, 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(4, 1, 'Paneer Butter Masala', 'Fresh cottage cheese cubes simmered in a creamy, velvety tomato and cashew gravy flavored with kasoori methi.', 219.00, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(5, 1, 'Butter Garlic Naan (2 Pcs)', 'Soft tandoor-baked leavened flatbread brushed generously with salted butter and roasted garlic.', 69.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(6, 1, 'Shahi Double Ka Meetha', 'Crispy fried bread slices soaked in saffron rabdi, condensed milk, and garnished with roasted pistachios & almonds.', 99.00, 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),

-- Restaurant 2: Pizza Corner & Italian Bistro
(7, 2, 'Classic Margherita Pizza', 'San Marzano tomato sauce, fresh mozzarella cheese, aromatic sweet basil leaves, and cold-pressed extra virgin olive oil.', 229.00, 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(8, 2, 'Farmhouse Supreme Pizza', 'Loaded with crispy bell peppers, black olives, sweet corn, mushrooms, red onions, and gooey mozzarella blend.', 329.00, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(9, 2, 'Spicy Peri-Peri Chicken Pizza', 'Tender grilled chicken chunks tossed in fiery African peri-peri spices, roasted paprika, and melted cheese.', 389.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(10, 2, 'Creamy Alfredo Penne Pasta', 'Al dente penne pasta tossed in rich parmesan cream sauce with garlic, herbs, and wild mushrooms.', 249.00, 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(11, 2, 'Cheesy Garlic Breadsticks', 'Golden-baked herb baguette topped with garlic butter and stretchy mozzarella. Served with cheesy jalapeno dip.', 139.00, 'https://images.unsplash.com/photo-1619895092538-128341789043?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(12, 2, 'Gooey Choco Lava Cake', 'Warm chocolate cake with a molten center of decadent hot dark chocolate fudge.', 99.00, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),

-- Restaurant 3: Punjabi Dhaba & Pure Veg Rasoi
(13, 3, 'Royal Maharaja Special Veg Thali', 'Complete deluxe thali: Dal Makhani, Paneer Tikka Masala, Mix Veg, Jeera Rice, 2 Butter Rotis, Gulab Jamun, Salad & Papad.', 199.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(14, 3, 'Slow-Cooked Dal Makhani', 'Black lentils simmered overnight on slow flame with butter, cream, and freshly ground secret spices.', 179.00, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(15, 3, 'Kadhai Paneer Dhaba Style', 'Cottage cheese cubes tossed with freshly pounded coriander seeds, dried red chillies, onions, and crunchy capsicum.', 219.00, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(16, 3, 'Amritsari Aloo Pyaaz Kulcha', 'Crispy flaky tandoor-baked bread stuffed with spiced mashed potatoes and onions. Served with chhole & butter.', 89.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(17, 3, 'Punjabi Sweet Malai Lassi', 'Thick, chilled churned curd flavored with cardamom and rose water, topped with a thick layer of malai.', 69.00, 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),

-- Restaurant 4: Dragon Wok Asian Kitchen
(18, 4, 'Steamed Chicken Darjeeling Momos (6 Pcs)', 'Authentic Himalayan dumplings filled with juicy minced chicken and scallions. Served with spicy tomato-garlic chutney.', 149.00, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(19, 4, 'Veg Hakka Noodles', 'Wok-tossed noodles with shredded cabbage, carrots, bell peppers, spring onions, and oriental sauces.', 159.00, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(20, 4, 'Chicken Schezwan Fried Rice', 'Wok-tossed basmati rice with diced chicken, scrambled egg, and fiery in-house Schezwan pepper sauce.', 209.00, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(21, 4, 'Crispy Chilli Chicken Dry', 'Crispy fried chicken chunks tossed with green chillies, onions, capsicum, soy sauce, and white pepper.', 229.00, 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),

-- Restaurant 5: Sweet Cravings & Cafe
(22, 5, 'Belgian Dark Chocolate Waffle', 'Freshly baked crispy waffle smothered in warm melted Belgian dark chocolate ganache and chocolate chips.', 159.00, 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(23, 5, 'Cold Brew Iced Coffee with Cream', 'Slow-steeped Arabica cold coffee served chilled over ice with a sweet cream swirl.', 119.00, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(24, 5, 'Crispy Veg Supreme Burger', 'Golden fried spiced vegetable patty with crisp iceberg lettuce, sliced tomatoes, gherkins, and tangy house mayo in sesame bun.', 129.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(25, 5, 'Red Velvet Cream Cheese Pastry', 'Layers of moist crimson sponge with velvety cream cheese frosting and white chocolate curls.', 99.00, 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(26, 5, 'Peri Peri French Fries (Crispy)', 'Golden fried potato fries shaken in zesty peri peri spice seasoning. Served with tomato ketchup.', 89.00, 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE
`price` = VALUES(`price`),
`description` = VALUES(`description`),
`image` = VALUES(`image`),
`isAvailable` = 1,
`updatedAt` = NOW();

-- ------------------------------------------------------------------------------
-- 5. OFFERS & COUPONS
-- ------------------------------------------------------------------------------
INSERT INTO `Offers` (`id`, `title`, `couponCode`, `discountPercent`, `minOrderAmount`, `maxDiscount`, `usageLimit`, `usedCount`, `validFrom`, `validTo`, `isActive`, `createdAt`, `updatedAt`)
VALUES
(1, 'Welcome 50% Off', 'WELCOME50', 50.00, 199.00, 150.00, 1000, 23, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 60 DAY), 1, NOW(), NOW()),
(2, 'Flat 20% Everyday Savings', 'RUCHI20', 20.00, 149.00, 100.00, 5000, 142, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 90 DAY), 1, NOW(), NOW()),
(3, 'Biryani Feast ₹100 Off', 'BIRYANI100', 25.00, 399.00, 100.00, 500, 45, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), 1, NOW(), NOW()),
(4, 'Weekend Special Discount', 'WEEKEND30', 30.00, 249.00, 120.00, 2000, 88, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 45 DAY), 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE
`discountPercent` = VALUES(`discountPercent`),
`isActive` = 1,
`updatedAt` = NOW();

-- ------------------------------------------------------------------------------
-- 6. BANNERS
-- ------------------------------------------------------------------------------
INSERT INTO `Banners` (`id`, `title`, `image`, `link`, `isActive`, `createdAt`, `updatedAt`)
VALUES
(1, 'Craving Delicious Food? Get Flat 50% OFF On Your First Order!', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80', '/Restaurants', 1, NOW(), NOW()),
(2, 'Authentic Hyderabadi Biryani Fest - Free Delivery Today!', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=80', '/Restaurants?category=biryani', 1, NOW(), NOW()),
(3, 'Fresh Hand-Tossed Pizzas Delivered Piping Hot In 30 Mins', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format&fit=crop&q=80', '/Restaurants?category=pizza', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE
`image` = VALUES(`image`),
`link` = VALUES(`link`),
`isActive` = 1,
`updatedAt` = NOW();

-- ------------------------------------------------------------------------------
-- 7. DELIVERY PARTNERS
-- ------------------------------------------------------------------------------
INSERT INTO `DeliveryPartners` (`id`, `name`, `phone`, `email`, `vehicleType`, `vehicleNumber`, `city`, `isAvailable`, `isActive`, `isVerified`, `kycStatus`, `rating`, `totalDeliveries`, `currentLat`, `currentLng`, `createdAt`, `updatedAt`)
VALUES
(1, 'Raju Kumar', '+919876543212', 'delivery@ruchibazaar.in', 'bike', 'TS01AB1234', 'Adilabad', 1, 1, 1, 'approved', 4.9, 124, 19.6641, 78.5320, NOW(), NOW()),
(2, 'Vikram Goud', '+919876543218', 'vikram@ruchibazaar.in', 'scooter', 'TS09CD5678', 'Hyderabad', 1, 1, 1, 'approved', 4.8, 96, 17.4485, 78.3742, NOW(), NOW())
ON DUPLICATE KEY UPDATE
`isActive` = 1,
`isAvailable` = 1,
`isVerified` = 1,
`kycStatus` = 'approved',
`updatedAt` = NOW();

-- ------------------------------------------------------------------------------
-- 8. ORDERS, ORDER ITEMS, & EARNINGS
-- ------------------------------------------------------------------------------
INSERT INTO `Orders` (`id`, `restaurantId`, `userId`, `originalAmount`, `totalAmount`, `discount`, `couponCode`, `status`, `paymentStatus`, `deliveryAddress`, `deliveryPartnerId`, `deliveryStatus`, `pickedAt`, `deliveredAt`, `createdAt`, `updatedAt`)
VALUES
(1, 1, 4, 548.00, 448.00, 100.00, 'BIRYANI100', 'delivered', 'success', 'Flat 402, Sai Residency, Shanti Nagar, Adilabad', 1, 'DELIVERED', DATE_SUB(NOW(), INTERVAL 90 MINUTE), DATE_SUB(NOW(), INTERVAL 60 MINUTE), DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW()),
(2, 2, 4, 368.00, 294.40, 73.60, 'RUCHI20', 'preparing', 'success', 'Flat 402, Sai Residency, Shanti Nagar, Adilabad', 1, 'ASSIGNED', NULL, NULL, DATE_SUB(NOW(), INTERVAL 15 MINUTE), NOW())
ON DUPLICATE KEY UPDATE `updatedAt` = NOW();

INSERT INTO `OrderItems` (`id`, `orderId`, `dishId`, `quantity`, `price`, `createdAt`, `updatedAt`)
VALUES
(1, 1, 1, 1, 279.00, NOW(), NOW()),
(2, 1, 2, 1, 369.00, NOW(), NOW()),
(3, 2, 7, 1, 229.00, NOW(), NOW()),
(4, 2, 11, 1, 139.00, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updatedAt` = NOW();

INSERT INTO `Earnings` (`id`, `orderId`, `restaurantEarning`, `platformCommission`, `deliveryEarning`, `createdAt`, `updatedAt`)
VALUES
(1, 1, 358.40, 89.60, 40.00, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updatedAt` = NOW();

-- ------------------------------------------------------------------------------
-- 9. REVIEWS
-- ------------------------------------------------------------------------------
INSERT INTO `Reviews` (`id`, `restaurantId`, `userId`, `rating`, `comment`, `createdAt`, `updatedAt`)
VALUES
(1, 1, 4, 5, 'Best biryani in town! The rice was fragrant, chicken was meltingly tender, and delivery was 10 mins early!', NOW(), NOW()),
(2, 2, 4, 5, 'Super crispy crust and great cheese pull. Loved the peri peri chicken topping! Will order again.', NOW(), NOW()),
(3, 3, 4, 4, 'Authentic dal makhani and rich paneer. Generous portions and very polite delivery hero.', NOW(), NOW())
ON DUPLICATE KEY UPDATE `updatedAt` = NOW();

SET FOREIGN_KEY_CHECKS = 1;

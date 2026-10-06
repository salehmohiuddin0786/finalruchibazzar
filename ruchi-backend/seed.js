/**
 * Ruchi Bazaar - Comprehensive Production-Ready Database Seeder
 * Populates all tables with realistic data (Users, Restaurants, Dishes,
 * Offers, Banners, Delivery Partners, Orders, OrderItems, Earnings, Reviews, Addresses).
 *
 * Usage:
 *   node seed.js
 *   or: npm run seed
 */

require("dotenv").config();
const bcrypt = require("bcryptjs");
const {
  sequelize,
  User,
  Restaurant,
  Dish,
  Order,
  OrderItem,
  DeliveryPartner,
  Earning,
  Review,
  Offer,
  Banner,
  UserAddress,
} = require("./models");
const {
  ROLES,
  ORDER_STATUS,
  DELIVERY_STATUS,
  PAYMENT_STATUS,
} = require("./config/constants");

async function seedDatabase() {
  console.log("==========================================");
  console.log("🌱 Starting Ruchi Bazaar Database Seeding...");
  console.log("==========================================");

  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");

    // Sync database (safe alter - keeps tables intact)
    await sequelize.sync({ alter: true });
    console.log("✅ Database schema synchronized.");

    // 1. SEED USERS
    console.log("\n📦 1. Seeding Users...");
    const salt = bcrypt.genSaltSync(10);

    const usersData = [
      {
        name: "Ruchi Admin",
        email: "admin@ruchibazaar.in",
        phone: "+919876543210",
        password: bcrypt.hashSync("Admin@1234", salt),
        role: ROLES.ADMIN,
        isActive: true,
        isVerified: true,
        authProvider: "password",
      },
      {
        name: "Chef Saleem (Restaurant Partner)",
        email: "partner@ruchibazaar.in",
        phone: "+919876543211",
        password: bcrypt.hashSync("Partner@1234", salt),
        role: ROLES.PARTNER,
        isActive: true,
        isVerified: true,
        authProvider: "password",
      },
      {
        name: "Raju Kumar (Delivery Hero)",
        email: "delivery@ruchibazaar.in",
        phone: "+919876543212",
        password: bcrypt.hashSync("Delivery@1234", salt),
        role: ROLES.DELIVERY,
        isActive: true,
        isVerified: true,
        vehicleType: "bike",
        isAvailable: true,
        currentLat: 19.6641,
        currentLng: 78.532,
        rating: 4.9,
        totalDeliveries: 124,
        authProvider: "password",
      },
      {
        name: "Sneha Reddy (Customer)",
        email: "customer@ruchibazaar.in",
        phone: "+919876543213",
        password: bcrypt.hashSync("Customer@1234", salt),
        role: ROLES.CUSTOMER,
        isActive: true,
        isVerified: true,
        authProvider: "password",
      },
    ];

    const seededUsers = [];
    for (const u of usersData) {
      let [user, created] = await User.findOrCreate({
        where: { phone: u.phone },
        defaults: u,
      });
      if (!created) {
        await user.update({
          password: u.password,
          role: u.role,
          isActive: true,
          isVerified: true,
        });
      }
      seededUsers.push(user);
    }
    console.log(`✅ Seeded ${seededUsers.length} Users.`);

    const adminUser = seededUsers[0];
    const partnerUser = seededUsers[1];
    const deliveryUser = seededUsers[2];
    const customerUser = seededUsers[3];

    // 2. SEED CUSTOMER ADDRESSES
    console.log("\n📦 2. Seeding Customer Addresses...");
    const addressesData = [
      {
        userId: customerUser.id,
        type: "home",
        street: "Flat 402, Sai Residency, Shanti Nagar",
        city: "Adilabad",
        state: "Telangana",
        zipCode: "504001",
        landmark: "Near Collectorate Complex",
        phone: customerUser.phone,
        contactName: customerUser.name,
        latitude: 19.6641,
        longitude: 78.532,
        isDefault: true,
      },
      {
        userId: customerUser.id,
        type: "work",
        street: "Unit 301, Tech Park, Gachibowli",
        city: "Hyderabad",
        state: "Telangana",
        zipCode: "500032",
        landmark: "Opposite Cyber Gateway",
        phone: customerUser.phone,
        contactName: customerUser.name,
        latitude: 17.44,
        longitude: 78.3489,
        isDefault: false,
      },
    ];

    for (const addr of addressesData) {
      const existing = await UserAddress.findOne({
        where: { userId: addr.userId, street: addr.street },
      });
      if (!existing) {
        await UserAddress.create(addr);
      }
    }
    console.log(`✅ Seeded ${addressesData.length} Addresses.`);

    // 3. SEED RESTAURANTS
    console.log("\n📦 3. Seeding Restaurants...");
    const restaurantsData = [
      {
        ownerId: partnerUser.id,
        name: "Paradise Biryani House",
        ownerName: "Saleem Ahmed",
        ownerPhone: "+919876543211",
        ownerEmail: "paradise@ruchibazaar.in",
        restaurantPhone: "+919876543211",
        restaurantEmail: "orders@paradisebiryani.com",
        address: "Plot 42, Main Road, Near Clock Tower",
        landmark: "Clock Tower",
        pincode: "504001",
        city: "Adilabad",
        state: "Telangana",
        latitude: 19.6641,
        longitude: 78.532,
        logo: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80",
        coverImage: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&auto=format&fit=crop&q=80",
        cuisines: ["Biryani", "Hyderabadi", "Mughlai", "North Indian"],
        foodType: "Non-Veg",
        preparationTime: 25,
        minimumOrderValue: 149,
        deliveryRadius: 12,
        openingTime: "11:00 AM",
        closingTime: "11:30 PM",
        dineIn: true,
        takeaway: true,
        isPhoneVerified: true,
        isApproved: true,
        isOpen: true,
        aboutRestaurant:
          "Famous for slow-cooked authentic Hyderabadi Dum Biryani with aromatic spices and tender cuts.",
        outletPhotos: [
          "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=80",
        ],
      },
      {
        ownerId: partnerUser.id,
        name: "Pizza Corner & Italian Bistro",
        ownerName: "Marco Rossi",
        ownerPhone: "+919876543214",
        ownerEmail: "pizzacorner@ruchibazaar.in",
        restaurantPhone: "+919876543214",
        restaurantEmail: "hello@pizzacorner.in",
        address: "Shop 14, Commercial Center, Hitec City",
        landmark: "Next to Tech Park",
        pincode: "500081",
        city: "Hyderabad",
        state: "Telangana",
        latitude: 17.4485,
        longitude: 78.3742,
        logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80",
        coverImage: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1200&auto=format&fit=crop&q=80",
        cuisines: ["Pizza", "Italian", "Fast Food", "Pasta"],
        foodType: "Veg/Non-Veg",
        preparationTime: 20,
        minimumOrderValue: 199,
        deliveryRadius: 10,
        openingTime: "11:30 AM",
        closingTime: "11:00 PM",
        dineIn: true,
        takeaway: true,
        isPhoneVerified: true,
        isApproved: true,
        isOpen: true,
        aboutRestaurant:
          "Hand-tossed artisan wood-fired pizzas, gourmet pastas, and crunchy garlic breads.",
        outletPhotos: [
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=80",
        ],
      },
      {
        ownerId: partnerUser.id,
        name: "Punjabi Dhaba & Pure Veg Rasoi",
        ownerName: "Harpreet Singh",
        ownerPhone: "+919876543215",
        ownerEmail: "punjabirasoi@ruchibazaar.in",
        restaurantPhone: "+919876543215",
        restaurantEmail: "orders@punjabidhaba.in",
        address: "Gandhi Chowk, Station Road",
        landmark: "Opposite Railway Station",
        pincode: "504001",
        city: "Adilabad",
        state: "Telangana",
        latitude: 19.6698,
        longitude: 78.5365,
        logo: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80",
        coverImage: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1200&auto=format&fit=crop&q=80",
        cuisines: ["North Indian", "Punjabi", "Pure Veg", "Thali"],
        foodType: "Pure Veg",
        preparationTime: 20,
        minimumOrderValue: 99,
        deliveryRadius: 8,
        openingTime: "10:00 AM",
        closingTime: "10:30 PM",
        dineIn: true,
        takeaway: true,
        isPhoneVerified: true,
        isApproved: true,
        isOpen: true,
        aboutRestaurant:
          "Traditional Punjabi homestyle vegetarian food cooked with pure desi ghee and fresh paneer.",
        outletPhotos: [
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80",
        ],
      },
      {
        ownerId: partnerUser.id,
        name: "Dragon Wok Asian Kitchen",
        ownerName: "Lin Chen",
        ownerPhone: "+919876543216",
        ownerEmail: "dragonwok@ruchibazaar.in",
        restaurantPhone: "+919876543216",
        restaurantEmail: "contact@dragonwok.in",
        address: "Road No 36, Jubilee Hills",
        landmark: "Near Metro Pillar 12",
        pincode: "500033",
        city: "Hyderabad",
        state: "Telangana",
        latitude: 17.4319,
        longitude: 78.4073,
        logo: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&auto=format&fit=crop&q=80",
        coverImage: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&auto=format&fit=crop&q=80",
        cuisines: ["Chinese", "Asian", "Momos", "Noodles"],
        foodType: "Veg/Non-Veg",
        preparationTime: 20,
        minimumOrderValue: 149,
        deliveryRadius: 10,
        openingTime: "12:00 PM",
        closingTime: "11:00 PM",
        dineIn: true,
        takeaway: true,
        isPhoneVerified: true,
        isApproved: true,
        isOpen: true,
        aboutRestaurant:
          "Spicy Schezwan wok bowls, steamed Himalayan momos, and crispy chilli delights.",
        outletPhotos: [
          "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&auto=format&fit=crop&q=80",
        ],
      },
      {
        ownerId: partnerUser.id,
        name: "Sweet Cravings & Cafe",
        ownerName: "Pooja Sharma",
        ownerPhone: "+919876543217",
        ownerEmail: "sweetcravings@ruchibazaar.in",
        restaurantPhone: "+919876543217",
        restaurantEmail: "desserts@sweetcravings.in",
        address: "Near Municipal Park, Subhash Road",
        landmark: "Municipal Park",
        pincode: "504001",
        city: "Adilabad",
        state: "Telangana",
        latitude: 19.6612,
        longitude: 78.5301,
        logo: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80",
        coverImage: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&auto=format&fit=crop&q=80",
        cuisines: ["Desserts", "Bakery", "Coffee", "Beverages", "Burger"],
        foodType: "Pure Veg",
        preparationTime: 15,
        minimumOrderValue: 99,
        deliveryRadius: 8,
        openingTime: "09:00 AM",
        closingTime: "11:00 PM",
        dineIn: true,
        takeaway: true,
        isPhoneVerified: true,
        isApproved: true,
        isOpen: true,
        aboutRestaurant:
          "Freshly baked pastries, Belgian waffles, creamy artisanal ice creams, and cold coffees.",
        outletPhotos: [
          "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80",
        ],
      },
    ];

    const seededRestaurants = [];
    for (const r of restaurantsData) {
      let [restaurant, created] = await Restaurant.findOrCreate({
        where: { name: r.name },
        defaults: r,
      });
      if (!created) {
        await restaurant.update({
          isApproved: true,
          isOpen: true,
          cuisines: r.cuisines,
          logo: r.logo,
          coverImage: r.coverImage,
          outletPhotos: r.outletPhotos,
        });
      }
      seededRestaurants.push(restaurant);
    }
    console.log(`✅ Seeded ${seededRestaurants.length} Restaurants.`);

    // 4. SEED DISHES FOR EACH RESTAURANT
    console.log("\n📦 4. Seeding Dishes...");
    const dishesData = [
      // Paradise Biryani House
      {
        restaurantId: seededRestaurants[0].id,
        name: "Hyderabadi Chicken Dum Biryani",
        description:
          "Long grain Basmati rice dum-cooked with tender spiced chicken, saffron, and fried onions. Served with Mirchi ka Salan & Raita.",
        price: 279,
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },
      {
        restaurantId: seededRestaurants[0].id,
        name: "Special Mutton Dum Biryani",
        description:
          "Juicy pieces of tender young goat meat cooked slowly on dum with fragrant basmati and rich shahi masala.",
        price: 369,
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },
      {
        restaurantId: seededRestaurants[0].id,
        name: "Tandoori Chicken Tikka (8 Pcs)",
        description:
          "Boneless chicken cubes marinated in hung curd, Kashmiri red chilli, and roasted in clay tandoor.",
        price: 249,
        image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },
      {
        restaurantId: seededRestaurants[0].id,
        name: "Paneer Butter Masala",
        description:
          "Fresh cottage cheese cubes simmered in a creamy, velvety tomato and cashew gravy flavored with kasoori methi.",
        price: 219,
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },
      {
        restaurantId: seededRestaurants[0].id,
        name: "Butter Garlic Naan (2 Pcs)",
        description:
          "Soft tandoor-baked leavened flatbread brushed generously with salted butter and roasted garlic.",
        price: 69,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },
      {
        restaurantId: seededRestaurants[0].id,
        name: "Shahi Double Ka Meetha",
        description:
          "Crispy fried bread slices soaked in saffron rabdi, condensed milk, and garnished with roasted pistachios & almonds.",
        price: 99,
        image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },

      // Pizza Corner & Italian Bistro
      {
        restaurantId: seededRestaurants[1].id,
        name: "Classic Margherita Pizza",
        description:
          "San Marzano tomato sauce, fresh mozzarella cheese, aromatic sweet basil leaves, and cold-pressed extra virgin olive oil.",
        price: 229,
        image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },
      {
        restaurantId: seededRestaurants[1].id,
        name: "Farmhouse Supreme Pizza",
        description:
          "Loaded with crispy bell peppers, black olives, sweet corn, mushrooms, red onions, and gooey mozzarella blend.",
        price: 329,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },
      {
        restaurantId: seededRestaurants[1].id,
        name: "Spicy Peri-Peri Chicken Pizza",
        description:
          "Tender grilled chicken chunks tossed in fiery African peri-peri spices, roasted paprika, and melted cheese.",
        price: 389,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },
      {
        restaurantId: seededRestaurants[1].id,
        name: "Creamy Alfredo Penne Pasta",
        description:
          "Al dente penne pasta tossed in rich parmesan cream sauce with garlic, herbs, and wild mushrooms.",
        price: 249,
        image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281699?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },
      {
        restaurantId: seededRestaurants[1].id,
        name: "Cheesy Garlic Breadsticks",
        description:
          "Golden-baked herb baguette topped with garlic butter and stretchy mozzarella. Served with cheesy jalapeno dip.",
        price: 139,
        image: "https://images.unsplash.com/photo-1619895092538-128341789043?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },
      {
        restaurantId: seededRestaurants[1].id,
        name: "Gooey Choco Lava Cake",
        description:
          "Warm chocolate cake with a molten center of decadent hot dark chocolate fudge.",
        price: 99,
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },

      // Punjabi Dhaba & Pure Veg Rasoi
      {
        restaurantId: seededRestaurants[2].id,
        name: "Royal Maharaja Special Veg Thali",
        description:
          "Complete deluxe thali: Dal Makhani, Paneer Tikka Masala, Mix Veg, Jeera Rice, 2 Butter Rotis, Gulab Jamun, Salad & Papad.",
        price: 199,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },
      {
        restaurantId: seededRestaurants[2].id,
        name: "Slow-Cooked Dal Makhani",
        description:
          "Black lentils simmered overnight on slow flame with butter, cream, and freshly ground secret spices.",
        price: 179,
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },
      {
        restaurantId: seededRestaurants[2].id,
        name: "Kadhai Paneer Dhaba Style",
        description:
          "Cottage cheese cubes tossed with freshly pounded coriander seeds, dried red chillies, onions, and crunchy capsicum.",
        price: 219,
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },
      {
        restaurantId: seededRestaurants[2].id,
        name: "Amritsari Aloo Pyaaz Kulcha",
        description:
          "Crispy flaky tandoor-baked bread stuffed with spiced mashed potatoes and onions. Served with chhole & butter.",
        price: 89,
        image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },
      {
        restaurantId: seededRestaurants[2].id,
        name: "Punjabi Sweet Malai Lassi",
        description:
          "Thick, chilled churned curd flavored with cardamom and rose water, topped with a thick layer of malai.",
        price: 69,
        image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },

      // Dragon Wok Asian Kitchen
      {
        restaurantId: seededRestaurants[3].id,
        name: "Steamed Chicken Darjeeling Momos (6 Pcs)",
        description:
          "Authentic Himalayan dumplings filled with juicy minced chicken and scallions. Served with spicy tomato-garlic chutney.",
        price: 149,
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },
      {
        restaurantId: seededRestaurants[3].id,
        name: "Veg Hakka Noodles",
        description:
          "Wok-tossed noodles with shredded cabbage, carrots, bell peppers, spring onions, and oriental sauces.",
        price: 159,
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },
      {
        restaurantId: seededRestaurants[3].id,
        name: "Chicken Schezwan Fried Rice",
        description:
          "Wok-tossed basmati rice with diced chicken, scrambled egg, and fiery in-house Schezwan pepper sauce.",
        price: 209,
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },
      {
        restaurantId: seededRestaurants[3].id,
        name: "Crispy Chilli Chicken Dry",
        description:
          "Crispy fried chicken chunks tossed with green chillies, onions, capsicum, soy sauce, and white pepper.",
        price: 229,
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },

      // Sweet Cravings & Cafe
      {
        restaurantId: seededRestaurants[4].id,
        name: "Belgian Dark Chocolate Waffle",
        description:
          "Freshly baked crispy waffle smothered in warm melted Belgian dark chocolate ganache and chocolate chips.",
        price: 159,
        image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },
      {
        restaurantId: seededRestaurants[4].id,
        name: "Cold Brew Iced Coffee with Cream",
        description:
          "Slow-steeped Arabica cold coffee served chilled over ice with a sweet cream swirl.",
        price: 119,
        image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },
      {
        restaurantId: seededRestaurants[4].id,
        name: "Crispy Veg Supreme Burger",
        description:
          "Golden fried spiced vegetable patty with crisp iceberg lettuce, sliced tomatoes, gherkins, and tangy house mayo in sesame bun.",
        price: 129,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },
      {
        restaurantId: seededRestaurants[4].id,
        name: "Red Velvet Cream Cheese Pastry",
        description:
          "Layers of moist crimson sponge with velvety cream cheese frosting and white chocolate curls.",
        price: 99,
        image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },
      {
        restaurantId: seededRestaurants[4].id,
        name: "Peri Peri French Fries (Crispy)",
        description:
          "Golden fried potato fries shaken in zesty peri peri spice seasoning. Served with tomato ketchup.",
        price: 89,
        image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80",
        isAvailable: true,
      },
    ];

    let dishesCreated = 0;
    for (const d of dishesData) {
      const [dish, created] = await Dish.findOrCreate({
        where: { restaurantId: d.restaurantId, name: d.name },
        defaults: d,
      });
      if (!created) {
        await dish.update({
          price: d.price,
          description: d.description,
          image: d.image,
          isAvailable: true,
        });
      }
      dishesCreated++;
    }
    console.log(`✅ Seeded ${dishesCreated} Dishes.`);

    // 5. SEED OFFERS / COUPONS
    console.log("\n📦 5. Seeding Offers/Coupons...");
    const offersData = [
      {
        title: "Welcome 50% Off",
        couponCode: "WELCOME50",
        discountPercent: 50.0,
        minOrderAmount: 199.0,
        maxDiscount: 150.0,
        usageLimit: 1000,
        usedCount: 23,
        validFrom: new Date(Date.now() - 7 * 86400000),
        validTo: new Date(Date.now() + 60 * 86400000),
        isActive: true,
      },
      {
        title: "Flat 20% Everyday Savings",
        couponCode: "RUCHI20",
        discountPercent: 20.0,
        minOrderAmount: 149.0,
        maxDiscount: 100.0,
        usageLimit: 5000,
        usedCount: 142,
        validFrom: new Date(Date.now() - 7 * 86400000),
        validTo: new Date(Date.now() + 90 * 86400000),
        isActive: true,
      },
      {
        title: "Biryani Feast ₹100 Off",
        couponCode: "BIRYANI100",
        discountPercent: 25.0,
        minOrderAmount: 399.0,
        maxDiscount: 100.0,
        usageLimit: 500,
        usedCount: 45,
        validFrom: new Date(Date.now() - 7 * 86400000),
        validTo: new Date(Date.now() + 30 * 86400000),
        isActive: true,
      },
      {
        title: "Weekend Special Discount",
        couponCode: "WEEKEND30",
        discountPercent: 30.0,
        minOrderAmount: 249.0,
        maxDiscount: 120.0,
        usageLimit: 2000,
        usedCount: 88,
        validFrom: new Date(Date.now() - 7 * 86400000),
        validTo: new Date(Date.now() + 45 * 86400000),
        isActive: true,
      },
    ];

    for (const off of offersData) {
      const [offer, created] = await Offer.findOrCreate({
        where: { couponCode: off.couponCode },
        defaults: off,
      });
      if (!created) {
        await offer.update({
          isActive: true,
          discountPercent: off.discountPercent,
          validTo: off.validTo,
        });
      }
    }
    console.log(`✅ Seeded ${offersData.length} Offers.`);

    // 6. SEED BANNERS
    console.log("\n📦 6. Seeding Promotional Banners...");
    const bannersData = [
      {
        title: "Craving Delicious Food? Get Flat 50% OFF On Your First Order!",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80",
        link: "/Restaurants",
        isActive: true,
      },
      {
        title: "Authentic Hyderabadi Biryani Fest - Free Delivery Today!",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=80",
        link: "/Restaurants?category=biryani",
        isActive: true,
      },
      {
        title: "Fresh Hand-Tossed Pizzas Delivered Piping Hot In 30 Mins",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format&fit=crop&q=80",
        link: "/Restaurants?category=pizza",
        isActive: true,
      },
    ];

    for (const b of bannersData) {
      const [banner, created] = await Banner.findOrCreate({
        where: { title: b.title },
        defaults: b,
      });
      if (!created) {
        await banner.update({ isActive: true, image: b.image, link: b.link });
      }
    }
    console.log(`✅ Seeded ${bannersData.length} Banners.`);

    // 7. SEED DELIVERY PARTNERS
    console.log("\n📦 7. Seeding Delivery Partners...");
    const deliveryPartnersData = [
      {
        name: "Raju Kumar",
        phone: "+919876543212",
        email: "delivery@ruchibazaar.in",
        vehicleType: "bike",
        vehicleNumber: "TS01AB1234",
        city: "Adilabad",
        isAvailable: true,
        isActive: true,
        isVerified: true,
        kycStatus: "approved",
        rating: 4.9,
        totalDeliveries: 124,
        currentLat: 19.6641,
        currentLng: 78.532,
      },
      {
        name: "Vikram Goud",
        phone: "+919876543218",
        email: "vikram@ruchibazaar.in",
        vehicleType: "scooter",
        vehicleNumber: "TS09CD5678",
        city: "Hyderabad",
        isAvailable: true,
        isActive: true,
        isVerified: true,
        kycStatus: "approved",
        rating: 4.8,
        totalDeliveries: 96,
        currentLat: 17.4485,
        currentLng: 78.3742,
      },
    ];

    const seededDeliveryPartners = [];
    for (const dp of deliveryPartnersData) {
      const [partner, created] = await DeliveryPartner.findOrCreate({
        where: { phone: dp.phone },
        defaults: dp,
      });
      if (!created) {
        await partner.update({
          isActive: true,
          isAvailable: true,
          isVerified: true,
          kycStatus: "approved",
        });
      }
      seededDeliveryPartners.push(partner);
    }
    console.log(`✅ Seeded ${seededDeliveryPartners.length} Delivery Partners.`);

    // 8. SEED SAMPLE ORDERS, ORDER ITEMS, & EARNINGS
    console.log("\n📦 8. Seeding Orders & Order Items...");
    const sampleDishes = await Dish.findAll({ limit: 4 });

    if (sampleDishes.length >= 2) {
      const existingOrders = await Order.count({ where: { userId: customerUser.id } });
      if (existingOrders === 0) {
        // Order 1: Delivered
        const order1 = await Order.create({
          restaurantId: seededRestaurants[0].id,
          userId: customerUser.id,
          originalAmount: 548.0,
          totalAmount: 448.0,
          discount: 100.0,
          couponCode: "BIRYANI100",
          status: ORDER_STATUS.DELIVERED,
          paymentStatus: PAYMENT_STATUS.SUCCESS,
          deliveryAddress: "Flat 402, Sai Residency, Shanti Nagar, Adilabad",
          deliveryPartnerId: seededDeliveryPartners[0].id,
          deliveryStatus: DELIVERY_STATUS.DELIVERED,
          deliveredAt: new Date(Date.now() - 3600000),
          pickedAt: new Date(Date.now() - 5400000),
        });

        await OrderItem.create({
          orderId: order1.id,
          dishId: sampleDishes[0].id,
          quantity: 1,
          price: sampleDishes[0].price,
        });

        await OrderItem.create({
          orderId: order1.id,
          dishId: sampleDishes[1].id,
          quantity: 1,
          price: sampleDishes[1].price,
        });

        await Earning.create({
          orderId: order1.id,
          restaurantEarning: 358.4,
          platformCommission: 89.6,
          deliveryEarning: 40.0,
        });

        // Order 2: In Progress (Preparing)
        const order2 = await Order.create({
          restaurantId: seededRestaurants[1].id,
          userId: customerUser.id,
          originalAmount: 368.0,
          totalAmount: 294.4,
          discount: 73.6,
          couponCode: "RUCHI20",
          status: ORDER_STATUS.PREPARING,
          paymentStatus: PAYMENT_STATUS.SUCCESS,
          deliveryAddress: "Flat 402, Sai Residency, Shanti Nagar, Adilabad",
          deliveryPartnerId: seededDeliveryPartners[0].id,
          deliveryStatus: DELIVERY_STATUS.ASSIGNED,
        });

        await OrderItem.create({
          orderId: order2.id,
          dishId: sampleDishes[0].id,
          quantity: 1,
          price: sampleDishes[0].price,
        });

        console.log("✅ Seeded 2 Sample Orders with OrderItems and Earnings.");
      } else {
        console.log(`ℹ️ Existing orders found (${existingOrders}), skipping order creation.`);
      }
    }

    // 9. SEED REVIEWS
    console.log("\n📦 9. Seeding Reviews...");
    const reviewsData = [
      {
        restaurantId: seededRestaurants[0].id,
        userId: customerUser.id,
        rating: 5,
        comment:
          "Best biryani in town! The rice was fragrant, chicken was meltingly tender, and delivery was 10 mins early!",
      },
      {
        restaurantId: seededRestaurants[1].id,
        userId: customerUser.id,
        rating: 5,
        comment:
          "Super crispy crust and great cheese pull. Loved the peri peri chicken topping! Will order again.",
      },
      {
        restaurantId: seededRestaurants[2].id,
        userId: customerUser.id,
        rating: 4,
        comment:
          "Authentic dal makhani and rich paneer. Generous portions and very polite delivery hero.",
      },
    ];

    for (const rev of reviewsData) {
      const existing = await Review.findOne({
        where: { restaurantId: rev.restaurantId, userId: rev.userId },
      });
      if (!existing) {
        await Review.create(rev);
      }
    }
    console.log(`✅ Seeded ${reviewsData.length} Reviews.`);

    console.log("\n==========================================");
    console.log("🎉 SUCCESS: Database Seeding Completed!");
    console.log("==========================================");
    console.log("\nDefault Test Accounts Created:");
    console.log("------------------------------------------");
    console.log("👑 ADMIN:    admin@ruchibazaar.in    / Admin@1234    (Phone: +919876543210)");
    console.log("🏪 PARTNER:  partner@ruchibazaar.in  / Partner@1234  (Phone: +919876543211)");
    console.log("🚚 DELIVERY: delivery@ruchibazaar.in / Delivery@1234 (Phone: +919876543212)");
    console.log("👤 CUSTOMER: customer@ruchibazaar.in / Customer@1234 (Phone: +919876543213)");
    console.log("------------------------------------------\n");

    process.exit(0);
  } catch (err) {
    console.error("\n❌ Seeding failed with error:", err);
    process.exit(1);
  }
}

seedDatabase();

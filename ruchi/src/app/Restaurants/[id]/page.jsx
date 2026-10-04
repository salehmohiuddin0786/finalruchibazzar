"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Star, Clock, IndianRupee, MapPin,
  Heart, ShoppingCart, Plus, Minus, Loader,
  ChefHat, Flame, Leaf, Award, Sparkles,
  Coffee, Pizza, Sandwich, IceCream, UtensilsCrossed,
  X, Truck, CircleCheck, CircleDollarSign, Navigation
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getMediaUrl, hideBrokenImage } from '../../utils/media';

const RestaurantMenuPage = () => {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id;

  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api';
  const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';

  const normalizeListResponse = (data, key) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.[key])) return data[key];
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  };

  const getDishFromCartItem = (item) => item.Dish || item.dish;

  // Get or create cart ID
  const getCartId = () => {
    if (typeof window !== 'undefined') {
      let cartId = localStorage.getItem('cartId');
      if (!cartId) {
        cartId = 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('cartId', cartId);
      }
      return cartId;
    }
    return null;
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Load cart from backend
  const loadCart = async () => {
    try {
      const cartId = getCartId();
      if (!cartId) return;

      const response = await fetch(`${apiUrl}/Cart/${cartId}`);
      if (response.ok) {
        const cartItems = normalizeListResponse(await response.json(), "items");
        
        // Transform cart items to local state format
        const cartState = {};
        cartItems.forEach(item => {
          const dish = getDishFromCartItem(item);
          if (dish) {
            cartState[item.dishId] = {
              id: item.dishId,
              name: dish.name,
              price: dish.price,
              quantity: item.quantity,
              description: dish.description,
              image: getMediaUrl(dish.image, apiUrl),
              category: dish.category,
              restaurantId: dish.restaurantId
            };
          }
        });
        
        setCart(cartState);
      }
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  };

  // Fetch restaurant details and dishes
  useEffect(() => {
    if (restaurantId) {
      fetchRestaurantDetails();
      fetchRestaurantDishes();
      loadCart();
    }
  }, [restaurantId]);

  const fetchRestaurantDetails = async () => {
    try {
      const response = await fetch(`${apiUrl}/restaurants/${restaurantId}`);
      if (!response.ok) throw new Error('Failed to fetch restaurant details');
      const data = await response.json();
      
      const restaurantData = data.restaurant || data.data || data;

      // Transform restaurant data
      const transformedRestaurant = {
        id: restaurantData.id,
        name: restaurantData.name || 'Restaurant',
        description:
          restaurantData.aboutRestaurant ||
          restaurantData.description ||
          'Fresh food prepared with quality ingredients',
        address: restaurantData.address || 'Location available',
        image: getMediaUrl(
          restaurantData.coverImage || restaurantData.logo || restaurantData.image,
          apiUrl
        ),
        isOpen: restaurantData.isOpen !== undefined ? restaurantData.isOpen : true,
        rating: 4.5,
        reviewCount: 245,
        deliveryTime: restaurantData.preparationTime
          ? `${restaurantData.preparationTime}-${restaurantData.preparationTime + 10} min`
          : "30-40 min",
        priceRange: restaurantData.priceRange || `${currencySymbol}${currencySymbol}`,
        minOrder: restaurantData.minimumOrderValue
          ? `${currencySymbol}${restaurantData.minimumOrderValue}`
          : null,
        distance: "2.5 km",
        freeDelivery: false,
        offers: ["20% OFF on first order"]
      };
      
      setRestaurant(transformedRestaurant);
    } catch (err) {
      console.error('Error fetching restaurant:', err);
      setError(err.message);
    }
  };

  const fetchRestaurantDishes = async () => {
    try {
      const response = await fetch(`${apiUrl}/dishes/restaurant/${restaurantId}`);
      if (!response.ok) throw new Error('Failed to fetch dishes');
      const data = await response.json();
      
      const dishList = normalizeListResponse(data, 'data');

      // Transform dishes data
      const transformedDishes = dishList.map((dish, index) => ({
        id: dish.id,
        name: dish.name,
        description: dish.description || 'Delicious dish prepared with fresh ingredients',
        price: Number(dish.price ?? dish.mrp ?? dish.salePrice ?? 0),
        image: getMediaUrl(dish.image, apiUrl),
        category: getCategoryFromName(dish.name),
        popular: index < 3,
        spicy: dish.name.toLowerCase().includes('spicy') || Math.random() > 0.7,
        vegetarian: dish.name.toLowerCase().includes('veg') || Math.random() > 0.6,
        preparationTime: '15-20 min',
        rating: 4.5,
        reviewCount: Math.floor(Math.random() * 50) + 10,
        restaurantId: restaurantId
      }));
      
      setDishes(transformedDishes);
    } catch (err) {
      console.error('Error fetching dishes:', err);
      const sampleDishes = getSampleDishes(restaurant?.name || 'Restaurant');
      setDishes(sampleDishes);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get sample dishes based on restaurant name
  const getSampleDishes = (restaurantName) => {
    if (restaurantName.toLowerCase().includes('biryani')) {
      return [
        { id: 1, name: 'Hyderabadi Chicken Biryani', description: 'Authentic Hyderabadi dum biryani with tender chicken', price: 350, category: 'Biryani', popular: true, spicy: true, vegetarian: false, preparationTime: '25-30 min', rating: 4.8, reviewCount: 156, restaurantId: restaurantId },
        { id: 2, name: 'Mutton Biryani', description: 'Slow-cooked mutton biryani with aromatic spices', price: 450, category: 'Biryani', popular: true, spicy: true, vegetarian: false, preparationTime: '30-35 min', rating: 4.9, reviewCount: 203, restaurantId: restaurantId },
        { id: 3, name: 'Veg Biryani', description: 'Flavorful vegetable biryani with basmati rice', price: 250, category: 'Biryani', popular: false, spicy: false, vegetarian: true, preparationTime: '20-25 min', rating: 4.3, reviewCount: 89, restaurantId: restaurantId },
        { id: 4, name: 'Chicken 65', description: 'Spicy deep-fried chicken appetizer', price: 280, category: 'Starters', popular: true, spicy: true, vegetarian: false, preparationTime: '15-20 min', rating: 4.6, reviewCount: 112, restaurantId: restaurantId },
        { id: 5, name: 'Mirchi ka Salan', description: 'Spicy curry made with green chilies', price: 180, category: 'Curries', popular: false, spicy: true, vegetarian: true, preparationTime: '10-15 min', rating: 4.4, reviewCount: 67, restaurantId: restaurantId },
        { id: 6, name: 'Double ka Meetha', description: 'Traditional Hyderabadi bread pudding', price: 150, category: 'Desserts', popular: true, spicy: false, vegetarian: true, preparationTime: '10-15 min', rating: 4.7, reviewCount: 94, restaurantId: restaurantId }
      ];
    }
    // Default dishes
    return [
      { id: 1, name: 'Special Thali', description: 'Complete meal with assorted dishes', price: 299, category: 'Main Course', popular: true, spicy: false, vegetarian: true, preparationTime: '20-25 min', rating: 4.5, reviewCount: 120, restaurantId: restaurantId },
      { id: 2, name: 'Paneer Butter Masala', description: 'Cottage cheese in creamy tomato gravy', price: 249, category: 'Main Course', popular: true, spicy: false, vegetarian: true, preparationTime: '15-20 min', rating: 4.6, reviewCount: 89, restaurantId: restaurantId },
      { id: 3, name: 'Butter Chicken', description: 'Tender chicken in rich butter gravy', price: 329, category: 'Main Course', popular: true, spicy: true, vegetarian: false, preparationTime: '20-25 min', rating: 4.7, reviewCount: 156, restaurantId: restaurantId },
    ];
  };

  // Helper function to determine category from dish name
  const getCategoryFromName = (name) => {
    const name_lower = name.toLowerCase();
    if (name_lower.includes('biryani')) return 'Biryani';
    if (name_lower.includes('chicken') || name_lower.includes('mutton')) return 'Non-Veg';
    if (name_lower.includes('paneer') || name_lower.includes('veg')) return 'Vegetarian';
    if (name_lower.includes('starter') || name_lower.includes('65')) return 'Starters';
    if (name_lower.includes('dessert') || name_lower.includes('sweet') || name_lower.includes('meetha')) return 'Desserts';
    if (name_lower.includes('bread') || name_lower.includes('roti')) return 'Breads';
    return 'Main Course';
  };

  // Get unique categories from dishes
  const categories = ['all', ...new Set(dishes.map(dish => dish.category))];

  // Filter dishes by category
  const filteredDishes = selectedCategory === 'all'
    ? dishes
    : dishes.filter(dish => dish.category === selectedCategory);

  // Cart functions with backend integration
  const addToCart = async (dish) => {
    setCartLoading(true);
    try {
      const cartId = getCartId();
      const response = await fetch(`${apiUrl}/Cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartId: cartId,
          dishId: dish.id,
          quantity: 1
        })
      });

      if (!response.ok) throw new Error('Failed to add to cart');
      
      // Update local cart state
      setCart(prev => ({
        ...prev,
        [dish.id]: {
          ...dish,
          quantity: (prev[dish.id]?.quantity || 0) + 1
        }
      }));

      showNotification(`${dish.name} added to cart!`, 'success');
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      showNotification('Failed to add to cart', 'error');
    } finally {
      setCartLoading(false);
    }
  };

  const removeFromCart = async (dishId) => {
    setCartLoading(true);
    try {
      const cartId = getCartId();
      
      // Get cart items to find the cart item ID
      const response = await fetch(`${apiUrl}/Cart/${cartId}`);
      if (!response.ok) throw new Error('Failed to fetch cart');
      
      const cartItems = normalizeListResponse(await response.json(), "items");
      const cartItem = cartItems.find(item => item.dishId === dishId);
      
      if (cartItem) {
        const dishName = cart[dishId]?.name || 'Item';
        
        if (cartItem.quantity > 1) {
          // Update quantity
          const updateResponse = await fetch(`${apiUrl}/Cart/update/${cartItem.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              quantity: cartItem.quantity - 1
            })
          });
          
          if (!updateResponse.ok) throw new Error('Failed to update cart');
          
        } else {
          // Delete item
          const deleteResponse = await fetch(`${apiUrl}/Cart/delete/${cartItem.id}`, {
            method: 'DELETE'
          });
          
          if (!deleteResponse.ok) throw new Error('Failed to remove item');
          showNotification(`${dishName} removed from cart`, 'info');
        }

        // Update local cart state
        setCart(prev => {
          const newCart = { ...prev };
          if (newCart[dishId]?.quantity > 1) {
            newCart[dishId].quantity -= 1;
          } else {
            delete newCart[dishId];
          }
          return newCart;
        });
      }
      
    } catch (err) {
      console.error('Error removing from cart:', err);
      showNotification('Failed to update cart', 'error');
    } finally {
      setCartLoading(false);
    }
  };

  const clearCartItem = async (dishId) => {
    setCartLoading(true);
    try {
      const cartId = getCartId();
      
      const response = await fetch(`${apiUrl}/Cart/${cartId}`);
      if (!response.ok) throw new Error('Failed to fetch cart');
      
      const cartItems = normalizeListResponse(await response.json(), "items");
      const cartItem = cartItems.find(item => item.dishId === dishId);
      
      if (cartItem) {
        const deleteResponse = await fetch(`${apiUrl}/Cart/delete/${cartItem.id}`, {
          method: 'DELETE'
        });
        
        if (!deleteResponse.ok) throw new Error('Failed to remove item');
        
        // Update local cart state
        setCart(prev => {
          const newCart = { ...prev };
          delete newCart[dishId];
          return newCart;
        });

        showNotification('Item removed from cart', 'info');
      }
      
    } catch (err) {
      console.error('Error clearing cart item:', err);
      showNotification('Failed to remove item', 'error');
    } finally {
      setCartLoading(false);
    }
  };

  const getCartTotal = () => {
    return Object.values(cart).reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    router.push('/Cart');
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading menu...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !restaurant) {
    return (
      <>
        <Navbar />
        <div className="bg-white min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load menu</h3>
            <p className="text-gray-600 mb-4">{error || 'Restaurant not found'}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const restaurantSchema = restaurant ? {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": restaurant.name || "Restaurant",
    "image": restaurant.image ? getMediaUrl(restaurant.image) : undefined,
    "telephone": restaurant.phone || undefined,
    "address": restaurant.address ? {
      "@type": "PostalAddress",
      "streetAddress": restaurant.address,
      "addressLocality": restaurant.city || "City",
      "addressCountry": "IN"
    } : undefined,
    "servesCuisine": restaurant.cuisineType || restaurant.cuisines || "Multi-Cuisine",
    "priceRange": restaurant.priceRange || "₹₹",
    "aggregateRating": restaurant.rating ? {
      "@type": "AggregateRating",
      "ratingValue": restaurant.rating,
      "reviewCount": restaurant.totalRatings || 50
    } : undefined,
  } : null;

  return (
    <>
      {restaurantSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
      )}
      <Navbar />
      
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all transform animate-slideIn ${
          notification.type === 'success' ? 'bg-green-500' : 
          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`}>
          <p className="font-medium">{notification.message}</p>
        </div>
      )}
      
      <div className="bg-gray-50 min-h-screen">
        {/* Restaurant Header */}
        <div className="relative bg-gradient-to-r from-red-500 to-orange-500 py-12">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => router.back()}
              className="mb-6 flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Restaurants</span>
            </button>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
                  {restaurant.name}
                </h1>
                <p className="text-white/90 text-sm md:text-base mb-3 max-w-2xl">
                  {restaurant.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                    <span className="font-semibold">{restaurant.rating}</span>
                    <span className="text-white/70">({restaurant.reviewCount}+)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-5 h-5" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-5 h-5" />
                    <span>{restaurant.priceRange}</span>
                  </div>
                  {restaurant.minOrder && (
                    <div className="flex items-center gap-1">
                      <CircleDollarSign className="w-5 h-5" />
                      <span>Min {restaurant.minOrder}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <MapPin className="w-5 h-5" />
                    <span className="text-sm max-w-[200px] truncate">{restaurant.address}</span>
                  </div>
                  {restaurant.isOpen ? (
                    <div className="flex items-center gap-1 bg-green-500/20 px-3 py-1 rounded-full">
                      <CircleCheck className="w-4 h-4" />
                      <span className="text-sm">Open Now</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-red-500/20 px-3 py-1 rounded-full">
                      <X className="w-4 h-4" />
                      <span className="text-sm">Closed</span>
                    </div>
                  )}
                </div>
              </div>

              {restaurant.image && (
                <div className="w-full lg:w-80 h-48 rounded-2xl overflow-hidden bg-white/10 shadow-2xl ring-1 ring-white/30">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                    onError={hideBrokenImage}
                  />
                </div>
              )}

              {/* Cart Summary Button */}
              {getCartItemCount() > 0 && (
                <button
                  onClick={() => setShowCart(!showCart)}
                  className="relative bg-white text-red-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{getCartItemCount()} items</span>
                  <span className="bg-red-600 text-white px-3 py-1 rounded-lg">
                    {currencySymbol}{getCartTotal().toFixed(2)}
                  </span>
                  {cartLoading && (
                    <div className="absolute -top-1 -right-1">
                      <Loader className="w-4 h-4 animate-spin text-red-600" />
                    </div>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side - Categories */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-4 px-2">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold shadow-md'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="capitalize">{category}</span>
                      <span className={`float-right ${
                        selectedCategory === category ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        ({category === 'all' ? dishes.length : dishes.filter(d => d.category === category).length})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Dishes Grid */}
            <div className="flex-1">
              {/* Category Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 capitalize">
                  {selectedCategory === 'all' ? 'All Dishes' : selectedCategory}
                </h2>
                <p className="text-gray-600">
                  {filteredDishes.length} items available
                </p>
              </div>

              {/* Dishes Grid */}
              {filteredDishes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredDishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-red-200 transition-all duration-300"
                    >
                      {/* Dish Image */}
                      <div className="relative h-48 overflow-hidden">
                        {dish.image ? (
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={hideBrokenImage}
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${
                            dish.category === 'Biryani' ? 'from-orange-100 to-red-100' :
                            dish.category === 'Starters' ? 'from-amber-100 to-yellow-100' :
                            dish.category === 'Non-Veg' ? 'from-red-100 to-rose-100' :
                            dish.category === 'Vegetarian' ? 'from-green-100 to-emerald-100' :
                            dish.category === 'Desserts' ? 'from-pink-100 to-purple-100' :
                            'from-gray-100 to-slate-100'
                          } flex items-center justify-center`}>
                            <UtensilsCrossed className="w-16 h-16 text-gray-400" />
                          </div>
                        )}

                        {/* Popular Badge */}
                        {dish.popular && (
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            <span>Popular</span>
                          </div>
                        )}

                        {/* Dietary Icons */}
                        <div className="absolute top-3 right-3 flex gap-1">
                          {dish.vegetarian && (
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                              <Leaf className="w-4 h-4 text-white" />
                            </div>
                          )}
                          {dish.spicy && (
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                              <Flame className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Dish Info */}
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-red-600 transition-colors">
                              {dish.name}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                              {dish.description}
                            </p>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                            {dish.category}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {dish.preparationTime}
                          </span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-4">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold text-sm">{dish.rating}</span>
                          <span className="text-gray-500 text-xs">({dish.reviewCount})</span>
                        </div>

                        {/* Price and Add to Cart */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-gray-900">
                              {dish.price > 0 ? `${currencySymbol}${dish.price}` : 'Price unavailable'}
                            </span>
                            <span className="text-xs text-gray-500">+ tax</span>
                          </div>

                          {cart[dish.id] ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => removeFromCart(dish.id)}
                                disabled={cartLoading}
                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                              >
                                <Minus className="w-4 h-4 text-gray-700" />
                              </button>
                              <span className="font-semibold w-6 text-center">
                                {cart[dish.id].quantity}
                              </span>
                              <button
                                onClick={() => addToCart(dish)}
                                disabled={cartLoading}
                                className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center hover:from-red-600 hover:to-orange-600 transition-colors disabled:opacity-50"
                              >
                                {cartLoading ? (
                                  <Loader className="w-4 h-4 text-white animate-spin" />
                                ) : (
                                  <Plus className="w-4 h-4 text-white" />
                                )}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(dish)}
                              disabled={cartLoading}
                              className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-orange-600 transition-all hover:shadow-md flex items-center gap-2 disabled:opacity-50"
                            >
                              {cartLoading ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                <ShoppingCart className="w-4 h-4" />
                              )}
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UtensilsCrossed className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-700 mb-2">No dishes found</h3>
                  <p className="text-gray-500 mb-4">Try selecting a different category</p>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all"
                  >
                    View All Dishes
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Cart Sidebar - Mobile */}
        {showCart && Object.keys(cart).length > 0 && (
          <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setShowCart(false)}>
            <div className="absolute inset-0 bg-black/50" />
            <div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Your Cart</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {Object.values(cart).map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">{currencySymbol}{item.price} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        disabled={cartLoading}
                        className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3 text-gray-700" />
                      </button>
                      <span className="font-semibold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => addToCart(item)}
                        disabled={cartLoading}
                        className="w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center"
                      >
                        {cartLoading ? (
                          <Loader className="w-3 h-3 text-white animate-spin" />
                        ) : (
                          <Plus className="w-3 h-3 text-white" />
                        )}
                      </button>
                      <button
                        onClick={() => clearCartItem(item.id)}
                        disabled={cartLoading}
                        className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors ml-1"
                      >
                        <X className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Total:</span>
                  <span>{currencySymbol}{getCartTotal().toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">+ taxes and fees</p>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all"
              >
                View Cart & Checkout
              </button>
            </div>
          </div>
        )}

        {/* Desktop Cart */}
        {Object.keys(cart).length > 0 && (
          <div className="hidden lg:block fixed bottom-8 right-8 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Your Cart ({getCartItemCount()} items)
              </h3>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-3 mb-4">
                {Object.values(cart).map((item) => (
                  <div key={item.id} className="flex items-center justify-between group">
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">{currencySymbol}{item.price} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        disabled={cartLoading}
                        className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                      >
                        <Minus className="w-3 h-3 text-gray-700" />
                      </button>
                      <span className="font-semibold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => addToCart(item)}
                        disabled={cartLoading}
                        className="w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center hover:from-red-600 hover:to-orange-600"
                      >
                        {cartLoading ? (
                          <Loader className="w-3 h-3 text-white animate-spin" />
                        ) : (
                          <Plus className="w-3 h-3 text-white" />
                        )}
                      </button>
                      <button
                        onClick={() => clearCartItem(item.id)}
                        disabled={cartLoading}
                        className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors ml-1 opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center font-bold text-gray-900 mb-4">
                  <span>Total:</span>
                  <span>{currencySymbol}{getCartTotal().toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all"
                >
                  View Cart & Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default RestaurantMenuPage;

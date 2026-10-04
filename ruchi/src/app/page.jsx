"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CategoriesSection from './components/CategoriesSection';
import WhyChooseUs from './components/WhyChooseUs';
import PopularRestaurants from './components/PopularRestaurants';
import AchievementsSection from './components/AchievementsSection';
import SpecialOffer from './components/SpecialOffer';
import { getMediaUrl, hideBrokenImage } from './utils/media';
import { 
  Search, Star, Clock, Shield, Truck, ArrowRight, ShoppingBag, Utensils, 
  TrendingUp, Users, Award, Sparkles, Heart, Zap, ChevronRight, 
  MapPin, Gift, Phone, Mail, ChefHat, Package, ShoppingCart,
  ThumbsUp, Target, Sparkle, TrendingDown, CloudRain, Sun,
  CloudSnow, Wind, Navigation, Loader, Flame, Crown, Rocket,
  Smartphone, Play, Apple as AppleIcon, Download, Tag, IndianRupee,
  Coffee, Pizza, Sandwich, Salad, Cake, IceCream, Fish, Beef,
  Plus, Minus, X, Navigation2, LocateFixed
} from 'lucide-react';

const Page = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Detecting location...');
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Cart state
  const [cart, setCart] = useState({});
  const [cartLoading, setCartLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  
  // State for API data
  const [popularDishes, setPopularDishes] = useState([]);
  const [popularRestaurants, setPopularRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [loading, setLoading] = useState({
    dishes: true,
    restaurants: true,
    categories: true,
    nearby: true
  });
  const [error, setError] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api';
  const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';

  // Get current location
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setUserCoordinates({ latitude, longitude });
          
          // Using OpenStreetMap Nominatim API for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          
          if (response.ok) {
            const data = await response.json();
            const address = data.address;
            
            // Format the address based on available components
            let locationString = "";
            
            if (address.city) {
              locationString = address.city;
            } else if (address.town) {
              locationString = address.town;
            } else if (address.village) {
              locationString = address.village;
            } else if (address.suburb) {
              locationString = address.suburb;
            }
            
            // Add state/region if available
            if (address.state && locationString) {
              locationString += `, ${address.state}`;
            } else if (address.state) {
              locationString = address.state;
            }
            
            if (locationString) {
              setSelectedLocation(locationString);
              localStorage.setItem("userLocation", locationString);
              localStorage.setItem("userLatitude", latitude.toString());
              localStorage.setItem("userLongitude", longitude.toString());
            } else {
              // Fallback to coordinates if address not found
              const coordLocation = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
              setSelectedLocation(coordLocation);
              localStorage.setItem("userLocation", coordLocation);
              localStorage.setItem("userLatitude", latitude.toString());
              localStorage.setItem("userLongitude", longitude.toString());
            }
            
            // Fetch nearby restaurants based on coordinates
            fetchNearbyRestaurants(latitude, longitude);
          } else {
            // Fallback to coordinates
            const coordLocation = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setSelectedLocation(coordLocation);
            localStorage.setItem("userLocation", coordLocation);
            localStorage.setItem("userLatitude", latitude.toString());
            localStorage.setItem("userLongitude", longitude.toString());
            
            // Fetch nearby restaurants based on coordinates
            fetchNearbyRestaurants(latitude, longitude);
          }
        } catch (error) {
          console.error("Error getting location details:", error);
          setLocationError("Failed to get location details");
          
          // Fallback to coordinates
          const { latitude, longitude } = position.coords;
          const coordLocation = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setSelectedLocation(coordLocation);
          localStorage.setItem("userLocation", coordLocation);
          localStorage.setItem("userLatitude", latitude.toString());
          localStorage.setItem("userLongitude", longitude.toString());
          
          // Fetch nearby restaurants based on coordinates
          fetchNearbyRestaurants(latitude, longitude);
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        setIsGettingLocation(false);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Please allow location access to see nearby restaurants");
            setSelectedLocation("Location access denied");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable");
            setSelectedLocation("Location unavailable");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out");
            setSelectedLocation("Location timeout");
            break;
          default:
            setLocationError("An unknown error occurred");
            setSelectedLocation("Location error");
        }
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Fetch nearby restaurants based on coordinates
  const fetchNearbyRestaurants = async (latitude, longitude) => {
    setLoading(prev => ({ ...prev, nearby: true }));
    try {
      const response = await fetch(
        `${apiUrl}/restaurants/nearby?lat=${latitude}&lng=${longitude}&radius=10`
      );
      
      if (response.ok) {
        const data = await response.json();
        setNearbyRestaurants(normalizeListResponse(data, "restaurants"));
      } else {
        console.log('Using fallback nearby restaurants');
        setNearbyRestaurants(getFallbackRestaurants().slice(0, 3));
      }
    } catch (err) {
      console.error('Error fetching nearby restaurants:', err);
      setNearbyRestaurants(getFallbackRestaurants().slice(0, 3));
    } finally {
      setLoading(prev => ({ ...prev, nearby: false }));
    }
  };

  const normalizeListResponse = (data, key) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.[key])) return data[key];
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  };

  const getCartItemsFromResponse = (data) => normalizeListResponse(data, "items");

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
        const cartItems = getCartItemsFromResponse(await response.json());
        
        const cartState = {};
        cartItems.forEach(item => {
          const dish = getDishFromCartItem(item);
          if (dish) {
            cartState[item.dishId] = {
              id: item.dishId,
              name: dish.name,
              price: dish.price,
              quantity: item.quantity,
              image: getMediaUrl(dish.image, apiUrl),
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

  // Add to cart
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

  // Remove from cart
  const removeFromCart = async (dishId) => {
    setCartLoading(true);
    try {
      const cartId = getCartId();
      
      const response = await fetch(`${apiUrl}/Cart/${cartId}`);
      if (!response.ok) throw new Error('Failed to fetch cart');
      
      const cartItems = getCartItemsFromResponse(await response.json());
      const cartItem = cartItems.find(item => item.dishId === dishId);
      
      if (cartItem) {
        const dishName = cart[dishId]?.name || 'Item';
        
        if (cartItem.quantity > 1) {
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
          const deleteResponse = await fetch(`${apiUrl}/Cart/delete/${cartItem.id}`, {
            method: 'DELETE'
          });
          
          if (!deleteResponse.ok) throw new Error('Failed to remove item');
          showNotification(`${dishName} removed from cart`, 'info');
        }

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

  // Clear cart item completely
  const clearCartItem = async (dishId) => {
    setCartLoading(true);
    try {
      const cartId = getCartId();
      
      const response = await fetch(`${apiUrl}/Cart/${cartId}`);
      if (!response.ok) throw new Error('Failed to fetch cart');
      
      const cartItems = getCartItemsFromResponse(await response.json());
      const cartItem = cartItems.find(item => item.dishId === dishId);
      
      if (cartItem) {
        const deleteResponse = await fetch(`${apiUrl}/Cart/delete/${cartItem.id}`, {
          method: 'DELETE'
        });
        
        if (!deleteResponse.ok) throw new Error('Failed to remove item');
        
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

  // Get cart total
  const getCartTotal = () => {
    return Object.values(cart).reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get cart item count
  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, item) => total + item.quantity, 0);
  };

  // Handle checkout
  const handleCheckout = () => {
    router.push('/Cart');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Load saved location from localStorage
    const savedLocation = localStorage.getItem("userLocation");
    const savedLat = localStorage.getItem("userLatitude");
    const savedLng = localStorage.getItem("userLongitude");
    
    if (savedLocation) {
      setSelectedLocation(savedLocation);
      if (savedLat && savedLng) {
        setUserCoordinates({ 
          latitude: parseFloat(savedLat), 
          longitude: parseFloat(savedLng) 
        });
        fetchNearbyRestaurants(parseFloat(savedLat), parseFloat(savedLng));
      }
    } else {
      // Get current location if no saved location
      getCurrentLocation();
    }
    
    // Fetch all data
    fetchPopularDishes();
    fetchPopularRestaurants();
    fetchCategories();
    loadCart();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch popular dishes
  const fetchPopularDishes = async () => {
    try {
      const response = await fetch(`${apiUrl}/dishes?limit=8`);
      if (!response.ok) throw new Error('Failed to fetch dishes');
      const data = await response.json();
      
      // Transform dishes data
      const transformedDishes = normalizeListResponse(data, "dishes").map((dish, index) => ({
        id: dish.id,
        name: dish.name,
        description: dish.description || 'Delicious dish prepared with fresh ingredients',
        price: dish.price,
        image: getMediaUrl(dish.image, apiUrl),
        restaurant: dish.Restaurant?.name || 'Various Restaurant',
        rating: dish.rating || (4.0 + Math.random() * 0.9).toFixed(1),
        deliveryTime: '20-30 min',
        category: getCategoryFromName(dish.name),
        popular: index < 4,
        spicy: Math.random() > 0.6,
        veg: Math.random() > 0.7,
        orders: Math.floor(Math.random() * 500) + 100
      }));
      
      setPopularDishes(transformedDishes);
      setLoading(prev => ({ ...prev, dishes: false }));
    } catch (err) {
      console.error('Error fetching dishes:', err);
      setPopularDishes(getFallbackDishes());
      setLoading(prev => ({ ...prev, dishes: false }));
    }
  };

  // Fetch popular restaurants
  const fetchPopularRestaurants = async () => {
    try {
      const response = await fetch(`${apiUrl}/restaurants?limit=6`);
      if (!response.ok) throw new Error('Failed to fetch restaurants');
      const data = await response.json();
      const restaurants = normalizeListResponse(data, "restaurants");
      
      // Transform restaurants data
      const transformedRestaurants = restaurants.map((restaurant, index) => ({
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description || 'Authentic cuisine restaurant',
        cuisine: restaurant.cuisine || getCuisineFromName(restaurant.name),
        rating: restaurant.rating || (4.0 + Math.random() * 0.8).toFixed(1),
        reviewCount: restaurant.reviewCount || Math.floor(Math.random() * 500) + 100,
        deliveryTime: restaurant.deliveryTime || '25-35 min',
        deliveryFee: restaurant.deliveryFee ? `${currencySymbol}${restaurant.deliveryFee}` : 'Free',
        minOrder: restaurant.minOrder ? `${currencySymbol}${restaurant.minOrder}` : `${currencySymbol}99`,
        image: getMediaUrl(restaurant.coverImage || restaurant.logo || restaurant.image, apiUrl),
        priceRange: restaurant.priceRange || `${currencySymbol}${currencySymbol}`,
        isOpen: restaurant.isOpen !== undefined ? restaurant.isOpen : true,
        featured: index < 2,
        offers: restaurant.offers || ['50% OFF', 'Free Delivery'],
        discount: Math.floor(Math.random() * 30) + 10,
        distance: (Math.random() * 3 + 0.5).toFixed(1) // Simulated distance in km
      }));
      
      setPopularRestaurants(transformedRestaurants);
      setLoading(prev => ({ ...prev, restaurants: false }));
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setPopularRestaurants(getFallbackRestaurants());
      setLoading(prev => ({ ...prev, restaurants: false }));
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${apiUrl}/dishes`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      
      const uniqueCategories = [...new Set(data.data.map(dish => 
        getCategoryFromName(dish.name)
      ))];
      
      const categoryData = uniqueCategories.slice(0, 8).map((category, index) => ({
        id: category.toLowerCase().replace(/\s+/g, '-'),
        name: category,
        icon: getCategoryIcon(category),
        count: data.data.filter(dish => getCategoryFromName(dish.name) === category).length,
        color: getCategoryColor(index)
      }));
      
      setCategories(categoryData);
      setLoading(prev => ({ ...prev, categories: false }));
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories(getFallbackCategories());
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  // Helper functions
  const getCategoryFromName = (name) => {
    const name_lower = name.toLowerCase();
    if (name_lower.includes('pizza')) return 'Pizza';
    if (name_lower.includes('burger')) return 'Burger';
    if (name_lower.includes('pasta') || name_lower.includes('italian')) return 'Italian';
    if (name_lower.includes('chinese') || name_lower.includes('noodle')) return 'Chinese';
    if (name_lower.includes('indian') || name_lower.includes('curry') || name_lower.includes('biryani')) return 'Indian';
    if (name_lower.includes('salad') || name_lower.includes('healthy')) return 'Healthy';
    if (name_lower.includes('cake') || name_lower.includes('dessert')) return 'Desserts';
    if (name_lower.includes('coffee') || name_lower.includes('tea')) return 'Beverages';
    return 'Main Course';
  };

  const getCuisineFromName = (name) => {
    const name_lower = name.toLowerCase();
    if (name_lower.includes('biryani')) return 'Hyderabadi Biryani';
    if (name_lower.includes('pizza')) return 'Italian Pizza';
    if (name_lower.includes('burger')) return 'American Burger';
    if (name_lower.includes('chinese')) return 'Chinese Cuisine';
    if (name_lower.includes('cafe')) return 'Café & Bakery';
    return 'Multi-Cuisine';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Pizza': Pizza,
      'Burger': Sandwich,
      'Italian': Utensils,
      'Chinese': ChefHat,
      'Indian': Flame,
      'Healthy': Salad,
      'Desserts': Cake,
      'Beverages': Coffee,
      'Main Course': Utensils
    };
    return icons[category] || Utensils;
  };

  const getCategoryColor = (index) => {
    const colors = [
      'from-red-500 to-orange-500',
      'from-orange-500 to-yellow-500',
      'from-green-500 to-emerald-500',
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-pink-500 to-rose-500',
      'from-indigo-500 to-blue-500',
      'from-teal-500 to-green-500'
    ];
    return colors[index % colors.length];
  };

  // Fallback data
  const getFallbackDishes = () => [
    { id: 1, name: 'Margherita Pizza', description: 'Classic pizza with fresh tomatoes, mozzarella, basil', price: 299, category: 'Pizza', rating: 4.8, deliveryTime: '20-25 min', restaurant: 'Pizza Palace', popular: true, spicy: false, veg: true, orders: 1250 },
    { id: 2, name: 'Chicken Burger', description: 'Grilled chicken patty with lettuce, tomato, special sauce', price: 199, category: 'Burger', rating: 4.7, deliveryTime: '15-20 min', restaurant: 'Burger Hub', popular: true, spicy: true, veg: false, orders: 980 },
    { id: 3, name: 'Veg Biryani', description: 'Aromatic basmati rice cooked with vegetables and spices', price: 249, category: 'Indian', rating: 4.6, deliveryTime: '25-30 min', restaurant: 'Spice Garden', popular: true, spicy: true, veg: true, orders: 876 },
    { id: 4, name: 'Chocolate Cake', description: 'Rich and moist chocolate cake with ganache', price: 149, category: 'Desserts', rating: 4.9, deliveryTime: '15-20 min', restaurant: 'Sweet Tooth', popular: true, spicy: false, veg: true, orders: 654 },
    { id: 5, name: 'Chicken Noodles', description: 'Stir-fried noodles with chicken and vegetables', price: 219, category: 'Chinese', rating: 4.5, deliveryTime: '20-25 min', restaurant: 'Asian Wok', popular: false, spicy: true, veg: false, orders: 543 },
    { id: 6, name: 'Paneer Tikka', description: 'Grilled cottage cheese with Indian spices', price: 279, category: 'Indian', rating: 4.7, deliveryTime: '20-25 min', restaurant: 'Spice Garden', popular: false, spicy: true, veg: true, orders: 432 },
    { id: 7, name: 'Cold Coffee', description: 'Refreshing cold coffee with ice cream', price: 129, category: 'Beverages', rating: 4.6, deliveryTime: '10-15 min', restaurant: 'Coffee House', popular: false, spicy: false, veg: true, orders: 321 },
    { id: 8, name: 'Caesar Salad', description: 'Fresh romaine lettuce with Caesar dressing', price: 179, category: 'Healthy', rating: 4.4, deliveryTime: '10-15 min', restaurant: 'Green Leaf', popular: false, spicy: false, veg: true, orders: 298 }
  ];

  const getFallbackRestaurants = () => [
    { id: 1, name: 'Pizza Palace', cuisine: 'Italian Pizza', rating: 4.8, reviewCount: 1245, deliveryTime: '20-30 min', deliveryFee: 'Free', minOrder: '₹199', image: null, priceRange: '₹₹', isOpen: true, featured: true, offers: ['50% OFF', 'Free Delivery'], discount: 50, distance: 0.8 },
    { id: 2, name: 'Burger Hub', cuisine: 'American Burger', rating: 4.7, reviewCount: 892, deliveryTime: '15-25 min', deliveryFee: 'Free', minOrder: '₹149', image: null, priceRange: '₹', isOpen: true, featured: true, offers: ['Buy 1 Get 1', 'Free Fries'], discount: 40, distance: 1.2 },
    { id: 3, name: 'Spice Garden', cuisine: 'Hyderabadi Biryani', rating: 4.6, reviewCount: 1342, deliveryTime: '35-45 min', deliveryFee: '₹20', minOrder: '₹299', image: null, priceRange: '₹₹', isOpen: true, featured: false, offers: ['20% OFF', 'Free Naan'], discount: 20, distance: 2.5 },
    { id: 4, name: 'Green Leaf Cafe', cuisine: 'Healthy Food', rating: 4.7, reviewCount: 567, deliveryTime: '25-35 min', deliveryFee: 'Free', minOrder: '₹199', image: null, priceRange: '₹₹', isOpen: true, featured: false, offers: ['15% OFF', 'Free Salad'], discount: 15, distance: 1.8 },
    { id: 5, name: 'Sweet Tooth', cuisine: 'Desserts & Bakery', rating: 4.8, reviewCount: 421, deliveryTime: '20-30 min', deliveryFee: '₹30', minOrder: '₹99', image: null, priceRange: '₹', isOpen: true, featured: false, offers: ['Free Cookie', 'Buy 2 Get 1'], discount: 25, distance: 0.5 },
    { id: 6, name: 'Asian Wok', cuisine: 'Chinese Cuisine', rating: 4.5, reviewCount: 678, deliveryTime: '25-35 min', deliveryFee: 'Free', minOrder: '₹249', image: null, priceRange: '₹₹', isOpen: true, featured: false, offers: ['30% OFF', 'Free Drink'], discount: 30, distance: 3.1 }
  ];

  const getFallbackCategories = () => [
    { id: 'pizza', name: 'Pizza', icon: Pizza, count: 24, color: 'from-red-500 to-orange-500' },
    { id: 'burger', name: 'Burger', icon: Sandwich, count: 18, color: 'from-orange-500 to-yellow-500' },
    { id: 'indian', name: 'Indian', icon: Flame, count: 32, color: 'from-red-500 to-rose-500' },
    { id: 'chinese', name: 'Chinese', icon: ChefHat, count: 27, color: 'from-green-500 to-emerald-500' },
    { id: 'desserts', name: 'Desserts', icon: Cake, count: 15, color: 'from-pink-500 to-purple-500' },
    { id: 'healthy', name: 'Healthy', icon: Salad, count: 22, color: 'from-teal-500 to-green-500' },
    { id: 'beverages', name: 'Beverages', icon: Coffee, count: 19, color: 'from-blue-500 to-cyan-500' },
    { id: 'italian', name: 'Italian', icon: Utensils, count: 28, color: 'from-amber-500 to-orange-500' }
  ];

  // Navigation handlers
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/Restaurants?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const viewAllRestaurants = () => {
    router.push('/Restaurants');
  };

  const viewAllDishes = () => {
    router.push('/Restaurants');
  };

  const viewDishDetails = (dishId) => {
    router.push(`/Restaurants?dish=${dishId}`);
  };

  const viewRestaurantMenu = (restaurantId) => {
    router.push(`/Restaurants/${restaurantId}`);
  };

  const viewCategory = (categoryId) => {
    router.push(`/Restaurants?category=${categoryId}`);
  };

  const handleLocationClick = () => {
    getCurrentLocation();
  };

  const weatherConditions = [
    { icon: Sun, condition: "Sunny", temp: "32°C" },
    { icon: CloudRain, condition: "Rainy", temp: "26°C" },
    { icon: CloudSnow, condition: "Cool", temp: "18°C" },
    { icon: Wind, condition: "Windy", temp: "28°C" },
  ];

  return (
    <>
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

      {/* Floating Cart Button */}
      {getCartItemCount() > 0 && (
        <>
          <button
            onClick={() => setShowCartSidebar(true)}
            className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-full shadow-2xl hover:shadow-xl transition-all transform hover:scale-110 lg:hidden"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
              {getCartItemCount()}
            </span>
          </button>

          {/* Desktop Floating Cart */}
          <div className="hidden lg:block fixed bottom-8 right-8 z-40 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Your Cart ({getCartItemCount()} items)
              </h3>
              <button
                onClick={() => setShowCartSidebar(!showCartSidebar)}
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                {showCartSidebar ? <X className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
            
            {showCartSidebar && (
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
            )}
          </div>
        </>
      )}

      {/* Mobile Cart Sidebar */}
      {showCartSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setShowCartSidebar(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Your Cart</h3>
              <button
                onClick={() => setShowCartSidebar(false)}
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
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4 text-gray-700" />
                    </button>
                    <span className="font-semibold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={cartLoading}
                      className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center"
                    >
                      {cartLoading ? (
                        <Loader className="w-4 h-4 text-white animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4 text-white" />
                      )}
                    </button>
                    <button
                      onClick={() => clearCartItem(item.id)}
                      disabled={cartLoading}
                      className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors ml-1"
                    >
                      <X className="w-4 h-4 text-red-600" />
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
      
      {/* Animated Background Elements */}
      <div className="bg-white fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-red-200/20 to-red-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-rose-200/20 to-pink-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-200/10 to-yellow-200/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-red-50/30 to-white overflow-hidden">
        <div className="container mx-auto px-4 pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-20 lg:pb-24 relative z-10">
          {/* Animated Header */}
          <div className="text-center mb-10 sm:mb-14 relative">
            <div className="absolute -top-8 sm:-top-10 left-1/2 transform -translate-x-1/2">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 animate-spin-slow" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 leading-tight animate-slide-up px-2">
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent animate-gradient">
                  Order Food.
                </span>
                <Heart className="absolute -top-2 -right-6 sm:-top-4 sm:-right-8 w-5 h-5 sm:w-8 sm:h-8 text-red-500 animate-bounce fill-red-400/20" />
              </span>
              <br className="hidden xs:block" />
              <span className="text-gray-900 relative">
                Discover the best restaurants.
                <Sparkle className="absolute -right-4 sm:-right-6 top-1/2 w-4 h-4 sm:w-6 sm:h-6 text-yellow-400 animate-pulse" />
              </span>
              <br className="hidden xs:block" />
              <span className="relative inline-block mt-2 sm:mt-0">
                <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent relative">
                  Ruchi Bazaar it!
                </span>
                <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-orange-500 blur opacity-20 rounded-full animate-pulse"></div>
              </span>
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
              From local favorites to fresh meals, everything delivered to your doorstep in minutes.
              <span className="inline-block ml-1 sm:ml-2">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 inline animate-pulse" />
              </span>
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-3xl mx-auto relative px-2 sm:px-0">
            {/* Trending Banner */}
            <div className="flex items-center justify-center gap-2 mb-5 sm:mb-6 overflow-x-auto pb-2 no-scrollbar">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-red-50 to-red-100 rounded-full border border-red-200 whitespace-nowrap">
                <Navigation className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                <span className="text-xs sm:text-sm font-medium text-red-700">Live Tracking</span>
              </div>
              <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-full border border-orange-200 whitespace-nowrap">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                <span className="text-xs sm:text-sm font-medium text-orange-700">Trending Now</span>
              </div>
              <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-red-50 to-rose-50 rounded-full border border-red-200 whitespace-nowrap">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                <span className="text-xs sm:text-sm font-medium text-red-700">Fastest Delivery</span>
              </div>
            </div>

            {/* Search Box */}
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-red-400 via-red-500 to-red-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-1000 hidden lg:block"></div>
              
              <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Food Delivery Header */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white">Food Delivery</h3>
                      <p className="text-xs sm:text-sm text-white/90">Restaurants & Dishes</p>
                    </div>
                  </div>
                </div>

                {/* Search Input */}
                <form onSubmit={handleSearch} className="p-3 sm:p-4 lg:p-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 lg:pl-5 flex items-center pointer-events-none">
                      <Search className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for restaurants, dishes, or cuisines..."
                      className="w-full pl-10 sm:pl-12 lg:pl-14 pr-24 sm:pr-28 lg:pr-32 py-3 sm:py-4 lg:py-5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base lg:text-lg placeholder-gray-400 transition-all duration-300 hover:bg-gray-50 text-gray-900"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
                      <button
                        type="submit"
                        className="px-3 sm:px-5 lg:px-6 py-1.5 sm:py-2 lg:py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-1 sm:gap-2 group text-xs sm:text-sm whitespace-nowrap"
                      >
                        <span className="hidden xs:inline">Search</span>
                        <span className="xs:hidden">Go</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform hidden xs:block" />
                      </button>
                    </div>
                  </div>
                </form>

                {/* Location & Weather */}
                <div className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] sm:text-xs text-gray-500">Delivering to</div>
                      <button 
                        onClick={handleLocationClick}
                        className="flex items-center gap-1 sm:gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors text-xs sm:text-sm"
                        disabled={isGettingLocation}
                      >
                        <span className="truncate max-w-[100px] sm:max-w-[150px]">
                          {isGettingLocation ? "Getting location..." : selectedLocation}
                        </span>
                        {isGettingLocation ? (
                          <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin flex-shrink-0" />
                        ) : (
                          <Navigation2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        )}
                      </button>
                      {locationError && (
                        <p className="text-[8px] sm:text-xs text-red-500 mt-1">{locationError}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Weather */}
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
                    {weatherConditions.map((weather, idx) => (
                      <div key={idx} className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white rounded-lg border border-gray-200 hover:scale-105 transition-transform cursor-pointer flex-shrink-0">
                        <weather.icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-500 flex-shrink-0" />
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap">{weather.temp}</div>
                          <div className="text-[8px] sm:text-xs text-gray-500 whitespace-nowrap">{weather.condition}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Restaurants Section (New) */}
      {userCoordinates && nearbyRestaurants.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-white to-red-50/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <LocateFixed className="w-6 h-6 text-red-500" />
                  Near You
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Restaurants delivering to your location
                </p>
              </div>
              <button
                onClick={() => router.push('/Restaurants?nearby=true')}
                className="text-red-600 font-semibold hover:text-red-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {loading.nearby ? (
              <div className="flex justify-center py-8">
                <Loader className="w-8 h-8 text-red-500 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyRestaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    onClick={() => viewRestaurantMenu(restaurant.id)}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                  >
                    <div className="relative h-40">
                      {getMediaUrl(restaurant.coverImage || restaurant.logo || restaurant.image, apiUrl) ? (
                        <img
                          src={getMediaUrl(restaurant.coverImage || restaurant.logo || restaurant.image, apiUrl)}
                          alt={restaurant.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={hideBrokenImage}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <ChefHat className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      {restaurant.distance && (
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                          {restaurant.distance} km
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900">{restaurant.name}</h3>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-semibold">{restaurant.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{restaurant.cuisine}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{restaurant.deliveryTime}</span>
                        <Truck className="w-3 h-3 ml-2" />
                        <span>{restaurant.deliveryFee}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Popular Dishes Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-white to-red-50/30">
        <div className="container mx-auto px-4">
          {/* Section Header with Animation */}
          <div className="text-center mb-12 relative">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl mb-6 border border-red-200/50 shadow-lg">
              <Flame className="w-6 h-6 text-red-600 animate-pulse" />
              <span className="font-bold text-red-700 text-lg">Trending Now</span>
              <Sparkles className="w-5 h-5 text-yellow-500 animate-spin-slow" />
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
              <span className="text-gray-900">Popular</span>{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                  Dishes
                </span>
                <Crown className="absolute -top-6 -right-8 w-8 h-8 text-yellow-500 rotate-12" />
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Most ordered dishes this week from top restaurants
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {['all', 'Pizza', 'Burger', 'Indian', 'Chinese', 'Desserts'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tab === 'all' ? 'All Dishes' : tab}
              </button>
            ))}
          </div>

          {loading.dishes ? (
            <div className="flex justify-center py-12">
              <Loader className="w-10 h-10 text-red-500 animate-spin" />
            </div>
          ) : (
            <>
              {/* Dishes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {popularDishes
                  .filter(dish => activeTab === 'all' || dish.category === activeTab)
                  .map((dish, index) => (
                  <div
                    key={dish.id}
                    className="group relative bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-red-200 transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Discount Badge */}
                    {dish.popular && (
                      <div className="absolute top-4 left-4 z-10">
                        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg animate-pulse">
                          <Flame className="w-3 h-3" />
                          <span>Popular</span>
                        </div>
                      </div>
                    )}

                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden">
                      {dish.image ? (
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={hideBrokenImage}
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${
                          dish.category === 'Pizza' ? 'from-red-100 to-orange-100' :
                          dish.category === 'Burger' ? 'from-amber-100 to-yellow-100' :
                          dish.category === 'Indian' ? 'from-orange-100 to-red-100' :
                          dish.category === 'Chinese' ? 'from-green-100 to-teal-100' :
                          dish.category === 'Desserts' ? 'from-pink-100 to-rose-100' :
                          'from-gray-100 to-gray-200'
                        } flex items-center justify-center`}>
                          {dish.category === 'Pizza' && <Pizza className="w-16 h-16 text-gray-400" />}
                          {dish.category === 'Burger' && <Sandwich className="w-16 h-16 text-gray-400" />}
                          {dish.category === 'Indian' && <Flame className="w-16 h-16 text-gray-400" />}
                          {dish.category === 'Chinese' && <ChefHat className="w-16 h-16 text-gray-400" />}
                          {dish.category === 'Desserts' && <Cake className="w-16 h-16 text-gray-400" />}
                          {!['Pizza','Burger','Indian','Chinese','Desserts'].includes(dish.category) && 
                            <Utensils className="w-16 h-16 text-gray-400" />
                          }
                        </div>
                      )}

                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Order Count */}
                      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-lg">
                        🛵 {dish.orders}+ orders
                      </div>

                      {/* Quick Add Indicator */}
                      {cart[dish.id] && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg animate-bounce">
                          <span className="font-bold">{cart[dish.id].quantity}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
                          {dish.name}
                        </h3>
                        <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-amber-50 px-2 py-1 rounded-lg">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold text-sm">{dish.rating}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 mb-3 line-clamp-1">{dish.restaurant}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {dish.veg && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Veg
                          </span>
                        )}
                        {dish.spicy && (
                          <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full flex items-center gap-1">
                            <Flame className="w-3 h-3" />
                            Spicy
                          </span>
                        )}
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                          {dish.deliveryTime}
                        </span>
                      </div>

                      {/* Price and Action */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-red-600">{currencySymbol}{dish.price}</span>
                          <span className="text-xs text-gray-500 ml-1">+ tax</span>
                        </div>
                        
                        {cart[dish.id] ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromCart(dish.id);
                              }}
                              disabled={cartLoading}
                              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                              <Minus className="w-4 h-4 text-gray-700" />
                            </button>
                            <span className="font-semibold w-6 text-center">
                              {cart[dish.id].quantity}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(dish);
                              }}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(dish);
                            }}
                            disabled={cartLoading}
                            className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-white hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                          >
                            {cartLoading ? (
                              <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                              <ShoppingCart className="w-5 h-5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button */}
              <div className="text-center mt-12">
                <button
                  onClick={viewAllDishes}
                  className="group px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
                >
                  <span>Explore All Dishes</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Categories Section */}
      {/* <CategoriesSection categories={categories} onCategoryClick={viewCategory} loading={loading.categories} /> */}

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Popular Restaurants Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-red-50/30 to-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12 relative">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-2xl mb-6 border border-orange-200/50 shadow-lg">
              <Crown className="w-6 h-6 text-orange-600 animate-bounce" />
              <span className="font-bold text-orange-700 text-lg">Top Rated</span>
              <Target className="w-5 h-5 text-red-500 animate-pulse" />
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
              <span className="text-gray-900">Popular</span>{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-orange-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                  Restaurants
                </span>
                <Rocket className="absolute -top-6 -right-8 w-8 h-8 text-orange-500 -rotate-12" />
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hand-picked top restaurants with amazing offers
            </p>
          </div>

          {loading.restaurants ? (
            <div className="flex justify-center py-12">
              <Loader className="w-10 h-10 text-red-500 animate-spin" />
            </div>
          ) : (
            <>
              {/* Restaurants Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {popularRestaurants.map((restaurant, index) => (
                  <div
                    key={restaurant.id}
                    onClick={() => viewRestaurantMenu(restaurant.id)}
                    className="group relative bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-red-200 transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Discount Badge */}
                    {restaurant.discount && (
                      <div className="absolute top-4 left-4 z-10">
                        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full flex items-center gap-1 shadow-lg">
                          <Tag className="w-4 h-4" />
                          <span>{restaurant.discount}% OFF</span>
                        </div>
                      </div>
                    )}

                    {/* Featured Badge */}
                    {restaurant.featured && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                          <Crown className="w-3 h-3" />
                          <span>Featured</span>
                        </div>
                      </div>
                    )}

                    {/* Distance Badge */}
                    {restaurant.distance && (
                      <div className="absolute bottom-20 left-4 z-10">
                        <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Navigation className="w-3 h-3" />
                          <span>{restaurant.distance} km away</span>
                        </div>
                      </div>
                    )}

                    {/* Image Container */}
                    <div className="relative h-56 overflow-hidden">
                      {restaurant.image ? (
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={hideBrokenImage}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <ChefHat className="w-20 h-20 text-gray-400" />
                        </div>
                      )}

                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                      {/* Open/Closed Status */}
                      {!restaurant.isOpen && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-lg">Closed Now</span>
                        </div>
                      )}

                      {/* Delivery Info Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-semibold">{restaurant.deliveryTime}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <Truck className="w-4 h-4" />
                          <span className="text-sm font-semibold">{restaurant.deliveryFee}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 group-hover:text-red-600 transition-colors mb-1">
                            {restaurant.name}
                          </h3>
                          <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-amber-50 px-3 py-2 rounded-lg">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold">{restaurant.rating}</span>
                          <span className="text-xs text-gray-500">({restaurant.reviewCount})</span>
                        </div>
                      </div>

                      {/* Price Range and Min Order */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                          {restaurant.priceRange}
                        </span>
                        <span className="text-sm text-gray-500">
                          Min {restaurant.minOrder}
                        </span>
                      </div>

                      {/* Offers */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {restaurant.offers.map((offer, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200 flex items-center gap-1"
                          >
                            <Gift className="w-3 h-3" />
                            {offer}
                          </span>
                        ))}
                      </div>

                      {/* Action Button */}
                      <button className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn">
                        <span>View Menu</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button */}
              <div className="text-center mt-12">
                <button
                  onClick={viewAllRestaurants}
                  className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
                >
                  <span>Explore All Restaurants</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Achievements Section */}
      <AchievementsSection />

      {/* Special Offer */}
      <SpecialOffer />

      {/* Footer */}
      <Footer />

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-slide-up {
          animation: slide-up 1s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        @media (min-width: 480px) {
          .xs\\:block { display: block; }
          .xs\\:inline { display: inline; }
          .xs\\:hidden { display: none; }
        }
      `}</style>
    </>
  );
};

export default Page;

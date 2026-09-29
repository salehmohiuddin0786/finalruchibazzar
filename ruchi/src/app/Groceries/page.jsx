"use client";

import React, { useState } from 'react';
import { 
  Search, Filter, Star, Clock, DollarSign, MapPin, 
  ChevronRight, Heart, CheckCircle, Truck, Shield,
  Zap, Flame, Leaf, Sparkles, Award, Coffee, Pizza,
  Sandwich, Salad, Cake, ChefHat, ThumbsUp,
  TrendingUp, ShoppingBag, Navigation, Thermometer,
  Users, Crown, Rocket, Percent, Tag, Bell, ArrowRight,
  ShoppingCart, Package, Apple, Carrot, Milk, Croissant,
  Fish, Beef, Egg, Wine, Home,
  Settings, User, Menu, X, ChevronDown
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const GroceriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Grocery categories
 const categories = [
  { id: 'all', label: 'All', icon: ShoppingCart, count: 245 },
  { id: 'fruits', label: 'Fruits', icon: Apple, count: 45 },
  { id: 'vegetables', label: 'Vegetables', icon: Carrot, count: 38 },
  { id: 'dairy', label: 'Dairy & Eggs', icon: Milk, count: 52 },
  { id: 'bakery', label: 'Bakery', icon: Croissant, count: 28 }, // Changed from Bread to Croissant
  { id: 'meat', label: 'Meat & Fish', icon: Fish, count: 36 },
  { id: 'beverages', label: 'Beverages', icon: Wine, count: 67 },
  { id: 'snacks', label: 'Snacks', icon: Package, count: 89 },
];
  // Grocery items
  const groceryItems = [
    {
      id: 1,
      name: "Fresh Apples",
      category: "fruits",
      brand: "Organic Farms",
      price: 3.99,
      unit: "per kg",
      rating: 4.7,
      reviewCount: 234,
      imageColor: "from-red-100 to-pink-100",
      tags: ["Organic", "Fresh", "Local"],
      deliveryTime: "30-45 min",
      stock: "In Stock",
      discount: 10,
      originalPrice: 4.44,
    },
    {
      id: 2,
      name: "Carrots",
      category: "vegetables",
      brand: "Farm Fresh",
      price: 1.99,
      unit: "per bunch",
      rating: 4.5,
      reviewCount: 189,
      imageColor: "from-orange-100 to-amber-100",
      tags: ["Organic", "Vitamin Rich"],
      deliveryTime: "30-45 min",
      stock: "In Stock",
    },
    {
      id: 3,
      name: "Fresh Milk",
      category: "dairy",
      brand: "Daily Dairy",
      price: 2.49,
      unit: "1 liter",
      rating: 4.8,
      reviewCount: 456,
      imageColor: "from-blue-50 to-cyan-50",
      tags: ["Pasteurized", "Fresh"],
      deliveryTime: "30-45 min",
      stock: "In Stock",
      discount: 15,
      originalPrice: 2.93,
    },
    {
      id: 4,
      name: "Whole Wheat Bread",
      category: "bakery",
      brand: "Bakery Delight",
      price: 3.29,
      unit: "500g loaf",
      rating: 4.6,
      reviewCount: 321,
      imageColor: "from-amber-100 to-yellow-100",
      tags: ["Whole Grain", "Fresh"],
      deliveryTime: "30-45 min",
      stock: "Low Stock",
    },
    {
      id: 5,
      name: "Salmon Fillet",
      category: "meat",
      brand: "Ocean Fresh",
      price: 12.99,
      unit: "per 500g",
      rating: 4.9,
      reviewCount: 567,
      imageColor: "from-blue-100 to-indigo-100",
      tags: ["Fresh Catch", "Boneless"],
      deliveryTime: "45-60 min",
      stock: "In Stock",
      discount: 20,
      originalPrice: 16.24,
    },
    {
      id: 6,
      name: "Orange Juice",
      category: "beverages",
      brand: "Juice King",
      price: 4.99,
      unit: "1 liter",
      rating: 4.4,
      reviewCount: 278,
      imageColor: "from-orange-50 to-yellow-50",
      tags: ["No Sugar Added", "Fresh"],
      deliveryTime: "30-45 min",
      stock: "In Stock",
    },
    {
      id: 7,
      name: "Potato Chips",
      category: "snacks",
      brand: "Crunchy",
      price: 2.99,
      unit: "150g pack",
      rating: 4.3,
      reviewCount: 412,
      imageColor: "from-yellow-50 to-amber-50",
      tags: ["Premium", "BBQ Flavor"],
      deliveryTime: "30-45 min",
      stock: "In Stock",
      discount: 25,
      originalPrice: 3.99,
    },
    {
      id: 8,
      name: "Free Range Eggs",
      category: "dairy",
      brand: "Happy Hens",
      price: 4.99,
      unit: "12 pieces",
      rating: 4.7,
      reviewCount: 389,
      imageColor: "from-rose-50 to-pink-50",
      tags: ["Free Range", "Organic"],
      deliveryTime: "30-45 min",
      stock: "In Stock",
    },
    {
      id: 9,
      name: "Broccoli",
      category: "vegetables",
      brand: "Green Valley",
      price: 2.49,
      unit: "per piece",
      rating: 4.6,
      reviewCount: 215,
      imageColor: "from-green-100 to-emerald-100",
      tags: ["Fresh", "Rich in Fiber"],
      deliveryTime: "30-45 min",
      stock: "In Stock",
    },
    {
      id: 10,
      name: "Greek Yogurt",
      category: "dairy",
      brand: "Creamy Delight",
      price: 3.99,
      unit: "500g",
      rating: 4.8,
      reviewCount: 298,
      imageColor: "from-white to-gray-100",
      tags: ["High Protein", "No Added Sugar"],
      deliveryTime: "30-45 min",
      stock: "In Stock",
      discount: 10,
      originalPrice: 4.43,
    },
    {
      id: 11,
      name: "Bananas",
      category: "fruits",
      brand: "Tropical",
      price: 2.99,
      unit: "per kg",
      rating: 4.5,
      reviewCount: 345,
      imageColor: "from-yellow-100 to-amber-100",
      tags: ["Ripe", "Sweet"],
      deliveryTime: "30-45 min",
      stock: "In Stock",
    },
    {
      id: 12,
      name: "Mineral Water",
      category: "beverages",
      brand: "Pure Springs",
      price: 0.99,
      unit: "1 liter",
      rating: 4.2,
      reviewCount: 156,
      imageColor: "from-blue-50 to-cyan-50",
      tags: ["Natural", "Spring Water"],
      deliveryTime: "30-45 min",
      stock: "In Stock",
    },
  ];

  // Add to cart function
  const addToCart = (item) => {
    setCartItems([...cartItems, { ...item, quantity: 1 }]);
  };

  // Filter items based on category and search
  const filteredItems = groceryItems.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.brand.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Remove from cart function
  const removeFromCart = (index) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
  };

  // Update quantity function
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(index);
      return;
    }
    
    const newCartItems = [...cartItems];
    newCartItems[index].quantity = newQuantity;
    setCartItems(newCartItems);
  };

  // Calculate cart total
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
    <Navbar />
     
      <div className="bg-white min-h-screen">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 py-8 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                  Fresh Groceries Delivered to <span className="text-yellow-200">Your Door</span>
                </h1>
                <p className="text-xl text-white/90 mb-6 max-w-2xl">
                  From farm-fresh produce to pantry essentials. Quality guaranteed, delivered fresh daily.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Truck className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">Free delivery over $25</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Shield className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">Freshness guarantee</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-black text-white">30min</div>
                  <div className="text-white/80 text-sm">Avg. Delivery</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-8 h-8 text-white fill-white" />
                  </div>
                  <div className="text-3xl font-black text-white">4.8★</div>
                  <div className="text-white/80 text-sm">Avg. Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Special Offers */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <div className="flex items-center gap-2">
                <Percent className="w-5 h-5" />
                <span className="font-semibold">New Customer Offer: 20% OFF First Order</span>
              </div>
              <div className="hidden md:block">•</div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                <span className="font-semibold">Free Delivery on Orders Over $25</span>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Categories */}
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
              </div>
              <button className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2">
                View All
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    <div className={`p-3 rounded-full mb-2 ${
                      selectedCategory === category.id
                        ? 'bg-white/20'
                        : 'bg-white shadow-sm'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        selectedCategory === category.id
                          ? 'text-white'
                          : 'text-gray-600'
                      }`} />
                    </div>
                    <span className="font-semibold text-sm text-center">{category.label}</span>
                    <span className={`text-xs px-2 py-1 rounded-full mt-2 ${
                      selectedCategory === category.id
                        ? 'bg-white/20'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deals Banner */}
          <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 p-8 text-white">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative flex flex-col md:flex-row items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Tag className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold">Weekly Mega Sale!</h3>
                </div>
                <h3 className="text-4xl font-black mb-4">Up to 50% OFF Fresh Produce</h3>
                <p className="text-white/90 mb-6 text-lg">Limited time offer • Quality guaranteed</p>
              </div>
              <button className="group px-8 py-4 bg-white text-red-600 font-bold rounded-xl hover:bg-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5">
                <span className="flex items-center gap-3">
                  Shop Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
            </div>
          </div>

          {/* Results Header */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredItems.length} Fresh Products
              </h2>
              <p className="text-gray-600">
                {selectedCategory !== 'all' ? 
                  `Showing ${categories.find(c => c.id === selectedCategory)?.label}` : 
                  'All grocery items'
                }
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select className="appearance-none bg-white border-2 border-gray-200 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-green-500">
                  <option>Sort by: Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating: High to Low</option>
                  <option>Newest First</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </div>
              </div>
              <button className="lg:hidden flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg">
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-green-200 transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.imageColor}`} />
                  
                  {/* Discount Badge */}
                  {item.discount && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                      {item.discount}% OFF
                    </div>
                  )}
                  
                  {/* Stock Status */}
                  <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${
                    item.stock === 'In Stock' 
                      ? 'bg-green-100 text-green-800'
                      : item.stock === 'Low Stock'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.stock}
                  </div>
                  
                  {/* Quick View Button */}
                  <button className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg">
                    <EyeIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <div className="mb-3">
                    <span className="text-sm text-gray-500">{item.brand}</span>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(item.rating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{item.rating}</span>
                    <span className="text-sm text-gray-400">({item.reviewCount})</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">${item.price.toFixed(2)}</span>
                        <span className="text-sm text-gray-500">{item.unit}</span>
                      </div>
                      {item.discount && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400 line-through">${item.originalPrice.toFixed(2)}</span>
                          <span className="text-sm text-red-500 font-semibold">Save {item.discount}%</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="group/btn flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transition-all duration-300"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span className="hidden sm:inline">Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
              <div className="w-32 h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">No products found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Try adjusting your search or select a different category. We have many fresh products waiting for you!
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transition-all duration-300 flex items-center gap-3 mx-auto"
              >
                <Filter className="w-5 h-5" />
                Clear Filters
              </button>
            </div>
          )}

          {/* Load More */}
          {filteredItems.length > 0 && (
            <div className="text-center mt-12">
              <button className="group px-10 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-green-500 hover:text-green-600 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-3 mx-auto">
                <span>Load More Products</span>
                <div className="w-8 h-8 bg-gray-100 group-hover:bg-green-50 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 group-hover:text-green-600 transition-colors" />
                </div>
              </button>
            </div>
          )}

          {/* Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Free & Fast Delivery</h3>
              <p className="text-gray-600">
                Free delivery on orders over $25. Same-day delivery available in select areas.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-200">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Guarantee</h3>
              <p className="text-gray-600">
                Freshness guaranteed. If you&apos;re not satisfied, we&apos;ll refund or replace your items.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-8 rounded-2xl border border-amber-200">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fresh & Organic</h3>
              <p className="text-gray-600">
                Sourced from local farms and trusted suppliers. Wide selection of organic products.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 transition-opacity"
            onClick={() => setShowCart(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white z-50 shadow-2xl transform transition-transform">
            <div className="flex flex-col h-full">
              {/* Cart Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-6 h-6 text-gray-700" />
                    <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
                    <span className="w-6 h-6 bg-green-500 text-white text-sm rounded-full flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowCart(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-6">Add some delicious items to get started!</p>
                    <button
                      onClick={() => setShowCart(false)}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${item.imageColor}`} />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h4>
                          <p className="text-sm text-gray-500">{item.brand}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => updateQuantity(index, item.quantity - 1)}
                                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                              >
                                -
                              </button>
                              <span className="font-semibold min-w-[20px] text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(index, item.quantity + 1)}
                                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(index)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-gray-200 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transition-all">
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={() => setShowCart(false)}
                    className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-green-500 hover:text-green-600 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Footer */}
     <Footer />
    </>
  );
};

// Custom Eye icon component
const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export default GroceriesPage;
"use client";
import React from 'react';
import { Star, Clock, ArrowRight, ShoppingCart, Sparkles, Flame, Zap, Award } from 'lucide-react';
import Image from 'next/image';

const PopularRestaurants = () => {
  const popularRestaurants = [
    { 
      id: 1,
      name: "Burger King", 
      rating: 4.3, 
      time: "25-30 min", 
      cuisine: "Burgers, American", 
      image: '/BurgerKing.jpg',
      tag: "🔥 Hot Deal",
      badge: "Most Popular",
      discount: "20% OFF"
    },
    { 
      id: 2,
      name: "Domino's Pizza", 
      rating: 4.5, 
      time: "20-25 min", 
      cuisine: "Pizza, Italian", 
      image: '/DominosPizza.jpg',
      tag: "⚡ Fastest",
      badge: "Trending",
      discount: "BUY 1 GET 1"
    },
    { 
      id: 3,
      name: "Haldiram's", 
      rating: 4.6, 
      time: "30-35 min", 
      cuisine: "North Indian, Sweets", 
      image: '/Haldiram.jpg',
      tag: "🏆 Top Rated",
      badge: "Premium",
      discount: "Free Dessert"
    },
    { 
      id: 4,
      name: "Subway", 
      rating: 4.2, 
      time: "15-20 min", 
      cuisine: "Sandwiches, Healthy", 
      image: '/subway.jpg',
      tag: "🥗 Healthy",
      badge: "Fresh Choice",
      discount: "15% OFF"
    },
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 via-white to-red-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-red-100 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-red-100 to-transparent rounded-full translate-x-1/3 translate-y-1/3 blur-3xl opacity-30"></div>
      
      <div className="container mx-auto px-4 relative">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-16">
          <div className="mb-8 lg:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white font-bold text-sm">PREMIUM DINING</span>
              </div>
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Popular <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Restaurants</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl">
              Discover the most loved restaurants in your area. Curated by our food experts for an exceptional dining experience.
            </p>
          </div>
          
          <button className="group relative px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold rounded-2xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-red-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
            <div className="relative flex items-center gap-3">
              <span className="text-lg">View All Restaurants</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-50 rounded-xl">
                <Flame className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-gray-600">Active Restaurants</div>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-50 rounded-xl">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">15-30</div>
                <div className="text-gray-600">Avg. Delivery Time</div>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-50 rounded-xl">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">4.5+</div>
                <div className="text-gray-600">Avg. Rating</div>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 rounded-xl">
                <Award className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-gray-600">Food Safety</div>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {popularRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="group relative">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-all duration-700 group-hover:scale-105"></div>
              
              {/* Main Card */}
              <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-200/50 hover:border-red-200 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group-hover:shadow-red-500/10">
                {/* Image Section */}
                <div className="h-64 relative overflow-hidden">
                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <div className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-full text-sm shadow-lg">
                      {restaurant.discount}
                    </div>
                  </div>
                  
                  {/* Tag Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-gray-900 font-bold rounded-full text-xs flex items-center gap-1 shadow-lg">
                      {restaurant.tag}
                    </div>
                  </div>
                  
                  {/* Image Placeholder with Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-600 to-orange-500 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent blur-xl"></div>
                      <div className="text-white text-5xl font-bold relative">
                        {restaurant.name.charAt(0)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Rating Badge */}
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-gray-900">{restaurant.rating}</span>
                    <span className="text-gray-600 text-sm">/5</span>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-6">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full mb-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-gray-700">{restaurant.badge}</span>
                  </div>
                  
                  {/* Name and Time */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{restaurant.name}</h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{restaurant.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cuisine */}
                  <p className="text-gray-600 mb-6 leading-relaxed">{restaurant.cuisine}</p>
                  
                  {/* Order Button */}
                  <button className="w-full group/btn relative px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/30 flex items-center justify-center gap-3">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl blur-md opacity-0 group-hover/btn:opacity-70 transition-opacity duration-500"></div>
                    <ShoppingCart className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Order Now</span>
                    <ArrowRight className="w-4 h-4 relative z-10 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Live Tracking</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Contactless Delivery</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>24/7 Support</span>
            </div>
          </div>
          <p className="text-gray-600 mb-8">
            All restaurants follow strict hygiene and safety protocols
          </p>
        </div>
      </div>
    </div>
  );
};

export default PopularRestaurants;
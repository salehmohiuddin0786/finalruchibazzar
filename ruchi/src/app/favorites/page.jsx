"use client"
import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { 
  Heart,
  Star,
  Clock,
  MapPin,
  ShoppingBag,
  Utensils,
  Store,
  Truck,
  X,
  ChevronRight,
  Filter,
  Search,
  CheckCircle,
  Flame,
  Award,
  Shield
} from 'lucide-react'

const Page = () => {
  const [activeTab, setActiveTab] = useState('restaurants')
  const [searchQuery, setSearchQuery] = useState('')

  // Favorite Restaurants
  const favoriteRestaurants = [
    {
      id: 1,
      name: 'Food Palace',
      cuisine: 'North Indian, Chinese',
      rating: 4.5,
      deliveryTime: '25-35 mins',
      minOrder: '₹199',
      deliveryFee: '₹29',
      isOpen: true,
      offers: ['20% OFF', 'Free Delivery'],
      image: '🏮',
      favoriteSince: 'Added 2 weeks ago',
      lastOrdered: 'Yesterday',
      tags: ['Popular', 'Great Taste']
    },
    {
      id: 2,
      name: 'Pizza Corner',
      cuisine: 'Italian, Fast Food',
      rating: 4.3,
      deliveryTime: '20-30 mins',
      minOrder: '₹249',
      deliveryFee: '₹29',
      isOpen: true,
      offers: ['30% OFF', 'Combo Deal'],
      image: '🍕',
      favoriteSince: 'Added 1 month ago',
      lastOrdered: '3 days ago',
      tags: ['Best Seller', 'Fast Delivery']
    },
    {
      id: 3,
      name: 'Burger Hub',
      cuisine: 'American, Fast Food',
      rating: 4.2,
      deliveryTime: '15-25 mins',
      minOrder: '₹149',
      deliveryFee: '₹19',
      isOpen: true,
      offers: ['Buy 1 Get 1', 'Free Fries'],
      image: '🍔',
      favoriteSince: 'Added 3 days ago',
      lastOrdered: 'Never ordered',
      tags: ['New', 'Trending']
    },
    {
      id: 4,
      name: 'Sushi Express',
      cuisine: 'Japanese, Asian',
      rating: 4.7,
      deliveryTime: '30-40 mins',
      minOrder: '₹299',
      deliveryFee: '₹39',
      isOpen: false,
      offers: ['15% OFF'],
      image: '🍣',
      favoriteSince: 'Added 2 months ago',
      lastOrdered: '1 week ago',
      tags: ['Premium', 'Healthy']
    }
  ]

  // Favorite Grocery Stores
  const favoriteStores = [
    {
      id: 1,
      name: 'FreshMart Supermarket',
      category: 'Groceries & Essentials',
      rating: 4.8,
      deliveryTime: '30-45 mins',
      minOrder: '₹99',
      deliveryFee: '₹19',
      isOpen: true,
      offers: ['10% OFF', 'Free Delivery'],
      image: '🛒',
      favoriteSince: 'Added 1 month ago',
      items: ['Fresh Vegetables', 'Dairy', 'Snacks'],
      tags: ['Fresh', '24/7']
    },
    {
      id: 2,
      name: 'Daily Needs',
      category: 'Daily Essentials',
      rating: 4.4,
      deliveryTime: 'Within 1 hour',
      minOrder: '₹149',
      deliveryFee: '₹29',
      isOpen: true,
      offers: ['Cashback 5%'],
      image: '🥛',
      favoriteSince: 'Added 2 weeks ago',
      items: ['Milk', 'Bread', 'Eggs'],
      tags: ['Reliable', 'Fast']
    },
    {
      id: 3,
      name: 'Health & Wellness',
      category: 'Organic & Healthy',
      rating: 4.6,
      deliveryTime: '45-60 mins',
      minOrder: '₹199',
      deliveryFee: '₹39',
      isOpen: true,
      offers: ['15% OFF Organic'],
      image: '🥦',
      favoriteSince: 'Added 3 months ago',
      items: ['Organic Food', 'Supplements'],
      tags: ['Organic', 'Healthy']
    }
  ]

  // Favorite Items
  const favoriteItems = [
    {
      id: 1,
      name: 'Butter Chicken',
      restaurant: 'Food Palace',
      price: '₹349',
      category: 'Main Course',
      rating: 4.8,
      orders: 125,
      image: '🍛',
      tags: ['Spicy', 'Best Seller']
    },
    {
      id: 2,
      name: 'Margherita Pizza',
      restaurant: 'Pizza Corner',
      price: '₹299',
      category: 'Pizza',
      rating: 4.5,
      orders: 89,
      image: '🍕',
      tags: ['Vegetarian', 'Classic']
    },
    {
      id: 3,
      name: 'Fresh Vegetables Pack',
      store: 'FreshMart Supermarket',
      price: '₹249',
      category: 'Groceries',
      rating: 4.7,
      orders: 56,
      image: '🥦',
      tags: ['Fresh', 'Daily']
    },
    {
      id: 4,
      name: 'Cold Coffee',
      restaurant: 'Burger Hub',
      price: '₹149',
      category: 'Beverages',
      rating: 4.3,
      orders: 203,
      image: '☕',
      tags: ['Cold', 'Refreshing']
    }
  ]

  // Recently Viewed
  const recentlyViewed = [
    {
      id: 1,
      name: 'Chinese Wok',
      type: 'restaurant',
      viewed: '2 hours ago'
    },
    {
      id: 2,
      name: 'Bakery Items',
      type: 'grocery',
      viewed: '1 day ago'
    },
    {
      id: 3,
      name: 'Ice Cream',
      type: 'item',
      viewed: '2 days ago'
    }
  ]

  const removeFavorite = (id, type) => {
    // In a real app, you would update state/API here
    console.log(`Removed ${type} with id ${id}`)
  }

  const getFilteredItems = () => {
    let items = []
    
    switch(activeTab) {
      case 'restaurants':
        items = favoriteRestaurants
        break
      case 'stores':
        items = favoriteStores
        break
      case 'items':
        items = favoriteItems
        break
      default:
        items = [...favoriteRestaurants, ...favoriteStores, ...favoriteItems]
    }

    if (searchQuery) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.cuisine && item.cuisine.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    return items
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Your Favorites</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              All your favorite restaurants, grocery stores, and items in one place. Reorder quickly and never miss a deal!
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-grow max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your favorites..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
                />
              </div>

              {/* Filter Button */}
              <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-300">
                <Filter className="w-5 h-5" />
                <span className="font-medium">Filter</span>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Left Column - Navigation & Stats */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Tabs Navigation */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-1">
                  {[
                    { id: 'all', label: 'All Favorites', count: favoriteRestaurants.length + favoriteStores.length + favoriteItems.length, icon: <Heart className="w-4 h-4" /> },
                    { id: 'restaurants', label: 'Restaurants', count: favoriteRestaurants.length, icon: <Utensils className="w-4 h-4" /> },
                    { id: 'stores', label: 'Grocery Stores', count: favoriteStores.length, icon: <Store className="w-4 h-4" /> },
                    { id: 'items', label: 'Favorite Items', count: favoriteItems.length, icon: <ShoppingBag className="w-4 h-4" /> }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg mb-1 last:mb-0 transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-orange-50 text-orange-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {tab.icon}
                        <span className="font-medium">{tab.label}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        activeTab === tab.id
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Your Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-orange-100">Total Favorites</span>
                    <span className="font-bold text-xl">{favoriteRestaurants.length + favoriteStores.length + favoriteItems.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-100">Restaurants</span>
                    <span className="font-bold">{favoriteRestaurants.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-100">Grocery Stores</span>
                    <span className="font-bold">{favoriteStores.length}</span>
                  </div>
                  <div className="pt-3 border-t border-orange-400">
                    <div className="text-sm text-orange-200">
                      Most ordered: Food Palace (12 times)
                    </div>
                  </div>
                </div>
              </div>

              {/* Recently Viewed */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recently Viewed
                </h3>
                <div className="space-y-3">
                  {recentlyViewed.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          item.type === 'restaurant' ? 'bg-orange-100 text-orange-600' :
                          item.type === 'grocery' ? 'bg-green-100 text-green-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {item.type === 'restaurant' ? '🍽️' :
                           item.type === 'grocery' ? '🛒' : '📦'}
                        </div>
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{item.viewed}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Favorites List */}
            <div className="lg:col-span-3">
              
              {/* Empty State */}
              {getFilteredItems().length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center">
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {searchQuery ? 'No favorites found' : 'No favorites yet'}
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    {searchQuery ? 'Try searching for something else' : 'Start adding your favorite restaurants, stores, and items to see them here!'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-300">
                      Browse Restaurants
                    </button>
                    <button className="border-2 border-orange-500 text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-300">
                      Shop Groceries
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Header for active tab */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {activeTab === 'all' ? 'All Your Favorites' :
                       activeTab === 'restaurants' ? 'Favorite Restaurants' :
                       activeTab === 'stores' ? 'Favorite Grocery Stores' :
                       'Favorite Items'}
                    </h2>
                    <span className="text-gray-600">
                      {getFilteredItems().length} items
                    </span>
                  </div>

                  {/* Favorites Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {getFilteredItems().map((item) => (
                      <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 group">
                        
                        {/* Item Header */}
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                              <div className={`text-3xl p-3 rounded-xl ${
                                activeTab === 'stores' || item.store ? 'bg-green-100' : 'bg-orange-100'
                              }`}>
                                {item.image}
                              </div>
                              <div>
                                <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  {item.cuisine && (
                                    <span className="text-sm text-gray-600">{item.cuisine}</span>
                                  )}
                                  {item.category && (
                                    <span className="text-sm text-gray-600">{item.category}</span>
                                  )}
                                  {item.store && (
                                    <span className="text-sm text-gray-500">from {item.store}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => removeFavorite(item.id, activeTab)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Remove from favorites"
                            >
                              <Heart className="w-5 h-5 fill-current" />
                            </button>
                          </div>

                          {/* Rating & Info */}
                          <div className="flex flex-wrap items-center gap-4 mb-4">
                            <div className="flex items-center gap-1">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-semibold text-gray-900 ml-1">{item.rating}</span>
                            </div>
                            
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              {item.deliveryTime || 'Quick Delivery'}
                            </div>

                            {item.minOrder && (
                              <div className="text-sm text-gray-600">
                                Min. {item.minOrder}
                              </div>
                            )}
                          </div>

                          {/* Tags */}
                          {item.tags && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {item.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Offers */}
                          {item.offers && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {item.offers.map((offer, index) => (
                                <span key={index} className="px-3 py-1 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 text-sm font-semibold rounded-full flex items-center gap-1">
                                  <Flame className="w-3 h-3" />
                                  {offer}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Additional Info */}
                          <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
                            <div>
                              {item.favoriteSince && (
                                <span className="flex items-center gap-1">
                                  <Heart className="w-4 h-4" />
                                  {item.favoriteSince}
                                </span>
                              )}
                              {item.lastOrdered && (
                                <div className="mt-1">
                                  Last ordered: {item.lastOrdered}
                                </div>
                              )}
                            </div>
                            
                            <div className="text-right">
                              {item.price && (
                                <div className="text-2xl font-bold text-gray-900">{item.price}</div>
                              )}
                              {item.deliveryFee && (
                                <div className="text-sm">
                                  Delivery: {item.deliveryFee === '₹0' ? 'FREE' : item.deliveryFee}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="border-t border-gray-100 p-5 bg-gray-50">
                          <div className="flex gap-3">
                            <button className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2">
                              {activeTab === 'stores' ? 'Shop Now' : 'Order Now'}
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {!item.isOpen && (
                              <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300">
                                View Menu
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Recommendations */}
              {getFilteredItems().length > 0 && (
                <div className="mt-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Based on Your Favorites</h2>
                    <button className="text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1">
                      See more <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { name: 'Similar Restaurants', count: 8, icon: '🍽️' },
                      { name: 'Popular Items', count: 12, icon: '🔥' },
                      { name: 'New in Your Area', count: 5, icon: '🆕' }
                    ].map((rec, index) => (
                      <div key={index} className="bg-white rounded-xl p-4 border border-gray-200 hover:border-orange-300 transition-colors duration-300">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{rec.icon}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{rec.name}</h4>
                            <p className="text-sm text-gray-600">{rec.count} suggestions</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}

export default Page
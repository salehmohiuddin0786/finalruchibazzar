"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';
import { 
  Tag, 
  Percent, 
  Clock, 
  ShoppingBag, 
  Coffee, 
  Pizza, 
  ShoppingCart, 
  Truck,
  Shield,
  Star,
  MapPin,
  ChevronRight,
  Sparkles,
  Gift,
  Zap,
  Award,
  Crown,
  Rocket,
  Loader,
  X,
  CheckCircle,
  Copy,
  Heart
} from 'lucide-react'

const Page = () => {
  const router = useRouter();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Fetch offers from backend
  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/offers`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }
      
      const result = await response.json();
      
      // Transform offers data
      const transformedOffers = result.data.map((offer, index) => ({
        id: offer.id,
        title: offer.title,
        discount: `${offer.discountPercent}% OFF`,
        description: getOfferDescription(offer.title, offer.discountPercent),
        code: offer.couponCode,
        validFrom: offer.validFrom ? new Date(offer.validFrom).toLocaleDateString() : 'Now',
        validUntil: offer.validTo ? new Date(offer.validTo).toLocaleDateString() : 'Ongoing',
        isActive: offer.isActive,
        category: getOfferCategory(offer.title),
        color: getOfferColor(index),
        icon: getOfferIcon(offer.title),
        minOrder: getMinOrder(offer.title),
        maxDiscount: getMaxDiscount(offer.discountPercent)
      }));
      
      // Filter active offers
      const activeOffers = transformedOffers.filter(offer => offer.isActive);
      setOffers(activeOffers);
      setError(null);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError(err.message);
      // Use fallback offers if API fails
      setOffers(getFallbackOffers());
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get offer description
  const getOfferDescription = (title, discount) => {
    if (title.toLowerCase().includes('first')) {
      return `Get ${discount}% off on your first order`;
    }
    if (title.toLowerCase().includes('weekend')) {
      return `Special ${discount}% discount on weekends`;
    }
    if (title.toLowerCase().includes('delivery')) {
      return 'Free delivery on orders above ₹299';
    }
    return `Save ${discount}% on your favorite items`;
  };

  // Helper function to determine offer category
  const getOfferCategory = (title) => {
    const title_lower = title.toLowerCase();
    if (title_lower.includes('grocery') || title_lower.includes('vegetable')) return 'groceries';
    if (title_lower.includes('restaurant') || title_lower.includes('food') || title_lower.includes('pizza')) return 'restaurants';
    if (title_lower.includes('delivery')) return 'delivery';
    if (title_lower.includes('first') || title_lower.includes('welcome')) return 'welcome';
    return 'special';
  };

  // Helper function to get offer icon
  const getOfferIcon = (title) => {
    const title_lower = title.toLowerCase();
    if (title_lower.includes('grocery')) return <ShoppingBag className="w-6 h-6" />;
    if (title_lower.includes('pizza')) return <Pizza className="w-6 h-6" />;
    if (title_lower.includes('coffee') || title_lower.includes('cafe')) return <Coffee className="w-6 h-6" />;
    if (title_lower.includes('delivery')) return <Truck className="w-6 h-6" />;
    if (title_lower.includes('welcome') || title_lower.includes('first')) return <Gift className="w-6 h-6" />;
    return <Tag className="w-6 h-6" />;
  };

  // Helper function to get offer color
  const getOfferColor = (index) => {
    const colors = [
      "from-green-500 to-emerald-600",
      "from-blue-500 to-cyan-600", 
      "from-orange-500 to-red-500",
      "from-purple-500 to-pink-600",
      "from-yellow-500 to-amber-600",
      "from-red-500 to-rose-600"
    ];
    return colors[index % colors.length];
  };

  // Helper function to get minimum order
  const getMinOrder = (title) => {
    if (title.toLowerCase().includes('grocery')) return '₹499';
    if (title.toLowerCase().includes('restaurant')) return '₹299';
    return '₹199';
  };

  // Helper function to get max discount
  const getMaxDiscount = (discount) => {
    if (discount >= 50) return 'Upto ₹500';
    if (discount >= 30) return 'Upto ₹300';
    if (discount >= 20) return 'Upto ₹200';
    return 'Upto ₹100';
  };

  // Fallback offers if API fails
  const getFallbackOffers = () => [
    {
      id: 1,
      title: "First Order Discount",
      discount: "40% OFF",
      description: "Get 40% off on your first grocery order",
      code: "FIRST40",
      validFrom: "Now",
      validUntil: "31 Dec 2024",
      isActive: true,
      category: "groceries",
      color: "from-green-500 to-emerald-600",
      icon: <ShoppingCart className="w-6 h-6" />,
      minOrder: "₹499",
      maxDiscount: "Upto ₹500"
    },
    {
      id: 2,
      title: "Free Delivery",
      discount: "FREE",
      description: "Free delivery on all restaurant orders above ₹299",
      code: "FREEDEL",
      validFrom: "Now",
      validUntil: "Ongoing",
      isActive: true,
      category: "delivery",
      color: "from-blue-500 to-cyan-600",
      icon: <Truck className="w-6 h-6" />,
      minOrder: "₹299",
      maxDiscount: "Unlimited"
    },
    {
      id: 3,
      title: "Weekend Special",
      discount: "30% OFF",
      description: "30% off on all pizza orders this weekend",
      code: "WEEKEND30",
      validFrom: "Every Friday",
      validUntil: "Every Sunday",
      isActive: true,
      category: "restaurants",
      color: "from-orange-500 to-red-500",
      icon: <Pizza className="w-6 h-6" />,
      minOrder: "₹399",
      maxDiscount: "Upto ₹300"
    },
    {
      id: 4,
      title: "Welcome Bonus",
      discount: "50% OFF",
      description: "Special 50% discount for new users",
      code: "WELCOME50",
      validFrom: "Now",
      validUntil: "30 days",
      isActive: true,
      category: "welcome",
      color: "from-purple-500 to-pink-600",
      icon: <Gift className="w-6 h-6" />,
      minOrder: "₹299",
      maxDiscount: "Upto ₹500"
    },
    {
      id: 5,
      title: "Grocery Special",
      discount: "25% OFF",
      description: "25% off on fresh vegetables and fruits",
      code: "FRESH25",
      validFrom: "Now",
      validUntil: "Ongoing",
      isActive: true,
      category: "groceries",
      color: "from-yellow-500 to-amber-600",
      icon: <ShoppingBag className="w-6 h-6" />,
      minOrder: "₹399",
      maxDiscount: "Upto ₹250"
    },
    {
      id: 6,
      title: "Restaurant Fest",
      discount: "35% OFF",
      description: "35% off on all restaurant orders",
      code: "FEAST35",
      validFrom: "Now",
      validUntil: "31 Dec 2024",
      isActive: true,
      category: "restaurants",
      color: "from-red-500 to-rose-600",
      icon: <Coffee className="w-6 h-6" />,
      minOrder: "₹299",
      maxDiscount: "Upto ₹350"
    }
  ];

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Offers', icon: <Tag className="w-4 h-4" /> },
    { id: 'groceries', name: 'Groceries', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'restaurants', name: 'Restaurants', icon: <Coffee className="w-4 h-4" /> },
    { id: 'delivery', name: 'Delivery', icon: <Truck className="w-4 h-4" /> },
    { id: 'welcome', name: 'Welcome', icon: <Gift className="w-4 h-4" /> },
    { id: 'special', name: 'Special', icon: <Sparkles className="w-4 h-4" /> }
  ];

  // Filter offers by category
  const filteredOffers = selectedCategory === 'all' 
    ? offers 
    : offers.filter(offer => offer.category === selectedCategory);

  // Handle copy coupon code
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setShowCopyMessage(true);
    setTimeout(() => {
      setCopiedCode(null);
      setShowCopyMessage(false);
    }, 2000);
  };

  // Handle offer click
  const handleOfferClick = (offer) => {
    // Navigate to relevant page based on category
    if (offer.category === 'groceries') {
      router.push('/Groceries');
    } else if (offer.category === 'restaurants') {
      router.push('/Restaurants');
    } else {
      // Copy code by default
      handleCopyCode(offer.code);
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading amazing offers...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error && offers.length === 0) {
    return (
      <>
        <ProtectedRoute>
          <Navbar />
        </ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load offers</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchOffers}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      {/* Hero Section with Animated Background */}
      <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-yellow-300 animate-spin-slow" />
              <span className="text-white/90 font-medium">Limited Time Offers</span>
              <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
              Exclusive <span className="text-yellow-300">Offers & Deals</span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Discover amazing discounts on restaurants, groceries, and enjoy fast delivery 
              with our special offers
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Tag className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-2xl text-white">{offers.length}+</div>
                  <div className="text-sm text-white/80">Active Offers</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-2xl text-white">30min</div>
                  <div className="text-sm text-white/80">Fast Delivery</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-2xl text-white">4.8★</div>
                  <div className="text-sm text-white/80">Customer Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-orange-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>

          {/* Copy Message Toast */}
          {showCopyMessage && (
            <div className="fixed top-24 right-4 z-50 animate-slide-down">
              <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Coupon code copied to clipboard!</span>
              </div>
            </div>
          )}

          {/* Featured Offers Grid */}
          {filteredOffers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filteredOffers.map((offer, index) => (
                <div 
                  key={offer.id} 
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                  onClick={() => handleOfferClick(offer)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient Top Bar */}
                  <div className={`h-2 bg-gradient-to-r ${offer.color}`}></div>
                  
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${offer.color} bg-opacity-10`}>
                        <div className={`text-white bg-gradient-to-br ${offer.color} p-2 rounded-lg`}>
                          {offer.icon}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {offer.category}
                        </span>
                        {offer.id === 1 && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {offer.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">{offer.description}</p>
                    
                    {/* Discount & Code */}
                    <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-2xl font-bold text-green-600">{offer.discount}</span>
                        <p className="text-xs text-gray-500">{offer.maxDiscount}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Use code</div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-mono font-bold text-gray-900">{offer.code}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyCode(offer.code);
                            }}
                            className="p-1.5 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            {copiedCode === offer.code ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Validity & Min Order */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>Valid from {offer.validFrom}</span>
                        </div>
                        <div className="text-gray-500">to {offer.validUntil}</div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Min. Order</span>
                        <span className="font-semibold text-gray-900">{offer.minOrder}</span>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn">
                      <span>{offer.category === 'groceries' ? 'Shop Now' : 'Grab Offer'}</span>
                      <Rocket className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-300 mb-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">No offers found</h3>
              <p className="text-gray-500 mb-4">Try selecting a different category</p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all"
              >
                View All Offers
              </button>
            </div>
          )}

          {/* Delivery Benefits */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Why Choose <span className="text-orange-600">Our Delivery</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Clock className="w-6 h-6" />,
                  title: "Express Delivery",
                  description: "Get groceries in 30 minutes",
                  color: "from-blue-500 to-cyan-600"
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: "Contactless Delivery",
                  description: "Safe and hygienic delivery",
                  color: "from-green-500 to-emerald-600"
                },
                {
                  icon: <Tag className="w-6 h-6" />,
                  title: "No Surge Pricing",
                  description: "Same delivery fee always",
                  color: "from-orange-500 to-red-500"
                }
              ].map((benefit, index) => (
                <div 
                  key={index} 
                  className="group bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className={`inline-flex p-3 rounded-full bg-gradient-to-br ${benefit.color} bg-opacity-10 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`text-white bg-gradient-to-br ${benefit.color} p-3 rounded-full`}>
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl p-8 md:p-12 text-center text-white overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Gift className="w-6 h-6 animate-bounce" />
                <span className="text-sm font-semibold uppercase tracking-wider">Limited Time</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Download Our App
              </h2>
              <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
                Get additional 10% off on your first app order. Plus, enjoy exclusive 
                app-only deals and faster checkout.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-900 transition-all duration-300 hover:scale-105">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span>App Store</span>
                </button>
                <button className="group flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm3.35-4.31c.34.27.84.27 1.19 0 .34-.27.84-.27 1.19 0l.08.08c.34.27.84.27 1.19 0 .34-.27.84-.27 1.19 0 .34.27.84.27 1.19 0 .34-.27.84-.27 1.19 0 .34.27.84.27 1.19 0 .34-.27.84-.27 1.19 0 .34.27.84.27 1.19 0 .34-.27.84-.27 1.19 0 .34.27.84.27 1.19 0l.08.08c.34.27.84.27 1.19 0 .34-.27.84-.27 1.19 0 .34.27.84.27 1.19 0 .34-.27.84-.27 1.19 0 .34.27.84.27 1.19 0 .34-.27.84-.27 1.19 0 .34.27.84.27 1.19 0 .34-.27.84-.27 1.19 0 .34.27.84.27 1.19 0 .34-.27.84-.27 1.19 0 .34.27.84.27 1.19 0 .34-.27.84-.27 1.19 0 .34.27.84.27 1.19 0z"/>
                  </svg>
                  <span>Google Play</span>
                </button>
              </div>
              
              <p className="text-orange-100 text-sm mt-6">
                *New users only. Terms and conditions apply.
              </p>
            </div>
          </div>

        </div>
      </div>
      
      <Footer />

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

export default Page
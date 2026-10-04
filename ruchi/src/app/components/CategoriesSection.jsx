"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Pizza, Sandwich, ChefHat, Salad, Cake, ShoppingBag,
  Coffee, Utensils, Soup, Milk, Carrot, Apple, Egg,
  Beef, Drumstick, Fish, IceCream, Cookie, Package,
  ChevronRight, Sparkles, ArrowRight, ChevronLeft,
  MapPin, Star, Clock, X, Zap, Flame, TrendingUp,
  Heart, Crown, Trophy, Rocket, Shield, Target,
  Award, Gift, Tag, ShoppingCart, Loader
} from 'lucide-react';

const Categories = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isHovered, setIsHovered] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api';

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionEl) {
      observer.observe(sectionEl);
    }

    fetchCategories();

    return () => {
      if (sectionEl) {
        observer.unobserve(sectionEl);
      }
    };
  }, []);

  // Fetch categories from dishes API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/dishes?limit=100`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      
      // Extract unique categories from dishes
      const categoryMap = new Map();
      
      data.data.forEach(dish => {
        const categoryName = getCategoryFromName(dish.name);
        if (!categoryMap.has(categoryName)) {
          categoryMap.set(categoryName, {
            count: 1,
            dishes: [dish]
          });
        } else {
          const existing = categoryMap.get(categoryName);
          existing.count += 1;
          existing.dishes.push(dish);
        }
      });

      // Transform to array and add metadata
      const categoryArray = Array.from(categoryMap.entries()).map(([name, info], index) => ({
        id: index + 1,
        label: name,
        name: name,
        count: `${info.count}+`,
        color: getCategoryColor(name),
        icon: getCategoryIcon(name),
        description: getCategoryDescription(name),
        delivery: getDeliveryTime(name),
        rating: calculateAverageRating(info.dishes),
        tag: getCategoryTag(name),
        featured: isCategoryFeatured(name, info.count)
      }));

      // Sort by count (most popular first) and take top 12
      const sortedCategories = categoryArray
        .sort((a, b) => parseInt(b.count) - parseInt(a.count))
        .slice(0, 12);

      setCategories(sortedCategories);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
      // Use fallback categories if API fails
      setCategories(getFallbackCategories());
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine category from dish name
  const getCategoryFromName = (name) => {
    const name_lower = name.toLowerCase();
    if (name_lower.includes('pizza')) return 'Pizza';
    if (name_lower.includes('burger')) return 'Burger';
    if (name_lower.includes('sandwich')) return 'Sandwiches';
    if (name_lower.includes('pasta') || name_lower.includes('italian')) return 'Italian';
    if (name_lower.includes('chinese') || name_lower.includes('noodle') || name_lower.includes('manchurian')) return 'Chinese';
    if (name_lower.includes('indian') || name_lower.includes('curry') || name_lower.includes('biryani')) return 'Indian';
    if (name_lower.includes('salad') || name_lower.includes('healthy') || name_lower.includes('veg')) return 'Healthy';
    if (name_lower.includes('cake') || name_lower.includes('ice cream') || name_lower.includes('dessert')) return 'Desserts';
    if (name_lower.includes('coffee') || name_lower.includes('tea') || name_lower.includes('beverage')) return 'Coffee';
    if (name_lower.includes('soup')) return 'Soups';
    if (name_lower.includes('bread') || name_lower.includes('roll')) return 'Bakery';
    if (name_lower.includes('egg')) return 'Eggs';
    if (name_lower.includes('chicken')) return 'Chicken';
    if (name_lower.includes('fish') || name_lower.includes('seafood')) return 'Seafood';
    if (name_lower.includes('momo') || name_lower.includes('dumpling')) return 'Momos';
    return 'Main Course';
  };

  // Get icon for category
  const getCategoryIcon = (category) => {
    const icons = {
      'Pizza': Pizza,
      'Burger': Sandwich,
      'Sandwiches': Sandwich,
      'Italian': Utensils,
      'Chinese': ChefHat,
      'Indian': Flame,
      'Healthy': Salad,
      'Desserts': Cake,
      'Coffee': Coffee,
      'Soups': Soup,
      'Bakery': Cookie,
      'Eggs': Egg,
      'Chicken': Drumstick,
      'Seafood': Fish,
      'Momos': Package,
      'Main Course': Utensils
    };
    return icons[category] || Utensils;
  };

  // Get color for category
  const getCategoryColor = (category) => {
    const colors = {
      'Pizza': 'from-red-500 to-red-600',
      'Burger': 'from-orange-500 to-red-600',
      'Sandwiches': 'from-yellow-500 to-orange-500',
      'Italian': 'from-green-600 to-emerald-700',
      'Chinese': 'from-red-700 to-pink-600',
      'Indian': 'from-orange-600 to-red-700',
      'Healthy': 'from-emerald-500 to-green-600',
      'Desserts': 'from-pink-500 to-rose-600',
      'Coffee': 'from-amber-700 to-amber-900',
      'Soups': 'from-orange-400 to-red-500',
      'Bakery': 'from-amber-500 to-yellow-600',
      'Eggs': 'from-yellow-400 to-amber-500',
      'Chicken': 'from-rose-500 to-red-600',
      'Seafood': 'from-blue-500 to-cyan-600',
      'Momos': 'from-purple-500 to-pink-500',
      'Main Course': 'from-gray-600 to-gray-700'
    };
    return colors[category] || 'from-red-500 to-red-600';
  };

  // Get description for category
  const getCategoryDescription = (category) => {
    const descriptions = {
      'Pizza': 'Delicious pizzas from top pizzerias',
      'Burger': 'Juicy burgers & combos',
      'Sandwiches': 'Freshly made sandwiches',
      'Italian': 'Classic Italian dishes',
      'Chinese': 'Authentic Chinese cuisine',
      'Indian': 'Flavorful Indian curries & biryani',
      'Healthy': 'Healthy & nutritious options',
      'Desserts': 'Sweet treats & desserts',
      'Coffee': 'Coffee & beverages',
      'Soups': 'Hot & comforting soups',
      'Bakery': 'Fresh breads & baked goods',
      'Eggs': 'Egg dishes & breakfast',
      'Chicken': 'Delicious chicken dishes',
      'Seafood': 'Fresh seafood specials',
      'Momos': 'Steamed & fried dumplings',
      'Main Course': 'Hearty main course dishes'
    };
    return descriptions[category] || `Explore our ${category} collection`;
  };

  // Get delivery time for category
  const getDeliveryTime = (category) => {
    const times = {
      'Pizza': '25-30 min',
      'Burger': '20-25 min',
      'Sandwiches': '15-20 min',
      'Italian': '30-35 min',
      'Chinese': '30-35 min',
      'Indian': '35-40 min',
      'Healthy': '15-20 min',
      'Desserts': '20-25 min',
      'Coffee': '20-25 min',
      'Soups': '20-25 min',
      'Bakery': '15-20 min',
      'Eggs': '10-15 min',
      'Chicken': '25-30 min',
      'Seafood': '30-35 min',
      'Momos': '20-25 min',
      'Main Course': '25-30 min'
    };
    return times[category] || '25-30 min';
  };

  // Get tag for category
  const getCategoryTag = (category) => {
    const tags = {
      'Pizza': '🔥 Hot',
      'Burger': '⭐ Popular',
      'Chinese': '🎯 Trending',
      'Healthy': '💚 Fresh',
      'Desserts': '🍰 Sweet',
      'Coffee': '☕ Fresh',
      'Italian': '🍝 Classic',
      'Soups': '🍲 Warm',
      'Indian': '🌶️ Spicy'
    };
    return tags[category] || '✨ New';
  };

  // Calculate average rating for dishes in category
  const calculateAverageRating = (dishes) => {
    if (!dishes || dishes.length === 0) return '4.5';
    const total = dishes.reduce((sum, dish) => sum + (dish.rating || 4.5), 0);
    return (total / dishes.length).toFixed(1);
  };

  // Check if category is featured
  const isCategoryFeatured = (category, count) => {
    const featuredCategories = ['Pizza', 'Burger', 'Chinese', 'Indian', 'Desserts'];
    return featuredCategories.includes(category) && count > 5;
  };

  // Fallback categories if API fails
  const getFallbackCategories = () => [
    { id: 1, label: 'Pizza', count: '150+', color: 'from-red-500 to-red-600', icon: Pizza, description: 'Delicious pizzas from top pizzerias', delivery: '25-30 min', rating: 4.8, tag: '🔥 Hot', featured: true },
    { id: 2, label: 'Burger', count: '200+', color: 'from-orange-500 to-red-600', icon: Sandwich, description: 'Juicy burgers & combos', delivery: '20-25 min', rating: 4.7, tag: '⭐ Popular', featured: true },
    { id: 3, label: 'Chinese', count: '180+', color: 'from-red-700 to-pink-600', icon: ChefHat, description: 'Authentic Chinese cuisine', delivery: '30-35 min', rating: 4.6, tag: '🎯 Trending' },
    { id: 4, label: 'Healthy', count: '120+', color: 'from-emerald-500 to-green-600', icon: Salad, description: 'Healthy & nutritious options', delivery: '15-20 min', rating: 4.9, tag: '💚 Fresh' },
    { id: 5, label: 'Desserts', count: '90+', color: 'from-pink-500 to-rose-600', icon: Cake, description: 'Sweet treats & desserts', delivery: '20-25 min', rating: 4.8, tag: '🍰 Sweet' },
    { id: 6, label: 'Italian', count: '95+', color: 'from-green-600 to-emerald-700', icon: Utensils, description: 'Classic Italian dishes', delivery: '30-35 min', rating: 4.7, tag: '🍝 Classic' },
  ];

  // Navigate to category
  const handleCategoryClick = (category) => {
    router.push(`/Restaurants?category=${encodeURIComponent(category.label.toLowerCase())}`);
  };

  // View all categories
  const viewAllCategories = () => {
    router.push('/Restaurants');
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && categories.length === 0) {
    return (
      <div className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="text-red-500 mb-4">Failed to load categories</div>
          <button
            onClick={fetchCategories}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="relative py-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-red-50/20 to-white">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-red-100/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-red-100/30 to-transparent"></div>
        
        {/* Animated Particles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-red-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-orange-300/20 to-red-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500/10 to-rose-500/10 backdrop-blur-sm rounded-2xl mb-8 border border-red-200/50 shadow-lg">
            <div className="relative">
              <Package className="w-7 h-7 text-red-600 animate-bounce" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
            </div>
            <span className="font-bold text-red-700 text-lg bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              Delicious Categories
            </span>
            <Sparkles className="w-5 h-5 text-yellow-500 animate-spin-slow" />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="text-gray-900">Explore</span>{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-red-600 via-red-500 to-rose-500 bg-clip-text text-transparent animate-gradient">
                Amazing Food
              </span>
              <div className="absolute -inset-2 bg-gradient-to-r from-red-400 to-rose-400 blur-xl opacity-20 -z-10 rounded-full animate-pulse"></div>
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Discover the finest selection of food categories, handpicked for your cravings
            <span className="inline-block ml-2">
              <Heart className="w-5 h-5 text-red-500 inline animate-pulse" />
            </span>
          </p>
          
          {/* Animated Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {[
              { icon: Trophy, value: categories.length + '+', label: 'Categories', color: 'from-red-500 to-red-600' },
              { icon: Rocket, value: '25min', label: 'Avg Delivery', color: 'from-orange-500 to-amber-600' },
              { icon: Crown, value: '4.8★', label: 'Rating', color: 'from-yellow-500 to-amber-600' },
              { icon: Shield, value: '100%', label: 'Fresh', color: 'from-emerald-500 to-green-600' },
            ].map((stat, idx) => (
              <div 
                key={idx}
                className={`flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-lg hover:scale-105 transition-all duration-300`}
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Navigation */}
        {categories.length > 4 && (
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={scrollLeft}
              className="group flex items-center justify-center w-12 h-12 bg-gradient-to-r from-white to-gray-50 rounded-full shadow-lg border border-gray-200 hover:border-red-300 hover:shadow-red-200/50 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
            </button>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200/50">
                <span className="text-sm font-medium text-gray-700">
                  Scroll to explore
                </span>
              </div>
            </div>
            
            <button
              onClick={scrollRight}
              className="group flex items-center justify-center w-12 h-12 bg-gradient-to-r from-white to-gray-50 rounded-full shadow-lg border border-gray-200 hover:border-red-300 hover:shadow-red-200/50 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
            </button>
          </div>
        )}

        {/* Horizontal Scroll Container */}
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-8 space-x-6 scrollbar-hide px-2"
          >
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div 
                  key={category.id || index}
                  className="flex-shrink-0 w-72"
                  onMouseEnter={() => setIsHovered(category.id)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <div className={`relative transition-all duration-500 ${isHovered === category.id ? 'scale-105' : 'scale-100'}`}>
                    {/* Featured Badge */}
                    {category.featured && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs font-bold rounded-full shadow-lg">
                          <Crown className="w-3 h-3" />
                          <span>FEATURED</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Card */}
                    <div 
                      className={`relative bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm rounded-2xl border-2 ${isHovered === category.id ? 'border-red-300 shadow-2xl shadow-red-100/50' : 'border-gray-200/50'} p-6 transition-all duration-500 cursor-pointer overflow-hidden group`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {/* Animated Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                      
                      {/* Tag */}
                      <div className="absolute top-4 right-4">
                        <div className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-700 border border-gray-200/50">
                          {category.tag}
                        </div>
                      </div>
                      
                      {/* Icon Container */}
                      <div className="relative mb-6">
                        <div className={`relative w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                          <IconComponent className="w-10 h-10 text-white" />
                          
                          {/* Floating Sparkles */}
                          <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-yellow-400" />
                        </div>
                        
                        {/* Count Badge */}
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                          <div className="px-3 py-1 bg-gradient-to-r from-white to-gray-50 backdrop-blur-sm rounded-full text-sm font-black text-red-700 border border-red-200 shadow-md">
                            {category.count}
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="relative">
                        <h3 className="text-xl font-black text-center text-gray-900 mb-3 group-hover:text-red-700 transition-colors">
                          {category.label}
                        </h3>
                        
                        <p className="text-gray-600 text-center mb-4 text-sm leading-relaxed">
                          {category.description}
                        </p>
                        
                        {/* Stats */}
                        <div className="flex items-center justify-center gap-6 mb-6">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-bold text-gray-900">{category.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-bold text-gray-900">{category.delivery}</span>
                          </div>
                        </div>
                        
                        {/* Action Button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryClick(category);
                          }}
                          className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group/btn"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Order Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Scroll Hint */}
        <div className="md:hidden text-center mt-8 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200/50">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-red-500 rounded-full"></div>
              <div className="w-1 h-1 bg-red-500 rounded-full"></div>
              <div className="w-1 h-1 bg-red-500 rounded-full"></div>
            </div>
            <span className="text-sm font-medium text-gray-700">Swipe to explore more</span>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <button 
            onClick={viewAllCategories}
            className="group px-8 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
          >
            <Gift className="w-5 h-5" />
            <span>View All {categories.length} Categories</span>
            <TrendingUp className="w-5 h-5" />
          </button>
          
          <p className="text-gray-500 text-sm mt-4">
            Discover amazing deals and offers
            <Tag className="w-4 h-4 inline ml-2 text-red-500" />
          </p>
        </div>
      </div>

      {/* Selected Category Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-white to-gray-50/90 backdrop-blur-sm rounded-2xl max-w-md w-full p-6 relative border border-gray-200/50 shadow-2xl">
            <button
              onClick={() => setSelectedCategory(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:scale-110"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className={`w-20 h-20 bg-gradient-to-br ${selectedCategory.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
              <selectedCategory.icon className="w-10 h-10 text-white" />
              <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400" />
            </div>
            
            <h3 className="text-2xl font-black text-center text-gray-900 mb-2">
              {selectedCategory.label}
            </h3>
            
            {selectedCategory.featured && (
              <div className="flex justify-center mb-3">
                <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs font-bold rounded-full inline-flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  <span>FEATURED</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-black text-red-600">
                  {selectedCategory.rating}
                </div>
                <div className="text-xs text-gray-600">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-gray-900">{selectedCategory.delivery}</div>
                <div className="text-xs text-gray-600">Delivery</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-gray-900">{selectedCategory.count}</div>
                <div className="text-xs text-gray-600">Options</div>
              </div>
            </div>
            
            <p className="text-gray-600 text-center mb-6">
              {selectedCategory.description}
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  setSelectedCategory(null);
                  handleCategoryClick(selectedCategory);
                }}
                className="py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-bold rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-300"
              >
                Explore
              </button>
              <button 
                onClick={() => {
                  setSelectedCategory(null);
                  handleCategoryClick(selectedCategory);
                }}
                className="py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold rounded-lg hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-md"
              >
                Order Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles for animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
                .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Categories;
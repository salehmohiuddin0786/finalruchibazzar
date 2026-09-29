// app/delivery/ratings/page.jsx
"use client";
import { useEffect, useState } from 'react';
import SuperLayout from '../SuperLayout/page';
import { deliveryApi } from '../lib/deliveryApi';
import {
  Star,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Award,
  Clock,
  Package,
  User,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Filter,
  MoreVertical,
  Eye,
  Smile,
  Meh,
  Frown,
  Crown,
  Target,
  Zap,
  Heart,
  Sparkles,
  Medal,
  Trophy
} from 'lucide-react';

export default function RatingsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [apiRatings, setApiRatings] = useState(null);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const reviewsPerPage = 6;

  useEffect(() => {
    let mounted = true;

    deliveryApi('/delivery/ratings')
      .then((data) => {
        if (mounted) setApiRatings(data);
      })
      .catch((err) => {
        if (!mounted) return;
        setApiError(err.message || 'Failed to load ratings');
        setApiRatings({ ratings: {}, reviews: [], achievements: [] });
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Ratings data
  const ratings = {
    overall: 4.9,
    total: 245,
    breakdown: {
      5: 189,
      4: 42,
      3: 10,
      2: 3,
      1: 1
    },
    trends: {
      weekly: '+0.2',
      monthly: '+0.1',
      yearly: '+0.3'
    }
  };

  // Reviews data
  const reviews = [
    {
      id: 1,
      customer: "Rahul Sharma",
      rating: 5,
      date: "2024-01-15",
      time: "10:30 AM",
      comment: "Excellent service! Very prompt delivery and great attitude. The food was delivered hot and fresh. Definitely one of the best delivery partners I've seen.",
      deliveryId: "RB-101",
      tags: ["On Time", "Friendly", "Professional"],
      helpful: 12,
      response: "Thank you so much for your kind words! 😊"
    },
    {
      id: 2,
      customer: "Aisha Khan",
      rating: 4,
      date: "2024-01-15",
      time: "11:15 AM",
      comment: "Good service overall. Delivery was on time and the person was polite. Food packaging could have been better though.",
      deliveryId: "RB-102",
      tags: ["On Time", "Polite"],
      helpful: 8,
      response: "Thanks for your feedback! I'll work on the packaging aspect."
    },
    {
      id: 3,
      customer: "Priya Patel",
      rating: 5,
      date: "2024-01-15",
      time: "09:45 AM",
      comment: "Amazing experience! The delivery person was so helpful and friendly. Even helped me with the heavy bags. Will definitely order again!",
      deliveryId: "RB-103",
      tags: ["Helpful", "Friendly", "Professional"],
      helpful: 15,
      response: "It was my pleasure helping you! 🙏"
    },
    {
      id: 4,
      customer: "Arjun Reddy",
      rating: 4,
      date: "2024-01-14",
      time: "12:00 PM",
      comment: "Good delivery experience. On time and professional. The only suggestion would be to improve communication during delivery.",
      deliveryId: "RB-104",
      tags: ["On Time", "Professional"],
      helpful: 5
    },
    {
      id: 5,
      customer: "Neha Gupta",
      rating: 5,
      date: "2024-01-14",
      time: "10:00 AM",
      comment: "Exceptional service! Went above and beyond to ensure my order was delivered correctly. Very grateful for such dedicated service.",
      deliveryId: "RB-105",
      tags: ["Exceptional", "Dedicated", "Professional"],
      helpful: 20,
      response: "Thank you! Your appreciation means a lot! 🌟"
    },
    {
      id: 6,
      customer: "Vikram Singh",
      rating: 5,
      date: "2024-01-13",
      time: "07:45 PM",
      comment: "Outstanding delivery partner! Very professional and courteous. Even waited for me when I was running late. 10/10 service!",
      deliveryId: "RB-106",
      tags: ["Courteous", "Patient", "Professional"],
      helpful: 18,
      response: "Happy to help! Have a great day! ✨"
    },
    {
      id: 7,
      customer: "Meera Reddy",
      rating: 3,
      date: "2024-01-13",
      time: "02:30 PM",
      comment: "Average experience. Delivery was a bit late and the person seemed rushed. Could improve on time management.",
      deliveryId: "RB-107",
      tags: ["Late Delivery"],
      helpful: 3,
      response: "I apologize for the delay. Will do better next time."
    },
    {
      id: 8,
      customer: "Anita Desai",
      rating: 5,
      date: "2024-01-12",
      time: "08:15 PM",
      comment: "Fantastic service! Very professional and friendly. Made sure everything was correct before leaving. Highly recommended!",
      deliveryId: "RB-108",
      tags: ["Professional", "Friendly", "Thorough"],
      helpful: 14,
      response: "Thank you for the wonderful review! 🙌"
    }
  ];

  // Achievements
  const achievements = [
    { name: "Star Performer", icon: Crown, color: "from-amber-500 to-yellow-500", earned: true, date: "Jan 2024" },
    { name: "Speed Demon", icon: Zap, color: "from-blue-500 to-cyan-500", earned: true, date: "Dec 2023" },
    { name: "Customer Favorite", icon: Heart, color: "from-rose-500 to-pink-500", earned: true, date: "Jan 2024" },
    { name: "Perfect Week", icon: Sparkles, color: "from-purple-500 to-indigo-500", earned: false, progress: 80 },
    { name: "Century Club", icon: Medal, color: "from-emerald-500 to-teal-500", earned: true, date: "Nov 2023" },
    { name: "Top Rated", icon: Trophy, color: "from-orange-500 to-red-500", earned: false, progress: 65 }
  ];

  const liveRatings = {
    overall: 0,
    total: 0,
    trends: ratings.trends,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    ...(apiRatings?.ratings || {}),
    trends: {
      ...ratings.trends,
      ...(apiRatings?.ratings?.trends || {}),
    },
    breakdown: {
      ...ratings.breakdown,
      ...(apiRatings?.ratings?.breakdown || {}),
    },
  };
  const liveReviews = apiRatings?.reviews || [];
  const liveAchievements = (apiRatings?.achievements || []).map((achievement, index) => ({
    icon: achievements[index % achievements.length]?.icon || Award,
    color: achievements[index % achievements.length]?.color || 'from-amber-500 to-yellow-500',
    earned: true,
    ...achievement,
  }));

  const getRatingStars = (rating, size = 16) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={size}
            className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-emerald-600';
    if (rating >= 4) return 'text-blue-600';
    if (rating >= 3) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getMoodIcon = (rating) => {
    if (rating >= 4) return <Smile size={20} className="text-emerald-500" />;
    if (rating >= 3) return <Meh size={20} className="text-amber-500" />;
    return <Frown size={20} className="text-rose-500" />;
  };

  // Filter reviews
  const filteredReviews = liveReviews.filter(review => {
    if (ratingFilter === 'all') return true;
    return review.rating === parseInt(ratingFilter);
  });

  // Pagination
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / reviewsPerPage));

  return (
    <SuperLayout>
      <div className="space-y-6 pb-8">
        {/* Animated Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 text-white">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-8 h-8 fill-white" />
                  <h1 className="text-3xl font-bold">Ratings & Reviews</h1>
                </div>
                <p className="text-amber-100 text-lg">Track your performance and customer feedback</p>
              </div>
              <div className="flex gap-3">
                <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl text-sm font-medium transition-all backdrop-blur-sm border border-white/20 flex items-center gap-2">
                  <Calendar size={18} />
                  {selectedPeriod === 'week' ? 'This Week' : selectedPeriod === 'month' ? 'This Month' : 'This Year'}
                </button>
                <button className="bg-white text-amber-600 px-6 py-3 rounded-xl text-sm font-medium hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2">
                  <Download size={18} />
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Rating Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-800 mb-2">{liveRatings.overall}</div>
              <div className="mb-2">{getRatingStars(5, 20)}</div>
              <p className="text-sm text-gray-500">out of {liveRatings.total} reviews</p>
              <div className="flex items-center gap-2 mt-2 justify-center">
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                  ↑ {liveRatings.trends.weekly} this week
                </span>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 w-full">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = liveRatings.breakdown[rating];
                const percentage = liveRatings.total ? (count / liveRatings.total) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                    </div>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">{count}</span>
                  </div>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 min-w-[200px]">
              <div className="bg-emerald-50 rounded-xl p-3 text-center">
                <p className="text-xs text-emerald-600">5-Star</p>
                <p className="text-xl font-bold text-emerald-700">{liveRatings.breakdown[5]}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <p className="text-xs text-blue-600">4-Star</p>
                <p className="text-xl font-bold text-blue-700">{liveRatings.breakdown[4]}</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <p className="text-xs text-amber-600">3-Star</p>
                <p className="text-xl font-bold text-amber-700">{liveRatings.breakdown[3]}</p>
              </div>
              <div className="bg-rose-50 rounded-xl p-3 text-center">
                <p className="text-xs text-rose-600">Below 3</p>
                <p className="text-xl font-bold text-rose-700">{liveRatings.breakdown[2] + liveRatings.breakdown[1]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Award size={20} className="text-amber-500" />
            Your Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {liveAchievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div key={index} className={`relative p-4 rounded-xl bg-gradient-to-br ${achievement.color} text-white group hover:scale-105 transition-transform cursor-pointer`}>
                  <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                  <div className="relative text-center">
                    <Icon size={24} className="mx-auto mb-2" />
                    <p className="text-xs font-medium">{achievement.name}</p>
                    {achievement.earned ? (
                      <p className="text-[10px] opacity-80 mt-1">{achievement.date}</p>
                    ) : (
                      <div className="mt-2">
                        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full" style={{ width: `${achievement.progress}%` }} />
                        </div>
                        <p className="text-[10px] mt-1">{achievement.progress}%</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Filter size={18} className="text-gray-400" />
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Star Reviews</option>
                <option value="4">4 Star Reviews</option>
                <option value="3">3 Star Reviews</option>
                <option value="2">2 Star Reviews</option>
                <option value="1">1 Star Reviews</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-amber-100 text-amber-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Package size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-amber-100 text-amber-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <MessageCircle size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-xl transition-all group">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                      {getMoodIcon(review.rating)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{review.customer}</p>
                      <p className="text-xs text-gray-500">{review.date} • {review.time}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">#{review.deliveryId}</div>
                </div>

                {/* Rating */}
                <div className="mb-3">
                  {getRatingStars(review.rating)}
                </div>

                {/* Comment */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  &quot;{review.comment}&quot;
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {(review.tags || []).map((tag, i) => (
                    <span key={i} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Response (if any) */}
                {review.response && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                    <p className="text-xs text-emerald-700 flex items-start gap-1">
                      <MessageCircle size={12} className="mt-0.5 flex-shrink-0" />
                      <span>{review.response}</span>
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <ThumbsUp size={12} />
                    <span>{review.helpful} found this helpful</span>
                  </div>
                  <button className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reviews List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {currentReviews.map((review) => (
                <div key={review.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex flex-wrap gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {review.customer.charAt(0)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800">{review.customer}</h3>
                          <p className="text-xs text-gray-500">{review.date} • {review.time} • Order #{review.deliveryId}</p>
                        </div>
                        {getRatingStars(review.rating)}
                      </div>

                      <p className="text-gray-600 mb-3">&quot;{review.comment}&quot;</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {(review.tags || []).map((tag, i) => (
                          <span key={i} className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Response */}
                      {review.response && (
                        <div className="mt-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                          <p className="text-sm text-emerald-700 flex items-start gap-2">
                            <MessageCircle size={16} className="mt-0.5" />
                            <span>{review.response}</span>
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-3 flex items-center gap-4">
                        <button className="text-xs text-gray-500 hover:text-amber-600 flex items-center gap-1">
                          <ThumbsUp size={14} />
                          Helpful ({review.helpful})
                        </button>
                        <button className="text-xs text-gray-500 hover:text-amber-600 flex items-center gap-1">
                          <MessageCircle size={14} />
                          Reply
                        </button>
                        <button className="text-xs text-gray-500 hover:text-amber-600 flex items-center gap-1">
                          <Eye size={14} />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredReviews.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No reviews found</h3>
            <p className="text-gray-500 mb-4">
              {apiError || (isLoading ? 'Loading ratings from backend.' : 'Try adjusting your filter criteria')}
            </p>
            <button 
              onClick={() => setRatingFilter('all')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:shadow-lg transition-all"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredReviews.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{indexOfFirstReview + 1}</span> to{' '}
                <span className="font-medium">{Math.min(indexOfLastReview, filteredReviews.length)}</span>{' '}
                of <span className="font-medium">{filteredReviews.length}</span> reviews
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft size={18} />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      currentPage === i + 1
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Praise */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Heart size={20} className="text-rose-500" />
              What Customers Love
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                    <Clock size={16} className="text-rose-600" />
                  </div>
                  <span className="text-sm font-medium">On-Time Delivery</span>
                </div>
                <span className="text-sm font-bold text-rose-600">92%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Smile size={16} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Friendly Attitude</span>
                </div>
                <span className="text-sm font-bold text-blue-600">88%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Package size={16} className="text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium">Proper Packaging</span>
                </div>
                <span className="text-sm font-bold text-emerald-600">85%</span>
              </div>
            </div>
          </div>

          {/* Areas to Improve */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Target size={20} className="text-amber-500" />
              Areas to Improve
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <MessageCircle size={16} className="text-amber-600" />
                  </div>
                  <span className="text-sm font-medium">Communication</span>
                </div>
                <span className="text-sm font-bold text-amber-600">12%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <TrendingUp size={16} className="text-amber-600" />
                  </div>
                  <span className="text-sm font-medium">Speed</span>
                </div>
                <span className="text-sm font-bold text-amber-600">8%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <MapPin size={16} className="text-amber-600" />
                  </div>
                  <span className="text-sm font-medium">Navigation</span>
                </div>
                <span className="text-sm font-bold text-amber-600">5%</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl text-white">
              <p className="text-sm font-medium mb-1">Pro Tip</p>
              <p className="text-xs opacity-90">Call customers 5 minutes before arrival to improve communication scores!</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </SuperLayout>
  );
}

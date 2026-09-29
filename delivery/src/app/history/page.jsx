// app/delivery/history/page.jsx
"use client";
import { useEffect, useState } from 'react';
import SuperLayout from '../SuperLayout/page';
import { deliveryApi } from '../lib/deliveryApi';
import {
  Package,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Clock,
  CheckCircle,
  MapPin,
  User,
  Phone,
  IndianRupee,
  Calendar,
  ArrowUpDown,
  Star,
  Store,
  Truck,
  Timer,
  Navigation,
  Award,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Receipt,
  FileText,
  Printer,
  Mail,
  Share2,
  ThumbsUp,
  MessageCircle,
  Map,
  Route
} from 'lucide-react';

export default function DeliveryHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [apiDeliveries, setApiDeliveries] = useState(null);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const deliveriesPerPage = 5;

  useEffect(() => {
    let mounted = true;

    deliveryApi('/delivery/history')
      .then((data) => {
        if (mounted) setApiDeliveries(data.deliveries || []);
      })
      .catch((err) => {
        if (!mounted) return;
        setApiError(err.message || 'Failed to load delivery history');
        setApiDeliveries([]);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Historical deliveries data
  const deliveries = [
    {
      id: "RB-101",
      date: "2024-01-15",
      time: "10:30 AM",
      customer: "Rahul Sharma",
      address: "Jubilee Hills, Hyderabad - 500033",
      restaurant: "Spicy Bites",
      amount: "₹450",
      status: "delivered",
      rating: 5,
      feedback: "Excellent service! Very prompt delivery.",
      distance: "2.5 km",
      duration: "25 min",
      paymentMethod: "Online",
      items: 3,
      earnings: 85,
      tip: 20,
      completedAt: "10:55 AM",
      driver: "You",
      vehicle: "Bike"
    },
    {
      id: "RB-102",
      date: "2024-01-15",
      time: "11:15 AM",
      customer: "Aisha Khan",
      address: "Banjara Hills, Secunderabad - 500034",
      restaurant: "Biryani House",
      amount: "₹780",
      status: "delivered",
      rating: 4,
      feedback: "Food was hot and well packaged.",
      distance: "3.2 km",
      duration: "35 min",
      paymentMethod: "Cash",
      items: 5,
      earnings: 120,
      tip: 0,
      completedAt: "11:50 AM",
      driver: "You",
      vehicle: "Bike"
    },
    {
      id: "RB-103",
      date: "2024-01-15",
      time: "09:45 AM",
      customer: "Priya Patel",
      address: "Gachibowli, Hyderabad - 500032",
      restaurant: "Fresh Bites",
      amount: "₹320",
      status: "delivered",
      rating: 5,
      feedback: "Very friendly delivery person!",
      distance: "1.8 km",
      duration: "18 min",
      paymentMethod: "Online",
      items: 2,
      earnings: 70,
      tip: 15,
      completedAt: "10:03 AM",
      driver: "You",
      vehicle: "Bike"
    },
    {
      id: "RB-104",
      date: "2024-01-14",
      time: "12:00 PM",
      customer: "Arjun Reddy",
      address: "Madhapur, Hyderabad - 500081",
      restaurant: "Tandoori Nights",
      amount: "₹650",
      status: "delivered",
      rating: 4,
      feedback: "Good service, on time delivery.",
      distance: "4.1 km",
      duration: "40 min",
      paymentMethod: "Online",
      items: 4,
      earnings: 110,
      tip: 10,
      completedAt: "12:40 PM",
      driver: "You",
      vehicle: "Bike"
    },
    {
      id: "RB-105",
      date: "2024-01-14",
      time: "10:00 AM",
      customer: "Neha Gupta",
      address: "Kukatpally, Hyderabad - 500072",
      restaurant: "Spice Kitchen",
      amount: "₹520",
      status: "delivered",
      rating: 5,
      feedback: "Amazing! Went above and beyond.",
      distance: "3.5 km",
      duration: "30 min",
      paymentMethod: "Cash",
      items: 3,
      earnings: 95,
      tip: 25,
      completedAt: "10:30 AM",
      driver: "You",
      vehicle: "Bike"
    },
    {
      id: "RB-106",
      date: "2024-01-13",
      time: "07:45 PM",
      customer: "Vikram Singh",
      address: "Hitech City, Hyderabad - 500084",
      restaurant: "Royal Dining",
      amount: "₹890",
      status: "delivered",
      rating: 5,
      feedback: "Excellent service during peak hours!",
      distance: "5.2 km",
      duration: "45 min",
      paymentMethod: "Online",
      items: 6,
      earnings: 150,
      tip: 30,
      completedAt: "08:30 PM",
      driver: "You",
      vehicle: "Bike"
    },
    {
      id: "RB-107",
      date: "2024-01-13",
      time: "02:30 PM",
      customer: "Meera Reddy",
      address: "Kondapur, Hyderabad - 500084",
      restaurant: "South Indian Cafe",
      amount: "₹380",
      status: "delivered",
      rating: 4,
      feedback: "Good food, on time delivery.",
      distance: "2.8 km",
      duration: "22 min",
      paymentMethod: "Online",
      items: 3,
      earnings: 75,
      tip: 0,
      completedAt: "02:52 PM",
      driver: "You",
      vehicle: "Bike"
    },
    {
      id: "RB-108",
      date: "2024-01-12",
      time: "08:15 PM",
      customer: "Anita Desai",
      address: "Manikonda, Hyderabad - 500089",
      restaurant: "Punjabi Dhaba",
      amount: "₹720",
      status: "delivered",
      rating: 5,
      feedback: "Very courteous and professional.",
      distance: "4.5 km",
      duration: "38 min",
      paymentMethod: "Cash",
      items: 5,
      earnings: 130,
      tip: 20,
      completedAt: "08:53 PM",
      driver: "You",
      vehicle: "Bike"
    },
  ];

  const displayDeliveries = apiDeliveries ?? [];
  const todayKey = new Date().toISOString().slice(0, 10);
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  // Stats
  const stats = [
    { 
      label: 'Total Deliveries', 
      value: displayDeliveries.length, 
      icon: Package, 
      color: 'emerald',
      change: '+12 this month'
    },
    { 
      label: 'Total Distance', 
      value: '245 km', 
      icon: Map, 
      color: 'blue',
      change: '32 km this week'
    },
    { 
      label: 'Total Time', 
      value: '32h 15m', 
      icon: Clock, 
      color: 'purple',
      change: '4.5h avg/day'
    },
    { 
      label: 'Total Earnings', 
      value: '₹8,450', 
      icon: IndianRupee, 
      color: 'amber',
      change: 'from deliveries'
    },
  ];

  // Rating distribution
  const ratingDistribution = {
    5: displayDeliveries.filter(d => d.rating === 5).length,
    4: displayDeliveries.filter(d => d.rating === 4).length,
    3: displayDeliveries.filter(d => d.rating === 3).length,
    2: displayDeliveries.filter(d => d.rating === 2).length,
    1: displayDeliveries.filter(d => d.rating === 1).length,
  };

  const getRatingStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">({rating})</span>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
        <CheckCircle size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Filter deliveries
  const filteredDeliveries = displayDeliveries.filter(delivery => {
    const matchesSearch = 
      delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.restaurant.toLowerCase().includes(searchTerm.toLowerCase());
    
    const deliveryDate = delivery.date ? new Date(delivery.date) : null;
    const matchesDate = dateFilter === 'all' || 
      (dateFilter === 'today' && delivery.date === todayKey) ||
      (dateFilter === 'week' && deliveryDate && deliveryDate >= weekStart) ||
      dateFilter === 'month';
    
    const matchesRating = ratingFilter === 'all' || delivery.rating === parseInt(ratingFilter);
    
    return matchesSearch && matchesDate && matchesRating;
  });

  // Pagination
  const indexOfLastDelivery = currentPage * deliveriesPerPage;
  const indexOfFirstDelivery = indexOfLastDelivery - deliveriesPerPage;
  const currentDeliveries = filteredDeliveries.slice(indexOfFirstDelivery, indexOfLastDelivery);
  const totalPages = Math.ceil(filteredDeliveries.length / deliveriesPerPage);

  // Calculate average rating
  const avgRating = displayDeliveries.length
    ? (displayDeliveries.reduce((acc, d) => acc + d.rating, 0) / displayDeliveries.length).toFixed(1)
    : "0.0";

  return (
    <SuperLayout>
      <div className="space-y-6 pb-8">
        {/* Animated Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 p-6 text-white">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-8 h-8" />
                  <h1 className="text-3xl font-bold">Delivery History</h1>
                </div>
                <p className="text-emerald-100 text-lg">Track all your completed deliveries and performance</p>
              </div>
              <div className="flex gap-3">
                <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl text-sm font-medium transition-all backdrop-blur-sm border border-white/20 flex items-center gap-2">
                  <Calendar size={18} />
                  Filter by Date
                </button>
                <button className="bg-white text-emerald-600 px-6 py-3 rounded-xl text-sm font-medium hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2">
                  <Download size={18} />
                  Export History
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                <p className="text-xs text-emerald-100">Avg Rating</p>
                <p className="text-xl font-bold flex items-center gap-1">
                  {avgRating} <Star size={16} className="text-amber-300 fill-amber-300" />
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                <p className="text-xs text-emerald-100">Completion Rate</p>
                <p className="text-xl font-bold">98%</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                <p className="text-xs text-emerald-100">On Time</p>
                <p className="text-xl font-bold">95%</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                <p className="text-xs text-emerald-100">Tips Earned</p>
                <p className="text-xl font-bold">₹120</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              emerald: 'bg-emerald-100 text-emerald-600',
              blue: 'bg-blue-100 text-blue-600',
              purple: 'bg-purple-100 text-purple-600',
              amber: 'bg-amber-100 text-amber-600',
            };
            
            return (
              <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                    <p className="text-xs text-emerald-600 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <Icon size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Rating Distribution</h2>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating];
              const percentage = displayDeliveries.length ? (count / displayDeliveries.length) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by order ID, customer, restaurant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>

              {/* Rating Filter */}
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Star</option>
                <option value="4">4 Star</option>
                <option value="3">3 Star</option>
                <option value="2">2 Star</option>
                <option value="1">1 Star</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Package size={18} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Map size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Deliveries List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase">
                        <Package size={14} className="text-emerald-600" />
                        Order ID
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase">
                        <Calendar size={14} className="text-emerald-600" />
                        Date & Time
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase">
                        <User size={14} className="text-emerald-600" />
                        Customer
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase">
                        <Store size={14} className="text-emerald-600" />
                        Restaurant
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase">
                        <IndianRupee size={14} className="text-emerald-600" />
                        Amount
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase">
                        <Star size={14} className="text-emerald-600" />
                        Rating
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase">
                        Actions
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentDeliveries.map((delivery) => (
                    <tr 
                      key={delivery.id} 
                      className="hover:bg-emerald-50/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedDelivery(delivery)}
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-medium text-gray-900">{delivery.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-800">{delivery.date}</p>
                          <p className="text-xs text-gray-500">{delivery.time}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{delivery.customer}</p>
                          <p className="text-xs text-gray-500">{delivery.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{delivery.restaurant}</p>
                        <p className="text-xs text-gray-500">{delivery.items} items</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">{delivery.amount}</p>
                        <p className="text-xs text-emerald-600">+₹{delivery.earnings}</p>
                      </td>
                      <td className="px-6 py-4">
                        {getRatingStars(delivery.rating)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors">
                            <Eye size={16} className="text-gray-500" />
                          </button>
                          <button className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors">
                            <Receipt size={16} className="text-gray-500" />
                          </button>
                          <button className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors">
                            <MoreVertical size={16} className="text-gray-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Deliveries Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => setSelectedDelivery(delivery)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <span className="font-mono text-sm font-bold text-gray-900">{delivery.id}</span>
                      <p className="text-xs text-gray-500">{delivery.date} • {delivery.time}</p>
                    </div>
                  </div>
                  {getRatingStars(delivery.rating)}
                </div>

                {/* Customer Info */}
                <div className="mb-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {delivery.customer.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{delivery.customer}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin size={10} />
                        {delivery.address.substring(0, 30)}...
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Restaurant</p>
                    <p className="text-sm font-medium truncate">{delivery.restaurant}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Distance</p>
                    <p className="text-sm font-medium">{delivery.distance}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-medium">{delivery.duration}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Earnings</p>
                    <p className="text-sm font-medium text-emerald-600">₹{delivery.earnings}</p>
                  </div>
                </div>

                {/* Feedback */}
                {delivery.feedback && (
                  <div className="mt-3 p-2 bg-amber-50 rounded-lg text-xs text-amber-700 border border-amber-100">
                    <div className="flex items-start gap-1">
                      <MessageCircle size={12} className="mt-0.5" />
                      <span>&quot;{delivery.feedback}&quot;</span>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Truck size={12} />
                    <span>{delivery.vehicle}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-600">
                    {delivery.tip > 0 && <span>Tip: ₹{delivery.tip}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredDeliveries.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {isLoading ? 'Loading delivery history...' : 'No deliveries found'}
            </h3>
            <p className="text-gray-500 mb-4">
              {apiError || (isLoading ? 'Fetching your completed deliveries from backend.' : 'Try adjusting your search or filter criteria')}
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setDateFilter('all');
                setRatingFilter('all');
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:shadow-lg transition-all"
            >
              <Filter size={16} />
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredDeliveries.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{indexOfFirstDelivery + 1}</span> to{' '}
                <span className="font-medium">{Math.min(indexOfLastDelivery, filteredDeliveries.length)}</span>{' '}
                of <span className="font-medium">{filteredDeliveries.length}</span> deliveries
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
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
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

        {/* Performance Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Best Performers */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Award size={20} className="text-amber-500" />
              Best Performers
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Star size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Most 5-Star Ratings</p>
                    <p className="text-xs text-gray-500">12 five-star reviews</p>
                  </div>
                </div>
                <span className="text-amber-600 font-bold">🏆</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <TrendingUp size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Fastest Delivery</p>
                    <p className="text-xs text-gray-500">18 min average</p>
                  </div>
                </div>
                <span className="text-emerald-600 font-bold">⚡</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Route size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Most Distance Covered</p>
                    <p className="text-xs text-gray-500">45 km total</p>
                  </div>
                </div>
                <span className="text-blue-600 font-bold">📍</span>
              </div>
            </div>
          </div>

          {/* Monthly Summary */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar size={20} />
              January Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-emerald-100">Deliveries</p>
                <p className="text-2xl font-bold">45</p>
                <p className="text-xs text-emerald-200">+8 vs last month</p>
              </div>
              <div>
                <p className="text-sm text-emerald-100">Earnings</p>
                <p className="text-2xl font-bold">₹8,450</p>
                <p className="text-xs text-emerald-200">+15% growth</p>
              </div>
              <div>
                <p className="text-sm text-emerald-100">Avg Rating</p>
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-xs text-emerald-200">Top performer</p>
              </div>
              <div>
                <p className="text-sm text-emerald-100">On Time</p>
                <p className="text-2xl font-bold">98%</p>
                <p className="text-xs text-emerald-200">Excellent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Details Modal */}
        {selectedDelivery && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedDelivery(null)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Delivery Details</h2>
                      <p className="text-sm text-gray-500">Order #{selectedDelivery.id}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedDelivery(null)}
                    className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Customer</p>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {selectedDelivery.customer.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{selectedDelivery.customer}</p>
                        <p className="text-sm text-gray-500">{selectedDelivery.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedDelivery.address}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Restaurant</p>
                    <p className="font-medium">{selectedDelivery.restaurant}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Order Amount</p>
                    <p className="font-medium text-lg">{selectedDelivery.amount}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Date & Time</p>
                    <p className="font-medium">{selectedDelivery.date} {selectedDelivery.time}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Completed At</p>
                    <p className="font-medium">{selectedDelivery.completedAt}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Distance</p>
                    <p className="font-medium">{selectedDelivery.distance}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-medium">{selectedDelivery.duration}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Payment Method</p>
                    <p className="font-medium">{selectedDelivery.paymentMethod}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Items</p>
                    <p className="font-medium">{selectedDelivery.items} items</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Your Earnings</p>
                    <p className="font-medium text-emerald-600">₹{selectedDelivery.earnings}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Tip Received</p>
                    <p className="font-medium text-emerald-600">₹{selectedDelivery.tip}</p>
                  </div>
                </div>

                {/* Rating and Feedback */}
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-500 mb-2">Customer Rating & Feedback</p>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      {getRatingStars(selectedDelivery.rating)}
                    </div>
                    <p className="text-sm text-gray-700">&quot;{selectedDelivery.feedback}&quot;</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <Printer size={16} />
                    Print
                  </button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <Mail size={16} />
                    Email
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg flex items-center gap-2">
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </SuperLayout>
  );
}

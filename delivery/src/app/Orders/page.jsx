// app/delivery/orders/page.jsx
"use client";
import { useEffect, useState } from 'react';
import SuperLayout from '../SuperLayout/page';
import { deliveryApi, formatRupee } from '../lib/deliveryApi';
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
  AlertCircle,
  ShoppingBag,
  Store,
  TrendingUp,
  Star,
  Truck,
  Timer,
  Wallet,
  Award,
  Zap,
  Gift,
  Shield,
  Coffee,
  Map,
  Navigation,
  RefreshCw
} from 'lucide-react';

const safeText = (value, fallback = '') => String(value ?? fallback);

const normalizeOrder = (order = {}) => ({
  ...order,
  id: safeText(order.id || order.rawId || 'Order'),
  customer: safeText(order.customer, 'Customer'),
  address: safeText(order.address, 'Address not available'),
  restaurant: safeText(order.restaurant, 'Restaurant'),
  phone: safeText(order.phone),
  priority: ['high', 'medium', 'low'].includes(order.priority) ? order.priority : 'low',
  status: safeText(order.status, 'assigned'),
  amount: order.amount || formatRupee(order.amountValue || order.totalAmount || 0),
  deliveryFee: order.deliveryFee || formatRupee(order.deliveryFeeValue || 0),
  items: Number(order.items || 0),
  distance: safeText(order.distance, 'N/A'),
  estimatedTime: safeText(order.estimatedTime, 'N/A'),
  paymentMethod: safeText(order.paymentMethod, 'Cash'),
  rating: order.rating ?? 'N/A',
});

export default function DeliveryOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'table' or 'grid'
  const [apiOrders, setApiOrders] = useState(null);
  const [apiError, setApiError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const ordersPerPage = 6;

  const loadOrders = async () => {
    setIsRefreshing(true);
    setApiError('');

    try {
      const data = await deliveryApi('/delivery/my-orders');
      setApiOrders(data.orders || []);
    } catch (err) {
      setApiError(err.message || 'Failed to load orders');
      setApiOrders([]);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadMountedOrders = () => {
      deliveryApi('/delivery/my-orders')
      .then((data) => {
        if (mounted) setApiOrders(data.orders || []);
      })
      .catch((err) => {
        if (mounted) setApiError(err.message || 'Failed to load orders');
      });
    };

    loadMountedOrders();
    window.addEventListener('deliveryOrdersChanged', loadMountedOrders);

    return () => {
      mounted = false;
      window.removeEventListener('deliveryOrdersChanged', loadMountedOrders);
    };
  }, []);

  useEffect(() => {
    const syncViewMode = () => {
      if (window.innerWidth < 768) setViewMode('grid');
    };

    syncViewMode();
    window.addEventListener('resize', syncViewMode);
    return () => window.removeEventListener('resize', syncViewMode);
  }, []);

  const goOnline = async () => {
    setApiError('');

    try {
      await deliveryApi('/delivery/availability', {
        method: 'PUT',
        body: JSON.stringify({ isAvailable: true }),
      });
      await loadOrders();
    } catch (err) {
      setApiError(err.message || 'Failed to update availability');
    }
  };

  const orders = [
    { 
      id: "RB-101", 
      customer: "Rahul Sharma", 
      address: "Jubilee Hills, Hyderabad - 500033", 
      status: "assigned",
      amount: "₹450",
      items: 3,
      time: "10:30 AM",
      distance: "2.5 km",
      phone: "+91 98765 43210",
      priority: "high",
      restaurant: "Spicy Bites",
      rating: 4.8,
      deliveryFee: "₹40",
      paymentMethod: "Online",
      orderDate: "2024-01-15",
      estimatedTime: "25 min",
      customerNote: "Leave at door, call upon arrival"
    },
    { 
      id: "RB-102", 
      customer: "Aisha Khan", 
      address: "Banjara Hills, Secunderabad - 500034", 
      status: "picked",
      amount: "₹780",
      items: 5,
      time: "11:15 AM",
      distance: "3.2 km",
      phone: "+91 87654 32109",
      priority: "medium",
      restaurant: "Biryani House",
      rating: 4.5,
      deliveryFee: "₹50",
      paymentMethod: "Cash",
      orderDate: "2024-01-15",
      estimatedTime: "35 min",
      customerNote: "Ring bell twice"
    },
    { 
      id: "RB-103", 
      customer: "Priya Patel", 
      address: "Gachibowli, Hyderabad - 500032", 
      status: "delivered",
      amount: "₹320",
      items: 2,
      time: "09:45 AM",
      distance: "1.8 km",
      phone: "+91 76543 21098",
      priority: "low",
      restaurant: "Fresh Bites",
      rating: 4.9,
      deliveryFee: "₹30",
      paymentMethod: "Online",
      orderDate: "2024-01-15",
      estimatedTime: "15 min"
    },
    { 
      id: "RB-104", 
      customer: "Arjun Reddy", 
      address: "Madhapur, Hyderabad - 500081", 
      status: "assigned",
      amount: "₹650",
      items: 4,
      time: "12:00 PM",
      distance: "4.1 km",
      phone: "+91 65432 10987",
      priority: "high",
      restaurant: "Tandoori Nights",
      rating: 4.7,
      deliveryFee: "₹60",
      paymentMethod: "Online",
      orderDate: "2024-01-15",
      estimatedTime: "40 min"
    },
    { 
      id: "RB-105", 
      customer: "Neha Gupta", 
      address: "Kukatpally, Hyderabad - 500072", 
      status: "picked",
      amount: "₹520",
      items: 3,
      time: "10:00 AM",
      distance: "3.5 km",
      phone: "+91 54321 09876",
      priority: "medium",
      restaurant: "Spice Kitchen",
      rating: 4.6,
      deliveryFee: "₹45",
      paymentMethod: "Cash",
      orderDate: "2024-01-15",
      estimatedTime: "30 min"
    },
    { 
      id: "RB-106", 
      customer: "Vikram Singh", 
      address: "Hitech City, Hyderabad - 500084", 
      status: "assigned",
      amount: "₹890",
      items: 6,
      time: "01:30 PM",
      distance: "5.2 km",
      phone: "+91 43210 98765",
      priority: "high",
      restaurant: "Royal Dining",
      rating: 4.9,
      deliveryFee: "₹70",
      paymentMethod: "Online",
      orderDate: "2024-01-15",
      estimatedTime: "45 min"
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      assigned: { 
        color: "bg-amber-100 text-amber-700 border-amber-200", 
        icon: Clock, 
        label: "Assigned",
        gradient: "from-amber-500 to-orange-500"
      },
      picked: { 
        color: "bg-blue-100 text-blue-700 border-blue-200", 
        icon: Package, 
        label: "Picked Up",
        gradient: "from-blue-500 to-cyan-500"
      },
      on_the_way: {
        color: "bg-indigo-100 text-indigo-700 border-indigo-200",
        icon: Navigation,
        label: "On The Way",
        gradient: "from-indigo-500 to-purple-500"
      },
      delivered: { 
        color: "bg-emerald-100 text-emerald-700 border-emerald-200", 
        icon: CheckCircle, 
        label: "Delivered",
        gradient: "from-emerald-500 to-teal-500"
      },
    };
    const config = statusConfig[status] || statusConfig.assigned;
    const Icon = config?.icon || Package;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config?.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {config?.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { 
        color: "bg-rose-100 text-rose-700 border-rose-200", 
        label: "High Priority",
        icon: Zap
      },
      medium: { 
        color: "bg-amber-100 text-amber-700 border-amber-200", 
        label: "Medium",
        icon: Clock
      },
      low: { 
        color: "bg-emerald-100 text-emerald-700 border-emerald-200", 
        label: "Low",
        icon: CheckCircle
      },
    };
    const config = priorityConfig[priority] || priorityConfig.low;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const displayOrders = (apiOrders ?? []).map(normalizeOrder);
  const hasLoadedApiOrders = Array.isArray(apiOrders);

  const cleanPhoneNumber = (phone) => String(phone || '').replace(/[^\d+]/g, '');
  const getMapsUrl = (address) =>
    address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      : '';

  const callCustomer = (order, event) => {
    event?.stopPropagation();
    const phone = cleanPhoneNumber(order.phone);
    if (!phone) {
      setApiError('Customer phone number is not available');
      return;
    }
    window.location.href = `tel:${phone}`;
  };

  const openNavigation = (address, event) => {
    event?.stopPropagation();
    const mapsUrl = getMapsUrl(address);
    if (!mapsUrl) {
      setApiError('Navigation address is not available');
      return;
    }
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  const getOrderRawId = (order) => order.rawId || String(order.id || '').replace(/\D/g, '');

  const getBrowserPosition = () =>
    new Promise((resolve, reject) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        reject(new Error('Location is not supported in this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 15000,
      });
    });

  const shareLiveLocation = async (order, event, silent = false) => {
    event?.stopPropagation();
    const orderId = getOrderRawId(order);

    if (!orderId) {
      if (!silent) setApiError('Order ID is not available');
      return;
    }

    try {
      const position = await getBrowserPosition();
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      await deliveryApi(`/delivery/location/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({ lat, lng }),
      });

      const updatedOrder = {
        ...order,
        deliveryLat: lat,
        deliveryLng: lng,
        liveTrackingAt: new Date().toISOString(),
      };

      setApiOrders((prevOrders) =>
        Array.isArray(prevOrders)
          ? prevOrders.map((item) => (item.id === order.id ? updatedOrder : item))
          : prevOrders
      );
      setSelectedOrder((current) => (current?.id === order.id ? updatedOrder : current));

      if (!silent) setApiError('');
    } catch (err) {
      if (!silent) {
        setApiError(err.message || 'Unable to share live location');
      }
    }
  };

  const updateDeliveryStep = async (order, action, nextStatus, event) => {
    event?.stopPropagation();
    const orderId = getOrderRawId(order);

    if (!orderId) {
      setApiError('Order ID is not available');
      return;
    }

    setUpdatingOrderId(order.id);
    setApiError('');

    try {
      await deliveryApi(`/delivery/${action}/${orderId}`, { method: 'PUT' });
      const updatedOrder = { ...order, status: nextStatus };

      setApiOrders((prevOrders) =>
        Array.isArray(prevOrders)
          ? prevOrders.map((item) => (item.id === order.id ? updatedOrder : item))
          : prevOrders
      );

      setSelectedOrder((current) => (current?.id === order.id ? updatedOrder : current));
      await loadOrders();
    } catch (err) {
      setApiError(err.message || 'Failed to update delivery status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const renderDeliveryStepButton = (order, isFullWidth = false) => {
    const buttonBase = `${isFullWidth ? 'w-full justify-center px-4 py-3' : 'px-3 py-2'} inline-flex items-center gap-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-60`;
    const isUpdating = updatingOrderId === order.id;

    if (order.status === 'assigned') {
      return (
        <button
          onClick={(event) => updateDeliveryStep(order, 'pick', 'picked', event)}
          disabled={isUpdating}
          className={`${buttonBase} bg-emerald-600 text-white hover:bg-emerald-700`}
        >
          <Package size={16} />
          {isUpdating ? 'Updating...' : 'Picked Up'}
        </button>
      );
    }

    if (order.status === 'picked') {
      return (
        <button
          onClick={(event) => updateDeliveryStep(order, 'start', 'on_the_way', event)}
          disabled={isUpdating}
          className={`${buttonBase} bg-indigo-600 text-white hover:bg-indigo-700`}
        >
          <Navigation size={16} />
          {isUpdating ? 'Updating...' : 'Start Delivery'}
        </button>
      );
    }

    if (order.status === 'on_the_way') {
      return (
        <button
          onClick={(event) => updateDeliveryStep(order, 'complete', 'delivered', event)}
          disabled={isUpdating}
          className={`${buttonBase} bg-teal-600 text-white hover:bg-teal-700`}
        >
          <CheckCircle size={16} />
          {isUpdating ? 'Updating...' : 'Delivered'}
        </button>
      );
    }

    return null;
  };

  useEffect(() => {
    const activeOrder = displayOrders.find((order) =>
      ['assigned', 'picked', 'on_the_way'].includes(order.status)
    );

    if (!activeOrder) return undefined;

    shareLiveLocation(activeOrder, null, true);
    const intervalId = setInterval(() => {
      shareLiveLocation(activeOrder, null, true);
    }, 30000);

    return () => clearInterval(intervalId);
  }, [apiOrders]);

  // Filter orders based on search and status
  const filteredOrders = displayOrders.filter(order => {
    const matchesSearch = 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.restaurant.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Stats
  const stats = [
    { 
      label: 'Total Orders', 
      value: displayOrders.length, 
      icon: ShoppingBag, 
      color: 'emerald',
      change: '+12%',
      bg: 'from-emerald-500 to-teal-500'
    },
    { 
      label: 'Active Deliveries', 
      value: displayOrders.filter(o => o.status !== 'delivered').length, 
      icon: Truck, 
      color: 'amber',
      change: '3 now',
      bg: 'from-amber-500 to-orange-500'
    },
    { 
      label: 'Completed', 
      value: displayOrders.filter(o => o.status === 'delivered').length, 
      icon: CheckCircle, 
      color: 'blue',
      change: 'today',
      bg: 'from-blue-500 to-cyan-500'
    },
    { 
      label: 'Total Earnings', 
      value: '₹3,610', 
      icon: Wallet, 
      color: 'purple',
      change: '+8%',
      bg: 'from-purple-500 to-pink-500'
    },
  ];

  return (
    <SuperLayout>
      <div className="min-w-0 space-y-4 pb-8 sm:space-y-6">
        {/* Animated Header */}
        <div className="relative min-w-0 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 p-4 text-white sm:p-6">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="mb-2 flex min-w-0 items-center gap-2">
                  <Package className="h-6 w-6 shrink-0 sm:h-8 sm:w-8" />
                  <h1 className="break-words text-2xl font-bold sm:text-3xl">Delivery Orders</h1>
                </div>
                <p className="text-sm text-emerald-100 sm:text-lg">Manage and track all your delivery orders in real-time</p>
              </div>
              <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:flex sm:gap-3">
                <button className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/20 px-4 py-3 text-sm font-medium backdrop-blur-sm transition-all hover:bg-white/30 sm:px-6">
                  <Calendar size={18} />
                  Today&apos;s Schedule
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-emerald-600 transition-all hover:-translate-y-0.5 hover:shadow-lg sm:px-6">
                  <Download size={18} />
                  Export Report
                </button>
              </div>
            </div>

            {/* Quick Date Info */}
            <div className="mt-4 grid grid-cols-1 gap-2 sm:flex sm:items-center sm:gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 sm:px-4">
                <Calendar size={16} />
                <span className="text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 sm:px-4">
                <Clock size={16} />
                <span className="text-sm">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards with Animation */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="group relative min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bg} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">
                      {stat.change}
                    </span>
                  </div>
                  <p className="mb-1 break-words text-2xl font-bold text-gray-900 sm:text-3xl">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  
                  {/* Progress bar */}
                  <div className="mt-3 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${stat.bg} rounded-full`} style={{ width: `${Math.random() * 40 + 60}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters and View Toggle */}
        <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col items-stretch justify-between gap-3 sm:gap-4 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by order ID, customer, address, or restaurant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="grid w-full grid-cols-1 gap-2 min-[430px]:grid-cols-[1fr_auto] sm:gap-3 lg:w-auto">
              {/* Status Filter */}
              <div className="flex min-w-0 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                <Filter className="text-gray-400 w-4 h-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="assigned">Assigned</option>
                  <option value="picked">Picked Up</option>
                  <option value="on_the_way">On The Way</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center justify-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`hidden rounded-lg p-2 transition-colors md:inline-flex ${viewMode === 'table' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
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

        {/* Orders Display - Table View */}
        {viewMode === 'table' && (
          <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px]">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200">
                    {['Order ID', 'Customer', 'Delivery Address', 'Restaurant', 'Amount', 'Status', 'Actions'].map((header, i) => (
                      <th key={i} className="px-6 py-4 text-left">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {header}
                          {header !== 'Actions' && <ArrowUpDown size={12} className="text-gray-400" />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      className="hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-all group cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                            <Package className="w-4 h-4 text-emerald-700" />
                          </div>
                          <div>
                            <span className="font-mono text-sm font-medium text-gray-900">{order.id}</span>
                            <div className="mt-1">{getPriorityBadge(order.priority)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-800 flex items-center gap-1">
                            <User size={14} className="text-emerald-600" />
                            {order.customer}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Phone size={10} />
                            {order.phone}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star size={10} className="text-amber-400 fill-amber-400" />
                            <span className="text-xs text-gray-600">{order.rating}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 max-w-xs truncate flex items-center gap-1">
                          <MapPin size={14} className="text-emerald-600 flex-shrink-0" />
                          {order.address}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Navigation size={10} />
                            {order.distance}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Timer size={10} />
                            {order.estimatedTime}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Store size={14} className="text-emerald-600" />
                          {order.restaurant}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{order.items} items</p>
                        <p className="text-xs text-gray-500">Fee: {order.deliveryFee}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">{order.amount}</p>
                        <p className="text-xs text-gray-500 mt-1">{order.paymentMethod}</p>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {renderDeliveryStepButton(order)}
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedOrder(order);
                            }}
                            className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} className="text-gray-500 hover:text-emerald-600" />
                          </button>
                          <button
                            onClick={(event) => callCustomer(order, event)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Call Customer"
                          >
                            <Phone size={16} className="text-gray-500 hover:text-blue-600" />
                          </button>
                          <button
                            onClick={(event) => openNavigation(order.address, event)}
                            className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                            title="Navigate"
                          >
                            <Navigation size={16} className="text-gray-500 hover:text-purple-600" />
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

        {/* Orders Display - Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {currentOrders.map((order) => (
              <div 
                key={order.id}
                className="group min-w-0 cursor-pointer rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl sm:p-5"
                onClick={() => setSelectedOrder(order)}
              >
                {/* Header */}
                <div className="mb-3 flex flex-col gap-2 min-[430px]:flex-row min-[430px]:items-start min-[430px]:justify-between">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate font-mono text-sm font-bold text-gray-900">{order.id}</span>
                      <div className="mt-1">{getPriorityBadge(order.priority)}</div>
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Customer Info */}
                <div className="mb-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 p-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {order.customer.charAt(0) || 'C'}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800">{order.customer}</p>
                      <p className="flex items-center gap-1 truncate text-xs text-gray-500">
                        <Phone size={10} />
                        {order.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="mb-3 grid grid-cols-1 gap-2 min-[430px]:grid-cols-2">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Restaurant</p>
                    <p className="text-sm font-medium truncate">{order.restaurant}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Items</p>
                    <p className="text-sm font-medium">{order.items} items</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Distance</p>
                    <p className="text-sm font-medium">{order.distance}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Est. Time</p>
                    <p className="text-sm font-medium">{order.estimatedTime}</p>
                  </div>
                </div>

                {/* Amount and Actions */}
                <div className="flex flex-col gap-3 border-t border-gray-100 pt-3 min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="text-lg font-bold text-gray-900">{order.amount}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 min-[430px]:justify-end">
                    {renderDeliveryStepButton(order)}
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedOrder(order);
                      }}
                      className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} className="text-gray-500" />
                    </button>
                    <button
                      onClick={(event) => callCustomer(order, event)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Call Customer"
                    >
                      <Phone size={16} className="text-gray-500" />
                    </button>
                    <button
                      onClick={(event) => openNavigation(order.address, event)}
                      className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                      title="Navigate"
                    >
                      <Navigation size={16} className="text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Customer Note */}
                {order.customerNote && (
                  <div className="mt-3 p-2 bg-amber-50 rounded-lg text-xs text-amber-700 border border-amber-100">
                    📝 {order.customerNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {hasLoadedApiOrders ? 'No assigned orders yet' : 'No orders found'}
            </h3>
            <p className="text-gray-500 mb-4 max-w-md mx-auto">
              {hasLoadedApiOrders
                ? 'New delivery orders appear here after the restaurant marks an order Ready and you accept the 30-second popup.'
                : 'Try adjusting your search or filter criteria.'}
            </p>
            {apiError && (
              <p className="mx-auto mb-4 max-w-md rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-100">
                {apiError}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all"
              >
                <Filter size={16} />
                Clear Filters
              </button>
              <button
                onClick={loadOrders}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 bg-white border border-emerald-200 text-emerald-700 px-6 py-3 rounded-xl text-sm font-medium hover:bg-emerald-50 transition-all disabled:opacity-60"
              >
                <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={goOnline}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:shadow-lg transition-all"
              >
                <Truck size={16} />
                Go Online
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{' '}
                <span className="font-medium">{Math.min(indexOfLastOrder, filteredOrders.length)}</span>{' '}
                of <span className="font-medium">{filteredOrders.length}</span> orders
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    currentPage === 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-600 hover:bg-gray-100'
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
                    currentPage === totalPages 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Performance Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform"></div>
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-6 h-6" />
                <h3 className="font-semibold text-lg">Today&apos;s Performance</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <p className="text-xs text-emerald-100">Deliveries</p>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-xs text-emerald-200">+2 vs yesterday</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <p className="text-xs text-emerald-100">On Time</p>
                  <p className="text-2xl font-bold">98%</p>
                  <p className="text-xs text-emerald-200">Top performer</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <p className="text-xs text-emerald-100">Rating</p>
                  <p className="text-2xl font-bold">4.9</p>
                  <p className="text-xs text-emerald-200">⭐ 245 reviews</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <p className="text-xs text-emerald-100">Earned</p>
                  <p className="text-2xl font-bold">₹850</p>
                  <p className="text-xs text-emerald-200">Today</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Tips */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertCircle size={16} className="text-amber-600" />
              </div>
              Pro Delivery Tips
            </h3>
            <ul className="space-y-3">
              {[
                'Call customer 5 mins before arrival',
                'Check order items before leaving',
                'Keep food warm in thermal bag',
                'Always wear helmet and safety gear',
                'Maintain 4.8+ rating for bonus'
              ].map((tip, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Peak Hours & Rewards */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Timer size={20} />
                <h3 className="font-semibold">Peak Hours Today</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>12:00 - 14:00</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">High Demand</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>19:00 - 21:00</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">High Demand</span>
                </div>
                <p className="text-xs text-amber-100 mt-2">Extra ₹50 per delivery in peak hours!</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Gift size={20} className="text-purple-600" />
                <h3 className="font-semibold text-gray-800">Rewards Progress</h3>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Gold Tier</span>
                  <span className="font-medium text-purple-600">75%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                </div>
              </div>
              <p className="text-xs text-gray-500">45 more deliveries to reach Gold tier</p>
            </div>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/60"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative overflow-hidden p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
                <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                        <Package size={13} />
                        {selectedOrder.id}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                        <Timer size={13} />
                        {selectedOrder.estimatedTime}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold">Order Details</h2>
                    <p className="text-sm text-emerald-50 mt-1">Pickup, customer contact, and delivery route</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="h-10 w-10 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold transition-colors"
                    aria-label="Close order details"
                  >
                    X
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                    <p className="text-xs font-semibold uppercase text-emerald-700">Status</p>
                    <div className="mt-2">{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                  <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
                    <p className="text-xs font-semibold uppercase text-amber-700">Earning</p>
                    <p className="mt-1 text-xl font-bold text-gray-900">{selectedOrder.deliveryFee}</p>
                  </div>
                  <div className="rounded-xl bg-cyan-50 border border-cyan-100 p-4">
                    <p className="text-xs font-semibold uppercase text-cyan-700">Distance</p>
                    <p className="mt-1 text-xl font-bold text-gray-900">{selectedOrder.distance}</p>
                  </div>
                </div>

                {renderDeliveryStepButton(selectedOrder, true)}

                {['assigned', 'picked', 'on_the_way'].includes(selectedOrder.status) && (
                  <button
                    onClick={(event) => shareLiveLocation(selectedOrder, event)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
                  >
                    <Map size={16} />
                    Share Live Location
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold">
                        {selectedOrder.customer?.charAt(0) || 'C'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase text-gray-500">Customer</p>
                        <h3 className="text-lg font-bold text-gray-900 truncate">{selectedOrder.customer}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Phone size={14} />
                          {selectedOrder.phone || 'Phone not available'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => callCustomer(selectedOrder)}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                      <Phone size={16} />
                      Call Customer
                    </button>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center">
                        <Store size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase text-gray-500">Pickup From</p>
                        <h3 className="text-lg font-bold text-gray-900 truncate">{selectedOrder.restaurant}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {selectedOrder.restaurantAddress || 'Restaurant address not available'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => openNavigation(selectedOrder.restaurantAddress || selectedOrder.restaurant)}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
                    >
                      <MapPin size={16} />
                      Navigate to Pickup
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center">
                      <Navigation size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase text-gray-500">Delivery Address</p>
                      <h3 className="text-base font-semibold text-gray-900 mt-1">{selectedOrder.address}</h3>
                      {selectedOrder.customerNote && (
                        <p className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                          {selectedOrder.customerNote}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => openNavigation(selectedOrder.address)}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-sm font-semibold text-white hover:shadow-lg transition-all"
                  >
                    <Navigation size={16} />
                    Start Delivery Navigation
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="font-bold text-gray-900">{selectedOrder.amount}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Payment</p>
                    <p className="font-bold text-gray-900">{selectedOrder.paymentMethod}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Items</p>
                    <p className="font-bold text-gray-900">{selectedOrder.items} items</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Priority</p>
                    <div className="mt-1">{getPriorityBadge(selectedOrder.priority)}</div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-5 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => openNavigation(selectedOrder.address)}
                    className="px-5 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                  >
                    <Navigation size={16} />
                    Navigate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {false && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Order Details #{selectedOrder.id}</h2>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white rounded-lg">
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Order details content */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Customer</p>
                    <p className="font-medium">{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium">{selectedOrder.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Delivery Address</p>
                    <p className="font-medium">{selectedOrder.address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Restaurant</p>
                    <p className="font-medium">{selectedOrder.restaurant}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="font-medium text-lg">{selectedOrder.amount}</p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    Close
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg">
                    Start Navigation
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

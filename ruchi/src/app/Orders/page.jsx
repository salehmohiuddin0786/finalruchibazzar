"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  CreditCard, 
  CheckCircle,
  Package,
  AlertCircle,
  Star,
  Phone,
  MessageCircle,
  Edit,
  ChevronDown,
  ChevronUp,
  Loader,
  Utensils,
  Coffee,
  Pizza,
  Beef,
  Salad,
  ShoppingCart,
  Bike,
  Timer,
  Calendar,
  Receipt,
  Wallet,
  Home,
  Copy,
  CheckCheck,
  Navigation,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('active');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState({
    active: [],
    past: []
  });
  const [expandedSections, setExpandedSections] = useState({
    tracking: true,
    address: true,
    payment: true
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const socketUrl = apiUrl.replace(/\/api\/?$/, '');

  const ensureSocketIo = () =>
    new Promise((resolve, reject) => {
      if (typeof window === 'undefined') return reject(new Error('Socket is not available'));
      if (window.io) return resolve(window.io);

      const existingScript = document.querySelector('script[data-ruchi-socket]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(window.io), { once: true });
        existingScript.addEventListener('error', reject, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = `${socketUrl}/socket.io/socket.io.js`;
      script.async = true;
      script.dataset.ruchiSocket = 'true';
      script.onload = () => resolve(window.io);
      script.onerror = () => reject(new Error('Unable to load live tracking'));
      document.body.appendChild(script);
    });

  // Check if desktop view
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Get auth token from localStorage
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Get user data from localStorage
  const getUserData = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          return JSON.parse(user);
        } catch (e) {
          console.error('Error parsing user:', e);
          return null;
        }
      }
    }
    return null;
  };

  // Check if user is logged in and get role
  useEffect(() => {
    const token = getAuthToken();
    const userData = getUserData();
    setIsLoggedIn(!!token);
    setUserRole(userData?.role || null);
  }, []);

  // Copy order ID to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Fetch orders from backend - FIXED for your backend structure
  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      
      if (!token) {
        setError('Please log in to view your orders');
        if (!silent) setLoading(false);
        return;
      }

      console.log('Fetching orders from:', `${apiUrl}/orders/user`);

      // ✅ Using your backend endpoint
      const res = await fetch(`${apiUrl}/orders/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      console.log("API Response:", data);

      if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setError('Your session has expired. Please log in again.');
        if (!silent) setLoading(false);
        return;
      }
      
      if (res.status === 403) {
        setError(data.message || 'You do not have permission to view orders. Only customers can view orders.');
        if (!silent) setLoading(false);
        return;
      }
      
      if (!res.ok) {
        throw new Error(data.message || `Failed to fetch orders: ${res.status}`);
      }

      // Extract orders array from response - your backend returns { success: true, orders: [] }
      let ordersArray = [];
      if (data.success && Array.isArray(data.orders)) {
        ordersArray = data.orders;
      } else if (Array.isArray(data)) {
        ordersArray = data;
      } else {
        console.error("Unexpected data structure:", data);
        setOrders({ active: [], past: [] });
        if (!silent) setLoading(false);
        return;
      }

      console.log('Orders array length:', ordersArray.length);
      console.log('First order structure:', ordersArray[0]);

      // Separate orders into active and past based on status
      const activeOrdersList = [];
      const pastOrdersList = [];

      ordersArray.forEach(order => {
        const orderStatus = order.status?.toLowerCase();
        
      if (['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'picked_up', 'on the way'].includes(orderStatus)) {
        activeOrdersList.push(transformOrderData(order));
        } else if (['delivered', 'cancelled', 'rejected'].includes(orderStatus)) {
          pastOrdersList.push(transformOrderData(order));
        } else {
          // Default to past if status unknown
          pastOrdersList.push(transformOrderData(order));
        }
      });

      setOrders({
        active: activeOrdersList,
        past: pastOrdersList
      });

      console.log(`Active: ${activeOrdersList.length}, Past: ${pastOrdersList.length}`);

    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders. Please try again.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Get food icon based on item name
  const getFoodIcon = (itemName) => {
    const name = itemName?.toLowerCase() || '';
    if (name.includes('pizza')) return <Pizza className="w-4 h-4" />;
    if (name.includes('burger')) return <Beef className="w-4 h-4" />;
    if (name.includes('salad')) return <Salad className="w-4 h-4" />;
    if (name.includes('coffee') || name.includes('tea')) return <Coffee className="w-4 h-4" />;
    if (name.includes('naan') || name.includes('roti')) return <Utensils className="w-4 h-4" />;
    return <ShoppingBag className="w-4 h-4" />;
  };

  // Transform backend order data to frontend format - FIXED for your structure
  const transformOrderData = (order) => {
    console.log('Transforming order:', order);
    
    // Handle OrderItems from your backend
    let items = [];
    
    if (order.OrderItems && Array.isArray(order.OrderItems)) {
      items = order.OrderItems.map(item => {
        // Get dish name from the item or use a default
        const dishName = item.dish?.name || `Item ${item.dishId}`;
        return {
          name: dishName,
          quantity: item.quantity || 1,
          price: item.price || 0,
          totalPrice: (item.price || 0) * (item.quantity || 1),
          dishId: item.dishId,
          icon: getFoodIcon(dishName)
        };
      });
    } else if (order.items && Array.isArray(order.items)) {
      items = order.items.map(item => ({
        name: item.name || 'Unknown Item',
        quantity: item.quantity || 1,
        price: item.price || 0,
        totalPrice: (item.price || 0) * (item.quantity || 1),
        icon: getFoodIcon(item.name)
      }));
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = order.tax || subtotal * 0.05;
    const deliveryFee = order.deliveryFee || 40;
    const total = order.totalAmount || order.originalAmount || (subtotal + tax + deliveryFee);

    // Parse delivery address if it's a string
    let deliveryAddress = order.deliveryAddress;
    if (typeof deliveryAddress === 'string') {
      try {
        deliveryAddress = JSON.parse(deliveryAddress);
      } catch (e) {
        deliveryAddress = { address: deliveryAddress };
      }
    }

    // Get restaurant name (you might need to fetch this separately)
    const restaurantName = order.restaurant?.name || order.restaurantName || 'Restaurant';

    return {
      id: order.orderId || `#ORD-${order.id}`,
      orderId: order.id,
      type: 'Restaurant',
      restaurant: restaurantName,
      items: items,
      subtotal: subtotal,
      tax: tax,
      deliveryFee: deliveryFee,
      total: formatINR(total),
      status: getOrderStatus(order.status),
      statusText: getStatusText(order.status),
      time: getOrderTime(order.createdAt),
      estimatedDelivery: getEstimatedDelivery(order.createdAt),
      driver: order.driver || null,
      deliveryPartnerId: order.deliveryPartnerId || null,
      deliveryPartnerName: order.deliveryPartnerName || order.driver?.name || null,
      deliveryPartnerPhone: order.driver?.phone || order.deliveryPartnerPhone || null,
      deliveryLat: order.deliveryLat || order.deliveryLatitude || null,
      deliveryLng: order.deliveryLng || order.deliveryLongitude || null,
      deliveryStatus: order.deliveryStatus || null,
      liveTrackingAt: order.liveTrackingAt || null,
      rating: order.rating || 0,
      review: order.review || '',
      orderStatus: order.status,
      createdAt: order.createdAt,
      deliveryAddress: deliveryAddress,
      paymentMethod: order.paymentMethod || { type: 'cash', text: 'Cash on Delivery' },
      paymentStatus: order.paymentStatus || 'pending',
      discount: order.discount || 0,
      couponCode: order.couponCode || null,
      originalAmount: order.originalAmount || subtotal
    };
  };

  const getOrderStatus = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'pending';
      case 'confirmed': return 'confirmed';
      case 'preparing': return 'preparing';
      case 'ready': return 'preparing';
      case 'out_for_delivery': return 'on_the_way';
      case 'picked_up': return 'on_the_way';
      case 'on the way': return 'on_the_way';
      case 'delivered': return 'delivered';
      case 'cancelled': return 'cancelled';
      case 'rejected': return 'cancelled';
      default: return 'pending';
    }
  };

  const getStatusText = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'Order placed';
      case 'confirmed': return 'Order confirmed';
      case 'preparing': return 'Preparing your order';
      case 'ready': return 'Order is ready';
      case 'out_for_delivery': return 'Out for delivery';
      case 'picked_up': return 'Picked up by partner';
      case 'on the way': return 'Out for delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      case 'rejected': return 'Rejected';
      default: return 'Processing';
    }
  };

  const getOrderTime = (createdAt) => {
    if (!createdAt) return 'Just now';
    
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getEstimatedDelivery = (createdAt) => {
    if (!createdAt) return '30-40 mins';
    const date = new Date(createdAt);
    date.setMinutes(date.getMinutes() + 45);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'on_the_way': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'confirmed': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'preparing': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'on_the_way': return <Bike className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <Timer className="w-4 h-4" />;
      case 'confirmed': return <CheckCheck className="w-4 h-4" />;
      case 'preparing': return <Utensils className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Fetch orders on mount and when login status changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return undefined;

    const userData = getUserData();
    if (!userData?.id) return undefined;

    let socket;
    let cancelled = false;

    const updateOrderLocation = (payload) => {
      setOrders((previous) => {
        const updateList = (list) =>
          list.map((order) =>
            Number(order.orderId) === Number(payload.orderId)
              ? {
                  ...order,
                  deliveryLat: payload.deliveryLat,
                  deliveryLng: payload.deliveryLng,
                  deliveryStatus: payload.deliveryStatus || order.deliveryStatus,
                  orderStatus: payload.status || order.orderStatus,
                  status: getOrderStatus(payload.status || order.orderStatus),
                  statusText: getStatusText(payload.status || order.orderStatus),
                  liveTrackingAt: payload.updatedAt || new Date().toISOString(),
                }
              : order
          );

        return {
          active: updateList(previous.active),
          past: updateList(previous.past),
        };
      });
    };

    ensureSocketIo()
      .then((io) => {
        if (cancelled || !io) return;
        socket = io(socketUrl, { transports: ['websocket', 'polling'] });
        socket.emit('joinUserRoom', userData.id);
        socket.on('deliveryLocationUpdated', updateOrderLocation);
        socket.on('deliveryAssigned', () => fetchOrders(true));
        socket.on('orderStatusUpdated', () => fetchOrders(true));
        socket.on('orderPlaced', () => fetchOrders(true));
      })
      .catch((err) => console.error('Live tracking socket error:', err));

    const fallbackPoll = setInterval(() => fetchOrders(true), 20000);

    return () => {
      cancelled = true;
      clearInterval(fallbackPoll);
      if (socket) socket.disconnect();
    };
  }, [isLoggedIn]);

  const handleLoginRedirect = () => {
    router.push('/login?redirect=orders');
  };

  const handleReorder = async (order) => {
    router.push(`/restaurant/${order.orderId}`);
  };

  const handleTrackOrder = (order) => {
    if (order.liveTrackingAt && order.deliveryLat && order.deliveryLng) {
      window.open(`https://www.google.com/maps?q=${order.deliveryLat},${order.deliveryLng}`, '_blank', 'noopener,noreferrer');
      return;
    }

    setExpandedOrder(order.id);
  };

  const handleCallDriver = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleMessageDriver = (phone) => {
    window.location.href = `sms:${phone}`;
  };

  const renderLiveTracking = (order) => {
    if (activeTab !== 'active') return null;

    const hasPartner = order.deliveryPartnerName || order.deliveryPartnerId || order.driver;
    const hasLocation = order.liveTrackingAt && order.deliveryLat && order.deliveryLng;
    const lastUpdated = order.liveTrackingAt
      ? new Date(order.liveTrackingAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      : null;

    if (!hasPartner && !hasLocation && order.status !== 'on_the_way') return null;

    return (
      <div className="mb-6 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase text-blue-700">Live Tracking</p>
            <h4 className="font-bold text-gray-900 mt-1">
              {order.deliveryPartnerName || order.driver?.name || 'Delivery partner assigned'}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {hasLocation
                ? `Current location: ${Number(order.deliveryLat).toFixed(5)}, ${Number(order.deliveryLng).toFixed(5)}`
                : 'Waiting for partner live location'}
            </p>
            {lastUpdated && <p className="text-xs text-blue-700 mt-1">Updated at {lastUpdated}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <button
            onClick={() => handleTrackOrder(order)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
            disabled={!hasLocation}
          >
            <ExternalLink className="w-4 h-4" />
            Open Live Map
          </button>
          <button
            onClick={() => handleCallDriver(order.deliveryPartnerPhone || order.driver?.phone)}
            disabled={!(order.deliveryPartnerPhone || order.driver?.phone)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors disabled:opacity-60"
          >
            <Phone className="w-4 h-4" />
            Call Partner
          </button>
        </div>
      </div>
    );
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Delivery address state
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    default: true
  });

  // Fetch user profile for address
  const fetchUserProfile = async () => {
    const token = getAuthToken();
    if (token) {
      try {
        const response = await fetch(`${apiUrl}/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const userData = await response.json();
          const user = userData.user || userData;
          setDeliveryAddress({
            name: user.name || 'User Name',
            address: user.address || 'No address saved',
            city: user.city || '',
            phone: user.phone || '',
            default: true
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn]);

  const paymentMethods = [{ type: 'cash', text: 'Cash on Delivery', default: true }];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Package className="w-10 h-10 text-orange-500" />
              </div>
              <Loader className="w-8 h-8 text-orange-500 animate-spin absolute top-6 left-1/2 transform -translate-x-1/2" />
            </div>
            <p className="text-gray-600 font-medium">Loading your orders...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Package className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">View Your Orders</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Log in to track your orders and view your order history!
            </p>
            <button
              onClick={handleLoginRedirect}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 mx-auto"
            >
              <ShoppingBag className="w-5 h-5" />
              Log In to Continue
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Show role-based message if not customer
  if (userRole && userRole !== 'customer') {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Access Restricted</h2>
            <p className="text-gray-600 mb-8">
              Only customers can view order history. You are logged in as a <span className="font-semibold">{userRole}</span>.
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              Go to Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error && !orders.active.length && !orders.past.length) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Orders</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={fetchOrders}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
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
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          
          <div className="mb-8 lg:mb-12 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mb-3">
              Your Orders
            </h1>
            <p className="text-gray-600 text-lg">
              Track your delicious journey with us
            </p>
          </div>

          {/* Mobile Order Stats */}
          <div className="lg:hidden grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-orange-100">
              <div className="flex items-center gap-3 text-orange-600 mb-2">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="font-semibold">Active</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{orders.active.length}</p>
              <p className="text-xs text-gray-500 mt-1">orders in progress</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-green-100">
              <div className="flex items-center gap-3 text-green-600 mb-2">
                <div className="p-2 bg-green-100 rounded-xl">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="font-semibold">Completed</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{orders.past.length}</p>
              <p className="text-xs text-gray-500 mt-1">total orders</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
            
            {/* Left Column - Order List */}
            <div className="lg:col-span-2">
              
              {/* Order Tabs */}
              <div className="flex gap-2 bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl mb-8 border border-gray-200">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`flex-1 py-3 px-4 text-center text-sm sm:text-base font-semibold rounded-xl transition-all ${
                    activeTab === 'active'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200'
                      : 'text-gray-600 hover:bg-orange-50'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Active ({orders.active.length})
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`flex-1 py-3 px-4 text-center text-sm sm:text-base font-semibold rounded-xl transition-all ${
                    activeTab === 'past'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200'
                      : 'text-gray-600 hover:bg-orange-50'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    Past ({orders.past.length})
                  </span>
                </button>
              </div>

              {/* Empty State */}
              {orders[activeTab].length === 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-100 p-12 text-center">
                  <div className="w-28 h-28 bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Package className="w-14 h-14 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No {activeTab} orders yet
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg">
                    {activeTab === 'active' 
                      ? 'Ready to satisfy your cravings? Place your first order!'
                      : 'Your order history will appear here once you place orders'}
                  </p>
                  <Link href="/">
                    <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg inline-flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      Browse Restaurants
                    </button>
                  </Link>
                </div>
              )}

              {/* Orders List */}
              <div className="space-y-6">
                {orders[activeTab].map((order) => (
                  <div 
                    key={order.id} 
                    className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-100 overflow-hidden"
                  >
                    {/* Order Header */}
                    <div 
                      className="p-6 border-b border-orange-100 cursor-pointer lg:cursor-default bg-gradient-to-r from-orange-50 to-transparent"
                      onClick={() => toggleOrderExpand(order.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500">
                            <Utensils className="w-5 h-5 text-white" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                                {order.restaurant}
                              </h3>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(order.id);
                                }}
                                className="text-gray-400 hover:text-orange-500 transition-colors"
                              >
                                {copiedId === order.id ? (
                                  <CheckCheck className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{order.time}</span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span>{order.items.length} items</span>
                            </div>
                          </div>
                        </div>

                        <button className="lg:hidden p-2 hover:bg-orange-100 rounded-xl">
                          {expandedOrder === order.id ? (
                            <ChevronUp className="w-5 h-5 text-orange-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-orange-500" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div>
                            <span className="text-2xl sm:text-3xl font-bold text-orange-600">
                            {order.total}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">Total amount</p>
                        </div>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span>{order.statusText}</span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content - Mobile */}
                    {(expandedOrder === order.id) && (
                      <div className="p-6 border-t border-orange-100 lg:hidden">
                        {/* Order Items */}
                        <div className="mb-6">
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Receipt className="w-5 h-5 text-orange-500" />
                            Order Items
                          </h4>
                          <div className="space-y-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 bg-orange-50/50 rounded-xl">
                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                  {item.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-semibold text-gray-900">{item.name}</p>
                                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="font-semibold text-orange-600">
                                      {formatINR(item.price * item.quantity)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {renderLiveTracking(order)}

                        {/* Price Details */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-orange-500" />
                            Price Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Subtotal</span>
                              <span className="font-medium">{formatINR(order.subtotal)}</span>
                            </div>
                            {order.discount > 0 && (
                              <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>-{formatINR(order.discount)}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-600">Delivery Fee</span>
                              <span className="font-medium">{formatINR(order.deliveryFee)}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 mt-2">
                              <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span className="text-orange-600">{order.total}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {activeTab === 'active' && (
                          <button 
                            onClick={() => handleTrackOrder(order)}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2"
                          >
                            <Bike className="w-4 h-4" />
                            Track Order
                          </button>
                        )}

                        {activeTab === 'past' && (
                          <button 
                            onClick={() => handleReorder(order)}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            Reorder
                          </button>
                        )}
                      </div>
                    )}

                    {/* Desktop View */}
                    <div className="hidden lg:block p-6">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-orange-500" />
                        Order Items
                      </h4>
                      <div className="space-y-3 mb-6">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-orange-50/50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                {item.icon}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-semibold text-orange-600">
                              {formatINR(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {renderLiveTracking(order)}

                      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-3">Price Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>{formatINR(order.subtotal)}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Discount</span>
                              <span>-{formatINR(order.discount)}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Fee</span>
                            <span>{formatINR(order.deliveryFee)}</span>
                          </div>
                          <div className="border-t border-gray-200 pt-2 mt-2">
                            <div className="flex justify-between font-bold">
                              <span>Total</span>
                              <span className="text-orange-600">{order.total}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {activeTab === 'active' ? (
                        <button 
                          onClick={() => handleTrackOrder(order)}
                          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2"
                        >
                          <Bike className="w-4 h-4" />
                          Track Order
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleReorder(order)}
                          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Info Cards */}
            <div className="space-y-6">
              
              {/* Delivery Address */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
                <div 
                  className="p-6 flex items-center justify-between cursor-pointer lg:cursor-default bg-gradient-to-r from-orange-50 to-transparent border-b border-orange-100"
                  onClick={() => toggleSection('address')}
                >
                  <h3 className="font-bold text-gray-900 flex items-center gap-3 text-lg">
                    <div className="p-2 bg-orange-100 rounded-xl">
                      <MapPin className="w-5 h-5 text-orange-500" />
                    </div>
                    <span>Delivery Address</span>
                  </h3>
                  <Link href="/profile">
                    <button className="text-sm text-orange-600 font-semibold hover:text-orange-700 hidden lg:block">
                      Edit
                    </button>
                  </Link>
                </div>
                
                {(expandedSections.address || isDesktop) && (
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <Home className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-lg">{deliveryAddress.name || 'Add Address'}</p>
                        <p className="text-gray-600 mt-1">{deliveryAddress.address || 'No address saved'}</p>
                        {deliveryAddress.city && <p className="text-gray-600">{deliveryAddress.city}</p>}
                        {deliveryAddress.phone && (
                          <div className="flex items-center gap-2 mt-3 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{deliveryAddress.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
                <div 
                  className="p-6 flex items-center justify-between cursor-pointer lg:cursor-default bg-gradient-to-r from-orange-50 to-transparent border-b border-orange-100"
                  onClick={() => toggleSection('payment')}
                >
                  <h3 className="font-bold text-gray-900 flex items-center gap-3 text-lg">
                    <div className="p-2 bg-orange-100 rounded-xl">
                      <CreditCard className="w-5 h-5 text-orange-500" />
                    </div>
                    <span>Payment Methods</span>
                  </h3>
                  <Link href="/profile">
                    <button className="text-sm text-orange-600 font-semibold hover:text-orange-700 hidden lg:block">
                      Add New
                    </button>
                  </Link>
                </div>
                
                {(expandedSections.payment || isDesktop) && (
                  <div className="p-6">
                    {paymentMethods.map((method, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-gray-700" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{method.text}</p>
                            <p className="text-xs text-gray-500">Default</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1.5 rounded-xl">
                          Default
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Help Section */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-xl">Need Help?</h3>
                </div>
                <p className="text-white/90 mb-6">
                  Having issues with your order? Our support team is here 24/7!
                </p>
                <a href="tel:1800123456">
                  <button className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center justify-center gap-2 border border-white/30">
                    <Phone className="w-4 h-4" />
                    Call Support
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Page;

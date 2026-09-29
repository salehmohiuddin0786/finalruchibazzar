// components/OrderCard.jsx
"use client";
import { 
  Clock,
  MapPin,
  Phone,
  User,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Truck,
  Package,
  ShoppingBag,
  CreditCard,
  Home,
  Calendar,
  AlertCircle,
  Star,
  Timer,
  Utensils,
  Receipt,
  CircleCheck,
  CircleX,
  PackageCheck,
  Bike
} from "lucide-react";
import { useState } from "react";

const OrderCard = ({ order, isExpanded, onToggleDetails, onUpdateStatus }) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
      case 'preparing': return { bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
      case 'ready': return { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
      case 'on the way': return { bg: 'bg-indigo-500', light: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
      case 'delivered': return { bg: 'bg-green-500', light: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
      case 'cancelled': return { bg: 'bg-red-500', light: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
      default: return { bg: 'bg-gray-500', light: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return <Timer size={14} />;
      case 'preparing': return <Utensils size={14} />;
      case 'ready': return <PackageCheck size={14} />;
      case 'on the way': return <Bike size={14} />;
      case 'delivered': return <CircleCheck size={14} />;
      case 'cancelled': return <CircleX size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const getStatusActions = (status) => {
    const actions = [];
    
    if (status === 'pending') {
      actions.push({ 
        label: 'Accept Order', 
        status: 'preparing', 
        icon: Check, 
        color: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
        textColor: 'text-white'
      });
      actions.push({ 
        label: 'Reject', 
        status: 'cancelled', 
        icon: X, 
        color: 'bg-white border-2 border-red-500 hover:bg-red-50',
        textColor: 'text-red-600'
      });
    } else if (status === 'preparing') {
      actions.push({ 
        label: 'Mark Ready', 
        status: 'ready', 
        icon: Package, 
        color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
        textColor: 'text-white'
      });
    } else if (status === 'ready') {
      actions.push({ 
        label: 'Out for Delivery', 
        status: 'on the way', 
        icon: Truck, 
        color: 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600',
        textColor: 'text-white'
      });
    } else if (status === 'on the way') {
      actions.push({ 
        label: 'Mark Delivered', 
        status: 'delivered', 
        icon: Check, 
        color: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
        textColor: 'text-white'
      });
    }
    
    return actions;
  };

  const handleStatusUpdate = (newStatus) => {
    onUpdateStatus(order.id, newStatus);
    setShowStatusMenu(false);
  };

  const actions = getStatusActions(order.status);
  const statusColors = getStatusColor(order.status);

  // Calculate estimated delivery time
  const getEstimatedTime = () => {
    if (order.status === 'delivered') return 'Delivered';
    if (order.status === 'cancelled') return 'Cancelled';
    if (order.status === 'on the way') return 'Arriving in 10-15 min';
    if (order.status === 'ready') return 'Ready for pickup';
    if (order.status === 'preparing') return 'Preparing - 20-25 min';
    return 'Waiting for confirmation';
  };

  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg overflow-hidden border transition-all duration-300 ${
        isExpanded ? 'shadow-xl ring-2 ring-orange-200' : 'border-gray-100 hover:shadow-xl'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Header */}
      <div className={`h-1 bg-gradient-to-r ${
        order.status === 'delivered' ? 'from-green-400 to-emerald-500' :
        order.status === 'cancelled' ? 'from-red-400 to-red-500' :
        'from-orange-400 to-red-500'
      }`} />

      <div className="p-5">
        {/* Order Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Order Number Badge */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center shadow-md">
                <Receipt size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">ORDER #{order.orderNumber}</p>
                <div className="flex items-center gap-2">
                  <Calendar size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-500">{order.date}</span>
                  <Clock size={12} className="text-gray-400 ml-1" />
                  <span className="text-xs text-gray-500">{order.time}</span>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className={`px-3 py-1.5 rounded-full ${statusColors.light} ${statusColors.border} border flex items-center gap-1.5`}>
              <span className={statusColors.text}>{getStatusIcon(order.status)}</span>
              <span className={`text-xs font-semibold ${statusColors.text}`}>
                {order.status?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Total Amount */}
          <div className="text-right">
            <p className="text-xs text-gray-500">Total Amount</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              ₹{order.total || order.totalAmount}
            </p>
          </div>
        </div>

        {/* Customer Info Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <User size={14} className="text-blue-600" />
              <span className="text-xs text-gray-600">Customer</span>
            </div>
            <p className="font-semibold text-gray-800 text-sm">{order.customer || order.customerName}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Phone size={14} className="text-green-600" />
              <span className="text-xs text-gray-600">Contact</span>
            </div>
            <p className="font-semibold text-gray-800 text-sm">{order.phone || order.customerPhone}</p>
          </div>
        </div>

        {/* Items Summary */}
        <div className="bg-gray-50 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag size={14} className="text-gray-500" />
            <span className="text-xs font-medium text-gray-600">Order Items</span>
          </div>
          <div className="text-sm text-gray-700">
            {order.items?.slice(0, 2).map((item, idx) => (
              <span key={idx}>
                <span className="font-medium">{item.quantity}x</span> {item.name}
                {idx < Math.min(order.items.length, 2) - 1 && ", "}
              </span>
            ))}
            {order.items?.length > 2 && (
              <span className="text-orange-600 font-medium"> +{order.items.length - 2} more items</span>
            )}
          </div>
        </div>

        {/* Estimated Time */}
        <div className="flex items-center gap-2 mb-4 p-2 bg-amber-50 rounded-lg">
          <Timer size={14} className="text-amber-600" />
          <span className="text-xs text-amber-700 font-medium">{getEstimatedTime()}</span>
        </div>

        {/* Action Buttons */}
        {actions.length > 0 && (
          <div className="flex gap-3 mt-2">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleStatusUpdate(action.status)}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${action.color} ${action.textColor}`}
              >
                <action.icon size={16} />
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Expand/Collapse Button */}
        <button
          onClick={onToggleDetails}
          className="w-full mt-3 py-2 text-center text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center justify-center gap-1 transition-colors"
        >
          {isExpanded ? (
            <>Hide Details <ChevronDown size={16} /></>
          ) : (
            <>View Details <ChevronRight size={16} /></>
          )}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gradient-to-br from-gray-50 to-white p-5 animate-fadeIn">
          {/* Delivery Address - FIXED: Now using deliveryAddress field */}
          {(order.deliveryAddress || order.address) && (
            <div className="mb-4 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Home size={12} className="text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-700 text-sm">Delivery Address</h4>
              </div>
              <div className="flex items-start gap-2 pl-8">
                <MapPin size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">{order.deliveryAddress || order.address}</p>
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="mb-4 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingBag size={12} className="text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-700 text-sm">Order Items</h4>
            </div>
            <div className="space-y-2 pl-8">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                  <span className="text-gray-600">
                    <span className="font-medium text-gray-800">{item.quantity}x</span> {item.name}
                  </span>
                  <span className="font-semibold text-gray-800">₹{item.total || item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-4 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard size={12} className="text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-700 text-sm">Payment Summary</h4>
            </div>
            <div className="space-y-2 pl-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-800">₹{order.amount || order.originalAmount}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (GST)</span>
                  <span className="font-medium text-gray-800">₹{order.tax}</span>
                </div>
              )}
              {order.delivery > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium text-gray-800">₹{order.delivery}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-2 border-t border-gray-100">
                <span className="text-gray-800">Total</span>
                <span className="text-lg bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  ₹{order.total || order.totalAmount}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          {order.paymentStatus && (
            <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Payment Status</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                  order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.paymentStatus?.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* Special Instructions */}
          {order.specialInstructions && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex items-start gap-2">
                <AlertCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-amber-700 mb-1">Special Instructions</p>
                  <p className="text-sm text-amber-800">{order.specialInstructions}</p>
                </div>
              </div>
            </div>
          )}

          {/* Coupon Code Section */}
          {order.couponCode && (
            <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Coupon Applied</span>
                </div>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg font-mono">
                  {order.couponCode}
                </span>
              </div>
            </div>
          )}

          {/* Rating Section (only for delivered orders) */}
          {order.status === 'delivered' && !order.rated && (
            <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">Rate this order</span>
                </div>
                <button className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-lg font-medium hover:shadow-md transition-all">
                  Rate Now
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OrderCard;
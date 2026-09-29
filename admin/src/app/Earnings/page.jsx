"use client";
import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Download, 
  Filter, 
  BarChart3,
  PieChart,
  Wallet,
  CreditCard,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Eye,
  Printer,
  Share2,
  FileText,
  Menu as MenuIcon,
  X
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

// Custom hook for sidebar management
const useSidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => isMobile && setSidebarOpen(false);
  const openSidebar = () => isMobile && setSidebarOpen(true);

  return { isMobile, sidebarOpen, toggleSidebar, closeSidebar, openSidebar };
};

const Earnings = () => {
  const { isMobile, sidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  
  const [timeFilter, setTimeFilter] = useState("month");
  const [chartType, setChartType] = useState("bar");
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Body scroll lock effect
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = sidebarOpen ? 'hidden' : 'auto';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobile, sidebarOpen]);

  // Swipe to close sidebar on mobile
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    
    if (isLeftSwipe && sidebarOpen) {
      closeSidebar();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const summaryStats = [
    {
      title: "Today's Earnings",
      amount: "₹3,450",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      period: "vs yesterday"
    },
    {
      title: "This Week",
      amount: "₹18,900",
      change: "+8.3%",
      trend: "up",
      icon: Calendar,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      period: "vs last week"
    },
    {
      title: "This Month",
      amount: "₹72,300",
      change: "+15.2%",
      trend: "up",
      icon: BarChart3,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      period: "vs last month"
    },
    {
      title: "Total Balance",
      amount: "₹1,24,500",
      change: "+18.7%",
      trend: "up",
      icon: Wallet,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      period: "overall growth"
    }
  ];

  const paymentMethods = [
    { type: "Online", amount: "₹58,400", percentage: 65, color: "bg-blue-500", icon: CreditCard },
    { type: "Cash", amount: "₹24,800", percentage: 27, color: "bg-green-500", icon: Banknote },
    { type: "Card", amount: "₹6,300", percentage: 7, color: "bg-purple-500", icon: CreditCard },
    { type: "UPI", amount: "₹1,000", percentage: 1, color: "bg-amber-500", icon: DollarSign }
  ];

  const transactions = [
    { 
      id: "ORD-1024", 
      date: "Today, 10:30 AM", 
      amount: 450, 
      mode: "Online", 
      status: "completed",
      customer: "Rahul Sharma",
      items: 3
    },
    { 
      id: "ORD-1023", 
      date: "Today, 10:15 AM", 
      amount: 820, 
      mode: "Cash", 
      status: "completed",
      customer: "Priya Patel",
      items: 2
    },
    { 
      id: "ORD-1022", 
      date: "Today, 09:45 AM", 
      amount: 1250, 
      mode: "Online", 
      status: "completed",
      customer: "Amit Kumar",
      items: 4
    },
    { 
      id: "ORD-1021", 
      date: "Today, 09:30 AM", 
      amount: 350, 
      mode: "UPI", 
      status: "completed",
      customer: "Neha Singh",
      items: 1
    },
    { 
      id: "ORD-1020", 
      date: "Yesterday, 08:45 PM", 
      amount: 720, 
      mode: "Card", 
      status: "completed",
      customer: "Vikram Mehta",
      items: 2
    },
    { 
      id: "ORD-1019", 
      date: "Yesterday, 07:30 PM", 
      amount: 490, 
      mode: "Online", 
      status: "refunded",
      customer: "Sneha Reddy",
      items: 2
    },
    { 
      id: "ORD-1018", 
      date: "Yesterday, 06:15 PM", 
      amount: 920, 
      mode: "Cash", 
      status: "completed",
      customer: "Rajesh Kumar",
      items: 3
    },
    { 
      id: "ORD-1017", 
      date: "Yesterday, 05:45 PM", 
      amount: 380, 
      mode: "Online", 
      status: "completed",
      customer: "Anjali Sharma",
      items: 1
    },
  ];

  const weeklyEarnings = [
    { day: "Mon", amount: 8500 },
    { day: "Tue", amount: 9200 },
    { day: "Wed", amount: 7800 },
    { day: "Thu", amount: 10500 },
    { day: "Fri", amount: 12500 },
    { day: "Sat", amount: 14800 },
    { day: "Sun", amount: 9600 },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    if (timeFilter === "today") {
      return transaction.date.includes("Today");
    } else if (timeFilter === "week") {
      return true;
    }
    return true;
  });

  const getPaymentIcon = (mode) => {
    switch(mode) {
      case "Online": return CreditCard;
      case "Cash": return Banknote;
      case "Card": return CreditCard;
      case "UPI": return DollarSign;
      default: return CreditCard;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-amber-100 text-amber-800";
      case "refunded": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderTransactionTable = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Transaction History</h3>
            <p className="text-gray-500 text-sm mt-1">Recent orders and payments</p>
          </div>
          <div className="flex items-center gap-3 mt-3 sm:mt-0">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-500" />
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 text-sm shadow-md">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Mobile View - Cards */}
      <div className="block md:hidden">
        {filteredTransactions.map((transaction) => {
          const PaymentIcon = getPaymentIcon(transaction.mode);
          return (
            <div key={transaction.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-bold text-gray-800">{transaction.id}</div>
                  <div className="text-sm text-gray-500">{transaction.customer}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <PaymentIcon size={14} className="text-gray-500" />
                    <span className="text-sm text-gray-600">{transaction.mode}</span>
                  </div>
                  <span className="text-sm text-gray-500">• {transaction.items} items</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">₹{transaction.amount}</div>
                  <div className="text-xs text-gray-500">{transaction.date}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-sm font-medium text-gray-700">Order ID</th>
              <th className="p-4 text-left text-sm font-medium text-gray-700">Customer</th>
              <th className="p-4 text-left text-sm font-medium text-gray-700">Date & Time</th>
              <th className="p-4 text-left text-sm font-medium text-gray-700">Amount</th>
              <th className="p-4 text-left text-sm font-medium text-gray-700">Payment</th>
              <th className="p-4 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="p-4 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTransactions.map((transaction) => {
              const PaymentIcon = getPaymentIcon(transaction.mode);
              return (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-800">{transaction.id}</div>
                    <div className="text-sm text-gray-500">{transaction.items} items</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-800">{transaction.customer}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-700 text-sm">{transaction.date}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800">₹{transaction.amount}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <PaymentIcon size={16} className="text-gray-500" />
                      <span className="text-gray-700 text-sm">{transaction.mode}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
              Previous
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors text-sm shadow-md">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuickReports = () => (
    <div className="space-y-6">
      {/* Report Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Reports</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group active:scale-[0.98]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="text-blue-600" size={20} />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-800">Daily Report</div>
                <div className="text-sm text-gray-500">Today&apos;s summary</div>
              </div>
            </div>
            <Download className="text-gray-400 group-hover:text-gray-600" size={20} />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group active:scale-[0.98]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="text-green-600" size={20} />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-800">Weekly Report</div>
                <div className="text-sm text-gray-500">Last 7 days</div>
              </div>
            </div>
            <Download className="text-gray-400 group-hover:text-gray-600" size={20} />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group active:scale-[0.98]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="text-purple-600" size={20} />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-800">Monthly Report</div>
                <div className="text-sm text-gray-500">Full month analysis</div>
              </div>
            </div>
            <Download className="text-gray-400 group-hover:text-gray-600" size={20} />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all active:scale-[0.98]">
            <Printer size={20} />
            Print Statement
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all active:scale-[0.98]">
            <Share2 size={20} />
            Share Report
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all active:scale-[0.98]">
            <Download size={20} />
            Download All Data
          </button>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Revenue Insights</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Average Order Value</span>
            <span className="font-bold text-gray-800">₹520</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Peak Hours Revenue</span>
            <span className="font-bold text-gray-800">₹28,400</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Best Selling Day</span>
            <span className="font-bold text-gray-800">Saturday</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Customer Growth</span>
            <span className="font-bold text-green-600">+24%</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Toggle Button - Only show when sidebar is closed on mobile */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed top-4 left-4 z-50 p-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 active:scale-95 hover:scale-110"
          aria-label="Open menu"
        >
          <MenuIcon size={24} />
        </button>
      )}

      {/* Overlay for mobile */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={closeSidebar}
        />
      )}

      <div className="flex">
        {/* Sidebar with swipe gesture */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative"
        >
          <Sidebar 
            isOpen={sidebarOpen}
            onClose={closeSidebar}
            onToggle={toggleSidebar}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 text-black min-h-screen w-full transition-all duration-300">
          <Header 
            title="Earnings & Reports" 
            subtitle={isMobile ? "Track revenue and earnings" : "Track your revenue, analyze trends, and download reports"}
            onMenuClick={toggleSidebar}
            sidebarOpen={sidebarOpen}
            onClose={closeSidebar}
          />
          
          <main className="p-3 sm:p-4 md:p-6 pb-24 md:pb-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              {summaryStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index} 
                    className={`${stat.bgColor} rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">{stat.title}</p>
                        <div className="flex items-baseline flex-wrap gap-1 sm:gap-2">
                          <h3 className="text-xl sm:text-3xl font-bold text-gray-800">{stat.amount}</h3>
                          <div className={`flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                            stat.trend === 'up' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {stat.trend === 'up' ? (
                              <ArrowUpRight size={10} className="sm:size-[12px] mr-0.5" />
                            ) : (
                              <ArrowDownRight size={10} className="sm:size-[12px] mr-0.5" />
                            )}
                            {stat.change}
                          </div>
                        </div>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">{stat.period}</p>
                      </div>
                      <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${stat.bgColor.replace('50', '100')}`}>
                        <Icon className="text-gray-600" size={20} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts and Payment Methods */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
              {/* Revenue Chart */}
              <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">Revenue Overview</h3>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">Weekly earnings trend</p>
                  </div>
                  <div className="flex items-center gap-3 mt-3 sm:mt-0">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setChartType("bar")}
                        className={`p-1.5 sm:p-2 rounded transition-all ${
                          chartType === "bar" 
                            ? 'bg-white shadow text-blue-600 scale-105' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <BarChart3 size={16} className="sm:size-[20px]" />
                      </button>
                      <button
                        onClick={() => setChartType("line")}
                        className={`p-1.5 sm:p-2 rounded transition-all ${
                          chartType === "line" 
                            ? 'bg-white shadow text-blue-600 scale-105' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <TrendingUp size={16} className="sm:size-[20px]" />
                      </button>
                    </div>
                    <select 
                      className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm bg-white"
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                    >
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>
                </div>
                
                {/* Chart Visualization */}
                <div className="h-48 sm:h-64">
                  <div className="flex items-end h-36 sm:h-48 gap-2 sm:gap-3 mt-2 sm:mt-4 px-2 sm:px-4">
                    {weeklyEarnings.map((day, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center group">
                        <div className="relative w-full">
                          <div 
                            className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                            style={{ height: `${(day.amount / 15000) * 100}%` }}
                          ></div>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                            ₹{day.amount.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2 font-medium">
                          {day.day}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 px-2 sm:px-4 gap-3">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-gray-800">₹72,300</div>
                      <div className="text-xs sm:text-sm text-gray-500">Total Revenue</div>
                    </div>
                    <div className="flex items-center text-green-600 bg-green-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
                      <TrendingUp size={16} className="sm:size-[20px] mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm font-medium">+15.2% from last month</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">Payment Methods</h3>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">Revenue distribution</p>
                  </div>
                  <PieChart className="text-gray-400" size={20} />
                </div>
                
                {/* Payment Stats */}
                <div className="space-y-3 sm:space-y-4">
                  {paymentMethods.map((method, index) => {
                    const Icon = method.icon;
                    return (
                      <div key={index} className="flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${method.color} flex items-center justify-center text-white`}>
                            <Icon size={14} className="sm:size-[18px]" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 text-sm sm:text-base">{method.type}</div>
                            <div className="text-xs sm:text-sm text-gray-500">{method.percentage}%</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-800 text-sm sm:text-base">{method.amount}</div>
                          <div className="text-xs sm:text-sm text-gray-500">revenue</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Progress Bars */}
                <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                  {paymentMethods.map((method, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-xs sm:text-sm mb-1">
                        <span className="text-gray-600">{method.type}</span>
                        <span className="font-medium">{method.percentage}%</span>
                      </div>
                      <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${method.color} rounded-full transition-all duration-500`}
                          style={{ width: `${method.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Transactions and Export */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Transactions Table */}
              <div className="lg:col-span-2">
                {renderTransactionTable()}
              </div>

              {/* Quick Reports */}
              <div className="lg:col-span-1">
                {renderQuickReports()}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden z-30">
        <div className="flex justify-around items-center">
          <button className="flex flex-col items-center px-3 py-1 text-blue-600">
            <DollarSign size={22} />
            <span className="text-xs mt-0.5">Earnings</span>
          </button>
          <button className="flex flex-col items-center px-3 py-1 text-gray-600">
            <BarChart3 size={22} />
            <span className="text-xs mt-0.5">Reports</span>
          </button>
          <button className="flex flex-col items-center px-3 py-1 text-gray-600">
            <Wallet size={22} />
            <span className="text-xs mt-0.5">Balance</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
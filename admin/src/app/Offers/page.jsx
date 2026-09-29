"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  Tag,
  Percent,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  MoreVertical,
  Download,
  Filter,
  Search,
  Menu as MenuIcon,
  X,
  AlertTriangle,
  Loader2,
  DollarSign,
  LayoutGrid,
  List,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  User,
  Star,
  Gift,
  Award,
  Zap,
  Flame,
  Crown,
  Sparkles,
  Target,
  Globe,
  Shield,
  Lock,
  Unlock,
  Mail,
  Phone,
  MapPin,
  Building,
  Briefcase,
  Folder,
  FileText,
  Image,
  Video,
  Link,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  Home,
  Info,
  AlertCircle,
  RefreshCw,
  Save,
  Send,
  Upload,
  Download as DownloadIcon,
  Printer,
  Share2,
  Heart,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Repeat,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Youtube,
  Twitch,
  Slack,
  Chrome,
  Apple,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Watch,
  Camera,
  Headphones,
  Speaker,
  Mic,
  Radio,
  Printer as PrinterIcon,
  Keyboard,
  Mouse,
  HardDrive,
  Cpu,
  Battery,
  Wifi,
  Bluetooth,
  Usb,
  Database,
  Cloud,
  Server,
  Shield as ShieldIcon,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  Key,
  Fingerprint,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Bell as BellIcon,
  AlertCircle as AlertCircleIcon,
  Info as InfoIcon,
  HelpCircle as HelpCircleIcon,
  Settings as SettingsIcon,
  LogOut as LogOutIcon,
  User as UserIcon,
  Star as StarIcon,
  Gift as GiftIcon,
  Award as AwardIcon,
  Zap as ZapIcon,
  Flame as FlameIcon,
  Crown as CrownIcon,
  Sparkles as SparklesIcon,
  Target as TargetIcon,
  Globe as GlobeIcon,
  Shield as ShieldCheckIcon,
  Lock as LockClosedIcon,
  Unlock as UnlockOpenIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Building as BuildingIcon,
  Briefcase as BriefcaseIcon,
  Folder as FolderIcon,
  FileText as FileTextIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  Link as LinkIcon,
  Copy as CopyIcon,
  Check as CheckIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon2,
  Home as HomeIcon,
  AlertCircle as AlertCircleIcon2,
  RefreshCw as RefreshCwIcon,
  Save as SaveIcon,
  Send as SendIcon,
  Upload as UploadIcon,
  Download as DownloadIcon2,
  Printer as PrinterIcon2,
  Share2 as Share2Icon,
  Heart as HeartIcon,
  Bookmark as BookmarkIcon,
  ThumbsUp as ThumbsUpIcon,
  MessageCircle as MessageCircleIcon,
  Comment as CommentIcon,
  Repeat as RepeatIcon
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

  return { isMobile, sidebarOpen, toggleSidebar, closeSidebar };
};

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onClose, onConfirm, offerTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
          <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-t-3xl p-6 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white">Delete Offer</h2>
          </div>

          <div className="p-6 text-center">
            <p className="text-gray-900 text-lg mb-2">Are you sure you want to delete?</p>
            <p className="text-gray-800 font-medium mb-6">&quot;{offerTitle}&quot;</p>
            <p className="text-sm text-gray-600 mb-8">This action cannot be undone.</p>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Offers = () => {
  const { isMobile, sidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Form state to include couponCode
  const [newOffer, setNewOffer] = useState({
    title: "",
    couponCode: "",
    discountPercent: "",
    validFrom: "",
    validTo: "",
    isActive: true
  });
  
  const [editOffer, setEditOffer] = useState({
    title: "",
    couponCode: "",
    discountPercent: "",
    validFrom: "",
    validTo: "",
    isActive: true
  });

  // Validate form data
  const validateForm = (data, isEdit = false) => {
    const errors = {};
    
    if (!data.title?.trim()) {
      errors.title = "Title is required";
    }
    
    if (!data.couponCode?.trim()) {
      errors.couponCode = "Coupon code is required";
    } else if (data.couponCode.length < 3) {
      errors.couponCode = "Coupon code must be at least 3 characters";
    } else if (!/^[A-Za-z0-9_-]+$/.test(data.couponCode)) {
      errors.couponCode = "Coupon code can only contain letters, numbers, underscores and hyphens";
    }
    
    if (!data.discountPercent || data.discountPercent === "") {
      errors.discountPercent = "Discount percentage is required";
    } else {
      const discount = Number(data.discountPercent);
      if (isNaN(discount) || discount <= 0) {
        errors.discountPercent = "Discount must be greater than 0";
      } else if (discount > 100) {
        errors.discountPercent = "Discount cannot exceed 100%";
      }
    }
    
    if (!data.validFrom) {
      errors.validFrom = "Valid from date is required";
    }
    
    if (!data.validTo) {
      errors.validTo = "Valid to date is required";
    } else if (data.validFrom && new Date(data.validTo) <= new Date(data.validFrom)) {
      errors.validTo = "Valid to date must be after valid from date";
    }
    
    return errors;
  };

  // Fetch offers
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/offers`);
      setOffers(res.data.data || res.data || []);
    } catch (err) {
      console.error("Error fetching offers:", err);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

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

  const handleInputChange = (e, isEdit = false) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    if (isEdit) {
      setEditOffer(prev => {
        const updated = { ...prev, [name]: val };
        // Validate on change
        setFormErrors(validateForm(updated, true));
        return updated;
      });
    } else {
      setNewOffer(prev => {
        const updated = { ...prev, [name]: val };
        // Validate on change
        setFormErrors(validateForm(updated, false));
        return updated;
      });
    }
  };

  // Create offer - Updated with better validation
  const handleCreateOffer = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!newOffer.title?.trim()) {
      alert("Please enter an offer title");
      return;
    }

    if (!newOffer.couponCode?.trim()) {
      alert("Please enter a coupon code");
      return;
    }

    if (!newOffer.discountPercent || newOffer.discountPercent === "") {
      alert("Please enter a discount percentage");
      return;
    }

    if (!newOffer.validFrom) {
      alert("Please select a valid from date");
      return;
    }

    if (!newOffer.validTo) {
      alert("Please select a valid to date");
      return;
    }

    // Validate discount is a number and within range
    const discountValue = Number(newOffer.discountPercent);
    if (isNaN(discountValue) || discountValue <= 0) {
      alert("Please enter a valid discount percentage greater than 0");
      return;
    }

    if (discountValue > 100) {
      alert("Discount percentage cannot exceed 100%");
      return;
    }

    // Validate dates
    const fromDate = new Date(newOffer.validFrom);
    const toDate = new Date(newOffer.validTo);
    
    if (toDate <= fromDate) {
      alert("Valid To date must be after Valid From date");
      return;
    }

    try {
      setLoading(true);

      // Prepare data with explicit field names and types
      const offerData = {
        title: newOffer.title.trim(),
        couponCode: newOffer.couponCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, ''),
        discountPercent: discountValue,
        validFrom: new Date(newOffer.validFrom).toISOString(),
        validTo: new Date(newOffer.validTo).toISOString(),
        isActive: newOffer.isActive
      };

      console.log("Sending offer data:", JSON.stringify(offerData, null, 2));

      const response = await axios({
        method: 'post',
        url: `${API}/api/offers`,
        data: offerData,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log("Response:", response.data);

      await fetchOffers();

      setShowCreateForm(false);
      setFormErrors({});

      setNewOffer({
        title: "",
        couponCode: "",
        discountPercent: "",
        validFrom: "",
        validTo: "",
        isActive: true
      });

      alert("Offer created successfully!");

    } catch (err) {
      console.error("Error creating offer:", err.response?.data || err);
      console.error("Error status:", err.response?.status);
      console.error("Error headers:", err.response?.headers);
      
      // Show specific error message from backend
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else if (err.response?.data?.errors) {
        // Handle validation errors array
        const errors = err.response.data.errors;
        alert(errors.map(e => e.msg || e.message).join("\n"));
      } else {
        alert("Error creating offer. Please check all fields and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Edit offer - Updated with better validation
  const handleEditOffer = async (e) => {
    e.preventDefault();
    
    if (!selectedOffer) return;

    // Validate required fields
    if (!editOffer.title?.trim()) {
      alert("Please enter an offer title");
      return;
    }

    if (!editOffer.couponCode?.trim()) {
      alert("Please enter a coupon code");
      return;
    }

    if (!editOffer.discountPercent || editOffer.discountPercent === "") {
      alert("Please enter a discount percentage");
      return;
    }

    if (!editOffer.validFrom) {
      alert("Please select a valid from date");
      return;
    }

    if (!editOffer.validTo) {
      alert("Please select a valid to date");
      return;
    }

    // Validate discount is a number and within range
    const discountValue = Number(editOffer.discountPercent);
    if (isNaN(discountValue) || discountValue <= 0) {
      alert("Please enter a valid discount percentage greater than 0");
      return;
    }

    if (discountValue > 100) {
      alert("Discount percentage cannot exceed 100%");
      return;
    }

    // Validate dates
    const fromDate = new Date(editOffer.validFrom);
    const toDate = new Date(editOffer.validTo);
    
    if (toDate <= fromDate) {
      alert("Valid To date must be after Valid From date");
      return;
    }

    try {
      setLoading(true);

      const offerData = {
        title: editOffer.title.trim(),
        couponCode: editOffer.couponCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, ''),
        discountPercent: discountValue,
        validFrom: new Date(editOffer.validFrom).toISOString(),
        validTo: new Date(editOffer.validTo).toISOString(),
        isActive: editOffer.isActive
      };

      console.log("Updating offer with data:", JSON.stringify(offerData, null, 2));

      const response = await axios({
        method: 'put',
        url: `${API}/api/offers/${selectedOffer.id}`,
        data: offerData,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log("Update response:", response.data);

      await fetchOffers();

      setShowEditForm(false);
      setSelectedOffer(null);
      setFormErrors({});

      alert("Offer updated successfully!");

    } catch (err) {
      console.error("Error updating offer:", err.response?.data || err);
      console.error("Error status:", err.response?.status);
      console.error("Error headers:", err.response?.headers);
      
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        alert(errors.map(e => e.msg || e.message).join("\n"));
      } else {
        alert("Error updating offer. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete offer
  const handleDeleteOffer = async () => {
    if (!selectedOffer) return;
    
    try {
      setLoading(true);
      await axios.delete(`${API}/api/offers/${selectedOffer.id}`);
      await fetchOffers();
      setShowDeleteModal(false);
      setSelectedOffer(null);
      alert("Offer deleted successfully!");
    } catch (err) {
      console.error("Error deleting offer:", err.response?.data || err);
      alert(err.response?.data?.message || "Error deleting offer");
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal with offer data
  const openEditModal = (offer) => {
    setSelectedOffer(offer);
    setEditOffer({
      title: offer.title,
      couponCode: offer.couponCode,
      discountPercent: offer.discountPercent,
      validFrom: offer.validFrom?.split('T')[0] || "",
      validTo: offer.validTo?.split('T')[0] || "",
      isActive: offer.isActive
    });
    setFormErrors({});
    setShowEditForm(true);
  };

  // Open delete modal
  const openDeleteModal = (offer) => {
    setSelectedOffer(offer);
    setShowDeleteModal(true);
  };

  // Calculate stats
  const stats = {
    active: offers.filter(o => o.isActive).length,
    total: offers.length,
    expired: offers.filter(o => new Date(o.validTo) < new Date()).length,
    upcoming: offers.filter(o => new Date(o.validFrom) > new Date()).length
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Check if offer is active based on dates
  const getOfferStatus = (offer) => {
    const now = new Date();
    const validFrom = new Date(offer.validFrom);
    const validTo = new Date(offer.validTo);
    
    if (!offer.isActive) return { status: 'inactive', color: 'bg-gray-100 text-gray-800', icon: EyeOff };
    if (now < validFrom) return { status: 'upcoming', color: 'bg-blue-100 text-blue-800', icon: Calendar };
    if (now > validTo) return { status: 'expired', color: 'bg-red-100 text-red-800', icon: XCircle };
    return { status: 'active', color: 'bg-green-100 text-green-800', icon: CheckCircle };
  };

  const filteredOffers = offers.filter(offer => {
    const status = getOfferStatus(offer).status;
    
    if (filter !== "all" && status !== filter) {
      return false;
    }
    if (searchTerm && 
        !offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !offer.couponCode?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const MobileFilterDrawer = () => (
    <>
      {showMobileFilters && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={() => setShowMobileFilters(false)}
        />
      )}
      
      <div className={`
        fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 md:hidden
        transform transition-transform duration-300 ease-in-out
        ${showMobileFilters ? 'translate-y-0' : 'translate-y-full'}
        shadow-2xl
      `}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Filter Offers</h3>
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-800 mb-2 block">
                Offer Status
              </label>
              <div className="space-y-2">
                {["all", "active", "upcoming", "expired", "inactive"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilter(status);
                      setShowMobileFilters(false);
                    }}
                    className={`
                      w-full px-4 py-3 rounded-xl text-left font-medium transition-all
                      ${filter === status 
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        {status === "all" ? <LayoutGrid size={18} /> : 
                         status === "active" ? <CheckCircle size={18} /> : 
                         status === "upcoming" ? <Calendar size={18} /> : 
                         status === "expired" ? <XCircle size={18} /> : 
                         <EyeOff size={18} />}
                        <span>
                          {status === "all" ? "All Offers" : 
                           status === "active" ? "Active" : 
                           status === "upcoming" ? "Upcoming" : 
                           status === "expired" ? "Expired" : 
                           "Inactive"}
                        </span>
                      </span>
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                        {offers.filter(o => {
                          if (status === "all") return true;
                          const offerStatus = getOfferStatus(o).status;
                          return offerStatus === status;
                        }).length}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-800 mb-2 block">
                Quick Actions
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button className="px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                  <Download size={16} />
                  Export
                </button>
                <button 
                  onClick={() => {
                    setFilter("all");
                    setSearchTerm("");
                    setShowMobileFilters(false);
                  }}
                  className="px-4 py-3 bg-gray-100 text-gray-800 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} />
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const OfferCard = ({ offer }) => {
    const status = getOfferStatus(offer);
    const StatusIcon = status.icon;
    
    return (
      <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-[1.02]">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{offer.title}</h3>
              <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium flex items-center gap-1 w-fit ${status.color}`}>
                <StatusIcon size={10} className="sm:size-[12px]" />
                {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
              </span>
            </div>
          </div>
          <button className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0">
            <MoreVertical size={16} className="sm:size-[20px]" />
          </button>
        </div>

        {/* Coupon Code */}
        <div className="mb-4 sm:mb-6">
          <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
            <div className="text-[10px] sm:text-xs text-gray-600 mb-1">Coupon Code</div>
            <div className="flex items-center gap-2">
              <Tag className="text-red-500" size={16} />
              <code className="text-sm sm:text-base font-mono font-bold text-gray-900 bg-white px-2 py-1 rounded border border-gray-200">
                {offer.couponCode}
              </code>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(offer.couponCode);
                  alert("Coupon code copied!");
                }}
                className="ml-auto p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <Copy size={14} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Discount Info */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl gap-3">
            <div>
              <div className="text-[10px] sm:text-xs text-gray-600 mb-1">Discount</div>
              <div className="flex items-center gap-2">
                <Percent className="text-red-500" size={20} />
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">{offer.discountPercent}% OFF</span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-[10px] sm:text-xs text-gray-600">Status</div>
              <div className="flex items-center gap-1 text-gray-900 font-medium">
                {offer.isActive ? 
                  <CheckCircle size={16} className="text-green-500" /> : 
                  <EyeOff size={16} className="text-gray-400" />
                }
                <span>{offer.isActive ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Date Details */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="space-y-1">
            <div className="text-[10px] sm:text-xs text-gray-600">Valid From</div>
            <div className="font-medium text-gray-900 text-sm sm:text-base flex items-center gap-1">
              <Calendar size={14} className="text-gray-400" />
              {formatDate(offer.validFrom)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] sm:text-xs text-gray-600">Valid To</div>
            <div className="font-medium text-gray-900 text-sm sm:text-base flex items-center gap-1">
              <Clock size={14} className="text-gray-400" />
              {formatDate(offer.validTo)}
            </div>
          </div>
        </div>

        {/* Progress Bar based on date range */}
        {offer.validFrom && offer.validTo && (
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between text-[10px] sm:text-xs mb-1">
              <span className="text-gray-700">Validity Period</span>
              <span className="font-medium text-gray-900">
                {Math.ceil((new Date(offer.validTo) - new Date()) / (1000 * 60 * 60 * 24)) > 0 
                  ? `${Math.ceil((new Date(offer.validTo) - new Date()) / (1000 * 60 * 60 * 24))} days left`
                  : 'Expired'}
              </span>
            </div>
            <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min(
                    ((new Date() - new Date(offer.validFrom)) / 
                    (new Date(offer.validTo) - new Date(offer.validFrom))) * 100, 
                    100
                  )}%` 
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={() => openEditModal(offer)}
            className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all text-xs sm:text-sm active:scale-95"
          >
            <Edit2 size={12} className="sm:size-[16px]" />
            <span className="hidden sm:inline">Edit</span>
            <span className="sm:hidden">Edit</span>
          </button>
          <button className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-all text-xs sm:text-sm active:scale-95">
            <Eye size={12} className="sm:size-[16px]" />
            <span className="hidden sm:inline">View</span>
            <span className="sm:hidden">View</span>
          </button>
          <button 
            onClick={() => openDeleteModal(offer)}
            className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all text-xs sm:text-sm active:scale-95"
          >
            <Trash2 size={12} className="sm:size-[16px]" />
            <span className="hidden sm:inline">Delete</span>
            <span className="sm:hidden">Del</span>
          </button>
        </div>
      </div>
    );
  };

  if (loading && offers.length === 0) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin h-16 w-16 text-red-600 mx-auto mb-4" />
            <p className="text-gray-900 text-lg font-medium">Loading your offers...</p>
            <p className="text-gray-600 text-sm mt-2">Please wait while we fetch your promotional offers</p>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Mobile Filter Button */}
      {isMobile && (
        <button
          onClick={() => setShowMobileFilters(true)}
          className="md:hidden fixed bottom-24 right-4 z-50 p-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 active:scale-95 hover:scale-110"
          aria-label="Filter offers"
        >
          <Filter size={24} />
          {filter !== 'all' && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-red-600 rounded-full text-xs flex items-center justify-center font-bold shadow-lg">
              1
            </span>
          )}
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
        <div className="flex-1 min-h-screen w-full transition-all duration-300">
          <Header 
            title="Offers & Discounts" 
            subtitle={isMobile ? "Create and manage promotional offers" : "Create and manage promotional offers for your customers"}
            onMenuClick={toggleSidebar}
            sidebarOpen={sidebarOpen}
            onClose={closeSidebar}
          />
          
          <main className="p-3 sm:p-4 md:p-6 pb-24 md:pb-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white transform hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-xs sm:text-sm">Active Offers</p>
                    <h3 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{stats.active}</h3>
                  </div>
                  <CheckCircle className="opacity-80" size={24} />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white transform hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-xs sm:text-sm">Total Offers</p>
                    <h3 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{stats.total}</h3>
                  </div>
                  <Tag className="opacity-80" size={24} />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white transform hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-xs sm:text-sm">Upcoming</p>
                    <h3 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{stats.upcoming}</h3>
                  </div>
                  <Calendar className="opacity-80" size={24} />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white transform hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-xs sm:text-sm">Expired</p>
                    <h3 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{stats.expired}</h3>
                  </div>
                  <XCircle className="opacity-80" size={24} />
                </div>
              </div>
            </div>

            {/* Controls Bar - Desktop */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Search and Filter - Desktop */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="text"
                      placeholder="Search offers by title or coupon code..."
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base text-gray-900"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="hidden md:flex items-center gap-2">
                    <Filter size={20} className="text-gray-600" />
                    <select 
                      className="px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base bg-white text-gray-900"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="all">All Offers</option>
                      <option value="active">Active</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="expired">Expired</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <button className="hidden md:flex px-4 py-2.5 sm:py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-all items-center gap-2 text-sm sm:text-base active:scale-95">
                    <Download size={18} />
                    Export
                  </button>
                  <button 
                    onClick={() => {
                      setShowCreateForm(true);
                      setFormErrors({});
                    }}
                    className="flex-1 sm:flex-none px-4 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base active:scale-95"
                  >
                    <Plus size={18} />
                    <span className="hidden sm:inline">Create New Offer</span>
                    <span className="sm:hidden">Create Offer</span>
                  </button>
                </div>
              </div>
              
              {/* Quick Filter Chips - Desktop */}
              <div className="hidden md:flex flex-wrap gap-2 mt-4">
                {["all", "active", "upcoming", "expired"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                      filter === status 
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md scale-105" 
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-105"
                    }`}
                  >
                    {status === "all" ? <LayoutGrid size={14} /> : 
                     status === "active" ? <CheckCircle size={14} /> : 
                     status === "upcoming" ? <Calendar size={14} /> : 
                     <XCircle size={14} />}
                    <span>
                      {status === "all" ? "All" : 
                       status === "active" ? "Active" : 
                       status === "upcoming" ? "Upcoming" : 
                       "Expired"}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs ${
                      filter === status ? "bg-white/20" : "bg-gray-200 text-gray-800"
                    }`}>
                      {offers.filter(o => {
                        if (status === "all") return true;
                        const offerStatus = getOfferStatus(o).status;
                        return offerStatus === status;
                      }).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Create Offer Modal - Updated with validation */}
            {showCreateForm && (
              <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">Create New Offer</h3>
                      <button 
                        onClick={() => {
                          setShowCreateForm(false);
                          setFormErrors({});
                        }}
                        className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <form onSubmit={handleCreateOffer} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="col-span-2">
                        <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-2">
                          Offer Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={newOffer.title}
                          onChange={handleInputChange}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 ${
                            formErrors.title ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="e.g., Weekend Special"
                          required
                        />
                        {formErrors.title && (
                          <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>
                        )}
                      </div>

                      <div className="col-span-2">
                        <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-2">
                          Coupon Code <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="text"
                            name="couponCode"
                            value={newOffer.couponCode}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 ${
                              formErrors.couponCode ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="e.g., SUMMER20"
                            required
                          />
                        </div>
                        {formErrors.couponCode ? (
                          <p className="text-xs text-red-500 mt-1">{formErrors.couponCode}</p>
                        ) : (
                          <p className="text-xs text-gray-500 mt-1">Must be unique across all offers</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-2">
                          Discount (%) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="number"
                            name="discountPercent"
                            value={newOffer.discountPercent}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 ${
                              formErrors.discountPercent ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="e.g., 20"
                            min="0"
                            max="100"
                            step="0.01"
                            required
                          />
                        </div>
                        {formErrors.discountPercent && (
                          <p className="text-xs text-red-500 mt-1">{formErrors.discountPercent}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-2">
                          Status
                        </label>
                        <div className="flex items-center h-full">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name="isActive"
                              checked={newOffer.isActive}
                              onChange={(e) => handleInputChange(e)}
                              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-700">Active</span>
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-2">
                          Valid From <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="validFrom"
                          value={newOffer.validFrom}
                          onChange={handleInputChange}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 ${
                            formErrors.validFrom ? 'border-red-500' : 'border-gray-300'
                          }`}
                          required
                        />
                        {formErrors.validFrom && (
                          <p className="text-xs text-red-500 mt-1">{formErrors.validFrom}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-2">
                          Valid To <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="validTo"
                          value={newOffer.validTo}
                          onChange={handleInputChange}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 ${
                            formErrors.validTo ? 'border-red-500' : 'border-gray-300'
                          }`}
                          required
                        />
                        {formErrors.validTo && (
                          <p className="text-xs text-red-500 mt-1">{formErrors.validTo}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateForm(false);
                          setFormErrors({});
                        }}
                        className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm order-2 sm:order-1"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={Object.keys(formErrors).length > 0 || loading}
                        className={`px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-lg text-sm order-1 sm:order-2 ${
                          (Object.keys(formErrors).length > 0 || loading) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? 'Creating...' : 'Create Offer'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Offer Modal - Updated with validation */}
            {showEditForm && selectedOffer && (
              <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">Edit Offer</h3>
                      <button 
                        onClick={() => {
                          setShowEditForm(false);
                          setSelectedOffer(null);
                          setFormErrors({});
                        }}
                        className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <form onSubmit={handleEditOffer} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="col-span-2">
                        <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-2">
                          Offer Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={editOffer.title}
                          onChange={(e) => handleInputChange(e, true)}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 ${
                            formErrors.title ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="e.g., Weekend Special"
                          required
                        />
                        {formErrors.title && (
                          <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>
                        )}
                      </div>

                      <div className="col-span-2">
                        <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-2">
                          Coupon Code <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="text"
                            name="couponCode"
                            value={editOffer.couponCode}
                            onChange={(e) => handleInputChange(e, true)}
                            className={`w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 ${
                              formErrors.couponCode ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="e.g., SUMMER20"
                            required
                          />
                        </div>
                        {formErrors.couponCode ? (
                          <p className="text-xs text-red-500 mt-1">{formErrors.couponCode}</p>
                        ) : (
                          <p className="text-xs text-gray-500 mt-1">Must be unique across all offers</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-2">
                          Discount (%) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="number"
                            name="discountPercent"
                            value={editOffer.discountPercent}
                            onChange={(e) => handleInputChange(e, true)}
                            className={`w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 ${
                              formErrors.discountPercent ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="e.g., 20"
                            min="0"
                            max="100"
                            step="0.01"
                            required
                          />
                        </div>
                        {formErrors.discountPercent && (
                          <p className="text-xs text-red-500 mt-1">{formErrors.discountPercent}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-2">
                          Status
                        </label>
                        <div className="flex items-center h-full">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name="isActive"
                              checked={editOffer.isActive}
                              onChange={(e) => handleInputChange(e, true)}
                              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-700">Active</span>
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-2">
                          Valid From <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="validFrom"
                          value={editOffer.validFrom}
                          onChange={(e) => handleInputChange(e, true)}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 ${
                            formErrors.validFrom ? 'border-red-500' : 'border-gray-300'
                          }`}
                          required
                        />
                        {formErrors.validFrom && (
                          <p className="text-xs text-red-500 mt-1">{formErrors.validFrom}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-2">
                          Valid To <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="validTo"
                          value={editOffer.validTo}
                          onChange={(e) => handleInputChange(e, true)}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 ${
                            formErrors.validTo ? 'border-red-500' : 'border-gray-300'
                          }`}
                          required
                        />
                        {formErrors.validTo && (
                          <p className="text-xs text-red-500 mt-1">{formErrors.validTo}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditForm(false);
                          setSelectedOffer(null);
                          setFormErrors({});
                        }}
                        className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm order-2 sm:order-1"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={Object.keys(formErrors).length > 0 || loading}
                        className={`px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-lg text-sm order-1 sm:order-2 ${
                          (Object.keys(formErrors).length > 0 || loading) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? 'Updating...' : 'Update Offer'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteModal
              isOpen={showDeleteModal}
              onClose={() => {
                setShowDeleteModal(false);
                setSelectedOffer(null);
              }}
              onConfirm={handleDeleteOffer}
              offerTitle={selectedOffer?.title || ""}
            />

            {/* Offers Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                    {filter === "all" ? <LayoutGrid size={20} /> : 
                     filter === "active" ? <CheckCircle size={20} /> : 
                     filter === "upcoming" ? <Calendar size={20} /> : 
                     filter === "expired" ? <XCircle size={20} /> : 
                     <EyeOff size={20} />}
                    <span>
                      {filter === "all" ? "All Offers" : 
                       filter.charAt(0).toUpperCase() + filter.slice(1) + " Offers"}
                    </span>
                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-lg text-xs sm:text-sm shadow-sm">
                      {filteredOffers.length}
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {filteredOffers.length === 0 ? 'No offers found' : `Showing ${filteredOffers.length} of ${offers.length} total offers`}
                  </p>
                </div>
              </div>
              
              {filteredOffers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center border-2 border-dashed border-gray-200">
                  <Gift className="mx-auto text-gray-300 mb-4" size={48} />
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No offers found</h3>
                  <p className="text-gray-700 mb-6 text-sm sm:text-base">
                    {searchTerm 
                      ? `No offers matching "${searchTerm}"`
                      : filter !== "all"
                        ? `No ${filter} offers available`
                        : "Create your first offer to start promoting"}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                      onClick={() => {
                        setFilter("all");
                        setSearchTerm("");
                      }}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center gap-2 text-sm sm:text-base active:scale-95 shadow-md"
                    >
                      <Eye size={16} />
                      View All Offers
                    </button>
                    <button 
                      onClick={() => {
                        setShowCreateForm(true);
                        setFormErrors({});
                      }}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm sm:text-base active:scale-95"
                    >
                      <Plus size={16} />
                      Create New Offer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer />

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden z-30">
        <div className="flex justify-around items-center">
          <button className="flex flex-col items-center px-3 py-1 text-red-600">
            <Gift size={22} />
            <span className="text-xs mt-0.5">Offers</span>
          </button>
          <button className="flex flex-col items-center px-3 py-1 text-gray-700">
            <BarChart3 size={22} />
            <span className="text-xs mt-0.5">Analytics</span>
          </button>
          <button className="flex flex-col items-center px-3 py-1 text-gray-700">
            <Calendar size={22} />
            <span className="text-xs mt-0.5">Schedule</span>
          </button>
          <button className="flex flex-col items-center px-3 py-1 text-gray-700">
            <Settings size={22} />
            <span className="text-xs mt-0.5">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Offers;
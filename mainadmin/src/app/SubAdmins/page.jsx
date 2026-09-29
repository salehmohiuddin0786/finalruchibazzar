"use client";

import { 
  Activity, 
  ShieldCheck, 
  UserCog, 
  Users,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Key,
  Lock,
  Unlock,
  Mail,
  Phone,
  Calendar,
  Crown,
  UserCheck,
  AlertCircle,
  RefreshCw,
  Filter,
  Download,
  Search
} from "lucide-react";
import { useState } from "react";
import { AdminFeaturePage } from "../components/AdminFeaturePage";
import { useMainAdminData } from "../lib/useMainAdminData";

// Role configuration
const roleConfig = {
  "Super Admin": { 
    icon: Crown, 
    color: "amber", 
    bg: "bg-amber-50", 
    text: "text-amber-700",
    border: "border-amber-200",
    description: "Full system access"
  },
  "Admin": { 
    icon: Shield, 
    color: "blue", 
    bg: "bg-blue-50", 
    text: "text-blue-700",
    border: "border-blue-200",
    description: "Full administrative access"
  },
  "Manager": { 
    icon: UserCog, 
    color: "emerald", 
    bg: "bg-emerald-50", 
    text: "text-emerald-700",
    border: "border-emerald-200",
    description: "Manage users and content"
  },
  "Support": { 
    icon: Users, 
    color: "purple", 
    bg: "bg-purple-50", 
    text: "text-purple-700",
    border: "border-purple-200",
    description: "Customer support access"
  },
  "Viewer": { 
    icon: Eye, 
    color: "slate", 
    bg: "bg-slate-50", 
    text: "text-slate-700",
    border: "border-slate-200",
    description: "Read-only access"
  }
};

// Permission modules
const permissionModules = [
  { name: "Restaurants", key: "restaurants" },
  { name: "Customers", key: "customers" },
  { name: "Delivery", key: "delivery" },
  { name: "Payments", key: "payments" },
  { name: "Reports", key: "reports" },
  { name: "Settings", key: "settings" }
];

export default function SubAdmins() {
  const { rows, data, loading, error, refresh } = useMainAdminData("/mainadmin/sub-admins");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const summary = data?.summary || {};
  
  // Calculate metrics
  const totalAdmins = rows.length;
  const activeAdmins = rows.filter((row) => row.status === "Active").length;
  const suspendedAdmins = rows.filter((row) => row.status === "Suspended").length;
  const invitedAdmins = rows.filter((row) => row.status === "Invited").length;
  const superAdmins = rows.filter((row) => row.role === "Super Admin").length;
  
  // Permission sets count
  const uniquePermissionSets = new Set(rows.map(row => JSON.stringify(row.permissions))).size;
  
  // Recent logins (mock data - replace with actual data from API)
  const recentLogins = summary.recentLogins || [
    { name: "John Doe", time: "5 min ago", ip: "192.168.1.1" },
    { name: "Jane Smith", time: "1 hour ago", ip: "192.168.1.2" },
    { name: "Mike Johnson", time: "3 hours ago", ip: "192.168.1.3" }
  ];

  const stats = [
    { 
      label: "Total Admins", 
      value: totalAdmins, 
      change: `${activeAdmins} active`,
      icon: Users,
      gradient: "from-blue-500 to-blue-600"
    },
    { 
      label: "Active", 
      value: activeAdmins, 
      change: `${((activeAdmins / totalAdmins) * 100).toFixed(0)}% of total`,
      icon: UserCog,
      gradient: "from-emerald-500 to-emerald-600"
    },
    { 
      label: "Permission Sets", 
      value: uniquePermissionSets, 
      change: "Custom roles",
      icon: ShieldCheck,
      gradient: "from-purple-500 to-purple-600"
    },
    { 
      label: "Tracked Actions", 
      value: "Audit Log", 
      change: "Last 30 days",
      icon: Activity,
      gradient: "from-amber-500 to-amber-600"
    },
  ];

  // Helper to get role component
  const RoleBadge = ({ role }) => {
    const config = roleConfig[role] || roleConfig.Viewer;
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
        <Icon className="h-3 w-3" />
        {role}
      </div>
    );
  };

  // Helper to get status component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      Active: { color: "emerald", icon: CheckCircle, label: "Active" },
      Suspended: { color: "rose", icon: XCircle, label: "Suspended" },
      Invited: { color: "amber", icon: Clock, label: "Invited" }
    };
    const config = statusConfig[status] || statusConfig.Active;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-${config.color}-50 text-${config.color}-700`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const normalizePermissions = (permissions) => {
    if (Array.isArray(permissions)) return permissions.filter(Boolean).map(String);
    if (!permissions) return [];
    if (typeof permissions === "string") {
      return permissions
        .split(/[,|]/)
        .map((permission) => permission.trim())
        .filter(Boolean);
    }
    if (typeof permissions === "object") {
      return Object.entries(permissions)
        .filter(([, allowed]) => Boolean(allowed))
        .map(([permission]) => permission);
    }
    return [String(permissions)];
  };

  // Helper to get permissions display
  const PermissionsDisplay = ({ permissions }) => {
    const perms = normalizePermissions(permissions);
    const visiblePerms = perms.slice(0, 3);
    const remainingCount = perms.length - 3;
    
    return (
      <div className="flex flex-wrap gap-1">
        {visiblePerms.map((perm, idx) => (
          <span key={idx} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {perm}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
            +{remainingCount}
          </span>
        )}
      </div>
    );
  };

  // Enhanced columns with custom rendering
  const enhancedColumns = [
    { 
      key: "name", 
      label: "Admin",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${
            row.status === "Active" ? "from-emerald-500 to-emerald-600" : "from-slate-400 to-slate-500"
          } shadow-md`}>
            <span className="text-sm font-bold text-white">
              {row.name?.charAt(0) || "A"}
            </span>
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Mail className="h-3 w-3 text-slate-400" />
              <p className="text-xs text-slate-500">{row.email}</p>
            </div>
          </div>
        </div>
      )
    },
    { 
      key: "role", 
      label: "Role",
      render: (row) => <RoleBadge role={row.role} />
    },
    { 
      key: "permissions", 
      label: "Permissions",
      render: (row) => <PermissionsDisplay permissions={row.permissions} />
    },
    { 
      key: "status", 
      label: "Status", 
      badge: true,
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: "lastActive",
      label: "Last Active",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-sm text-slate-600">{row.lastActive || "Today"}</span>
        </div>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setSelectedAdmin(row)}
            className="rounded-lg p-1.5 transition-all hover:bg-slate-100"
            aria-label="View details"
          >
            <Eye className="h-4 w-4 text-slate-500" />
          </button>
          <button 
            className="rounded-lg p-1.5 transition-all hover:bg-slate-100"
            aria-label="Edit"
          >
            <Edit className="h-4 w-4 text-slate-500" />
          </button>
          <button 
            className="rounded-lg p-1.5 transition-all hover:bg-rose-50"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4 text-slate-500 hover:text-rose-600" />
          </button>
        </div>
      )
    }
  ];

  // Admin Stats Cards
  const AdminStats = () => {
    if (loading || rows.length === 0) return null;

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-100 p-2">
              <UserCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Active Admins</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{activeAdmins}</p>
          <p className="text-xs text-slate-500">Currently active</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-amber-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-amber-100 p-2">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-amber-600">Pending Invites</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600">{invitedAdmins}</p>
          <p className="text-xs text-slate-500">Awaiting response</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-purple-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-100 p-2">
              <Crown className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-purple-600">Super Admins</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-600">{superAdmins}</p>
          <p className="text-xs text-slate-500">Full system access</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-rose-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-rose-100 p-2">
              <AlertCircle className="h-4 w-4 text-rose-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-rose-600">Suspended</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-600">{suspendedAdmins}</p>
          <p className="text-xs text-slate-500">Accounts suspended</p>
        </div>
      </div>
    );
  };

  // Recent Logins Component
  const RecentLogins = () => {
    if (loading) return null;

    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-2">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Recent Logins</h3>
                <p className="text-xs text-slate-500">Latest admin activity</p>
              </div>
            </div>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View audit log
            </button>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {recentLogins.map((login, idx) => (
            <div key={idx} className="flex items-center gap-3 p-4 transition-all hover:bg-slate-50/80">
              <div className="rounded-lg bg-slate-100 p-2">
                <Shield className="h-4 w-4 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{login.name}</p>
                <p className="text-xs text-slate-500">IP: {login.ip}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">{login.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Role Distribution Component
  const RoleDistribution = () => {
    if (loading || rows.length === 0) return null;

    const roleCounts = {};
    rows.forEach(row => {
      roleCounts[row.role] = (roleCounts[row.role] || 0) + 1;
    });

    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Role Distribution</h3>
            <p className="text-xs text-slate-500">Admins by role type</p>
          </div>
          <ShieldCheck className="h-4 w-4 text-slate-400" />
        </div>
        <div className="space-y-3">
          {Object.entries(roleCounts).map(([role, count]) => {
            const config = roleConfig[role] || roleConfig.Viewer;
            const percentage = ((count / totalAdmins) * 100).toFixed(1);
            return (
              <div key={role}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <config.icon className={`h-3.5 w-3.5 ${config.text}`} />
                    <span className="font-medium text-slate-700">{role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">{count}</span>
                    <span className="text-xs text-slate-500">{percentage}%</span>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div 
                    className={`h-full rounded-full bg-${config.color}-500 transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Quick Actions Bar
  const QuickActionsBar = () => {
    if (loading) return null;

    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm p-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-100 p-2">
            <UserCog className="h-4 w-4 text-slate-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Admin Management</p>
            <p className="text-xs text-slate-500">
              {activeAdmins} active • {invitedAdmins} invited • {suspendedAdmins} suspended
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search admins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-slate-200 pl-9 pr-3 py-1.5 text-sm outline-none focus:border-slate-400"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-all hover:bg-slate-50"
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:shadow-lg"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Admin
          </button>
        </div>
      </div>
    );
  };

  // Add Admin Modal
  const AddAdminModal = () => {
    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-xl bg-white shadow-xl animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="border-b border-slate-100 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 p-2">
                  <Plus className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Add New Admin</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 hover:bg-slate-100"
              >
                <XCircle className="h-5 w-5 text-slate-500" />
              </button>
            </div>
          </div>
          
          <div className="space-y-4 p-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <select className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                <option>Admin</option>
                <option>Manager</option>
                <option>Support</option>
                <option>Viewer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Permissions</label>
              <div className="space-y-2 rounded-lg border border-slate-200 p-3">
                {permissionModules.map((module) => (
                  <label key={module.key} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                    <span className="text-sm text-slate-700">{module.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 border-t border-slate-100 p-4">
            <button 
              onClick={() => setShowAddModal(false)}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50"
            >
              Cancel
            </button>
            <button className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg">
              Send Invite
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Admin Details Modal
  const AdminDetailsModal = () => {
    if (!selectedAdmin) return null;

    const role = roleConfig[selectedAdmin.role] || roleConfig.Viewer;
    const RoleIcon = role.icon;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-xl bg-white shadow-xl animate-in fade-in-0 zoom-in-95 duration-200">
          <div className={`rounded-t-xl ${role.bg} border-b p-5`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md`}>
                  <span className="text-lg font-bold text-white">
                    {selectedAdmin.name?.charAt(0) || "A"}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{selectedAdmin.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <RoleIcon className={`h-3.5 w-3.5 ${role.text}`} />
                    <p className={`text-sm ${role.text}`}>{selectedAdmin.role}</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAdmin(null)}
                className="rounded-lg p-1.5 hover:bg-white/50 transition-colors"
              >
                <XCircle className="h-5 w-5 text-slate-500" />
              </button>
            </div>
          </div>
          
          <div className="space-y-4 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</label>
                <div className="mt-1 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <p className="text-sm text-slate-700">{selectedAdmin.email}</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</label>
                <div className="mt-1">
                  <StatusBadge status={selectedAdmin.status} />
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Permissions</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {normalizePermissions(selectedAdmin.permissions).map((perm, idx) => (
                  <span key={idx} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                    {perm}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Active</label>
              <p className="mt-1 text-sm text-slate-700">{selectedAdmin.lastActive || "Today"}</p>
            </div>
            
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role Description</label>
              <p className="mt-1 text-sm text-slate-600">{role.description}</p>
            </div>
          </div>
          
          <div className="flex gap-2 border-t border-slate-100 p-4">
            <button 
              onClick={() => setSelectedAdmin(null)}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50"
            >
              Close
            </button>
            <button className="flex-1 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-slate-900">
              Edit Permissions
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      <AdminFeaturePage
        title="Sub Admins"
        description="Manage admin users, roles, permissions, and access levels. Control who has access to what features."
        stats={stats}
        rows={rows.filter(row => 
          searchQuery === "" || 
          row.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.email?.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        filters={["All", "Active", "Suspended", "Invited"]}
        columns={enhancedColumns}
        loading={loading}
        error={error}
        onRefresh={refresh}
      >
        {/* Analytics Section */}
        {!loading && rows.length > 0 && (
          <div className="space-y-4">
            <AdminStats />
            <div className="grid gap-6 lg:grid-cols-2">
              <RoleDistribution />
              <RecentLogins />
            </div>
            <QuickActionsBar />
          </div>
        )}

        {/* Empty State */}
        {!loading && rows.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 p-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No admins found</h3>
            <p className="mt-1 text-sm text-slate-500">Add your first admin to start managing the platform.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Add Admin
            </button>
          </div>
        )}

        {/* Modals */}
        <AddAdminModal />
        <AdminDetailsModal />
      </AdminFeaturePage>
    </div>
  );
}

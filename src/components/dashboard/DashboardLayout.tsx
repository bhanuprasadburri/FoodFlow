import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { DemoRoleSwitcher } from "./DemoRoleSwitcher";
import {
  Home,
  Award,
  CircleHelp,
  CheckCircle2,
  UtensilsCrossed,
  Truck,
  Building2,
  Shield,
  Leaf,
  Bell,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Menu,
  BarChart3,
  ClipboardList,
  MapPin,
  FileText,
  Users,
  UserCheck,
  Briefcase,
  Heart,
  Package,
  CalendarClock,
  TrendingUp,
  Radio,
  MessageSquareWarning,
} from "lucide-react";

export type UserRole = "user" | "employee" | "business" | "admin" | "biogas";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const navByRole: Record<UserRole, NavItem[]> = {
  user: [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "Donate Food", icon: Heart, href: "/dashboard/create-donation" },
    { label: "My Donations", icon: UtensilsCrossed, href: "/dashboard/donations" },
    { label: "Active Donations", icon: Package, href: "/dashboard/tracking" },
    { label: "Donation Tracking", icon: MapPin, href: "/dashboard/tracking" },
    { label: "Impact", icon: TrendingUp, href: "/dashboard#impact" },
    { label: "Notifications", icon: Bell, href: "/dashboard/notifications" },
    { label: "Rewards & Recognition", icon: Award, href: "/dashboard#rewards" },
    { label: "Profile", icon: User, href: "/dashboard/profile" },
    { label: "Help & Support", icon: CircleHelp, href: "/dashboard/profile#support" },
    { label: "Settings", icon: SlidersHorizontal, href: "/dashboard/profile#settings" },
  ],
  employee: [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "New Requests", icon: ClipboardList, href: "/dashboard/requests" },
    { label: "My Assignments", icon: Truck, href: "/dashboard/assignments" },
    { label: "Active Pickups", icon: Package, href: "/dashboard/assignments" },
    { label: "Delivery Tracking", icon: MapPin, href: "/dashboard/tracking" },
    { label: "Completed Donations", icon: CheckCircle2, href: "/dashboard/history" },
    { label: "Performance", icon: TrendingUp, href: "/dashboard/performance" },
    { label: "Notifications", icon: Bell, href: "/dashboard/notifications" },
    { label: "Profile", icon: User, href: "/dashboard/profile" },
    { label: "Help & Support", icon: CircleHelp, href: "/dashboard/profile#support" },
    { label: "Settings", icon: SlidersHorizontal, href: "/dashboard/profile#settings" },
  ],
  business: [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "My Donations", icon: UtensilsCrossed, href: "/dashboard/donations" },
    { label: "Create Donation", icon: Heart, href: "/dashboard/create-donation" },
    { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
    { label: "Subscription", icon: Briefcase, href: "/dashboard/subscription" },
    { label: "Notifications", icon: Bell, href: "/dashboard/notifications" },
    { label: "Profile", icon: User, href: "/dashboard/profile" },
  ],
  admin: [
    { label: "Overview", icon: Home, href: "/dashboard" },
    { label: "Users", icon: Users, href: "/dashboard/users" },
    { label: "Employees", icon: UserCheck, href: "/dashboard/employees" },
    { label: "Businesses", icon: Building2, href: "/dashboard/businesses" },
    { label: "Donations", icon: UtensilsCrossed, href: "/dashboard/donations" },
    { label: "Live Operations", icon: Radio, href: "/dashboard#operations" },
    { label: "Food Waste", icon: Leaf, href: "/dashboard/analytics" },
    { label: "Biogas Partners", icon: Leaf, href: "/dashboard/biogas-partners" },
    { label: "Subscriptions", icon: Briefcase, href: "/dashboard/subscriptions" },
    { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
    { label: "Reports", icon: FileText, href: "/dashboard/analytics" },
    { label: "System Health", icon: Shield, href: "/dashboard/system-health" },
    { label: "Notifications", icon: Bell, href: "/dashboard/notifications" },
    { label: "Issues & Complaints", icon: MessageSquareWarning, href: "/dashboard/notifications" },
    { label: "Settings", icon: SlidersHorizontal, href: "/dashboard/profile#settings" },
  ],
  biogas: [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "Supply Requests", icon: Package, href: "/dashboard/supply-requests" },
    { label: "Agreements", icon: FileText, href: "/dashboard/agreements" },
    { label: "Schedule", icon: CalendarClock, href: "/dashboard/schedule" },
    { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
    { label: "Notifications", icon: Bell, href: "/dashboard/notifications" },
    { label: "Profile", icon: User, href: "/dashboard/profile" },
  ],
};

const roleLabels: Record<UserRole, string> = {
  user: "Donor",
  employee: "Collection Agent",
  business: "Business Partner",
  admin: "Super Admin",
  biogas: "Biogas Partner",
};

const roleColors: Record<UserRole, string> = {
  user: "bg-[#E8F5E9] text-[#00615F]",
  employee: "bg-[#E3F2FD] text-[#1565C0]",
  business: "bg-[#FFF3E0] text-[#E65100]",
  admin: "bg-[#F3E5F5] text-[#6A1B9A]",
  biogas: "bg-[#E8F5E9] text-[#00615F]",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const role = (user?.role as UserRole) || "user";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-white/15">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
          <Leaf className="h-5 w-5 text-white" />
        </div>
        {!collapsed && <span className="text-lg font-extrabold text-white tracking-tight">FoodFlow</span>}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navByRole[role].map((item) => {
          const active = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                active ? "bg-white/15 text-white" : "text-white/60 hover:text-white hover:bg-white/8"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/15">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name || "User"}</p>
              <p className="text-xs text-white/50">{roleLabels[role]}</p>
            </div>
          </div>
        )}
        <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/8 transition-all">
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#FBF7F4]">
      <aside className={cn("hidden lg:flex flex-col bg-[#00615F] transition-all duration-300", collapsed ? "w-[68px]" : "w-64")}>
        <SidebarContent />
      </aside>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#00615F] z-10"><SidebarContent /></aside>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 lg:px-6 gap-4 shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex h-9 w-9 items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
            {collapsed ? <ChevronRight className="h-4 w-4 text-gray-500" /> : <ChevronLeft className="h-4 w-4 text-gray-500" />}
          </button>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search donations, users..." className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F5F0EB] border border-transparent focus:border-[#00615F]/30 focus:bg-white text-sm outline-none transition-all placeholder:text-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DemoRoleSwitcher />
            <Link to="/dashboard/notifications" className="relative flex h-9 w-9 items-center justify-center rounded-xl hover:bg-[#F5F0EB] transition-colors">
              <Bell className="h-5 w-5 text-gray-500" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#00615F] text-white text-[10px] font-bold flex items-center justify-center">3</span>
            </Link>
            <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", roleColors[role])}>{roleLabels[role]}</span>
            <Link to="/dashboard/profile" className="hidden items-center gap-2 border-l border-gray-100 pl-3 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F5E9] text-sm font-bold text-[#00615F]">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="hidden text-left xl:block">
                <p className="max-w-28 truncate text-xs font-bold text-gray-800">{user?.name || "Donor"}</p>
                <p className="text-[10px] text-emerald-600">{user?.verificationStatus === "verified" ? "Verified account" : "Account active"}</p>
              </div>
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

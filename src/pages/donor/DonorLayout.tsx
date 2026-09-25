import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { DemoRoleSwitcher } from "@/components/dashboard/DemoRoleSwitcher";
import { Bell, ChevronLeft, ChevronRight, CircleHelp, Heart, Home, Leaf, LogOut, MapPin, Menu, Package, Settings, Sparkles, TrendingUp, User, Award, X } from "lucide-react";

const navItems = [
  ["Dashboard", "/donor/dashboard", Home],
  ["AI Matching & Map", "/donor/ai-matching", Sparkles],
  ["Donate Food", "/donor/donate", Heart],
  ["My Donations", "/donor/donations", Package],
  ["Active Donations", "/donor/donations/active", MapPin],
  ["Donation Tracking", "/donor/tracking", MapPin],
  ["Impact", "/donor/impact", TrendingUp],
  ["Rewards & Recognition", "/donor/rewards", Award],
  ["Notifications", "/donor/notifications", Bell],
  ["Profile", "/donor/profile", User],
  ["Help & Support", "/donor/help", CircleHelp],
  ["Settings", "/donor/settings", Settings],
] as const;

export default function DonorLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const logout = async () => { await signOut(); navigate("/auth"); };
  const sidebar = <div className="flex h-full flex-col bg-[#00615F] text-white">
    <div className="flex h-16 items-center gap-2.5 border-b border-white/15 px-4"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"><Leaf className="h-5 w-5" /></div>{!collapsed && <span className="text-lg font-extrabold tracking-tight">FoodFlow</span>}<button type="button" className="ml-auto lg:hidden" onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button></div>
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">{navItems.map(([label, href, Icon]) => { const active = location.pathname === href || (href !== "/donor/dashboard" && location.pathname.startsWith(href)); return <Link key={href} to={href} onClick={() => setMobileOpen(false)} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all", active ? "bg-white/15 text-white" : "text-white/65 hover:bg-white/10 hover:text-white")}><Icon className="h-5 w-5 shrink-0" />{!collapsed && <span>{label}</span>}</Link>; })}</nav>
    <div className="border-t border-white/15 p-3"><div className="mb-3 flex items-center gap-3 px-2"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C6E7D2] text-sm font-bold text-[#00615F]">{user?.name?.charAt(0) || "D"}</div>{!collapsed && <div className="min-w-0"><p className="truncate text-sm font-bold">{user?.name || "Donor"}</p><p className="text-xs text-white/55">Donor account</p></div>}</div><button type="button" onClick={() => void logout()} className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-semibold text-white/65 hover:bg-white/10 hover:text-white"><LogOut className="h-5 w-5" />{!collapsed && "Logout"}</button></div>
  </div>;
  return <div className="flex h-screen bg-[#FBF7F4]"><aside className={cn("hidden shrink-0 transition-all lg:flex", collapsed ? "w-[68px]" : "w-64")}>{sidebar}</aside>{mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} /><aside className="absolute bottom-0 left-0 top-0 w-72">{sidebar}</aside></div>}<div className="flex min-w-0 flex-1 flex-col"><header className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-100 bg-white px-4 lg:px-6"><button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-gray-100 lg:hidden" onClick={() => setMobileOpen(true)}><Menu className="h-5 w-5 text-gray-600" /></button><button type="button" className="hidden h-9 w-9 items-center justify-center rounded-xl hover:bg-gray-100 lg:flex" onClick={() => setCollapsed((value) => !value)}>{collapsed ? <ChevronRight className="h-4 w-4 text-gray-500" /> : <ChevronLeft className="h-4 w-4 text-gray-500" />}</button><div className="flex-1"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#00877F]">Donor workspace</p><p className="text-sm font-bold text-[#173B38]">Every surplus can become a meal.</p></div><DemoRoleSwitcher /><Link to="/donor/notifications" className="relative flex h-9 w-9 items-center justify-center rounded-xl hover:bg-[#F5F0EB]"><Bell className="h-5 w-5 text-gray-500" /><span className="absolute right-0 top-0 h-4 w-4 rounded-full bg-[#0B8B7F] text-center text-[10px] font-bold text-white">3</span></Link><Link to="/donor/profile" className="hidden items-center gap-2 border-l border-gray-100 pl-3 sm:flex"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F5E9] text-sm font-bold text-[#00615F]">{user?.name?.charAt(0) || "D"}</div><span className="hidden max-w-28 truncate text-xs font-bold text-gray-700 md:block">{user?.name || "Donor"}</span></Link></header><main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main></div></div>;
}

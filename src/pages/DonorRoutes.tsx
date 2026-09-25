import { Navigate, Route, Routes } from "react-router";
import DonorLayout from "./donor/DonorLayout";
import DonorProfilePage from "./donor/DonorProfilePage";
import { Link } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { PhaseOneWorkspace } from "@/components/dashboard/PhaseOneWorkspace";
import { DonationDetailsPage, DonationsPage, DonorDashboardPage, DonatePage, HelpPage, ImpactPage, NotificationsPage, ProfilePage, RewardsPage, SettingsPage, TrackingPage } from "./donor/DonorPages";

export default function DonorRoutes() {
  const { user } = useAuth();
  if (!user || user.role !== "user") return <div className="flex min-h-screen items-center justify-center"><div className="rounded-3xl border border-[#E6EAE4] bg-white p-8 text-center shadow-sm"><h1 className="text-2xl font-extrabold text-[#173B38]">Access Denied</h1><p className="mt-2 text-sm text-[#71817C]">This area is available only to donor accounts.</p><Link to="/dashboard" className="mt-5 inline-block rounded-xl bg-[#0B8B7F] px-4 py-3 text-sm font-bold text-white">Go to your dashboard</Link></div></div>;
  return <DonorLayout><Routes><Route index element={<Navigate to="dashboard" replace />} /><Route path="dashboard" element={<DonorDashboardPage />} /><Route path="ai-matching" element={<PhaseOneWorkspace role="donor" />} /><Route path="donate" element={<DonatePage />} /><Route path="donations" element={<DonationsPage />} /><Route path="donations/active" element={<DonationsPage onlyActive />} /><Route path="donations/history" element={<DonationsPage />} /><Route path="donations/:id" element={<DonationDetailsPage />} /><Route path="tracking" element={<TrackingPage />} /><Route path="impact" element={<ImpactPage />} /><Route path="rewards" element={<RewardsPage />} /><Route path="notifications" element={<NotificationsPage />} /><Route path="profile" element={<DonorProfilePage />} /><Route path="settings" element={<SettingsPage />} /><Route path="help" element={<HelpPage />} /><Route path="*" element={<Navigate to="/404" replace />} /></Routes></DonorLayout>;
}

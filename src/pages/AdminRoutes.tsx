import { Navigate, Route, Routes } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import AdminLayout from "./admin/AdminLayout";
import { PhaseOneWorkspace } from "@/components/dashboard/PhaseOneWorkspace";
import AdminDashboard from "./dashboards/AdminDashboard";
import AdminUsers from "./dashboards/AdminUsers";
import AdminEmployees from "./dashboards/AdminEmployees";
import AdminBusinesses from "./dashboards/AdminBusinesses";
import AdminDonations from "./dashboards/AdminDonations";
import AdminBiogas from "./dashboards/AdminBiogas";
import AdminSubscriptions from "./dashboards/AdminSubscriptions";
import AdminAnalytics from "./dashboards/AdminAnalytics";
import SystemHealth from "./dashboards/SystemHealth";
import { AdminAnalyticsPage, AdminNotificationsPage, AdminProfilePage, AdminRecordPage, AdminSettingsPage, AdminSimplePage, AuditLogsPage, BiogasPartnersPage, FoodWastePage, IssuesPage, ReportsPage, SystemHealthPage, AdminLiveOperationsPage } from "./admin/AdminPages";

export default function AdminRoutes() {
  const { user } = useAuth();
  if (!user || user.role !== "admin") return <AdminSimplePage title="Access Restricted" />;
  return <AdminLayout><Routes><Route index element={<Navigate to="dashboard" replace />} /><Route path="dashboard" element={<AdminDashboard />} /><Route path="ai-matching" element={<PhaseOneWorkspace role="admin" />} /><Route path="users" element={<AdminUsers />} /><Route path="users/:id" element={<AdminRecordPage kind="User" />} /><Route path="employees" element={<AdminEmployees />} /><Route path="employees/:id" element={<AdminRecordPage kind="Employee" />} /><Route path="businesses" element={<AdminBusinesses />} /><Route path="businesses/:id" element={<AdminRecordPage kind="Business" />} /><Route path="donations" element={<AdminDonations />} /><Route path="donations/:id" element={<AdminRecordPage kind="Donation" />} /><Route path="live-operations" element={<AdminLiveOperationsPage />} /><Route path="food-waste" element={<FoodWastePage />} /><Route path="biogas-partners" element={<BiogasPartnersPage />} /><Route path="subscriptions" element={<AdminSubscriptions />} /><Route path="analytics" element={<AdminAnalyticsPage />} /><Route path="reports" element={<ReportsPage />} /><Route path="notifications" element={<AdminNotificationsPage />} /><Route path="issues" element={<IssuesPage />} /><Route path="system-health" element={<SystemHealthPage />} /><Route path="audit-logs" element={<AuditLogsPage />} /><Route path="profile" element={<AdminProfilePage />} /><Route path="settings" element={<AdminSettingsPage />} /><Route path="*" element={<Navigate to="/404" replace />} /></Routes></AdminLayout>;
}

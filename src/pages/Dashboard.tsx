import { Routes, Route, Navigate } from "react-router";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/use-auth";

// Lazy imports for code splitting
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

const UserDashboard = lazy(() => import("./dashboards/UserDashboard"));
const EmployeeDashboard = lazy(() => import("./dashboards/EmployeeDashboard"));
const BusinessDashboard = lazy(() => import("./dashboards/BusinessDashboard"));
const AdminDashboard = lazy(() => import("./dashboards/AdminDashboard"));
const BiogasDashboard = lazy(() => import("./dashboards/BiogasDashboard"));
const UserDonations = lazy(() => import("./dashboards/UserDonations"));
const CreateDonation = lazy(() => import("./dashboards/CreateDonation"));
const DonationMatching = lazy(() => import("./dashboards/DonationMatching"));
const Tracking = lazy(() => import("./dashboards/Tracking"));
const Notifications = lazy(() => import("./dashboards/Notifications"));
const ProfileSettings = lazy(() => import("./dashboards/ProfileSettings"));
const EmployeeRequests = lazy(() => import("./dashboards/EmployeeRequests"));
const EmployeeAssignments = lazy(() => import("./dashboards/EmployeeAssignments"));
const EmployeeHistory = lazy(() => import("./dashboards/EmployeeHistory"));
const EmployeePerformance = lazy(() => import("./dashboards/EmployeePerformance"));
const BusinessAnalytics = lazy(() => import("./dashboards/BusinessAnalytics"));
const BusinessSubscription = lazy(() => import("./dashboards/BusinessSubscription"));
const AdminUsers = lazy(() => import("./dashboards/AdminUsers"));
const AdminEmployees = lazy(() => import("./dashboards/AdminEmployees"));
const AdminBusinesses = lazy(() => import("./dashboards/AdminBusinesses"));
const AdminDonations = lazy(() => import("./dashboards/AdminDonations"));
const AdminBiogas = lazy(() => import("./dashboards/AdminBiogas"));
const AdminSubscriptions = lazy(() => import("./dashboards/AdminSubscriptions"));
const AdminAnalytics = lazy(() => import("./dashboards/AdminAnalytics"));
const SystemHealth = lazy(() => import("./dashboards/SystemHealth"));
const BiogasSupplyRequests = lazy(() => import("./dashboards/BiogasSupplyRequests"));
const BiogasAgreements = lazy(() => import("./dashboards/BiogasAgreements"));
const BiogasSchedule = lazy(() => import("./dashboards/BiogasSchedule"));
const BiogasAnalytics = lazy(() => import("./dashboards/BiogasAnalytics"));

function DashboardLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
    </div>
  );
}

type UserRole = "user" | "employee" | "business" | "admin" | "biogas";

const roleRedirects: Record<UserRole, string> = {
  user: "/dashboard",
  employee: "/dashboard",
  business: "/dashboard",
  admin: "/dashboard",
  biogas: "/dashboard",
};

export default function Dashboard() {
  const { user } = useAuth();
  const role = user?.role as UserRole | undefined;

  if (!role) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <DashboardLayout>
      <Suspense fallback={<DashboardLoader />}>
        <Routes>
          {/* ─── Role-based home dashboards ─── */}
          <Route index element={
            role === "user" ? <Navigate to="/donor/dashboard" replace /> :
            role === "employee" ? <Navigate to="/employee/dashboard" replace /> :
            role === "business" ? <Navigate to="/business/dashboard" replace /> :
            role === "admin" ? <Navigate to="/admin/dashboard" replace /> :
            role === "biogas" ? <Navigate to="/partner/dashboard" replace /> :
            <Navigate to="/auth" replace />
          } />

          {/* ─── Shared routes ─── */}
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="tracking" element={<Tracking />} />
          <Route path="donations" element={
            role === "admin" ? <AdminDonations /> :
            <UserDonations />
          } />
          <Route path="create-donation" element={<CreateDonation />} />
          <Route path="matching/:id" element={<DonationMatching />} />

          {/* ─── Employee routes ─── */}
          <Route path="requests" element={
            role === "employee" ? <EmployeeRequests /> :
            role === "admin" ? <AdminDonations /> :
            <Navigate to="/dashboard" replace />
          } />
          <Route path="assignments" element={
            role === "employee" ? <EmployeeAssignments /> :
            <Navigate to="/dashboard" replace />
          } />
          <Route path="history" element={
            role === "employee" ? <EmployeeHistory /> :
            <Navigate to="/dashboard" replace />
          } />
          <Route path="performance" element={
            role === "employee" ? <EmployeePerformance /> :
            <Navigate to="/dashboard" replace />
          } />

          {/* ─── Business routes ─── */}
          <Route path="analytics" element={
            role === "admin" ? <AdminAnalytics /> :
            role === "business" ? <BusinessAnalytics /> :
            role === "biogas" ? <BiogasAnalytics /> :
            <Navigate to="/dashboard" replace />
          } />
          <Route path="subscription" element={
            role === "business" ? <BusinessSubscription /> :
            <Navigate to="/dashboard" replace />
          } />

          {/* ─── Admin routes ─── */}
          <Route path="users" element={
            role === "admin" ? <AdminUsers /> :
            <Navigate to="/dashboard" replace />
          } />
          <Route path="employees" element={
            role === "admin" ? <AdminEmployees /> :
            <Navigate to="/dashboard" replace />
          } />
          <Route path="businesses" element={
            role === "admin" ? <AdminBusinesses /> :
            <Navigate to="/dashboard" replace />
          } />
          <Route path="biogas-partners" element={
            role === "admin" ? <AdminBiogas /> :
            <Navigate to="/dashboard" replace />
          } />
          <Route path="subscriptions" element={
            role === "admin" ? <AdminSubscriptions /> :
            <Navigate to="/dashboard" replace />
          } />
          <Route path="system-health" element={
            role === "admin" ? <SystemHealth /> :
            <Navigate to="/dashboard" replace />
          } />

          {/* ─── Biogas routes ─── */}
          <Route path="supply-requests" element={
            role === "biogas" ? <BiogasSupplyRequests /> :
            <Navigate to="/dashboard" replace />
          } />
          <Route path="agreements" element={
            role === "biogas" ? <BiogasAgreements /> :
            <Navigate to="/dashboard" replace />
          } />
          <Route path="schedule" element={
            role === "biogas" ? <BiogasSchedule /> :
            <Navigate to="/dashboard" replace />
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </DashboardLayout>
  );
}

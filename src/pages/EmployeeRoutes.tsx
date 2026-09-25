import { Navigate, Route, Routes } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { PhaseOneWorkspace } from "@/components/dashboard/PhaseOneWorkspace";
import EmployeeLayout from "./employee/EmployeeLayout";
import { AccessRestricted, AssignmentsPage, CompletedPage, EmployeeDashboardPage, EmployeeHelpPage, EmployeeProfilePage, EmployeeRequestDetailsPage, EmployeeRequestsPage, EmployeeSettingsPage, NotificationsPage, PerformancePage, TrackingPage } from "./employee/EmployeePages";

export default function EmployeeRoutes() {
  const { user } = useAuth();
  if (!user || user.role !== "employee") return <AccessRestricted />;
  return <EmployeeLayout><Routes><Route index element={<Navigate to="dashboard" replace />} /><Route path="dashboard" element={<EmployeeDashboardPage />} /><Route path="ai-matching" element={<PhaseOneWorkspace role="volunteer" />} /><Route path="requests" element={<EmployeeRequestsPage />} /><Route path="requests/:id" element={<EmployeeRequestDetailsPage />} /><Route path="assignments" element={<AssignmentsPage />} /><Route path="active-pickups" element={<AssignmentsPage activeOnly />} /><Route path="tracking" element={<TrackingPage />} /><Route path="completed" element={<CompletedPage />} /><Route path="performance" element={<PerformancePage />} /><Route path="notifications" element={<NotificationsPage />} /><Route path="profile" element={<EmployeeProfilePage />} /><Route path="settings" element={<EmployeeSettingsPage />} /><Route path="help" element={<EmployeeHelpPage />} /><Route path="*" element={<Navigate to="/404" replace />} /></Routes></EmployeeLayout>;
}

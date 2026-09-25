import { Navigate, Route, Routes } from "react-router";
import { useAuth } from "@/hooks/use-auth";

function RoleRedirect({ donor, employee, business, admin, partner }: { donor: string; employee?: string; business?: string; admin?: string; partner?: string }) {
  const { user } = useAuth();
  const destinations: Record<string, string | undefined> = { user: donor, employee, business, admin, biogas: partner };
  return <Navigate to={destinations[user?.role || "user"] || admin || donor} replace />;
}

export default function PlatformRoutes() {
  return <Routes>
    <Route path="donations" element={<RoleRedirect donor="/donor/donations" business="/business/donations" admin="/admin/donations" />} />
    <Route path="donations/new" element={<RoleRedirect donor="/donor/donate" business="/business/donate" admin="/admin/donations" />} />
    <Route path="donations/history" element={<RoleRedirect donor="/donor/donations/history" business="/business/donations/history" admin="/admin/donations" />} />
    <Route path="donations/:id" element={<RoleRedirect donor="/donor/donations" business="/business/donations" admin="/admin/donations" />} />
    <Route path="verification" element={<RoleRedirect donor="/donor/dashboard" admin="/admin/donations" />} />
    <Route path="tracking" element={<RoleRedirect donor="/donor/tracking" employee="/employee/tracking" business="/business/tracking" admin="/admin/live-operations" />} />
    <Route path="pickups" element={<RoleRedirect donor="/donor/tracking" employee="/employee/assignments" business="/business/tracking" admin="/admin/live-operations" partner="/partner/collections" />} />
    <Route path="notifications" element={<RoleRedirect donor="/donor/notifications" employee="/employee/notifications" business="/business/notifications" admin="/admin/notifications" partner="/partner/notifications" />} />
    <Route path="impact" element={<RoleRedirect donor="/donor/impact" business="/business/impact" admin="/admin/analytics" partner="/partner/impact" />} />
    <Route path="achievements" element={<RoleRedirect donor="/donor/rewards" business="/business/reputation" employee="/employee/performance" partner="/partner/impact" admin="/admin/analytics" />} />
    <Route path="certificates" element={<RoleRedirect donor="/donor/impact" business="/business/reports" admin="/admin/reports" />} />
    <Route path="waste-processing" element={<RoleRedirect donor="/donor/help" business="/business/help" admin="/admin/food-waste" partner="/partner/dashboard" />} />
    <Route path="complaints" element={<RoleRedirect donor="/donor/help" employee="/employee/help" business="/business/help" admin="/admin/issues" partner="/partner/issues" />} />
    <Route path="*" element={<Navigate to="/404" replace />} />
  </Routes>;
}

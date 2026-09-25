import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge, EmptyState } from "@/components/dashboard/SharedComponents";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Users, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const roleColors: Record<string, string> = {
  user: "bg-emerald-50 text-emerald-700",
  employee: "bg-blue-50 text-blue-700",
  business: "bg-amber-50 text-amber-700",
  admin: "bg-purple-50 text-purple-700",
  biogas: "bg-green-50 text-green-700",
};

const SEED_USERS = [
  { _id: "u-1", name: "Alex Johnson", email: "alex@example.com", role: "user", phone: "+91 98765 01000", address: "15 Maple Street, Downtown", verificationStatus: "verified", createdAt: Date.now() - 3600000 * 200 },
  { _id: "u-2", name: "Grand Hotel Kitchen (Chef Rajesh)", email: "kitchen@grandhotel.com", role: "business", phone: "+91 98111 22334", address: "123 Main Street, Downtown", verificationStatus: "verified", createdAt: Date.now() - 3600000 * 300 },
  { _id: "u-3", name: "Alex Morgan", email: "alex.morgan@foodflow.com", role: "employee", phone: "+91 98765 01001", address: "Logistics Hub 4, Metro Area", verificationStatus: "verified", createdAt: Date.now() - 3600000 * 400 },
  { _id: "u-4", name: "Green Energy Biogas (Dr. Murthy)", email: "operations@greenenergybiogas.com", role: "biogas", phone: "+91 98666 77889", address: "Sector 9 Bio Tech Park", verificationStatus: "verified", createdAt: Date.now() - 3600000 * 500 },
  { _id: "u-5", name: "Green Leaf Bakery (Sunita Patel)", email: "contact@greenleaf.com", role: "business", phone: "+91 98222 33445", address: "42 Cedar Lane, Midtown", verificationStatus: "verified", createdAt: Date.now() - 3600000 * 150 },
  { _id: "u-6", name: "Priya Sharma", email: "priya.sharma@foodflow.com", role: "employee", phone: "+91 98765 01003", address: "Eastside Logistics Office", verificationStatus: "verified", createdAt: Date.now() - 3600000 * 120 },
  { _id: "u-7", name: "Ananya Roy", email: "ananya.roy@example.com", role: "user", phone: "+91 91234 56780", address: "78 Grand Residency Boulevard", verificationStatus: "pending", createdAt: Date.now() - 3600000 * 5 },
  { _id: "u-8", name: "EcoCycle Anaerobic Facility", email: "contact@ecocycle.org", role: "biogas", phone: "+91 98777 88990", address: "Plot 44, East Environmental Zone", verificationStatus: "verified", createdAt: Date.now() - 3600000 * 90 },
];

export default function AdminUsers() {
  const queryUsers = useQuery(api.mutations.users.getAllUsers);
  const setVerificationStatus = useMutation(api.mutations.users.setVerificationStatus);
  const [localUsers, setLocalUsers] = useState<any[]>(SEED_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const allUsers = (queryUsers && queryUsers.length > 0) ? queryUsers : localUsers;

  const filtered = allUsers?.filter((u: any) => {
    const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  }) || [];
  const pendingCount = allUsers?.filter((u: any) => u.verificationStatus === "pending").length || 0;

  const updateVerification = async (userId: any, status: "verified" | "rejected") => {
    setLocalUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, verificationStatus: status } : u))
    );
    try {
      await setVerificationStatus({ userId, status });
    } catch {
      // offline fallback
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2"><Users className="h-6 w-6 text-blue-500" /> User Management</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage all registered users on the FoodFlow platform.</p>
      </div>
      {pendingCount > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>{pendingCount} user{pendingCount === 1 ? "" : "s"}</strong> waiting for verification. Review their contact details before approving access.
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 w-full rounded-lg border border-gray-200 pl-9 pr-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white focus:border-emerald-400 focus:outline-none">
          <option value="all">All Roles</option>
          <option value="user">Donors</option>
          <option value="employee">Employees</option>
          <option value="business">Businesses</option>
          <option value="admin">Admins</option>
          <option value="biogas">Biogas Partners</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <Card className="border-gray-200 shadow-sm"><CardContent><EmptyState icon={Users} title="No users found" description="No users match your current filters." /></CardContent></Card>
      ) : (
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-0 divide-y divide-gray-100">
            {filtered.map((u) => (
              <div key={u._id} className="flex flex-col gap-3 p-4 hover:bg-gray-50 transition-colors sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold">{u.name?.charAt(0) || "U"}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{u.name || "Unnamed"}</p>
                    <p className="text-xs text-gray-500">{u.email || "No email"}</p>
                    <p className="text-xs text-gray-400">{u.phone || "No phone"} · {u.address || "No pickup address"}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${roleColors[u.role || "user"] || "bg-gray-100 text-gray-600"}`}>{u.role || "user"}</span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${u.verificationStatus === "verified" ? "bg-emerald-50 text-emerald-700" : u.verificationStatus === "rejected" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
                    {u.verificationStatus || "pending"}
                  </span>
                  {u.verificationStatus !== "verified" && u.role !== "admin" && (
                    <button type="button" onClick={() => void updateVerification(u._id, "verified")} className="text-xs font-semibold text-emerald-700 hover:text-emerald-900">
                      Approve
                    </button>
                  )}
                  {u.verificationStatus === "pending" && (
                    <button type="button" onClick={() => void updateVerification(u._id, "rejected")} className="text-xs font-semibold text-red-600 hover:text-red-800">
                      Reject
                    </button>
                  )}
                  <p className="text-xs text-gray-400 hidden sm:block">{new Date(u.createdAt ?? 0).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

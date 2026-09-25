import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge, EmptyState } from "@/components/dashboard/SharedComponents";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UtensilsCrossed, MapPin, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { SEED_DONATIONS } from "@/lib/mock-data";

export default function AdminDonations() {
  const queryDonations = useQuery(api.mutations.donations.list);
  const storedDonations = (() => {
    try {
      const stored = localStorage.getItem("foodflow_all_donations") || localStorage.getItem("foodflow_donor_donations");
      return stored ? JSON.parse(stored) : SEED_DONATIONS;
    } catch {
      return SEED_DONATIONS;
    }
  })();
  const donations = (queryDonations && queryDonations.length > 0) ? queryDonations : storedDonations;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = donations?.filter((d: any) => {
    const matchSearch = !search || d.foodName?.toLowerCase().includes(search.toLowerCase()) || d.pickupAddress?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    return matchSearch && matchStatus;
  }) || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2"><UtensilsCrossed className="h-6 w-6 text-emerald-600" /> Donation Management</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor all donation activity across the FoodFlow platform.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input placeholder="Search donations..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 w-full rounded-lg border border-gray-200 pl-9 pr-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="on_the_way">On the Way</option>
          <option value="picked_up">Picked Up</option>
          <option value="delivered">Delivered</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <Card className="border-gray-200 shadow-sm"><CardContent><EmptyState icon={UtensilsCrossed} title="No donations" description="No donations match your current filters." /></CardContent></Card>
      ) : (
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-0 divide-y divide-gray-100">
            {filtered.sort((a, b) => b.createdAt - a.createdAt).map((d) => (
              <div key={d._id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><UtensilsCrossed className="h-4 w-4" /></div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{d.foodName}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="h-3 w-3" /> {d.pickupAddress}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-400 hidden sm:block">{d.quantity} · {d.quantityKg} kg</span>
                  <StatusBadge status={d.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

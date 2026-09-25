import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge, EmptyState } from "@/components/dashboard/SharedComponents";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Package, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { SEED_DONATIONS } from "@/lib/mock-data";

export default function EmployeeHistory() {
  const { user } = useAuth();
  const employee = useQuery(api.mutations.employees.getByUserId, user?._id ? { userId: user._id } : "skip");
  const assigned = employee ? useQuery(api.mutations.donations.listByEmployee, { employeeId: employee._id }) : undefined;
  const historyQuery = assigned?.filter((d) => d.status === "completed" || d.status === "delivered");
  const fallbackHistory = SEED_DONATIONS.filter((d) => d.status === "completed" || d.status === "delivered");
  const history = (historyQuery && historyQuery.length > 0) ? historyQuery : fallbackHistory;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Package className="h-6 w-6 text-purple-500" />
          Delivery History
        </h1>
        <p className="text-sm text-gray-500 mt-1">A record of all your completed food pickups and deliveries.</p>
      </div>
      {history.length === 0 ? (
        <Card className="border-gray-200 shadow-sm"><CardContent><EmptyState icon={Package} title="No delivery history" description="Completed deliveries will appear here." /></CardContent></Card>
      ) : (
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-0 divide-y divide-gray-100">
            {history.sort((a, b) => Number(b.updatedAt || b.createdAt || 0) - Number(a.updatedAt || a.createdAt || 0)).map((d) => (
              <div key={d._id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><Package className="h-4.5 w-4.5" /></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{d.foodName}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {d.pickupAddress}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-gray-400 flex items-center gap-1 hidden sm:flex"><Clock className="h-3.5 w-3.5" /> {new Date(d.updatedAt || d.createdAt || Date.now()).toLocaleDateString()}</p>
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

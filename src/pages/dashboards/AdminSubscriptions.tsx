import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/dashboard/SharedComponents";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { SEED_BUSINESSES } from "@/lib/mock-data";

export default function AdminSubscriptions() {
  const queryBusinesses = useQuery(api.mutations.businesses.list);
  const fallbackBusinesses = SEED_BUSINESSES.map((b) => ({
    _id: b._id,
    businessName: b.businessName,
    businessType: b.category,
    subscriptionPlan: b.plan.toLowerCase().includes("starter") ? "starter" : b.plan.toLowerCase().includes("growth") ? "professional" : "enterprise",
    totalDonations: Math.round(b.totalDonatedKg / 25),
  }));

  const businesses = (queryBusinesses && queryBusinesses.length > 0) ? queryBusinesses : fallbackBusinesses;
  const activeBusinesses = businesses?.filter((b: any) => b.subscriptionPlan && b.subscriptionPlan !== "free") || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2"><Briefcase className="h-6 w-6 text-amber-500" /> Subscription Management</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage business subscription plans across FoodFlow.</p>
      </div>
      {activeBusinesses.length === 0 ? (
        <Card className="border-gray-200 shadow-sm"><CardContent><EmptyState icon={Briefcase} title="No active subscriptions" description="Business subscriptions will appear here." /></CardContent></Card>
      ) : (
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-0 divide-y divide-gray-100">
            {activeBusinesses.map((biz) => (
              <div key={biz._id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 font-bold">{biz.businessName.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{biz.businessName}</p>
                    <p className="text-xs text-gray-500 capitalize">{biz.businessType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-xs font-medium capitalize">{biz.subscriptionPlan}</span>
                  <p className="text-xs text-gray-400 mt-1">{biz.totalDonations} donations</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

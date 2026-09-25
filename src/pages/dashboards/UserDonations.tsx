import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, EmptyState } from "@/components/dashboard/SharedComponents";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { UtensilsCrossed, Eye, XCircle, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { SEED_DONATIONS } from "@/lib/mock-data";

export default function UserDonations() {
  const { user } = useAuth();
  const queryDonations = useQuery(api.mutations.donations.listByDonor, user?._id ? { donorId: user._id } : "skip");
  const storedDonations = (() => {
    try {
      const stored = localStorage.getItem("foodflow_all_donations") || localStorage.getItem("foodflow_donor_donations");
      return stored ? JSON.parse(stored) : SEED_DONATIONS;
    } catch {
      return SEED_DONATIONS;
    }
  })();
  const [localDonations, setLocalDonations] = useState<any[]>(storedDonations);

  const donations = (queryDonations && queryDonations.length > 0) ? queryDonations : localDonations;
  const cancelDonation = useMutation(api.mutations.donations.cancel);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleCancel = async (donationId: string) => {
    setLocalDonations((prev) =>
      prev.map((d) => (d._id === donationId || d.id === donationId ? { ...d, status: "cancelled" } : d))
    );
    try {
      await cancelDonation({ donationId: donationId as never, note: "Cancelled by donor" });
    } catch {
      // safe fallback
    }
    toast.success("Donation cancelled successfully.");
  };

  const canCancel = (status: string) => ["pending", "accepted"].includes(status);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">My Donations</h1>
        <p className="text-sm text-gray-500 mt-1">Track and manage all your food donations on FoodFlow.</p>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-0">
          {!donations || donations.length === 0 ? (
            <EmptyState icon={UtensilsCrossed} title="No donations yet" description="Your donation history will appear here once you share food through FoodFlow." />
          ) : (
            <div className="divide-y divide-gray-100">
              {(donations || []).sort((a: any, b: any) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0)).map((d: any, index: number) => (
                <div key={d._id || d.id || index} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <UtensilsCrossed className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{d.foodName}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {d.pickupAddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {new Date(d.createdAt).toLocaleDateString()}
                      </div>
                      <StatusBadge status={d.status} />
                      <button
                        onClick={() => setExpandedId(expandedId === d._id ? null : d._id)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {expandedId === d._id && (
                    <div className="mt-3 pt-3 border-t border-gray-100 grid sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs">Category</p>
                        <p className="text-gray-700 font-medium capitalize">{d.foodCategory}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Quantity</p>
                        <p className="text-gray-700 font-medium">{d.quantity} ({d.quantityKg} kg)</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Serves</p>
                        <p className="text-gray-700 font-medium">{d.servesPeople} people</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Condition</p>
                        <p className="text-gray-700 font-medium capitalize">{(d.condition || "fresh").replace(/_/g, " ")}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Contact</p>
                        <p className="text-gray-700 font-medium">{d.contactPhone || "+91 98765 01000"}</p>
                      </div>
                      <div className="flex justify-end">
                        {canCancel(d.status) && (
                          <Button variant="outline" size="sm" onClick={() => handleCancel(d._id || d.id)} className="text-red-600 border-red-200 hover:bg-red-50">
                            <XCircle className="h-3.5 w-3.5 mr-1" /> Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

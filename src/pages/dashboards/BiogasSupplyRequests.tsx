import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, EmptyState } from "@/components/dashboard/SharedComponents";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Package, MapPin, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { SEED_SUPPLY_REQUESTS } from "@/lib/mock-data";
import { useState } from "react";

export default function BiogasSupplyRequests() {
  const { user } = useAuth();
  const partner = useQuery(api.mutations.biogas.getByUserId, user?._id ? { userId: user._id } : "skip");
  const querySupplies = useQuery(api.mutations.biogas.listAvailableSupplies);
  const updateSupplyStatus = useMutation(api.mutations.biogas.updateSupplyStatus);

  const fallbackSupplies = SEED_SUPPLY_REQUESTS.map((s) => ({
    _id: s._id,
    source: s.source,
    category: s.category,
    quantityKg: s.quantity,
    pickup: s.pickup,
    pickupDate: s.pickupDate,
    supplyStatus: s.status === "pending" ? "available" : s.status,
    notes: s.notes,
  }));

  const [localSupplies, setLocalSupplies] = useState<any[]>(fallbackSupplies);
  const suppliesList = (querySupplies && querySupplies.length > 0) ? querySupplies : localSupplies;

  const handleAccept = async (supplyId: string) => {
    setLocalSupplies((prev) =>
      prev.map((s) => (s._id === supplyId ? { ...s, supplyStatus: "accepted" } : s))
    );
    try {
      await updateSupplyStatus({ supplyId: supplyId as never, status: "accepted" });
    } catch {
      // offline fallback
    }
    toast.success("Supply request accepted! Scheduled for digestion processing.");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2"><Package className="h-6 w-6 text-purple-500" /> Supply Requests</h1>
        <p className="text-sm text-gray-500 mt-1">Available food-waste supply requests from the FoodFlow network.</p>
      </div>
      {suppliesList.length === 0 ? (
        <Card className="border-gray-200 shadow-sm"><CardContent><EmptyState icon={Package} title="No available supplies" description="New food-waste supply requests will appear here." /></CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliesList.map((s) => {
            const isAccepted = s.supplyStatus === "accepted" || s.supplyStatus === "processing" || s.supplyStatus === "completed";
            return (
              <Card key={s._id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-bold text-gray-900 capitalize">{s.category}</h3>
                    <StatusBadge status={s.supplyStatus} />
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p className="font-semibold text-gray-800">{s.source || "Commercial Partner"}</p>
                    <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-500" /> {s.pickup || "Metro Distribution Center"}</p>
                    <p className="flex items-center gap-1.5 font-bold text-purple-700">{s.quantityKg} kg organic biomass</p>
                    {s.pickupDate && <p className="flex items-center gap-1.5 text-xs text-gray-400"><Clock className="h-3.5 w-3.5" /> Scheduled: {s.pickupDate}</p>}
                  </div>
                  {s.notes && <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded-lg">{s.notes}</p>}
                  <Button
                    onClick={() => handleAccept(s._id)}
                    disabled={isAccepted}
                    className={`w-full mt-4 ${isAccepted ? "bg-gray-100 text-gray-500" : "bg-purple-600 hover:bg-purple-700 text-white"}`}
                  >
                    {isAccepted ? <><CheckCircle2 className="mr-1.5 h-4 w-4 text-emerald-600" /> Accepted</> : "Accept Supply"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

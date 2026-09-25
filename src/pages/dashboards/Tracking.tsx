import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/SharedComponents";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MapPin, Package, Truck, CheckCircle2, Clock, Circle } from "lucide-react";
import { motion } from "framer-motion";
import { SEED_DONATIONS } from "@/lib/mock-data";

const statusSteps = [
  { key: "pending", label: "Donation Created", icon: Package },
  { key: "accepted", label: "Agent Assigned", icon: CheckCircle2 },
  { key: "on_the_way", label: "En Route to Pickup", icon: Truck },
  { key: "picked_up", label: "Food Collected", icon: MapPin },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
  { key: "completed", label: "Completed", icon: CheckCircle2 },
];

const statusOrder = ["pending", "accepted", "on_the_way", "picked_up", "delivered", "completed"];

function getStepIndex(status: string) {
  const index = statusOrder.indexOf(status);
  return index >= 0 ? index : 1;
}

export default function Tracking() {
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
  const activeDonations = donations?.filter((d: any) => d.status !== "cancelled") || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <MapPin className="h-6 w-6 text-emerald-600" />
          Donation Tracking
        </h1>
        <p className="text-sm text-gray-500 mt-1">Follow the journey of every donation from creation to completion.</p>
      </div>

      {activeDonations.length === 0 ? (
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="py-16 text-center">
            <MapPin className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No active donations to track.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {activeDonations.sort((a, b) => b.createdAt - a.createdAt).map((d) => {
            const currentStep = getStepIndex(d.status);
            return (
              <Card key={d._id} className="border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-gray-900">{d.foodName}</CardTitle>
                    <p className="text-xs text-gray-500 mt-0.5">{d.quantity} · {d.pickupAddress}</p>
                  </div>
                  <StatusBadge status={d.status} />
                </CardHeader>
                <CardContent>
                  {/* Simulated map */}
                  <div className="rounded-xl bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 border border-gray-200 p-6 mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold mb-1">A</div>
                        <span>Pickup</span>
                      </div>
                      <div className="flex-1 h-1 mx-3 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 rounded-full relative">
                        <div
                          className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-emerald-600 border-2 border-white shadow-md transition-all"
                          style={{ left: `${Math.min((currentStep / 5) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold mb-1">B</div>
                        <span>Delivery</span>
                      </div>
                    </div>
                  </div>

                  {/* Status timeline */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1">
                    {statusSteps.map((step, i) => {
                      const isCompleted = i <= currentStep;
                      const isCurrent = i === currentStep;
                      return (
                        <div key={step.key} className="flex items-center shrink-0">
                          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            isCurrent ? "bg-emerald-100 text-emerald-700 border border-emerald-300" :
                            isCompleted ? "bg-emerald-50 text-emerald-600" :
                            "bg-gray-50 text-gray-400"
                          }`}>
                            {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                            <span className="hidden sm:inline">{step.label}</span>
                          </div>
                          {i < statusSteps.length - 1 && <div className={`w-4 h-0.5 mx-0.5 ${i < currentStep ? "bg-emerald-300" : "bg-gray-200"}`} />}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, EmptyState } from "@/components/dashboard/SharedComponents";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Truck, MapPin, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { SEED_DONATIONS } from "@/lib/mock-data";
import { useState } from "react";

const nextStatus: Record<string, string> = {
  accepted: "on_the_way",
  on_the_way: "picked_up",
  picked_up: "delivered",
};

const nextStatusLabel: Record<string, string> = {
  accepted: "Start Pickup",
  on_the_way: "Mark Picked Up",
  picked_up: "Mark Delivered",
};

export default function EmployeeAssignments() {
  const { user } = useAuth();
  const employee = useQuery(api.mutations.employees.getByUserId, user?._id ? { userId: user._id } : "skip");
  const queryAssigned = employee ? useQuery(api.mutations.donations.listByEmployee, { employeeId: employee._id }) : undefined;
  const updateStatus = useMutation(api.mutations.donations.updateStatus);

  const fallbackAssigned = SEED_DONATIONS.filter((d) => ["accepted", "on_the_way", "picked_up"].includes(d.status));
  const [localAssignments, setLocalAssignments] = useState<any[]>(fallbackAssigned);

  const assigned = (queryAssigned && queryAssigned.length > 0) ? queryAssigned : localAssignments;

  const handleAdvance = async (donationId: string, currentStatus: string) => {
    const next = nextStatus[currentStatus];
    if (!next) return;
    setLocalAssignments((prev) =>
      prev.map((d) => (d._id === donationId || d.id === donationId ? { ...d, status: next } : d))
    );

    try {
      const rawJobs = localStorage.getItem("foodflow_employee_jobs");
      if (rawJobs) {
        const jobs = JSON.parse(rawJobs);
        const updatedJobs = jobs.map((j: any) =>
          (j.id === donationId || j._id === donationId) ? { ...j, status: next } : j
        );
        localStorage.setItem("foodflow_employee_jobs", JSON.stringify(updatedJobs));
        window.dispatchEvent(new Event("foodflow-jobs-changed"));
      }
    } catch {
      // ignore
    }

    try {
      const rawAll = localStorage.getItem("foodflow_all_donations");
      if (rawAll) {
        const parsed = JSON.parse(rawAll);
        const updated = parsed.map((d: any) =>
          (d._id === donationId || d.id === donationId) ? { ...d, status: next } : d
        );
        localStorage.setItem("foodflow_all_donations", JSON.stringify(updated));
        window.dispatchEvent(new Event("foodflow-donations-changed"));
      }
    } catch {
      // ignore
    }

    try {
      await updateStatus({ donationId: donationId as never, status: next as never, note: `Status updated to ${next.replace(/_/g, " ")}` });
    } catch {
      // offline fallback
    }
    toast.success(`Donation marked as ${next.replace(/_/g, " ")}.`);
  };

  const active = assigned?.filter((d: any) => ["accepted", "on_the_way", "picked_up"].includes(d.status)) || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Truck className="h-6 w-6 text-blue-500" />
          My Assignments
        </h1>
        <p className="text-sm text-gray-500 mt-1">Active donations assigned to you. Update statuses as you progress.</p>
      </div>
      {active.length === 0 ? (
        <Card className="border-gray-200 shadow-sm"><CardContent><EmptyState icon={Truck} title="No active assignments" description="Accept a request from the Available Requests page to get started." /></CardContent></Card>
      ) : (
        <div className="space-y-4">
          {active.map((d) => (
            <Card key={d._id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{d.foodName}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin className="h-3.5 w-3.5" /> {d.pickupAddress}</p>
                    <p className="text-sm text-gray-500">{d.quantity} · {d.quantityKg} kg</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={d.status} />
                    {nextStatus[d.status] && (
                      <Button size="sm" onClick={() => handleAdvance(d._id, d.status)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        {nextStatusLabel[d.status]} <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}

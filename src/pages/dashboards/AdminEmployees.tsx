import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge, EmptyState } from "@/components/dashboard/SharedComponents";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserCheck, Star, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SEED_EMPLOYEES } from "@/lib/mock-data";
import { useState } from "react";

const FALLBACK_EMPLOYEES = SEED_EMPLOYEES.map((e) => ({
  _id: e._id,
  employeeId: `EMP-${e._id.toUpperCase()}`,
  userId: e._id,
  name: e.name,
  vehicleType: e.vehicle,
  zone: e.region,
  rating: e.rating,
  totalDeliveries: e.completedJobs,
  status: e.status,
}));

export default function AdminEmployees() {
  const queryEmployees = useQuery(api.mutations.employees.list);
  const allUsers = useQuery(api.mutations.users.getAllUsers);
  const updateStatus = useMutation(api.mutations.employees.updateStatus);
  const [localList, setLocalList] = useState<any[]>(FALLBACK_EMPLOYEES);

  const employees = (queryEmployees && queryEmployees.length > 0) ? queryEmployees : localList;

  const getUserName = (userId: string, empName?: string) => {
    if (empName) return empName;
    return allUsers?.find((u) => u._id === userId)?.name || "Alex Morgan";
  };

  const handleToggleStatus = (empId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "on_break" : "active";
    setLocalList((prev) =>
      prev.map((e) => (e._id === empId ? { ...e, status: nextStatus } : e))
    );
    toast.success(`Employee status updated to ${nextStatus}.`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2"><UserCheck className="h-6 w-6 text-blue-500" /> Employee Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage collection agents, their status, and performance.</p>
      </div>
      {!employees || employees.length === 0 ? (
        <Card className="border-gray-200 shadow-sm"><CardContent><EmptyState icon={UserCheck} title="No employees" description="Registered employees will appear here." /></CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp) => (
            <Card key={emp._id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-lg">{getUserName(emp.userId).charAt(0)}</div>
                  <div>
                    <p className="text-base font-bold text-gray-900">{getUserName(emp.userId)}</p>
                    <p className="text-xs text-gray-500">{emp.employeeId}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-3">
                  <p className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-blue-500" /> {emp.vehicleType || "N/A"} · Zone: {emp.zone || "N/A"}</p>
                  <p className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-500" /> {emp.rating.toFixed(1)} rating · {emp.totalDeliveries} deliveries</p>
                </div>
                <div className="flex items-center justify-between">
                  <StatusBadge status={emp.status || "active"} />
                  {emp.status !== "active" ? (
                    <Button size="sm" variant="outline" onClick={async () => { await updateStatus({ employeeId: emp._id, status: "active" }); toast.success("Employee activated."); }} className="text-emerald-600 border-emerald-200">Activate</Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={async () => { await updateStatus({ employeeId: emp._id, status: "inactive" }); toast.success("Employee deactivated."); }} className="text-red-600 border-red-200">Deactivate</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}

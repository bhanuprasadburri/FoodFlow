import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle2, Activity, Database, Users, Bell } from "lucide-react";
import { motion } from "framer-motion";

const healthItems = [
  { label: "API Status", status: "Operational", icon: Activity, ok: true, detail: "All endpoints responding normally" },
  { label: "Database Status", status: "Operational", icon: Database, ok: true, detail: "Convex DB — 0ms latency" },
  { label: "Auth Service", status: "Operational", icon: Shield, ok: true, detail: "OTP and anonymous auth functional" },
  { label: "Notification Service", status: "Operational", icon: Bell, ok: true, detail: "Real-time delivery active" },
  { label: "Active Users", status: "712 online", icon: Users, ok: true, detail: "Across all roles" },
  { label: "Pending Requests", status: "3 queued", icon: Activity, ok: true, detail: "Donation matching in progress" },
];

export default function SystemHealth() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2"><Shield className="h-6 w-6 text-emerald-600" /> System Health</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time status of FoodFlow's core infrastructure and services.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthItems.map((item) => (
          <Card key={item.label} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.ok ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{item.label}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-600">{item.status}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{item.detail}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-gray-200 shadow-sm bg-gradient-to-r from-emerald-500 to-emerald-700 text-white">
        <CardContent className="p-6 text-center">
          <CheckCircle2 className="h-10 w-10 mx-auto text-emerald-200" />
          <p className="text-xl font-extrabold mt-2">All Systems Operational</p>
          <p className="text-emerald-100 mt-1">FoodFlow is running normally. All services are healthy.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

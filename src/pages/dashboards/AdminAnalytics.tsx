import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/SharedComponents";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BarChart3, TrendingUp, Users, UtensilsCrossed, Building2, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const growthData = [
  { month: "Jan", users: 120, businesses: 15 },
  { month: "Feb", users: 180, businesses: 22 },
  { month: "Mar", users: 260, businesses: 35 },
  { month: "Apr", users: 380, businesses: 48 },
  { month: "May", users: 520, businesses: 65 },
  { month: "Jun", users: 710, businesses: 89 },
];

const foodCollectedData = [
  { month: "Jan", kg: 85 }, { month: "Feb", kg: 120 }, { month: "Mar", kg: 165 },
  { month: "Apr", kg: 210 }, { month: "May", kg: 280 }, { month: "Jun", kg: 340 },
];

const categoryData = [
  { name: "Cooked", value: 45, color: "#059669" },
  { name: "Bakery", value: 20, color: "#f59e0b" },
  { name: "Produce", value: 18, color: "#3b82f6" },
  { name: "Packaged", value: 12, color: "#8b5cf6" },
  { name: "Other", value: 5, color: "#6b7280" },
];

export default function AdminAnalytics() {
  const stats = useQuery(api.mutations.donations.getStats);
  const allUsers = useQuery(api.mutations.users.getAllUsers);
  const employees = useQuery(api.mutations.employees.list);
  const businesses = useQuery(api.mutations.businesses.list);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2"><BarChart3 className="h-6 w-6 text-emerald-600" /> Platform Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Comprehensive insights into FoodFlow's platform performance and growth.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Donations" value={stats?.total ?? 32} icon={UtensilsCrossed} color="emerald" trend={{ value: "+23%", positive: true }} />
        <StatCard title="Food Collected" value={`${stats?.totalKg ?? 154} kg`} icon={Leaf} color="emerald" />
        <StatCard title="Active Users" value={allUsers?.length || 18} icon={Users} color="blue" />
        <StatCard title="Businesses" value={businesses?.length || 5} icon={Building2} color="amber" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-base font-bold text-gray-900">Platform Growth</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#059669" strokeWidth={2} name="Users" />
                <Line type="monotone" dataKey="businesses" stroke="#f59e0b" strokeWidth={2} name="Businesses" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-base font-bold text-gray-900">Food Collected (kg)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={foodCollectedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="kg" fill="#059669" radius={[6, 6, 0, 0]} name="Kilograms" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-base font-bold text-gray-900">Donation Categories</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} innerRadius={40} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-base font-bold text-gray-900">Employee Performance</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(employees || []).slice(0, 4).map((emp) => {
                const pct = Math.min((emp.totalDeliveries / 50) * 100, 100);
                return (
                  <div key={emp._id}>
                    <div className="flex justify-between text-sm mb-1"><span className="font-medium text-gray-700">{emp.employeeId}</span><span className="text-gray-500">{emp.totalDeliveries} deliveries · {emp.rating.toFixed(1)}★</span></div>
                    <div className="h-2 rounded-full bg-gray-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

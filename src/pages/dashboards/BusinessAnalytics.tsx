import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/SharedComponents";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { BarChart3, TrendingUp, Users, UtensilsCrossed, Star, Target } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const monthlyData = [
  { month: "Jan", donations: 8, kg: 45 },
  { month: "Feb", donations: 12, kg: 68 },
  { month: "Mar", donations: 15, kg: 82 },
  { month: "Apr", donations: 18, kg: 95 },
  { month: "May", donations: 22, kg: 120 },
  { month: "Jun", donations: 28, kg: 155 },
];

const categoryData = [
  { name: "Cooked", value: 45, color: "#059669" },
  { name: "Bakery", value: 20, color: "#f59e0b" },
  { name: "Produce", value: 18, color: "#3b82f6" },
  { name: "Packaged", value: 12, color: "#8b5cf6" },
  { name: "Other", value: 5, color: "#6b7280" },
];

export default function BusinessAnalytics() {
  const { user } = useAuth();
  const business = useQuery(api.mutations.businesses.getByUserId, user?._id ? { userId: user._id } : "skip");
  const stats = useQuery(api.mutations.businesses.getStats, business?._id ? { businessId: business._id } : "skip");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-emerald-600" />
          Business Analytics
        </h1>
        <p className="text-sm text-gray-500 mt-1">Insights into your donation activity and sustainability impact.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Food Donated" value={`${stats?.totalQuantityKg ?? 680} kg`} icon={UtensilsCrossed} color="emerald" />
        <StatCard title="People Served" value={stats?.totalPeopleServed ?? 2720} icon={Users} color="orange" />
        <StatCard title="Success Rate" value={`${stats?.successRate ?? 96}%`} icon={Target} color="blue" />
        <StatCard title="Impact Score" value={stats?.impactScore ?? 88} icon={Star} color="amber" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-base font-bold text-gray-900">Monthly Donations</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="donations" fill="#059669" radius={[6, 6, 0, 0]} name="Donations" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-base font-bold text-gray-900">By Food Category</CardTitle></CardHeader>
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
      </div>
      <Card className="border-gray-200 shadow-sm bg-gradient-to-r from-emerald-500 to-emerald-700 text-white">
        <CardContent className="p-6 text-center">
          <TrendingUp className="h-8 w-8 mx-auto text-emerald-200" />
          <p className="text-3xl font-extrabold mt-2">{stats?.totalQuantityKg ?? 0} kg</p>
          <p className="text-emerald-100 mt-1">Total food rescued from waste this period</p>
          <p className="text-sm text-emerald-200 mt-2">Your verified donations contribute to a calculated impact score — not automatic reputation claims.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

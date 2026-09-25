import { BarChart3, Package, TrendingUp, Leaf, Zap, Droplets } from "lucide-react";

const monthlyData = [
  { month: "Apr", collected: 320, processed: 310, energy: 45 },
  { month: "May", collected: 380, processed: 365, energy: 52 },
  { month: "Jun", collected: 410, processed: 400, energy: 58 },
  { month: "Jul", collected: 450, processed: 435, energy: 63 },
  { month: "Aug", collected: 490, processed: 470, energy: 68 },
  { month: "Sep", collected: 380, processed: 290, energy: 42 },
];

const categoryBreakdown = [
  { category: "Cooked Food", kg: 680, percentage: 34, color: "bg-emerald-500" },
  { category: "Produce Scraps", kg: 420, percentage: 21, color: "bg-green-500" },
  { category: "Bakery Waste", kg: 350, percentage: 17.5, color: "bg-amber-500" },
  { category: "Dairy Products", kg: 280, percentage: 14, color: "bg-blue-500" },
  { category: "Raw Ingredients", kg: 170, percentage: 8.5, color: "bg-purple-500" },
  { category: "Other", kg: 100, percentage: 5, color: "bg-gray-400" },
];

export default function BiogasAnalytics() {
  const maxCollected = Math.max(...monthlyData.map((d) => d.collected));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Supply Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Track food-waste collection, processing, and energy output.</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Collected", value: "2,430 kg", sub: "Since onboarding", icon: Package, color: "bg-emerald-50 text-emerald-600" },
          { label: "Processed", value: "2,270 kg", sub: "93.4% processing rate", icon: Leaf, color: "bg-green-50 text-green-600" },
          { label: "Energy Generated", value: "328 kWh", sub: "Biogas conversion", icon: Zap, color: "bg-amber-50 text-amber-600" },
          { label: "CO₂ Offset", value: "1.8 tonnes", sub: "Environmental impact", icon: Droplets, color: "bg-blue-50 text-blue-600" },
        ].map((card) => (
          <div key={card.label} className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-xl font-extrabold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-400">{card.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly bar chart */}
      <div className="rounded-xl bg-white border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Monthly Collection & Processing</h2>
            <p className="text-sm text-gray-500">Kilograms of food waste collected and processed per month.</p>
          </div>
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          {monthlyData.map((d) => (
            <div key={d.month} className="flex items-center gap-4">
              <span className="w-10 text-sm font-medium text-gray-500 text-right">{d.month}</span>
              <div className="flex-1 flex gap-1.5">
                <div className="relative h-8 rounded-lg bg-emerald-100 overflow-hidden" style={{ width: `${(d.collected / maxCollected) * 100}%` }}>
                  <div className="absolute inset-y-0 left-0 rounded-lg bg-emerald-500" style={{ width: `${(d.processed / d.collected) * 100}%` }} />
                </div>
              </div>
              <div className="w-28 text-right">
                <span className="text-sm font-bold text-gray-900">{d.collected}</span>
                <span className="text-xs text-gray-400 ml-1">kg</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-6 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-100 inline-block" />Collected</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-500 inline-block" />Processed</span>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="rounded-xl bg-white border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Waste by Category</h2>
        <p className="text-sm text-gray-500 mb-6">Breakdown of collected food waste by type.</p>
        <div className="space-y-4">
          {categoryBreakdown.map((cat) => (
            <div key={cat.category}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                <span className="text-sm font-bold text-gray-900">{cat.kg} kg <span className="font-normal text-gray-400">({cat.percentage}%)</span></span>
              </div>
              <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Efficiency summary */}
      <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="h-6 w-6 text-emerald-200" />
          <h2 className="text-lg font-bold">Processing Efficiency</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-3xl font-extrabold">93.4%</p>
            <p className="text-sm text-emerald-100 mt-1">Overall processing rate — food waste successfully converted.</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold">6.8 kWh</p>
            <p className="text-sm text-emerald-100 mt-1">Average energy yield per 50 kg of processed waste.</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold">740 kg</p>
            <p className="text-sm text-emerald-100 mt-1">Monthly average collection across all active supply agreements.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { CalendarClock, MapPin, Clock, CheckCircle2, AlertCircle, Truck } from "lucide-react";

interface ScheduleEntry {
  id: string;
  donorBusiness: string;
  address: string;
  quantity: string;
  category: string;
  scheduledDate: string;
  timeSlot: string;
  status: "upcoming" | "in_progress" | "completed" | "missed";
  notes?: string;
}

const mockSchedule: ScheduleEntry[] = [
  {
    id: "SCH-001",
    donorBusiness: "Grand Hotel Kitchen",
    address: "123 Main St, Loading Dock B",
    quantity: "45 kg",
    category: "Mixed Cooked Food",
    scheduledDate: "2026-09-08",
    timeSlot: "9:00 AM – 11:00 AM",
    status: "upcoming",
    notes: "Contact loading dock manager on arrival",
  },
  {
    id: "SCH-002",
    donorBusiness: "Pizza Paradise",
    address: "456 Oak Ave, Back Entrance",
    quantity: "30 kg",
    category: "Bakery & Dough Waste",
    scheduledDate: "2026-09-08",
    timeSlot: "2:00 PM – 4:00 PM",
    status: "upcoming",
  },
  {
    id: "SCH-003",
    donorBusiness: "Green Leaf Restaurant",
    address: "789 Elm Blvd",
    quantity: "25 kg",
    category: "Produce Scraps",
    scheduledDate: "2026-09-07",
    timeSlot: "10:00 AM – 12:00 PM",
    status: "completed",
  },
  {
    id: "SCH-004",
    donorBusiness: "City Bakery Co.",
    address: "55 Baker St",
    quantity: "18 kg",
    category: "Expired Bread & Pastries",
    scheduledDate: "2026-09-09",
    timeSlot: "8:00 AM – 10:00 AM",
    status: "upcoming",
    notes: "Large quantity — bring extra containers",
  },
  {
    id: "SCH-005",
    donorBusiness: "Sunset Catering Services",
    address: "200 Harbor Dr, Suite 3",
    quantity: "52 kg",
    category: "Mixed Prepared Food",
    scheduledDate: "2026-09-06",
    timeSlot: "3:00 PM – 5:00 PM",
    status: "in_progress",
    notes: "Event leftovers from corporate gala",
  },
  {
    id: "SCH-006",
    donorBusiness: "Fresh Mart Grocery",
    address: "88 Market Ln",
    quantity: "35 kg",
    category: "Expired Dairy & Produce",
    scheduledDate: "2026-09-05",
    timeSlot: "11:00 AM – 1:00 PM",
    status: "completed",
  },
];

const statusConfig = {
  upcoming: { label: "Upcoming", color: "bg-blue-100 text-blue-700", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-amber-100 text-amber-700", icon: Truck },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  missed: { label: "Missed", color: "bg-red-100 text-red-700", icon: AlertCircle },
};

export default function BiogasSchedule() {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? mockSchedule : mockSchedule.filter((s) => s.status === filter);

  const upcomingCount = mockSchedule.filter((s) => s.status === "upcoming").length;
  const inProgressCount = mockSchedule.filter((s) => s.status === "in_progress").length;
  const completedCount = mockSchedule.filter((s) => s.status === "completed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pickup Schedule</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your upcoming and completed waste-collection pickups.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Upcoming Pickups", value: upcomingCount, color: "text-blue-600" },
          { label: "In Progress", value: inProgressCount, color: "text-amber-600" },
          { label: "Completed This Week", value: completedCount, color: "text-emerald-600" },
        ].map((card) => (
          <div key={card.label} className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className={`text-3xl font-extrabold mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "upcoming", "in_progress", "completed", "missed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-emerald-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f === "all" ? "All" : f === "in_progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Schedule list */}
      <div className="space-y-4">
        {filtered.map((entry) => {
          const cfg = statusConfig[entry.status];
          const Icon = cfg.icon;
          return (
            <div key={entry.id} className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                    <CalendarClock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{entry.donorBusiness}</h3>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.color}`}>
                        <Icon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{entry.address}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{entry.scheduledDate} · {entry.timeSlot}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:text-right">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{entry.quantity}</p>
                    <p className="text-xs text-gray-500">{entry.category}</p>
                  </div>
                  {entry.status === "upcoming" && (
                    <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
              {entry.notes && (
                <div className="mt-3 ml-15 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-700">
                  📋 {entry.notes}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-xl bg-white border border-gray-100 p-12 text-center">
            <CalendarClock className="h-10 w-10 text-gray-300 mx-auto" />
            <p className="mt-3 text-sm font-medium text-gray-500">No schedule entries match this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

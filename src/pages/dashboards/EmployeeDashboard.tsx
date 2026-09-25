import { motion } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import {
  EmptyState,
  StatusBadge,
  getFoodImage,
} from "@/components/dashboard/SharedComponents";
import { Link } from "react-router";
import { getIndiaGreeting } from "@/lib/time";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Bell,
  Bike,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Cloud,
  Compass,
  Flag,
  Gauge,
  HeartHandshake,
  Leaf,
  MapPin,
  Navigation,
  Package,
  Phone,
  Route,
  Search,
  Sparkles,
  Star,
  Target,
  Timer,
  TrendingUp,
  Truck,
  Users,
  X,
} from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };
const statusSteps = [
  { key: "accepted", label: "Accepted" },
  { key: "on_the_way", label: "Travelling to donor" },
  { key: "picked_up", label: "Food picked up" },
  { key: "delivered", label: "Delivered" },
];
const nextStatus: Record<string, string> = {
  accepted: "on_the_way",
  on_the_way: "picked_up",
  picked_up: "delivered",
};
const nextStatusLabel: Record<string, string> = {
  accepted: "Start pickup",
  on_the_way: "Confirm pickup",
  picked_up: "Complete delivery",
};

function priorityFor(donation: {
  expiryDate: string;
  quantityKg: number;
  condition: string;
}) {
  const hours = (new Date(donation.expiryDate).getTime() - Date.now()) / 36e5;
  if (hours < 8 || donation.condition === "edible")
    return {
      label: "High priority",
      color: "bg-[#FFF0EB] text-[#C65A35] border-[#F3C4B3]",
    };
  if (hours < 24 || donation.quantityKg >= 10)
    return {
      label: "Medium priority",
      color: "bg-[#FFF7DF] text-[#A6751A] border-[#EBD79B]",
    };
  return {
    label: "Normal",
    color: "bg-[#EAF7F1] text-[#087C70] border-[#BFE3D0]",
  };
}

function metric(value: number, suffix = "") {
  return (
    <motion.span initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }}>
      {value.toLocaleString()}
      {suffix}
    </motion.span>
  );
}

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const employee = useQuery(
    api.mutations.employees.getByUserId,
    user?._id ? { userId: user._id } : "skip",
  );
  const allDonations = useQuery(api.mutations.donations.list) || [];
  const available = useQuery(api.mutations.donations.listAvailable) || [];
  const assignEmployee = useMutation(api.mutations.donations.assignEmployee);
  const updateStatus = useMutation(api.mutations.donations.updateStatus);
  const [isOnline, setIsOnline] = useState(true);
  const [sortBy, setSortBy] = useState("priority");
  const [activeTab, setActiveTab] = useState("queue");

  const assigned = useMemo(
    () =>
      allDonations.filter(
        (donation) => donation.assignedEmployeeId === employee?._id,
      ),
    [allDonations, employee?._id],
  );
  const active = assigned.filter((donation) =>
    ["accepted", "on_the_way", "picked_up"].includes(donation.status),
  );
  const completed = assigned.filter(
    (donation) =>
      donation.status === "completed" || donation.status === "delivered",
  );
  const collectedKg = completed.reduce(
    (sum, donation) => sum + donation.quantityKg,
    0,
  );
  const peopleSupported = completed.reduce(
    (sum, donation) => sum + donation.servesPeople,
    0,
  );
  const sortedRequests = [...available].sort((a, b) => {
    if (sortBy === "quantity") return b.quantityKg - a.quantityKg;
    if (sortBy === "pickup")
      return (
        new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
      );
    return priorityFor(a).label.localeCompare(priorityFor(b).label);
  });
  const activeDelivery = active[0];
  const performanceScore = Math.min(
    100,
    Math.round(completed.length * 12 + (employee?.rating || 5) * 8),
  );

  const acceptRequest = async (id: string) => {
    if (!employee) return;
    try {
      await assignEmployee({
        donationId: id as never,
        employeeId: employee._id,
      });
      toast.success("Pickup accepted. Route added to your queue.");
    } catch {
      toast.error("This request could not be accepted.");
    }
  };

  const advanceStatus = async () => {
    if (!activeDelivery || !nextStatus[activeDelivery.status]) return;
    const status = nextStatus[activeDelivery.status];
    try {
      await updateStatus({
        donationId: activeDelivery._id,
        status: status as never,
        note: `Employee updated status to ${status.replace(/_/g, " ")}`,
      });
      toast.success(`Marked as ${status.replace(/_/g, " ")}.`);
    } catch {
      toast.error("Status update failed.");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="mx-auto max-w-[1500px] space-y-7"
    >
      <motion.section
        variants={fadeUp}
        className="relative overflow-hidden rounded-[28px] bg-[#174A57] px-6 py-7 text-white shadow-[0_18px_50px_rgba(23,74,87,0.16)] sm:px-9 sm:py-8"
      >
        <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full border-[34px] border-white/10" />
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-8">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#B9E5D1]">
              <Truck className="h-4 w-4" /> Field operations
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {getIndiaGreeting()}, {user?.name?.split(" ")[0] || "Agent"}.
            </h1>
            <p className="mt-3 text-sm text-[#D0E9E0] sm:text-base">
              Ready to rescue surplus food today?
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/dashboard/requests"
                className="inline-flex items-center gap-2 rounded-xl bg-[#F6C85F] px-4 py-3 text-sm font-extrabold text-[#173B38] hover:-translate-y-0.5"
              >
                <Package className="h-4 w-4" /> View new requests
              </Link>
              <Link
                to="/dashboard/assignments"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/20"
              >
                <Navigation className="h-4 w-4" /> Open route
              </Link>
            </div>
          </div>
          <div className="min-w-[210px] rounded-2xl border border-white/15 bg-white/10 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#D0E9E0]">
                Field availability
              </span>
              <button
                type="button"
                onClick={() => setIsOnline((online) => !online)}
                className={`relative h-6 w-11 rounded-full transition-colors ${isOnline ? "bg-[#8ED3A9]" : "bg-white/25"}`}
                aria-label="Toggle field availability"
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${isOnline ? "left-6" : "left-1"}`}
                />
              </button>
            </div>
            <p className="mt-4 text-lg font-extrabold">
              {isOnline ? "Online and ready" : "Offline"}
            </p>
            <p className="mt-1 text-xs text-[#B9D8D0]">
              {isOnline
                ? "You can receive nearby requests"
                : "New requests are paused"}
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={fadeUp}
        className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6"
      >
        {([
          [
            "New requests",
            available.length,
            Package,
            "bg-[#FFF7DF] text-[#A6751A]",
          ],
          [
            "Assigned pickups",
            active.length,
            Truck,
            "bg-[#EAF0FA] text-[#3569A8]",
          ],
          [
            "Pickups today",
            active.length,
            MapPin,
            "bg-[#EAF7F1] text-[#087C70]",
          ],
          [
            "Completed",
            completed.length,
            CheckCircle2,
            "bg-[#EAF7F1] text-[#087C70]",
          ],
          ["Food collected", collectedKg, Cloud, "bg-[#EEF0FC] text-[#635BBD]"],
          [
            "People supported",
            peopleSupported,
            Users,
            "bg-[#FFF0EB] text-[#C65A35]",
          ],
        ] as [string, number | string, React.ComponentType<{ className?: string }>, string][]).map(([label, value, Icon, tint]) => (
          <div
            key={String(label)}
            className="rounded-2xl border border-[#E6EAE4] bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${tint}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <TrendingUp className="h-4 w-4 text-[#68B890]" />
            </div>
            <p className="mt-5 text-2xl font-extrabold text-[#173B38]">
              {metric(Number(value), label === "Food collected" ? " kg" : "")}
            </p>
            <p className="mt-1 text-xs font-medium text-[#71817C]">{label}</p>
          </div>
        ))}
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <motion.section
          variants={fadeUp}
          className="rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00877F]">
                Live operations
              </p>
              <h2 className="mt-1 text-xl font-extrabold text-[#173B38]">
                Pickup command map
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#71817C]">
              <span className="h-2 w-2 rounded-full bg-[#3BB273]" /> Simulated
              live route
            </div>
          </div>
          <div className="relative mt-5 h-64 overflow-hidden rounded-2xl border border-[#DDE8E1] bg-[#EAF3EC]">
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "linear-gradient(#c8ddd0 1px, transparent 1px), linear-gradient(90deg, #c8ddd0 1px, transparent 1px)",
                backgroundSize: "42px 42px",
              }}
            />
            <div className="absolute left-[17%] top-[66%] h-3 w-3 rounded-full bg-[#174A57] ring-4 ring-white/80" />
            <div className="absolute left-[48%] top-[30%] h-3 w-3 animate-pulse rounded-full bg-[#D97728] ring-4 ring-white/80" />
            <div className="absolute left-[76%] top-[60%] h-3 w-3 rounded-full bg-[#0B8B7F] ring-4 ring-white/80" />
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M17 66 C30 62 35 38 48 30 S66 47 76 60"
                fill="none"
                stroke="#0B8B7F"
                strokeDasharray="3 2"
                strokeWidth="0.8"
              />
              <circle cx="49" cy="31" r="1.7" fill="#F6C85F">
                <animate
                  attributeName="cx"
                  values="17;48;76;17"
                  dur="7s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values="66;30;60;66"
                  dur="7s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
            <div className="absolute bottom-4 left-4 rounded-xl bg-white/90 px-3 py-2 text-xs shadow-sm">
              <p className="font-bold text-[#173B38]">You are here</p>
              <p className="text-[#71817C]">2 stops · 6.4 km route</p>
            </div>
            <div className="absolute right-4 top-4 rounded-xl bg-white/90 px-3 py-2 text-xs shadow-sm">
              <p className="font-bold text-[#173B38]">ETA 18 min</p>
              <p className="text-[#71817C]">Optimized route</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#71817C]">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#174A57]" /> Your
              location
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#D97728]" /> Pickup
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0B8B7F]" />{" "}
              Destination
            </span>
          </div>
        </motion.section>

        <motion.section
          variants={fadeUp}
          className="rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00877F]">
                Now moving
              </p>
              <h2 className="mt-1 text-xl font-extrabold text-[#173B38]">
                Active delivery
              </h2>
            </div>
            <Truck className="h-5 w-5 text-[#00877F]" />
          </div>
          {activeDelivery ? (
            <>
              <div className="mt-5 flex items-center gap-3">
                <img
                  src={getFoodImage(activeDelivery.foodCategory)}
                  alt=""
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#173B38]">
                    {activeDelivery.foodName}
                  </p>
                  <p className="mt-1 text-xs text-[#71817C]">
                    {activeDelivery.quantityKg} kg · #
                    {String(activeDelivery._id || (activeDelivery as any).id || "0000000").slice(-7).toUpperCase()}
                  </p>
                </div>
                <StatusBadge status={activeDelivery.status} />
              </div>
              <div className="mt-6 space-y-3">
                {statusSteps.map((step, index) => {
                  const current = statusSteps.findIndex(
                    (item) => item.key === activeDelivery.status,
                  );
                  const done = index <= current;
                  return (
                    <div key={step.key} className="flex items-center gap-3">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full ${done ? "bg-[#0B8B7F] text-white" : "bg-[#F0F4F0] text-[#A7B7AE]"}`}
                      >
                        {done ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <span className="text-[10px] font-bold">
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-xs font-semibold ${done ? "text-[#41645B]" : "text-[#9AA9A2]"}`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                disabled={!nextStatus[activeDelivery.status]}
                onClick={() => void advanceStatus()}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B8B7F] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#086E66] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {nextStatusLabel[activeDelivery.status] || "Delivery complete"}
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          ) : (
            <EmptyState
              icon={Truck}
              title="No active delivery"
              description="Accept a request to start your route."
            />
          )}
        </motion.section>
      </div>

      <motion.section
        variants={fadeUp}
        className="rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00877F]">
              Time-sensitive queue
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-[#173B38]">
              New donation requests
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="request-sort">
              Sort requests
            </label>
            <select
              id="request-sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-lg border border-[#DDE8E1] bg-white px-3 py-2 text-xs font-semibold text-[#41645B]"
            >
              <option value="priority">Smart priority</option>
              <option value="pickup">Earliest pickup</option>
              <option value="quantity">Largest quantity</option>
            </select>
            <Link
              to="/dashboard/requests"
              className="rounded-lg bg-[#F1F7F2] p-2 text-[#00877F]"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        {sortedRequests.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No new requests"
            description="You are all caught up. New food rescue requests will appear here."
          />
        ) : (
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {(sortedRequests || []).slice(0, 4).map((donation, index) => {
              const priority = priorityFor(donation);
              return (
                <motion.div
                  key={donation._id || (donation as any).id || index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-2xl border border-[#E6EAE4] p-4 transition-all hover:border-[#B9DCC8] hover:shadow-md"
                >
                  <div className="flex gap-3">
                    <img
                      src={getFoodImage(donation.foodCategory)}
                      alt=""
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="truncate text-sm font-bold text-[#173B38]">
                            {donation.foodName}
                          </p>
                          <p className="mt-1 text-xs text-[#71817C]">
                            {donation.quantityKg} kg · {donation.servesPeople}{" "}
                            servings
                          </p>
                        </div>
                        <span
                          className={`rounded-full border px-2 py-1 text-[10px] font-bold ${priority.color}`}
                        >
                          {priority.label}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-[#71817C]">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />{" "}
                          {donation.pickupAddress}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="h-3 w-3" /> Before{" "}
                          {new Date(donation.expiryDate).toLocaleTimeString(
                            [],
                            { hour: "numeric", minute: "2-digit" },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => void acceptRequest(donation._id)}
                      className="flex-1 rounded-lg bg-[#0B8B7F] px-3 py-2 text-xs font-bold text-white hover:bg-[#086E66]"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-[#DDE8E1] px-3 py-2 text-xs font-bold text-[#41645B] hover:bg-[#F5F9F5]"
                    >
                      View details
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-[#F0D7D0] p-2 text-[#C65A35] hover:bg-[#FFF5F1]"
                      aria-label="Decline request"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr_0.8fr]">
        <motion.section
          variants={fadeUp}
          className="rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00877F]">
                Route planning
              </p>
              <h2 className="mt-1 text-lg font-extrabold text-[#173B38]">
                Today&apos;s smart route
              </h2>
            </div>
            <Route className="h-5 w-5 text-[#3569A8]" />
          </div>
          <div className="mt-5 space-y-3">
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EAF0FA] text-xs font-bold text-[#3569A8]">
                1
              </div>
              <div>
                <p className="text-sm font-bold text-[#173B38]">
                  Maple Street pantry
                </p>
                <p className="text-xs text-[#71817C]">
                  6:00 PM · 2.1 km · 4 kg
                </p>
              </div>
            </div>
            <div className="ml-3 h-5 border-l border-dashed border-[#B8D0C0]" />
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EAF7F1] text-xs font-bold text-[#087C70]">
                2
              </div>
              <div>
                <p className="text-sm font-bold text-[#173B38]">
                  Community kitchen
                </p>
                <p className="text-xs text-[#71817C]">
                  6:35 PM · 4.3 km · 8 kg
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between rounded-xl bg-[#F5F9F5] px-3 py-2 text-xs">
            <span className="text-[#71817C]">Suggested sequence</span>
            <span className="font-bold text-[#087C70]">Save 12 min</span>
          </div>
        </motion.section>
        <motion.section
          variants={fadeUp}
          className="rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00877F]">
                Transparent metrics
              </p>
              <h2 className="mt-1 text-lg font-extrabold text-[#173B38]">
                Performance score
              </h2>
            </div>
            <Gauge className="h-5 w-5 text-[#D49A2A]" />
          </div>
          <div className="mt-5 flex items-center gap-5">
            <div
              className="relative flex h-24 w-24 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#0B8B7F ${performanceScore * 3.6}deg, #E5EEE7 0deg)`,
              }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-extrabold text-[#173B38]">
                {performanceScore}
              </div>
            </div>
            <div className="space-y-2 text-xs text-[#71817C]">
              <p className="flex items-center gap-2">
                <Timer className="h-3.5 w-3.5 text-[#0B8B7F]" /> Fast response:
                92%
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#0B8B7F]" />{" "}
                Completion: {completed.length ? "100%" : "-"}
              </p>
              <p className="flex items-center gap-2">
                <Star className="h-3.5 w-3.5 text-[#D49A2A]" /> Rating:{" "}
                {employee?.rating?.toFixed(1) || "5.0"}
              </p>
            </div>
          </div>
        </motion.section>
        <motion.section
          variants={fadeUp}
          className="rounded-3xl border border-[#F0D7D0] bg-[#FFF7F1] p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 text-[#C65A35]">
            <Bell className="h-4 w-4" />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em]">
              Alerts
            </p>
          </div>
          <div className="mt-5 space-y-3">
            <p className="flex gap-2 text-xs leading-5 text-[#754333]">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D97728]" />{" "}
              One high-priority request is nearing its best-before time.
            </p>
            <p className="flex gap-2 text-xs leading-5 text-[#754333]">
              <HeartHandshake className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C65A35]" />{" "}
              Check donor notes before confirming pickup.
            </p>
          </div>
          <Link
            to="/dashboard/notifications"
            className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#A64F31]"
          >
            View all alerts <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.section>
      </div>
    </motion.div>
  );
}

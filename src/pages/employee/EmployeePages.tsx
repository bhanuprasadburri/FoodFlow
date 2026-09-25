import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { RealTrackingMap } from "@/components/maps/RealTrackingMap";
import { getIndiaGreeting } from "@/lib/time";
import {
  EmptyState,
  StatusBadge,
  getFoodImage,
} from "@/components/dashboard/SharedComponents";
import {
  EmployeeJob,
  EmployeeStatus,
  useEmployeeJobs,
  useEmployeePreferences,
} from "./employeeStore";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Bell,
  Check,
  CheckCircle2,
  Clock3,
  Cloud,
  Edit3,
  HeartHandshake,
  Leaf,
  MapPin,
  Package,
  Route,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Truck,
  Upload,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const flow: EmployeeStatus[] = [
  "assigned",
  "started",
  "travelling",
  "arrived",
  "picked_up",
  "delivery_started",
  "delivered",
  "completed",
];
const labels: Record<EmployeeStatus, string> = {
  assigned: "Assigned",
  started: "Started",
  travelling: "Travelling",
  arrived: "Arrived",
  picked_up: "Pickup confirmed",
  delivery_started: "Delivery started",
  delivered: "Delivered",
  completed: "Completed",
  issue: "Issue reported",
  cancelled: "Cancelled",
};
const next: Partial<Record<EmployeeStatus, EmployeeStatus>> = {
  assigned: "started",
  started: "travelling",
  travelling: "arrived",
  arrived: "picked_up",
  picked_up: "delivery_started",
  delivery_started: "delivered",
  delivered: "completed",
};

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}
function Shell({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-[1500px] space-y-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00877F]">
            Employee operations
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-[#173B38]">
            {title}
          </h1>
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}
function Timeline({ job }: { job: EmployeeJob }) {
  const current = Math.max(0, flow.indexOf(job.status));
  return (
    <div className="space-y-3">
      {flow.map((status, index) => (
        <div key={status} className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${index <= current ? "bg-[#0B8B7F] text-white" : "bg-[#EEF4EF] text-[#9AAA9F]"}`}
          >
            {index <= current ? <Check className="h-4 w-4" /> : index + 1}
          </div>
          <span
            className={`text-sm font-semibold ${index <= current ? "text-[#41645B]" : "text-[#9AAA9F]"}`}
          >
            {labels[status]}
          </span>
        </div>
      ))}
    </div>
  );
}
function Priority({ job }: { job: EmployeeJob }) {
  const color =
    job.priority === "high"
      ? "border-[#F3C4B3] bg-[#FFF0EB] text-[#C65A35]"
      : job.priority === "medium"
        ? "border-[#EBD79B] bg-[#FFF7DF] text-[#A6751A]"
        : "border-[#BFE3D0] bg-[#EAF7F1] text-[#087C70]";
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${color}`}
    >
      {job.priority} priority
    </span>
  );
}
function JobCard({
  job,
  onAccept,
  onAdvance,
}: {
  job: EmployeeJob;
  onAccept?: () => void;
  onAdvance?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#E6EAE4] p-4 transition hover:shadow-md">
      <div className="flex gap-3">
        <img
          src={getFoodImage(job.category)}
          alt=""
          className="h-12 w-12 rounded-xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-[#173B38]">{job.food}</p>
              <p className="mt-1 text-xs text-[#71817C]">
                {job.id} · {job.quantity} kg · {job.servings} servings
              </p>
            </div>
            <Priority job={job} />
          </div>
          <div className="mt-3 grid gap-2 text-xs text-[#71817C] sm:grid-cols-2">
            <span>
              <MapPin className="mr-1 inline h-3.5 w-3.5" />
              {job.pickup}
            </span>
            <span>
              <Clock3 className="mr-1 inline h-3.5 w-3.5" />
              {job.window}
            </span>
            <span>{job.distance} km away</span>
            <span>
              {job.donorType} · {labels[job.status]}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {onAccept && (
          <button
            type="button"
            onClick={onAccept}
            className="rounded-lg bg-[#0B8B7F] px-3 py-2 text-xs font-bold text-white"
          >
            Accept Request
          </button>
        )}
        {onAdvance && next[job.status] && (
          <button
            type="button"
            onClick={onAdvance}
            className="rounded-lg bg-[#0B8B7F] px-3 py-2 text-xs font-bold text-white"
          >
            Update Status
          </button>
        )}
        <Link
          to={`/employee/requests/${job.id}`}
          className="rounded-lg border border-[#DDE8E1] px-3 py-2 text-xs font-bold text-[#41645B]"
        >
          View Details
        </Link>
        <Link
          to={`/employee/tracking?job=${job.id}`}
          className="rounded-lg border border-[#DDE8E1] px-3 py-2 text-xs font-bold text-[#41645B]"
        >
          Track
        </Link>
        <Link
          to="/employee/help"
          className="rounded-lg border border-[#F0D7D0] px-3 py-2 text-xs font-bold text-[#C65A35]"
        >
          Report Issue
        </Link>
      </div>
    </div>
  );
}

export function EmployeeDashboardPage() {
  const { user } = useAuth();
  const { jobs, updateJob } = useEmployeeJobs();
  const active = jobs.filter(
    (job) =>
      job.employee !== "Unassigned" &&
      !["completed", "cancelled"].includes(job.status),
  );
  const completed = jobs.filter((job) => job.status === "completed");
  const cards = [
    [
      "New requests",
      jobs.filter((job) => job.employee === "Unassigned").length,
      Package,
      "/employee/requests",
    ],
    ["Assigned pickups", active.length, Truck, "/employee/assignments"],
    ["Pickups today", active.length, MapPin, "/employee/active-pickups"],
    [
      "Completed deliveries",
      completed.length,
      CheckCircle2,
      "/employee/completed",
    ],
    [
      "Food collected",
      `${completed.reduce((sum, job) => sum + job.quantity, 0)} kg`,
      Cloud,
      "/employee/performance",
    ],
    [
      "People supported",
      completed.reduce((sum, job) => sum + job.servings, 0),
      Users,
      "/employee/performance",
    ],
  ] as const;
  return (
    <Shell
      title={`${getIndiaGreeting()}, ${user?.name?.split(" ")[0] || "Employee"}`}
      action={
        <Link
          to="/employee/requests"
          className="rounded-xl bg-[#F6C85F] px-4 py-3 text-sm font-extrabold text-[#173B38]"
        >
          View New Requests
        </Link>
      }
    >
      <div className="rounded-[28px] bg-[#174A57] p-6 text-white shadow-lg">
        <p className="text-lg font-bold">Ready to rescue surplus food today?</p>
        <p className="mt-2 text-sm text-[#D0E9E0]">
          Food rescue, logistics, and delivery tracking in one workspace.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/employee/requests"
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#174A57]"
          >
            View New Requests
          </Link>
          <Link
            to="/employee/tracking"
            className="rounded-xl border border-white/30 px-4 py-2.5 text-sm font-bold"
          >
            Track Donation
          </Link>
          <Link
            to="/employee/help"
            className="rounded-xl border border-white/30 px-4 py-2.5 text-sm font-bold"
          >
            Report Issue
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {cards.map(([label, value, Icon, href]) => (
          <Link
            key={label}
            to={href}
            className="rounded-2xl border border-[#E6EAE4] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF7F1] text-[#087C70]">
              <Icon className="h-4 w-4" />
            </div>
            <p className="mt-5 text-2xl font-extrabold text-[#173B38]">
              {value}
            </p>
            <p className="mt-1 text-xs text-[#71817C]">{label}</p>
          </Link>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="text-xl font-extrabold text-[#173B38]">
            Active pickup
          </h2>
          {active[0] ? (
            <>
              <div className="mt-5">
                <JobCard
                  job={active[0]}
                  onAdvance={() =>
                    updateJob(active[0].id, {
                      status: next[active[0].status] || active[0].status,
                    })
                  }
                />
              </div>
              <div className="mt-6">
                <Timeline job={active[0]} />
              </div>
            </>
          ) : (
            <EmptyState
              icon={Truck}
              title="No active pickups"
              description="Accept a request to start a rescue route."
            />
          )}
        </Panel>
        <Panel className="bg-[#FFF9EE]">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#A6751A]">
            Rescue Hero Score
          </p>
          <div className="mt-4 flex items-center gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#EAF7F1] text-3xl font-extrabold text-[#087C70]">
              78
            </div>
            <div>
              <p className="text-xl font-extrabold text-[#173B38]">
                Food Rescue Hero
              </p>
              <p className="mt-1 text-xs text-[#71817C]">
                Level 4 · transparent score
              </p>
              <div className="mt-3 flex gap-2 text-[#D49A2A]">
                <Award className="h-5 w-5" />
                <Star className="h-5 w-5" />
                <Target className="h-5 w-5" />
              </div>
            </div>
          </div>
        </Panel>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="text-xl font-extrabold text-[#173B38]">
            Today&apos;s Smart Route
          </h2>
          <div className="mt-5 space-y-3">
            {active.slice(0, 3).map((job, index) => (
              <div key={job.id} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF0FA] text-xs font-bold text-[#3569A8]">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-bold text-[#173B38]">
                    {job.pickup}
                  </p>
                  <p className="text-xs text-[#71817C]">
                    {job.distance} km · {job.window}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/employee/tracking"
            className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#087C70]"
          >
            Start Route <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Panel>
        <Panel className="border-[#F0D7D0] bg-[#FFF7F1]">
          <div className="flex items-center gap-2 text-[#C65A35]">
            <Bell className="h-4 w-4" />
            <h2 className="text-lg font-extrabold">Delay alerts</h2>
          </div>
          <div className="mt-5 space-y-3 text-sm text-[#754333]">
            <p>
              <AlertTriangle className="mr-2 inline h-4 w-4" />
              Pickup deadline approaching
            </p>
            <p>
              <Clock3 className="mr-2 inline h-4 w-4" />
              Running 10 minutes behind schedule
            </p>
            <p>
              <HeartHandshake className="mr-2 inline h-4 w-4" />
              Donor updated pickup information
            </p>
          </div>
        </Panel>
      </div>
    </Shell>
  );
}

export function EmployeeRequestsPage() {
  const { jobs, acceptJob } = useEmployeeJobs();
  const [sort, setSort] = useState("priority");
  const requests = jobs
    .filter((job) => job.employee === "Unassigned")
    .sort((a, b) =>
      sort === "distance"
        ? a.distance - b.distance
        : sort === "quantity"
          ? b.quantity - a.quantity
          : a.priority.localeCompare(b.priority),
    );
  return (
    <Shell
      title="New donation requests"
      action={
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="rounded-lg border border-[#DDE8E1] bg-white px-3 py-2 text-xs"
        >
          <option value="priority">Highest priority</option>
          <option value="distance">Nearest</option>
          <option value="quantity">Largest quantity</option>
        </select>
      }
    >
      <Panel className="border-[#C9E7D8] bg-[#F2FBF5]">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-[#0B8B7F]" />
          <p className="text-xs leading-5 text-[#536B63]">
            <strong>Smart Rescue Priority:</strong> scheduling guidance only. It
            does not determine food safety.
          </p>
        </div>
      </Panel>
      <div className="grid gap-4 lg:grid-cols-2">
        {requests.length ? (
          requests.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onAccept={() => acceptJob(job.id)}
            />
          ))
        ) : (
          <Panel>
            <EmptyState
              icon={Package}
              title="No new requests"
              description="You are all caught up."
            />
          </Panel>
        )}
      </div>
    </Shell>
  );
}

export function EmployeeRequestDetailsPage() {
  const { id } = useParams();
  const { jobs, acceptJob } = useEmployeeJobs();
  const job = jobs.find((item) => item.id === id);
  if (!job)
    return (
      <Shell title="Request not found">
        <Panel>
          <EmptyState
            icon={Package}
            title="Request unavailable"
            description="This request may have been reassigned."
          />
          <Link
            to="/employee/requests"
            className="mx-auto block w-fit rounded-xl bg-[#0B8B7F] px-4 py-3 text-sm font-bold text-white"
          >
            Back to requests
          </Link>
        </Panel>
      </Shell>
    );
  return (
    <Shell
      title={job.food}
      action={
        <Link
          to="/employee/requests"
          className="rounded-xl border border-[#DDE8E1] px-4 py-2.5 text-sm font-bold text-[#41645B]"
        >
          Back
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#173B38]">
                {job.id} · {job.quantity} kg · {job.servings} servings
              </p>
              <p className="mt-1 text-xs text-[#71817C]">
                {job.donor} · {job.donorType}
              </p>
            </div>
            <Priority job={job} />
          </div>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-[#9AA9A2]">Pickup</dt>
              <dd className="mt-1 font-semibold text-[#41645B]">
                {job.pickup}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[#9AA9A2]">Window</dt>
              <dd className="mt-1 font-semibold text-[#41645B]">
                {job.window}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[#9AA9A2]">Destination</dt>
              <dd className="mt-1 font-semibold text-[#41645B]">
                {job.destination}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[#9AA9A2]">Notes</dt>
              <dd className="mt-1 font-semibold text-[#41645B]">{job.notes}</dd>
            </div>
          </dl>
          <div className="mt-7 flex flex-wrap gap-3">
            {job.employee === "Unassigned" && (
              <button
                type="button"
                onClick={() => acceptJob(job.id)}
                className="rounded-xl bg-[#0B8B7F] px-4 py-3 text-sm font-bold text-white"
              >
                Accept Request
              </button>
            )}
            <Link
              to="/employee/help"
              className="rounded-xl border border-[#F0D7D0] px-4 py-3 text-sm font-bold text-[#C65A35]"
            >
              Contact Support
            </Link>
          </div>
        </Panel>
        <Panel>
          <h2 className="text-lg font-extrabold text-[#173B38]">
            Current status
          </h2>
          <div className="mt-5">
            <Timeline job={job} />
          </div>
        </Panel>
      </div>
    </Shell>
  );
}

export function AssignmentsPage({
  activeOnly = false,
}: {
  activeOnly?: boolean;
}) {
  const { jobs, updateJob } = useEmployeeJobs();
  const [search, setSearch] = useState("");
  const items = jobs.filter(
    (job) =>
      job.employee !== "Unassigned" &&
      (!activeOnly || !["completed", "cancelled"].includes(job.status)) &&
      (!search ||
        job.id.toLowerCase().includes(search.toLowerCase()) ||
        job.food.toLowerCase().includes(search.toLowerCase())),
  );
  return (
    <Shell title={activeOnly ? "Active pickups" : "My assignments"}>
      <Panel>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9AA9A2]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search donation..."
              className="h-10 w-full rounded-lg border border-[#DDE8E1] pl-9 text-sm"
            />
          </div>
          <Link
            to="/employee/requests"
            className="rounded-lg bg-[#0B8B7F] px-3 py-2 text-xs font-bold text-white"
          >
            New Requests
          </Link>
        </div>
        <div className="mt-5 space-y-3">
          {items.length ? (
            items.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onAdvance={() =>
                  updateJob(job.id, { status: next[job.status] || job.status })
                }
              />
            ))
          ) : (
            <EmptyState
              icon={Truck}
              title="No assignments found"
              description="Accept a request to build your route."
            />
          )}
        </div>
      </Panel>
    </Shell>
  );
}

export function TrackingPage() {
  const { jobs } = useEmployeeJobs();
  const active = jobs.find(
    (job) =>
      !["completed", "cancelled"].includes(job.status) &&
      job.employee !== "Unassigned",
  );
  return (
    <Shell title="Live tracking">
      <Panel>
        {active ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-[#173B38]">
                  {active.id} · {active.food}
                </p>
                <p className="mt-1 text-xs text-[#71817C]">
                  {active.distance} km · ETA 18 minutes · {active.destination}
                </p>
              </div>
              <StatusBadge status={active.status} />
            </div>
            <div className="mt-6">
              <RealTrackingMap
                pickupAddress={active.pickup}
                destinationName={active.destination}
                destinationAddress="Designated Distribution Center, Ward 5"
                agentName="You (Collection Agent)"
                status={active.status}
                foodName={active.food}
                quantity={`${active.quantity} kg`}
                etaMinutes={18}
                className="h-80 w-full min-h-[340px] rounded-2xl overflow-hidden relative shadow-md border border-[#E6EAE4]"
              />
            </div>
            <div className="mt-6">
              <Timeline job={active} />
            </div>
          </>
        ) : (
          <EmptyState
            icon={MapPin}
            title="No active route"
            description="Accept a pickup to start live tracking."
          />
        )}
      </Panel>
    </Shell>
  );
}

export function CompletedPage() {
  const { jobs } = useEmployeeJobs();
  const completed = jobs.filter((job) => job.status === "completed");
  return (
    <Shell title="Completed donations">
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-[#9AA9A2]">
              <tr>
                <th className="pb-3">Donation ID</th>
                <th className="pb-3">Food</th>
                <th className="pb-3">Quantity</th>
                <th className="pb-3">Destination</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {completed.map((job) => (
                <tr key={job.id} className="border-t border-[#EEF1ED]">
                  <td className="py-4 font-bold text-[#173B38]">
                    <Link to={`/employee/requests/${job.id}`}>{job.id}</Link>
                  </td>
                  <td className="py-4 text-[#536B63]">{job.food}</td>
                  <td className="py-4 text-[#536B63]">{job.quantity} kg</td>
                  <td className="py-4 text-[#536B63]">{job.destination}</td>
                  <td className="py-4">
                    <StatusBadge status={job.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!completed.length && (
            <EmptyState
              icon={CheckCircle2}
              title="No completed donations yet"
              description="Completed delivery records will appear here."
            />
          )}
        </div>
      </Panel>
    </Shell>
  );
}

export function PerformancePage() {
  const { jobs } = useEmployeeJobs();
  const completed = jobs.filter((job) => job.status === "completed");
  const performanceStats: Array<[string, string | number, LucideIcon]> = [
    ["Total pickups", jobs.length, Truck],
    ["Successful deliveries", completed.length, CheckCircle2],
    ["Completion rate", "100%", Target],
    ["Food collected", `${completed.reduce((sum, job) => sum + job.quantity, 0)} kg`, Leaf],
  ];
  return (
    <Shell title="Performance">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {performanceStats.map(([label, value, Icon]) => (
          <Panel key={String(label)}>
            <Icon className="h-5 w-5 text-[#0B8B7F]" />
            <p className="mt-4 text-2xl font-extrabold text-[#173B38]">
              {value}
            </p>
            <p className="mt-1 text-xs text-[#71817C]">{label}</p>
          </Panel>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="text-lg font-extrabold text-[#173B38]">
            Weekly pickups
          </h2>
          <div className="mt-7 flex h-40 items-end gap-3 border-b border-[#E6EAE4]">
            {[35, 55, 42, 70, 50, 80, 64].map((height, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                className="flex-1 rounded-t-lg bg-[#9AD8C5]"
              />
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="text-lg font-extrabold text-[#173B38]">
            Rescue Hero Score
          </h2>
          <div className="mt-6 flex items-center gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#EAF7F1] text-3xl font-extrabold text-[#087C70]">
              78
            </div>
            <div>
              <p className="font-extrabold text-[#173B38]">
                Level 4 Food Rescue Hero
              </p>
              <p className="mt-2 text-xs text-[#71817C]">
                Based on pickups, completed deliveries, response time, and
                reliability.
              </p>
            </div>
          </div>
        </Panel>
      </div>
      <Panel>
        <h2 className="text-lg font-extrabold text-[#173B38]">Achievements</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            "First Pickup",
            "10 Successful Pickups",
            "100 KG Rescued",
            "Fast Responder",
            "Reliable Collector",
            "Food Rescue Champion",
          ].map((badge) => (
            <div
              key={badge}
              className="rounded-2xl bg-[#FFF9EE] p-4 text-center text-[#B7791F]"
            >
              <Award className="mx-auto h-6 w-6" />
              <p className="mt-2 text-xs font-bold">{badge}</p>
            </div>
          ))}
        </div>
      </Panel>
    </Shell>
  );
}

export function NotificationsPage() {
  const [items, setItems] = useState([
    [
      "New donation request",
      "A high-priority prepared meal pickup is waiting.",
    ],
    ["Route update", "Donor updated the pickup entrance information."],
    ["Admin announcement", "Please review this week's safety guidance."],
  ]);
  return (
    <Shell title="Notifications">
      <Panel>
        <button
          type="button"
          onClick={() => setItems([])}
          className="mb-3 text-xs font-bold text-[#087C70]"
        >
          Mark all as read
        </button>
        {items.length ? (
          items.map(([title, message], index) => (
            <div
              key={title}
              className="flex gap-3 border-t border-[#EEF1ED] py-4"
            >
              <Bell className="mt-1 h-4 w-4 text-[#0B8B7F]" />
              <div className="flex-1">
                <p className="text-sm font-bold text-[#173B38]">{title}</p>
                <p className="mt-1 text-xs text-[#71817C]">{message}</p>
                <p className="mt-2 text-[10px] text-[#9AA9A2]">
                  {index + 1} hour ago
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setItems((current) =>
                    current.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                className="text-[#9AA9A2]"
              >
                ×
              </button>
            </div>
          ))
        ) : (
          <EmptyState
            icon={Bell}
            title="All caught up"
            description="New assignments and route updates will appear here."
          />
        )}
      </Panel>
    </Shell>
  );
}

export function EmployeeProfilePage() {
  const { user } = useAuth();
  const { jobs } = useEmployeeJobs();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <Shell title="Employee profile">
      <Panel>
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EAF7F1] text-2xl font-extrabold text-[#087C70]">
            {user?.name?.charAt(0) || "E"}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#173B38]">
              {user?.name || "Employee"}
            </h2>
            <p className="mt-1 text-sm text-[#71817C]">
              Employee ID: EMP-2048 · {user?.email || "employee@example.com"}
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-[#F5F9F5] p-4">
            <p className="text-xs text-[#9AA9A2]">Assigned area</p>
            <p className="mt-1 font-extrabold text-[#173B38]">
              Downtown / Midtown
            </p>
          </div>
          <div className="rounded-xl bg-[#F5F9F5] p-4">
            <p className="text-xs text-[#9AA9A2]">Total pickups</p>
            <p className="mt-1 font-extrabold text-[#173B38]">{jobs.length}</p>
          </div>
          <div className="rounded-xl bg-[#F5F9F5] p-4">
            <p className="text-xs text-[#9AA9A2]">Completed deliveries</p>
            <p className="mt-1 font-extrabold text-[#173B38]">
              {jobs.filter((job) => job.status === "completed").length}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing((value) => !value);
            setSaved(false);
          }}
          className="mt-6 rounded-xl border border-[#B9DCC8] px-4 py-2.5 text-sm font-bold text-[#087C70]"
        >
          <Edit3 className="mr-2 inline h-4 w-4" />
          {editing ? "Edit Profile" : "Edit Profile"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setSaved(true);
              setEditing(false);
            }}
            className="ml-2 rounded-xl bg-[#0B8B7F] px-4 py-2.5 text-sm font-bold text-white"
          >
            <Save className="mr-2 inline h-4 w-4" />
            Save Changes
          </button>
        )}
        {saved && (
          <p className="mt-3 text-sm font-bold text-[#087C70]">
            Profile changes saved for this session.
          </p>
        )}
      </Panel>
    </Shell>
  );
}

export function EmployeeSettingsPage() {
  const { preferences, setPreference } = useEmployeePreferences();
  return (
    <Shell title="Settings">
      <Panel>
        <h2 className="text-lg font-extrabold text-[#173B38]">
          Availability & notifications
        </h2>
        {[
          ["online", "Online and available for new requests"],
          ["requestAlerts", "New request alerts"],
          ["pickupReminders", "Pickup reminders"],
          ["deliveryUpdates", "Delivery notifications"],
          ["adminAnnouncements", "Admin announcements"],
        ].map(([key, label]) => (
          <label
            key={key}
            className="flex items-center justify-between border-b border-[#EEF1ED] py-4 text-sm font-semibold text-[#536B63]"
          >
            <span>{label}</span>
            <input
              type="checkbox"
              checked={preferences[key] ?? true}
              onChange={(event) => setPreference(key, event.target.checked)}
              className="h-5 w-5 accent-[#0B8B7F]"
            />
          </label>
        ))}
      </Panel>
    </Shell>
  );
}

export function EmployeeHelpPage() {
  const [sent, setSent] = useState(false);
  return (
    <Shell title="Help & support">
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="text-lg font-extrabold text-[#173B38]">
            How can we help?
          </h2>
          <div className="mt-4 space-y-3">
            {[
              "How pickup works",
              "How tracking works",
              "Donation status guide",
              "Issue reporting",
            ].map((item) => (
              <details key={item} className="rounded-xl bg-[#F5F9F5] p-4">
                <summary className="cursor-pointer text-sm font-bold text-[#41645B]">
                  {item}
                </summary>
                <p className="mt-3 text-xs leading-5 text-[#71817C]">
                  Follow the status timeline, confirm each handoff, and report
                  issues as soon as they happen.
                </p>
              </details>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="text-lg font-extrabold text-[#173B38]">
            Create support ticket
          </h2>
          {sent ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-[#0B8B7F]" />
              <p className="mt-3 text-sm font-bold text-[#173B38]">
                Issue reported successfully.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
              }}
              className="mt-4 space-y-4"
            >
              <input
                placeholder="Donation ID"
                className="h-10 w-full rounded-lg border border-[#DDE8E1] px-3 text-sm"
              />
              <select className="h-10 w-full rounded-lg border border-[#DDE8E1] bg-white px-3 text-sm">
                <option>Donor unavailable</option>
                <option>Incorrect address</option>
                <option>Food quantity mismatch</option>
                <option>Pickup delay</option>
                <option>Food condition concern</option>
                <option>Recipient unavailable</option>
                <option>Transportation problem</option>
                <option>Other</option>
              </select>
              <textarea
                required
                rows={4}
                placeholder="Describe the issue"
                className="w-full rounded-lg border border-[#DDE8E1] p-3 text-sm"
              />
              <label className="flex items-center gap-2 text-xs font-semibold text-[#536B63]">
                <Upload className="h-4 w-4" /> Optional photo
                <input type="file" className="sr-only" />
              </label>
              <button
                type="submit"
                className="w-full rounded-xl bg-[#0B8B7F] px-4 py-3 text-sm font-bold text-white"
              >
                Submit Issue
              </button>
            </form>
          )}
        </Panel>
      </div>
    </Shell>
  );
}

export function AccessRestricted() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Panel className="max-w-md text-center">
        <ShieldCheck className="mx-auto h-12 w-12 text-[#C65A35]" />
        <h1 className="mt-4 text-2xl font-extrabold text-[#173B38]">
          Access Restricted
        </h1>
        <p className="mt-2 text-sm text-[#71817C]">
          This workspace is available only to verified employee accounts.
        </p>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mt-6 rounded-xl bg-[#0B8B7F] px-4 py-3 text-sm font-bold text-white"
        >
          Back to my dashboard
        </button>
      </Panel>
    </div>
  );
}

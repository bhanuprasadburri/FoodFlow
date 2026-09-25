import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { RealTrackingMap } from "@/components/maps/RealTrackingMap";
import { getIndiaGreeting } from "@/lib/time";
import { formatINR, getDonationRate, getDonationValue, getPaymentStatus } from "./paymentValue";
import {
  foodImages,
  getFoodImage,
  StatusBadge,
  EmptyState,
} from "@/components/dashboard/SharedComponents";
import {
  useDonorDonations,
  useDonorPreferences,
  DonorDonation,
  DonorStatus,
} from "./donorStore";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  Edit3,
  FileText,
  Heart,
  Leaf,
  MapPin,
  MessageSquare,
  Package,
  Plus,
  Recycle,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TicketCheck,
  Trash2,
  Truck,
  Upload,
  User,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const steps = [
  "Donation Submitted",
  "Verification",
  "Employee Assigned",
  "Pickup Scheduled",
  "Picked Up",
  "Delivered",
  "Completed",
];
const activeStatuses: DonorStatus[] = [
  "pending",
  "accepted",
  "assigned",
  "scheduled",
  "picked_up",
  "delivered",
];
const statusText: Record<DonorStatus, string> = {
  pending: "Pending Verification",
  accepted: "Accepted",
  assigned: "Employee Assigned",
  scheduled: "Pickup Scheduled",
  picked_up: "Picked Up",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

function Shell({
  title,
  eyebrow,
  children,
  action,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-[1400px] space-y-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          {eyebrow && (
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00877F]">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#173B38]">
            {title}
          </h1>
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}
function Card({
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
function Timeline({ donation }: { donation: DonorDonation }) {
  const current =
    donation.status === "cancelled"
      ? 0
      : Math.max(
        0,
        [
          "pending",
          "accepted",
          "assigned",
          "scheduled",
          "picked_up",
          "delivered",
          "completed",
        ].indexOf(donation.status),
      );
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${index <= current ? "bg-[#0B8B7F] text-white" : "bg-[#EEF4EF] text-[#9AAA9F]"}`}
          >
            {index <= current ? (
              <Check className="h-4 w-4" />
            ) : (
              <span className="text-xs font-bold">{index + 1}</span>
            )}
          </div>
          <span
            className={`text-sm font-semibold ${index <= current ? "text-[#41645B]" : "text-[#9AAA9F]"}`}
          >
            {step}
          </span>
          {index < steps.length - 1 && (
            <div
              className={`h-px flex-1 ${index < current ? "bg-[#0B8B7F]" : "bg-[#DFE9E1]"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function DonorDashboardPage() {
  const { user } = useAuth();
  const { donations } = useDonorDonations();
  const completed = donations.filter((d) => d.status === "completed");
  const active = donations.filter((d) => activeStatuses.includes(d.status));
  const kg = completed.reduce((sum, d) => sum + d.impactKg, 0);
  const meals = completed.reduce((sum, d) => sum + d.servings, 0);
  const totalEarnings = completed.reduce((sum, d) => sum + getDonationValue(d), 0);
  const pendingEarnings = donations.filter((d) => d.status !== "completed" && d.status !== "cancelled").reduce((sum, d) => sum + getDonationValue(d), 0);
  const metrics = [
    ["Total Donations", donations.length, Package],
    ["Successful Donations", completed.length, CheckCircle2],
    ["Food Donated", `${kg} kg`, Leaf],
    ["People Served", `${meals}+`, Heart],
    ["CO₂ Waste Avoided", `${Math.round(kg * 2.5)} kg`, Recycle],
    ["Active Donation", active.length, Truck],
  ] as const;
  return (
    <Shell
      title={`${getIndiaGreeting()}, ${user?.name?.split(" ")[0] || "Donor"}.`}
      eyebrow="Donor command center"
      action={
        <Link
          to="/donor/donate"
          className="inline-flex items-center gap-2 rounded-xl bg-[#F6C85F] px-4 py-3 text-sm font-extrabold text-[#173B38]"
        >
          <Plus className="h-4 w-4" /> Donate Food
        </Link>
      }
    >
      <div className="rounded-[28px] bg-[#0B5B57] p-6 text-white shadow-lg sm:p-8">
        <p className="max-w-2xl text-lg font-bold">
          Every donation helps turn surplus food into meaningful impact.
        </p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[#D8F2E2]">
          Your surplus food is not waste - it can become someone&apos;s meal.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/donor/donate"
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#00615F]"
          >
            Donate surplus food
          </Link>
          <Link
            to="/donor/tracking"
            className="rounded-xl border border-white/30 px-4 py-2.5 text-sm font-bold"
          >
            Track donation
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {metrics.map(([label, value, Icon], index) => (
          <Link
            key={label}
            to={
              index === 0
                ? "/donor/donations"
                : index === 5
                  ? "/donor/donations/active"
                  : index === 2 || index === 4
                    ? "/donor/impact"
                    : "/donor/donations"
            }
            className="rounded-2xl border border-[#E6EAE4] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF7F1] text-[#00877F]">
              <Icon className="h-4 w-4" />
            </div>
            <p className="mt-5 text-2xl font-extrabold text-[#173B38]">
              {value}
            </p>
            <p className="mt-1 text-xs text-[#71817C]">{label}</p>
          </Link>
        ))}
      </div>
      <Card className="border-[#C9E7D8] bg-[#F5FBF4]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-[11px] font-bold uppercase tracking-widest text-[#087C70]">My earnings</p><h2 className="mt-1 text-xl font-extrabold text-[#173B38]">Fair value for verified donations</h2><p className="mt-1 text-xs text-[#71817C]">Amounts are calculated from verified quantity and configured category rates.</p></div>
          <Link to="/donor/donations" className="rounded-xl bg-[#0B8B7F] px-4 py-2.5 text-xs font-bold text-white">View Payment History</Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"><div><p className="text-xl font-extrabold text-[#173B38]">{formatINR(totalEarnings + pendingEarnings)}</p><p className="text-xs text-[#71817C]">Total earnings</p></div><div><p className="text-xl font-extrabold text-[#A6751A]">{formatINR(pendingEarnings)}</p><p className="text-xs text-[#71817C]">Pending verification</p></div><div><p className="text-xl font-extrabold text-[#087C70]">{formatINR(totalEarnings)}</p><p className="text-xs text-[#71817C]">Paid amount</p></div><div><p className="text-xl font-extrabold text-[#3569A8]">{active[0] ? formatINR(getDonationValue(active[0])) : formatINR(0)}</p><p className="text-xs text-[#71817C]">Current donation value</p></div></div>
      </Card>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#00877F]">
                Latest movement
              </p>
              <h2 className="mt-1 text-xl font-extrabold text-[#173B38]">
                Active donation
              </h2>
            </div>
            <Link
              to="/donor/donations/active"
              className="text-xs font-bold text-[#00877F]"
            >
              View all
            </Link>
          </div>
          {active[0] ? (
            <div className="mt-5">
              <div className="flex items-center gap-3">
                <img
                  src={getFoodImage(active[0].category)}
                  alt=""
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-bold text-[#173B38]">
                    {active[0].foodName}
                  </p>
                  <p className="text-xs text-[#71817C]">
                    {active[0].quantity} {active[0].unit} · {active[0].employee}
                  </p>
                </div>
                <StatusBadge status={active[0].status} />
              </div>
              <div className="mt-6">
                <Timeline donation={active[0]} />
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Package}
              title="No active donations"
              description="Your next donation can start a new impact story."
            />
          )}
        </Card>
        <Card className="bg-[#FFF9EE]">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#A6751A]">
            Impact summary
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-[#173B38]">
            Your food is moving good things forward.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#71817C]">
            You have supported {meals}+ meals and diverted {kg} kg from waste
            through completed donations.
          </p>
          <div className="mt-6 h-2 rounded-full bg-[#F0E6C9]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, completed.length * 10)}%` }}
              className="h-full rounded-full bg-[#D49A2A]"
            />
          </div>
          <Link
            to="/donor/impact"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#A6751A]"
          >
            See your impact <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      </div>
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#173B38]">
            Recent donations
          </h2>
          <Link
            to="/donor/donations"
            className="text-xs font-bold text-[#00877F]"
          >
            View history
          </Link>
        </div>
        <div className="mt-4 divide-y divide-[#EEF1ED]">
          {donations.slice(0, 5).map((d) => (
            <Link
              to={`/donor/donations/${d.id}`}
              key={d.id}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <img
                src={getFoodImage(d.category)}
                alt=""
                className="h-10 w-10 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#173B38]">
                  {d.foodName}
                </p>
                <p className="text-xs text-[#8A9A93]">
                  {d.id} · {d.quantity} {d.unit}
                </p>
              </div>
              <StatusBadge status={d.status} />
            </Link>
          ))}
        </div>
      </Card>
    </Shell>
  );
}

export function DonatePage() {
  const { addDonation } = useDonorDonations();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState<DonorDonation | null>(null);
  const [form, setForm] = useState({
    foodName: "",
    category: "Cooked meal",
    quantity: "",
    unit: "containers",
    servings: "",
    preparationDate: "",
    bestBefore: "",
    pickupAddress: "",
    pickupDate: "",
    pickupWindow: "",
    description: "",
    storage: "",
    contact: "",
    instructions: "",
    impactKg: "",
  });
  const [safety, setSafety] = useState(false);
  const update = (key: string, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!safety) return;
    const donation = addDonation({
      ...form,
      servings: Number(form.servings),
      impactKg: Number(form.impactKg) || 0,
    });
    setSubmitted(donation);
  };
  if (submitted)
    return (
      <Shell title="Donation submitted" eyebrow="Success">
        <Card className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-[#EAF7F1] text-[#0B8B7F]">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold text-[#173B38]">
            Your donation is in the queue.
          </h2>
          <p className="mt-2 text-sm text-[#71817C]">
            Donation ID <strong>{submitted.id}</strong> is pending verification.
          </p>
          <div className="mt-6 rounded-2xl bg-[#F5F9F5] p-4 text-left text-sm text-[#536B63]">
            <p>
              <strong>{submitted.foodName}</strong> · {submitted.quantity}{" "}
              {submitted.unit}
            </p>
            <p className="mt-1">
              Pickup: {submitted.pickupDate} · {submitted.pickupWindow}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to={`/donor/donations/${submitted.id}`}
              className="rounded-xl bg-[#0B8B7F] px-4 py-3 text-sm font-bold text-white"
            >
              View Donation
            </Link>
            <Link
              to="/donor/tracking"
              className="rounded-xl border border-[#B9DCC8] px-4 py-3 text-sm font-bold text-[#087C70]"
            >
              Track Donation
            </Link>
            <Link
              to="/donor/dashboard"
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-[#536B63]"
            >
              Back to Dashboard
            </Link>
          </div>
        </Card>
      </Shell>
    );
  const fields: Array<[string, string, string, string?]> = [
    ["foodName", "Food Name", "e.g. Vegetable biryani"],
    ["quantity", "Quantity", "e.g. 8"],
    ["servings", "Estimated Servings", "e.g. 18"],
    ["preparationDate", "Preparation Date", "", "datetime-local"],
    ["bestBefore", "Best-Before Date/Time", "", "datetime-local"],
    ["pickupAddress", "Pickup Address", "Full pickup address"],
    ["pickupDate", "Pickup Date", "", "date"],
    ["pickupWindow", "Pickup Time Window", "e.g. 6 PM - 8 PM"],
    ["contact", "Contact Number", "Phone number"],
    ["storage", "Storage Information", "How was it stored?"],
    ["impactKg", "Estimated Weight (kg)", "e.g. 4.5"],
  ];
  return (
    <Shell title="Donate surplus food" eyebrow="Create donation">
      <form onSubmit={submit} className="space-y-6">
        <Card>
          <h2 className="text-lg font-extrabold text-[#173B38]">
            Donation details
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {fields.map(([key, label, placeholder, type]) => (
              <label
                key={key}
                className="space-y-1.5 text-sm font-semibold text-[#536B63]"
              >
                <span>{label} *</span>
                <input
                  required={key !== "impactKg"}
                  type={
                    type ||
                    (key === "servings" ||
                      key === "quantity" ||
                      key === "impactKg"
                      ? "number"
                      : "text")
                  }
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(event) => update(key, event.target.value)}
                  className="h-10 w-full rounded-lg border border-[#DDE8E1] px-3 text-sm font-normal outline-none focus:border-[#0B8B7F]"
                />
              </label>
            ))}
            <label className="space-y-1.5 text-sm font-semibold text-[#536B63]">
              <span>Food Category *</span>
              <select
                value={form.category}
                onChange={(event) => update("category", event.target.value)}
                className="h-10 w-full rounded-lg border border-[#DDE8E1] bg-white px-3 text-sm"
              >
                <option>Cooked meal</option>
                <option>Fresh produce</option>
                <option>Bakery</option>
                <option>Packaged food</option>
                <option>Dairy</option>
                <option>Raw ingredients</option>
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-semibold text-[#536B63]">
              <span>Unit *</span>
              <select
                value={form.unit}
                onChange={(event) => update("unit", event.target.value)}
                className="h-10 w-full rounded-lg border border-[#DDE8E1] bg-white px-3 text-sm"
              >
                <option>containers</option>
                <option>bags</option>
                <option>boxes</option>
                <option>trays</option>
                <option>kg</option>
              </select>
            </label>
          </div>
          <label className="mt-4 block space-y-1.5 text-sm font-semibold text-[#536B63]">
            <span>Food Description</span>
            <textarea
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              rows={3}
              className="w-full rounded-lg border border-[#DDE8E1] p-3 text-sm font-normal outline-none focus:border-[#0B8B7F]"
            />
          </label>
          <label className="mt-4 block space-y-1.5 text-sm font-semibold text-[#536B63]">
            <span>Additional Instructions</span>
            <textarea
              value={form.instructions}
              onChange={(event) => update("instructions", event.target.value)}
              rows={2}
              className="w-full rounded-lg border border-[#DDE8E1] p-3 text-sm font-normal outline-none focus:border-[#0B8B7F]"
            />
          </label>
          <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#B9DCC8] bg-[#F5F9F5] p-4 text-sm font-semibold text-[#41645B]">
            <Upload className="h-4 w-4 text-[#0B8B7F]" /> Food image upload
            (optional)
            <input type="file" accept="image/*" className="sr-only" />
          </label>
        </Card>
        <Card className="border-[#EBD79B] bg-[#FFF9E9]">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#A6751A]" />
            <div>
              <h2 className="font-extrabold text-[#754E1A]">
                Food Safety Declaration
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#8D762F]">
                I confirm that the information provided is accurate and that the
                food has been appropriately handled and stored.
              </p>
              <label className="mt-4 flex items-start gap-3 text-sm font-bold text-[#754E1A]">
                <input
                  type="checkbox"
                  checked={safety}
                  onChange={(event) => setSafety(event.target.checked)}
                  className="mt-1 h-4 w-4"
                  required
                />{" "}
                I confirm the Food Safety Declaration.
              </label>
            </div>
          </div>
        </Card>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!safety}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B8B7F] px-5 py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" /> Submit Donation
          </button>
        </div>
      </form>
    </Shell>
  );
}

function DonationRow({
  donation,
  onCancel,
}: {
  donation: DonorDonation;
  onCancel: (id: string) => void;
}) {
  return (
    <Link
      to={`/donor/donations/${donation.id}`}
      className="flex flex-wrap items-center gap-3 border-b border-[#EEF1ED] p-4 transition hover:bg-[#FAFCFA]"
    >
      <img
        src={getFoodImage(donation.category)}
        alt=""
        className="h-11 w-11 rounded-xl object-cover"
      />
      <div className="min-w-[150px] flex-1">
        <p className="text-sm font-bold text-[#173B38]">{donation.foodName}</p>
        <p className="mt-1 text-xs text-[#8A9A93]">
          {donation.id} · {donation.quantity} {donation.unit} ·{" "}
          {donation.pickupWindow}
        </p>
      </div>
      <span className="text-xs text-[#71817C]">{donation.employee}</span>
      <StatusBadge status={donation.status} />
      <span className="text-xs font-bold text-[#087C70]">
        {donation.impactKg} kg impact
      </span>
      <span className="text-xs font-bold text-[#A6751A]">{formatINR(getDonationValue(donation))} · {getPaymentStatus(donation)}</span>
      {["pending", "accepted"].includes(donation.status) && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            onCancel(donation.id);
          }}
          className="rounded-lg p-2 text-[#C65A35] hover:bg-[#FFF0EB]"
          aria-label="Cancel donation"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </Link>
  );
}

export function DonationsPage({
  onlyActive = false,
}: {
  onlyActive?: boolean;
}) {
  const { donations, updateDonation } = useDonorDonations();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = donations.filter(
    (d) =>
      (!onlyActive || activeStatuses.includes(d.status)) &&
      (filter === "all" ||
        (filter === "active"
          ? activeStatuses.includes(d.status)
          : filter === "completed"
            ? d.status === "completed"
            : filter === "cancelled"
              ? d.status === "cancelled"
              : d.status === "pending")) &&
      (!search ||
        d.id.toLowerCase().includes(search.toLowerCase()) ||
        d.foodName.toLowerCase().includes(search.toLowerCase())),
  );
  return (
    <Shell
      title={onlyActive ? "Active donations" : "My donations"}
      eyebrow="Donation management"
      action={
        !onlyActive && (
          <Link
            to="/donor/donate"
            className="rounded-xl bg-[#0B8B7F] px-4 py-3 text-sm font-bold text-white"
          >
            <Plus className="mr-2 inline h-4 w-4" /> Donate Food
          </Link>
        )
      }
    >
      <Card>
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9AA9A2]" />
            <input
              placeholder="Search donation..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 w-full rounded-lg border border-[#DDE8E1] pl-9 text-sm"
            />
          </div>
          {["all", "pending", "active", "completed", "cancelled"].map(
            (item) => (
              <button
                type="button"
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-lg px-3 py-2 text-xs font-bold capitalize ${filter === item ? "bg-[#0B8B7F] text-white" : "bg-[#F1F7F2] text-[#41645B]"}`}
              >
                {item}
              </button>
            ),
          )}
        </div>
        <div className="mt-5">
          {filtered.length ? (
            filtered.map((donation) => (
              <DonationRow
                key={donation.id}
                donation={donation}
                onCancel={(id) => updateDonation(id, { status: "cancelled" })}
              />
            ))
          ) : (
            <EmptyState
              icon={Package}
              title="No donations found"
              description="Try another filter or create a new donation."
            />
          )}
        </div>
      </Card>
    </Shell>
  );
}

export function DonationDetailsPage() {
  const { id } = useParams();
  const { donations, updateDonation } = useDonorDonations();
  const navigate = useNavigate();
  const donation = donations.find((entry) => entry.id === id);
  if (!donation)
    return (
      <Shell title="Donation not found">
        <Card>
          <EmptyState
            icon={Package}
            title="We could not find that donation"
            description="It may have been removed or the link is invalid."
          />
          <Link
            to="/donor/donations"
            className="mx-auto block w-fit rounded-xl bg-[#0B8B7F] px-4 py-3 text-sm font-bold text-white"
          >
            Back to donations
          </Link>
        </Card>
      </Shell>
    );
  return (
    <Shell
      title={donation.foodName}
      eyebrow={`Donation ${donation.id}`}
      action={
        <Link
          to="/donor/tracking"
          className="rounded-xl bg-[#0B8B7F] px-4 py-3 text-sm font-bold text-white"
        >
          Track Donation
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
        <Card>
          <div className="flex items-center gap-4">
            <img
              src={getFoodImage(donation.category)}
              alt=""
              className="h-20 w-20 rounded-2xl object-cover"
            />
            <div>
              <StatusBadge status={donation.status} />
              <p className="mt-2 text-sm text-[#71817C]">
                {donation.quantity} {donation.unit} · {donation.servings}{" "}
                estimated servings
              </p>
            </div>
          </div>
          <div className="mt-7">
            <Timeline donation={donation} />
          </div>
          <div className="mt-6 rounded-2xl bg-[#F5FBF4] p-4"><p className="text-[11px] font-bold uppercase tracking-widest text-[#087C70]">Donation value</p><div className="mt-3 grid gap-3 sm:grid-cols-3"><div><p className="text-xs text-[#9AA9A2]">Estimated quantity</p><p className="font-bold text-[#23453C]">{donation.impactKg} kg</p></div><div><p className="text-xs text-[#9AA9A2]">Configured rate</p><p className="font-bold text-[#23453C]">{formatINR(getDonationRate(donation))}/kg</p></div><div><p className="text-xs text-[#9AA9A2]">Amount</p><p className="font-extrabold text-[#087C70]">{formatINR(getDonationValue(donation))}</p></div></div><p className="mt-3 text-xs text-[#71817C]">Payment status: <strong>{getPaymentStatus(donation)}</strong>. Final payment follows team verification of quality and quantity.</p></div>
        </Card>
        <Card>
          <h2 className="text-lg font-extrabold text-[#173B38]">
            Donation information
          </h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-xs text-[#9AA9A2]">Pickup address</dt>
              <dd className="mt-1 font-semibold text-[#41645B]">
                {donation.pickupAddress}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[#9AA9A2]">Pickup time</dt>
              <dd className="mt-1 font-semibold text-[#41645B]">
                {donation.pickupDate} · {donation.pickupWindow}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[#9AA9A2]">Employee</dt>
              <dd className="mt-1 font-semibold text-[#41645B]">
                {donation.employee}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[#9AA9A2]">Food information</dt>
              <dd className="mt-1 font-semibold capitalize text-[#41645B]">
                {donation.category} ·{" "}
                {donation.storage || "Storage information provided"}
              </dd>
            </div>
          </dl>
          {["pending", "accepted"].includes(donation.status) && (
            <button
              type="button"
              onClick={() => {
                updateDonation(donation.id, { status: "cancelled" });
                navigate("/donor/donations");
              }}
              className="mt-7 rounded-xl border border-[#F0D7D0] px-4 py-2.5 text-sm font-bold text-[#C65A35]"
            >
              Cancel Donation
            </button>
          )}
        </Card>
      </div>
    </Shell>
  );
}

export function TrackingPage() {
  const { donations } = useDonorDonations();
  const active = donations.find((d) => activeStatuses.includes(d.status));
  return (
    <Shell title="Donation tracking" eyebrow="Live journey">
      <Card>
        {active ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-[#173B38]">
                  {active.id} · {active.foodName}
                </p>
                <p className="mt-1 text-xs text-[#71817C]">
                  Employee: {active.employee} · ETA: 18 minutes
                </p>
              </div>
              <StatusBadge status={active.status} />
            </div>
            <div className="mt-6">
              <RealTrackingMap
                pickupAddress={active.pickupAddress}
                destinationName="Hope Community Kitchen"
                destinationAddress="East Gate 2, Community Food Center"
                agentName={active.employee || "Alex Morgan"}
                status={active.status}
                foodName={active.foodName}
                quantity={active.quantity}
                etaMinutes={18}
                className="h-80 w-full min-h-[340px] rounded-2xl overflow-hidden relative shadow-md border border-[#E6EAE4]"
              />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                "Employee assigned",
                "Travelling",
                "Pickup completed",
                "Delivery in progress",
                "Delivered",
              ].map((label, index) => (
                <div
                  key={label}
                  className={`rounded-xl p-3 text-xs font-bold ${index < 2 ? "bg-[#EAF7F1] text-[#087C70]" : "bg-[#F5F7F4] text-[#9AA9A2]"}`}
                >
                  {index < 2 ? (
                    <Check className="mr-1 inline h-3.5 w-3.5" />
                  ) : (
                    <Clock3 className="mr-1 inline h-3.5 w-3.5" />
                  )}
                  {label}
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            icon={MapPin}
            title="Nothing to track yet"
            description="Active donation journeys will appear here."
          />
        )}
      </Card>
    </Shell>
  );
}

export function ImpactPage() {
  const { donations } = useDonorDonations();
  const completed = donations.filter((d) => d.status === "completed");
  const kg = completed.reduce((sum, d) => sum + d.impactKg, 0);
  const impactStats: Array<[string, string | number, LucideIcon]> = [
    ["Food donated", `${kg} kg`, Leaf],
    ["Successful donations", completed.length, CheckCircle2],
    ["Meals supported", `${completed.reduce((s, d) => s + d.servings, 0)}+`, Heart],
    ["Waste diverted", `${kg} kg`, Recycle],
  ];
  return (
    <Shell title="Your impact" eyebrow="Personal sustainability report">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {impactStats.map(([label, value, Icon]) => (
          <Card key={String(label)}>
            <Icon className="h-5 w-5 text-[#0B8B7F]" />
            <p className="mt-4 text-2xl font-extrabold text-[#173B38]">
              {value}
            </p>
            <p className="mt-1 text-xs text-[#71817C]">{label}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-extrabold text-[#173B38]">
            Monthly donation trend
          </h2>
          <div className="mt-8 flex h-44 items-end gap-3 border-b border-[#E6EAE4]">
            {[30, 48, 42, 68, 55, Math.max(24, completed.length * 12)].map(
              (height, index) => (
                <div
                  key={index}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    className="w-full max-w-10 rounded-t-lg bg-[#9AD8C5]"
                  />
                  <span className="text-[10px] text-[#9AA9A2]">
                    {["Apr", "May", "Jun", "Jul", "Aug", "Now"][index]}
                  </span>
                </div>
              ),
            )}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-extrabold text-[#173B38]">
            Your impact journey
          </h2>
          <div className="mt-6 space-y-4">
            {[
              "First Donation",
              "5 Donations",
              "10 Donations",
              "50 Donations",
              "Food Rescue Champion",
            ].map((milestone, index) => (
              <div key={milestone} className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${completed.length >= [1, 5, 10, 50, 100][index] ? "bg-[#0B8B7F] text-white" : "bg-[#EEF4EF] text-[#9AAA9F]"}`}
                >
                  <Award className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-[#536B63]">
                  {milestone}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}

export function RewardsPage() {
  const { donations } = useDonorDonations();
  const count = donations.filter((d) => d.status === "completed").length;
  const badges = [
    ["First Donation", count >= 1],
    ["5 Donations", count >= 5],
    ["10 Donations", count >= 10],
    ["50 Donations", count >= 50],
    ["100 kg Food Saved", donations.reduce((s, d) => s + d.impactKg, 0) >= 100],
    ["Community Champion", count >= 10],
  ];
  return (
    <Shell title="Rewards & recognition" eyebrow="Progress without pressure">
      <div className="rounded-3xl bg-[#FFF9EE] p-6">
        <p className="text-sm font-bold text-[#A6751A]">Current level</p>
        <h2 className="mt-2 text-3xl font-extrabold text-[#173B38]">
          Community Supporter
        </h2>
        <p className="mt-2 text-sm text-[#71817C]">
          {count} verified donations · {Math.max(count, 1)} month streak
        </p>
        <div className="mt-5 h-2 rounded-full bg-[#F0E6C9]">
          <div
            className="h-full rounded-full bg-[#D49A2A]"
            style={{ width: `${Math.min(100, count * 10)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-[#8D762F]">
          Progress to the next level
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {badges.map(([label, unlocked]) => (
          <Card
            key={String(label)}
            className={unlocked ? "bg-[#FFF9EE]" : "opacity-70"}
          >
            <Award
              className={`h-8 w-8 ${unlocked ? "text-[#D49A2A]" : "text-[#AAB7B0]"}`}
            />
            <h3 className="mt-4 font-extrabold text-[#173B38]">{label}</h3>
            <p className="mt-1 text-xs text-[#71817C]">
              {unlocked ? "Unlocked achievement" : "Keep donating to unlock"}
            </p>
            {unlocked && <Check className="mt-4 h-4 w-4 text-[#0B8B7F]" />}
          </Card>
        ))}
      </div>
    </Shell>
  );
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    [
      "Donation accepted",
      "Alex accepted your vegetable biryani pickup.",
      "success",
    ],
    [
      "Pickup reminder",
      "Your pickup window starts at 6:00 PM today.",
      "warning",
    ],
    ["Platform announcement", "Food safety guidance has been updated.", "info"],
  ]);
  return (
    <Shell
      title="Notifications"
      eyebrow="Stay in the loop"
      action={
        <button
          type="button"
          onClick={() => setNotifications([])}
          className="text-xs font-bold text-[#087C70]"
        >
          Mark all as read
        </button>
      }
    >
      <Card>
        <div className="divide-y divide-[#EEF1ED]">
          {notifications.length ? (
            notifications.map(([title, message, type], index) => (
              <div key={title} className="flex gap-3 py-4 first:pt-0">
                <div
                  className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${type === "warning" ? "bg-[#FFF7DF] text-[#A6751A]" : "bg-[#EAF7F1] text-[#087C70]"}`}
                >
                  <Bell className="h-4 w-4" />
                </div>
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
                    setNotifications((items) =>
                      items.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                  className="text-[#9AA9A2]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <EmptyState
              icon={Bell}
              title="You are all caught up"
              description="New donation updates will appear here."
            />
          )}
        </div>
      </Card>
    </Shell>
  );
}

export function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  return (
    <Shell
      title="Your profile"
      eyebrow="Account identity"
      action={
        <button
          type="button"
          onClick={() => {
            setEditing((value) => !value);
            setSaved(false);
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-[#B9DCC8] px-4 py-2.5 text-sm font-bold text-[#087C70]"
        >
          <Edit3 className="h-4 w-4" /> {editing ? "Cancel" : "Edit Profile"}
        </button>
      }
    >
      <Card>
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EAF7F1] text-2xl font-extrabold text-[#087C70]">
            {user?.name?.charAt(0) || "D"}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#173B38]">
              {user?.name || "Donor"}
            </h2>
            <p className="mt-1 text-sm text-[#71817C]">
              {user?.email || "donor@example.com"}
            </p>
            <span className="mt-2 inline-flex rounded-full bg-[#EAF7F1] px-2.5 py-1 text-xs font-bold text-[#087C70]">
              Account verified
            </span>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            ["Full Name", user?.name || "Donor"],
            ["Email", user?.email || "donor@example.com"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs text-[#9AA9A2]">{label}</p>
              <p className="mt-1 font-semibold text-[#41645B]">{value}</p>
            </div>
          ))}
          <label className="text-xs text-[#9AA9A2]">
            Phone
            <input
              disabled={!editing}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-[#DDE8E1] px-3 text-sm text-[#41645B] disabled:bg-[#F5F7F4]"
            />
          </label>
          <label className="text-xs text-[#9AA9A2]">
            Address
            <input
              disabled={!editing}
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-[#DDE8E1] px-3 text-sm text-[#41645B] disabled:bg-[#F5F7F4]"
            />
          </label>
        </div>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setSaved(true);
              setEditing(false);
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0B8B7F] px-4 py-3 text-sm font-bold text-white"
          >
            <Save className="h-4 w-4" /> Save Changes
          </button>
        )}
        {saved && (
          <p className="mt-3 text-sm font-bold text-[#087C70]">
            Profile changes saved for this session.
          </p>
        )}
      </Card>
    </Shell>
  );
}

export function SettingsPage() {
  const { preferences, setPreference } = useDonorPreferences();
  const options = [
    ["donationUpdates", "Donation updates"],
    ["pickupReminders", "Pickup reminders"],
    ["deliveryUpdates", "Delivery updates"],
    ["announcements", "Platform announcements"],
    ["profileVisible", "Profile visibility"],
    ["historyVisible", "Donation history visibility"],
  ];
  return (
    <Shell title="Settings" eyebrow="Personal preferences">
      <Card>
        <h2 className="text-lg font-extrabold text-[#173B38]">
          Account & notifications
        </h2>
        <div className="mt-5 divide-y divide-[#EEF1ED]">
          {options.map(([key, label]) => (
            <label
              key={key}
              className="flex items-center justify-between gap-4 py-4"
            >
              <span className="text-sm font-semibold text-[#536B63]">
                {label}
              </span>
              <input
                type="checkbox"
                checked={preferences[key] ?? true}
                onChange={(event) => setPreference(key, event.target.checked)}
                className="h-5 w-5 accent-[#0B8B7F]"
              />
            </label>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="text-lg font-extrabold text-[#173B38]">Security</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-xl border border-[#DDE8E1] px-4 py-3 text-sm font-bold text-[#41645B]"
          >
            Change Password
          </button>
          <button
            type="button"
            className="rounded-xl border border-[#F0D7D0] px-4 py-3 text-sm font-bold text-[#C65A35]"
          >
            Logout from all devices
          </button>
        </div>
      </Card>
    </Shell>
  );
}

export function HelpPage() {
  const [sent, setSent] = useState(false);
  return (
    <Shell title="Help & support" eyebrow="We are here to help">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <h2 className="text-lg font-extrabold text-[#173B38]">
            Frequently asked questions
          </h2>
          <div className="mt-4 space-y-3">
            {[
              "How to donate",
              "Food safety information",
              "How tracking works",
              "Cancellation policy",
            ].map((question) => (
              <details key={question} className="rounded-xl bg-[#F5F9F5] p-4">
                <summary className="cursor-pointer text-sm font-bold text-[#41645B]">
                  {question}
                </summary>
                <p className="mt-3 text-xs leading-5 text-[#71817C]">
                  FoodFlow guides every donation through verification, pickup
                  scheduling, and transparent delivery updates.
                </p>
              </details>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-extrabold text-[#173B38]">
            Report an issue
          </h2>
          {sent ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-[#0B8B7F]" />
              <p className="mt-3 text-sm font-bold text-[#173B38]">
                Support request submitted.
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
                <option>Pickup delayed</option>
                <option>Food condition concern</option>
                <option>Incorrect address</option>
                <option>Other</option>
              </select>
              <textarea
                required
                placeholder="Describe the issue"
                rows={4}
                className="w-full rounded-lg border border-[#DDE8E1] p-3 text-sm"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[#0B8B7F] px-4 py-3 text-sm font-bold text-white"
              >
                Contact Support
              </button>
            </form>
          )}
        </Card>
      </div>
    </Shell>
  );
}

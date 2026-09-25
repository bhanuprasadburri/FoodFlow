import { FormEvent, useState } from "react";
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
  BusinessDonation,
  useBusinessDonations,
  useBusinessPreferences,
} from "./businessStore";
import {
  Award,
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Cloud,
  Download,
  Edit3,
  FileText,
  Heart,
  Leaf,
  MapPin,
  Package,
  Plus,
  Recycle,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";

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
            Business sustainability
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
function Timeline({ donation }: { donation: BusinessDonation }) {
  const stages = [
    "Submitted",
    "Verified",
    "Employee Assigned",
    "Picked Up",
    "Delivered",
    "Completed",
  ];
  const current =
    donation.status === "completed"
      ? 5
      : donation.status === "picked_up"
        ? 3
        : donation.status === "assigned"
          ? 2
          : 0;
  return (
    <div className="space-y-3">
      {stages.map((stage, index) => (
        <div key={stage} className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${index <= current ? "bg-[#0B8B7F] text-white" : "bg-[#EEF4EF] text-[#9AAA9F]"}`}
          >
            {index <= current ? <Check className="h-4 w-4" /> : index + 1}
          </div>
          <span
            className={`text-sm font-semibold ${index <= current ? "text-[#41645B]" : "text-[#9AAA9F]"}`}
          >
            {stage}
          </span>
        </div>
      ))}
    </div>
  );
}
function DonationRow({ donation }: { donation: BusinessDonation }) {
  return (
    <Link
      to={`/business/donations/${donation.id}`}
      className="flex flex-wrap items-center gap-3 border-b border-[#EEF1ED] p-4 hover:bg-[#FAFCFA]"
    >
      <img
        src={getFoodImage(donation.category)}
        alt=""
        className="h-11 w-11 rounded-xl object-cover"
      />
      <div className="min-w-[150px] flex-1">
        <p className="text-sm font-bold text-[#173B38]">{donation.food}</p>
        <p className="mt-1 text-xs text-[#8A9A93]">
          {donation.id} · {donation.quantity} {donation.unit} ·{" "}
          {donation.window}
        </p>
      </div>
      <span className="text-xs text-[#71817C]">{donation.employee}</span>
      <StatusBadge status={donation.status} />
      <span className="text-xs font-bold text-[#087C70]">
        {donation.quantity} kg impact
      </span>
    </Link>
  );
}

export function BusinessDashboardPage() {
  const { user } = useAuth();
  const { donations } = useBusinessDonations();
  const completed = donations.filter((d) => d.status === "completed");
  const active = donations.filter(
    (d) => !["completed", "cancelled"].includes(d.status),
  );
  const kg = completed.reduce((sum, d) => sum + d.quantity, 0);
  const meals = completed.reduce((sum, d) => sum + d.servings, 0);
  const cards = [
    [
      "Total food donated",
      `${donations.reduce((s, d) => s + d.quantity, 0)} kg`,
      Package,
      "/business/donations",
    ],
    [
      "Successful donations",
      completed.length,
      CheckCircle2,
      "/business/donations/history",
    ],
    ["Food rescued", `${kg} kg`, Leaf, "/business/impact"],
    ["Meals supported", `${meals}+`, Heart, "/business/impact"],
    ["Active donations", active.length, Truck, "/business/donations/active"],
    ["Impact score", "87/100", Award, "/business/reputation"],
  ] as const;
  return (
    <Shell
      title={`${getIndiaGreeting()}, ${user?.name?.split(" ")[0] || "Business"}`}
      action={
        <Link
          to="/business/donate"
          className="rounded-xl bg-[#F6C85F] px-4 py-3 text-sm font-extrabold text-[#173B38]"
        >
          <Plus className="mr-2 inline h-4 w-4" /> Donate Surplus Food
        </Link>
      }
    >
      <div className="rounded-[28px] bg-[#0B5B57] p-6 text-white shadow-lg sm:p-8">
        <p className="text-lg font-bold">
          Turn your surplus into measurable social and environmental impact.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/business/donate"
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#00615F]"
          >
            Donate Surplus Food
          </Link>
          <Link
            to="/business/tracking"
            className="rounded-xl border border-white/30 px-4 py-2.5 text-sm font-bold"
          >
            Track Active Pickup
          </Link>
          <Link
            to="/business/analytics"
            className="rounded-xl border border-white/30 px-4 py-2.5 text-sm font-bold"
          >
            View Analytics
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
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Panel>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#173B38]">
              Business verification
            </h2>
            <ShieldCheck className="h-5 w-5 text-[#087C70]" />
          </div>
          <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#F5F9F5] p-4">
            <div>
              <p className="font-bold text-[#173B38]">Verified Business</p>
              <p className="mt-1 text-xs text-[#71817C]">
                Your platform activity is verified for transparent reporting.
              </p>
            </div>
            <span className="rounded-full bg-[#EAF7F1] px-3 py-1 text-xs font-bold text-[#087C70]">
              Verified
            </span>
          </div>
        </Panel>
        <Panel className="bg-[#FFF9EE]">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#A6751A]">
            Smart Sustainability Insights
          </p>
          <p className="mt-3 text-sm leading-6 text-[#71817C]">
            Prepared meals are your strongest donation category. Friday pickups
            usually have the best availability.
          </p>
          <Link
            to="/business/analytics"
            className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#A6751A]"
          >
            Explore analytics <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Panel>
      </div>
      <Panel>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#173B38]">
            Recent activity
          </h2>
          <Link
            to="/business/donations"
            className="text-xs font-bold text-[#087C70]"
          >
            View all
          </Link>
        </div>
        <div className="mt-4 divide-y divide-[#EEF1ED]">
          {donations.slice(0, 5).map((d) => (
            <DonationRow key={d.id} donation={d} />
          ))}
        </div>
      </Panel>
    </Shell>
  );
}

export function BusinessDonatePage() {
  const { add } = useBusinessDonations();
  const [done, setDone] = useState<BusinessDonation | null>(null);
  const [form, setForm] = useState({
    food: "",
    category: "Prepared Meals",
    quantity: "",
    unit: "kg",
    servings: "",
    pickup: "",
    pickupDate: "",
    window: "",
    notes: "",
  });
  const update = (key: string, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setDone(
      add({
        ...form,
        quantity: Number(form.quantity),
        servings: Number(form.servings),
        employee: "Awaiting assignment",
        status: "pending",
        createdAt: "",
        notes: form.notes,
      } as Omit<BusinessDonation, "id" | "createdAt" | "status" | "employee">),
    );
  };
  if (done)
    return (
      <Shell title="Donation submitted">
        <Panel className="mx-auto max-w-2xl text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-[#0B8B7F]" />
          <h2 className="mt-4 text-2xl font-extrabold text-[#173B38]">
            Donation {done.id} created
          </h2>
          <p className="mt-2 text-sm text-[#71817C]">
            Status: Pending Verification
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to={`/business/donations/${done.id}`}
              className="rounded-xl bg-[#0B8B7F] px-4 py-3 text-sm font-bold text-white"
            >
              View Donation
            </Link>
            <Link
              to="/business/tracking"
              className="rounded-xl border border-[#DDE8E1] px-4 py-3 text-sm font-bold text-[#41645B]"
            >
              Track
            </Link>
            <Link
              to="/business/donate"
              className="rounded-xl border border-[#DDE8E1] px-4 py-3 text-sm font-bold text-[#41645B]"
            >
              Create Another
            </Link>
          </div>
        </Panel>
      </Shell>
    );
  return (
    <Shell title="Donate surplus food">
      <form onSubmit={submit} className="space-y-6">
        <Panel>
          <h2 className="text-lg font-extrabold text-[#173B38]">
            Donation details
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["food", "Food Name", "Prepared meals"],
              ["quantity", "Quantity", "25"],
              ["servings", "Estimated Servings", "100"],
              ["pickup", "Pickup Address", "Business address"],
              ["pickupDate", "Pickup Date", "", "date"],
              ["window", "Pickup Time Window", "6 PM - 7 PM"],
            ].map(([key, label, placeholder, type]) => (
              <label
                key={key}
                className="space-y-1.5 text-sm font-semibold text-[#536B63]"
              >
                {label}
                <input
                  required
                  type={
                    type ||
                    (key === "quantity" || key === "servings"
                      ? "number"
                      : "text")
                  }
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(event) => update(key, event.target.value)}
                  className="h-10 w-full rounded-lg border border-[#DDE8E1] px-3 text-sm font-normal"
                />
              </label>
            ))}
            <label className="space-y-1.5 text-sm font-semibold text-[#536B63]">
              Food Category
              <select
                value={form.category}
                onChange={(event) => update("category", event.target.value)}
                className="h-10 w-full rounded-lg border border-[#DDE8E1] bg-white px-3 text-sm"
              >
                <option>Prepared Meals</option>
                <option>Bakery</option>
                <option>Fruits</option>
                <option>Vegetables</option>
                <option>Packaged Food</option>
                <option>Dairy</option>
                <option>Other</option>
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-semibold text-[#536B63]">
              Unit
              <select
                value={form.unit}
                onChange={(event) => update("unit", event.target.value)}
                className="h-10 w-full rounded-lg border border-[#DDE8E1] bg-white px-3 text-sm"
              >
                <option>kg</option>
                <option>boxes</option>
                <option>trays</option>
                <option>bags</option>
              </select>
            </label>
          </div>
          <textarea
            placeholder="Food description, storage information, and additional instructions"
            value={form.notes}
            onChange={(event) => update("notes", event.target.value)}
            rows={4}
            className="mt-4 w-full rounded-lg border border-[#DDE8E1] p-3 text-sm"
          />
          <label className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#536B63]">
            <input type="checkbox" required /> I confirm that the information
            provided is accurate and the food was handled and stored
            appropriately.
          </label>
        </Panel>
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-[#0B8B7F] px-5 py-3 text-sm font-bold text-white"
          >
            Submit Donation
          </button>
        </div>
      </form>
    </Shell>
  );
}

export function BusinessDonationsPage({
  activeOnly = false,
}: {
  activeOnly?: boolean;
}) {
  const { donations, update } = useBusinessDonations();
  const [search, setSearch] = useState("");
  const items = donations.filter(
    (d) =>
      (!activeOnly || !["completed", "cancelled"].includes(d.status)) &&
      (!search ||
        d.id.toLowerCase().includes(search.toLowerCase()) ||
        d.food.toLowerCase().includes(search.toLowerCase())),
  );
  return (
    <Shell
      title={activeOnly ? "Active donations" : "My donations"}
      action={
        !activeOnly && (
          <Link
            to="/business/donate"
            className="rounded-xl bg-[#0B8B7F] px-4 py-3 text-sm font-bold text-white"
          >
            Donate Surplus
          </Link>
        )
      }
    >
      <Panel>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9AA9A2]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search donation..."
            className="h-10 w-full rounded-lg border border-[#DDE8E1] pl-9 text-sm"
          />
        </div>
        <div className="mt-5">
          {items.length ? (
            items.map((d) => <DonationRow key={d.id} donation={d} />)
          ) : (
            <EmptyState
              icon={Package}
              title="No donations found"
              description="Create a donation to start tracking business impact."
            />
          )}
        </div>
      </Panel>
    </Shell>
  );
}

export function BusinessDonationDetailsPage() {
  const { id } = useParams();
  const { donations } = useBusinessDonations();
  const donation = donations.find((item) => item.id === id);
  if (!donation)
    return (
      <Shell title="Donation not found">
        <Panel>
          <EmptyState
            icon={Package}
            title="Donation unavailable"
            description="The donation ID is not in this business workspace."
          />
          <Link
            to="/business/donations"
            className="mx-auto block w-fit rounded-xl bg-[#0B8B7F] px-4 py-3 text-sm font-bold text-white"
          >
            Back to donations
          </Link>
        </Panel>
      </Shell>
    );
  return (
    <Shell
      title={donation.food}
      action={
        <Link
          to="/business/tracking"
          className="rounded-xl bg-[#0B8B7F] px-4 py-3 text-sm font-bold text-white"
        >
          Track Donation
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <p className="text-sm font-bold text-[#173B38]">
            {donation.id} · {donation.quantity} {donation.unit} ·{" "}
            {donation.servings} servings
          </p>
          <p className="mt-2 text-xs text-[#71817C]">
            {donation.pickup} · {donation.window}
          </p>
          <div className="mt-7">
            <Timeline donation={donation} />
          </div>
        </Panel>
        <Panel>
          <h2 className="text-lg font-extrabold text-[#173B38]">
            Donation information
          </h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-xs text-[#9AA9A2]">Employee</dt>
              <dd className="mt-1 font-semibold text-[#41645B]">
                {donation.employee}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[#9AA9A2]">Category</dt>
              <dd className="mt-1 font-semibold text-[#41645B]">
                {donation.category}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[#9AA9A2]">Notes</dt>
              <dd className="mt-1 font-semibold text-[#41645B]">
                {donation.notes}
              </dd>
            </div>
          </dl>
          <Link
            to="/business/help"
            className="mt-6 inline-block rounded-xl border border-[#F0D7D0] px-4 py-3 text-sm font-bold text-[#C65A35]"
          >
            Report Issue
          </Link>
        </Panel>
      </div>
    </Shell>
  );
}

export function BusinessTrackingPage() {
  const { donations } = useBusinessDonations();
  const active = donations.find(
    (d) => !["completed", "cancelled"].includes(d.status),
  );
  return (
    <Shell title="Pickup tracking">
      <Panel>
        {active ? (
          <>
            <div className="flex justify-between">
              <div>
                <p className="font-bold text-[#173B38]">
                  {active.id} · {active.food}
                </p>
                <p className="mt-1 text-xs text-[#71817C]">
                  Employee: {active.employee} · ETA 18 minutes
                </p>
              </div>
              <StatusBadge status={active.status} />
            </div>
            <div className="mt-6">
              <RealTrackingMap
                pickupAddress="Business Warehouse / Kitchen Dock"
                destinationName="Hope Community Kitchen"
                destinationAddress="East Gate 2, Community Food Center"
                agentName={active.employee || "Alex Morgan"}
                status={active.status}
                foodName={active.food}
                quantity={`${active.quantity} ${active.unit}`}
                etaMinutes={18}
                className="h-80 w-full min-h-[340px] rounded-2xl overflow-hidden relative shadow-md border border-[#E6EAE4]"
              />
            </div>
            <div className="mt-6">
              <Timeline donation={active} />
            </div>
          </>
        ) : (
          <EmptyState
            icon={MapPin}
            title="No active pickup"
            description="Active business donations will appear here."
          />
        )}
      </Panel>
    </Shell>
  );
}

export function BusinessAnalyticsPage() {
  const { donations } = useBusinessDonations();
  const kg = donations.reduce((sum, d) => sum + d.quantity, 0);
  return (
    <Shell title="Business analytics">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {([
          ["Food donated", `${kg} kg`, Leaf],
          ["Success rate", "94%", CheckCircle2],
          ["Impact score", "87/100", Award],
          [
            "Meals supported",
            donations.reduce((s, d) => s + d.servings, 0),
            Heart,
          ],
        ] as [string, React.ReactNode, React.ComponentType<{ className?: string }>][]).map(([label, value, Icon]) => (
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
            Donation trend
          </h2>
          <div className="mt-7 flex h-44 items-end gap-3 border-b border-[#E6EAE4]">
            {[30, 50, 42, 70, 54, 82].map((height, index) => (
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
            Smart sustainability insights
          </h2>
          <div className="mt-5 space-y-3 text-sm text-[#536B63]">
            <p className="rounded-xl bg-[#F5F9F5] p-3">
              Your food donations increased by 18% this month.
            </p>
            <p className="rounded-xl bg-[#FFF9EE] p-3">
              Prepared meals represent 46% of your donations.
            </p>
            <p className="rounded-xl bg-[#F1F6FB] p-3">
              Friday is your highest donation day.
            </p>
          </div>
        </Panel>
      </div>
    </Shell>
  );
}

export function BusinessImpactPage() {
  const { donations } = useBusinessDonations();
  const complete = donations.filter((d) => d.status === "completed");
  return (
    <Shell title="Your business impact">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {([
          [
            "Food diverted",
            `${complete.reduce((s, d) => s + d.quantity, 0)} kg`,
            Leaf,
          ],
          [
            "Meals supported",
            complete.reduce((s, d) => s + d.servings, 0),
            Heart,
          ],
          ["Successful donations", complete.length, CheckCircle2],
          ["Impact score", "87/100", Award],
        ] as [string, React.ReactNode, React.ComponentType<{ className?: string }>][]).map(([label, value, Icon]) => (
          <Panel key={String(label)}>
            <Icon className="h-6 w-6 text-[#0B8B7F]" />
            <p className="mt-5 text-2xl font-extrabold text-[#173B38]">
              {value}
            </p>
            <p className="mt-1 text-xs text-[#71817C]">{label}</p>
          </Panel>
        ))}
      </div>
      <Panel>
        <h2 className="text-xl font-extrabold text-[#173B38]">
          Impact journey
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-5">
          {[
            "Started donating",
            "10 donations",
            "100 kg rescued",
            "500 kg rescued",
            "Food rescue champion",
          ].map((stage, index) => (
            <div
              key={stage}
              className="rounded-2xl bg-[#EAF7F1] p-4 text-center text-xs font-bold text-[#087C70]"
            >
              <Award className="mx-auto h-6 w-6" />
              <p className="mt-3">{stage}</p>
            </div>
          ))}
        </div>
      </Panel>
    </Shell>
  );
}

export function BusinessReputationPage() {
  return (
    <Shell title="Business impact & reputation">
      <Panel className="bg-[#173B38] text-white">
        <p className="text-sm font-bold text-[#9AD8C5]">
          Business impact score
        </p>
        <p className="mt-3 text-6xl font-extrabold">
          87<span className="text-2xl">/100</span>
        </p>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#C9E5D9]">
          Your platform impact score is calculated from verified activity on
          this platform. It is not an external certification or public
          sustainability rating.
        </p>
      </Panel>
      <Panel>
        <h2 className="text-lg font-extrabold text-[#173B38]">
          Improvement suggestions
        </h2>
        <div className="mt-4 space-y-3 text-sm text-[#536B63]">
          <p className="rounded-xl bg-[#F5F9F5] p-4">
            Complete 4 more successful donations to reach the next milestone.
          </p>
          <p className="rounded-xl bg-[#FFF9EE] p-4">
            Maintain consistent weekly donations.
          </p>
        </div>
      </Panel>
    </Shell>
  );
}

export function BusinessReportsPage() {
  const [generated, setGenerated] = useState(false);
  return (
    <Shell title="Business reports">
      <Panel>
        <div className="grid gap-4 sm:grid-cols-2">
          <select className="h-10 rounded-lg border border-[#DDE8E1] bg-white px-3 text-sm">
            <option>Donation Report</option>
            <option>Monthly Impact Report</option>
            <option>Food Waste Diversion Report</option>
            <option>Pickup Success Report</option>
          </select>
          <input
            type="month"
            className="h-10 rounded-lg border border-[#DDE8E1] px-3 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={() => setGenerated(true)}
          className="mt-5 rounded-xl bg-[#0B8B7F] px-4 py-3 text-sm font-bold text-white"
        >
          Generate Report
        </button>
        {generated && (
          <div className="mt-6 rounded-2xl bg-[#F5F9F5] p-5">
            <FileText className="h-6 w-6 text-[#087C70]" />
            <h2 className="mt-3 font-extrabold text-[#173B38]">
              Impact report preview
            </h2>
            <p className="mt-2 text-sm text-[#71817C]">
              FoodFlow business donation and diversion summary generated from
              verified platform activity.
            </p>
            <button
              type="button"
              onClick={() => {
                const blob = new Blob(
                  [
                    "FoodFlow Business Impact Report\nGenerated from verified activity.",
                  ],
                  { type: "text/plain" },
                );
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "foodflow-impact-report.txt";
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="mt-4 rounded-xl border border-[#B9DCC8] px-4 py-2.5 text-sm font-bold text-[#087C70]"
            >
              <Download className="mr-2 inline h-4 w-4" />
              Download Report
            </button>
          </div>
        )}
      </Panel>
    </Shell>
  );
}

export function BusinessSubscriptionPage() {
  const [plan, setPlan] = useState("Professional");
  return (
    <Shell title="Subscription">
      <div className="rounded-3xl bg-[#FFF9EE] p-6">
        <p className="text-sm font-bold text-[#A6751A]">Current plan</p>
        <h2 className="mt-2 text-3xl font-extrabold text-[#173B38]">{plan}</h2>
        <p className="mt-2 text-sm text-[#71817C]">
          Advanced analytics, impact reports, recurring donations, and priority
          support.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {["Basic", "Professional", "Enterprise"].map((item) => (
          <Panel key={item} className={plan === item ? "border-[#0B8B7F]" : ""}>
            <h3 className="text-xl font-extrabold text-[#173B38]">{item}</h3>
            <p className="mt-3 text-sm text-[#71817C]">
              {item === "Basic"
                ? "Donation and history"
                : item === "Professional"
                  ? "Analytics and reputation"
                  : "Team and dedicated support"}
            </p>
            <button
              type="button"
              onClick={() => setPlan(item)}
              className="mt-6 rounded-xl bg-[#0B8B7F] px-4 py-2.5 text-sm font-bold text-white"
            >
              {plan === item ? "Current Plan" : "Change Plan"}
            </button>
          </Panel>
        ))}
      </div>
    </Shell>
  );
}

export function BusinessTeamPage() {
  const [members, setMembers] = useState([
    ["Priya Shah", "Business Admin", "Active"],
    ["Sam Wilson", "Manager", "Active"],
  ]);
  const [name, setName] = useState("");
  return (
    <Shell title="Team management">
      <Panel>
        <div className="flex gap-3">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Team member name"
            className="h-10 flex-1 rounded-lg border border-[#DDE8E1] px-3 text-sm"
          />
          <button
            type="button"
            onClick={() => {
              if (name) {
                setMembers((current) => [
                  ...current,
                  [name, "Staff", "Invited"],
                ]);
                setName("");
              }
            }}
            className="rounded-xl bg-[#0B8B7F] px-4 py-2.5 text-sm font-bold text-white"
          >
            Invite Member
          </button>
        </div>
        <div className="mt-5 divide-y divide-[#EEF1ED]">
          {members.map(([member, role, status]) => (
            <div
              key={member}
              className="flex items-center justify-between py-4"
            >
              <div>
                <p className="text-sm font-bold text-[#173B38]">{member}</p>
                <p className="text-xs text-[#71817C]">{role}</p>
              </div>
              <span className="text-xs font-bold text-[#087C70]">{status}</span>
            </div>
          ))}
        </div>
      </Panel>
    </Shell>
  );
}

export function BusinessNotificationsPage() {
  const [items, setItems] = useState([
    "Employee assigned to DON-1048",
    "Your pickup is scheduled for 6:30 PM",
    "Congratulations: 1,000 kg milestone reached",
  ]);
  return (
    <Shell title="Notifications">
      <Panel>
        <button
          type="button"
          onClick={() => setItems([])}
          className="mb-4 text-xs font-bold text-[#087C70]"
        >
          Mark all as read
        </button>
        {items.length ? (
          items.map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-3 border-t border-[#EEF1ED] py-4"
            >
              <Bell className="h-4 w-4 text-[#0B8B7F]" />
              <span className="flex-1 text-sm text-[#536B63]">{item}</span>
              <button
                type="button"
                onClick={() =>
                  setItems((current) => current.filter((_, i) => i !== index))
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
            description="Business updates will appear here."
          />
        )}
      </Panel>
    </Shell>
  );
}

export function BusinessProfilePage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  return (
    <Shell title="Business profile">
      <Panel>
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FFF3E0] text-2xl font-extrabold text-[#E65100]">
            <Building2 className="h-9 w-9" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#173B38]">
              {user?.name || "Business partner"}
            </h2>
            <p className="text-sm text-[#71817C]">
              {user?.email || "business@example.com"}
            </p>
            <span className="mt-2 inline-flex rounded-full bg-[#EAF7F1] px-2.5 py-1 text-xs font-bold text-[#087C70]">
              Verified Business
            </span>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <input
            defaultValue={user?.name || "Business name"}
            className="h-10 rounded-lg border border-[#DDE8E1] px-3 text-sm"
          />
          <input
            defaultValue={user?.phone || "Phone"}
            className="h-10 rounded-lg border border-[#DDE8E1] px-3 text-sm"
          />
          <input
            defaultValue={user?.address || "Address"}
            className="h-10 rounded-lg border border-[#DDE8E1] px-3 text-sm"
          />
          <input
            placeholder="Website"
            className="h-10 rounded-lg border border-[#DDE8E1] px-3 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={() => setSaved(true)}
          className="mt-6 rounded-xl bg-[#0B8B7F] px-4 py-3 text-sm font-bold text-white"
        >
          <Save className="mr-2 inline h-4 w-4" />
          Save Changes
        </button>
        {saved && (
          <p className="mt-3 text-sm font-bold text-[#087C70]">
            Profile changes saved for this session.
          </p>
        )}
      </Panel>
    </Shell>
  );
}

export function BusinessSettingsPage() {
  const { values, setValue } = useBusinessPreferences();
  return (
    <Shell title="Settings">
      <Panel>
        <h2 className="text-lg font-extrabold text-[#173B38]">
          Notifications & preferences
        </h2>
        {[
          ["donations", "Donation updates"],
          ["pickup", "Pickup reminders"],
          ["delivery", "Delivery updates"],
          ["analytics", "Analytics alerts"],
          ["subscription", "Subscription reminders"],
          ["announcements", "Admin announcements"],
        ].map(([key, label]) => (
          <label
            key={key}
            className="flex items-center justify-between border-b border-[#EEF1ED] py-4 text-sm font-semibold text-[#536B63]"
          >
            <span>{label}</span>
            <input
              type="checkbox"
              checked={values[key] ?? true}
              onChange={(event) => setValue(key, event.target.checked)}
              className="h-5 w-5 accent-[#0B8B7F]"
            />
          </label>
        ))}
      </Panel>
    </Shell>
  );
}

export function BusinessHelpPage() {
  const [sent, setSent] = useState(false);
  return (
    <Shell title="Help & support">
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="text-lg font-extrabold text-[#173B38]">
            Business help
          </h2>
          <div className="mt-4 space-y-3">
            {[
              "How food donation works",
              "How tracking works",
              "Subscription help",
              "Reports help",
              "Food safety information",
            ].map((item) => (
              <details key={item} className="rounded-xl bg-[#F5F9F5] p-4">
                <summary className="cursor-pointer text-sm font-bold text-[#41645B]">
                  {item}
                </summary>
                <p className="mt-3 text-xs leading-5 text-[#71817C]">
                  FoodFlow helps businesses donate surplus food, coordinate
                  verified pickups, and measure platform-recorded impact.
                </p>
              </details>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="text-lg font-extrabold text-[#173B38]">
            Report an issue
          </h2>
          {sent ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-[#0B8B7F]" />
              <p className="mt-3 text-sm font-bold text-[#173B38]">
                Support ticket created successfully.
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
                <option>Pickup Delay</option>
                <option>Incorrect Information</option>
                <option>Employee Issue</option>
                <option>Food Condition Concern</option>
                <option>Technical Problem</option>
                <option>Subscription Issue</option>
                <option>Other</option>
              </select>
              <textarea
                required
                rows={4}
                placeholder="Describe the issue"
                className="w-full rounded-lg border border-[#DDE8E1] p-3 text-sm"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[#0B8B7F] px-4 py-3 text-sm font-bold text-white"
              >
                Report an Issue
              </button>
            </form>
          )}
        </Panel>
      </div>
    </Shell>
  );
}

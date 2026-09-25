import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "react-router";
import { getIndiaGreeting } from "@/lib/time";
import { useMemo, useState } from "react";
import {
  StatusBadge,
  getFoodImage,
} from "@/components/dashboard/SharedComponents";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Cloud,
  Database,
  FileText,
  Gauge,
  Globe2,
  Leaf,
  MapPin,
  MessageSquareWarning,
  Package,
  Radio,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TicketCheck,
  TrendingUp,
  Truck,
  UserCheck,
  Users,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

function MetricCard({
  label,
  value,
  icon: Icon,
  tone,
  trend,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
  trend?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E6EAE4] bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}
        >
          <Icon className="h-4 w-4" />
        </div>
        {trend && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#16856E]">
            <ArrowUpRight className="h-3 w-3" /> {trend}
          </span>
        )}
      </div>
      <p className="mt-5 text-2xl font-extrabold tracking-tight text-[#1E3532]">
        {value}
      </p>
      <p className="mt-1 text-xs font-medium text-[#71817C]">{label}</p>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00877F]">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-[#1E3532]">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

import { SEED_DONATIONS, SEED_EMPLOYEES, SEED_BUSINESSES, SEED_BIOGAS } from "@/lib/mock-data";

const DEFAULT_ADMIN_USERS = [
  { _id: "u-1", name: "Alex Johnson", email: "alex@example.com", role: "user", phone: "+91 98765 01000", verificationStatus: "verified" },
  { _id: "u-2", name: "Grand Hotel Kitchen (Chef Rajesh)", email: "kitchen@grandhotel.com", role: "business", phone: "+91 98111 22334", verificationStatus: "verified" },
  { _id: "u-3", name: "Alex Morgan", email: "alex.morgan@foodflow.com", role: "employee", phone: "+91 98765 01001", verificationStatus: "verified" },
  { _id: "u-4", name: "Green Energy Biogas (Dr. Murthy)", email: "operations@greenenergybiogas.com", role: "biogas", phone: "+91 98666 77889", verificationStatus: "verified" },
  { _id: "u-5", name: "Green Leaf Bakery & Deli", email: "contact@greenleaf.com", role: "business", phone: "+91 98222 33445", verificationStatus: "verified" },
  { _id: "u-6", name: "Priya Sharma", email: "priya.sharma@foodflow.com", role: "employee", phone: "+91 98765 01003", verificationStatus: "verified" },
  { _id: "u-7", name: "Super Administrator", email: "admin@foodflow.com", role: "admin", phone: "+91 98765 01004", verificationStatus: "verified" },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const queryUsers = useQuery(api.mutations.users.getAllUsers);
  const queryEmployees = useQuery(api.mutations.employees.list);
  const queryBusinesses = useQuery(api.mutations.businesses.list);
  const queryDonations = useQuery(api.mutations.donations.list);
  const queryPartners = useQuery(api.mutations.biogas.list);

  const storedDonations = (() => {
    try {
      const stored = localStorage.getItem("foodflow_all_donations") || localStorage.getItem("foodflow_donor_donations");
      return stored ? JSON.parse(stored) : SEED_DONATIONS;
    } catch {
      return SEED_DONATIONS;
    }
  })();

  const users = (queryUsers && queryUsers.length > 0) ? (queryUsers as any[]) : DEFAULT_ADMIN_USERS;
  const employees = (queryEmployees && queryEmployees.length > 0) ? (queryEmployees as any[]) : (SEED_EMPLOYEES as any[]);
  const businesses = (queryBusinesses && queryBusinesses.length > 0) ? (queryBusinesses as any[]) : (SEED_BUSINESSES as any[]);
  const donations = (queryDonations && queryDonations.length > 0) ? (queryDonations as any[]) : storedDonations;
  const partners = (queryPartners && queryPartners.length > 0) ? (queryPartners as any[]) : (SEED_BIOGAS as any[]);

  const [range, setRange] = useState("30 days");
  const [search, setSearch] = useState("");

  const completed = donations.filter(
    (donation: any) => donation.status === "completed" || donation.status === "delivered",
  );
  const active = donations.filter((donation: any) =>
    ["accepted", "on_the_way", "picked_up", "assigned", "scheduled", "in_transit"].includes(
      donation.status,
    ),
  );
  const pending = donations.filter((donation: any) => donation.status === "pending");
  const delayed = donations.filter(
    (donation: any) => donation.status === "on_the_way",
  );
  const foodKg = donations.reduce(
    (sum: number, donation: any) => sum + (donation.quantityKg || donation.impactKg || 12),
    0,
  );
  const people = donations.reduce(
    (sum: number, donation: any) => sum + (donation.servesPeople || donation.servings || 40),
    0,
  );
  const userById = useMemo(
    () => new Map<string, any>(users.map((entry: any) => [entry._id, entry])),
    [users],
  );
  const employeeById = useMemo(
    () => new Map<string, any>(employees.map((entry: any) => [entry._id, entry])),
    [employees],
  );
  const businessByUser = useMemo(
    () => new Map<string, any>(businesses.map((entry: any) => [entry.userId, entry])),
    [businesses],
  );
  const visibleDonations = (donations || [])
    .filter((donation: any) => {
      const donor = donation?.donorId ? userById.get(donation.donorId) as any : undefined;
      const searchLower = (search || "").toLowerCase();
      const foodName = (donation?.foodName || "").toLowerCase();
      const donorName = (donor?.name || donation?.donorName || "").toLowerCase();
      const idStr = String(donation?._id || donation?.id || "").toLowerCase();
      return (
        !searchLower ||
        foodName.includes(searchLower) ||
        donorName.includes(searchLower) ||
        idStr.includes(searchLower)
      );
    })
    .slice(0, 8);
  const foodCategories = ["cooked", "produce", "bakery", "packaged", "raw"];
  const categoryTotals = foodCategories.map((category) => ({
    category,
    value: donations
      .filter((donation) => donation.foodCategory === category)
      .reduce((sum, donation) => sum + donation.quantityKg, 0),
  }));

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="mx-auto max-w-[1600px] space-y-7"
    >
      <motion.section
        variants={fadeUp}
        className="relative overflow-hidden rounded-[28px] bg-[#202F2E] px-6 py-7 text-white shadow-[0_18px_50px_rgba(32,47,46,0.16)] sm:px-9 sm:py-8"
      >
        <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full border-[34px] border-[#9AD8C5]/10" />
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9AD8C5]">
              <ShieldCheck className="h-4 w-4" /> Super admin operations
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Platform Command Center
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#C8DDD5]">
              {getIndiaGreeting()}, {user?.name?.split(" ")[0] || "Admin"}. Every
              operational signal, from donation intake to verified delivery, in
              one place.
            </p>
          </div>
          <div className="min-w-[230px] rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-[#C8DDD5]">
              <span>Platform status</span>
              <span className="flex items-center gap-1.5 text-[#9AD8C5]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#70D39A]" />{" "}
                Operational
              </span>
            </div>
            <div className="mt-5 flex items-end justify-between">
              <p className="text-3xl font-extrabold">99.98%</p>
              <p className="text-xs text-[#A9C9BE]">uptime this month</p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={fadeUp}
        className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8"
      >
        {[
          [
            "Total users",
            users.length,
            Users,
            "bg-[#EAF7F1] text-[#087C70]",
            "+12%",
          ],
          [
            "Active employees",
            employees.filter((employee) => employee.status === "active").length,
            UserCheck,
            "bg-[#EAF0FA] text-[#3569A8]",
            "+8%",
          ],
          [
            "Verified businesses",
            businesses.filter(
              (business) => business.verificationStatus === "verified",
            ).length,
            Building2,
            "bg-[#FFF7DF] text-[#A6751A]",
            "+5%",
          ],
          [
            "Total donations",
            donations.length,
            UtensilsCrossed,
            "bg-[#EAF7F1] text-[#087C70]",
            "+23%",
          ],
          [
            "Successful",
            completed.length,
            CheckCircle2,
            "bg-[#EAF7F1] text-[#087C70]",
            "84%",
          ],
          [
            "Food rescued",
            `${foodKg} kg`,
            Leaf,
            "bg-[#EEF0FC] text-[#635BBD]",
            "+18%",
          ],
          [
            "Active pickups",
            active.length,
            Truck,
            "bg-[#FFF0EB] text-[#C65A35]",
            "Live",
          ],
          [
            "Platform impact",
            `${Math.round(people * 2.5)} kg`,
            Cloud,
            "bg-[#F1F6FB] text-[#3569A8]",
            "CO2 avoided",
          ],
        ].map(([label, value, Icon, tone, trend]) => (
          <MetricCard
            key={String(label)}
            label={String(label)}
            value={value as string | number}
            icon={Icon as React.ComponentType<{ className?: string }>}
            tone={String(tone)}
            trend={String(trend)}
          />
        ))}
      </motion.section>

      <motion.section variants={fadeUp} className="grid gap-4 md:grid-cols-5">
        <div className="rounded-2xl border border-[#C9E7D8] bg-[#F2FBF5] p-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-[#0B8B7F]" />
              <p className="text-sm font-extrabold text-[#1E5145]">
                Live Operations Center
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#0B8B7F]">
              Live
            </span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <p className="text-2xl font-extrabold text-[#1E3532]">
                {active.length}
              </p>
              <p className="text-[11px] text-[#71817C]">Active donations</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#1E3532]">
                {active.length}
              </p>
              <p className="text-[11px] text-[#71817C]">Active pickups</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#C65A35]">
                {delayed.length}
              </p>
              <p className="text-[11px] text-[#71817C]">Delayed pickups</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#1E3532]">
                {completed.length}
              </p>
              <p className="text-[11px] text-[#71817C]">Completed today</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[#EBD79B] bg-[#FFF9E9] p-4 md:col-span-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[#C58B25]" />
            <p className="text-sm font-extrabold text-[#754E1A]">
              Needs attention
            </p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-5">
            <div>
              <p className="text-2xl font-extrabold text-[#754E1A]">
                {pending.length}
              </p>
              <p className="text-[11px] text-[#8D762F]">Pending verification</p>
            </div>
            <div className="h-8 w-px bg-[#EBD79B]" />
            <p className="max-w-sm text-xs leading-5 text-[#8D762F]">
              Prioritize requests nearing their best-before time and review
              accounts waiting for verification.
            </p>
            <Link
              to="/dashboard/users"
              className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-[#A6751A]"
            >
              Review queue <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={fadeUp}
        className="rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00877F]">
              Operational monitoring
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-[#1E3532]">
              Donation monitoring
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#9AA9A2]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search donation, donor..."
                className="h-9 w-48 rounded-lg border border-[#DDE8E1] pl-8 pr-3 text-xs outline-none focus:border-[#0B8B7F]"
              />
            </div>
            <Link
              to="/dashboard/donations"
              className="rounded-lg bg-[#F1F7F2] p-2 text-[#087C70]"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-xs">
            <thead>
              <tr className="border-b border-[#E9EFEB] text-[10px] uppercase tracking-wide text-[#8A9A93]">
                <th className="pb-3 font-bold">Donation</th>
                <th className="pb-3 font-bold">Donor / business</th>
                <th className="pb-3 font-bold">Employee</th>
                <th className="pb-3 font-bold">Food</th>
                <th className="pb-3 font-bold">Location</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleDonations.map((donation, index) => {
                const donor = userById.get(donation.donorId) as any;
                const business = businessByUser.get(donation.donorId) as any;
                const employee = donation.assignedEmployeeId
                  ? (employeeById.get(donation.assignedEmployeeId) as any)
                  : undefined;
                return (
                  <tr
                    key={donation._id || (donation as any).id || index}
                    className="border-b border-[#F0F3F0] last:border-0 hover:bg-[#FAFCFA]"
                  >
                    <td className="py-3 font-bold text-[#173B38]">
                      #{String(donation._id || donation.id || "0000000").slice(-7).toUpperCase()}
                      <p className="mt-1 font-normal text-[#9AA9A2]">
                        {new Date(donation.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-3 text-[#536B63]">
                      {business?.businessName || donor?.name || "Unknown donor"}
                    </td>
                    <td className="py-3 text-[#536B63]">
                      {employee?.employeeId || "Unassigned"}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={getFoodImage(donation.foodCategory)}
                          alt=""
                          className="h-7 w-7 rounded-lg object-cover"
                        />
                        <span className="font-semibold text-[#41645B]">
                          {donation.foodName}
                          <br />
                          <span className="font-normal text-[#9AA9A2]">
                            {donation.quantityKg} kg
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="max-w-[150px] truncate py-3 text-[#71817C]">
                      {donation.pickupAddress}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={donation.status} />
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        className="rounded-lg border border-[#DDE8E1] px-2.5 py-1.5 text-[10px] font-bold text-[#41645B] hover:bg-[#F1F7F2]"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <motion.section
          variants={fadeUp}
          className="rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00877F]">
                Analytics center
              </p>
              <h2 className="mt-1 text-xl font-extrabold text-[#1E3532]">
                Platform growth
              </h2>
            </div>
            <div className="flex rounded-lg bg-[#F3F7F3] p-1">
              {["Today", "7 days", "30 days", "3 months", "1 year"].map(
                (item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setRange(item)}
                    className={`rounded-md px-2.5 py-1.5 text-[10px] font-bold ${range === item ? "bg-white text-[#087C70] shadow-sm" : "text-[#8A9A93]"}`}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
          </div>
          <div className="mt-7 flex h-44 items-end gap-2 border-b border-[#E6EAE4]">
            {[35, 48, 42, 61, 55, 72, 65, 84, 76, 92, 87, 100].map(
              (height, index) => (
                <div
                  key={index}
                  className="group flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className="w-full max-w-[28px] rounded-t-lg bg-[#9AD8C5] transition-all group-hover:bg-[#0B8B7F]"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[9px] text-[#9AA9A2]">{index + 1}</span>
                </div>
              ),
            )}
          </div>
          <div className="mt-4 flex gap-5 text-[11px] text-[#71817C]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#0B8B7F]" /> Donations
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#F6C85F]" /> Food
              rescued
            </span>
          </div>
        </motion.section>
        <motion.section
          variants={fadeUp}
          className="rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm sm:p-6"
        >
          <SectionTitle
            eyebrow="Geo analytics"
            title="Donation activity map"
            action={<Globe2 className="h-5 w-5 text-[#0B8B7F]" />}
          />
          <div className="relative h-52 overflow-hidden rounded-2xl bg-[#EAF3EC]">
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "linear-gradient(#c8ddd0 1px, transparent 1px), linear-gradient(90deg, #c8ddd0 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="absolute left-[24%] top-[42%] h-12 w-12 animate-pulse rounded-full bg-[#F6C85F]/45" />
            <div className="absolute left-[24%] top-[42%] h-3 w-3 rounded-full bg-[#D97728]" />
            <div className="absolute left-[65%] top-[28%] h-16 w-16 rounded-full bg-[#0B8B7F]/20" />
            <div className="absolute left-[65%] top-[28%] h-3 w-3 rounded-full bg-[#0B8B7F]" />
            <div className="absolute left-[51%] top-[68%] h-10 w-10 rounded-full bg-[#3569A8]/25" />
            <div className="absolute left-[51%] top-[68%] h-3 w-3 rounded-full bg-[#3569A8]" />
            <div className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-2.5 py-2 text-[10px] shadow-sm">
              <p className="font-bold text-[#173B38]">3 hotspots</p>
              <p className="text-[#71817C]">12 active locations</p>
            </div>
          </div>
        </motion.section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.section
          variants={fadeUp}
          className="rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm"
        >
          <SectionTitle
            eyebrow="Routing analytics"
            title="Where food goes"
            action={<BarChart3 className="h-5 w-5 text-[#0B8B7F]" />}
          />
          <div className="mt-5 flex items-center gap-6">
            <div
              className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full"
              style={{ background: `conic-gradient(#0B8B7F 74%, #F6C85F 74%)` }}
            >
              <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-xl font-extrabold text-[#173B38]">
                  {foodKg} kg
                </span>
                <span className="text-[9px] text-[#8A9A93]">total</span>
              </div>
            </div>
            <div className="space-y-3 text-xs">
              <p className="flex items-center gap-2 text-[#536B63]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#0B8B7F]" /> Human
                consumption <b>74%</b>
              </p>
              <p className="flex items-center gap-2 text-[#536B63]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#F6C85F]" /> Waste
                processing <b>26%</b>
              </p>
              <p className="text-[10px] leading-4 text-[#9AA9A2]">
                Only food classified as unsuitable for people should be routed
                to processing.
              </p>
            </div>
          </div>
        </motion.section>
        <motion.section
          variants={fadeUp}
          className="rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm"
        >
          <SectionTitle
            eyebrow="Team analytics"
            title="Employee performance"
            action={
              <Link
                to="/dashboard/employees"
                className="text-xs font-bold text-[#087C70]"
              >
                View all
              </Link>
            }
          />
          <div className="space-y-4">
            {(employees || []).slice(0, 4).map((employee, index) => (
              <div key={employee._id || employee.id || index}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#41645B]">
                    {index + 1}. {employee.employeeId || `EMP-${index + 1}`}
                  </span>
                  <span className="text-[#71817C]">
                    {employee.totalDeliveries || 0} pickups ·{" "}
                    {(employee.rating || 5.0).toFixed(1)}★
                  </span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-[#E9F0EB]">
                  <div
                    className="h-full rounded-full bg-[#0B8B7F]"
                    style={{
                      width: `${Math.min(100, (employee.totalDeliveries || 0) * 12 + 35)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.section>
        <motion.section
          variants={fadeUp}
          className="rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm"
        >
          <SectionTitle
            eyebrow="Waste processing"
            title="Biogas partners"
            action={
              <Link
                to="/dashboard/biogas-partners"
                className="text-xs font-bold text-[#087C70]"
              >
                Manage
              </Link>
            }
          />
          <div className="space-y-3">
            {(partners || []).slice(0, 3).map((partner, index) => (
              <div
                key={partner._id || partner.id || index}
                className="flex items-center justify-between rounded-xl bg-[#F5F9F5] p-3"
              >
                <div>
                  <p className="text-xs font-bold text-[#173B38]">
                    {partner.partnerName || "Partner"}
                  </p>
                  <p className="mt-1 text-[10px] text-[#71817C]">
                    {partner.capacityKgPerWeek || 5000} kg/week ·{" "}
                    {partner.verificationStatus || "verified"}
                  </p>
                </div>
                <StatusBadge status={partner.verificationStatus || "verified"} />
              </div>
            ))}
            {partners.length === 0 && (
              <p className="text-xs text-[#8A9A93]">
                No partners registered yet.
              </p>
            )}
          </div>
        </motion.section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.section
          variants={fadeUp}
          className="rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm"
        >
          <SectionTitle
            eyebrow="Platform health"
            title="All systems operational"
            action={<Gauge className="h-5 w-5 text-[#0B8B7F]" />}
          />
          <div className="space-y-3">
            {([
              ["API", Radio],
              ["Database", Database],
              ["Authentication", ShieldCheck],
              ["Notifications", Bell],
              ["Tracking", MapPin],
            ] as [string, React.ComponentType<{ className?: string }>][]).map(([name, Icon]) => (
              <div
                key={String(name)}
                className="flex items-center justify-between rounded-xl border border-[#EEF2EE] px-3 py-2.5"
              >
                <span className="flex items-center gap-2 text-xs font-semibold text-[#536B63]">
                  <Icon className="h-3.5 w-3.5 text-[#0B8B7F]" /> {name}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#16856E]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3BB273]" />{" "}
                  Operational
                </span>
              </div>
            ))}
          </div>
        </motion.section>
        <motion.section
          variants={fadeUp}
          className="rounded-3xl border border-[#F0D7D0] bg-[#FFF7F1] p-5 shadow-sm"
        >
          <SectionTitle
            eyebrow="Attention center"
            title="Issues & complaints"
            action={<MessageSquareWarning className="h-5 w-5 text-[#C65A35]" />}
          />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#754333]">Open issues</span>
              <span className="text-xl font-extrabold text-[#C65A35]">
                {Math.max(1, delayed.length)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#754333]">Investigating</span>
              <span className="text-xl font-extrabold text-[#D97728]">2</span>
            </div>
            <Link
              to="/dashboard/notifications"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#A64F31]"
            >
              Review issue center <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.section>
        <motion.section
          variants={fadeUp}
          className="rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm"
        >
          <SectionTitle
            eyebrow="Audit log"
            title="Recent admin activity"
            action={<FileText className="h-5 w-5 text-[#3569A8]" />}
          />
          <div className="space-y-3 text-xs">
            <p className="flex gap-2 text-[#536B63]">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#0B8B7F]" />{" "}
              Business verification queue reviewed{" "}
              <span className="ml-auto text-[10px] text-[#9AA9A2]">Now</span>
            </p>
            <p className="flex gap-2 text-[#536B63]">
              <UserCheck className="h-3.5 w-3.5 shrink-0 text-[#3569A8]" />{" "}
              Employee assignment updated{" "}
              <span className="ml-auto text-[10px] text-[#9AA9A2]">12m</span>
            </p>
            <p className="flex gap-2 text-[#536B63]">
              <Bell className="h-3.5 w-3.5 shrink-0 text-[#D49A2A]" />{" "}
              Notification broadcast sent{" "}
              <span className="ml-auto text-[10px] text-[#9AA9A2]">1h</span>
            </p>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}

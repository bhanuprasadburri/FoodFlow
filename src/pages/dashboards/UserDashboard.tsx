import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import {
  EmptyState,
  StatusBadge,
  getFoodImage,
} from "@/components/dashboard/SharedComponents";
import { Link } from "react-router";
import { getIndiaGreeting } from "@/lib/time";
import { type ReactNode } from "react";
import {
  ArrowRight,
  Award,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Cloud,
  Download,
  Flame,
  Heart,
  Leaf,
  MapPin,
  MessageSquareWarning,
  Package,
  Plus,
  Recycle,
  Sparkles,
  Target,
  TrendingUp,
  Truck,
  Utensils,
} from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };
const statusSteps = [
  { key: "pending", label: "Submitted", icon: Package },
  { key: "accepted", label: "Verified", icon: CheckCircle2 },
  { key: "on_the_way", label: "Agent assigned", icon: Truck },
  { key: "picked_up", label: "Picked up", icon: MapPin },
  { key: "delivered", label: "Delivered", icon: Heart },
  { key: "completed", label: "Completed", icon: Check },
];

function AnimatedValue({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  return (
    <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      {value.toLocaleString()}
      {suffix}
    </motion.span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00877F]">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-[#173B38]">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

function stepIndex(status: string) {
  return Math.max(
    0,
    statusSteps.findIndex((step) => step.key === status),
  );
}

import { SEED_DONATIONS } from "@/lib/mock-data";

export default function UserDashboard() {
  const { user } = useAuth();
  const queryDonations =
    useQuery(
      api.mutations.donations.listByDonor,
      user?._id ? { donorId: user._id } : "skip",
    );
  const storedDonations = (() => {
    try {
      const stored = localStorage.getItem("foodflow_all_donations") || localStorage.getItem("foodflow_donor_donations");
      return stored ? JSON.parse(stored) : SEED_DONATIONS;
    } catch {
      return SEED_DONATIONS;
    }
  })();
  const donations = (queryDonations && queryDonations.length > 0) ? queryDonations : storedDonations;
  const completed = donations.filter(
    (donation) => donation.status === "completed",
  );
  const active = donations.filter(
    (donation) => !["completed", "cancelled"].includes(donation.status),
  );
  const totalKg = completed.reduce(
    (sum, donation) => sum + donation.quantityKg,
    0,
  );
  const totalServed = completed.reduce(
    (sum, donation) => sum + donation.servesPeople,
    0,
  );
  const co2Avoided = Math.round(totalKg * 2.5);
  const consistency = Math.min(100, completed.length * 10);
  const activeDonation = active[0];
  const stats = [
    {
      label: "Total donations",
      value: donations.length,
      icon: Heart,
      tint: "bg-[#EAF7F1] text-[#00877F]",
    },
    {
      label: "Successful",
      value: completed.length,
      icon: CheckCircle2,
      tint: "bg-[#EAF7F1] text-[#00877F]",
    },
    {
      label: "Food donated",
      value: totalKg,
      suffix: " kg",
      icon: Package,
      tint: "bg-[#FFF4DB] text-[#B7791F]",
    },
    {
      label: "People served",
      value: totalServed,
      suffix: "+",
      icon: Utensils,
      tint: "bg-[#EAF0FA] text-[#3569A8]",
    },
    {
      label: "CO2 avoided",
      value: co2Avoided,
      suffix: " kg",
      icon: Cloud,
      tint: "bg-[#EEF0FC] text-[#635BBD]",
    },
    {
      label: "Active now",
      value: active.length,
      icon: Clock3,
      tint: "bg-[#FFF0EB] text-[#C65A35]",
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="mx-auto max-w-[1500px] space-y-8"
    >
      <motion.section
        variants={fadeUp}
        className="relative overflow-hidden rounded-[28px] bg-[#0B5B57] px-6 py-7 text-white shadow-[0_18px_50px_rgba(0,97,95,0.16)] sm:px-9 sm:py-9"
      >
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[36px] border-white/10" />
        <div className="absolute bottom-[-100px] right-28 h-56 w-56 rounded-full border-[28px] border-[#C6E7D2]/10" />
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#C6E7D2]">
            <Leaf className="h-4 w-4" /> Donor command center
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {getIndiaGreeting()}, {user?.name?.split(" ")[0] || "Donor"}.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#D8F2E2] sm:text-base">
            Every donation helps turn surplus food into meaningful impact. Your
            surplus food is not waste - it can become someone&apos;s meal.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/dashboard/create-donation"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F6C85F] px-4 py-3 text-sm font-extrabold text-[#173B38] shadow-lg transition-transform hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" /> Donate surplus food
            </Link>
            <Link
              to="/dashboard/tracking"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/20"
            >
              <MapPin className="h-4 w-4" /> Track a donation
            </Link>
          </div>
        </div>
        <div className="relative z-10 mt-8 grid max-w-xl grid-cols-3 gap-4 border-t border-white/15 pt-5 sm:absolute sm:bottom-8 sm:right-9 sm:mt-0 sm:w-[390px] sm:border-t-0 sm:pt-0">
          <div>
            <p className="text-2xl font-extrabold">
              <AnimatedValue value={completed.length} />
            </p>
            <p className="mt-1 text-[11px] text-[#C6E7D2]">Successful</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold">
              <AnimatedValue value={totalKg} suffix=" kg" />
            </p>
            <p className="mt-1 text-[11px] text-[#C6E7D2]">Food rescued</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold">
              <AnimatedValue value={totalServed} suffix="+" />
            </p>
            <p className="mt-1 text-[11px] text-[#C6E7D2]">People served</p>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={fadeUp}
        className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#E6EAE4] bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.tint}`}
              >
                <stat.icon className="h-4 w-4" />
              </div>
              <TrendingUp className="h-4 w-4 text-[#68B890]" />
            </div>
            <p className="mt-5 text-2xl font-extrabold tracking-tight text-[#173B38]">
              <AnimatedValue value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-1 text-xs font-medium text-[#71817C]">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <motion.section
          variants={fadeUp}
          className="rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm sm:p-6"
        >
          <SectionHeading
            eyebrow="In motion"
            title="Your active donation"
            action={
              <Link
                to="/dashboard/tracking"
                className="text-xs font-bold text-[#00877F]"
              >
                Open tracking <ArrowRight className="inline h-3.5 w-3.5" />
              </Link>
            }
          />
          {activeDonation ? (
            <div className="rounded-2xl bg-[#F5F9F5] p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={getFoodImage(activeDonation.foodCategory)}
                    alt=""
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-[#173B38]">
                      {activeDonation.foodName}
                    </h3>
                    <p className="mt-1 text-xs text-[#71817C]">
                      {activeDonation.quantity} · {activeDonation.pickupAddress}
                    </p>
                  </div>
                </div>
                <StatusBadge status={activeDonation.status} />
              </div>
              <div className="mt-7 flex items-start">
                {statusSteps.map((step, index) => {
                  const currentStep = stepIndex(activeDonation.status);
                  const complete = index <= currentStep;
                  return (
                    <div
                      key={step.key}
                      className="flex min-w-0 flex-1 items-start"
                    >
                      <div className="flex min-w-0 flex-col items-center text-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${complete ? "border-[#0B8B7F] bg-[#0B8B7F] text-white" : "border-[#DCE6DF] bg-white text-[#A8B9B1]"}`}
                        >
                          {complete ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <step.icon className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <span
                          className={`mt-2 hidden text-[10px] font-semibold leading-3 sm:block ${complete ? "text-[#41645B]" : "text-[#9AA9A2]"}`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div
                          className={`mt-4 h-0.5 flex-1 ${index < currentStep ? "bg-[#0B8B7F]" : "bg-[#DCE6DF]"}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#E2EBE3] pt-4 text-xs text-[#71817C]">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" /> Pickup window pending
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5" /> Employee assignment pending
                </span>
                <span className="font-semibold text-[#00877F]">
                  ID #{String(activeDonation._id || (activeDonation as any).id || "00000000").slice(-8).toUpperCase()}
                </span>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Package}
              title="No active donation"
              description="Your next donation can start a new impact story."
            />
          )}
        </motion.section>
        <motion.section
          variants={fadeUp}
          className="overflow-hidden rounded-3xl border border-[#E6EAE4] bg-[#FFF9EE] shadow-sm"
        >
          <div className="p-5 sm:p-6">
            <SectionHeading
              eyebrow="Make it count"
              title="Your donor journey"
              action={<Award className="h-5 w-5 text-[#C58B25]" />}
            />
            <p className="text-sm leading-6 text-[#71817C]">
              You are building a habit that keeps good food in the community.
            </p>
            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-2xl font-extrabold text-[#173B38]">
                  {completed.length < 5
                    ? "Active Donor"
                    : completed.length < 10
                      ? "Community Supporter"
                      : "Food Rescue Champion"}
                </p>
                <p className="mt-1 text-xs text-[#8D8D76]">
                  {completed.length} verified donations
                </p>
              </div>
              <div className="rounded-full bg-[#F6C85F]/30 p-3 text-[#B7791F]">
                <Target className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#F0E6C9]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(consistency, 8)}%` }}
                transition={{ duration: 1 }}
                className="h-full rounded-full bg-[#D49A2A]"
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] font-medium text-[#8D8D76]">
              <span>Beginner</span>
              <span>Champion</span>
            </div>
          </div>
          <div className="border-t border-[#F0E6C9] bg-[#FFF4D7] px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-[#D97728]" />
                <span className="text-sm font-bold text-[#754E1A]">
                  {Math.max(completed.length, 1)} month streak
                </span>
              </div>
              <span className="text-xs font-semibold text-[#9B762C]">
                Keep going
              </span>
            </div>
          </div>
        </motion.section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          variants={fadeUp}
          className="rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm sm:p-6"
        >
          <SectionHeading
            eyebrow="Recent activity"
            title="My donations"
            action={
              <Link
                to="/dashboard/donations"
                className="text-xs font-bold text-[#00877F]"
              >
                View history <ChevronRight className="inline h-3.5 w-3.5" />
              </Link>
            }
          />
          {donations.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Your first donation is waiting"
              description="Create a donation and start building your impact record."
            />
          ) : (
            <div className="divide-y divide-[#EEF1ED]">
              {(donations || []).slice(0, 5).map((donation, index) => (
                <motion.div
                  key={donation._id || (donation as any).id || index}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <img
                    src={getFoodImage(donation.foodCategory)}
                    alt=""
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#173B38]">
                      {donation.foodName}
                    </p>
                    <p className="mt-0.5 text-xs text-[#8A9A93]">
                      {donation.quantity} ·{" "}
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={donation.status} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
        <motion.section
          variants={fadeUp}
          className="rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm sm:p-6"
        >
          <SectionHeading
            eyebrow="Based on your activity"
            title="Smart suggestions"
            action={<Sparkles className="h-5 w-5 text-[#D49A2A]" />}
          />
          <div className="space-y-3">
            <div className="flex gap-3 rounded-2xl bg-[#F5F9F5] p-3.5">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#00877F]" />
              <p className="text-xs leading-5 text-[#536B63]">
                Nearby pickup availability is usually higher between 6 PM and 8
                PM.
              </p>
            </div>
            <div className="flex gap-3 rounded-2xl bg-[#FFF9EE] p-3.5">
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#C58B25]" />
              <p className="text-xs leading-5 text-[#536B63]">
                Consider donating before food reaches its best-before time.
              </p>
            </div>
            <div className="flex gap-3 rounded-2xl bg-[#F1F6FB] p-3.5">
              <Recycle className="mt-0.5 h-4 w-4 shrink-0 text-[#3569A8]" />
              <p className="text-xs leading-5 text-[#536B63]">
                Your donations have helped divert {totalKg} kg from waste so
                far.
              </p>
            </div>
          </div>
        </motion.section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <motion.section
          id="impact"
          variants={fadeUp}
          className="overflow-hidden rounded-3xl bg-[#173B38] p-6 text-white shadow-[0_18px_45px_rgba(23,59,56,0.14)] sm:p-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9AD8C5]">
                Personal sustainability report
              </p>
              <h2 className="mt-2 text-2xl font-extrabold">Your impact</h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-[#C9E5D9]">
                Small actions compound. This is the measurable difference your
                verified donations are making.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <Leaf className="h-6 w-6 text-[#9AD8C5]" />
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-2xl font-extrabold">{totalKg} kg</p>
              <p className="mt-1 text-xs text-[#A9CEC0]">Food diverted</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold">{totalServed}+</p>
              <p className="mt-1 text-xs text-[#A9CEC0]">Meals supported</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold">{co2Avoided} kg</p>
              <p className="mt-1 text-xs text-[#A9CEC0]">CO2 avoided</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold">{consistency}%</p>
              <p className="mt-1 text-xs text-[#A9CEC0]">Consistency</p>
            </div>
          </div>
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between text-xs text-[#A9CEC0]">
              <span>Monthly donation trend</span>
              <span>Last 6 months</span>
            </div>
            <div className="flex h-24 items-end gap-2 border-b border-white/15">
              {[
                32,
                48,
                39,
                68,
                54,
                Math.max(24, Math.min(88, completed.length * 9)),
              ].map((height, index) => (
                <div
                  key={index}
                  className="group flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className="w-full max-w-[32px] rounded-t-lg bg-[#9AD8C5] transition-all group-hover:bg-[#F6C85F]"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-[#9ABEB0]">
                    {["May", "Jun", "Jul", "Aug", "Sep", "Now"][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
        <motion.section
          id="rewards"
          variants={fadeUp}
          className="rounded-3xl border border-[#E6EAE4] bg-white p-6 shadow-sm"
        >
          <SectionHeading
            eyebrow="Recognition"
            title="Milestone badges"
            action={<Award className="h-5 w-5 text-[#D49A2A]" />}
          />
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "First donation",
                done: completed.length >= 1,
                icon: Heart,
              },
              {
                label: "5 donations",
                done: completed.length >= 5,
                icon: Package,
              },
              { label: "100 kg saved", done: totalKg >= 100, icon: Recycle },
            ].map((badge) => (
              <div
                key={badge.label}
                className={`rounded-2xl p-3 text-center ${badge.done ? "bg-[#FFF7DF] text-[#B7791F]" : "bg-[#F4F6F3] text-[#AAB7B0]"}`}
              >
                <badge.icon className="mx-auto h-5 w-5" />
                <p className="mt-2 text-[10px] font-bold leading-3">
                  {badge.label}
                </p>
                {badge.done && <Check className="mx-auto mt-2 h-3 w-3" />}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-[#F5F9F5] p-4">
            <div className="flex justify-between text-xs font-bold text-[#41645B]">
              <span>Next badge</span>
              <span>{completed.length}/10 donations</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-[#DCECE1]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, completed.length * 10)}%` }}
                className="h-full rounded-full bg-[#0B8B7F]"
              />
            </div>
            <p className="mt-3 text-xs text-[#71817C]">
              Keep your streak alive to become a Community Champion.
            </p>
          </div>
        </motion.section>
      </div>

      <motion.section variants={fadeUp} className="grid gap-4 sm:grid-cols-3">
        <Link
          to="/dashboard/create-donation"
          className="group rounded-2xl bg-[#F6C85F] p-5 text-[#173B38] transition-transform hover:-translate-y-1"
        >
          <Plus className="h-5 w-5" />
          <p className="mt-8 text-base font-extrabold">Donate food now</p>
          <p className="mt-1 text-xs text-[#6F581F]">
            Turn surplus into a meal.
          </p>
          <ArrowRight className="mt-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          to="/dashboard/tracking"
          className="group rounded-2xl bg-[#EAF7F1] p-5 text-[#173B38] transition-transform hover:-translate-y-1"
        >
          <MapPin className="h-5 w-5 text-[#00877F]" />
          <p className="mt-8 text-base font-extrabold">Track my donation</p>
          <p className="mt-1 text-xs text-[#71817C]">
            See every handoff clearly.
          </p>
          <ArrowRight className="mt-3 h-4 w-4 text-[#00877F] transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          to="/dashboard/donations"
          className="group rounded-2xl bg-white p-5 text-[#173B38] shadow-sm ring-1 ring-[#E6EAE4] transition-transform hover:-translate-y-1"
        >
          <Download className="h-5 w-5 text-[#3569A8]" />
          <p className="mt-8 text-base font-extrabold">Impact receipt</p>
          <p className="mt-1 text-xs text-[#71817C]">
            Review your donation history.
          </p>
          <ArrowRight className="mt-3 h-4 w-4 text-[#3569A8] transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.section>
      <motion.section
        variants={fadeUp}
        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#F0D7C9] bg-[#FFF7F1] px-5 py-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FBE2D4] text-[#C65A35]">
            <MessageSquareWarning className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#633B2A]">
              Something went wrong with a pickup?
            </p>
            <p className="mt-0.5 text-xs text-[#916D5A]">
              Report a delay, condition issue, or incorrect detail.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="rounded-xl border border-[#EABFA7] bg-white px-3 py-2 text-xs font-bold text-[#A64F31] hover:bg-[#FFF0E7]"
        >
          Report an issue
        </button>
      </motion.section>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { StatCard, StatusBadge, EmptyState, foodImages, getFoodImage } from "@/components/dashboard/SharedComponents";
import { Building2, Heart, BarChart3, TrendingUp, Star, Package, Users, Briefcase, Plus, Award, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";
import { SEED_DONATIONS, SEED_BUSINESSES } from "@/lib/mock-data";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

export default function BusinessDashboard() {
  const { user } = useAuth();
  const business = useQuery(api.mutations.businesses.getByUserId, user?._id ? { userId: user._id } : "skip");
  const donations = useQuery(api.mutations.donations.list);
  const stats = useQuery(api.mutations.donations.getStats);

  const fallbackDonations = SEED_DONATIONS.filter((d) => d.donorType === "business");
  const myDonations = (donations && donations.length > 0)
    ? donations.filter((d) => d.donorType === "business")
    : fallbackDonations;
  const completed = myDonations.filter((d) => d.status === "completed" || d.status === "delivered").length;
  const totalKg = myDonations.reduce((a, d) => a + (d.quantityKg || 0), 0);
  const impactScore = business?.impactScore ?? 88;
  const businessName = business?.businessName || user?.name || "Green Leaf Bakery & Deli";

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
      {/* Hero banner */}
      <motion.div variants={fadeUp} className="relative rounded-3xl overflow-hidden h-48 sm:h-56">
        <img src={foodImages.restaurant} alt="Restaurant partner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#E65100]/90 to-[#E65100]/60" />
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {businessName} 🏨
            </h1>
            <p className="text-orange-100 mt-1">Manage surplus food donations and track your sustainability impact.</p>
            <Link to="/dashboard/create-donation" className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-[#E65100] hover:bg-orange-50 transition-colors">
              <Plus className="h-4 w-4" /> Donate Surplus
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Donations" value={myDonations.length} icon={Heart} color="emerald" trend={{ value: "+12%", positive: true }} />
        <StatCard title="Completed" value={completed} icon={CheckCircle2} color="emerald" />
        <StatCard title="Food Rescued" value={`${totalKg.toFixed(0)} kg`} icon={Package} color="emerald" />
        <StatCard title="Impact Score" value={impactScore} icon={Award} color="emerald" />
      </motion.div>

      {/* Impact score + subscription */}
      <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-[#00615F] p-6 text-white relative overflow-hidden">
          <div className="absolute -top-6 -right-6 h-32 w-32 bg-white/10 rounded-full" />
          <Award className="h-8 w-8 text-emerald-200 mb-3" />
          <h3 className="text-xl font-extrabold">Your Impact Score</h3>
          <p className="text-5xl font-extrabold mt-2">{impactScore}</p>
          <p className="text-sm text-emerald-100 mt-1">Based on verified donations, successful deliveries, and consistent activity.</p>
          <div className="mt-4 flex gap-6">
            <div>
              <p className="text-2xl font-extrabold">{myDonations.length}</p>
              <p className="text-xs text-emerald-200">Total Donations</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold">{completed}</p>
              <p className="text-xs text-emerald-200">Successful</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="h-5 w-5 text-[#E65100]" />
            <h3 className="text-lg font-extrabold text-gray-900">Subscription Plan</h3>
          </div>
          <div className="rounded-2xl bg-[#FFF3E0] p-4 mb-4">
            <p className="text-sm font-bold text-[#E65100] capitalize">{business?.subscriptionPlan || "Free"} Plan</p>
            <p className="text-xs text-gray-500 mt-0.5">Active subscription</p>
          </div>
          <p className="text-sm text-gray-500">Upgrade to unlock advanced analytics, priority matching, and compliance reports.</p>
          <Link to="/dashboard/subscription" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#E65100] hover:underline">
            View Plans →
          </Link>
        </div>
      </motion.div>

      {/* Recent donations */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-gray-900">Recent Donations</h2>
          <Link to="/dashboard/donations" className="text-sm font-bold text-[#00615F] hover:underline">View All →</Link>
        </div>
        {myDonations.length === 0 ? (
          <EmptyState icon={Heart} title="No donations yet" description="Start donating surplus food to build your impact score." />
        ) : (
          <div className="space-y-3">
            {myDonations.slice(0, 5).map((d, i) => (
              <motion.div
                key={d._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 rounded-2xl bg-white border border-gray-100 p-4 hover:shadow-md transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl overflow-hidden shrink-0">
                  <img src={getFoodImage(d.foodCategory)} alt={d.foodCategory} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{d.foodName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{d.quantityKg} kg · {d.servesPeople} people · {new Date(d.createdAt).toLocaleDateString()}</p>
                </div>
                <StatusBadge status={d.status} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

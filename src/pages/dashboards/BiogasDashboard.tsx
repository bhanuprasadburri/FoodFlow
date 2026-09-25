import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { StatCard, StatusBadge, EmptyState, foodImages } from "@/components/dashboard/SharedComponents";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Leaf, Package, CheckCircle2, CalendarClock, FileText, Zap, Droplets } from "lucide-react";
import { Link } from "react-router";
import { SEED_AGREEMENTS, SEED_SUPPLY_REQUESTS } from "@/lib/mock-data";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

export default function BiogasDashboard() {
  const { user } = useAuth();
  const partner = useQuery(api.mutations.biogas.getByUserId, user?._id ? { userId: user._id } : "skip");
  const querySupplies = partner ? useQuery(api.mutations.biogas.listSupplies, { biogasPartnerId: partner._id }) : undefined;
  const queryAgreements = partner ? useQuery(api.mutations.biogas.listAgreements, { biogasPartnerId: partner._id }) : undefined;
  const partnerStats = partner ? useQuery(api.mutations.biogas.getPartnerStats, { biogasPartnerId: partner._id }) : undefined;

  const agreements = (queryAgreements && queryAgreements.length > 0) ? queryAgreements : SEED_AGREEMENTS;
  const supplies = (querySupplies && querySupplies.length > 0) ? querySupplies : SEED_SUPPLY_REQUESTS.map((s) => ({
    _id: s._id,
    category: s.category,
    quantityKg: s.quantity,
    createdAt: Date.now() - 3600000 * 24,
    supplyStatus: s.status,
  }));

  const totalSuppliesCount = partnerStats?.total ?? supplies.length;
  const processedCount = partnerStats?.processed ?? 4;
  const scheduledCount = partnerStats?.scheduled ?? 2;
  const totalCollectedKg = partnerStats?.totalKg ?? 870;

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
      {/* Hero banner */}
      <motion.div variants={fadeUp} className="relative rounded-3xl overflow-hidden h-48 sm:h-56">
        <img src={foodImages.biogas} alt="Waste to energy" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2E7D32]/90 to-[#2E7D32]/60" />
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {partner?.partnerName || user?.name || "Green Energy Biogas Plant"} 🌱
            </h1>
            <p className="text-green-100 mt-1">Turning food waste into sustainable energy and resources.</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Supplies" value={totalSuppliesCount} icon={Package} color="emerald" />
        <StatCard title="Processed" value={processedCount} icon={CheckCircle2} color="emerald" />
        <StatCard title="Scheduled" value={scheduledCount} icon={CalendarClock} color="blue" />
        <StatCard title="Total Collected" value={`${totalCollectedKg} kg`} icon={Leaf} color="emerald" />
      </motion.div>

      {/* Waste-to-energy impact */}
      <motion.div variants={fadeUp} className="rounded-3xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative h-48 md:h-auto">
            <img src={foodImages.farm} alt="Organic farm" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#2E7D32]/80" />
          </div>
          <div className="bg-[#2E7D32] p-6 text-white flex flex-col justify-center">
            <h3 className="text-xl font-extrabold">Waste-to-Energy Impact</h3>
            <p className="text-green-100 mt-2 text-sm leading-relaxed">
              Food waste collected is converted into biogas energy, organic compost, and animal feed — keeping it out of landfills.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <Zap className="h-6 w-6 text-green-200 mx-auto mb-1" />
                <p className="text-xl font-extrabold">328 kWh</p>
                <p className="text-xs text-green-200">Energy Generated</p>
              </div>
              <div className="text-center">
                <Leaf className="h-6 w-6 text-green-200 mx-auto mb-1" />
                <p className="text-xl font-extrabold">1.8 T</p>
                <p className="text-xs text-green-200">CO₂ Offset</p>
              </div>
              <div className="text-center">
                <Droplets className="h-6 w-6 text-green-200 mx-auto mb-1" />
                <p className="text-xl font-extrabold">93%</p>
                <p className="text-xs text-green-200">Processing Rate</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Agreements + supplies */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div variants={fadeUp}>
          <Card className="border-gray-100 rounded-2xl bg-white">
            <CardHeader className="pb-2 px-6 pt-6">
              <h3 className="text-base font-extrabold text-gray-900">Active Agreements</h3>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {!agreements || agreements.length === 0 ? (
                <EmptyState icon={FileText} title="No agreements" description="Create a supply agreement to start receiving food waste." />
              ) : (
                <div className="space-y-3">
                  {agreements.filter((a) => a.status === "active").map((a) => (
                    <div key={a._id} className="rounded-xl border border-gray-100 p-4 hover:bg-[#FBF7F4] transition-colors">
                      <p className="text-sm font-bold text-gray-900">{a.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{a.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-bold text-[#00615F] bg-[#E8F5E9] px-2 py-0.5 rounded-full">{a.capacityKgPerWeek} kg/week</span>
                        <StatusBadge status={a.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card className="border-gray-100 rounded-2xl bg-white">
            <CardHeader className="pb-2 px-6 pt-6">
              <h3 className="text-base font-extrabold text-gray-900">Recent Supplies</h3>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {!supplies || supplies.length === 0 ? (
                <EmptyState icon={Package} title="No supplies yet" description="Supply requests from the platform will appear here." />
              ) : (
                <div className="space-y-3">
                  {supplies.slice(0, 5).map((s) => (
                    <div key={s._id} className="flex items-center justify-between rounded-xl border border-gray-100 p-3.5 hover:bg-[#FBF7F4] transition-colors">
                      <div>
                        <p className="text-sm font-bold text-gray-900 capitalize">{s.category} waste</p>
                        <p className="text-xs text-gray-500">{s.quantityKg} kg · {new Date(s.createdAt).toLocaleDateString()}</p>
                      </div>
                      <StatusBadge status={s.supplyStatus.replace(/_/g, " ").includes("processed") ? "completed" : s.supplyStatus} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Total processed */}
      <motion.div variants={fadeUp} className="rounded-3xl bg-[#00615F] p-6 text-white flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-100">Total Waste Processed</p>
          <p className="text-3xl font-extrabold mt-1">{partner?.totalCollectedKg ?? 0} kg</p>
          <p className="text-sm text-emerald-100 mt-0.5">Converting food waste into sustainable energy for communities</p>
        </div>
        <Leaf className="h-12 w-12 text-emerald-200" />
      </motion.div>
    </motion.div>
  );
}

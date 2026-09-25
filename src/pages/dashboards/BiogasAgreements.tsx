import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/dashboard/SharedComponents";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { FileText, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { SEED_AGREEMENTS } from "@/lib/mock-data";

export default function BiogasAgreements() {
  const { user } = useAuth();
  const partner = useQuery(api.mutations.biogas.getByUserId, user?._id ? { userId: user._id } : "skip");
  const queryAgreements = partner ? useQuery(api.mutations.biogas.listAgreements, { biogasPartnerId: partner._id }) : undefined;
  const createAgreement = useMutation(api.mutations.biogas.createAgreement);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", capacityKgPerWeek: "", acceptedCategories: "cooked,raw,produce" });
  const [localAgreements, setLocalAgreements] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("foodflow_biogas_agreements");
      return stored ? JSON.parse(stored) : SEED_AGREEMENTS;
    } catch {
      return SEED_AGREEMENTS;
    }
  });

  const agreements = (queryAgreements && queryAgreements.length > 0) ? queryAgreements : localAgreements;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAgreement = {
      _id: `agr-${Date.now()}`,
      title: form.title,
      description: form.description,
      capacityKgPerWeek: parseInt(form.capacityKgPerWeek) || 500,
      acceptedCategories: form.acceptedCategories.split(",").map((c) => c.trim()),
      status: "active",
      effectiveDate: "2026 - Active",
      subsidyRatePerKg: "₹8.50 / kg processed",
    };

    setLocalAgreements((prev) => [newAgreement, ...prev]);
    try {
      localStorage.setItem("foodflow_biogas_agreements", JSON.stringify([newAgreement, ...localAgreements]));
    } catch {
      // ignore
    }

    try {
      if (partner?._id) {
        await createAgreement({
          biogasPartnerId: partner._id,
          title: form.title,
          description: form.description,
          capacityKgPerWeek: parseInt(form.capacityKgPerWeek) || 0,
          acceptedCategories: form.acceptedCategories.split(",").map((c) => c.trim()),
        });
      }
    } catch {
      // offline fallback
    }

    toast.success("Supply agreement created and activated successfully.");
    setShowForm(false);
    setForm({ title: "", description: "", capacityKgPerWeek: "", acceptedCategories: "cooked,raw,produce" });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2"><FileText className="h-6 w-6 text-purple-500" /> Supply Agreements</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage food-waste supply agreements with FoodFlow.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-purple-600 hover:bg-purple-700 text-white"><Plus className="h-4 w-4 mr-1" /> New Agreement</Button>
      </div>

      {showForm && (
        <Card className="border-purple-200 shadow-sm bg-purple-50/30">
          <CardHeader className="pb-3"><CardTitle className="text-base font-bold text-gray-900">Create Supply Agreement</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Agreement Title *</label><Input placeholder="e.g., Weekly Food Waste Supply" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label><textarea rows={3} placeholder="Describe your capacity and requirements..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 resize-none" /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Capacity (kg/week) *</label><Input type="number" placeholder="e.g., 500" value={form.capacityKgPerWeek} onChange={(e) => setForm({ ...form, capacityKgPerWeek: e.target.value })} required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Accepted Categories</label><Input placeholder="cooked,raw,produce" value={form.acceptedCategories} onChange={(e) => setForm({ ...form, acceptedCategories: e.target.value })} /></div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">Create Agreement</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!agreements || agreements.length === 0 ? (
        <Card className="border-gray-200 shadow-sm"><CardContent><EmptyState icon={FileText} title="No agreements yet" description="Create your first supply agreement to start receiving food waste from FoodFlow." /></CardContent></Card>
      ) : (
        <div className="space-y-4">
          {agreements.map((a) => (
            <Card key={a._id} className="border-gray-200 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{a.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{a.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{a.capacityKgPerWeek} kg/week</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${a.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>{a.status}</span>
                      {a.acceptedCategories.map((c) => (<span key={c} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full capitalize">{c}</span>))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}

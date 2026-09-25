import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge, EmptyState } from "@/components/dashboard/SharedComponents";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Leaf, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SEED_BIOGAS } from "@/lib/mock-data";
import { useState } from "react";

const FALLBACK_BIOGAS = SEED_BIOGAS.map((b) => ({
  _id: b._id,
  partnerName: b.name,
  partnerType: "biogas_plant",
  city: b.location,
  address: b.location,
  capacityKgPerWeek: b.agreedWeeklyKg,
  totalCollectedKg: b.currentIntakeKg,
  verificationStatus: "verified",
}));

export default function AdminBiogas() {
  const queryPartners = useQuery(api.mutations.biogas.list);
  const verifyPartner = useMutation(api.mutations.biogas.verify);
  const [localPartners, setLocalPartners] = useState<any[]>(FALLBACK_BIOGAS);

  const partners = (queryPartners && queryPartners.length > 0) ? queryPartners : localPartners;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2"><Leaf className="h-6 w-6 text-purple-500" /> Biogas Partners</h1>
        <p className="text-sm text-gray-500 mt-1">Manage verified waste-processing and biogas partners.</p>
      </div>
      {!partners || partners.length === 0 ? (
        <Card className="border-gray-200 shadow-sm"><CardContent><EmptyState icon={Leaf} title="No partners" description="Registered biogas partners will appear here." /></CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((p) => (
            <Card key={p._id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 font-bold text-lg">{p.partnerName.charAt(0)}</div>
                  <div>
                    <p className="text-base font-bold text-gray-900">{p.partnerName}</p>
                    <p className="text-xs text-gray-500 capitalize">{p.partnerType.replace(/_/g, " ")} · {p.city || p.address}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">Capacity: {p.capacityKgPerWeek} kg/week · Collected: {p.totalCollectedKg} kg</p>
                <div className="flex items-center justify-between">
                  <StatusBadge status={p.verificationStatus} />
                  {p.verificationStatus === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={async () => { await verifyPartner({ partnerId: p._id, status: "verified" }); toast.success(`${p.partnerName} verified.`); }} className="bg-emerald-600 hover:bg-emerald-700 text-white"><CheckCircle2 className="h-4 w-4 mr-1" /> Approve</Button>
                      <Button size="sm" variant="outline" onClick={async () => { await verifyPartner({ partnerId: p._id, status: "rejected" }); toast.success(`${p.partnerName} rejected.`); }} className="text-red-600 border-red-200"><XCircle className="h-4 w-4 mr-1" /> Reject</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}

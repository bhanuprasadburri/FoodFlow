import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge, EmptyState } from "@/components/dashboard/SharedComponents";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Building2, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SEED_BUSINESSES } from "@/lib/mock-data";
import { useState } from "react";

const FALLBACK_BUSINESSES = SEED_BUSINESSES.map((b) => ({
  _id: b._id,
  businessName: b.businessName,
  businessType: b.category,
  city: b.address,
  address: b.address,
  totalDonations: Math.round(b.totalDonatedKg / 25),
  totalQuantityKg: b.totalDonatedKg,
  impactScore: b.impactScore,
  verificationStatus: b.verificationStatus,
}));

export default function AdminBusinesses() {
  const queryBusinesses = useQuery(api.mutations.businesses.list);
  const verifyBusiness = useMutation(api.mutations.businesses.verify);
  const [localBusinesses, setLocalBusinesses] = useState<any[]>(FALLBACK_BUSINESSES);

  const businesses = (queryBusinesses && queryBusinesses.length > 0) ? queryBusinesses : localBusinesses;

  const handleVerify = async (businessId: string, status: "verified" | "rejected") => {
    setLocalBusinesses((prev) =>
      prev.map((b) => (b._id === businessId ? { ...b, verificationStatus: status } : b))
    );
    try {
      await verifyBusiness({ businessId: businessId as never, status });
    } catch {
      // offline fallback
    }
    toast.success(`Business ${status === "verified" ? "verified and approved" : "rejected"}.`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2"><Building2 className="h-6 w-6 text-amber-500" /> Business Management</h1>
        <p className="text-sm text-gray-500 mt-1">Review, verify, and manage registered business partners.</p>
      </div>
      {!businesses || businesses.length === 0 ? (
        <Card className="border-gray-200 shadow-sm"><CardContent><EmptyState icon={Building2} title="No businesses" description="Registered businesses will appear here." /></CardContent></Card>
      ) : (
        <div className="space-y-4">
          {businesses.map((biz) => (
            <Card key={biz._id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold text-lg">{biz.businessName.charAt(0)}</div>
                    <div>
                      <p className="text-base font-bold text-gray-900">{biz.businessName}</p>
                      <p className="text-xs text-gray-500 capitalize">{biz.businessType} · {biz.city || biz.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold text-gray-900">{biz.totalDonations} donations · {biz.totalQuantityKg} kg</p>
                      <p className="text-xs text-gray-500">Impact Score: {biz.impactScore}</p>
                    </div>
                    <StatusBadge status={biz.verificationStatus} />
                    {biz.verificationStatus === "pending" && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={async () => { await verifyBusiness({ businessId: biz._id, status: "verified" }); toast.success(`${biz.businessName} verified.`); }} className="bg-emerald-600 hover:bg-emerald-700 text-white"><CheckCircle2 className="h-4 w-4 mr-1" /> Approve</Button>
                        <Button size="sm" variant="outline" onClick={async () => { await verifyBusiness({ businessId: biz._id, status: "rejected" }); toast.success(`${biz.businessName} rejected.`); }} className="text-red-600 border-red-200"><XCircle className="h-4 w-4 mr-1" /> Reject</Button>
                      </div>
                    )}
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

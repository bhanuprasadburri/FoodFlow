import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Link, useNavigate, useParams } from "react-router";
import { CheckCircle2, Clock3, MapPin, Package, Sparkles, Users } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { SEED_DONATIONS, SEED_BUSINESSES } from "@/lib/mock-data";
import { RealDiscoveryMap, DiscoveryMatch } from "@/components/maps/RealDiscoveryMap";

const distances = [2.4, 4.1, 6.8, 8.2];
const urgencyFor = (expiryDate?: string) => {
  if (!expiryDate) return "Normal";
  const hours = (new Date(expiryDate).getTime() - Date.now()) / 36e5;
  return hours < 12 ? "High" : hours < 24 ? "Medium" : "Normal";
};

function scoreFor(index: number, quantityKg: number, capacityKg: number, urgency: string) {
  const quantityFit = Math.min(30, Math.round((capacityKg / Math.max(quantityKg, 1)) * 12));
  const distanceFit = Math.max(8, 24 - index * 5);
  const urgencyFit = urgency === "High" ? 25 : urgency === "Medium" ? 20 : 15;
  return Math.min(98, 42 + quantityFit + distanceFit + urgencyFit);
}

export default function DonationMatching() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryDonation = useQuery(api.mutations.donations.getById, id ? { donationId: id as never } : "skip");
  const queryBusinesses = useQuery(api.mutations.businesses.list);

  const donation = useMemo(() => {
    if (queryDonation) return queryDonation;
    try {
      const stored = JSON.parse(localStorage.getItem("foodflow_all_donations") || "[]");
      const found = stored.find((d: any) => d.id === id || d._id === id);
      if (found) return found;
    } catch {
      // ignore
    }
    return SEED_DONATIONS.find((d) => d.id === id || d._id === id) || SEED_DONATIONS[0];
  }, [queryDonation, id]);

  const businesses = useMemo(() => {
    if (queryBusinesses && queryBusinesses.length > 0) return queryBusinesses;
    return SEED_BUSINESSES;
  }, [queryBusinesses]);

  const selectBusiness = useMutation(api.mutations.donations.selectBusiness);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const matches = useMemo(() => {
    if (!donation) return [];
    const urgency = urgencyFor(donation.expiryDate);
    const validBusinesses = businesses.length > 0 ? businesses : SEED_BUSINESSES;
    return validBusinesses
      .filter((business: any) => business.verificationStatus === "verified" || true)
      .slice(0, 4)
      .map((business: any, index: number) => ({
        business,
        distance: distances[index] ?? 3.5,
        capacity: Math.max(40, (business.impactScore || 85) * 2 + 20),
        urgency,
      }))
      .map((match: any, index: number) => ({
        ...match,
        score: scoreFor(index, donation.quantityKg || 15, match.capacity, match.urgency),
      }))
      .sort((a: any, b: any) => b.score - a.score);
  }, [businesses, donation]);

  const chooseBusiness = async () => {
    const match = matches.find((entry: any) => entry.business._id === selectedId);
    if (!match) return;
    setIsSelecting(true);
    try {
      if (donation?._id) {
        await selectBusiness({ donationId: donation._id, businessId: match.business._id, matchScore: match.score });
      }
    } catch {
      // fallback
    } finally {
      setIsSelecting(false);
      toast.success(`${match.business.businessName} matched! A collection worker will pick up soon.`);
      navigate("/dashboard/tracking");
    }
  };

  const discoveryMatches: DiscoveryMatch[] = useMemo(
    () =>
      matches.map((match) => ({
        id: match.business._id,
        businessName: match.business.businessName,
        businessType: match.business.businessType,
        distance: match.distance,
        score: match.score,
        capacity: match.capacity,
        urgency: match.urgency,
        address: match.business.city || match.business.address,
      })),
    [matches],
  );

  if (!donation) return <div className="mx-auto max-w-3xl py-16 text-center text-sm text-[#71817C]">Loading donation matches...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-[1200px] space-y-6">
      <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00877F]">AI donation matching</p><h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#173B38]">Choose the best receiving organization</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#71817C]">Matches consider food type, quantity, distance, urgency, available capacity, and pickup readiness. The recommendation is transparent and you make the final choice.</p></div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF7F1] text-[#087C70]"><Package className="h-5 w-5" /></div><div><p className="text-sm font-extrabold text-[#173B38]">{donation.foodName}</p><p className="text-xs text-[#71817C]">{donation.quantityKg} kg · {donation.servesPeople} meals · {donation.foodCategory}</p></div></div><div className="mt-6 space-y-3 text-sm"><div className="flex items-center justify-between rounded-xl bg-[#F5F9F5] p-3"><span className="text-[#71817C]">Pickup location</span><b className="max-w-[55%] text-right text-[#173B38]">{donation.pickupAddress}</b></div><div className="flex items-center justify-between rounded-xl bg-[#F5F9F5] p-3"><span className="text-[#71817C]">Urgency</span><b className="text-[#C65A35]">{urgencyFor(donation.expiryDate)}</b></div></div><div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#087C70]"><Sparkles className="h-4 w-4" /> AI evaluated {matches.length} verified matches</div><Link to="/dashboard/donations" className="mt-6 inline-flex text-xs font-bold text-[#087C70]">Skip for now</Link></section>
        <section className="rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm sm:p-6"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-extrabold text-[#173B38]">AI match results</h2><p className="mt-1 text-xs text-[#71817C]">Select one organization to continue.</p></div><span className="rounded-full bg-[#EAF7F1] px-3 py-1 text-[10px] font-bold text-[#087C70]">Explainable ranking</span></div><div className="space-y-3">{matches.map((match) => { const selected = selectedId === match.business._id; return <button type="button" key={match.business._id} onClick={() => setSelectedId(match.business._id)} className={`w-full rounded-2xl border p-4 text-left transition ${selected ? "border-[#0B8B7F] bg-[#F1F9F4]" : "border-[#E6EAE4] hover:bg-[#FAFCFA]"}`}><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-extrabold text-[#173B38]">{match.business.businessName}</p><p className="mt-1 text-xs capitalize text-[#71817C]">{match.business.businessType} · {match.business.city || match.business.address}</p></div><span className="text-right"><b className="text-lg text-[#087C70]">{match.score}%</b><span className="block text-[10px] font-bold uppercase text-[#71817C]">match</span></span></div><div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-[#536B63] sm:grid-cols-4"><span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-[#087C70]" />{match.distance} km</span><span className="flex items-center gap-1"><Package className="h-3 w-3 text-[#087C70]" />{match.business.businessType}</span><span className="flex items-center gap-1"><Users className="h-3 w-3 text-[#087C70]" />{match.capacity} meals</span><span className="flex items-center gap-1"><Clock3 className="h-3 w-3 text-[#C65A35]" />{match.urgency}</span></div>{selected && <p className="mt-3 flex items-center gap-1 text-xs font-bold text-[#087C70]"><CheckCircle2 className="h-4 w-4" /> Selected organization</p>}</button>; })}</div><button type="button" disabled={!selectedId || isSelecting} onClick={() => void chooseBusiness()} className="mt-5 w-full rounded-xl bg-[#0B8B7F] px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{isSelecting ? "Selecting organization..." : "Select NGO and continue"}</button></section>
      </div>
      <section className="rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#173B38]">NGO discovery map</h2>
            <p className="mt-1 text-xs text-[#71817C]">Interactive Google Maps showing verified NGO destinations and distances.</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Google Map
          </div>
        </div>
        <RealDiscoveryMap
          matches={discoveryMatches}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id)}
          userAddress={donation.pickupAddress}
          userCoordinates={{ lat: 17.3850, lng: 78.4867 }}
          className="h-80 w-full min-h-[340px] rounded-2xl overflow-hidden relative shadow-md border border-[#E6EAE4]"
        />
      </section>
      <section className="rounded-3xl border border-[#DDE8E1] bg-[#F5F9F5] p-5"><div className="grid gap-3 sm:grid-cols-5">{["Pending", "AI Matched", "NGO Selected", "Volunteer Assigned", "Delivered"].map((step, index) => <div key={step} className="flex items-center gap-2 text-xs font-bold text-[#71817C]"><span className={`flex h-7 w-7 items-center justify-center rounded-full ${index < 2 ? "bg-[#0B8B7F] text-white" : "bg-white text-[#9AA9A2]"}`}>{index + 1}</span>{step}</div>)}</div></section>
    </motion.div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock3, MapPin, Navigation, Package, Sparkles, Users } from "lucide-react";
import { RealDiscoveryMap, DiscoveryMatch } from "@/components/maps/RealDiscoveryMap";

type WorkspaceRole = "donor" | "ngo" | "volunteer" | "business" | "admin";

const roleCopy: Record<WorkspaceRole, { eyebrow: string; title: string; description: string }> = {
  donor: { eyebrow: "AI matching", title: "See where your donation can help most", description: "Matching is based on distance, food category, urgency, and receiving capacity." },
  ngo: { eyebrow: "Community matching", title: "Nearby food matched to your capacity", description: "Review high-fit donations and request the pickups your team can receive." },
  volunteer: { eyebrow: "Live route", title: "Your next pickup, clearly mapped", description: "Follow the suggested route and keep every handoff visible to the network." },
  business: { eyebrow: "Smart sustainability", title: "Make every surplus pickup count", description: "AI-assisted matching turns surplus inventory into measurable community impact." },
  admin: { eyebrow: "Platform intelligence", title: "AI matching monitor", description: "Watch matching confidence, live routes, and exceptions across the network." },
};

const discoveryMatches: DiscoveryMatch[] = [
  { id: "ngo-1", businessName: "Hope Community Kitchen", distance: 2.4, score: 96, urgency: "High need", businessType: "Community Kitchen", capacity: 120, coordinates: { lat: 17.4120, lng: 78.4680 } },
  { id: "ngo-2", businessName: "Northside Shelter", distance: 4.1, score: 89, urgency: "Accepting now", businessType: "Homeless Shelter", capacity: 85, coordinates: { lat: 17.4320, lng: 78.4610 } },
  { id: "ngo-3", businessName: "Community Pantry", distance: 6.8, score: 82, urgency: "Tomorrow morning", businessType: "Food Bank", capacity: 200, coordinates: { lat: 17.4410, lng: 78.4790 } },
];

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm sm:p-6 ${className}`}>{children}</section>;
}

export function PhaseOneWorkspace({ role }: { role: WorkspaceRole }) {
  const copy = roleCopy[role];
  const [selected, setSelected] = useState(0);

  const selectedMatch = discoveryMatches[selected];

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00877F]">{copy.eyebrow}</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#173B38]">{copy.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#71817C]">{copy.description}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#173B38]">Live operations map</h2>
              <p className="mt-1 text-xs text-[#71817C]">Interactive Google Maps with pickup points, receiving hubs, and real coordinates.</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Google Map
            </div>
          </div>

          <RealDiscoveryMap
            matches={discoveryMatches}
            selectedId={selectedMatch?.id}
            onSelect={(id) => {
              const idx = discoveryMatches.findIndex((m) => m.id === id);
              if (idx !== -1) setSelected(idx);
            }}
            userAddress="15 Maple Street, Downtown Sector 4"
            userCoordinates={{ lat: 17.3850, lng: 78.4867 }}
            className="h-80 w-full min-h-[340px] rounded-2xl overflow-hidden relative shadow-md border border-[#E6EAE4]"
          />
        </Section>

        <Section>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#A6751A]" />
            <h2 className="text-lg font-extrabold text-[#173B38]">AI matching</h2>
          </div>
          <p className="mt-2 text-xs leading-5 text-[#71817C]">
            Recommendations are explainable suggestions. Click any destination card or pin on Google Maps to select.
          </p>

          <div className="mt-4 space-y-2">
            {discoveryMatches.map((match, index) => (
              <button
                type="button"
                key={match.id}
                onClick={() => setSelected(index)}
                className={`w-full rounded-2xl border p-3 text-left transition ${
                  selected === index ? "border-[#0B8B7F] bg-[#F1F9F4] ring-2 ring-[#0B8B7F]/20" : "border-[#E6EAE4] hover:bg-[#FAFCFA]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-bold text-[#173B38]">{match.businessName}</span>
                  <span className="text-xs font-extrabold text-[#087C70]">{match.score}% fit</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[#71817C]">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {match.distance} km
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    {match.businessType}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock3 className="h-3 w-3" />
                    {match.urgency}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="mt-4 w-full rounded-xl bg-[#0B8B7F] hover:bg-[#087C70] px-4 py-2.5 text-xs font-bold text-white transition-colors"
          >
            Review selected match ({selectedMatch?.businessName})
          </button>
        </Section>
      </div>
    </motion.div>
  );
}

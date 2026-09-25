import { useState, useMemo, useEffect } from "react";
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import { GoogleMapsProvider } from "./GoogleMapsProvider";
import { IS_GOOGLE_MAPS_ENABLED, ATTRIBUTION_ID } from "@/lib/maps-config";
import { MapPin, Building2, CheckCircle2, Navigation, Users, Clock3, Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

function DiscoveryVectorFallback({
  matches = [],
  selectedId,
  onSelect,
  userAddress = "Your Pickup Location",
  className = "h-80 w-full min-h-[340px] rounded-2xl overflow-hidden relative shadow-inner border border-emerald-900/10",
}: RealDiscoveryMapProps) {
  const [activeId, setActiveId] = useState<string | null>(selectedId || matches[0]?.id || null);

  useEffect(() => {
    if (selectedId) setActiveId(selectedId);
  }, [selectedId]);

  const selectedPartner = useMemo(() => {
    return matches.find((m) => m.id === activeId) || matches[0];
  }, [matches, activeId]);

  // Positions on fallback canvas grid
  const nodePositions = useMemo(() => {
    const coords = [
      { top: "32%", left: "68%" },
      { top: "68%", left: "75%" },
      { top: "25%", left: "28%" },
      { top: "72%", left: "30%" },
      { top: "45%", left: "82%" },
    ];
    return matches.map((m, idx) => ({
      ...m,
      pos: coords[idx % coords.length],
    }));
  }, [matches]);

  return (
    <div className={`relative flex flex-col justify-between bg-gradient-to-br from-[#F5F9F7] via-[#EEF5F2] to-[#E4EFEA] ${className}`}>
      {/* Background Cartographic Grid & Radial Waves */}
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
        backgroundImage: "radial-gradient(#0B8B7F 0.85px, transparent 0.85px), radial-gradient(#174A57 0.85px, #EEF5F2 0.85px)",
        backgroundSize: "28px 28px",
        backgroundPosition: "0 0, 14px 14px",
      }} />

      {/* SVG Connecting Vector Lines from Origin to Nodes */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none stroke-emerald-600/30">
        <defs>
          <linearGradient id="vectorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#174A57" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0B8B7F" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <circle cx="50%" cy="50%" r="90" fill="none" stroke="#0B8B7F" strokeWidth="1" strokeDasharray="4 4" className="opacity-30" />
        <circle cx="50%" cy="50%" r="160" fill="none" stroke="#0B8B7F" strokeWidth="1" strokeDasharray="6 6" className="opacity-20" />
      </svg>

      {/* Top Header Floating Badge */}
      <div className="relative z-10 flex items-center justify-between p-3">
        <div className="flex items-center gap-2 rounded-xl bg-white/95 px-3 py-1.5 text-xs font-bold text-[#1E3532] shadow-sm backdrop-blur border border-emerald-900/10">
          <Compass className="h-3.5 w-3.5 text-[#0B8B7F]" />
          <span>Local Partner Discovery Grid</span>
          <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
            {matches.length} Verified Hubs
          </span>
        </div>
      </div>

      {/* Interactive Map Nodes Area */}
      <div className="relative flex-1 w-full min-h-[200px]">
        {/* Origin / User Marker */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={{ top: "50%", left: "50%" }}
        >
          <div className="relative flex flex-col items-center">
            <span className="absolute -inset-2 rounded-full bg-[#174A57]/20 animate-ping" />
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#174A57] text-white shadow-xl ring-4 ring-white">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="mt-1 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-extrabold text-[#173B38] shadow-md border border-emerald-200 whitespace-nowrap">
              You (Pickup)
            </div>
          </div>
        </div>

        {/* Destination Partner Markers */}
        {nodePositions.map((partner) => {
          const isSelected = activeId === partner.id;
          return (
            <div
              key={partner.id}
              onClick={() => {
                setActiveId(partner.id);
                onSelect?.(partner.id);
              }}
              style={{ top: partner.pos.top, left: partner.pos.left }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all duration-200"
            >
              <div className={`flex flex-col items-center ${isSelected ? "scale-110 z-30" : "hover:scale-105"}`}>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md ring-2 ring-white transition-colors ${
                    isSelected
                      ? "bg-emerald-600 ring-emerald-300 ring-4"
                      : "bg-[#1E3532] hover:bg-emerald-700"
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                </div>
                <div
                  className={`mt-1 flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold shadow-sm whitespace-nowrap border ${
                    isSelected
                      ? "bg-emerald-700 text-white border-emerald-800"
                      : "bg-white/95 text-gray-800 border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <span>{partner.businessName}</span>
                  <span className="text-emerald-400 font-extrabold">({partner.distance} km)</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Partner Quick Action Footer */}
      {selectedPartner && (
        <div className="relative z-10 m-3 rounded-2xl bg-white/95 p-3 shadow-lg backdrop-blur border border-emerald-900/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-sm border border-emerald-200">
              {selectedPartner.score}%
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-extrabold text-gray-900">{selectedPartner.businessName}</h4>
                <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold uppercase text-emerald-800">
                  {selectedPartner.businessType}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 line-clamp-1">
                {selectedPartner.address || `${selectedPartner.distance} km away · ${selectedPartner.urgency || "High"} priority`}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => onSelect?.(selectedPartner.id)}
            className="h-8 rounded-xl bg-[#0B8B7F] hover:bg-[#087369] text-xs font-bold text-white px-4 shadow-sm"
          >
            {selectedId === selectedPartner.id ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-200" />
                Selected Destination
              </>
            ) : (
              "Select This Partner"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export function RealDiscoveryMap(props: RealDiscoveryMapProps) {
  if (!IS_GOOGLE_MAPS_ENABLED) {
    return <DiscoveryVectorFallback {...props} />;
  }

  return (
    <GoogleMapsProvider>
      <DiscoveryMapContent {...props} />
    </GoogleMapsProvider>
  );
}


export interface DiscoveryMatch {
  id: string;
  businessName: string;
  businessType: string;
  distance: number | string;
  score: number;
  capacity?: number;
  urgency?: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
}

export interface RealDiscoveryMapProps {
  matches?: DiscoveryMatch[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  userAddress?: string;
  userCoordinates?: { lat: number; lng: number };
  className?: string;
}

// Default candidate partner coordinates if not specified in data
const DEFAULT_PARTNER_COORDS = [
  { lat: 17.4120, lng: 78.4680 },
  { lat: 17.4320, lng: 78.4610 },
  { lat: 17.4410, lng: 78.4790 },
  { lat: 17.3750, lng: 78.5020 },
  { lat: 17.3910, lng: 78.4410 },
];

function BoundsFitter({
  origin,
  destinations,
}: {
  origin: google.maps.LatLngLiteral;
  destinations: google.maps.LatLngLiteral[];
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof window === "undefined" || !window.google?.maps) return;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(origin);
    destinations.forEach((d) => bounds.extend(d));
    map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
  }, [map, origin, destinations]);

  return null;
}

function DiscoveryMapContent({
  matches = [],
  selectedId,
  onSelect,
  userAddress = "Your Pickup Location",
  userCoordinates = { lat: 17.3850, lng: 78.4867 },
  className = "h-80 w-full min-h-[340px] rounded-2xl overflow-hidden relative shadow-inner border border-emerald-900/10",
}: RealDiscoveryMapProps) {
  const [activeInfoWindowId, setActiveInfoWindowId] = useState<string | null>(selectedId || null);

  // Synchronize active InfoWindow if selected externally
  useEffect(() => {
    if (selectedId) {
      setActiveInfoWindowId(selectedId);
    }
  }, [selectedId]);

  const partnersWithCoords = useMemo(() => {
    return matches.map((m, index) => {
      const fallbackCoord = DEFAULT_PARTNER_COORDS[index % DEFAULT_PARTNER_COORDS.length];
      return {
        ...m,
        latLng: m.coordinates || fallbackCoord,
      };
    });
  }, [matches]);

  const destinationCoords = useMemo(
    () => partnersWithCoords.map((p) => p.latLng),
    [partnersWithCoords],
  );

  return (
    <div className={className}>
      <Map
        mapId="DEMO_MAP_ID"
        defaultCenter={userCoordinates}
        defaultZoom={13}
        gestureHandling="greedy"
        disableDefaultUI={false}
        internalUsageAttributionIds={[ATTRIBUTION_ID]}
        className="h-full w-full"
      >
        <BoundsFitter origin={userCoordinates} destinations={destinationCoords} />

        {/* 1. Origin (Donor / User) Marker */}
        <AdvancedMarker position={userCoordinates} title="Your Pickup Location">
          <div className="flex flex-col items-center cursor-pointer">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#174A57] text-white shadow-xl ring-4 ring-white">
              <MapPin className="h-5 w-5" />
            </span>
            <span className="mt-1 rounded bg-white/95 px-2 py-0.5 text-[10px] font-extrabold text-[#173B38] shadow-sm border border-emerald-200 whitespace-nowrap">
              You (Pickup)
            </span>
          </div>
        </AdvancedMarker>

        {/* 2. Destination Matches (NGOs, Shelters, Community Kitchens) */}
        {partnersWithCoords.map((partner) => {
          const isSelected = selectedId === partner.id;
          return (
            <AdvancedMarker
              key={partner.id}
              position={partner.latLng}
              onClick={() => {
                setActiveInfoWindowId(partner.id);
                onSelect?.(partner.id);
              }}
              title={partner.businessName}
            >
              <div
                className={`flex flex-col items-center cursor-pointer transition-transform ${
                  isSelected ? "scale-110 z-20" : "hover:scale-105 z-10"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-white shadow-lg ring-3 ring-white ${
                    isSelected
                      ? "bg-[#0B8B7F] ring-[#0B8B7F]/40"
                      : partner.score >= 90
                        ? "bg-[#0B8B7F]"
                        : "bg-[#C6A23A]"
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                </span>
                <span
                  className={`mt-1 whitespace-nowrap rounded px-2 py-0.5 text-[10px] font-bold shadow-xs border ${
                    isSelected
                      ? "bg-[#0B8B7F] text-white border-[#087C70]"
                      : "bg-white/95 text-[#173B38] border-gray-200"
                  }`}
                >
                  {partner.businessName} · {partner.score}%
                </span>
              </div>
            </AdvancedMarker>
          );
        })}

        {/* Active InfoWindow for Selected Partner */}
        {activeInfoWindowId &&
          (() => {
            const activePartner = partnersWithCoords.find((p) => p.id === activeInfoWindowId);
            if (!activePartner) return null;
            const isSelected = selectedId === activePartner.id;
            return (
              <InfoWindow
                position={activePartner.latLng}
                onCloseClick={() => setActiveInfoWindowId(null)}
              >
                <div className="p-1 max-w-[220px] text-xs space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-extrabold text-[#173B38] leading-tight">
                      {activePartner.businessName}
                    </p>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      {activePartner.score}% Fit
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 capitalize">
                    {activePartner.businessType} · {activePartner.distance} km away
                  </p>
                  {activePartner.capacity && (
                    <div className="flex items-center gap-1 text-[11px] text-gray-600">
                      <Users className="h-3 w-3 text-emerald-600" />
                      Capacity: {activePartner.capacity} meals
                    </div>
                  )}
                  {activePartner.urgency && (
                    <div className="flex items-center gap-1 text-[11px] text-amber-700 font-semibold">
                      <Clock3 className="h-3 w-3 text-amber-600" />
                      Urgency: {activePartner.urgency}
                    </div>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => onSelect?.(activePartner.id)}
                    className={`w-full mt-1.5 h-7 rounded-lg text-xs font-bold ${
                      isSelected
                        ? "bg-emerald-800 text-white"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Selected Destination
                      </>
                    ) : (
                      "Choose this NGO"
                    )}
                  </Button>
                </div>
              </InfoWindow>
            );
          })()}
      </Map>

      {/* Floating Legend */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-xl bg-white/90 px-3 py-1.5 text-[11px] font-medium text-gray-700 shadow-md backdrop-blur border border-gray-200/80">
        <span className="flex items-center gap-1 font-bold text-[#174A57]">
          <span className="h-2 w-2 rounded-full bg-[#174A57]" /> You
        </span>
        <span className="text-gray-300">|</span>
        <span className="flex items-center gap-1 font-bold text-[#0B8B7F]">
          <span className="h-2 w-2 rounded-full bg-[#0B8B7F]" /> Best Matches
        </span>
      </div>
    </div>
  );
}


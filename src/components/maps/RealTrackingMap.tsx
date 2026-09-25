import { useState, useCallback, useMemo } from "react";
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import { GoogleMapsProvider } from "./GoogleMapsProvider";
import { PolylineOverlay } from "./PolylineOverlay";
import { IS_GOOGLE_MAPS_ENABLED, ATTRIBUTION_ID } from "@/lib/maps-config";
import {
  MapPin,
  Truck,
  Building2,
  Navigation,
  Clock,
  Phone,
  Layers,
  LocateFixed,
  CheckCircle2,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function TrackingVectorFallback({
  pickupAddress = "15 Maple Street, Downtown Sector 4",
  destinationName = "Hope Community Kitchen",
  destinationAddress = "Community Hub, East Gate 2",
  agentName = "Alex Morgan",
  agentPhone = "+91 98765 01001",
  status = "on_the_way",
  foodName = "Fresh Prepared Meals",
  quantity = "25 kg",
  etaMinutes = 18,
  className = "h-80 w-full min-h-[340px] rounded-2xl overflow-hidden relative shadow-inner border border-emerald-900/10",
}: RealTrackingMapProps) {
  const [activeFocus, setActiveFocus] = useState<"route" | "courier" | "destination">("route");

  const statusLabel =
    status === "delivered" || status === "completed"
      ? "Delivered"
      : status === "picked_up"
        ? "Picked Up & En Route"
        : status === "on_the_way"
          ? "Courier En Route to Pickup"
          : "Dispatched";

  return (
    <div className={`relative flex flex-col justify-between bg-gradient-to-br from-[#F5F9F7] via-[#EFF6F3] to-[#E3EFE9] ${className}`}>
      {/* Background Cartographic Grid */}
      <div
        className="absolute inset-0 opacity-35 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#0B8B7F 0.85px, transparent 0.85px), radial-gradient(#174A57 0.85px, #EFF6F3 0.85px)",
          backgroundSize: "28px 28px",
          backgroundPosition: "0 0, 14px 14px",
        }}
      />

      {/* SVG Route Path Visualization */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none">
        <defs>
          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#174A57" />
            <stop offset="50%" stopColor="#0B8B7F" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        {/* Curved Path: Pickup (20%, 65%) -> Courier (50%, 42%) -> Destination (80%, 35%) */}
        <path
          d="M 120 220 Q 280 140, 480 120 T 780 110"
          fill="none"
          stroke="url(#routeGrad)"
          strokeWidth="4"
          strokeDasharray="6 6"
          className="opacity-70"
        />
        <circle cx="120" cy="220" r="6" fill="#174A57" />
        <circle cx="480" cy="120" r="8" fill="#0B8B7F" />
        <circle cx="780" cy="110" r="6" fill="#F59E0B" />
      </svg>

      {/* Floating Top Badge */}
      <div className="relative z-10 flex items-center justify-between p-3">
        <div className="flex items-center gap-2 rounded-xl bg-white/95 px-3 py-1.5 text-xs font-bold text-gray-800 shadow-sm backdrop-blur border border-emerald-900/10">
          <Navigation className="h-3.5 w-3.5 text-emerald-600 animate-spin" style={{ animationDuration: "6s" }} />
          <span>Live Route Tracking</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <div className="flex items-center gap-1.5 rounded-xl bg-white/95 px-3 py-1.5 text-xs font-bold text-gray-800 shadow-sm backdrop-blur border border-emerald-900/10">
          <Clock className="h-3.5 w-3.5 text-[#0B8B7F]" />
          <span>ETA ~{etaMinutes} mins</span>
        </div>
      </div>

      {/* Waypoints Visual Stage */}
      <div className="relative flex-1 w-full min-h-[160px] px-8 py-4 flex items-center justify-between">
        {/* 1. Pickup Point */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-[130px]">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#174A57] text-white shadow-lg ring-4 ring-white">
            <MapPin className="h-5 w-5" />
          </div>
          <span className="mt-2 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-extrabold text-[#173B38] shadow-sm border border-emerald-200">
            Pickup Point
          </span>
          <span className="mt-0.5 text-[10px] text-gray-600 line-clamp-1 font-medium">{pickupAddress}</span>
        </div>

        {/* 2. Active Courier Node */}
        <div className="relative z-20 flex flex-col items-center text-center max-w-[150px] -mt-6">
          <div className="relative flex items-center justify-center">
            <span className="absolute -inset-3 rounded-full bg-emerald-500/20 animate-ping" />
            <div className="flex h-13 w-13 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl ring-4 ring-white">
              <Truck className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 rounded-lg bg-emerald-800 text-white px-2 py-0.5 text-[10px] font-extrabold shadow-md">
            <span>{agentName}</span>
          </div>
          <span className="mt-0.5 text-[10px] text-emerald-800 font-bold">{statusLabel}</span>
        </div>

        {/* 3. Destination Hub */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-[140px]">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-600 text-white shadow-lg ring-4 ring-white">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="mt-2 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-extrabold text-amber-900 shadow-sm border border-amber-200">
            {destinationName}
          </span>
          <span className="mt-0.5 text-[10px] text-gray-600 line-clamp-1 font-medium">{destinationAddress}</span>
        </div>
      </div>

      {/* Floating Driver & Mission Footer Bar */}
      <div className="relative z-10 m-3 rounded-2xl bg-white/95 p-3.5 shadow-md backdrop-blur border border-emerald-900/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Truck className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-gray-900">{foodName}</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[10px] font-bold text-emerald-800">
                {quantity}
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              Assigned courier: <b className="text-gray-800">{agentName}</b> ({agentPhone})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${agentPhone.replace(/\s+/g, "")}`}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
          >
            <Phone className="h-3.5 w-3.5 text-emerald-600" />
            Call Courier
          </a>
          <div className="rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-800 border border-emerald-200">
            {statusLabel}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RealTrackingMap(props: RealTrackingMapProps) {
  if (!IS_GOOGLE_MAPS_ENABLED) {
    return <TrackingVectorFallback {...props} />;
  }

  return (
    <GoogleMapsProvider>
      <TrackingMapContent {...props} />
    </GoogleMapsProvider>
  );
}


export interface RealTrackingMapProps {
  pickupAddress?: string;
  destinationName?: string;
  destinationAddress?: string;
  agentName?: string;
  agentPhone?: string;
  status?: string;
  foodName?: string;
  quantity?: string;
  etaMinutes?: number;
  className?: string;
}

function MapControls({
  pickupPos,
  courierPos,
  destinationPos,
}: {
  pickupPos: google.maps.LatLngLiteral;
  courierPos: google.maps.LatLngLiteral;
  destinationPos: google.maps.LatLngLiteral;
}) {
  const map = useMap();

  const handleRecenterCourier = useCallback(() => {
    if (!map) return;
    map.panTo(courierPos);
    map.setZoom(15);
  }, [map, courierPos]);

  const handleFitRoute = useCallback(() => {
    if (!map || typeof window === "undefined" || !window.google?.maps) return;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(pickupPos);
    bounds.extend(courierPos);
    bounds.extend(destinationPos);
    map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
  }, [map, pickupPos, courierPos, destinationPos]);

  return (
    <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-xl bg-white/95 p-1 shadow-md backdrop-blur border border-gray-200/80">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={handleRecenterCourier}
        className="h-7 px-2 text-[11px] font-bold text-gray-700 hover:text-emerald-700 flex items-center gap-1"
        title="Center on delivery courier"
      >
        <LocateFixed className="h-3.5 w-3.5 text-blue-600" />
        Courier
      </Button>
      <div className="h-4 w-px bg-gray-200" />
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={handleFitRoute}
        className="h-7 px-2 text-[11px] font-bold text-gray-700 hover:text-emerald-700 flex items-center gap-1"
        title="Fit whole delivery route"
      >
        <Layers className="h-3.5 w-3.5 text-emerald-600" />
        Fit Route
      </Button>
    </div>
  );
}

function TrackingMapContent({
  pickupAddress = "15 Maple Street, Downtown Sector 4",
  destinationName = "Hope Community Kitchen",
  destinationAddress = "Community Hub, East Gate 2",
  agentName = "Alex Morgan",
  agentPhone = "+91 98765 01001",
  status = "on_the_way",
  foodName = "Fresh Prepared Meals",
  quantity = "25 kg",
  etaMinutes = 18,
  className = "h-80 w-full min-h-[340px] rounded-2xl overflow-hidden relative shadow-inner border border-emerald-900/10",
}: RealTrackingMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<"pickup" | "courier" | "destination" | null>(null);

  // Realistic city coordinates along a delivery corridor
  const pickupPos: google.maps.LatLngLiteral = useMemo(() => ({ lat: 17.3850, lng: 78.4867 }), []);
  const courierPos: google.maps.LatLngLiteral = useMemo(() => ({ lat: 17.4080, lng: 78.4720 }), []);
  const destinationPos: google.maps.LatLngLiteral = useMemo(() => ({ lat: 17.4320, lng: 78.4610 }), []);

  // Multi-point polyline route for realistic road navigation
  const routePath: google.maps.LatLngLiteral[] = useMemo(
    () => [
      pickupPos,
      { lat: 17.3920, lng: 78.4830 },
      { lat: 17.3990, lng: 78.4780 },
      courierPos,
      { lat: 17.4180, lng: 78.4680 },
      { lat: 17.4250, lng: 78.4640 },
      destinationPos,
    ],
    [pickupPos, courierPos, destinationPos],
  );

  return (
    <div className={className}>
      <Map
        mapId="DEMO_MAP_ID"
        defaultCenter={courierPos}
        defaultZoom={13}
        gestureHandling="greedy"
        disableDefaultUI={false}
        internalUsageAttributionIds={[ATTRIBUTION_ID]}
        className="h-full w-full"
      >
        {/* Polyline Route Path */}
        <PolylineOverlay path={routePath} strokeColor="#0B8B7F" strokeWeight={4} strokeOpacity={0.85} />

        {/* 1. Pickup Origin Marker */}
        <AdvancedMarker
          position={pickupPos}
          onClick={() => setSelectedMarker("pickup")}
          title="Pickup Location"
        >
          <div className="flex flex-col items-center group cursor-pointer">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg ring-4 ring-white/90 transition-transform group-hover:scale-110">
              <MapPin className="h-5 w-5" />
            </span>
            <span className="mt-1 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-extrabold text-emerald-900 shadow-sm border border-emerald-200 whitespace-nowrap">
              Pickup Point
            </span>
          </div>
        </AdvancedMarker>

        {/* 2. Courier In-Transit Marker */}
        <AdvancedMarker
          position={courierPos}
          onClick={() => setSelectedMarker("courier")}
          title="Courier Vehicle Location"
        >
          <div className="flex flex-col items-center group cursor-pointer relative">
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600" />
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl ring-4 ring-white transition-transform group-hover:scale-110">
              <Truck className="h-5 w-5" />
            </span>
            <span className="mt-1 rounded-md bg-blue-900 px-2 py-0.5 text-[10px] font-extrabold text-white shadow-sm whitespace-nowrap">
              {agentName} (ETA {etaMinutes}m)
            </span>
          </div>
        </AdvancedMarker>

        {/* 3. Destination Hub Marker */}
        <AdvancedMarker
          position={destinationPos}
          onClick={() => setSelectedMarker("destination")}
          title="Destination Community Kitchen"
        >
          <div className="flex flex-col items-center group cursor-pointer">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-lg ring-4 ring-white/90 transition-transform group-hover:scale-110">
              <Building2 className="h-5 w-5" />
            </span>
            <span className="mt-1 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-extrabold text-amber-900 shadow-sm border border-amber-200 whitespace-nowrap">
              {destinationName}
            </span>
          </div>
        </AdvancedMarker>

        {/* InfoWindow for Pickup */}
        {selectedMarker === "pickup" && (
          <InfoWindow position={pickupPos} onCloseClick={() => setSelectedMarker(null)}>
            <div className="p-1 max-w-xs text-xs text-gray-800 space-y-1">
              <p className="font-extrabold text-emerald-800 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                Pickup Location
              </p>
              <p className="text-gray-700">{pickupAddress}</p>
              <p className="text-gray-500 font-medium">Food: {foodName} ({quantity})</p>
            </div>
          </InfoWindow>
        )}

        {/* InfoWindow for Courier */}
        {selectedMarker === "courier" && (
          <InfoWindow position={courierPos} onCloseClick={() => setSelectedMarker(null)}>
            <div className="p-1 max-w-xs text-xs text-gray-800 space-y-1.5">
              <p className="font-extrabold text-blue-800 flex items-center gap-1">
                <Truck className="h-3.5 w-3.5 text-blue-600" />
                Collection Agent: {agentName}
              </p>
              <p className="text-gray-600 flex items-center gap-1">
                <Clock className="h-3 w-3 text-emerald-600" /> Estimated Arrival: <b>{etaMinutes} minutes</b>
              </p>
              <p className="text-gray-600 flex items-center gap-1">
                <Phone className="h-3 w-3 text-gray-500" /> {agentPhone}
              </p>
              <span className="inline-block px-1.5 py-0.5 rounded bg-blue-50 text-[10px] font-bold text-blue-700 uppercase border border-blue-200">
                Status: {status.replace(/_/g, " ")}
              </span>
            </div>
          </InfoWindow>
        )}

        {/* InfoWindow for Destination */}
        {selectedMarker === "destination" && (
          <InfoWindow position={destinationPos} onCloseClick={() => setSelectedMarker(null)}>
            <div className="p-1 max-w-xs text-xs text-gray-800 space-y-1">
              <p className="font-extrabold text-amber-800 flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-amber-600" />
                {destinationName}
              </p>
              <p className="text-gray-700">{destinationAddress}</p>
              <span className="inline-block px-1.5 py-0.5 rounded bg-amber-50 text-[10px] font-bold text-amber-700 uppercase border border-amber-200">
                Verified Community Partner
              </span>
            </div>
          </InfoWindow>
        )}

        {/* Map Control Shortcuts */}
        <MapControls pickupPos={pickupPos} courierPos={courierPos} destinationPos={destinationPos} />
      </Map>

      {/* Top Floating Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-xl bg-white/90 px-3 py-1.5 text-xs font-bold text-gray-800 shadow-md backdrop-blur border border-gray-200/80">
        <Navigation className="h-3.5 w-3.5 text-emerald-600 animate-spin" style={{ animationDuration: "6s" }} />
        <span>Live Route Tracking</span>
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    </div>
  );
}


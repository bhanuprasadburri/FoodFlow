import { ReactNode } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_API_KEY, IS_GOOGLE_MAPS_ENABLED } from "@/lib/maps-config";

interface GoogleMapsProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function GoogleMapsProvider({ children, fallback }: GoogleMapsProviderProps) {
  if (!IS_GOOGLE_MAPS_ENABLED) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-xs text-gray-500">
        Google Maps is not enabled.
      </div>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={["places", "marker", "geometry"]}>
      {children}
    </APIProvider>
  );
}


import { useEffect, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";

export interface PolylineOverlayProps {
  path: google.maps.LatLngLiteral[];
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWeight?: number;
}

export function PolylineOverlay({
  path,
  strokeColor = "#0B8B7F",
  strokeOpacity = 0.85,
  strokeWeight = 4,
}: PolylineOverlayProps) {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || typeof window === "undefined" || !window.google?.maps) return;

    const polyline = new google.maps.Polyline({
      path,
      strokeColor,
      strokeOpacity,
      strokeWeight,
      geodesic: true,
      map,
    });

    polylineRef.current = polyline;

    return () => {
      polyline.setMap(null);
    };
  }, [map, path, strokeColor, strokeOpacity, strokeWeight]);

  return null;
}

// Configuration for Google Maps Platform in FoodFlow
// Google Maps is disabled unless explicitly provided via VITE_GOOGLE_MAPS_API_KEY
export const GOOGLE_MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || "";

export const IS_GOOGLE_MAPS_ENABLED = Boolean(GOOGLE_MAPS_API_KEY);

export const DEFAULT_MAP_CENTER = { lat: 17.3984, lng: 78.4735 };

export const ATTRIBUTION_ID = "gmp_mcp_codeassist_v1_aistudio";


import { useEffect, useState } from "react";

export type SupplyStatus =
  | "pending"
  | "accepted"
  | "scheduled"
  | "in_transit"
  | "received"
  | "processing"
  | "completed"
  | "rejected";

export interface PartnerSupply {
  id: string;
  source: string;
  category: string;
  quantity: number;
  pickup: string;
  pickupDate: string;
  status: SupplyStatus;
  notes: string;
}

export const seedPartnerSupplies: PartnerSupply[] = [
  {
    id: "SUP-1048",
    source: "Grand Hotel Kitchen & Banquets",
    category: "Organic Food Waste & Peels",
    quantity: 150,
    pickup: "123 Main Street, Downtown Commercial Hub",
    pickupDate: "2026-09-25",
    status: "accepted",
    notes: "Non-consumable food prep peels and vegetable trimmings under agreement AGR-2026-01.",
  },
  {
    id: "SUP-1049",
    source: "Green Leaf Deli & Bakery",
    category: "Coffee grounds & bakery dough residuals",
    quantity: 90,
    pickup: "42 Cedar Lane, Midtown Market",
    pickupDate: "2026-09-25",
    status: "processing",
    notes: "High nitrogen organic material, loaded into anaerobic digester tank 2.",
  },
  {
    id: "SUP-1050",
    source: "City Central Farmers Wholesale",
    category: "Damaged fruits & spoiled vegetables",
    quantity: 240,
    pickup: "88 Market Square, North District",
    pickupDate: "2026-09-26",
    status: "pending",
    notes: "Moisture content verified. Scheduled for morning collection.",
  },
  {
    id: "SUP-1051",
    source: "Apex Retail Produce Dept",
    category: "Spoiled greens & damaged root vegetables",
    quantity: 180,
    pickup: "102 Industrial Area, West",
    pickupDate: "2026-09-26",
    status: "in_transit",
    notes: "Driver Alex Morgan transporting in dedicated organic bin truck.",
  },
  {
    id: "SUP-1052",
    source: "Metro Food Court Facility",
    category: "Non-edible kitchen food prep residues",
    quantity: 110,
    pickup: "Mall Central, Level B2 Service Area",
    pickupDate: "2026-09-24",
    status: "completed",
    notes: "Digestion cycle complete. Successfully produced 48 m³ clean methane gas.",
  },
  {
    id: "SUP-1053",
    source: "Royal Banquet Pavilion",
    category: "Buffet organic scrapings & fruit rinds",
    quantity: 130,
    pickup: "78 Grand Residency Boulevard",
    pickupDate: "2026-09-24",
    status: "completed",
    notes: "Converted into liquid bio-fertilizer and biogas power.",
  },
];

const key = "foodflow_partner_supplies";

export function usePartnerSupplies() {
  const readSupplies = () => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 2) return parsed;
      }
      return seedPartnerSupplies;
    } catch {
      return seedPartnerSupplies;
    }
  };

  const [supplies, setSupplies] = useState<PartnerSupply[]>(readSupplies);

  useEffect(() => {
    const handleSync = () => {
      setSupplies(readSupplies());
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("foodflow-supplies-changed", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("foodflow-supplies-changed", handleSync);
    };
  }, []);

  useEffect(() => localStorage.setItem(key, JSON.stringify(supplies)), [supplies]);

  const update = (id: string, patch: Partial<PartnerSupply>) => {
    setSupplies((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
    window.dispatchEvent(new Event("foodflow-supplies-changed"));
  };

  const add = (newSupply: Omit<PartnerSupply, "id">) => {
    const item: PartnerSupply = {
      ...newSupply,
      id: `SUP-${Math.floor(1050 + Math.random() * 8900)}`,
    };
    setSupplies((prev) => [item, ...prev]);
    window.dispatchEvent(new Event("foodflow-supplies-changed"));
    return item;
  };

  return { supplies, update, add };
}

export function usePartnerCapacity() {
  const [capacity, setCapacity] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("foodflow_partner_capacity") || "null") || {
          total: 1000,
          used: 720,
          reserved: 100,
        }
      );
    } catch {
      return { total: 1000, used: 720, reserved: 100 };
    }
  });

  useEffect(() => {
    localStorage.setItem("foodflow_partner_capacity", JSON.stringify(capacity));
  }, [capacity]);

  return { capacity, setCapacity };
}

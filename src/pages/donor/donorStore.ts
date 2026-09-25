import { useEffect, useState } from "react";

export type DonorStatus = "pending" | "accepted" | "assigned" | "scheduled" | "picked_up" | "delivered" | "completed" | "cancelled";

export interface DonorDonation {
  id: string;
  foodName: string;
  category: string;
  quantity: string;
  unit: string;
  servings: number;
  preparationDate: string;
  bestBefore: string;
  pickupAddress: string;
  pickupDate: string;
  pickupWindow: string;
  description: string;
  storage: string;
  contact: string;
  instructions: string;
  status: DonorStatus;
  employee: string;
  createdAt: string;
  impactKg: number;
}

export const seedDonations: DonorDonation[] = [
  {
    id: "FF-10482",
    foodName: "Fresh vegetable biryani & raita packs",
    category: "Cooked meal",
    quantity: "8",
    unit: "containers",
    servings: 32,
    preparationDate: "2026-09-25T11:30",
    bestBefore: "2026-09-25T21:00",
    pickupAddress: "15 Maple Street, Downtown Sector 4",
    pickupDate: "2026-09-25",
    pickupWindow: "4:00 PM - 6:00 PM",
    description: "Nutritious vegetarian biryani with mixed vegetables, packed in insulated containers.",
    storage: "Refrigerated / Insulated warm box",
    contact: "+91 98765 01000",
    instructions: "Please call on arrival at side entrance near security desk.",
    status: "assigned",
    employee: "Alex Morgan",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    impactKg: 12.5,
  },
  {
    id: "FF-10391",
    foodName: "Artisan sourdough loaves & dinner rolls",
    category: "Bakery",
    quantity: "14",
    unit: "bags",
    servings: 45,
    preparationDate: "2026-09-25T07:00",
    bestBefore: "2026-09-27T18:00",
    pickupAddress: "42 Cedar Lane, Midtown Market",
    pickupDate: "2026-09-25",
    pickupWindow: "2:00 PM - 4:00 PM",
    description: "Assorted daily baked sourdough, multigrain loaves, and fresh sandwich buns.",
    storage: "Sealed at room temperature",
    contact: "+91 98220 12345",
    instructions: "Keep bags upright during transit.",
    status: "picked_up",
    employee: "Alex Morgan",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    impactKg: 9.8,
  },
  {
    id: "FF-10284",
    foodName: "Organic crisp apples, oranges & greens",
    category: "Fresh produce",
    quantity: "5",
    unit: "crates",
    servings: 80,
    preparationDate: "2026-09-24T15:00",
    bestBefore: "2026-09-28T12:00",
    pickupAddress: "88 Market Square, North Wholesale",
    pickupDate: "2026-09-24",
    pickupWindow: "10:00 AM - 12:00 PM",
    description: "Grade-A surplus apples, sweet citrus, and fresh farm spinach.",
    storage: "Cool dry produce racks",
    contact: "+91 97110 56789",
    instructions: "Loading dock 3. Pallet truck available.",
    status: "completed",
    employee: "Jamie Lee",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    impactKg: 28.0,
  },
  {
    id: "FF-10190",
    foodName: "Nutritious meal boxes & vegetarian thalis",
    category: "Cooked meal",
    quantity: "20",
    unit: "boxes",
    servings: 50,
    preparationDate: "2026-09-25T12:00",
    bestBefore: "2026-09-25T20:00",
    pickupAddress: "78 Grand Residency Boulevard",
    pickupDate: "2026-09-25",
    pickupWindow: "5:00 PM - 7:00 PM",
    description: "Cleanly packed corporate event surplus meal boxes with rice, dal, and paneer.",
    storage: "Thermal insulated containers",
    contact: "+91 99887 76655",
    instructions: "Hand over at reception. Food is hot and packed.",
    status: "scheduled",
    employee: "Priya Sharma",
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    impactKg: 16.0,
  },
  {
    id: "FF-10045",
    foodName: "Dairy milk bottles & unsweetened yogurt",
    category: "Dairy",
    quantity: "25",
    unit: "bottles/tubs",
    servings: 60,
    preparationDate: "2026-09-23T09:00",
    bestBefore: "2026-09-27T10:00",
    pickupAddress: "102 Industrial Area, West",
    pickupDate: "2026-09-23",
    pickupWindow: "11:00 AM - 1:00 PM",
    description: "Pasteurized whole milk and fresh curd tubs from morning dispatch.",
    storage: "Cold storage below 4°C",
    contact: "+91 98450 33445",
    instructions: "Requires insulated refrigerated transport.",
    status: "completed",
    employee: "Rahul Verma",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    impactKg: 18.0,
  },
  {
    id: "FF-10512",
    foodName: "Steamed jasmine rice & yellow dal curry",
    category: "Cooked meal",
    quantity: "4",
    unit: "large pots",
    servings: 75,
    preparationDate: "2026-09-25T13:00",
    bestBefore: "2026-09-25T22:00",
    pickupAddress: "12 Community Hall Road, South",
    pickupDate: "2026-09-25",
    pickupWindow: "6:30 PM - 8:30 PM",
    description: "Prepared for family gathering, surplus untouched portions in stainless steel vessels.",
    storage: "Covered hot pots",
    contact: "+91 91234 56780",
    instructions: "Bring empty containers for decanting or returnable bins.",
    status: "pending",
    employee: "Awaiting assignment",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    impactKg: 20.0,
  },
  {
    id: "FF-09941",
    foodName: "Packaged lentils, whole grain rice & pasta",
    category: "Packaged food",
    quantity: "12",
    unit: "sealed packs",
    servings: 120,
    preparationDate: "2026-09-12T10:00",
    bestBefore: "2026-12-30T18:00",
    pickupAddress: "44 Temple Road, Community Center",
    pickupDate: "2026-09-20",
    pickupWindow: "10:00 AM - 4:00 PM",
    description: "Unopened non-perishable pantry dry staples from donation drive.",
    storage: "Dry ambient storage",
    contact: "+91 98760 11223",
    instructions: "Direct loading into cargo area.",
    status: "completed",
    employee: "Anita Desai",
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    impactKg: 35.0,
  },
];

const storageKey = "foodflow_donor_donations";

export function useDonorDonations() {
  const readDonations = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 2) return parsed;
      }
      return seedDonations;
    } catch {
      return seedDonations;
    }
  };

  const [donations, setDonations] = useState<DonorDonation[]>(readDonations);

  useEffect(() => {
    const handleSync = () => {
      setDonations(readDonations());
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("foodflow-donations-changed", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("foodflow-donations-changed", handleSync);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(donations));
  }, [donations]);

  const addDonation = (donation: Omit<DonorDonation, "id" | "createdAt" | "status" | "employee">) => {
    const nextId = `FF-${Math.floor(10000 + Math.random() * 89999)}`;
    const next: DonorDonation = {
      ...donation,
      id: nextId,
      createdAt: new Date().toISOString(),
      status: "pending",
      employee: "Awaiting assignment",
    };
    setDonations((current) => [next, ...current]);

    // Also sync to employee jobs so worker can immediately see and accept it
    try {
      const rawJobs = localStorage.getItem("foodflow_employee_jobs");
      const currentJobs = rawJobs ? JSON.parse(rawJobs) : [];
      const newJob = {
        id: nextId,
        food: donation.foodName,
        category: donation.category,
        quantity: parseInt(donation.quantity) || 15,
        servings: donation.servings || 50,
        donor: "Live Donor",
        donorType: "Individual Donor",
        pickup: donation.pickupAddress || "15 Maple Street, Downtown",
        destination: "Hope Community Kitchen",
        window: donation.pickupWindow || "4:00 PM - 6:00 PM",
        distance: 2.8,
        priority: "high" as const,
        status: "assigned" as const,
        employee: "Unassigned",
        createdAt: new Date().toISOString(),
        notes: donation.description || "Freshly entered food donation for pickup.",
      };
      localStorage.setItem("foodflow_employee_jobs", JSON.stringify([newJob, ...currentJobs]));
      window.dispatchEvent(new Event("foodflow-jobs-changed"));
    } catch {
      // ignore
    }

    // Also sync to foodflow_all_donations
    try {
      const rawAll = localStorage.getItem("foodflow_all_donations");
      const currentAll = rawAll ? JSON.parse(rawAll) : [];
      localStorage.setItem("foodflow_all_donations", JSON.stringify([next, ...currentAll]));
    } catch {
      // ignore
    }

    window.dispatchEvent(new Event("foodflow-donations-changed"));
    return next;
  };

  const updateDonation = (id: string, patch: Partial<DonorDonation>) => {
    setDonations((current) =>
      current.map((donation) => (donation.id === id ? { ...donation, ...patch } : donation))
    );
    window.dispatchEvent(new Event("foodflow-donations-changed"));
  };

  return { donations, addDonation, updateDonation };
}

export function useDonorPreferences() {
  const [preferences, setPreferences] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("foodflow_donor_preferences") || "{}") as Record<string, boolean>;
    } catch {
      return {};
    }
  });
  useEffect(() => localStorage.setItem("foodflow_donor_preferences", JSON.stringify(preferences)), [preferences]);
  return {
    preferences,
    setPreference: (key: string, value: boolean) =>
      setPreferences((current) => ({ ...current, [key]: value })),
  };
}

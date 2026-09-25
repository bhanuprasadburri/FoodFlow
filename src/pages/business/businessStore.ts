import { useEffect, useState } from "react";

export type BusinessStatus =
  | "pending"
  | "verified"
  | "assigned"
  | "scheduled"
  | "picked_up"
  | "delivered"
  | "completed"
  | "cancelled";

export interface BusinessDonation {
  id: string;
  food: string;
  category: string;
  quantity: number;
  unit: string;
  servings: number;
  pickup: string;
  pickupDate: string;
  window: string;
  employee: string;
  status: BusinessStatus;
  createdAt: string;
  notes: string;
}

export const seedBusinessDonations: BusinessDonation[] = [
  {
    id: "DON-1048",
    food: "Chef prepared meal trays & curries",
    category: "Prepared Meals",
    quantity: 25,
    unit: "kg",
    servings: 100,
    pickup: "123 Main Street, Downtown Commercial Hub",
    pickupDate: "2026-09-25",
    window: "4:00 PM - 6:00 PM",
    employee: "Alex Morgan",
    status: "picked_up",
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    notes: "Sealed and thermal checked at 65°C. Loading dock B access.",
  },
  {
    id: "DON-1049",
    food: "Artisan sourdough bread & croissants",
    category: "Bakery",
    quantity: 14,
    unit: "kg",
    servings: 56,
    pickup: "42 Cedar Lane, Midtown Market",
    pickupDate: "2026-09-25",
    window: "2:00 PM - 4:00 PM",
    employee: "Alex Morgan",
    status: "assigned",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    notes: "Fresh morning batch packaged in paper bags. Handle with care.",
  },
  {
    id: "DON-1036",
    food: "Breakfast buffet egg & vegetable rolls",
    category: "Prepared Meals",
    quantity: 18,
    unit: "kg",
    servings: 72,
    pickup: "123 Main Street, Downtown",
    pickupDate: "2026-09-24",
    window: "11:30 AM - 1:00 PM",
    employee: "Jamie Lee",
    status: "completed",
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
    notes: "Delivered to Hope Community Kitchen within safe consumption window.",
  },
  {
    id: "DON-1024",
    food: "Bakery sandwich rolls & sweet baguettes",
    category: "Bakery",
    quantity: 20,
    unit: "kg",
    servings: 80,
    pickup: "123 Main Street, Downtown",
    pickupDate: "2026-09-23",
    window: "5:00 PM - 6:00 PM",
    employee: "Jamie Lee",
    status: "completed",
    createdAt: new Date(Date.now() - 3600000 * 50).toISOString(),
    notes: "Delivered to St. Mary's Shelter. Food safety certificate uploaded.",
  },
  {
    id: "DON-1015",
    food: "Fresh salad greens & sliced fruit tubs",
    category: "Produce",
    quantity: 16,
    unit: "kg",
    servings: 60,
    pickup: "123 Main Street, Downtown",
    pickupDate: "2026-09-22",
    window: "2:00 PM - 3:30 PM",
    employee: "Priya Sharma",
    status: "completed",
    createdAt: new Date(Date.now() - 3600000 * 75).toISOString(),
    notes: "Distributed to local primary school afternoon nutrition program.",
  },
  {
    id: "DON-1055",
    food: "Dinner buffet vegetarian pasta & baked rice",
    category: "Prepared Meals",
    quantity: 30,
    unit: "kg",
    servings: 120,
    pickup: "123 Main Street, Downtown",
    pickupDate: "2026-09-25",
    window: "8:00 PM - 9:30 PM",
    employee: "Awaiting assignment",
    status: "pending",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    notes: "Packed immediately post-event in food grade aluminum containers.",
  },
];

const donationKey = "foodflow_business_donations";

export function useBusinessDonations() {
  const readDonations = () => {
    try {
      const stored = localStorage.getItem(donationKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 2) return parsed;
      }
      return seedBusinessDonations;
    } catch {
      return seedBusinessDonations;
    }
  };

  const [donations, setDonations] = useState<BusinessDonation[]>(readDonations);

  useEffect(() => {
    const handleSync = () => {
      setDonations(readDonations());
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("foodflow-business-donations-changed", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("foodflow-business-donations-changed", handleSync);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(donationKey, JSON.stringify(donations));
  }, [donations]);

  const add = (input: Omit<BusinessDonation, "id" | "createdAt" | "status" | "employee">) => {
    const nextId = `DON-${Math.floor(1000 + Math.random() * 8999)}`;
    const donation: BusinessDonation = {
      ...input,
      id: nextId,
      createdAt: new Date().toISOString(),
      status: "pending",
      employee: "Awaiting assignment",
    };
    setDonations((current) => [donation, ...current]);

    // Also sync to employee jobs
    try {
      const rawJobs = localStorage.getItem("foodflow_employee_jobs");
      const currentJobs = rawJobs ? JSON.parse(rawJobs) : [];
      const newJob = {
        id: nextId,
        food: input.food,
        category: input.category,
        quantity: input.quantity,
        servings: input.servings || 50,
        donor: "Business Partner",
        donorType: "Business",
        pickup: input.pickup || "Midtown Commercial Hub",
        destination: "Hope Community Shelter",
        window: input.window || "2:00 PM - 4:00 PM",
        distance: 3.5,
        priority: "high" as const,
        status: "assigned" as const,
        employee: "Unassigned",
        createdAt: new Date().toISOString(),
        notes: input.notes || "Surplus food from business kitchen.",
      };
      localStorage.setItem("foodflow_employee_jobs", JSON.stringify([newJob, ...currentJobs]));
      window.dispatchEvent(new Event("foodflow-jobs-changed"));
    } catch {
      // ignore
    }

    // Also sync to all donations
    try {
      const rawAll = localStorage.getItem("foodflow_all_donations");
      const currentAll = rawAll ? JSON.parse(rawAll) : [];
      localStorage.setItem("foodflow_all_donations", JSON.stringify([donation, ...currentAll]));
    } catch {
      // ignore
    }

    window.dispatchEvent(new Event("foodflow-business-donations-changed"));
    return donation;
  };

  const update = (id: string, patch: Partial<BusinessDonation>) => {
    setDonations((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
    window.dispatchEvent(new Event("foodflow-business-donations-changed"));
  };

  return { donations, add, update };
}

export function useBusinessPreferences() {
  const [values, setValues] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem("foodflow_business_preferences") || "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("foodflow_business_preferences", JSON.stringify(values));
  }, [values]);

  return {
    values,
    setValue: (key: string, value: boolean) =>
      setValues((current) => ({ ...current, [key]: value })),
  };
}

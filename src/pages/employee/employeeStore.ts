import { useEffect, useState } from "react";

export type EmployeeStatus =
  | "assigned"
  | "started"
  | "travelling"
  | "arrived"
  | "picked_up"
  | "delivery_started"
  | "delivered"
  | "completed"
  | "issue"
  | "cancelled";

export interface EmployeeJob {
  id: string;
  food: string;
  category: string;
  quantity: number;
  servings: number;
  donor: string;
  donorType: string;
  pickup: string;
  destination: string;
  window: string;
  distance: number;
  priority: "high" | "medium" | "normal";
  status: EmployeeStatus;
  employee: string;
  createdAt: string;
  notes: string;
}

export const seedJobs: EmployeeJob[] = [
  {
    id: "DON-1048",
    food: "Fresh vegetable biryani & raita",
    category: "Cooked meal",
    quantity: 25,
    servings: 100,
    donor: "Grand Hotel Kitchen",
    donorType: "Business",
    pickup: "123 Main Street, Downtown Commercial Hub",
    destination: "Hope Community Kitchen",
    window: "4:00 PM - 6:00 PM",
    distance: 3.2,
    priority: "high",
    status: "picked_up",
    employee: "Alex Morgan",
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    notes: "Food is in thermal insulated containers at Loading Dock B. Temperature verified at 65°C.",
  },
  {
    id: "DON-1049",
    food: "Artisan sourdough loaves & buns",
    category: "Bakery",
    quantity: 14,
    servings: 56,
    donor: "Green Leaf Bakery & Deli",
    donorType: "Business",
    pickup: "42 Cedar Lane, Midtown Market",
    destination: "Northside Community Shelter",
    window: "2:00 PM - 4:00 PM",
    distance: 4.8,
    priority: "medium",
    status: "travelling",
    employee: "Alex Morgan",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    notes: "Assorted breads bagged and labeled. Ask for front counter supervisor.",
  },
  {
    id: "DON-1050",
    food: "Organic crisp apples & citrus crates",
    category: "Fresh produce",
    quantity: 32,
    servings: 120,
    donor: "City Central Farmers Market",
    donorType: "Business",
    pickup: "88 Market Square, North District",
    destination: "Saint Jude Children's Home",
    window: "10:00 AM - 12:00 PM",
    distance: 6.5,
    priority: "normal",
    status: "completed",
    employee: "Alex Morgan",
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    notes: "Delivered smoothly. Signature received from shelter intake manager.",
  },
  {
    id: "DON-1051",
    food: "Nutritious meal boxes & thalis",
    category: "Cooked meal",
    quantity: 16,
    servings: 65,
    donor: "Alex Johnson",
    donorType: "Individual Donor",
    pickup: "15 Maple Street, Downtown Sector 4",
    destination: "Grace Care Home for Elders",
    window: "5:30 PM - 7:00 PM",
    distance: 2.1,
    priority: "high",
    status: "assigned",
    employee: "Alex Morgan",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    notes: "Call donor 10 mins before arrival at building entrance. Security clearance already arranged.",
  },
  {
    id: "DON-1052",
    food: "Milk cartons & yogurt tubs",
    category: "Dairy",
    quantity: 18,
    servings: 50,
    donor: "Apex Supermarket Chain",
    donorType: "Business",
    pickup: "102 Industrial Area, West",
    destination: "Eastside Slum Feeding Drive",
    window: "11:00 AM - 1:00 PM",
    distance: 7.4,
    priority: "normal",
    status: "completed",
    employee: "Alex Morgan",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    notes: "Kept in cold storage boxes. Delivered and distributed within 45 minutes of pickup.",
  },
  {
    id: "DON-1053",
    food: "Hot buffet pasta & garlic bread",
    category: "Cooked meal",
    quantity: 22,
    servings: 85,
    donor: "Royal Banquet Pavilion",
    donorType: "Business",
    pickup: "78 Grand Residency Boulevard",
    destination: "City Night Shelter Center",
    window: "3:00 PM - 5:00 PM",
    distance: 3.9,
    priority: "high",
    status: "assigned",
    employee: "Unassigned",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    notes: "Urgent pickup needed before 5 PM. 22 kg untouched hot buffet spread.",
  },
  {
    id: "DON-1054",
    food: "Sealed grocery packages & rice sacks",
    category: "Packaged food",
    quantity: 35,
    servings: 140,
    donor: "Metro Retail Distribution",
    donorType: "Business",
    pickup: "55 Logistics Highway, Sector 18",
    destination: "District Food Rescue Bank",
    window: "1:00 PM - 3:00 PM",
    distance: 5.2,
    priority: "normal",
    status: "assigned",
    employee: "Unassigned",
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    notes: "Ready on loading pallet 4. Direct pickup available.",
  },
];

const key = "foodflow_employee_jobs";

export function useEmployeeJobs() {
  const readJobs = () => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 3) return parsed;
      }
      return seedJobs;
    } catch {
      return seedJobs;
    }
  };

  const [jobs, setJobs] = useState<EmployeeJob[]>(readJobs);

  useEffect(() => {
    const handleSync = () => {
      setJobs(readJobs());
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("foodflow-jobs-changed", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("foodflow-jobs-changed", handleSync);
    };
  }, []);

  useEffect(() => localStorage.setItem(key, JSON.stringify(jobs)), [jobs]);

  const updateJob = (id: string, patch: Partial<EmployeeJob>) => {
    setJobs((current) =>
      current.map((job) => (job.id === id ? { ...job, ...patch } : job))
    );
    window.dispatchEvent(new Event("foodflow-jobs-changed"));
  };

  const acceptJob = (id: string) =>
    updateJob(id, { status: "assigned", employee: "Alex Morgan" });

  return { jobs, updateJob, acceptJob };
}

export function useEmployeePreferences() {
  const [preferences, setPreferences] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem("foodflow_employee_preferences") || "{}");
    } catch {
      return {};
    }
  });
  useEffect(() => localStorage.setItem("foodflow_employee_preferences", JSON.stringify(preferences)), [preferences]);
  return {
    preferences,
    setPreference: (k: string, value: boolean) =>
      setPreferences((current) => ({ ...current, [k]: value })),
  };
}

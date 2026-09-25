import { useState, useEffect } from "react";

export interface MockDonation {
  _id: string;
  id: string;
  foodName: string;
  foodCategory: "cooked" | "raw" | "packaged" | "bakery" | "dairy" | "produce" | "other";
  quantity: string;
  quantityKg: number;
  servesPeople: number;
  condition: "fresh" | "good" | "edible" | "not_for_human";
  preparationDate: string;
  expiryDate: string;
  pickupAddress: string;
  pickupTimeWindow: string;
  contactPhone: string;
  instructions: string;
  status: "pending" | "accepted" | "on_the_way" | "picked_up" | "delivered" | "completed" | "cancelled";
  donorType: "user" | "business";
  donorName: string;
  employeeName: string;
  createdAt: number;
  earningsINR: number;
  paymentStatus: "Paid" | "Pending verification" | "Processing" | "Not eligible";
}

export const SEED_DONATIONS: MockDonation[] = [
  {
    _id: "don-1048",
    id: "FF-10482",
    foodName: "Fresh vegetable biryani & raita",
    foodCategory: "cooked",
    quantity: "8 containers",
    quantityKg: 25,
    servesPeople: 100,
    condition: "fresh",
    preparationDate: "2026-09-25T11:00",
    expiryDate: "2026-09-25T21:00",
    pickupAddress: "123 Main Street, Downtown Commercial Hub",
    pickupTimeWindow: "4:00 PM - 6:00 PM",
    contactPhone: "+91 98765 43210",
    instructions: "Please enter via loading dock B. Food is sealed in insulated food warmers.",
    status: "picked_up",
    donorType: "business",
    donorName: "Grand Hotel Kitchen",
    employeeName: "Alex Morgan",
    createdAt: Date.now() - 3600000 * 3,
    earningsINR: 600,
    paymentStatus: "Paid",
  },
  {
    _id: "don-1049",
    id: "FF-10391",
    foodName: "Artisan sourdough bread & croissants",
    foodCategory: "bakery",
    quantity: "14 kg assorted",
    quantityKg: 14,
    servesPeople: 56,
    condition: "fresh",
    preparationDate: "2026-09-25T07:30",
    expiryDate: "2026-09-27T18:00",
    pickupAddress: "42 Cedar Lane, Midtown Market",
    pickupTimeWindow: "2:00 PM - 4:00 PM",
    contactPhone: "+91 98220 12345",
    instructions: "Packaged in clean bakery bags. Keep upright.",
    status: "on_the_way",
    donorType: "business",
    donorName: "Green Leaf Bakery & Deli",
    employeeName: "Alex Morgan",
    createdAt: Date.now() - 3600000 * 5,
    earningsINR: 252,
    paymentStatus: "Processing",
  },
  {
    _id: "don-1050",
    id: "FF-10284",
    foodName: "Farm fresh organic fruits & green produce",
    foodCategory: "produce",
    quantity: "6 crates",
    quantityKg: 32,
    servesPeople: 120,
    condition: "fresh",
    preparationDate: "2026-09-24T16:00",
    expiryDate: "2026-09-28T12:00",
    pickupAddress: "88 Market Square, North Wholesale Terminal",
    pickupTimeWindow: "10:00 AM - 12:00 PM",
    contactPhone: "+91 97110 56789",
    instructions: "Refrigerated storage near stall 14.",
    status: "delivered",
    donorType: "business",
    donorName: "City Central Farmers Market",
    employeeName: "Jamie Lee",
    createdAt: Date.now() - 3600000 * 20,
    earningsINR: 448,
    paymentStatus: "Paid",
  },
  {
    _id: "don-1051",
    id: "FF-10190",
    foodName: "Nutritious meal boxes & vegetarian thalis",
    foodCategory: "cooked",
    quantity: "20 meal boxes",
    quantityKg: 16,
    servesPeople: 65,
    condition: "fresh",
    preparationDate: "2026-09-25T12:30",
    expiryDate: "2026-09-25T20:30",
    pickupAddress: "15 Maple Street, Downtown Sector 4",
    pickupTimeWindow: "5:30 PM - 7:00 PM",
    contactPhone: "+91 99887 76655",
    instructions: "Packed freshly from corporate event lunch. Handover at reception desk.",
    status: "accepted",
    donorType: "user",
    donorName: "Alex Johnson",
    employeeName: "Priya Sharma",
    createdAt: Date.now() - 3600000 * 2,
    earningsINR: 384,
    paymentStatus: "Pending verification",
  },
  {
    _id: "don-1052",
    id: "FF-10045",
    foodName: "Pasteurized milk cartons & fresh yogurt tubs",
    foodCategory: "dairy",
    quantity: "15 liters & 10 tubs",
    quantityKg: 18,
    servesPeople: 50,
    condition: "fresh",
    preparationDate: "2026-09-23T08:00",
    expiryDate: "2026-09-27T10:00",
    pickupAddress: "102 Industrial Area, West Cold Storage",
    pickupTimeWindow: "11:00 AM - 1:00 PM",
    contactPhone: "+91 98450 33445",
    instructions: "Temperature controlled. Vehicle must have cold pack compartment.",
    status: "completed",
    donorType: "business",
    donorName: "Apex Supermarket Chain",
    employeeName: "Rahul Verma",
    createdAt: Date.now() - 3600000 * 48,
    earningsINR: 288,
    paymentStatus: "Paid",
  },
  {
    _id: "don-1053",
    id: "FF-10512",
    foodName: "Cooked buffet pasta, bread rolls & soup",
    foodCategory: "cooked",
    quantity: "5 large trays",
    quantityKg: 22,
    servesPeople: 85,
    condition: "good",
    preparationDate: "2026-09-25T13:00",
    expiryDate: "2026-09-25T22:00",
    pickupAddress: "78 Grand Residency Boulevard",
    pickupTimeWindow: "3:00 PM - 5:00 PM",
    contactPhone: "+91 91234 56780",
    instructions: "Covered tightly with aluminium foil.",
    status: "pending",
    donorType: "user",
    donorName: "Ananya Roy",
    employeeName: "Awaiting assignment",
    createdAt: Date.now() - 1800000,
    earningsINR: 528,
    paymentStatus: "Pending verification",
  },
  {
    _id: "don-1054",
    id: "FF-09941",
    foodName: "Packaged dry pulses, rice & wheat flour",
    foodCategory: "packaged",
    quantity: "10 sealed packs",
    quantityKg: 30,
    servesPeople: 140,
    condition: "good",
    preparationDate: "2026-09-10T10:00",
    expiryDate: "2026-12-30T18:00",
    pickupAddress: "44 Temple Road, Community Center",
    pickupTimeWindow: "10:00 AM - 6:00 PM",
    contactPhone: "+91 98760 11223",
    instructions: "Long shelf life. Sealed original packaging.",
    status: "completed",
    donorType: "user",
    donorName: "Vikram Mehta",
    employeeName: "Anita Desai",
    createdAt: Date.now() - 3600000 * 72,
    earningsINR: 360,
    paymentStatus: "Paid",
  }
];

export interface MockEmployee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  vehicle: string;
  rating: number;
  activePickups: number;
  completedJobs: number;
  status: "active" | "on_break" | "offline";
  joinedDate: string;
}

export const SEED_EMPLOYEES: MockEmployee[] = [
  {
    _id: "emp-1",
    name: "Alex Morgan",
    email: "alex.morgan@foodflow.com",
    phone: "+91 98765 01001",
    region: "Downtown & Midtown",
    vehicle: "Eco Van (KA-01-EA-2041)",
    rating: 4.9,
    activePickups: 2,
    completedJobs: 148,
    status: "active",
    joinedDate: "Jan 2026",
  },
  {
    _id: "emp-2",
    name: "Jamie Lee",
    email: "jamie.lee@foodflow.com",
    phone: "+91 98765 01002",
    region: "North District",
    vehicle: "E-Cargo Bike (KA-01-EB-1092)",
    rating: 4.8,
    activePickups: 1,
    completedJobs: 112,
    status: "active",
    joinedDate: "Feb 2026",
  },
  {
    _id: "emp-3",
    name: "Priya Sharma",
    email: "priya.sharma@foodflow.com",
    phone: "+91 98765 01003",
    region: "Eastside Commercial Hub",
    vehicle: "Light Rescue Truck (KA-01-LT-5511)",
    rating: 4.95,
    activePickups: 1,
    completedJobs: 185,
    status: "active",
    joinedDate: "Dec 2025",
  },
  {
    _id: "emp-4",
    name: "Rahul Verma",
    email: "rahul.verma@foodflow.com",
    phone: "+91 98765 01004",
    region: "West Industrial Zone",
    vehicle: "Insulated Van (KA-01-IV-8822)",
    rating: 4.7,
    activePickups: 0,
    completedJobs: 96,
    status: "active",
    joinedDate: "Mar 2026",
  },
  {
    _id: "emp-5",
    name: "Anita Desai",
    email: "anita.desai@foodflow.com",
    phone: "+91 98765 01005",
    region: "South Residential Corridor",
    vehicle: "Eco Van (KA-01-EA-3344)",
    rating: 5.0,
    activePickups: 0,
    completedJobs: 210,
    status: "active",
    joinedDate: "Nov 2025",
  },
];

export interface MockBusiness {
  _id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  impactScore: number;
  totalDonatedKg: number;
  mealsSupported: number;
  plan: string;
  planPrice: string;
  verificationStatus: "verified" | "pending";
}

export const SEED_BUSINESSES: MockBusiness[] = [
  {
    _id: "biz-1",
    businessName: "Grand Hotel Kitchen & Banquets",
    contactName: "Chef Rajesh Kumar",
    email: "kitchen@grandhotel.com",
    phone: "+91 98111 22334",
    address: "123 Main Street, Downtown",
    category: "Hospitality & Dining",
    impactScore: 94,
    totalDonatedKg: 1420,
    mealsSupported: 5680,
    plan: "Enterprise Plus",
    planPrice: "₹4,999/mo",
    verificationStatus: "verified",
  },
  {
    _id: "biz-2",
    businessName: "Green Leaf Bakery & Deli",
    contactName: "Sunita Patel",
    email: "contact@greenleaf.com",
    phone: "+91 98222 33445",
    address: "42 Cedar Lane, Midtown",
    category: "Artisan Bakery",
    impactScore: 88,
    totalDonatedKg: 680,
    mealsSupported: 2720,
    plan: "Growth Partner",
    planPrice: "₹1,999/mo",
    verificationStatus: "verified",
  },
  {
    _id: "biz-3",
    businessName: "City Central Farmers Market",
    contactName: "Gopal Rao",
    email: "info@cityfarmersmarket.com",
    phone: "+91 98333 44556",
    address: "88 Market Square, North District",
    category: "Fresh Produce Wholesale",
    impactScore: 92,
    totalDonatedKg: 2150,
    mealsSupported: 8600,
    plan: "Enterprise Plus",
    planPrice: "₹4,999/mo",
    verificationStatus: "verified",
  },
  {
    _id: "biz-4",
    businessName: "Apex Supermarket Chain",
    contactName: "Rohan Kapoor",
    email: "csr@apexretail.com",
    phone: "+91 98444 55667",
    address: "102 Industrial Area, West",
    category: "Retail Supermarket",
    impactScore: 85,
    totalDonatedKg: 3400,
    mealsSupported: 13600,
    plan: "Custom Multi-Outlet",
    planPrice: "₹9,999/mo",
    verificationStatus: "verified",
  },
  {
    _id: "biz-5",
    businessName: "Royal Heritage Catering",
    contactName: "Kavita Nair",
    email: "events@royalheritage.com",
    phone: "+91 98555 66778",
    address: "14 Palace Road, South Sector",
    category: "Event Catering",
    impactScore: 79,
    totalDonatedKg: 940,
    mealsSupported: 3760,
    plan: "Starter Monthly",
    planPrice: "₹999/mo",
    verificationStatus: "verified",
  },
];

export interface MockBiogasPartner {
  _id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  totalCapacityKg: number;
  currentIntakeKg: number;
  availableCapacityKg: number;
  biogasProducedKwh: number;
  agreedWeeklyKg: number;
  status: "Active" | "Verified" | "Paused";
}

export const SEED_BIOGAS: MockBiogasPartner[] = [
  {
    _id: "bio-1",
    name: "Green Energy Biogas & Biomethanation Plant",
    contactPerson: "Dr. K. S. Murthy",
    email: "operations@greenenergybiogas.com",
    phone: "+91 98666 77889",
    location: "Sector 9 Bio Clean Tech Park, Westside",
    totalCapacityKg: 1000,
    currentIntakeKg: 720,
    availableCapacityKg: 280,
    biogasProducedKwh: 328,
    agreedWeeklyKg: 500,
    status: "Active",
  },
  {
    _id: "bio-2",
    name: "EcoCycle Anaerobic Digestion Facility",
    contactPerson: "Suresh Nambiar",
    email: "contact@ecocycle.org",
    phone: "+91 98777 88990",
    location: "Plot 44, East Environmental Zone",
    totalCapacityKg: 2500,
    currentIntakeKg: 1650,
    availableCapacityKg: 850,
    biogasProducedKwh: 790,
    agreedWeeklyKg: 700,
    status: "Active",
  },
  {
    _id: "bio-3",
    name: "RenewLoop Organic Composting & Biofuels",
    contactPerson: "Meera Sen",
    email: "intake@renewloop.in",
    phone: "+91 98888 99001",
    location: "North Agri Waste Processing Unit 3",
    totalCapacityKg: 800,
    currentIntakeKg: 480,
    availableCapacityKg: 320,
    biogasProducedKwh: 215,
    agreedWeeklyKg: 320,
    status: "Verified",
  },
];

export interface MockSupplyRequest {
  id: string;
  _id: string;
  source: string;
  category: string;
  quantity: number;
  pickup: string;
  pickupDate: string;
  status: "pending" | "accepted" | "scheduled" | "in_transit" | "received" | "processing" | "completed" | "rejected";
  notes: string;
}

export const SEED_SUPPLY_REQUESTS: MockSupplyRequest[] = [
  {
    id: "SUP-1048",
    _id: "sup-1048",
    source: "Grand Hotel Kitchen",
    category: "Organic Food Waste & Peels",
    quantity: 150,
    pickup: "123 Main Street, Downtown",
    pickupDate: "2026-09-25",
    status: "accepted",
    notes: "Non-consumable organic prep trimmings under active agreement AGR-2026-01.",
  },
  {
    id: "SUP-1049",
    _id: "sup-1049",
    source: "Green Leaf Deli",
    category: "Coffee grounds & produce trimmings",
    quantity: 90,
    pickup: "42 Cedar Lane, Midtown",
    pickupDate: "2026-09-25",
    status: "processing",
    notes: "High nitrogen organic material, ideal for digester booster tank 2.",
  },
  {
    id: "SUP-1050",
    _id: "sup-1050",
    source: "City Wholesale Mart",
    category: "Damaged fruits & spoiled vegetables",
    quantity: 240,
    pickup: "88 Market Square, North District",
    pickupDate: "2026-09-26",
    status: "pending",
    notes: "Moisture content verified. Scheduled for morning pickup.",
  },
  {
    id: "SUP-1051",
    _id: "sup-1051",
    source: "Central Food Court Complex",
    category: "Kitchen & food prep scraps",
    quantity: 180,
    pickup: "Mall Central, Level B2 Service Area",
    pickupDate: "2026-09-26",
    status: "in_transit",
    notes: "Driver Alex Morgan transporting in dedicated organic bin truck.",
  },
  {
    id: "SUP-1052",
    _id: "sup-1052",
    source: "Apex Supermarket",
    category: "Expired bakery dough & grains",
    quantity: 110,
    pickup: "102 Industrial Area, West",
    pickupDate: "2026-09-24",
    status: "completed",
    notes: "Digestion cycle completed. Yielded 48 m³ biogas equivalent.",
  },
];

export interface MockAgreement {
  _id: string;
  title: string;
  partnerName: string;
  description: string;
  capacityKgPerWeek: number;
  acceptedCategories: string[];
  status: "active" | "draft" | "under_review";
  effectiveDate: string;
  subsidyRatePerKg: string;
}

export const SEED_AGREEMENTS: MockAgreement[] = [
  {
    _id: "agr-2026-01",
    title: "Municipal Organic Waste to Clean Biogas Agreement",
    partnerName: "Green Energy Biogas & Biomethanation Plant",
    description: "Guaranteed weekly supply of non-edible food prep waste and kitchen scraps for biomethanation and power grid injection.",
    capacityKgPerWeek: 500,
    acceptedCategories: ["Cooked prep waste", "Fruit & vegetable peels", "Coffee grounds", "Expired bakery"],
    status: "active",
    effectiveDate: "Jan 1, 2026 – Dec 31, 2026",
    subsidyRatePerKg: "₹8.50 / kg processed",
  },
  {
    _id: "agr-2026-02",
    title: "Commercial Kitchen Residual Biomass Conversion Pact",
    partnerName: "EcoCycle Anaerobic Digestion Facility",
    description: "Processing contract covering large hotel and banquet food residual byproducts into enriched bio-fertilizer and compressed biogas (CBG).",
    capacityKgPerWeek: 700,
    acceptedCategories: ["Pre-consumer food trimmings", "Grain wash residues", "Spoiled perishables"],
    status: "active",
    effectiveDate: "Feb 15, 2026 – Feb 14, 2027",
    subsidyRatePerKg: "₹9.00 / kg processed",
  },
  {
    _id: "agr-2026-03",
    title: "Regional Produce Waste Composting Pipeline",
    partnerName: "RenewLoop Organic Composting",
    description: "Wholesale market surplus redirection for aerobic decomposition and premium horticultural compost production.",
    capacityKgPerWeek: 320,
    acceptedCategories: ["Market vegetables", "Unsold leafy greens", "Fruit pulp"],
    status: "active",
    effectiveDate: "Mar 1, 2026 – Feb 28, 2027",
    subsidyRatePerKg: "₹7.00 / kg processed",
  },
];

// Helper to access stored data with instant reactive synchronization
export function useMockDonations() {
  const [donations, setDonations] = useState<MockDonation[]>(() => {
    try {
      const stored = localStorage.getItem("foodflow_all_donations");
      return stored ? JSON.parse(stored) : SEED_DONATIONS;
    } catch {
      return SEED_DONATIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem("foodflow_all_donations", JSON.stringify(donations));
  }, [donations]);

  const addDonation = (newDonation: Omit<MockDonation, "_id" | "id" | "createdAt">) => {
    const randomNum = Math.floor(10000 + Math.random() * 89999);
    const item: MockDonation = {
      ...newDonation,
      _id: `don-${randomNum}`,
      id: `FF-${randomNum}`,
      createdAt: Date.now(),
    };
    setDonations((prev) => [item, ...prev]);
    // Also sync to legacy donor storage key so all views stay identical
    try {
      const legacy = JSON.parse(localStorage.getItem("foodflow_donor_donations") || "[]");
      localStorage.setItem("foodflow_donor_donations", JSON.stringify([item, ...legacy]));
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event("foodflow-donations-changed"));
    return item;
  };

  const updateDonationStatus = (id: string, status: MockDonation["status"]) => {
    setDonations((prev) =>
      prev.map((d) => (d._id === id || d.id === id ? { ...d, status } : d))
    );
    window.dispatchEvent(new Event("foodflow-donations-changed"));
  };

  return { donations, addDonation, updateDonationStatus };
}

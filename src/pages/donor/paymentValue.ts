import type { DonorDonation } from "./donorStore";

const categoryRates: Record<string, number> = {
  "Cooked meal": 24,
  Bakery: 18,
  "Fresh produce": 14,
  "Packaged food": 12,
  Dairy: 16,
  "Raw ingredients": 12,
};

export function getDonationRate(donation: DonorDonation) {
  return categoryRates[donation.category] ?? 10;
}

export function getDonationValue(donation: DonorDonation) {
  return Math.round(donation.impactKg * getDonationRate(donation));
}

export function getPaymentStatus(donation: DonorDonation) {
  if (donation.status === "completed") return "Paid";
  if (donation.status === "cancelled") return "Not eligible";
  return "Pending verification";
}

export function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

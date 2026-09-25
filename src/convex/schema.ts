import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// ─── Roles ────────────────────────────────────────────────────────────────────
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  EMPLOYEE: "employee",
  BUSINESS: "business",
  BIOGAS: "biogas",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.EMPLOYEE),
  v.literal(ROLES.BUSINESS),
  v.literal(ROLES.BIOGAS),
);
export type Role = Infer<typeof roleValidator>;

// ─── Donation status ──────────────────────────────────────────────────────────
export const DONATION_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  ON_THE_WAY: "on_the_way",
  PICKED_UP: "picked_up",
  DELIVERED: "delivered",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const donationStatusValidator = v.union(
  v.literal(DONATION_STATUS.PENDING),
  v.literal(DONATION_STATUS.ACCEPTED),
  v.literal(DONATION_STATUS.ON_THE_WAY),
  v.literal(DONATION_STATUS.PICKED_UP),
  v.literal(DONATION_STATUS.DELIVERED),
  v.literal(DONATION_STATUS.COMPLETED),
  v.literal(DONATION_STATUS.CANCELLED),
);
export type DonationStatus = Infer<typeof donationStatusValidator>;

// ─── Supply status ────────────────────────────────────────────────────────────
export const SUPPLY_STATUS = {
  AVAILABLE: "available",
  ACCEPTED: "accepted",
  SCHEDULED: "scheduled",
  COLLECTED: "collected",
  PROCESSED: "processed",
  CANCELLED: "cancelled",
} as const;

export const supplyStatusValidator = v.union(
  v.literal(SUPPLY_STATUS.AVAILABLE),
  v.literal(SUPPLY_STATUS.ACCEPTED),
  v.literal(SUPPLY_STATUS.SCHEDULED),
  v.literal(SUPPLY_STATUS.COLLECTED),
  v.literal(SUPPLY_STATUS.PROCESSED),
  v.literal(SUPPLY_STATUS.CANCELLED),
);
export type SupplyStatus = Infer<typeof supplyStatusValidator>;

const schema = defineSchema(
  {
    // ─── Auth tables ────────────────────────────────────────────────────────
    ...authTables,

    // ─── Users ──────────────────────────────────────────────────────────────
    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
      phone: v.optional(v.string()),
      address: v.optional(v.string()),
      verificationStatus: v.optional(v.union(v.literal("pending"), v.literal("verified"), v.literal("rejected"))),
      verifiedAt: v.optional(v.number()),
      createdAt: v.optional(v.number()),
    }).index("email", ["email"]),

    // ─── Employees ──────────────────────────────────────────────────────────
    employees: defineTable({
      userId: v.id("users"),
      employeeId: v.string(),
      phone: v.optional(v.string()),
      vehicleType: v.optional(v.string()),
      zone: v.optional(v.string()),
      status: v.optional(v.union(v.literal("active"), v.literal("inactive"), v.literal("on_leave"))),
      totalDeliveries: v.number(),
      rating: v.number(),
      joinedAt: v.number(),
    }).index("by_userId", ["userId"])
      .index("by_status", ["status"]),

    // ─── Businesses ─────────────────────────────────────────────────────────
    businesses: defineTable({
      userId: v.id("users"),
      businessName: v.string(),
      businessType: v.union(v.literal("restaurant"), v.literal("hotel"), v.literal("catering"), v.literal("bakery"), v.literal("other")),
      registrationNumber: v.optional(v.string()),
      phone: v.string(),
      address: v.string(),
      city: v.optional(v.string()),
      verificationStatus: v.union(v.literal("pending"), v.literal("verified"), v.literal("rejected")),
      subscriptionPlan: v.optional(v.union(v.literal("free"), v.literal("starter"), v.literal("professional"), v.literal("enterprise"))),
      subscriptionExpiry: v.optional(v.number()),
      totalDonations: v.number(),
      totalQuantityKg: v.number(),
      impactScore: v.number(),
      createdAt: v.number(),
    }).index("by_userId", ["userId"])
      .index("by_verification", ["verificationStatus"]),

    // ─── Biogas Partners ────────────────────────────────────────────────────
    biogasPartners: defineTable({
      userId: v.id("users"),
      partnerName: v.string(),
      partnerType: v.union(v.literal("biogas"), v.literal("composting"), v.literal("recycling"), v.literal("animal_feed")),
      capacityKgPerWeek: v.number(),
      phone: v.string(),
      address: v.string(),
      city: v.optional(v.string()),
      verificationStatus: v.union(v.literal("pending"), v.literal("verified"), v.literal("rejected")),
      totalCollectedKg: v.number(),
      createdAt: v.number(),
    }).index("by_userId", ["userId"])
      .index("by_verification", ["verificationStatus"]),

    // ─── Donations ──────────────────────────────────────────────────────────
    donations: defineTable({
      donorId: v.id("users"),
      donorType: v.union(v.literal("user"), v.literal("business")),
      foodName: v.string(),
      foodCategory: v.union(v.literal("cooked"), v.literal("raw"), v.literal("packaged"), v.literal("bakery"), v.literal("dairy"), v.literal("produce"), v.literal("other")),
      quantity: v.string(),
      quantityKg: v.number(),
      servesPeople: v.number(),
      condition: v.union(v.literal("fresh"), v.literal("good"), v.literal("edible"), v.literal("not_for_human")),
      preparationDate: v.string(),
      expiryDate: v.string(),
      pickupAddress: v.string(),
      pickupTimeWindow: v.optional(v.string()),
      contactPhone: v.string(),
      imageUrl: v.optional(v.string()),
      instructions: v.optional(v.string()),
      safetyDeclaration: v.boolean(),
      status: donationStatusValidator,
      assignedEmployeeId: v.optional(v.id("employees")),
      assignedBusinessId: v.optional(v.id("businesses")),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("by_donorId", ["donorId"])
      .index("by_status", ["status"])
      .index("by_employeeId", ["assignedEmployeeId"]),

    // ─── Donation Tracking ───────────────────────────────────────────────────
    donationTracking: defineTable({
      donationId: v.id("donations"),
      status: donationStatusValidator,
      updatedBy: v.id("users"),
      note: v.optional(v.string()),
      timestamp: v.number(),
    }).index("by_donationId", ["donationId"]),

    // ─── Notifications ──────────────────────────────────────────────────────
    notifications: defineTable({
      userId: v.id("users"),
      title: v.string(),
      message: v.string(),
      type: v.union(v.literal("info"), v.literal("success"), v.literal("warning"), v.literal("alert")),
      read: v.boolean(),
      link: v.optional(v.string()),
      createdAt: v.number(),
    }).index("by_userId", ["userId"])
      .index("by_userId_read", ["userId", "read"]),

    // ─── Supply Agreements ──────────────────────────────────────────────────
    supplyAgreements: defineTable({
      biogasPartnerId: v.id("biogasPartners"),
      title: v.string(),
      description: v.string(),
      capacityKgPerWeek: v.number(),
      acceptedCategories: v.array(v.string()),
      status: v.union(v.literal("active"), v.literal("pending"), v.literal("expired"), v.literal("cancelled")),
      createdAt: v.number(),
    }).index("by_partnerId", ["biogasPartnerId"]),

    // ─── Food Waste Supplies ────────────────────────────────────────────────
    foodWasteSupplies: defineTable({
      donationId: v.id("donations"),
      biogasPartnerId: v.id("biogasPartners"),
      supplyStatus: supplyStatusValidator,
      quantityKg: v.number(),
      category: v.string(),
      scheduledDate: v.optional(v.string()),
      collectedDate: v.optional(v.string()),
      processedDate: v.optional(v.string()),
      notes: v.optional(v.string()),
      createdAt: v.number(),
    }).index("by_partnerId", ["biogasPartnerId"]) 
      .index("by_donationId", ["donationId"]),

    // ─── Subscriptions ──────────────────────────────────────────────────────
    subscriptions: defineTable({
      businessId: v.id("businesses"),
      plan: v.union(v.literal("free"), v.literal("starter"), v.literal("professional"), v.literal("enterprise")),
      status: v.union(v.literal("active"), v.literal("cancelled"), v.literal("expired")),
      startDate: v.number(),
      expiryDate: v.number(),
      monthlyPrice: v.number(),
    }).index("by_businessId", ["businessId"]),

    // ─── Admin Activity Log ─────────────────────────────────────────────────
    adminActivityLog: defineTable({
      adminId: v.id("users"),
      action: v.string(),
      targetType: v.string(),
      targetId: v.optional(v.string()),
      details: v.optional(v.string()),
      timestamp: v.number(),
    }).index("by_adminId", ["adminId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;

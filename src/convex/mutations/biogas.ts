import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const register = mutation({
  args: {
    partnerName: v.string(),
    partnerType: v.union(v.literal("biogas"), v.literal("composting"), v.literal("recycling"), v.literal("animal_feed")),
    capacityKgPerWeek: v.number(),
    phone: v.string(),
    address: v.string(),
    city: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const existing = await ctx.db.query("biogasPartners").withIndex("by_userId", (q) => q.eq("userId", userId)).first();
    if (existing) throw new Error("Partner already registered");
    const id = await ctx.db.insert("biogasPartners", {
      userId,
      partnerName: args.partnerName,
      partnerType: args.partnerType,
      capacityKgPerWeek: args.capacityKgPerWeek,
      phone: args.phone,
      address: args.address,
      city: args.city,
      verificationStatus: "pending",
      totalCollectedKg: 0,
      createdAt: Date.now(),
    });
    return { id };
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("biogasPartners").collect();
  },
});

export const listPending = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("biogasPartners").withIndex("by_verification", (q) => q.eq("verificationStatus", "pending")).collect();
  },
});

export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.query("biogasPartners").withIndex("by_userId", (q) => q.eq("userId", args.userId)).first();
  },
});

export const verify = mutation({
  args: { partnerId: v.id("biogasPartners"), status: v.union(v.literal("verified"), v.literal("rejected")) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.partnerId, { verificationStatus: args.status });
    return { success: true };
  },
});

// Supply Agreements
export const createAgreement = mutation({
  args: {
    biogasPartnerId: v.id("biogasPartners"),
    title: v.string(),
    description: v.string(),
    capacityKgPerWeek: v.number(),
    acceptedCategories: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("supplyAgreements", {
      biogasPartnerId: args.biogasPartnerId,
      title: args.title,
      description: args.description,
      capacityKgPerWeek: args.capacityKgPerWeek,
      acceptedCategories: args.acceptedCategories,
      status: "active",
      createdAt: Date.now(),
    });
    return { id };
  },
});

export const listAgreements = query({
  args: { biogasPartnerId: v.id("biogasPartners") },
  handler: async (ctx, args) => {
    return await ctx.db.query("supplyAgreements").withIndex("by_partnerId", (q) => q.eq("biogasPartnerId", args.biogasPartnerId)).collect();
  },
});

// Food Waste Supplies
export const createSupply = mutation({
  args: {
    donationId: v.id("donations"),
    biogasPartnerId: v.id("biogasPartners"),
    quantityKg: v.number(),
    category: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("foodWasteSupplies", {
      donationId: args.donationId,
      biogasPartnerId: args.biogasPartnerId,
      supplyStatus: "available",
      quantityKg: args.quantityKg,
      category: args.category,
      notes: args.notes,
      createdAt: Date.now(),
    });
    return { id };
  },
});

export const listSupplies = query({
  args: { biogasPartnerId: v.id("biogasPartners") },
  handler: async (ctx, args) => {
    return await ctx.db.query("foodWasteSupplies").withIndex("by_partnerId", (q) => q.eq("biogasPartnerId", args.biogasPartnerId)).collect();
  },
});

export const listAvailableSupplies = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("foodWasteSupplies").collect();
  },
});

export const updateSupplyStatus = mutation({
  args: {
    supplyId: v.id("foodWasteSupplies"),
    status: v.union(v.literal("available"), v.literal("accepted"), v.literal("scheduled"), v.literal("collected"), v.literal("processed"), v.literal("cancelled")),
    scheduledDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = { supplyStatus: args.status };
    if (args.scheduledDate) updates.scheduledDate = args.scheduledDate;
    if (args.notes) updates.notes = args.notes;
    if (args.status === "collected") updates.collectedDate = new Date().toISOString();
    if (args.status === "processed") updates.processedDate = new Date().toISOString();
    await ctx.db.patch(args.supplyId, updates);
    return { success: true };
  },
});

export const getPartnerStats = query({
  args: { biogasPartnerId: v.id("biogasPartners") },
  handler: async (ctx, args) => {
    const supplies = await ctx.db.query("foodWasteSupplies").withIndex("by_partnerId", (q) => q.eq("biogasPartnerId", args.biogasPartnerId)).collect();
    const total = supplies.length;
    const processed = supplies.filter((s) => s.supplyStatus === "processed").length;
    const totalKg = supplies.reduce((acc, s) => acc + s.quantityKg, 0);
    const collected = supplies.filter((s) => s.supplyStatus === "collected").length;
    const scheduled = supplies.filter((s) => s.supplyStatus === "scheduled").length;
    return { total, processed, totalKg, collected, scheduled };
  },
});

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Create a donation
export const create = mutation({
  args: {
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
    donorType: v.union(v.literal("user"), v.literal("business")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const now = Date.now();
    const donationId = await ctx.db.insert("donations", {
      donorId: userId,
      donorType: args.donorType,
      foodName: args.foodName,
      foodCategory: args.foodCategory,
      quantity: args.quantity,
      quantityKg: args.quantityKg,
      servesPeople: args.servesPeople,
      condition: args.condition,
      preparationDate: args.preparationDate,
      expiryDate: args.expiryDate,
      pickupAddress: args.pickupAddress,
      pickupTimeWindow: args.pickupTimeWindow,
      contactPhone: args.contactPhone,
      imageUrl: args.imageUrl,
      instructions: args.instructions,
      safetyDeclaration: args.safetyDeclaration,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
    // Create tracking entry
    await ctx.db.insert("donationTracking", {
      donationId,
      status: "pending",
      updatedBy: userId,
      note: "Donation request created",
      timestamp: now,
    });
    return { donationId };
  },
});

// Update donation status
export const updateStatus = mutation({
  args: {
    donationId: v.id("donations"),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("on_the_way"), v.literal("picked_up"), v.literal("delivered"), v.literal("completed"), v.literal("cancelled")),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.patch(args.donationId, { status: args.status, updatedAt: Date.now() });
    await ctx.db.insert("donationTracking", {
      donationId: args.donationId,
      status: args.status,
      updatedBy: userId,
      note: args.note,
      timestamp: Date.now(),
    });
    return { success: true };
  },
});

// Assign employee to donation
export const assignEmployee = mutation({
  args: {
    donationId: v.id("donations"),
    employeeId: v.id("employees"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.donationId, {
      assignedEmployeeId: args.employeeId,
      status: "accepted",
      updatedAt: Date.now(),
    });
    const userId = await getAuthUserId(ctx);
    if (userId) {
      await ctx.db.insert("donationTracking", {
        donationId: args.donationId,
        status: "accepted",
        updatedBy: userId,
        note: "Employee assigned",
        timestamp: Date.now(),
      });
    }
    return { success: true };
  },
});

// Select a verified receiving organization after AI matching.
export const selectBusiness = mutation({
  args: {
    donationId: v.id("donations"),
    businessId: v.id("businesses"),
    matchScore: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const donation = await ctx.db.get(args.donationId);
    const business = await ctx.db.get(args.businessId);
    if (!donation || donation.donorId !== userId) throw new Error("Donation not found");
    if (!business || business.verificationStatus !== "verified") throw new Error("Receiving organization is not verified");
    const now = Date.now();
    await ctx.db.patch(args.donationId, {
      assignedBusinessId: args.businessId,
      status: "accepted",
      updatedAt: now,
    });
    await ctx.db.insert("donationTracking", {
      donationId: args.donationId,
      status: "accepted",
      updatedBy: userId,
      note: `AI match selected: ${business.businessName} (${args.matchScore}% match)`,
      timestamp: now,
    });
    return { success: true };
  },
});

// Cancel donation
export const cancel = mutation({
  args: { donationId: v.id("donations"), note: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.patch(args.donationId, { status: "cancelled", updatedAt: Date.now() });
    await ctx.db.insert("donationTracking", {
      donationId: args.donationId,
      status: "cancelled",
      updatedBy: userId,
      note: args.note ?? "Donation cancelled",
      timestamp: Date.now(),
    });
    return { success: true };
  },
});

// Get all donations
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("donations").collect();
  },
});

// Get donations by donor
export const listByDonor = query({
  args: { donorId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.query("donations").withIndex("by_donorId", (q) => q.eq("donorId", args.donorId)).collect();
  },
});

// Get donations by employee
export const listByEmployee = query({
  args: { employeeId: v.id("employees") },
  handler: async (ctx, args) => {
    return await ctx.db.query("donations").withIndex("by_employeeId", (q) => q.eq("assignedEmployeeId", args.employeeId)).collect();
  },
});

// Get available donations (pending, not assigned)
export const listAvailable = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("donations").withIndex("by_status", (q) => q.eq("status", "pending")).collect();
  },
});

// Get donation by id
export const getById = query({
  args: { donationId: v.id("donations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.donationId);
  },
});

// Get tracking for a donation
export const getTracking = query({
  args: { donationId: v.id("donations") },
  handler: async (ctx, args) => {
    return await ctx.db.query("donationTracking").withIndex("by_donationId", (q) => q.eq("donationId", args.donationId)).collect();
  },
});

// Get donation stats
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const donations = await ctx.db.query("donations").collect();
    const total = donations.length;
    const completed = donations.filter((d) => d.status === "completed").length;
    const pending = donations.filter((d) => d.status === "pending").length;
    const inProgress = donations.filter((d) => ["accepted", "on_the_way", "picked_up", "delivered"].includes(d.status)).length;
    const cancelled = donations.filter((d) => d.status === "cancelled").length;
    const totalKg = donations.reduce((acc, d) => acc + d.quantityKg, 0);
    const totalServed = donations.reduce((acc, d) => acc + d.servesPeople, 0);
    return { total, completed, pending, inProgress, cancelled, totalKg, totalServed };
  },
});

// Get recent donations
export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("donations").collect();
    return all.sort((a, b) => b.createdAt - a.createdAt).slice(0, args.limit ?? 10);
  },
});

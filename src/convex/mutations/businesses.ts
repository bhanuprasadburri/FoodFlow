import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const register = mutation({
  args: {
    businessName: v.string(),
    businessType: v.union(v.literal("restaurant"), v.literal("hotel"), v.literal("catering"), v.literal("bakery"), v.literal("other")),
    registrationNumber: v.optional(v.string()),
    phone: v.string(),
    address: v.string(),
    city: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const existing = await ctx.db.query("businesses").withIndex("by_userId", (q) => q.eq("userId", userId)).first();
    if (existing) throw new Error("Business already registered");
    const id = await ctx.db.insert("businesses", {
      userId,
      businessName: args.businessName,
      businessType: args.businessType,
      registrationNumber: args.registrationNumber,
      phone: args.phone,
      address: args.address,
      city: args.city,
      verificationStatus: "pending",
      subscriptionPlan: "free",
      totalDonations: 0,
      totalQuantityKg: 0,
      impactScore: 0,
      createdAt: Date.now(),
    });
    return { id };
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("businesses").collect();
  },
});

export const listPending = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("businesses").withIndex("by_verification", (q) => q.eq("verificationStatus", "pending")).collect();
  },
});

export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.query("businesses").withIndex("by_userId", (q) => q.eq("userId", args.userId)).first();
  },
});

export const verify = mutation({
  args: { businessId: v.id("businesses"), status: v.union(v.literal("verified"), v.literal("rejected")) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.businessId, { verificationStatus: args.status });
    return { success: true };
  },
});

export const updateSubscription = mutation({
  args: {
    businessId: v.id("businesses"),
    plan: v.union(v.literal("free"), v.literal("starter"), v.literal("professional"), v.literal("enterprise")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const expiry = now + 30 * 24 * 60 * 60 * 1000; // 30 days
    await ctx.db.patch(args.businessId, {
      subscriptionPlan: args.plan,
      subscriptionExpiry: expiry,
    });
    // Create subscription record
    const prices: Record<string, number> = { free: 0, starter: 29, professional: 79, enterprise: 199 };
    await ctx.db.insert("subscriptions", {
      businessId: args.businessId,
      plan: args.plan,
      status: "active",
      startDate: now,
      expiryDate: expiry,
      monthlyPrice: prices[args.plan] ?? 0,
    });
    return { success: true };
  },
});

export const getStats = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const biz = await ctx.db.get(args.businessId);
    if (!biz) return null;
    const donations = await ctx.db.query("donations").withIndex("by_donorId", (q) => q.eq("donorId", biz.userId)).collect();
    const total = donations.length;
    const completed = donations.filter((d) => d.status === "completed").length;
    const totalKg = donations.reduce((acc, d) => acc + d.quantityKg, 0);
    const totalServed = donations.reduce((acc, d) => acc + d.servesPeople, 0);
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      businessName: biz.businessName,
      totalDonations: total,
      completedDonations: completed,
      totalQuantityKg: totalKg,
      totalPeopleServed: totalServed,
      successRate,
      impactScore: biz.impactScore,
      subscriptionPlan: biz.subscriptionPlan,
    };
  },
});

export const updateImpactScore = mutation({
  args: { businessId: v.id("businesses"), score: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.businessId, { impactScore: args.score });
    return { success: true };
  },
});

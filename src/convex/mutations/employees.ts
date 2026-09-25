import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    userId: v.id("users"),
    employeeId: v.string(),
    phone: v.optional(v.string()),
    vehicleType: v.optional(v.string()),
    zone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("employees").withIndex("by_userId", (q) => q.eq("userId", args.userId)).first();
    if (existing) throw new Error("Employee already exists");
    const id = await ctx.db.insert("employees", {
      userId: args.userId,
      employeeId: args.employeeId,
      phone: args.phone,
      vehicleType: args.vehicleType,
      zone: args.zone,
      status: "active",
      totalDeliveries: 0,
      rating: 5.0,
      joinedAt: Date.now(),
    });
    return { id };
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("employees").collect();
  },
});

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("employees").withIndex("by_status", (q) => q.eq("status", "active")).collect();
  },
});

export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.query("employees").withIndex("by_userId", (q) => q.eq("userId", args.userId)).first();
  },
});

export const getById = query({
  args: { employeeId: v.id("employees") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.employeeId);
  },
});

export const updateStatus = mutation({
  args: {
    employeeId: v.id("employees"),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("on_leave")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.employeeId, { status: args.status });
    return { success: true };
  },
});

export const incrementDeliveries = mutation({
  args: { employeeId: v.id("employees") },
  handler: async (ctx, args) => {
    const emp = await ctx.db.get(args.employeeId);
    if (emp) {
      await ctx.db.patch(args.employeeId, { totalDeliveries: emp.totalDeliveries + 1 });
    }
    return { success: true };
  },
});

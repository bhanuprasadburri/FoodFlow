import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const completeRegistration = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    address: v.string(),
    role: v.union(v.literal("user"), v.literal("employee"), v.literal("business"), v.literal("biogas")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const currentUser = await ctx.db.get(userId);
    if (currentUser?.role) throw new Error("Registration is already complete");
    await ctx.db.patch(userId, {
      name: args.name,
      phone: args.phone,
      address: args.address,
      role: args.role,
      verificationStatus: "pending",
    });
    if (args.role === "employee") {
      await ctx.db.insert("employees", {
        userId,
        employeeId: `EMP-${String(Date.now()).slice(-6)}`,
        phone: args.phone,
        status: "active",
        totalDeliveries: 0,
        rating: 5,
        joinedAt: Date.now(),
      });
    }
    if (args.role === "biogas") {
      await ctx.db.insert("biogasPartners", {
        userId,
        partnerName: args.name,
        partnerType: "biogas",
        capacityKgPerWeek: 1000,
        phone: args.phone,
        address: args.address,
        verificationStatus: "pending",
        totalCollectedKg: 0,
        createdAt: Date.now(),
      });
    }
    return { success: true };
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const updates: Record<string, unknown> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.phone !== undefined) updates.phone = args.phone;
    if (args.address !== undefined) updates.address = args.address;
    if (args.image !== undefined) updates.image = args.image;
    await ctx.db.patch(userId, updates);
    return { success: true };
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getUsersByRole = query({
  args: { role: v.union(v.literal("admin"), v.literal("user"), v.literal("employee"), v.literal("business"), v.literal("biogas")) },
  handler: async (ctx, { role }) => {
    const allUsers = await ctx.db.query("users").collect();
    return allUsers.filter((u) => u.role === role);
  },
});

export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

export const setVerificationStatus = mutation({
  args: {
    userId: v.id("users"),
    status: v.union(v.literal("verified"), v.literal("rejected")),
  },
  handler: async (ctx, args) => {
    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new Error("Not authenticated");
    const admin = await ctx.db.get(adminId);
    if (admin?.role !== "admin") throw new Error("Only admins can verify users");
    await ctx.db.patch(args.userId, {
      verificationStatus: args.status,
      verifiedAt: args.status === "verified" ? Date.now() : undefined,
    });
    return { success: true };
  },
});

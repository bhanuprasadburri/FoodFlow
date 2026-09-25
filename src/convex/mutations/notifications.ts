import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const create = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.union(v.literal("info"), v.literal("success"), v.literal("warning"), v.literal("alert")),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("notifications", {
      userId: args.userId,
      title: args.title,
      message: args.message,
      type: args.type,
      read: false,
      link: args.link,
      createdAt: Date.now(),
    });
    return { id };
  },
});

export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.query("notifications").withIndex("by_userId", (q) => q.eq("userId", args.userId)).collect();
  },
});

export const listUnread = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.query("notifications").withIndex("by_userId_read", (q) => q.eq("userId", args.userId).eq("read", false)).collect();
  },
});

export const markRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, { read: true });
    return { success: true };
  },
});

export const markAllRead = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const unread = await ctx.db.query("notifications").withIndex("by_userId_read", (q) => q.eq("userId", args.userId).eq("read", false)).collect();
    for (const n of unread) {
      await ctx.db.patch(n._id, { read: true });
    }
    return { success: true };
  },
});

export const getUnreadCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const unread = await ctx.db.query("notifications").withIndex("by_userId_read", (q) => q.eq("userId", args.userId).eq("read", false)).collect();
    return unread.length;
  },
});

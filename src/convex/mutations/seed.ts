import { mutation, query } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// Seed sample data for the prototype
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existing = await ctx.db.query("donations").first();
    if (existing) return { message: "Data already seeded" };

    const now = Date.now();
    const day = 86400000;

    // Create sample users
    const user1 = await ctx.db.insert("users", { name: "Sarah Johnson", email: "sarah@example.com", role: "user", createdAt: now - 30 * day });
    const user2 = await ctx.db.insert("users", { name: "Michael Chen", email: "michael@example.com", role: "user", createdAt: now - 25 * day });
    const user3 = await ctx.db.insert("users", { name: "Emma Rodriguez", email: "emma@example.com", role: "user", createdAt: now - 20 * day });
    const emp1 = await ctx.db.insert("users", { name: "David Kim", email: "david@example.com", role: "employee", createdAt: now - 45 * day });
    const emp2 = await ctx.db.insert("users", { name: "Lisa Thompson", email: "lisa@example.com", role: "employee", createdAt: now - 40 * day });
    const emp3 = await ctx.db.insert("users", { name: "James Wilson", email: "james@example.com", role: "employee", createdAt: now - 35 * day });
    const biz1 = await ctx.db.insert("users", { name: "Grand Hotel Kitchen", email: "kitchen@grandhotel.com", role: "business", createdAt: now - 60 * day });
    const biz2 = await ctx.db.insert("users", { name: "Pizza Paradise", email: "info@pizzaparadise.com", role: "business", createdAt: now - 55 * day });
    const biz3 = await ctx.db.insert("users", { name: "Green Leaf Restaurant", email: "greenleaf@restaurant.com", role: "business", createdAt: now - 50 * day });
    const admin = await ctx.db.insert("users", { name: "Admin User", email: "admin@foodflow.com", role: "admin", createdAt: now - 90 * day });
    const bio1 = await ctx.db.insert("users", { name: "EcoBio Solutions", email: "partner@ecobio.com", role: "biogas", createdAt: now - 40 * day });

    // Create employees
    const empRec1 = await ctx.db.insert("employees", { userId: emp1, employeeId: "EMP-001", phone: "+1-555-0101", vehicleType: "Van", zone: "North", status: "active", totalDeliveries: 47, rating: 4.8, joinedAt: now - 45 * day });
    const empRec2 = await ctx.db.insert("employees", { userId: emp2, employeeId: "EMP-002", phone: "+1-555-0102", vehicleType: "Car", zone: "South", status: "active", totalDeliveries: 35, rating: 4.9, joinedAt: now - 40 * day });
    const empRec3 = await ctx.db.insert("employees", { userId: emp3, employeeId: "EMP-003", phone: "+1-555-0103", vehicleType: "Bicycle", zone: "Central", status: "active", totalDeliveries: 28, rating: 4.7, joinedAt: now - 35 * day });

    // Create businesses
    const bizRec1 = await ctx.db.insert("businesses", { userId: biz1, businessName: "Grand Hotel", businessType: "hotel", phone: "+1-555-0201", address: "123 Main St", city: "Downtown", verificationStatus: "verified", subscriptionPlan: "professional", totalDonations: 85, totalQuantityKg: 1250, impactScore: 92, createdAt: now - 60 * day });
    const bizRec2 = await ctx.db.insert("businesses", { userId: biz2, businessName: "Pizza Paradise", businessType: "restaurant", phone: "+1-555-0202", address: "456 Oak Ave", city: "Midtown", verificationStatus: "verified", subscriptionPlan: "starter", totalDonations: 52, totalQuantityKg: 680, impactScore: 78, createdAt: now - 55 * day });
    const bizRec3 = await ctx.db.insert("businesses", { userId: biz3, businessName: "Green Leaf Restaurant", businessType: "restaurant", phone: "+1-555-0203", address: "789 Elm Blvd", city: "Eastside", verificationStatus: "verified", subscriptionPlan: "enterprise", totalDonations: 120, totalQuantityKg: 2100, impactScore: 96, createdAt: now - 50 * day });

    // Create biogas partner
    const bioRec1 = await ctx.db.insert("biogasPartners", { userId: bio1, partnerName: "EcoBio Solutions", partnerType: "biogas", capacityKgPerWeek: 500, phone: "+1-555-0301", address: "321 Industrial Way", city: "Westside", verificationStatus: "verified", totalCollectedKg: 3200, createdAt: now - 40 * day });

    // Create donations
    const donationsData = [
      { donorId: user1, donorType: "user" as const, foodName: "Homemade Pasta & Sauce", foodCategory: "cooked" as const, quantity: "3 containers", quantityKg: 4.5, servesPeople: 8, condition: "fresh" as const, pickupAddress: "15 Maple Dr, Apt 4B", contactPhone: "+1-555-1001", status: "completed" as const, assignedEmployeeId: empRec1 },
      { donorId: user2, donorType: "user" as const, foodName: "Fresh Bread & Pastries", foodCategory: "bakery" as const, quantity: "2 bags", quantityKg: 3.0, servesPeople: 10, condition: "fresh" as const, pickupAddress: "28 Pine Rd", contactPhone: "+1-555-1002", status: "completed" as const, assignedEmployeeId: empRec2 },
      { donorId: user3, donorType: "user" as const, foodName: "Mixed Vegetables & Fruits", foodCategory: "produce" as const, quantity: "5 kg box", quantityKg: 5.0, servesPeople: 12, condition: "good" as const, pickupAddress: "42 Cedar Ln", contactPhone: "+1-555-1003", status: "delivered" as const, assignedEmployeeId: empRec1 },
      { donorId: biz1, donorType: "business" as const, foodName: "Banquet Leftovers - Grilled Chicken", foodCategory: "cooked" as const, quantity: "10 trays", quantityKg: 15.0, servesPeople: 30, condition: "good" as const, pickupAddress: "123 Main St, Loading Dock B", contactPhone: "+1-555-0201", status: "completed" as const, assignedEmployeeId: empRec3 },
      { donorId: biz2, donorType: "business" as const, foodName: "End-of-Day Pizza Collection", foodCategory: "cooked" as const, quantity: "8 boxes", quantityKg: 12.0, servesPeople: 24, condition: "fresh" as const, pickupAddress: "456 Oak Ave, Back Entrance", contactPhone: "+1-555-0202", status: "accepted" as const, assignedEmployeeId: empRec2 },
      { donorId: biz3, donorType: "business" as const, foodName: "Salad Bar Surplus", foodCategory: "produce" as const, quantity: "6 bowls", quantityKg: 8.0, servesPeople: 18, condition: "fresh" as const, pickupAddress: "789 Elm Blvd", contactPhone: "+1-555-0203", status: "pending" as const, assignedEmployeeId: undefined },
      { donorId: user1, donorType: "user" as const, foodName: "Birthday Cake Remainder", foodCategory: "bakery" as const, quantity: "1 whole cake", quantityKg: 2.5, servesPeople: 15, condition: "fresh" as const, pickupAddress: "15 Maple Dr, Apt 4B", contactPhone: "+1-555-1001", status: "picked_up" as const, assignedEmployeeId: empRec1 },
      { donorId: user2, donorType: "user" as const, foodName: "Expired Dairy Products", foodCategory: "dairy" as const, quantity: "4 cartons", quantityKg: 6.0, servesPeople: 0, condition: "not_for_human" as const, pickupAddress: "28 Pine Rd", contactPhone: "+1-555-1002", status: "pending" as const, assignedEmployeeId: undefined },
      { donorId: biz1, donorType: "business" as const, foodName: "Breakfast Buffet Surplus", foodCategory: "cooked" as const, quantity: "12 portions", quantityKg: 10.0, servesPeople: 20, condition: "good" as const, pickupAddress: "123 Main St", contactPhone: "+1-555-0201", status: "on_the_way" as const, assignedEmployeeId: empRec3 },
      { donorId: user3, donorType: "user" as const, foodName: "Canned Goods Collection", foodCategory: "packaged" as const, quantity: "15 cans", quantityKg: 7.5, servesPeople: 20, condition: "fresh" as const, pickupAddress: "42 Cedar Ln", contactPhone: "+1-555-1003", status: "completed" as const, assignedEmployeeId: empRec2 },
      { donorId: biz3, donorType: "business" as const, foodName: "Spoilage - Mixed Produce", foodCategory: "other" as const, quantity: "20 kg", quantityKg: 20.0, servesPeople: 0, condition: "not_for_human" as const, pickupAddress: "789 Elm Blvd", contactPhone: "+1-555-0203", status: "pending" as const, assignedEmployeeId: undefined },
      { donorId: biz2, donorType: "business" as const, foodName: "Pasta & Italian Dishes", foodCategory: "cooked" as const, quantity: "5 containers", quantityKg: 7.5, servesPeople: 15, condition: "fresh" as const, pickupAddress: "456 Oak Ave", contactPhone: "+1-555-0202", status: "completed" as const, assignedEmployeeId: empRec1 },
    ];

    const donationIds: Array<Id<"donations">> = [];
    for (const d of donationsData) {
      const id = await ctx.db.insert("donations", {
        ...d,
        preparationDate: new Date(now - day).toISOString(),
        expiryDate: new Date(now + day).toISOString(),
        safetyDeclaration: true,
        createdAt: now - Math.floor(Math.random() * 14 * day),
        updatedAt: now - Math.floor(Math.random() * 7 * day),
      });
      donationIds.push(id);
    }

    // Create tracking entries for completed donations
    for (let i = 0; i < donationIds.length; i++) {
      const d = donationsData[i];
      if (d.status === "completed" || d.status === "delivered" || d.status === "picked_up" || d.status === "on_the_way" || d.status === "accepted") {
        await ctx.db.insert("donationTracking", { donationId: donationIds[i] as Id<"donations">, status: "pending", updatedBy: user1, note: "Donation created", timestamp: now - 10 * day });
        if (["accepted", "on_the_way", "picked_up", "delivered", "completed"].includes(d.status)) {
          await ctx.db.insert("donationTracking", { donationId: donationIds[i] as Id<"donations">, status: "accepted", updatedBy: emp1, note: "Employee accepted", timestamp: now - 8 * day });
        }
        if (["on_the_way", "picked_up", "delivered", "completed"].includes(d.status)) {
          await ctx.db.insert("donationTracking", { donationId: donationIds[i] as Id<"donations">, status: "on_the_way", updatedBy: emp1, note: "En route to pickup", timestamp: now - 6 * day });
        }
        if (["picked_up", "delivered", "completed"].includes(d.status)) {
          await ctx.db.insert("donationTracking", { donationId: donationIds[i] as Id<"donations">, status: "picked_up", updatedBy: emp1, note: "Food collected", timestamp: now - 4 * day });
        }
        if (["delivered", "completed"].includes(d.status)) {
          await ctx.db.insert("donationTracking", { donationId: donationIds[i] as Id<"donations">, status: "delivered", updatedBy: emp1, note: "Delivered to shelter", timestamp: now - 2 * day });
        }
        if (d.status === "completed") {
          await ctx.db.insert("donationTracking", { donationId: donationIds[i] as Id<"donations">, status: "completed", updatedBy: user1, note: "Donation confirmed complete", timestamp: now - 1 * day });
        }
      }
    }

    // Create notifications
    const notifData = [
      { userId: user1, title: "Donation Completed", message: "Your pasta donation was successfully delivered to Hope Shelter!", type: "success" as const },
      { userId: user2, title: "Employee Assigned", message: "Lisa has accepted your bread donation pickup request.", type: "info" as const },
      { userId: biz1, title: "Impact Score Updated", message: "Your business impact score increased to 92! Keep up the great work.", type: "success" as const },
      { userId: emp1, title: "New Assignment", message: "You have a new pickup request at 42 Cedar Ln.", type: "alert" as const },
      { userId: user3, title: "Donation In Progress", message: "Your vegetable donation is on its way to the community kitchen.", type: "info" as const },
      { userId: admin, title: "New Business Registration", message: "Green Bistro has applied for business verification.", type: "warning" as const },
    ];
    for (const n of notifData) {
      await ctx.db.insert("notifications", { ...n, read: false, createdAt: now - Math.floor(Math.random() * 5 * day) });
    }

    // Create supply agreements
    await ctx.db.insert("supplyAgreements", { biogasPartnerId: bioRec1, title: "Weekly Food Waste Supply", description: "We can accept 500 kg of suitable food waste per week. Please supply the agreed quantity.", capacityKgPerWeek: 500, acceptedCategories: ["cooked", "raw", "produce", "bakery", "dairy"], status: "active", createdAt: now - 20 * day });

    // Create food waste supplies
    await ctx.db.insert("foodWasteSupplies", { donationId: donationIds[7] as Id<"donations">, biogasPartnerId: bioRec1, supplyStatus: "processed", quantityKg: 6.0, category: "dairy", collectedDate: new Date(now - 3 * day).toISOString(), processedDate: new Date(now - 1 * day).toISOString(), createdAt: now - 5 * day });
    await ctx.db.insert("foodWasteSupplies", { donationId: donationIds[10] as Id<"donations">, biogasPartnerId: bioRec1, supplyStatus: "scheduled", quantityKg: 20.0, category: "produce", scheduledDate: new Date(now + day).toISOString(), createdAt: now - 2 * day });

    // Create subscriptions
    await ctx.db.insert("subscriptions", { businessId: bizRec1, plan: "professional", status: "active", startDate: now - 30 * day, expiryDate: now + 30 * day, monthlyPrice: 79 });
    await ctx.db.insert("subscriptions", { businessId: bizRec2, plan: "starter", status: "active", startDate: now - 20 * day, expiryDate: now + 40 * day, monthlyPrice: 29 });
    await ctx.db.insert("subscriptions", { businessId: bizRec3, plan: "enterprise", status: "active", startDate: now - 15 * day, expiryDate: now + 45 * day, monthlyPrice: 199 });

    // Create admin activity log
    await ctx.db.insert("adminActivityLog", { adminId: admin, action: "verified", targetType: "business", targetId: bizRec1, details: "Verified Grand Hotel registration", timestamp: now - 55 * day });
    await ctx.db.insert("adminActivityLog", { adminId: admin, action: "verified", targetType: "business", targetId: bizRec2, details: "Verified Pizza Paradise registration", timestamp: now - 50 * day });
    await ctx.db.insert("adminActivityLog", { adminId: admin, action: "assigned", targetType: "donation", targetId: donationIds[3], details: "Assigned James Wilson to banquet donation", timestamp: now - 10 * day });
    await ctx.db.insert("adminActivityLog", { adminId: admin, action: "approved", targetType: "biogas_partner", targetId: bioRec1, details: "Approved EcoBio Solutions as biogas partner", timestamp: now - 38 * day });

    return { message: "Sample data seeded successfully" };
  },
});

// Check if data exists
export const hasData = query({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("donations").first();
    return existing !== null;
  },
});

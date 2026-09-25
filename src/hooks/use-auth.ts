import { useState, useEffect, useCallback } from "react";

export type UserRole = "user" | "employee" | "business" | "admin" | "biogas";

export interface AppUser {
  _id: any;
  _creationTime: number;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  address: string;
  verificationStatus: string;
  [key: string]: any;
}

export const DEFAULT_DEMO_USERS: Record<UserRole, AppUser> = {
  user: {
    _id: "demo-donor-001",
    _creationTime: Date.now() - 3600000 * 200,
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "user",
    phone: "+91 98765 01000",
    address: "15 Maple Street, Downtown Sector 4",
    verificationStatus: "verified",
  },
  employee: {
    _id: "demo-employee-002",
    _creationTime: Date.now() - 3600000 * 300,
    name: "Alex Morgan",
    email: "alex.morgan@foodflow.com",
    role: "employee",
    phone: "+91 98765 01001",
    address: "Logistics Hub 4, Metro Area",
    verificationStatus: "verified",
  },
  business: {
    _id: "demo-business-003",
    _creationTime: Date.now() - 3600000 * 400,
    name: "Green Leaf Bakery & Deli",
    email: "contact@greenleaf.com",
    role: "business",
    phone: "+91 98222 33445",
    address: "42 Cedar Lane, Midtown Market",
    verificationStatus: "verified",
  },
  admin: {
    _id: "demo-admin-004",
    _creationTime: Date.now() - 3600000 * 500,
    name: "Super Administrator",
    email: "admin@foodflow.com",
    role: "admin",
    phone: "+91 98765 01004",
    address: "FoodFlow Headquarters, Tower A",
    verificationStatus: "verified",
  },
  biogas: {
    _id: "demo-biogas-005",
    _creationTime: Date.now() - 3600000 * 600,
    name: "Green Energy Biogas Plant",
    email: "operations@greenenergybiogas.com",
    role: "biogas",
    phone: "+91 98666 77889",
    address: "Sector 9 Bio Clean Tech Park, Westside",
    verificationStatus: "verified",
  },
};

function getRegisteredUsers(): Record<string, AppUser> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem("foodflow_registered_users");
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  // Initialize with the standard demo users so email lookup works right away
  const initial: Record<string, AppUser> = {};
  Object.values(DEFAULT_DEMO_USERS).forEach((u) => {
    initial[u.email.toLowerCase()] = u;
  });
  try {
    window.localStorage.setItem("foodflow_registered_users", JSON.stringify(initial));
  } catch {
    // ignore
  }
  return initial;
}

function saveRegisteredUser(user: AppUser) {
  if (typeof window === "undefined") return;
  try {
    const all = getRegisteredUsers();
    all[user.email.toLowerCase()] = user;
    window.localStorage.setItem("foodflow_registered_users", JSON.stringify(all));
  } catch {
    // ignore
  }
}

function getSavedUser(): AppUser | null {
  if (typeof window === "undefined") return DEFAULT_DEMO_USERS.user;
  const isSignedOut = window.localStorage.getItem("foodflow_signed_out") === "true";
  if (isSignedOut) return null;
  const raw = window.localStorage.getItem("foodflow_demo_user");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.role) return parsed;
    } catch {
      // ignore
    }
  }
  return DEFAULT_DEMO_USERS.user;
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(getSavedUser);

  useEffect(() => {
    const handleSync = () => {
      setCurrentUser(getSavedUser());
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("foodflow-auth-change", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("foodflow-auth-change", handleSync);
    };
  }, []);

  const setDemoRole = useCallback(
    (role: UserRole, customDetails?: Partial<AppUser>) => {
      const template = DEFAULT_DEMO_USERS[role] || DEFAULT_DEMO_USERS.user;
      const updated: AppUser = {
        ...template,
        ...customDetails,
        role,
      };
      window.localStorage.removeItem("foodflow_signed_out");
      window.localStorage.setItem("foodflow_demo_auth", "true");
      window.localStorage.setItem("foodflow_demo_user", JSON.stringify(updated));
      saveRegisteredUser(updated);
      setCurrentUser(updated);
      window.dispatchEvent(new Event("foodflow-auth-change"));
      return updated;
    },
    [],
  );

  const switchRole = useCallback((role: UserRole) => {
    return setDemoRole(role);
  }, [setDemoRole]);

  const signOut = useCallback(async () => {
    sessionStorage.removeItem("foodhub_registration");
    // DO NOT clear donations or partner data! We want data to remain intact for presentation
    window.localStorage.setItem("foodflow_signed_out", "true");
    window.localStorage.setItem("foodflow_demo_auth", "false");
    setCurrentUser(null);
    window.dispatchEvent(new Event("foodflow-auth-change"));
  }, []);

  const signIn = useCallback(async (provider: string, data?: unknown): Promise<AppUser> => {
    window.localStorage.removeItem("foodflow_signed_out");
    window.localStorage.setItem("foodflow_demo_auth", "true");

    let role: UserRole = "user";
    let name = "";
    let email = "";
    let phone = "";
    let address = "";
    let isExplicitRole = false;

    if (data instanceof FormData) {
      const emailField = String(data.get("email") || "").trim();
      if (emailField) email = emailField;
      const nameField = String(data.get("name") || "").trim();
      if (nameField) name = nameField;
      const phoneField = String(data.get("phone") || "").trim();
      if (phoneField) phone = phoneField;
      const addressField = String(data.get("address") || "").trim();
      if (addressField) address = addressField;
      const roleField = String(data.get("role") || "").trim();
      if (roleField && ["user", "employee", "business", "admin", "biogas"].includes(roleField)) {
        role = roleField as UserRole;
        isExplicitRole = true;
      }
    } else if (typeof data === "object" && data !== null) {
      const d = data as Record<string, any>;
      if (d.role && ["user", "employee", "business", "admin", "biogas"].includes(d.role)) {
        role = d.role as UserRole;
        isExplicitRole = true;
      }
      if (d.name) name = String(d.name);
      if (d.email) email = String(d.email);
      if (d.phone) phone = String(d.phone);
      if (d.address) address = String(d.address);
    }

    // Check existing registered users by email
    const registry = getRegisteredUsers();
    const existing = email ? registry[email.toLowerCase()] : null;

    if (existing) {
      // Use existing user profile
      const userToSave: AppUser = {
        ...existing,
        // If they explicitly chose a new role during registration/login, honor it
        role: isExplicitRole ? role : existing.role,
        name: name || existing.name,
        phone: phone || existing.phone,
        address: address || existing.address,
      };
      window.localStorage.setItem("foodflow_demo_user", JSON.stringify(userToSave));
      saveRegisteredUser(userToSave);
      setCurrentUser(userToSave);
      window.dispatchEvent(new Event("foodflow-auth-change"));
      return userToSave;
    }

    // If new email and no explicit role from dropdown, infer from email keywords
    if (!isExplicitRole && email) {
      const lower = email.toLowerCase();
      if (lower.includes("admin")) {
        role = "admin";
      } else if (lower.includes("employee") || lower.includes("agent") || lower.includes("driver")) {
        role = "employee";
      } else if (lower.includes("business") || lower.includes("hotel") || lower.includes("bakery") || lower.includes("market") || lower.includes("restaurant")) {
        role = "business";
      } else if (lower.includes("biogas") || lower.includes("waste") || lower.includes("recycl")) {
        role = "biogas";
      }
    }

    const template = DEFAULT_DEMO_USERS[role] || DEFAULT_DEMO_USERS.user;
    const finalName = name || (email ? email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : template.name);

    const userToSave: AppUser = {
      _id: `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      _creationTime: Date.now(),
      name: finalName,
      email: email || template.email,
      phone: phone || template.phone,
      address: address || template.address,
      verificationStatus: "verified",
      role,
    };

    window.localStorage.setItem("foodflow_demo_user", JSON.stringify(userToSave));
    saveRegisteredUser(userToSave);
    setCurrentUser(userToSave);
    window.dispatchEvent(new Event("foodflow-auth-change"));
    return userToSave;
  }, []);

  return {
    isLoading: false,
    isAuthenticated: currentUser !== null,
    user: currentUser,
    signIn,
    signOut,
    setDemoRole,
    switchRole,
  };
}

export type AppRole = "user" | "employee" | "business" | "admin" | "biogas";

export function dashboardForRole(role?: string | null, fallback = "/dashboard") {
  switch (role) {
    case "user": return "/donor/dashboard";
    case "biogas": return "/partner/dashboard";
    case "admin": return "/admin/dashboard";
    case "employee": return "/employee/dashboard";
    case "business": return "/business/dashboard";
    default: return fallback;
  }
}

export function isRole(value: string): value is AppRole {
  return ["user", "employee", "business", "admin", "biogas"].includes(value);
}

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  className?: string;
  color?: "emerald" | "orange" | "blue" | "purple" | "amber";
}

const iconBgMap = {
  emerald: "bg-[#E8F5E9] text-[#00615F]",
  orange: "bg-[#FFF3E0] text-[#E65100]",
  blue: "bg-[#E3F2FD] text-[#1565C0]",
  purple: "bg-[#F3E5F5] text-[#6A1B9A]",
  amber: "bg-[#FFF8E1] text-[#F57F17]",
};

export function StatCard({ title, value, subtitle, icon: Icon, trend, className, color = "emerald" }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl border border-gray-100 bg-white p-5 hover:shadow-lg hover:shadow-[#00615F]/5 transition-all duration-300",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1.5 text-2xl font-extrabold text-gray-900 tracking-tight">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span className={cn("text-xs font-bold", trend.positive ? "text-[#00615F]" : "text-red-500")}>
                {trend.positive ? "↑" : "↓"} {trend.value}
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", iconBgMap[color])}>
          <Icon className="h-5.5 w-5.5" />
        </div>
      </div>
    </motion.div>
  );
}

type BadgeVariant = "pending" | "accepted" | "on_the_way" | "picked_up" | "delivered" | "completed" | "cancelled" | "active" | "verified" | "rejected" | "info" | "success" | "warning" | "alert";

const badgeStyles: Record<BadgeVariant, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-[#E3F2FD] text-[#1565C0] border-[#BBDEFB]",
  on_the_way: "bg-[#E8F5E9] text-[#00615F] border-[#C8E6C9]",
  picked_up: "bg-[#E8F5E9] text-[#00615F] border-[#C8E6C9]",
  delivered: "bg-[#E8F5E9] text-[#00615F] border-[#C8E6C9]",
  completed: "bg-[#E8F5E9] text-[#00615F] border-[#C8E6C9]",
  cancelled: "bg-red-50 text-red-600 border-red-200",
  active: "bg-[#E8F5E9] text-[#00615F] border-[#C8E6C9]",
  verified: "bg-[#E8F5E9] text-[#00615F] border-[#C8E6C9]",
  rejected: "bg-red-50 text-red-600 border-red-200",
  info: "bg-[#E3F2FD] text-[#1565C0] border-[#BBDEFB]",
  success: "bg-[#E8F5E9] text-[#00615F] border-[#C8E6C9]",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  alert: "bg-[#FFF3E0] text-[#E65100] border-[#FFE0B2]",
};

export function StatusBadge({ status }: { status: string }) {
  const label = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
      badgeStyles[status as BadgeVariant] || "bg-gray-50 text-gray-600 border-gray-200"
    )}>
      {label}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5F0EB] text-gray-400 mb-4">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-gray-500">{description}</p>
    </div>
  );
}

/* ─── Food images for dashboards ──────────────────────────── */
export const foodImages = {
  bread: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=250&fit=crop",
  vegetables: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=250&fit=crop",
  restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop",
  delivery: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400&h=250&fit=crop",
  community: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=250&fit=crop",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop",
  grocery: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=250&fit=crop",
  cooking: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=250&fit=crop",
  biogas: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=250&fit=crop",
  farm: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=250&fit=crop",
  rescue: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=250&fit=crop",
  compost: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=250&fit=crop",
  organic: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&h=250&fit=crop",
  cooked: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=250&fit=crop",
  raw: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=250&fit=crop",
  packaged: "https://images.unsplash.com/photo-1584473457493-17c4c24290c8?w=400&h=250&fit=crop",
  dairy: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=250&fit=crop",
  other: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=400&h=250&fit=crop",
};

export function getFoodImage(category: string) {
  return foodImages[category as keyof typeof foodImages] || foodImages.other;
}

import { useAuth, UserRole } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { dashboardForRole } from "@/lib/role-routing";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Truck,
  Building2,
  Leaf,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface RoleOption {
  role: UserRole;
  label: string;
  badge: string;
  icon: typeof User;
  color: string;
}

const ROLES: RoleOption[] = [
  {
    role: "user",
    label: "Individual Donor",
    badge: "Donor",
    icon: User,
    color: "text-emerald-700 bg-emerald-50",
  },
  {
    role: "employee",
    label: "Collection Agent",
    badge: "Worker",
    icon: Truck,
    color: "text-blue-700 bg-blue-50",
  },
  {
    role: "business",
    label: "Business Partner",
    badge: "Business",
    icon: Building2,
    color: "text-amber-700 bg-amber-50",
  },
  {
    role: "biogas",
    label: "Biogas Partner",
    badge: "Waste-to-Energy",
    icon: Leaf,
    color: "text-green-700 bg-green-50",
  },
  {
    role: "admin",
    label: "Super Admin",
    badge: "Operations",
    icon: ShieldCheck,
    color: "text-purple-700 bg-purple-50",
  },
];

export function DemoRoleSwitcher() {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const currentRole = (user?.role as UserRole) || "user";
  const activeOption = ROLES.find((r) => r.role === currentRole) || ROLES[0];

  const handleSelectRole = (role: UserRole) => {
    const updatedUser = switchRole(role);
    toast.success(`Switched workspace to ${updatedUser.name} (${role.toUpperCase()})`);
    navigate(dashboardForRole(role));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200/90 bg-white px-3 py-1.5 text-xs font-bold text-gray-800 shadow-sm transition hover:border-[#00615F] hover:bg-gray-50 focus:outline-none"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#00615F]" />
          <span className="hidden sm:inline text-gray-500 font-normal">Role:</span>
          <span className="font-extrabold text-[#00615F]">{activeOption.badge}</span>
          <ChevronDown className="h-3 w-3 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-1.5">
        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 py-1">
          Switch Demo Workspace
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ROLES.map((r) => {
          const isCurrent = r.role === currentRole;
          const Icon = r.icon;
          return (
            <DropdownMenuItem
              key={r.role}
              onClick={() => handleSelectRole(r.role)}
              className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer ${
                isCurrent ? "bg-[#EAF7F1] text-[#00615F] font-bold" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`flex h-6 w-6 items-center justify-center rounded-md ${r.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span>{r.label}</span>
              </div>
              {isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-[#00615F]" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth, UserRole } from "@/hooks/use-auth";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  UserPlus,
  ShieldCheck,
  User,
  Truck,
  Building2,
  Leaf,
  CheckCircle2,
  Info,
  KeyRound,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { dashboardForRole } from "@/lib/role-routing";
import { toast } from "sonner";

interface AuthProps {
  redirectAfterAuth?: string;
}

const ROLE_DETAILS: {
  role: UserRole;
  label: string;
  defaultEmail: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  badgeColor: string;
}[] = [
  {
    role: "user",
    label: "Individual Donor",
    defaultEmail: "alex@example.com",
    icon: User,
    tagline: "Donate excess home meals & produce",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  {
    role: "employee",
    label: "Collection Agent",
    defaultEmail: "alex.morgan@foodflow.com",
    icon: Truck,
    tagline: "Accept food rescue pickups & deliver to NGOs",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    role: "business",
    label: "Business Partner",
    defaultEmail: "contact@greenleaf.com",
    icon: Building2,
    tagline: "Restaurants & supermarkets surplus management",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    role: "biogas",
    label: "Biogas Partner",
    defaultEmail: "operations@greenenergybiogas.com",
    icon: Leaf,
    tagline: "Convert non-edible organic waste to clean energy",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
  },
  {
    role: "admin",
    label: "Super Admin",
    defaultEmail: "admin@foodflow.com",
    icon: ShieldCheck,
    tagline: "Platform analytics, approvals & system health",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
  },
];

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/dashboard",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isAuthenticated, signIn, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );

  const initialMode = searchParams.get("mode") === "signup" ? "signUp" : "signIn";
  const [mode, setMode] = useState<"signIn" | "signUp">(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [selectedRole, setSelectedRole] = useState<UserRole>("user");
  const [email, setEmail] = useState("alex@example.com");
  const [password, setPassword] = useState("password123");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const registrationFormRef = useRef<HTMLFormElement>(null);

  // If already authenticated and not explicitly signed out, redirect
  useEffect(() => {
    if (isAuthenticated && user?.role && !window.localStorage.getItem("foodflow_signed_out")) {
      navigate(dashboardForRole(user.role, redirect), { replace: true });
    }
  }, [isAuthenticated, user, navigate, redirect]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const roleInfo = ROLE_DETAILS.find((d) => d.role === role);
    if (roleInfo && mode === "signIn") {
      setEmail(roleInfo.defaultEmail);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set("flow", mode);
      formData.set("role", selectedRole);
      formData.set("email", email.trim());
      formData.set("password", password);
      if (mode === "signUp") {
        formData.set("name", name.trim() || `${selectedRole.toUpperCase()} Member`);
        formData.set("phone", phone.trim() || "+91 98765 00000");
        formData.set("address", address.trim() || "Main City Center");
      }

      const authenticatedUser = await signIn("password", formData);
      toast.success(
        mode === "signUp"
          ? `Account created! Welcome, ${authenticatedUser.name}. Opening your ${selectedRole} dashboard.`
          : `Welcome back, ${authenticatedUser.name}!`,
      );
      const targetDashboard = dashboardForRole(authenticatedUser.role, redirect);
      navigate(targetDashboard);
    } catch (err) {
      console.error("Authentication error:", err);
      setError("Authentication failed. Please verify your details.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentRoleInfo = ROLE_DETAILS.find((d) => d.role === selectedRole) || ROLE_DETAILS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F4] text-gray-900">
      {/* Top Banner Navigation */}
      <header className="border-b border-gray-200/80 bg-white/90 backdrop-blur px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs font-bold text-gray-700 hover:text-emerald-700"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to FoodFlow
          </Button>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm font-bold text-sm">
              FF
            </div>
            <span className="font-extrabold text-[#173B38] text-base tracking-tight hidden sm:inline">
              FoodFlow <span className="text-xs font-normal text-emerald-700">Platform Portal</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-medium border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Verified Network Active
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
        <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(380px,460px)] lg:gap-10">
          
          {/* Left Column: Mission Showcase with High Quality Image Replacement */}
          <aside className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm">
              {/* Main Image Container */}
              <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80"
                  alt="FoodFlow community volunteers rescuing surplus food and sharing meals"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-bold tracking-wide text-white backdrop-blur shadow-sm">
                    <Sparkles className="h-3.5 w-3.5" />
                    Zero Hunger · Zero Landfill
                  </span>
                  <h2 className="mt-2 text-xl sm:text-2xl font-black leading-tight drop-shadow-sm text-white">
                    Connecting surplus food directly with communities in need.
                  </h2>
                </div>
              </div>

              {/* Informative Highlights */}
              <div className="p-6 space-y-4">
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600">
                  FoodFlow brings together verified donors, logistics drivers, hunger-relief charities, and clean-tech biogas facilities into a transparent, real-time rescue ecosystem.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5 transition-colors hover:bg-emerald-50">
                    <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs sm:text-sm">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      Verified Distribution
                    </div>
                    <p className="mt-1 text-[11px] text-gray-600 leading-normal">
                      Secure verification, hygiene standards, and direct handoffs to accredited shelter networks.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-3.5 transition-colors hover:bg-teal-50">
                    <div className="flex items-center gap-2 text-teal-900 font-extrabold text-xs sm:text-sm">
                      <Truck className="h-4 w-4 text-teal-600 shrink-0" />
                      Live Route Tracking
                    </div>
                    <p className="mt-1 text-[11px] text-gray-600 leading-normal">
                      Real-time Google Maps GPS routing from donors directly to nearby community hubs.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50/90 p-3.5 flex items-center justify-between text-xs text-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs">
                      <Leaf className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-extrabold text-gray-900 block text-xs sm:text-sm">100% Diversion from Landfills</span>
                      <span className="text-[11px] text-gray-500">Non-edible surplus transformed into clean biogas fuel</span>
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Clean Sign In / Register Card */}
          <div className="flex flex-col">
            <Card className="w-full border-gray-200/90 shadow-lg bg-white rounded-3xl overflow-hidden">
              {/* Mode Toggle Tabs */}
              <div className="border-b border-gray-100 bg-gray-50/80 p-3">
                <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-gray-200/70 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signIn");
                      setError(null);
                    }}
                    className={`flex items-center justify-center gap-2 py-2 text-xs font-extrabold rounded-xl transition-all ${
                      mode === "signIn"
                        ? "bg-white text-emerald-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signUp");
                      setError(null);
                    }}
                    className={`flex items-center justify-center gap-2 py-2 text-xs font-extrabold rounded-xl transition-all ${
                      mode === "signUp"
                        ? "bg-white text-emerald-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Create Account
                  </button>
                </div>
              </div>

              <CardHeader className="text-center pb-2 pt-5 px-6">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Leaf className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl font-extrabold text-gray-900">
                  {mode === "signIn" ? "Welcome back to FoodFlow" : "Register New Account"}
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  {mode === "signIn"
                    ? "Enter your credentials to access your secure role workspace."
                    : "Create a verified account to join the food rescue community."}
                </CardDescription>
              </CardHeader>

              <form ref={registrationFormRef} onSubmit={handleSubmit}>
                <CardContent className="space-y-4 px-6 pb-4">
                  {/* Role Selector */}
                  <div>
                    <label htmlFor="auth-role-select" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      {mode === "signIn" ? "Sign In As Role / Workspace:" : "Register As Role:"}
                    </label>

                    <select
                      id="auth-role-select"
                      value={selectedRole}
                      onChange={(e) => handleRoleSelect(e.target.value as UserRole)}
                      className="h-10 w-full rounded-xl border border-gray-300 bg-white px-3 text-xs font-bold text-gray-800 shadow-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                      disabled={isLoading}
                    >
                      <option value="user">🧑 Individual Donor (Surplus meals, groceries, produce)</option>
                      <option value="employee">🚚 Collection Agent / Driver (Pickups & NGO deliveries)</option>
                      <option value="business">🏢 Business Partner (Restaurants, grocery chains, bakeries)</option>
                      <option value="biogas">🌿 Biogas Partner (Organic waste to energy processing)</option>
                      <option value="admin">🛡️ Super Administrator (Operations, users & analytics)</option>
                    </select>
                  </div>

                  {/* Sign Up Fields */}
                  {mode === "signUp" && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Full Name or Organization *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={selectedRole === "business" ? "e.g., Green Leaf Kitchen" : "e.g., Alex Johnson"}
                            disabled={isLoading}
                            required
                            className="pl-9 h-10 text-xs font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              name="phone"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+91 98765 01000"
                              type="tel"
                              disabled={isLoading}
                              required
                              className="pl-9 h-10 text-xs font-medium"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Location / City *
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              name="address"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="e.g., Sector 4, Downtown"
                              disabled={isLoading}
                              required
                              className="pl-9 h-10 text-xs font-medium"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Email Field */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        type="email"
                        className="pl-9 h-10 text-xs font-medium"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                        className="pl-9 pr-10 h-10 text-xs font-medium"
                        minLength={6}
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Error Notification */}
                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-semibold flex items-center gap-2">
                      <Info className="h-4 w-4 shrink-0 text-red-500" />
                      {error}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex-col gap-3 px-6 pb-6 pt-1">
                  <Button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-sm transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="mr-2 h-4 w-4" />
                    )}
                    {mode === "signIn"
                      ? `Sign In as ${currentRoleInfo.label}`
                      : `Create ${currentRoleInfo.label} Account`}
                  </Button>

                  <div className="pt-1 text-center text-xs text-gray-500">
                    {mode === "signIn" ? (
                      <>
                        Don't have an account yet?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setMode("signUp");
                            setError(null);
                          }}
                          className="font-bold text-emerald-700 hover:underline"
                        >
                          Register here
                        </button>
                      </>
                    ) : (
                      <>
                        Already registered with FoodFlow?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setMode("signIn");
                            setError(null);
                          }}
                          className="font-bold text-emerald-700 hover:underline"
                        >
                          Sign In here
                        </button>
                      </>
                    )}
                  </div>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}

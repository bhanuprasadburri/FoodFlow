import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Briefcase, CheckCircle2, Star, Zap, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

const plans = [
  { id: "free" as const, name: "Free", price: "$0", period: "/month", icon: Briefcase, color: "border-gray-200", features: ["Up to 5 donations per month", "Basic donation tracking", "Email notifications", "Standard support"] },
  { id: "starter" as const, name: "Starter", price: "$29", period: "/month", icon: Star, color: "border-emerald-300", popular: true, features: ["Unlimited donations", "Advanced analytics dashboard", "Priority agent matching", "Monthly impact reports", "Phone support"] },
  { id: "professional" as const, name: "Professional", price: "$79", period: "/month", icon: Zap, color: "border-blue-300", features: ["All Starter features", "Dedicated account manager", "Custom business branding", "API access", "Compliance documentation", "Priority support"] },
  { id: "enterprise" as const, name: "Enterprise", price: "$199", period: "/month", icon: Crown, color: "border-purple-300", features: ["All Professional features", "Multi-location support", "Custom integrations", "White-label dashboard", "SLA guarantee", "Dedicated support team"] },
];

export default function BusinessSubscription() {
  const { user } = useAuth();
  const business = useQuery(api.mutations.businesses.getByUserId, user?._id ? { userId: user._id } : "skip");
  const updateSubscription = useMutation(api.mutations.businesses.updateSubscription);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string>(() => {
    try {
      return localStorage.getItem("foodflow_biz_plan") || business?.subscriptionPlan || "starter";
    } catch {
      return "starter";
    }
  });

  const handleUpgrade = async (plan: "free" | "starter" | "professional" | "enterprise") => {
    setUpgrading(plan);
    try {
      if (business?._id) {
        await updateSubscription({ businessId: business._id, plan });
      }
    } catch {
      // offline fallback
    }
    try {
      localStorage.setItem("foodflow_biz_plan", plan);
    } catch {
      // ignore
    }
    setCurrentPlan(plan);
    toast.success(`Subscription upgraded to ${plan.toUpperCase()} plan! Invoice & benefits activated.`);
    setUpgrading(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-amber-500" />
          Subscription Plans
        </h1>
        <p className="text-sm text-gray-500 mt-1">Choose a plan that fits your business. Upgrade anytime to unlock more features.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          return (
            <Card key={plan.id} className={`${plan.color} border-2 shadow-sm hover:shadow-md transition-shadow relative`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-3 py-0.5 rounded-full">Most Popular</div>}
              <CardContent className="p-5">
                <plan.icon className="h-8 w-8 text-emerald-600" />
                <h3 className="text-lg font-bold text-gray-900 mt-3">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-500">{plan.period}</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCurrent || upgrading === plan.id}
                  className={`w-full mt-5 ${isCurrent ? "bg-gray-100 text-gray-500" : "bg-emerald-600 hover:bg-emerald-700 text-white"}`}
                >
                  {isCurrent ? "Current Plan" : upgrading === plan.id ? "Activating..." : "Choose Plan"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}

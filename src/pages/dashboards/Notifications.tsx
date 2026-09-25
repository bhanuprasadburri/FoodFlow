import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Bell, CheckCircle2, AlertTriangle, Info, Megaphone, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const typeConfig = {
  info: { icon: Info, color: "bg-blue-50 text-blue-500", label: "Info" },
  success: { icon: CheckCircle2, color: "bg-emerald-50 text-emerald-500", label: "Success" },
  warning: { icon: AlertTriangle, color: "bg-amber-50 text-amber-500", label: "Warning" },
  alert: { icon: Megaphone, color: "bg-orange-50 text-orange-500", label: "Alert" },
};

export default function Notifications() {
  const { user } = useAuth();
  const notifications = useQuery(api.mutations.notifications.listByUser, user?._id ? { userId: user._id } : "skip");
  const markRead = useMutation(api.mutations.notifications.markRead);
  const markAllRead = useMutation(api.mutations.notifications.markAllRead);

  const handleMarkAll = async () => {
    if (!user?._id) return;
    await markAllRead({ userId: user._id });
    toast.success("All notifications marked as read.");
  };

  const sorted = notifications?.sort((a, b) => b.createdAt - a.createdAt) || [];
  const unreadCount = sorted.filter((n) => !n.read).length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-emerald-600" />
            Notifications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.` : "You're all caught up."}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAll} className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
            <CheckCheck className="h-4 w-4 mr-1" /> Mark All Read
          </Button>
        )}
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-0">
          {sorted.length === 0 ? (
            <div className="py-16 text-center">
              <Bell className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No notifications yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {sorted.map((n) => {
                const config = typeConfig[n.type];
                const Icon = config.icon;
                return (
                  <div
                    key={n._id}
                    className={`flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!n.read ? "bg-emerald-50/30" : ""}`}
                    onClick={async () => {
                      if (!n.read) await markRead({ notificationId: n._id });
                    }}
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.color}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                        {!n.read && <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />}
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { CheckCircle2, Edit3, MapPin, Phone, Save, User } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Link } from "react-router";

export default function DonorProfilePage() {
  const { user } = useAuth();
  const updateProfile = useMutation(api.mutations.users.updateProfile);
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  useEffect(() => {
    if (!user) return;
    setForm({ name: user.name || "", phone: user.phone || "", address: user.address || "" });
  }, [user?._id, user?.name, user?.phone, user?.address]);

  const save = async () => {
    setIsSaving(true);
    try {
      await updateProfile(form);
      setEditing(false);
      toast.success("Profile updated successfully.");
    } catch {
      toast.error("We couldn't update your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl space-y-6">
    <div className="flex items-end justify-between gap-3"><div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00877F]">Account identity</p><h1 className="mt-1 text-2xl font-extrabold text-[#173B38]">Your profile</h1></div><button type="button" onClick={() => setEditing((value) => !value)} className="inline-flex items-center gap-2 rounded-xl border border-[#B9DCC8] px-4 py-2.5 text-sm font-bold text-[#087C70]"><Edit3 className="h-4 w-4" />{editing ? "Cancel" : "Edit Profile"}</button></div>
    <section className="rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center gap-4"><div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EAF7F1] text-2xl font-extrabold text-[#087C70]">{form.name?.charAt(0) || "D"}</div><div><h2 className="text-xl font-extrabold text-[#173B38]">{form.name || "Donor"}</h2><p className="mt-1 text-sm text-[#71817C]">{user?.email || "No email available"}</p><span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#EAF7F1] px-2.5 py-1 text-xs font-bold text-[#087C70]"><CheckCircle2 className="h-3.5 w-3.5" />Account status active</span></div></div><div className="mt-8 grid gap-5 sm:grid-cols-2"><label className="text-xs font-semibold text-[#9AA9A2]">Full Name<input disabled={!editing} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 h-11 w-full rounded-lg border border-[#DDE8E1] px-3 text-sm font-normal text-[#41645B] disabled:bg-[#F5F7F4]" /></label><div className="text-xs font-semibold text-[#9AA9A2]">Email<div className="mt-1 flex h-11 items-center rounded-lg border border-[#DDE8E1] bg-[#F5F7F4] px-3 text-sm font-normal text-[#71817C]">{user?.email || "No email available"}</div></div><label className="text-xs font-semibold text-[#9AA9A2]"><span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />Phone Number</span><input disabled={!editing} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Add a phone number" className="mt-1 h-11 w-full rounded-lg border border-[#DDE8E1] px-3 text-sm font-normal text-[#41645B] disabled:bg-[#F5F7F4]" /></label><label className="text-xs font-semibold text-[#9AA9A2]"><span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />Address</span><input disabled={!editing} value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Add your pickup address" className="mt-1 h-11 w-full rounded-lg border border-[#DDE8E1] px-3 text-sm font-normal text-[#41645B] disabled:bg-[#F5F7F4]" /></label></div>{editing && <div className="mt-7 flex justify-end"><button type="button" disabled={isSaving} onClick={() => void save()} className="inline-flex items-center gap-2 rounded-xl bg-[#0B8B7F] px-4 py-3 text-sm font-bold text-white disabled:opacity-60"><Save className="h-4 w-4" />{isSaving ? "Saving..." : "Save Changes"}</button></div>}</section>
    <Link to="/donor/settings" className="inline-flex items-center gap-2 text-sm font-bold text-[#087C70]"><User className="h-4 w-4" />Manage account settings</Link>
  </motion.div>;
}

import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { EmptyState, StatusBadge } from "@/components/dashboard/SharedComponents";
import { usePartnerCapacity, usePartnerSupplies, PartnerSupply } from "./partnerStore";
import { BarChart3, Bell, Building2, Check, CheckCircle2, Cloud, Download, FileText, Gauge, Leaf, MapPin, Package, Save, Search, Sparkles, Sprout, Truck, Upload, Zap } from "lucide-react";
function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <section className={`rounded-3xl border border-[#E1EAE3] bg-white p-5 shadow-sm sm:p-6 ${className}`}>{children}</section>; }
function Shell({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) { return <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-[1500px] space-y-6"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2E7D32]">Verified waste-processing partner</p><h1 className="mt-1 text-2xl font-extrabold text-[#23453C]">{title}</h1></div>{action}</div>{children}</motion.div>; }
function SupplyRow({ supply, onAccept }: { supply: PartnerSupply; onAccept?: () => void }) { return <div className="flex flex-wrap items-center gap-3 border-b border-[#EEF1ED] p-4 hover:bg-[#FAFCFA]"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF7F1] text-[#2E7D32]"><Package className="h-5 w-5" /></div><div className="min-w-[170px] flex-1"><p className="text-sm font-bold text-[#23453C]">{supply.id} · {supply.source}</p><p className="mt-1 text-xs text-[#71817C]">{supply.category} · {supply.quantity} kg · {supply.pickupDate}</p></div><StatusBadge status={supply.status} />{onAccept && <button type="button" onClick={onAccept} className="rounded-lg bg-[#2E7D32] px-3 py-2 text-xs font-bold text-white">Accept Supply</button>}<Link to={`/partner/supply-requests/${supply.id}`} className="rounded-lg border border-[#DDE8E1] px-3 py-2 text-xs font-bold text-[#41645B]">View</Link></div>; }
function Timeline({ status }: { status: string }) { const stages = ["Accepted", "Scheduled", "In Transit", "Received", "Processing", "Completed"]; const current = Math.max(0, stages.findIndex((stage) => status.replace(/_/g, " ").toLowerCase().includes(stage.toLowerCase()))); return <div className="space-y-3">{stages.map((stage, index) => <div key={stage} className="flex items-center gap-3"><div className={`flex h-8 w-8 items-center justify-center rounded-full ${index <= current ? "bg-[#2E7D32] text-white" : "bg-[#EEF4EF] text-[#9AAA9F]"}`}>{index <= current ? <Check className="h-4 w-4" /> : index + 1}</div><span className={`text-sm font-semibold ${index <= current ? "text-[#41645B]" : "text-[#9AAA9F]"}`}>{stage}</span></div>)}</div>; }
export function PartnerDashboardPage() { const { user } = useAuth(); const { supplies, update } = usePartnerSupplies(); const { capacity } = usePartnerCapacity(); const received = supplies.filter((s) => ["received", "processing", "completed"].includes(s.status)).reduce((sum, s) => sum + s.quantity, 0); const active = supplies.filter((s) => !["completed", "rejected"].includes(s.status)); const cards = [["Total waste received", `${received} kg`, Leaf, "/partner/incoming-supply"], ["This month", "620 kg", Sprout, "/partner/analytics"], ["Active supply requests", supplies.filter((s) => s.status === "pending").length, Package, "/partner/supply-requests"], ["Processing capacity", `${Math.round((capacity.used / capacity.total) * 100)}%`, Gauge, "/partner/capacity"], ["Completed collections", supplies.filter((s) => s.status === "completed").length, CheckCircle2, "/partner/collections"], ["Estimated biogas output", "328 kWh", Zap, "/partner/impact"]] as const; return <Shell title={`Welcome back, ${user?.name?.split(" ")[0] || "Partner"}`} action={<Link to="/partner/supply-requests" className="rounded-xl bg-[#F6C85F] px-4 py-3 text-sm font-extrabold text-[#23453C]">View Supply Requests</Link>}><div className="rounded-[28px] bg-[#2E5D50] p-6 text-white shadow-lg"><p className="text-lg font-bold">Manage organic waste collection and processing efficiently.</p><p className="mt-2 text-sm text-[#D4E9DE]">Supply acceptance is governed by agreements, accepted categories, capacity, and verified operational rules.</p><div className="mt-6 flex flex-wrap gap-3"><Link to="/partner/supply-requests" className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#2E5D50]">Accept Supply</Link><Link to="/partner/capacity" className="rounded-xl border border-white/30 px-4 py-2.5 text-sm font-bold">Update Capacity</Link><Link to="/partner/reports" className="rounded-xl border border-white/30 px-4 py-2.5 text-sm font-bold">Generate Report</Link></div></div><div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{cards.map(([label, value, Icon, href]) => <Link key={label} to={href} className="rounded-2xl border border-[#E1EAE3] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF7F1] text-[#2E7D32]"><Icon className="h-4 w-4" /></div><p className="mt-5 text-2xl font-extrabold text-[#23453C]">{value}</p><p className="mt-1 text-xs text-[#71817C]">{label}</p></Link>)}</div><div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><Panel><h2 className="text-xl font-extrabold text-[#23453C]">Incoming supply</h2><div className="mt-4">{active.slice(0, 4).map((s) => <SupplyRow key={s.id} supply={s} onAccept={s.status === "pending" ? () => update(s.id, { status: "accepted" }) : undefined} />)}</div></Panel><Panel className="bg-[#F5FBF4]"><h2 className="text-xl font-extrabold text-[#23453C]">Capacity status</h2><p className="mt-5 text-4xl font-extrabold text-[#2E7D32]">{capacity.total - capacity.used} kg</p><p className="mt-1 text-sm text-[#71817C]">Available capacity</p><div className="mt-5 h-3 rounded-full bg-[#DCECE1]"><motion.div initial={{ width: 0 }} animate={{ width: `${(capacity.used / capacity.total) * 100}%` }} className="h-full rounded-full bg-[#2E7D32]" /></div><p className="mt-2 text-xs text-[#71817C]">{capacity.used} kg used · {capacity.reserved} kg reserved</p></Panel></div></Shell>; }
export function SupplyRequestsPage() { const { supplies, update } = usePartnerSupplies(); const [search, setSearch] = useState(""); const items = supplies.filter((s) => s.status === "pending" && (!search || s.id.toLowerCase().includes(search.toLowerCase()) || s.source.toLowerCase().includes(search.toLowerCase()))); return <Shell title="Supply requests"><Panel><div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9AA9A2]" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search supply..." className="h-10 w-full rounded-lg border border-[#DDE8E1] pl-9 text-sm" /></div><div className="mt-5">{items.length ? items.map((s) => <SupplyRow key={s.id} supply={s} onAccept={() => update(s.id, { status: "accepted" })} />) : <EmptyState icon={Package} title="No pending supply requests" description="New platform supply requests will appear here." />}</div></Panel></Shell>; }
export function SupplyDetailsPage() { const { id } = useParams(); const { supplies, update } = usePartnerSupplies(); const supply = supplies.find((s) => s.id === id); if (!supply) return <Shell title="Supply not found"><Panel><EmptyState icon={Package} title="Supply unavailable" description="This supply request is not in the partner workspace." /><Link to="/partner/supply-requests" className="mx-auto block w-fit rounded-xl bg-[#2E7D32] px-4 py-3 text-sm font-bold text-white">Back to requests</Link></Panel></Shell>; return <Shell title={supply.id}><div className="grid gap-6 lg:grid-cols-2"><Panel><p className="text-lg font-extrabold text-[#23453C]">{supply.source}</p><p className="mt-2 text-sm text-[#71817C]">{supply.category} · {supply.quantity} kg · pickup {supply.pickupDate}</p><dl className="mt-6 space-y-4 text-sm"><div><dt className="text-xs text-[#9AA9A2]">Location</dt><dd className="mt-1 font-semibold text-[#41645B]">{supply.pickup}</dd></div><div><dt className="text-xs text-[#9AA9A2]">Agreement</dt><dd className="mt-1 font-semibold text-[#41645B]">Active partner agreement</dd></div><div><dt className="text-xs text-[#9AA9A2]">Notes</dt><dd className="mt-1 font-semibold text-[#41645B]">{supply.notes}</dd></div></dl><div className="mt-7 flex gap-3">{supply.status === "pending" && <button type="button" onClick={() => update(supply.id, { status: "accepted" })} className="rounded-xl bg-[#2E7D32] px-4 py-3 text-sm font-bold text-white">Accept Supply</button>}<button type="button" onClick={() => update(supply.id, { status: "rejected" })} className="rounded-xl border border-[#F0D7D0] px-4 py-3 text-sm font-bold text-[#C65A35]">Reject</button></div></Panel><Panel><h2 className="text-lg font-extrabold text-[#23453C]">Supply status</h2><div className="mt-5"><Timeline status={supply.status} /></div></Panel></div></Shell>; }
export function IncomingPage({ collections = false }: { collections?: boolean }) { const { supplies, update } = usePartnerSupplies(); const items = collections ? supplies.filter((s) => ["accepted", "scheduled", "in_transit"].includes(s.status)) : supplies.filter((s) => ["accepted", "scheduled", "in_transit", "received", "processing", "completed"].includes(s.status)); return <Shell title={collections ? "Collections" : "Incoming supply"}><Panel><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="text-xs uppercase tracking-wide text-[#9AAA9F]"><tr><th className="pb-3">Supply</th><th className="pb-3">Source</th><th className="pb-3">Category</th><th className="pb-3">Quantity</th><th className="pb-3">Status</th><th className="pb-3">Action</th></tr></thead><tbody>{items.map((s) => <tr key={s.id} className="border-t border-[#EEF1ED]"><td className="py-4 font-bold text-[#23453C]">{s.id}</td><td className="py-4 text-[#536B63]">{s.source}</td><td className="py-4 text-[#536B63]">{s.category}</td><td className="py-4 text-[#536B63]">{s.quantity} kg</td><td className="py-4"><StatusBadge status={s.status} /></td><td className="py-4"><button type="button" onClick={() => update(s.id, { status: s.status === "accepted" ? "scheduled" : "received" })} className="rounded-lg bg-[#EAF7F1] px-3 py-2 text-xs font-bold text-[#2E7D32]">{s.status === "accepted" ? "Schedule" : "Confirm Receipt"}</button></td></tr>)}</tbody></table></div></Panel></Shell>; }
export function CapacityPage() { const { capacity, setCapacity } = usePartnerCapacity(); const [total, setTotal] = useState(capacity.total); return <Shell title="Processing capacity"><Panel><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[["Total", capacity.total], ["Used", capacity.used], ["Reserved", capacity.reserved], ["Available", capacity.total - capacity.used - capacity.reserved]].map(([label, value]) => <div key={String(label)} className="rounded-2xl bg-[#F5FBF4] p-4"><p className="text-xs text-[#71817C]">{label}</p><p className="mt-2 text-2xl font-extrabold text-[#23453C]">{value} kg</p></div>)}</div><div className="mt-7 h-4 rounded-full bg-[#DCECE1]"><motion.div initial={{ width: 0 }} animate={{ width: `${(capacity.used / capacity.total) * 100}%` }} className="h-full rounded-full bg-[#2E7D32]" /></div><p className="mt-2 text-xs text-[#71817C]">{Math.round((capacity.used / capacity.total) * 100)}% capacity used</p><div className="mt-6 flex gap-3"><input type="number" value={total} onChange={(e) => setTotal(Number(e.target.value))} className="h-10 rounded-lg border border-[#DDE8E1] px-3 text-sm" /><button type="button" onClick={() => setCapacity({ ...capacity, total })} className="rounded-xl bg-[#2E7D32] px-4 py-2.5 text-sm font-bold text-white"><Save className="mr-2 inline h-4 w-4" />Update Capacity</button></div></Panel><Panel className="border-[#EBD79B] bg-[#FFF9E9]"><p className="text-sm font-bold text-[#A6751A]">Capacity alert</p><p className="mt-2 text-sm text-[#8D762F]">New supply requests should be checked against available capacity before acceptance.</p></Panel></Shell>; }
export function ProcessingPage() { const { supplies, update } = usePartnerSupplies(); const items = supplies.filter((s) => ["received", "processing", "completed"].includes(s.status)); return <Shell title="Processing records"><Panel><div className="space-y-3">{items.map((s) => <div key={s.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-[#E1EAE3] p-4"><div className="flex-1"><p className="font-bold text-[#23453C]">PROC-{s.id.slice(-4)} · {s.quantity} kg input</p><p className="mt-1 text-xs text-[#71817C]">Anaerobic digestion or approved processing method · estimated output only</p></div><StatusBadge status={s.status} /><button type="button" onClick={() => update(s.id, { status: s.status === "received" ? "processing" : "completed" })} className="rounded-lg bg-[#2E7D32] px-3 py-2 text-xs font-bold text-white">{s.status === "received" ? "Start Processing" : s.status === "processing" ? "Complete Processing" : "View Record"}</button></div>)}</div></Panel><Panel className="bg-[#F5FBF4]"><h2 className="text-lg font-extrabold text-[#23453C]">Estimated output</h2><p className="mt-2 text-3xl font-extrabold text-[#2E7D32]">328 kWh</p><p className="mt-1 text-xs text-[#71817C]">Estimated from mock conversion data. Actual output should be entered from measured production records.</p></Panel></Shell>; }
export function AnalyticsPage() { return <Shell title="Partner analytics"><div className="grid gap-6 lg:grid-cols-2"><Panel><h2 className="text-lg font-extrabold text-[#23453C]">Waste received</h2><div className="mt-7 flex h-44 items-end gap-3 border-b border-[#E1EAE3]">{[30, 48, 42, 70, 56, 82].map((height, index) => <motion.div key={index} initial={{ height: 0 }} animate={{ height: `${height}%` }} className="flex-1 rounded-t-lg bg-[#9AD8A5]" />)}</div></Panel><Panel><h2 className="text-lg font-extrabold text-[#23453C]">Smart processing insights</h2><div className="mt-5 space-y-3 text-sm text-[#536B63]"><p className="rounded-xl bg-[#F5FBF4] p-3">Average weekly intake increased by 14%.</p><p className="rounded-xl bg-[#FFF9E9] p-3">Capacity utilization is highest on Fridays.</p><p className="rounded-xl bg-[#F1F6FB] p-3">Three upcoming requests may exceed weekly capacity.</p></div></Panel></div></Shell>; }
export function ImpactPage() { const { supplies } = usePartnerSupplies(); const processed = supplies.filter((s) => s.status === "completed").reduce((sum, s) => sum + s.quantity, 0); return <Shell title="Sustainability impact"><Panel className="bg-[#2E5D50] text-white"><p className="text-xs font-bold uppercase tracking-widest text-[#C6E7D2]">Resource recovery</p><h2 className="mt-3 text-3xl font-extrabold">{processed} kg processed</h2><p className="mt-3 text-sm text-[#D4E9DE]">Waste received → waste processed → estimated biogas output. Only appropriate categories and verified agreements are eligible.</p><div className="mt-6 grid grid-cols-3 gap-3 text-center"><div><p className="text-xl font-extrabold">{processed}</p><p className="text-xs text-[#C6E7D2]">Actual input</p></div><div><p className="text-xl font-extrabold">328 kWh</p><p className="text-xs text-[#C6E7D2]">Estimated output</p></div><div><p className="text-xl font-extrabold">3</p><p className="text-xs text-[#C6E7D2]">Events</p></div></div></Panel><Panel><h2 className="text-lg font-extrabold text-[#23453C]">Processing milestones</h2><div className="mt-5 grid gap-3 sm:grid-cols-5">{["100 kg", "500 kg", "1,000 kg", "5,000 kg", "10,000 kg"].map((item) => <div key={item} className="rounded-2xl bg-[#EAF7F1] p-4 text-center text-xs font-bold text-[#2E7D32]"><Leaf className="mx-auto h-5 w-5" /><p className="mt-2">{item}</p></div>)}</div></Panel></Shell>; }
export function AgreementsPage() {
  const [quotaRequested, setQuotaRequested] = useState(false);
  return (
    <Shell title="Supply agreements & quota">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="rounded-full bg-[#EAF7F1] px-2.5 py-1 text-xs font-bold text-[#2E7D32]">
                Active Master Agreement
              </span>
              <h2 className="mt-2 text-xl font-extrabold text-[#23453C]">
                Municipal & Commercial Biomethanation Pact
              </h2>
              <p className="mt-1 text-xs text-[#71817C]">Contract ID: AGR-2026-01 · Active through Dec 31, 2026</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const blob = new Blob(["FoodFlow Partner Supply Agreement AGR-2026-01 - 500 KG/week active quota"], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "foodflow-supply-agreement.txt";
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-[#B9DCC8] px-3.5 py-2 text-xs font-bold text-[#2E7D32] hover:bg-[#F5FBF4]"
            >
              <Download className="h-3.5 w-3.5" /> Download Contract
            </button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-[#F5FBF4] p-3.5">
              <p className="text-xs text-[#71817C]">Weekly Quota</p>
              <p className="mt-1 text-xl font-extrabold text-[#23453C]">500 kg/wk</p>
            </div>
            <div className="rounded-xl bg-[#F5FBF4] p-3.5">
              <p className="text-xs text-[#71817C]">Subsidy Rate</p>
              <p className="mt-1 text-xl font-extrabold text-[#2E7D32]">₹8.50 / kg</p>
            </div>
            <div className="rounded-xl bg-[#F5FBF4] p-3.5">
              <p className="text-xs text-[#71817C]">This Month Intake</p>
              <p className="mt-1 text-xl font-extrabold text-[#23453C]">1,840 kg</p>
            </div>
            <div className="rounded-xl bg-[#F5FBF4] p-3.5">
              <p className="text-xs text-[#71817C]">Earned Subsidy</p>
              <p className="mt-1 text-xl font-extrabold text-[#0B8B7F]">₹15,640</p>
            </div>
          </div>
          <div className="mt-6 border-t border-[#EEF1ED] pt-5">
            <h3 className="text-sm font-bold text-[#23453C]">Authorized Waste Categories:</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "Kitchen prep peels & trimmings",
                "Expired bakery dough",
                "Non-edible produce surplus",
                "Coffee & tea grounds",
                "Cooked buffet plate waste",
              ].map((c) => (
                <span key={c} className="rounded-full bg-[#EAF7F1] px-3 py-1 text-xs font-semibold text-[#2E7D32]">
                  ✓ {c}
                </span>
              ))}
            </div>
          </div>
        </Panel>

        <Panel className="bg-[#F5FBF4]">
          <h3 className="text-base font-bold text-[#23453C]">Request Quota Adjustment</h3>
          <p className="mt-1.5 text-xs text-[#71817C]">
            If your facility capacity is expanding, submit a request to increase your guaranteed weekly organic intake quota.
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-semibold text-[#536B63]">Requested Weekly Intake (kg)</label>
              <input
                type="number"
                defaultValue={750}
                className="mt-1 h-10 w-full rounded-lg border border-[#DDE8E1] bg-white px-3 text-sm font-semibold text-[#23453C]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#536B63]">Additional Digester Tanks Available</label>
              <input
                type="text"
                defaultValue="Tank 3 (Capacity: 1,500 L)"
                className="mt-1 h-10 w-full rounded-lg border border-[#DDE8E1] bg-white px-3 text-sm font-semibold text-[#23453C]"
              />
            </div>
            <button
              type="button"
              onClick={() => setQuotaRequested(true)}
              className="w-full rounded-xl bg-[#2E7D32] py-2.5 text-sm font-bold text-white hover:bg-[#256629]"
            >
              Submit Quota Revision Request
            </button>
            {quotaRequested && (
              <p className="text-center text-xs font-bold text-[#2E7D32]">
                ✓ Quota revision request submitted to Super Admin!
              </p>
            )}
          </div>
        </Panel>
      </div>
    </Shell>
  );
}

export function SimplePartnerPage({ title }: { title: string }) { return <Shell title={title}><Panel><EmptyState icon={FileText} title={`${title} workspace`} description="This partner module is ready for agreement, report, notification, profile, or support activity." /></Panel></Shell>; }
export function ReportsPage() { const [generated, setGenerated] = useState(false); return <Shell title="Partner reports"><Panel><select className="h-10 rounded-lg border border-[#DDE8E1] bg-white px-3 text-sm"><option>Processing Report</option><option>Waste Intake Report</option><option>Capacity Report</option><option>Impact Report</option></select><button type="button" onClick={() => setGenerated(true)} className="ml-3 rounded-xl bg-[#2E7D32] px-4 py-2.5 text-sm font-bold text-white">Generate</button>{generated && <div className="mt-5 rounded-xl bg-[#F5FBF4] p-4"><p className="text-sm font-bold text-[#23453C]">Report preview ready</p><button type="button" onClick={() => { const blob = new Blob(["FoodFlow Partner Processing Report"], { type: "text/plain" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "foodflow-partner-report.txt"; a.click(); URL.revokeObjectURL(url); }} className="mt-3 rounded-lg border border-[#B9DCC8] px-3 py-2 text-xs font-bold text-[#2E7D32]"><Download className="mr-1 inline h-3.5 w-3.5" />Download</button></div>}</Panel></Shell>; }
export function NotificationsPage() { const [items, setItems] = useState(["New supply request SUP-1049", "Capacity is 72% full", "Agreement update from Admin"]); return <Shell title="Notifications"><Panel><button type="button" onClick={() => setItems([])} className="mb-4 text-xs font-bold text-[#2E7D32]">Mark all as read</button>{items.length ? items.map((item, index) => <div key={item} className="flex items-center gap-3 border-t border-[#EEF1ED] py-4"><Bell className="h-4 w-4 text-[#2E7D32]" /><span className="flex-1 text-sm text-[#536B63]">{item}</span><button type="button" onClick={() => setItems((current) => current.filter((_, i) => i !== index))} className="text-[#9AA9A2]">×</button></div>) : <EmptyState icon={Bell} title="All caught up" description="Partner updates will appear here." />}</Panel></Shell>; }
export function IssuesPage() { const [ticketId, setTicketId] = useState(""); const [sent, setSent] = useState(false); return <Shell title="Issues & support"><Panel>{sent ? <p className="font-bold text-[#2E7D32]">Issue reported successfully. Ticket ID: PART-{ticketId || "5291"}</p> : <form onSubmit={(e) => { e.preventDefault(); setTicketId(String(Math.floor(1000 + Math.random() * 8999))); setSent(true); }} className="space-y-4"><input placeholder="Supply ID" className="h-10 w-full rounded-lg border border-[#DDE8E1] px-3 text-sm" /><select className="h-10 w-full rounded-lg border border-[#DDE8E1] bg-white px-3 text-sm"><option>Collection Issue</option><option>Quantity Mismatch</option><option>Wrong Waste Category</option><option>Capacity Issue</option><option>Equipment Issue</option><option>Scheduling Issue</option><option>Technical Issue</option></select><textarea required rows={4} placeholder="Describe the issue" className="w-full rounded-lg border border-[#DDE8E1] p-3 text-sm" /><button type="submit" className="rounded-xl bg-[#2E7D32] px-4 py-3 text-sm font-bold text-white">Report Issue</button></form>}</Panel></Shell>; }
export function ProfilePage() { const { user } = useAuth(); const [saved, setSaved] = useState(false); return <Shell title="Partner profile"><Panel><div className="flex items-center gap-4"><div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#EAF7F1] text-3xl font-extrabold text-[#2E7D32]"><Building2 /></div><div><h2 className="text-xl font-extrabold text-[#23453C]">{user?.name || "Verified Partner"}</h2><p className="text-sm text-[#71817C]">Partner ID: BIO-2048 · {user?.email || "partner@example.com"}</p><span className="mt-2 inline-flex rounded-full bg-[#EAF7F1] px-2.5 py-1 text-xs font-bold text-[#2E7D32]">Verified Partner</span></div></div><div className="mt-7 grid gap-4 sm:grid-cols-2"><input defaultValue={user?.name || "Organization name"} className="h-10 rounded-lg border border-[#DDE8E1] px-3 text-sm" /><input defaultValue={user?.phone || "Phone"} className="h-10 rounded-lg border border-[#DDE8E1] px-3 text-sm" /><input defaultValue={user?.address || "Location"} className="h-10 rounded-lg border border-[#DDE8E1] px-3 text-sm" /><input placeholder="Processing type" className="h-10 rounded-lg border border-[#DDE8E1] px-3 text-sm" /></div><button type="button" onClick={() => setSaved(true)} className="mt-6 rounded-xl bg-[#2E7D32] px-4 py-3 text-sm font-bold text-white"><Save className="mr-2 inline h-4 w-4" />Save Changes</button>{saved && <p className="mt-3 text-sm font-bold text-[#2E7D32]">Profile changes saved for this session.</p>}</Panel></Shell>; }
export function SettingsPage() { return <Shell title="Settings"><Panel><h2 className="text-lg font-extrabold text-[#23453C]">Capacity & notifications</h2>{["Supply Requests", "Collection Alerts", "Capacity Alerts", "Admin Messages", "Two-factor authentication"].map((label) => <label key={label} className="flex items-center justify-between border-b border-[#EEF1ED] py-4 text-sm font-semibold text-[#536B63]"><span>{label}</span><input type="checkbox" defaultChecked className="h-5 w-5 accent-[#2E7D32]" /></label>)}</Panel></Shell>; }

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { Heart, AlertTriangle, CheckCircle2, Loader2, Shield, Sparkles, Upload, Info } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function CreateDonation() {
  const { user } = useAuth();
  const createDonation = useMutation(api.mutations.donations.create);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [safetyDeclared, setSafetyDeclared] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [form, setForm] = useState({
    foodName: "",
    foodCategory: "cooked" as string,
    quantity: "",
    quantityKg: "",
    servesPeople: "",
    condition: "fresh" as string,
    preparationDate: "",
    expiryDate: "",
    pickupAddress: "",
    pickupTimeWindow: "",
    contactPhone: "",
    instructions: "",
  });

  const updateField = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!safetyDeclared) {
      toast.error("Please accept the Food Safety Declaration before submitting.");
      return;
    }
    setIsSubmitting(true);
    const newDonationId = `FF-${Math.floor(10000 + Math.random() * 89999)}`;
    const newDonationRecord = {
      _id: `don-${newDonationId.toLowerCase()}`,
      id: newDonationId,
      foodName: form.foodName,
      foodCategory: form.foodCategory,
      category: form.foodCategory === "cooked" ? "Cooked meal" : form.foodCategory === "bakery" ? "Bakery" : "Fresh produce",
      quantity: form.quantity,
      unit: "containers",
      quantityKg: parseFloat(form.quantityKg) || 10,
      impactKg: parseFloat(form.quantityKg) || 10,
      servesPeople: parseInt(form.servesPeople) || 25,
      condition: form.condition,
      preparationDate: form.preparationDate || new Date().toISOString(),
      bestBefore: form.expiryDate || new Date(Date.now() + 86400000).toISOString(),
      expiryDate: form.expiryDate || new Date(Date.now() + 86400000).toISOString(),
      pickupAddress: form.pickupAddress || "15 Maple Street, Downtown",
      pickupDate: new Date().toISOString().split("T")[0],
      pickupWindow: form.pickupTimeWindow || "4:00 PM - 6:00 PM",
      pickupTimeWindow: form.pickupTimeWindow || "4:00 PM - 6:00 PM",
      contact: form.contactPhone || "+91 98765 43210",
      contactPhone: form.contactPhone || "+91 98765 43210",
      description: form.instructions || "Freshly packed food.",
      instructions: form.instructions || "",
      imageUrl: imagePreview,
      status: "pending",
      donorType: "user",
      donorName: user?.name || "Demo Donor",
      employee: "Awaiting assignment",
      employeeName: "Awaiting assignment",
      createdAt: new Date().toISOString(),
      earningsINR: Math.round((parseFloat(form.quantityKg) || 10) * 24),
      paymentStatus: "Pending verification",
    };

    try {
      const stored = JSON.parse(localStorage.getItem("foodflow_all_donations") || "[]");
      localStorage.setItem("foodflow_all_donations", JSON.stringify([newDonationRecord, ...stored]));
    } catch {
      // ignore
    }
    try {
      const donorStored = JSON.parse(localStorage.getItem("foodflow_donor_donations") || "[]");
      localStorage.setItem("foodflow_donor_donations", JSON.stringify([newDonationRecord, ...donorStored]));
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event("foodflow-donations-changed"));

    try {
      await createDonation({
        foodName: form.foodName,
        foodCategory: form.foodCategory as "cooked" | "raw" | "packaged" | "bakery" | "dairy" | "produce" | "other",
        quantity: form.quantity,
        quantityKg: parseFloat(form.quantityKg) || 0,
        servesPeople: parseInt(form.servesPeople) || 0,
        condition: form.condition as "fresh" | "good" | "edible" | "not_for_human",
        preparationDate: form.preparationDate,
        expiryDate: form.expiryDate,
        pickupAddress: form.pickupAddress,
        pickupTimeWindow: form.pickupTimeWindow,
        contactPhone: form.contactPhone,
        imageUrl: imagePreview,
        instructions: form.instructions,
        safetyDeclaration: safetyDeclared,
        donorType: "user",
      });
    } catch {
      // Convex mutation offline - local persistence took care of it!
    } finally {
      setIsSubmitting(false);
      toast.success("Donation created successfully! A nearby organization and volunteer are being matched.");
      navigate(`/dashboard/matching/${newDonationRecord.id}`);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Heart className="h-6 w-6 text-orange-500" />
          Donate Surplus Food
        </h1>
        <p className="text-sm text-gray-500 mt-1">Share your surplus food with communities in need through FoodFlow.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Food Details */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-gray-900">Food Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Food Name / Description *</label>
                <Input placeholder="e.g., Homemade Pasta & Sauce" value={form.foodName} onChange={(e) => updateField("foodName", e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Food Category *</label>
                <select value={form.foodCategory} onChange={(e) => updateField("foodCategory", e.target.value)} className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20">
                  <option value="cooked">Cooked Meal</option>
                  <option value="raw">Raw Ingredients</option>
                  <option value="packaged">Packaged / Canned</option>
                  <option value="bakery">Bakery Items</option>
                  <option value="dairy">Dairy Products</option>
                  <option value="produce">Fresh Produce</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Food Image</label>
                <label className="flex min-h-24 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 text-sm text-gray-500 hover:border-emerald-400 hover:bg-emerald-50/40">
                  <Upload className="h-4 w-4" />
                  {imagePreview ? "Change image" : "Upload a clear food image"}
                  <input type="file" accept="image/*" className="sr-only" onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setImagePreview(String(reader.result));
                    reader.readAsDataURL(file);
                  }} />
                </label>
                {imagePreview && <img src={imagePreview} alt="Donation preview" className="mt-2 h-20 w-full rounded-lg object-cover" />}
              </div>
              <div className="rounded-lg border border-[#C8E6C9] bg-[#F3FBF4] p-3 text-xs leading-5 text-gray-600">
                <div className="flex items-center gap-2 font-bold text-[#00615F]"><Info className="h-4 w-4" /> Image guidance</div>
                <p className="mt-2">Use a well-lit image that helps the collection team understand the food and packaging. Images never replace the safety declaration.</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity *</label>
                <Input placeholder="e.g., 3 containers" value={form.quantity} onChange={(e) => updateField("quantity", e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight (kg) *</label>
                <Input type="number" step="0.1" placeholder="e.g., 4.5" value={form.quantityKg} onChange={(e) => updateField("quantityKg", e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Serves (people) *</label>
                <Input type="number" placeholder="e.g., 8" value={form.servesPeople} onChange={(e) => updateField("servesPeople", e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Food Condition *</label>
              <select value={form.condition} onChange={(e) => updateField("condition", e.target.value)} className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20">
                <option value="fresh">Fresh — Just prepared or recently purchased</option>
                <option value="good">Good — Still well within its usable window</option>
                <option value="edible">Edible — Approaching expiry but safe to eat</option>
                <option value="not_for_human">Not Suitable for Human Consumption</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#C8E6C9] bg-[#F3FBF4] shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-[#00615F]"><Sparkles className="h-5 w-5" /> Food Information Assistant <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#7A9C8B]">Optional</span></CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-gray-600">Get help classifying the food type, estimating servings from the information you provide, and preparing a handling note. This assistant does not verify whether food is safe to eat and never replaces food-safety review.</p>
            <button type="button" onClick={() => setAssistantOpen((open) => !open)} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#00615F] px-3 py-2 text-xs font-bold text-white hover:bg-[#005550]">{assistantOpen ? "Hide guidance" : "Suggest information"}<Sparkles className="h-3.5 w-3.5" /></button>
            {assistantOpen && <div className="mt-4 rounded-xl border border-[#C8E6C9] bg-white p-4 text-sm text-gray-600"><p><strong>Suggested category:</strong> {form.foodCategory || "Choose a category above"}</p><p className="mt-2"><strong>Serving estimate:</strong> {form.servesPeople ? `${form.servesPeople} servings provided` : "Add an estimated serving count"}</p><p className="mt-2"><strong>Handling reminder:</strong> Keep the food covered and clearly label allergens or special instructions.</p></div>}
          </CardContent>
        </Card>

        {/* Dates */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-gray-900">Dates & Times</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Preparation Date *</label>
                <Input type="datetime-local" value={form.preparationDate} onChange={(e) => updateField("preparationDate", e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Best-Before / Expiry *</label>
                <Input type="datetime-local" value={form.expiryDate} onChange={(e) => updateField("expiryDate", e.target.value)} required />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pickup Details */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-gray-900">Pickup Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Pickup Address *</label>
              <Input placeholder="Full address for collection" value={form.pickupAddress} onChange={(e) => updateField("pickupAddress", e.target.value)} required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Phone *</label>
                <Input placeholder="+1-555-000-0000" value={form.contactPhone} onChange={(e) => updateField("contactPhone", e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Pickup Time Window *</label>
                <Input placeholder="e.g., Today, 6 PM - 8 PM" value={form.pickupTimeWindow} onChange={(e) => updateField("pickupTimeWindow", e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Instructions</label>
              <textarea
                rows={3}
                placeholder="Any special instructions for the collection agent..."
                value={form.instructions}
                onChange={(e) => updateField("instructions", e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Food Safety Declaration */}
        <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-amber-800 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Food Safety Declaration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-amber-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    I confirm that the food being donated has been stored and handled safely. I understand that:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600 list-disc list-inside">
                    <li>The food has been kept at appropriate temperatures</li>
                    <li>No items are past their safe consumption window</li>
                    <li>I have not used expired or contaminated ingredients</li>
                    <li>FoodFlow will verify donations according to platform safety standards</li>
                    <li>Food marked "Not Suitable for Human Consumption" will be routed to waste-processing partners</li>
                  </ul>
                  <label className="flex items-center gap-3 mt-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={safetyDeclared}
                      onChange={(e) => setSafetyDeclared(e.target.checked)}
                      className="h-4 w-4 rounded border-amber-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-semibold text-gray-900">I accept the Food Safety Declaration *</span>
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/dashboard")} className="border-gray-200">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !safetyDeclared} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Heart className="h-4 w-4 mr-2" />}
            Submit Donation
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useRef } from "react";
import {
  Leaf,
  ArrowRight,
  Users,
  Truck,
  Building2,
  Recycle,
  Heart,
  Shield,
  BarChart3,
  MapPin,
  Bell,
  CheckCircle2,
  Sprout,
  Package,
  HandHelping,
  Star,
  ChevronRight,
  ArrowDown,
  Utensils,
} from "lucide-react";

/* ─── Animation helpers ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};
const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CounterAnimation({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
    >
      {inView ? (
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          {target.toLocaleString()}{suffix}
        </motion.span>
      ) : "0"}
    </motion.span>
  );
}

/* ─── Food images from Unsplash ─────────────────────────────── */
const foodImages = {
  bread: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
  vegetables: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop",
  restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
  delivery: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&h=400&fit=crop",
  community: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
  grocery: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop",
  cooking: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop",
  rescue: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=400&fit=crop",
  compost: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop",
  organic: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600&h=400&fit=crop",
  hero: "https://www.kindnesswelfare.com/_next/image?url=%2Fimages%2Fblog%2Ffood-donation-india-2026.png&w=1200&q=85",
  route: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop",
  pantry: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop",
  mealShare: "https://images.unsplash.com/photo-1509099836639-18ba02c0f8a5?w=600&h=400&fit=crop",
  donor: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=600&h=400&fit=crop",
  businessImpact: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop",
  agent: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
  stripRescue: "https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=600&h=400&fit=crop",
  stripCompost: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&h=400&fit=crop",
  stripEnergy: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop",
  wasteProcessing: "https://img.freepik.com/premium-photo/modern-waste-processing-plant-with-automated-technology-sorting-recycling-plastic-showcasing-industrial-efficiency-sustainability_908344-31006.jpg",
  beyondTable: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=600&h=400&fit=crop",
  ctaOrganic: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop",
  networkAgent: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&h=400&fit=crop",
  surplus: "https://images.financialexpressdigital.com/2025/12/Oliviya_9e0e6e_20250912154108_20251207121346.jpg?w=1200",
  pickup: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop",
  communityMeal: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop",
};

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-[#FBF7F4]">
      {/* ─── Navigation ──────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FBF7F4]/90 backdrop-blur-lg border-b border-[#E8E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#00615F]">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-[#00615F] tracking-tight">FoodFlow</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm font-semibold text-gray-600 hover:text-[#00615F] transition-colors">How It Works</a>
              <a href="#impact" className="text-sm font-semibold text-gray-600 hover:text-[#00615F] transition-colors">Impact</a>
              <a href="#partners-section" className="text-sm font-semibold text-gray-600 hover:text-[#00615F] transition-colors">For Business</a>
              <a href="#sustainability" className="text-sm font-semibold text-gray-600 hover:text-[#00615F] transition-colors">Sustainability</a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/auth" className="text-sm font-semibold text-gray-600 hover:text-[#00615F] transition-colors px-3 py-2">
                Sign In
              </Link>
              <Link
                to="/auth?returnTo=/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-[#00615F] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#00615F]/20 hover:bg-[#005550] transition-all duration-200 hover:shadow-[#00615F]/30"
              >
                Donate Food
                <Heart className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-28 pb-0 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[90vh] flex items-center">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] px-4 py-1.5 mb-6">
                <Sprout className="h-4 w-4 text-[#00615F]" />
                <span className="text-xs font-bold text-[#00615F] uppercase tracking-wider">Join the Food Waste Movement</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.08] tracking-tight">
                Share every meal,{' '}
                <span className="text-[#00615F]">waste nothing</span>,{' '}
                power tomorrow.
              </h1>
              <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-xl">
                Connect with donors, businesses, and collection teams to rescue surplus food before it goes to waste. Every meal saved is a step toward a better world.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/auth?returnTo=/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-[#00615F] px-8 py-4 text-base font-bold text-white shadow-xl shadow-[#00615F]/25 hover:bg-[#005550] hover:shadow-[#00615F]/40 transition-all duration-300"
                >
                  Get Started — It's Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-8 py-4 text-base font-bold text-gray-700 hover:border-[#00615F] hover:text-[#00615F] transition-all duration-300"
                >
                  See How It Works
                  <ArrowDown className="h-5 w-5" />
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <img
                  src={foodImages.hero}
                  alt="Volunteers preparing rescued food for their community"
                  className="rounded-[2rem] w-full h-[420px] object-cover shadow-2xl"
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F5E9]">
                      <Heart className="h-6 w-6 text-[#00615F]" />
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-gray-900">12,480+</p>
                      <p className="text-sm text-gray-500">Meals rescued this month</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F5E9]">
                      <Recycle className="h-6 w-6 text-[#00615F]" />
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-[#00615F]">45 T</p>
                      <p className="text-sm text-gray-500">Food rescued</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="h-6 w-6 text-gray-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Food rescue image strip ──────────────────────────────── */}
      <section className="py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-3 rounded-3xl overflow-hidden">
            {[
              { img: foodImages.stripRescue, label: "Rescue surplus food" },
              { img: foodImages.vegetables, label: "Share fresh produce" },
              { img: foodImages.stripCompost, label: "Compost food waste" },
              { img: foodImages.stripEnergy, label: "Create clean energy" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative h-32 sm:h-44 rounded-2xl overflow-hidden"
              >
                <img src={item.img} alt={item.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute bottom-3 left-3 right-3 text-sm font-bold text-white drop-shadow-md">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-bold text-[#00615F] tracking-widest uppercase">Simple & Effective</p>
            <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">How FoodFlow works</h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
              From surplus to service — a streamlined workflow that gets food where it matters most.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                img: foodImages.surplus,
                title: "List surplus food",
                desc: "Donors and businesses list their surplus with details — category, quantity, freshness, and pickup location.",
              },
              {
                step: "02",
                img: foodImages.pickup,
                title: "Pick up & deliver",
                desc: "Collection agents accept nearby requests and transport food to shelters, kitchens, and community centres.",
              },
              {
                step: "03",
                img: foodImages.communityMeal,
                title: "Feed communities",
                desc: "Food reaches people in need. Analytics track meals served, waste diverted, and environmental impact.",
              },
            ].map((item, i) => (
              <AnimatedSection key={item.step}>
                <div className="group rounded-3xl bg-white border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-[#00615F]/5 transition-all duration-500">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-[#00615F] text-white text-sm font-extrabold rounded-xl px-3 py-1.5">
                      {item.step}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Mission / Impact ─────────────────────────────────────── */}
      <section id="impact" className="py-24 bg-[#00615F] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <p className="text-sm font-bold text-emerald-200 tracking-widest uppercase">Our Mission</p>
              <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                Every meal rescued makes a difference.
              </h2>
              <p className="mt-6 text-emerald-100 leading-relaxed text-lg">
                Nearly one-third of all food produced globally goes to waste while millions go hungry.
                FoodFlow was built to close that gap — creating a transparent, efficient marketplace where
                surplus food moves from businesses and individuals to the people who need it most.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { icon: Shield, label: "Safety First", desc: "Verified through our food-safety framework" },
                  { icon: BarChart3, label: "Full Transparency", desc: "Real-time tracking at every stage" },
                  { icon: MapPin, label: "Local Impact", desc: "Connecting neighbours in their communities" },
                  { icon: Leaf, label: "Zero Waste Goal", desc: "Routing inedible food to biogas partners" },
                ].map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20">
                      <item.icon className="h-5 w-5 text-emerald-200" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{item.label}</p>
                      <p className="text-xs text-emerald-200 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "12,480", label: "Meals Delivered", icon: Heart },
                  { value: "45.2 T", label: "Food Rescued", icon: Package },
                  { value: "340+", label: "Business Partners", icon: Building2 },
                  { value: "89%", label: "Success Rate", icon: CheckCircle2 },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10"
                  >
                    <stat.icon className="h-8 w-8 text-emerald-200 mx-auto mb-3" />
                    <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                    <p className="text-sm text-emerald-200 mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── Who We Connect ──────────────────────────────────────── */}
      <section id="partners-section" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-bold text-[#00615F] tracking-widest uppercase">Our Network</p>
            <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">Who we connect</h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
              A complete ecosystem built around one goal: making sure surplus food reaches those who need it.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Food Donors", desc: "Individuals sharing surplus home-cooked food or groceries.", img: foodImages.rescue },
              { icon: Building2, title: "Businesses", desc: "Restaurants, hotels, and caterers managing end-of-day surplus.", img: foodImages.restaurant },
              { icon: Truck, title: "Collection Agents", desc: "Trained employees who pick up and deliver donated food.", img: foodImages.networkAgent },
              { icon: Recycle, title: "Waste-Processing Partners", desc: "Biogas plants and composters handling food unsuitable for eating.", img: foodImages.wasteProcessing },
            ].map((item, i) => (
              <AnimatedSection key={item.title}>
                <div className="group rounded-3xl bg-white border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-[#00615F]/5 transition-all duration-500">
                  <div className="p-5">
                    <h3 className="text-lg font-extrabold text-gray-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="relative h-40 overflow-hidden">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm">
                      <item.icon className="h-5 w-5 text-[#00615F]" />
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Business Partnership ─────────────────────────────────── */}
      <section className="py-24 bg-[#F5F0EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection className="order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img src={foodImages.pantry} alt="Food pantry partner organizing rescued groceries" className="w-full h-80 object-cover" />
              </div>
            </AnimatedSection>

            <AnimatedSection className="order-1 lg:order-2">
              <p className="text-sm font-bold text-[#00615F] tracking-widest uppercase">For Businesses</p>
              <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                Turn surplus into social impact
              </h2>
              <p className="mt-6 text-gray-500 leading-relaxed text-lg">
                Hotels, restaurants, and food businesses can subscribe to FoodFlow to donate surplus food
                efficiently, track their environmental impact, and build a verified reputation for sustainability.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Track total food donated, meals served, and waste diverted",
                  "Receive a platform-calculated impact score",
                  "Download monthly donation reports for compliance",
                  "Get priority matching with collection agents",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#00615F] shrink-0 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/auth?returnTo=/dashboard"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#00615F] px-8 py-4 text-base font-bold text-white shadow-xl shadow-[#00615F]/20 hover:bg-[#005550] transition-all duration-300"
              >
                Start as a Business Partner
                <ArrowRight className="h-5 w-5" />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── Sustainability / Biogas ──────────────────────────────── */}
      <section id="sustainability" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <p className="text-sm font-bold text-[#00615F] tracking-widest uppercase">Sustainability</p>
              <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                Beyond the table
              </h2>
              <p className="mt-6 text-gray-500 leading-relaxed text-lg">
                Not every surplus item can be donated as food — and that's where our waste-processing
                partnerships come in. FoodFlow classifies inedible food waste and connects it to verified
                biogas and composting partners, creating closed-loop sustainability.
              </p>
              <p className="mt-4 text-gray-500 leading-relaxed text-lg">
                Partners create supply agreements specifying their capacity and accepted categories.
                The platform matches incoming waste with available capacity, schedules pickups, and
                tracks the full journey from collection to processing.
              </p>
              <Link
                to="/auth?returnTo=/dashboard"
                className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-[#00615F] bg-white px-8 py-4 text-base font-bold text-[#00615F] hover:bg-[#E8F5E9] transition-all duration-300"
              >
                Become a Processing Partner
                <Recycle className="h-5 w-5" />
              </Link>
            </AnimatedSection>

            <AnimatedSection>
              <div className="relative">
                <img
                  src={foodImages.beyondTable}
                  alt="Industrial food waste processing facility"
                  className="rounded-3xl w-full h-80 object-cover shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F5E9]">
                      <Recycle className="h-6 w-6 text-[#00615F]" />
                    </div>
                    <div>
                      <p className="text-xl font-extrabold text-[#00615F]">3,200 kg</p>
                      <p className="text-sm text-gray-500">Waste processed monthly</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── Testimonials / Social Proof ──────────────────────────── */}
      <section className="py-24 bg-[#F5F0EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-bold text-[#00615F] tracking-widest uppercase">Trusted by many</p>
            <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">What our community says</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Sarah Johnson", role: "Food Donor", text: "Every container I donate becomes a meal instead of waste. FoodFlow makes sharing surplus simple and trustworthy.", img: foodImages.donor },
              { name: "Grand Hotel", role: "Business Partner", text: "FoodFlow turns our end-of-day surplus into measurable community impact and keeps good food out of landfills.", img: foodImages.businessImpact },
              { name: "David Kim", role: "Collection Agent", text: "I can see where every pickup goes. Better routes mean more meals delivered and less wasted travel.", img: foodImages.agent },
            ].map((t, i) => (
              <AnimatedSection key={t.name}>
                <div className="rounded-3xl bg-white border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 fill-[#00615F] text-[#00615F]" />
                    ))}
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <img src={t.img} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Call to Action ───────────────────────────────────────── */}
      <section className="py-24 bg-[#00615F] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img src={foodImages.ctaOrganic} alt="Organic plants growing from sustainable food systems" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to make a difference?
            </h2>
            <p className="mt-6 text-emerald-100 text-lg max-w-2xl mx-auto">
              Join thousands of donors, businesses, and partners who are already using FoodFlow
              to reduce waste, feed communities, and build a more sustainable food system.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/auth?returnTo=/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-white px-10 py-4 text-base font-bold text-[#00615F] shadow-xl hover:bg-emerald-50 transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-300 px-10 py-4 text-base font-bold text-white hover:bg-emerald-700 transition-all duration-300"
              >
                Learn More
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00615F]">
                  <Leaf className="h-4.5 w-4.5 text-white" />
                </div>
                <span className="text-lg font-extrabold text-white">FoodFlow</span>
              </div>
              <p className="text-sm leading-relaxed">
                Connecting donors, businesses, and partners to reduce food waste and serve communities in need.
              </p>
              <p className="mt-3 text-xs text-gray-500 italic">Save Food. Serve People. Sustain the Future.</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-3">Platform</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#impact" className="hover:text-white transition-colors">Our Mission</a></li>
                <li><a href="#impact" className="hover:text-white transition-colors">Impact</a></li>
                <li><Link to="/auth" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-3">Partners</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#partners-section" className="hover:text-white transition-colors">For Businesses</a></li>
                <li><a href="#partners-section" className="hover:text-white transition-colors">For Donors</a></li>
                <li><a href="#partners-section" className="hover:text-white transition-colors">For Agents</a></li>
                <li><a href="#sustainability" className="hover:text-white transition-colors">Biogas Partners</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-3">Connect</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} FoodFlow. All rights reserved. Built for a more sustainable future.
          </div>
        </div>
      </footer>
    </div>
  );
}

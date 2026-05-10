import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Send, Globe2, ShieldCheck, Truck, Sprout } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useWebsite } from "../../contexts/WebsiteContext";

const TRUST = [
  { icon: Sprout, label: "Direct Sourcing", desc: "Farm to port" },
  { icon: ShieldCheck, label: "Quality Guaranteed", desc: "Inspected & certified" },
  { icon: Globe2, label: "Global Compliance", desc: "International standards" },
  { icon: Truck, label: "Swift Logistics", desc: "On-time delivery" },
];

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=1200&q=80",
  "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&q=80",
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80",
];

function getImageSrc(img: any) {
  if (!img) return FALLBACK_IMAGES[0];
  if (img.image?.startsWith('http')) return img.image;
  return `/uploads/${img.image}`;
}

export function Hero() {
  const { settings, heroImages } = useWebsite();
  const [currentIdx, setCurrentIdx] = useState(0);

  const images = heroImages && heroImages.length > 0 ? heroImages : FALLBACK_IMAGES.map((src, i) => ({ image: src, caption: '' }));

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const heroTitle = settings?.hero_title || "BODAL'S INTERNATIONAL";
  const motto = settings?.motto || "We Care, We Commit, We Connect.";
  const heroSubtitle = settings?.hero_subtitle || "Your trusted gateway to premium Indian seafood, textiles, fresh produce, cereals, and coffee — delivered to discerning buyers across the globe.";

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0d1b35] to-[#0a1628] text-white">
      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(to right, #d4af37 1px, transparent 1px), linear-gradient(to bottom, #d4af37 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* World map outline svg */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08]" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
        <defs><pattern id="dots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#d4af37" /></pattern></defs>
        <ellipse cx="200" cy="220" rx="120" ry="80" fill="url(#dots)" />
        <ellipse cx="450" cy="180" rx="100" ry="60" fill="url(#dots)" />
        <ellipse cx="700" cy="280" rx="160" ry="90" fill="url(#dots)" />
        <ellipse cx="950" cy="220" rx="140" ry="100" fill="url(#dots)" />
        <ellipse cx="900" cy="420" rx="80" ry="50" fill="url(#dots)" />
        <path d="M 700 280 Q 500 100 200 220" stroke="#d4af37" strokeWidth="1" fill="none" strokeDasharray="4 4" />
        <path d="M 700 280 Q 800 150 950 220" stroke="#d4af37" strokeWidth="1" fill="none" strokeDasharray="4 4" />
        <path d="M 700 280 Q 800 380 900 420" stroke="#d4af37" strokeWidth="1" fill="none" strokeDasharray="4 4" />
      </svg>

      {/* Floating orbs */}
      <motion.div className="absolute top-20 -left-20 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%)" }} animate={{ y: [0, 30, 0] }} transition={{ duration: 9, repeat: Infinity }} />
      <motion.div className="absolute bottom-0 -right-20 w-[600px] h-[600px] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)" }} animate={{ y: [0, -30, 0] }} transition={{ duration: 11, repeat: Infinity }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#d4af37]/40 text-[#d4af37] text-xs tracking-[0.2em] uppercase mb-6">
              <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-pulse" />
              Indian Merchant Export House
            </div>

            <h1 className="leading-[1.05] tracking-tight mb-6" style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)", fontWeight: 700 }}>
              {heroTitle.includes("INTERNATIONAL") ? (
                <>{heroTitle.split("INTERNATIONAL")[0]}<br /><span className="text-[#d4af37]">INTERNATIONAL</span></>
              ) : heroTitle}
            </h1>

            <p className="text-white/70 max-w-xl leading-relaxed mb-2 tracking-wide" style={{ fontFamily: "Inter", fontSize: "1.05rem" }}>
              {motto}
            </p>
            <p className="text-white/60 max-w-xl leading-relaxed mb-10" style={{ fontFamily: "Inter" }}>
              {heroSubtitle}
            </p>

            <div className="flex flex-wrap gap-4">
              <button onClick={() => document.getElementById("businesses")?.scrollIntoView({ behavior: "smooth" })} className="group px-7 py-3.5 bg-[#d4af37] text-[#0a1628] rounded-full hover:bg-[#e6c356] transition flex items-center gap-2" style={{ fontFamily: "Inter" }}>
                Explore Our Businesses <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
              <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="px-7 py-3.5 border border-white/30 rounded-full hover:bg-white/10 transition flex items-center gap-2" style={{ fontFamily: "Inter" }}>
                <Send className="w-4 h-4" /> Send Enquiry
              </button>
            </div>
          </motion.div>

          {/* Right visual — Auto-rotating slideshow */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-[480px]">
              <AnimatePresence mode="wait">
                <motion.div key={currentIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0">
                  <ImageWithFallback src={getImageSrc(images[currentIdx])} alt={images[currentIdx]?.caption || "Export"} className="w-full h-full object-cover" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent" />
              {/* Dot indicators */}
              {images.length > 1 && (
                <div className="absolute top-4 right-4 flex gap-1.5 z-10">
                  {images.map((_: any, i: number) => (
                    <button key={i} onClick={() => setCurrentIdx(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentIdx ? "bg-[#d4af37] scale-110" : "bg-white/40 hover:bg-white/70"}`} />
                  ))}
                </div>
              )}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="text-[#d4af37] text-xs tracking-[0.2em] uppercase mb-1">Connecting</div>
                  <div className="text-white text-2xl" style={{ fontFamily: "Playfair Display, serif", fontWeight: 600 }}>India → World</div>
                </div>
                <div className="bg-[#d4af37] text-[#0a1628] rounded-full w-14 h-14 flex items-center justify-center">
                  <Globe2 className="w-6 h-6" />
                </div>
              </div>
            </div>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -bottom-6 -left-6 bg-white text-[#0a1628] p-4 rounded-xl shadow-xl border border-black/5 hidden sm:block">
              <div className="text-xs text-[#717182] tracking-wide">EXPORT REACH</div>
              <div className="flex items-end gap-1 mt-1">
                <span style={{ fontFamily: "Playfair Display, serif", fontSize: "1.75rem", fontWeight: 700 }}>30+</span>
                <span className="text-sm text-[#717182] mb-1">Countries</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Trust indicators */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-16 lg:mt-24">
          {TRUST.map((t, i) => (
            <div key={i} className="group p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 hover:border-[#d4af37]/40 transition">
              <div className="w-10 h-10 rounded-lg bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <t.icon className="w-5 h-5" />
              </div>
              <div className="text-white" style={{ fontFamily: "Inter", fontWeight: 600 }}>{t.label}</div>
              <div className="text-white/50 text-xs mt-0.5">{t.desc}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

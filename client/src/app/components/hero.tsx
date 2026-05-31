import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Send, Globe2, ShieldCheck, Truck, Sprout } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useWebsite } from "../../contexts/WebsiteContext";
import heroForklift from "@/assets/hero-forklift.jpg";
import heroCargoShip from "@/assets/hero-cargo-ship.png";
import heroContainerPort from "@/assets/hero-container-port.jpg";

const TRUST = [
  { icon: Sprout, label: "Direct Sourcing", desc: "Farm to port" },
  { icon: ShieldCheck, label: "Quality Guaranteed", desc: "Inspected & certified" },
  { icon: Globe2, label: "Global Compliance", desc: "International standards" },
  { icon: Truck, label: "Swift Logistics", desc: "On-time delivery" },
];

const FALLBACK_IMAGES = [
  heroForklift,
  heroCargoShip,
  heroContainerPort,
];

function getImageSrc(img: any) {
  if (!img) return FALLBACK_IMAGES[0];
  if (img.image?.startsWith('http') || img.image?.startsWith('/')) return img.image;
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
    <section id="home" className="relative overflow-hidden bg-[#0a1628] text-white border-b border-[#d4af37]/20" aria-label="Hero section — BODAL'S INTERNATIONAL Premium Indian Exports">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div key={currentIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="absolute inset-0">
            <ImageWithFallback src={getImageSrc(images[currentIdx])} alt={`BODAL'S INTERNATIONAL — Premium Indian export goods and logistics, slide ${currentIdx + 1}`} className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>
        
        {/* Layered Overlays for Ultimate Readability & Aesthetics */}
        {/* Dark overlay: heavier on the left for text readability, fading to right to reveal the active photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/90 via-[#0a1628]/65 to-[#0a1628]/35 md:bg-gradient-to-r md:from-[#0a1628]/95 md:via-[#0a1628]/60 md:to-transparent z-10" />
        
        {/* Bottom vertical gradient to blend smoothly into the dark section footer */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/70 to-transparent z-10" />
      </div>

      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.05] z-10" style={{ backgroundImage: "linear-gradient(to right, #d4af37 1px, transparent 1px), linear-gradient(to bottom, #d4af37 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* World map outline svg */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05] z-10" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
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
      <motion.div className="absolute top-20 -left-20 w-[500px] h-[500px] rounded-full blur-3xl z-10" style={{ background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)" }} animate={{ y: [0, 30, 0] }} transition={{ duration: 9, repeat: Infinity }} />
      <motion.div className="absolute bottom-0 -right-20 w-[600px] h-[600px] rounded-full blur-3xl z-10" style={{ background: "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)" }} animate={{ y: [0, -30, 0] }} transition={{ duration: 11, repeat: Infinity }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-24 lg:pb-32 z-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#d4af37]/40 text-[#d4af37] text-xs tracking-[0.2em] uppercase mb-6 bg-[#0a1628]/45 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-pulse" />
              Indian Merchant Export House
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.12 }}
              className="leading-[1.05] tracking-tight mb-6" style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)", fontWeight: 700 }}>
              {heroTitle.includes("INTERNATIONAL") ? (
                <>{heroTitle.split("INTERNATIONAL")[0]}<br /><span className="text-[#d4af37]">INTERNATIONAL</span></>
              ) : heroTitle}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.24 }}
              className="text-white/80 max-w-xl leading-relaxed mb-2 tracking-wide" style={{ fontFamily: "Inter", fontSize: "1.05rem" }}>
              {motto}
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.36 }}
              className="text-white/70 max-w-xl leading-relaxed mb-10" style={{ fontFamily: "Inter" }}>
              {heroSubtitle}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.48 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <button onClick={() => document.getElementById("businesses")?.scrollIntoView({ behavior: "smooth" })} className="group px-6 sm:px-7 py-3 sm:py-3.5 bg-[#d4af37] text-[#0a1628] rounded-full hover:bg-[#e6c356] transition flex items-center justify-center gap-2 text-sm sm:text-base" style={{ fontFamily: "Inter" }}>
                Explore Our Businesses <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
              <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="px-6 sm:px-7 py-3 sm:py-3.5 border border-white/30 rounded-full hover:bg-white/10 transition flex items-center justify-center gap-2 text-sm sm:text-base" style={{ fontFamily: "Inter" }}>
                <Send className="w-4 h-4" /> Send Enquiry
              </button>
            </motion.div>
          </div>

          <div className="hidden lg:flex lg:col-span-4 flex-col items-start lg:items-end justify-end h-full">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.6 }}
              className="relative">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }} className="bg-[#0a1628]/60 backdrop-blur-md text-white p-6 rounded-xl border border-white/10 shadow-2xl max-w-[200px] lg:self-end">
                <div className="text-xs text-white/50 tracking-wide uppercase">Export Reach</div>
                <div className="flex items-end gap-1 mt-1">
                  <span style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700, color: "#d4af37" }}>30+</span>
                  <span className="text-sm text-white/70 mb-1.5">Countries</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mt-12 sm:mt-16 lg:mt-24">
          {TRUST.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.7 + i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
              className="group p-5 rounded-xl bg-[#0a1628]/45 border border-white/10 backdrop-blur hover:bg-white/10 hover:border-[#d4af37]/40 transition">
              <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.9 + i * 0.1 }}
                className="w-10 h-10 rounded-lg bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <t.icon className="w-5 h-5" />
              </motion.div>
              <div className="text-white" style={{ fontFamily: "Inter", fontWeight: 600 }}>{t.label}</div>
              <div className="text-white/50 text-xs mt-0.5">{t.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

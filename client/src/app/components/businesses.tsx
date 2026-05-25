import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, X, Check } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useWebsite } from "../../contexts/WebsiteContext";
import introBg from "@/assets/intro_bg.jpg";

const DEFAULT_IMAGES: Record<string, string> = {
  "Seafood": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=1200&q=80",
  "Textiles": "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&q=80",
  "Fresh Agricultural": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=1200&q=80",
  "Cereals & Grains": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&q=80",
  "Premium Indian Coffee": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&q=80",
};

function ProductImageSlideshow({ product, intervalTime = 3000, className = "" }: { product: any; intervalTime?: number; className?: string }) {
  const images = (() => {
    if (product.images) {
      try {
        const parsed = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((img: string) => `/uploads/${img}`);
        }
      } catch (e) {}
    }
    if (product.image) {
      return [`/uploads/${product.image}`];
    }
    return [DEFAULT_IMAGES[product.category] || "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=1200&q=80"];
  })();

  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % images.length);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [images.length, intervalTime]);

  return (
    <div className={`relative overflow-hidden w-full h-full ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full"
        >
          <ImageWithFallback
            src={images[currentIdx]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
      
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {images.map((_: any, idx: number) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                idx === currentIdx ? "bg-[#d4af37] w-3" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Businesses() {
  const { products } = useWebsite();
  const [open, setOpen] = useState<number | null>(null);

  const items = products.length > 0 ? products : [];
  const active = items.find((p: any) => p.id === open);

  const getBadges = (p: any) => {
    if (!p.badges) return [];
    try { return typeof p.badges === 'string' ? JSON.parse(p.badges) : p.badges; }
    catch { return []; }
  };

  return (
    <section 
      id="businesses" 
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{
        backgroundImage: `url(${introBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Soft white-beige overlay to turn the map into an elegant watermark and keep the product focus */}
      <div className="absolute inset-0 bg-[#fafaf7]/72 backdrop-blur-[1px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="inline-block px-3 py-1 rounded-full bg-[#0a1628]/5 text-[#0a1628] text-xs tracking-[0.2em] uppercase mb-4">Our Portfolio</motion.div>
          <motion.h2 initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[#0a1628] tracking-tight mb-5" style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 700 }}>
            Our Businesses <span className="text-[#d4af37]">& Services</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#717182] leading-relaxed" style={{ fontFamily: "Inter" }}>
            We pride ourselves on offering a diverse and premium portfolio of Indian goods.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p: any, i: number) => (
            <motion.button key={p.id} onClick={() => setOpen(p.id)}
              initial={{ opacity: 0, y: 40, rotate: 1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12, type: "spring", stiffness: 120, damping: 18 }}
              whileHover={{ y: -8 }}
              className="group text-left rounded-2xl overflow-hidden bg-white border border-black/5 hover:border-[#d4af37]/40 hover:shadow-2xl transition-all">
              <div className="relative h-56 overflow-hidden">
                <ProductImageSlideshow product={p} className="group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 via-transparent to-transparent" />
                <motion.div initial={{ opacity: 0, y: -15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.3 + i * 0.12 }}
                  className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-[#d4af37] text-[#0a1628] text-[10px] tracking-[0.15em] uppercase">Export Quality</motion.div>
              </div>
              <div className="p-6">
                <h3 className="text-[#0a1628] mb-2" style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 600 }}>{p.name}</h3>
                <p className="text-sm text-[#717182] leading-relaxed mb-5">{p.short_description}</p>
                <div className="inline-flex items-center gap-1.5 text-[#0a1628] text-sm group-hover:text-[#d4af37] transition" style={{ fontFamily: "Inter", fontWeight: 600 }}>
                  View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {active && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setOpen(null)}>
              <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", damping: 22 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl my-8">
                <button onClick={() => setOpen(null)} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur text-[#0a1628] flex items-center justify-center hover:bg-white shadow-lg">
                  <X className="w-5 h-5" />
                </button>
                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 md:h-auto min-h-[300px]">
                    <ProductImageSlideshow product={active} className="absolute inset-0 w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a1628]/40 to-transparent pointer-events-none" />
                  </div>
                  <div className="p-8 md:p-10">
                    <div className="text-[#d4af37] text-xs tracking-[0.2em] uppercase mb-3">Our Product Portfolio</div>
                    <h3 className="text-[#0a1628] mb-4" style={{ fontFamily: "Playfair Display, serif", fontSize: "1.75rem", fontWeight: 700 }}>{active.name}</h3>
                    <p className="text-[#3a4252] leading-relaxed mb-6" style={{ fontFamily: "Inter" }}>{active.full_description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {getBadges(active).map((b: string) => (
                        <span key={b} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d4af37]/10 text-[#0a1628] text-xs border border-[#d4af37]/30">
                          <Check className="w-3 h-3 text-[#d4af37]" /> {b}
                        </span>
                      ))}
                    </div>
                    <button onClick={() => { setOpen(null); setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 200); }} className="w-full px-5 py-3 bg-[#0a1628] text-white rounded-full hover:bg-[#1e3a8a] transition flex items-center justify-center gap-2">
                      Send Enquiry <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Award, Globe2, Handshake } from "lucide-react";
import { useWebsite } from "../../contexts/WebsiteContext";

const FALLBACK_ABOUT = [
  "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&q=80",
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80",
  "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&q=80",
];

function getImgSrc(img: any) {
  if (!img) return FALLBACK_ABOUT[0];
  if (img.image?.startsWith('http')) return img.image;
  return `/uploads/${img.image}`;
}

export function About() {
  const { settings, aboutImages } = useWebsite();
  const [idx, setIdx] = useState(0);

  const images = aboutImages && aboutImages.length > 0 ? aboutImages : FALLBACK_ABOUT.map(src => ({ image: src }));

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => setIdx(prev => (prev + 1) % images.length), 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const aboutText = settings?.about_us || "";
  const paragraphs = aboutText.split('\n').filter((p: string) => p.trim());

  return (
    <section id="about" className="relative py-24 lg:py-32 overflow-hidden bg-[#fafaf7]">
      <ImageWithFallback src="https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=1600&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.06]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#fafaf7] via-[#fafaf7]/90 to-[#fafaf7]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-[#0a1628]/5 text-[#0a1628] text-xs tracking-[0.2em] uppercase mb-4">About Us</div>
          <h2 className="text-[#0a1628] tracking-tight" style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 700 }}>
            A Reliable Bridge Between<br /><span className="text-[#d4af37]">India & The World</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[520px]">
              <AnimatePresence mode="wait">
                <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0">
                  <ImageWithFallback src={getImgSrc(images[idx])} alt="About Bodal's" className="w-full h-full object-cover" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0a1628]/60 via-transparent to-transparent" />
              {images.length > 1 && (
                <div className="absolute top-4 right-4 flex gap-1.5 z-10">
                  {images.map((_: any, i: number) => (
                    <button key={i} onClick={() => setIdx(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === idx ? "bg-[#d4af37] scale-110" : "bg-white/40 hover:bg-white/70"}`} />
                  ))}
                </div>
              )}
            </div>
            <div className="absolute -bottom-6 -right-6 bg-[#0a1628] text-white p-6 rounded-xl shadow-xl max-w-[240px] hidden sm:block">
              <div className="text-[#d4af37] text-xs tracking-[0.2em] uppercase mb-2">Promise-Led</div>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem" }}>"Our word is our strongest contract."</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div className="space-y-5 text-[#3a4252] leading-relaxed" style={{ fontFamily: "Inter" }}>
              {paragraphs.length > 0 ? paragraphs.map((p: string, i: number) => (
                <p key={i}>{p}</p>
              )) : (
                <>
                  <p>At <span className="text-[#0a1628]" style={{ fontWeight: 600 }}>BODAL'S INTERNATIONAL</span>, we are a dynamic and forward-thinking merchant export house dedicated to bringing the finest Indian products to the global market.</p>
                  <p>Our core values are built on traditional principles of trust, transparency, and unwavering commitment to quality.</p>
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t border-black/10">
              {[
                { icon: Award, label: "Quality First", num: "100%" },
                { icon: Globe2, label: "Global Reach", num: "30+" },
                { icon: Handshake, label: "Partnerships", num: "200+" },
              ].map((s, i) => (
                <div key={i}>
                  <s.icon className="w-5 h-5 text-[#d4af37] mb-2" />
                  <div className="text-[#0a1628]" style={{ fontFamily: "Playfair Display, serif", fontSize: "1.75rem", fontWeight: 700 }}>{s.num}</div>
                  <div className="text-xs text-[#717182] tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

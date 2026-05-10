import { motion } from "motion/react";
import {
  Sprout, ShieldCheck, Search, Globe2, Tag, Package,
  ShoppingBag, Truck, Eye, ScanSearch, Headphones, HeartHandshake,
} from "lucide-react";
import { useWebsite } from "../../contexts/WebsiteContext";

const ICON_MAP: Record<string, any> = {
  Sprout, ShieldCheck, Search, Globe2, Tag, Package,
  ShoppingBag, Truck, Eye, ScanSearch, Headphones, HeartHandshake,
};

export function Speciality() {
  const { specialities } = useWebsite();

  const items = specialities.length > 0
    ? specialities.map(s => ({ icon: ICON_MAP[s.icon] || Sprout, title: s.title, desc: s.description }))
    : [
        { icon: Sprout, title: "Direct Sourcing", desc: "Straight from trusted Indian producers." },
        { icon: ShieldCheck, title: "Quality Guaranteed", desc: "Every batch meets export-grade standards." },
      ];

  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-[#0a1628]/5 text-[#0a1628] text-xs tracking-[0.2em] uppercase mb-4">Our Speciality</div>
          <h2 className="text-[#0a1628] tracking-tight mb-4" style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 700 }}>
            What Makes Us <span className="text-[#d4af37]">Different</span>
          </h2>
          <p className="text-[#717182]" style={{ fontFamily: "Inter" }}>
            Twelve principles that define how we work — from the farm gate to your destination port.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.04 }} whileHover={{ y: -6 }} className="group relative p-6 rounded-xl bg-white border border-black/5 hover:border-[#d4af37]/40 hover:shadow-xl transition-all">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#d4af37] to-[#d4af37]/0 rounded-t-xl scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0a1628] to-[#1e3a8a] text-[#d4af37] flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <item.icon className="w-5 h-5" />
              </div>
              <div className="text-[#0a1628] mb-1.5" style={{ fontFamily: "Inter", fontWeight: 600 }}>{item.title}</div>
              <div className="text-sm text-[#717182] leading-relaxed">{item.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

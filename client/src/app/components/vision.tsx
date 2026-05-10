import { motion } from "motion/react";
import { Heart, ShieldCheck, Network, Eye, Compass, Sparkles } from "lucide-react";
import { useWebsite } from "../../contexts/WebsiteContext";

const ICON_MAP: Record<string, any> = { Heart, ShieldCheck, Network, Eye, Compass, Sparkles };

export function Vision() {
  const { settings, coreValues } = useWebsite();

  const visionText = settings?.vision || "To be the world's most trusted gateway for Indian excellence...";
  const purposeText = settings?.purpose || "Our purpose is to bridge the distance between India's rich resources...";

  const values = coreValues.length > 0
    ? coreValues.map(v => ({ icon: ICON_MAP[v.icon] || Heart, title: v.title, sub: v.subtitle, desc: v.description }))
    : [
        { icon: Heart, title: "We Care", sub: "Product Integrity", desc: "We believe that quality begins with respect for the origin." },
        { icon: ShieldCheck, title: "We Commit", sub: "Reliability & Ethics", desc: "We believe that our word is our strongest contract." },
        { icon: Network, title: "We Connect", sub: "Communication & Partnership", desc: "We believe that trade is built on human relationships." },
      ];

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-[#0a1628] to-[#0d1b35] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(to right, #d4af37 1px, transparent 1px), linear-gradient(to bottom, #d4af37 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full border border-[#d4af37]/40 text-[#d4af37] text-xs tracking-[0.2em] uppercase mb-4">Philosophy</div>
          <h2 className="tracking-tight" style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 700 }}>
            Our Vision, Purpose <span className="text-[#d4af37]">& Values</span>
          </h2>
        </motion.div>

        {/* Vision & Purpose */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {[
            { icon: Eye, label: "Our Vision", text: visionText },
            { icon: Compass, label: "Our Purpose", text: purposeText },
          ].map((card, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.15 }} className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:border-[#d4af37]/40 transition">
              <div className="w-12 h-12 rounded-lg bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center mb-5">
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="mb-3 text-[#d4af37]" style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 700 }}>{card.label}</h3>
              <p className="text-white/75 leading-relaxed" style={{ fontFamily: "Inter" }}>{card.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Core values */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[#d4af37] text-xs tracking-[0.3em] uppercase">
            <Sparkles className="w-4 h-4" /> Our Core Values
          </div>
          <p className="mt-4 max-w-2xl mx-auto text-white/70" style={{ fontFamily: "Inter" }}>
            Our values are the heartbeat of our operations, perfectly captured in our motto:
            <span className="block mt-2 text-white" style={{ fontFamily: "Playfair Display, serif", fontSize: "1.35rem" }}>
              "{settings?.motto || 'We Care. We Commit. We Connect.'}"
            </span>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }} whileHover={{ y: -8 }} className="relative p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-[#d4af37]/50 group overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#d4af37]/10 blur-2xl group-hover:bg-[#d4af37]/20 transition" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-[#d4af37] text-[#0a1628] flex items-center justify-center mb-5">
                  <v.icon className="w-7 h-7" />
                </div>
                <h3 className="text-white mb-1" style={{ fontFamily: "Playfair Display, serif", fontSize: "1.75rem", fontWeight: 700 }}>{v.title}</h3>
                <div className="text-[#d4af37] text-sm tracking-wide mb-4">{v.sub}</div>
                <p className="text-white/70 leading-relaxed" style={{ fontFamily: "Inter" }}>{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

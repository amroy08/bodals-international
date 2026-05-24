import { motion } from "motion/react";
import { FileText, Eye, ShieldCheck } from "lucide-react";
import { useWebsite } from "../../contexts/WebsiteContext";

export function Certifications() {
  const { certifications } = useWebsite();

  const certs = certifications.length > 0 ? certifications : [];

  const handleView = (cert: any) => {
    if (cert.document) {
      window.open(`/uploads/${cert.document}`, '_blank');
    }
  };



  return (
    <section className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-3 py-1 rounded-full bg-[#0a1628]/5 text-[#0a1628] text-xs tracking-[0.2em] uppercase mb-4"
          >
            Trust & Compliance
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[#0a1628] tracking-tight mb-4"
            style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 700 }}
          >
            Our <span className="text-[#d4af37]">Certifications</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#717182]"
            style={{ fontFamily: "Inter" }}
          >
            Every export we ship is backed by globally recognized credentials.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certs.map((c: any, i: number) => (
            <motion.div
              key={c.id}
              initial={{
                opacity: 0,
                x: i % 2 === 0 ? -50 : 50,
                y: 30
              }}
              whileInView={{
                opacity: 1,
                x: 0,
                y: 0
              }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, type: "spring", stiffness: 90, damping: 15 }}
              whileHover={{ y: -8 }}
              className="group relative p-6 rounded-xl bg-gradient-to-br from-white to-[#fafaf7] border border-black/5 hover:border-[#d4af37]/40 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-5">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 + 0.2 }}
                  className="w-14 h-16 rounded-md bg-gradient-to-br from-[#0a1628] to-[#1e3a8a] flex items-center justify-center text-[#d4af37] shadow-md"
                >
                  <FileText className="w-6 h-6" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, damping: 12, delay: i * 0.1 + 0.4 }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  <ShieldCheck className="w-3 h-3" /> Verified
                </motion.div>
              </div>
              <div className="text-[#0a1628] mb-1" style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 700 }}>{c.name}</div>
              <div className="text-sm text-[#717182] mb-5">{c.full_name || c.description}</div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
                className="flex justify-center mt-2"
              >
                <button onClick={() => handleView(c)} className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#0a1628]/10 bg-white text-[#0a1628] font-medium text-sm hover:bg-[#0a1628] hover:text-white hover:border-[#0a1628] shadow-sm hover:shadow transition-all duration-300">
                  <Eye className="w-4 h-4" /> View Certificate
                </button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

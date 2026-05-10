import { motion } from "motion/react";
import { FileText, Download, Eye, ShieldCheck } from "lucide-react";
import { useWebsite } from "../../contexts/WebsiteContext";

export function Certifications() {
  const { certifications } = useWebsite();

  const certs = certifications.length > 0 ? certifications : [];

  const handleView = (cert: any) => {
    if (cert.document) {
      window.open(`/uploads/${cert.document}`, '_blank');
    }
  };

  const handleDownload = (cert: any) => {
    if (cert.document) {
      const link = document.createElement('a');
      link.href = `/uploads/${cert.document}`;
      link.download = `${cert.name}-certificate`;
      link.click();
    }
  };

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-[#0a1628]/5 text-[#0a1628] text-xs tracking-[0.2em] uppercase mb-4">Trust & Compliance</div>
          <h2 className="text-[#0a1628] tracking-tight mb-4" style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 700 }}>
            Our <span className="text-[#d4af37]">Certifications</span>
          </h2>
          <p className="text-[#717182]" style={{ fontFamily: "Inter" }}>Every export we ship is backed by globally recognized credentials.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certs.map((c: any, i: number) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }} className="group relative p-6 rounded-xl bg-gradient-to-br from-white to-[#fafaf7] border border-black/5 hover:border-[#d4af37]/40 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-16 rounded-md bg-gradient-to-br from-[#0a1628] to-[#1e3a8a] flex items-center justify-center text-[#d4af37] shadow-md">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </div>
              </div>
              <div className="text-[#0a1628] mb-1" style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 700 }}>{c.name}</div>
              <div className="text-sm text-[#717182] mb-5">{c.full_name || c.description}</div>
              <div className="flex gap-2">
                <button onClick={() => handleView(c)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-black/10 text-[#0a1628] text-sm hover:bg-[#0a1628] hover:text-white transition">
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button onClick={() => handleDownload(c)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#0a1628] text-white text-sm hover:bg-[#1e3a8a] transition">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

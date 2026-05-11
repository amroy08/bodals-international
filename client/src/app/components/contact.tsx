import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Mail, MapPin, Linkedin, Instagram, Facebook, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { useWebsite } from "../../contexts/WebsiteContext";
import { enquiryApi } from "../../api/enquiryApi";
import toast from "react-hot-toast";

export function Contact() {
  const { settings } = useWebsite();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", position: "", company: "", email: "", mobile: "", city_country: "", message: "",
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleChange = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: false }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const required = ["name", "email", "mobile", "message"];
    const newErr: Record<string, boolean> = {};
    required.forEach((k) => {
      if (!form[k as keyof typeof form]) newErr[k] = true;
    });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErr.email = true;
    setErrors(newErr);

    if (Object.keys(newErr).length > 0) return;

    setLoading(true);
    try {
      const res = await enquiryApi.submit(form);
      const data = res.data;
      setSubmitted(true);
      setForm({ name: "", position: "", company: "", email: "", mobile: "", city_country: "", message: "" });

      if (data.data?.emailSent === false) {
        toast.success("Your enquiry was saved, but email notification failed. Our team can still view your enquiry.", { duration: 5000 });
      } else {
        toast.success(data.message || "Thank you for your enquiry. Our team will contact you shortly.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const phone = settings?.mobile || "+91 9082377097";
  const email = settings?.email || "b.manish95@gmail.com";
  const address = settings?.address || "Mumbai, Maharashtra, India";

  return (
    <section id="contact" className="py-24 lg:py-32 bg-gradient-to-b from-[#fafaf7] to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-[#0a1628]/5 text-[#0a1628] text-xs tracking-[0.2em] uppercase mb-4">Get In Touch</div>
          <h2 className="text-[#0a1628] tracking-tight mb-4" style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 700 }}>
            Contact <span className="text-[#d4af37]">/ Enquiry</span>
          </h2>
          <p className="text-[#717182]" style={{ fontFamily: "Inter" }}>Tell us what you need — our team will reach out within one business day.</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Info card */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-2 p-8 rounded-2xl bg-gradient-to-br from-[#0a1628] to-[#1e3a8a] text-white relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#d4af37]/10 blur-3xl" />
            <div className="relative">
              <h3 className="mb-2" style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 700 }}>Reach Our Team</h3>
              <p className="text-white/70 text-sm mb-8" style={{ fontFamily: "Inter" }}>We respond to every enquiry personally.</p>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center flex-shrink-0"><Phone className="w-4 h-4" /></div>
                  <div>
                    <div className="text-xs text-white/50 tracking-wide uppercase mb-0.5">Mobile</div>
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-[#d4af37] transition">{phone}</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center flex-shrink-0"><Mail className="w-4 h-4" /></div>
                  <div>
                    <div className="text-xs text-white/50 tracking-wide uppercase mb-0.5">Email</div>
                    <a href={`mailto:${email}`} className="hover:text-[#d4af37] transition break-all">{email}</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center flex-shrink-0"><MapPin className="w-4 h-4" /></div>
                  <div>
                    <div className="text-xs text-white/50 tracking-wide uppercase mb-0.5">Address</div>
                    <div className="text-white/80 text-sm">{address}</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="text-xs text-white/50 tracking-[0.2em] uppercase mb-3">Follow Us</div>
                <div className="flex gap-2">
                  {[
                    { Icon: Linkedin, url: settings?.linkedin_url },
                    { Icon: Instagram, url: settings?.instagram_url },
                    { Icon: Facebook, url: settings?.facebook_url },
                    { Icon: MessageCircle, url: settings?.whatsapp_url },
                  ].map(({ Icon, url }, i) => (
                    <a key={i} href={url || "#"} target={url ? "_blank" : undefined} rel="noreferrer" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-[#d4af37] hover:text-[#0a1628] flex items-center justify-center transition">
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-3 p-8 rounded-2xl bg-white border border-black/5 shadow-lg">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle2 className="w-10 h-10" /></div>
                  <h3 className="text-[#0a1628] mb-3" style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 700 }}>Thank you for your enquiry.</h3>
                  <p className="text-[#717182] max-w-sm mx-auto">Our team will contact you shortly.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: "", position: "", company: "", email: "", mobile: "", city_country: "", message: "" }); }} className="mt-8 px-5 py-2.5 rounded-full border border-black/10 text-[#0a1628] hover:bg-[#0a1628] hover:text-white transition">Send Another</button>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={submit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Name *" value={form.name} onChange={handleChange("name")} error={errors.name} />
                    <Field label="Your Position" value={form.position} onChange={handleChange("position")} />
                    <Field label="Company" value={form.company} onChange={handleChange("company")} />
                    <Field label="Email *" type="email" value={form.email} onChange={handleChange("email")} error={errors.email} />
                    <Field label="Mobile Number *" value={form.mobile} onChange={handleChange("mobile")} error={errors.mobile} />
                    <Field label="City, Country" value={form.city_country} onChange={handleChange("city_country")} />
                  </div>
                  <div>
                    <label className="block text-sm text-[#0a1628] mb-1.5" style={{ fontFamily: "Inter", fontWeight: 500 }}>Message *</label>
                    <textarea value={form.message} onChange={handleChange("message")} rows={4} className={`w-full px-4 py-3 rounded-lg bg-[#fafaf7] border focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 focus:bg-white transition ${errors.message ? "border-red-400" : "border-black/10"}`} placeholder="Tell us about your requirements, target volumes, destination..." />
                  </div>
                  <button type="submit" disabled={loading} className="w-full px-6 py-3.5 bg-[#0a1628] text-white rounded-full hover:bg-[#1e3a8a] transition flex items-center justify-center gap-2 group disabled:opacity-60" style={{ fontFamily: "Inter" }}>
                    {loading ? "Submitting..." : "Send Enquiry"} {!loading && <Send className="w-4 h-4 group-hover:translate-x-1 transition" />}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, error, type = "text" }: any) {
  return (
    <div>
      <label className="block text-sm text-[#0a1628] mb-1.5" style={{ fontFamily: "Inter", fontWeight: 500 }}>{label}</label>
      <input type={type} value={value} onChange={onChange} className={`w-full px-4 py-3 rounded-lg bg-[#fafaf7] border focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 focus:bg-white transition ${error ? "border-red-400" : "border-black/10"}`} />
    </div>
  );
}

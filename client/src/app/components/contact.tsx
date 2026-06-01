import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Mail, MapPin, Linkedin, Instagram, Facebook, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { useWebsite } from "../../contexts/WebsiteContext";
import { enquiryApi } from "../../api/enquiryApi";
import toast from "react-hot-toast";
import defaultLogo from "@/assets/logo_white.png";

export function Contact() {
  const { settings } = useWebsite();
  const logoUrl = settings?.logo ? `/uploads/${settings.logo}` : defaultLogo;
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", position: "", company: "", email: "", mobile: "", city_country: "", message: "",
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [popup, setPopup] = useState<{ field: string; message: string } | null>(null);
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerWarning = (field: string, message: string) => {
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    setPopup({ field, message });
    warningTimeoutRef.current = setTimeout(() => {
      setPopup(null);
    }, 2500);
  };

  const handleChange = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;

    if (k === "name") {
      if (/\d/.test(val)) {
        triggerWarning("name", "Cannot add number in Name");
        return;
      }
    }



    if (k === "mobile") {
      const isValid = /^\+?\d*$/.test(val);
      if (!isValid) {
        triggerWarning("mobile", "Mobile number must be numeric");
        return;
      }
    }

    if (k === "position") {
      if (/\d/.test(val)) {
        triggerWarning("position", "Position cannot contain numbers");
        return;
      }
    }

    if (k === "city_country") {
      if (/\d/.test(val)) {
        triggerWarning("city_country", "City/Country cannot contain numbers");
        return;
      }
    }

    setForm((f) => ({ ...f, [k]: val }));
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
  const email = settings?.email || "manishbodal@bodalsint.com";
  const address = settings?.address || "Mumbai, Maharashtra, India";

  return (
    <section id="contact" className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-[#fafaf7] to-white relative overflow-hidden" aria-label="Contact us and send enquiry">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-3 py-1 rounded-full bg-[#0a1628]/5 text-[#0a1628] text-xs tracking-[0.2em] uppercase mb-4"
          >
            Get In Touch
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[#0a1628] tracking-tight mb-4"
            style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 700 }}
          >
            Contact <span className="text-[#d4af37]">/ Enquiry</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#717182]"
            style={{ fontFamily: "Inter" }}
          >
            Tell us what you need — our team will reach out within one business day.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, x: -45, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", stiffness: 80, damping: 15 }}
            className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0a1628] to-[#1e3a8a] text-white relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#d4af37]/10 blur-3xl" />
            <div className="relative">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-2"
                style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 700 }}
              >
                Reach Our Team
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-white/70 text-sm mb-8"
                style={{ fontFamily: "Inter" }}
              >
                We respond to every enquiry personally.
              </motion.p>

              <div className="space-y-5">
                {[
                  { Icon: Phone, label: "Mobile", value: phone, href: `tel:${phone.replace(/\s/g, '')}` },
                  { Icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
                  { Icon: MapPin, label: "Address", value: address, isAddress: true },
                ].map(({ Icon, label, value, href, isAddress }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-white/50 tracking-wide uppercase mb-0.5">{label}</div>
                      {isAddress ? (
                        <div className="text-white/80 text-sm">{value}</div>
                      ) : (
                        <a href={href} className="hover:text-[#d4af37] transition break-all text-sm sm:text-base">{value}</a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Logo added below the address and above Follow Us */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="mt-8 pt-8 border-t border-white/10"
              >
                <img 
                  src={logoUrl} 
                  alt="Bodal's International Logo" 
                  className="h-14 w-auto object-contain opacity-90 hover:opacity-100 transition" 
                  onError={(e) => { e.currentTarget.src = defaultLogo; }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-6"
              >
                <div className="text-xs text-white/50 tracking-[0.2em] uppercase mb-3">Follow Us</div>
                <div className="flex gap-2">
                  {[
                    { Icon: Linkedin, url: settings?.linkedin_url },
                    { Icon: Instagram, url: settings?.instagram_url },
                    { Icon: Facebook, url: settings?.facebook_url },
                    { Icon: MessageCircle, url: settings?.whatsapp_url },
                  ].map(({ Icon, url }, i) => (
                    <motion.a
                      key={i}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.6 + i * 0.1 }}
                      whileHover={{ scale: 1.15, backgroundColor: "#d4af37", color: "#0a1628" }}
                      href={url || "#"}
                      target={url ? "_blank" : undefined}
                      rel="noreferrer"
                      className="w-10 h-10 rounded-lg bg-white/5 text-white flex items-center justify-center transition"
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", stiffness: 80, damping: 15 }}
            className="lg:col-span-3 p-5 sm:p-8 rounded-2xl bg-white border border-black/5 shadow-lg"
          >
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
                    {[
                      { label: "Name *", name: "name", value: form.name, key: "name" },
                      { label: "Your Position", name: "position", value: form.position, key: "position" },
                      { label: "Company", name: "company", value: form.company, key: "company" },
                      { label: "Email *", name: "email", type: "email", value: form.email, key: "email" },
                      { label: "Mobile Number *", name: "mobile", value: form.mobile, key: "mobile" },
                      { label: "City, Country", name: "city_country", value: form.city_country, key: "city_country" },
                    ].map((field, idx) => (
                      <motion.div
                        key={field.key}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.08 + 0.1 }}
                      >
                        <Field
                          label={field.label}
                          name={field.name}
                          type={field.type}
                          value={field.value}
                          onChange={handleChange(field.key)}
                          error={errors[field.key]}
                          popup={popup}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <label className="block text-sm text-[#0a1628] mb-1.5" style={{ fontFamily: "Inter", fontWeight: 500 }}>Message *</label>
                    <textarea value={form.message} onChange={handleChange("message")} rows={4} className={`w-full px-4 py-3 rounded-lg bg-[#fafaf7] border focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 focus:bg-white transition ${errors.message ? "border-red-400" : "border-black/10"}`} placeholder="Tell us about your requirements, target volumes, destination..." />
                  </motion.div>
                  <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.7, type: "spring", stiffness: 100, damping: 12 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3.5 bg-[#0a1628] text-white rounded-full hover:bg-[#1e3a8a] transition flex items-center justify-center gap-2 group disabled:opacity-60"
                    style={{ fontFamily: "Inter" }}
                  >
                    {loading ? "Submitting..." : "Send Enquiry"} {!loading && <Send className="w-4 h-4 group-hover:translate-x-1 transition" />}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, value, onChange, error, type = "text", popup }: any) {
  return (
    <div>
      <label className="block text-sm text-[#0a1628] mb-1.5" style={{ fontFamily: "Inter", fontWeight: 500 }}>{label}</label>
      <div className="relative">
        <AnimatePresence>
          {popup && popup.field === name && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              className="absolute z-10 bottom-full mb-2 left-3 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-semibold shadow-lg flex items-center gap-1.5 pointer-events-none"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {popup.message}
              <div className="absolute top-full left-4 -mt-1 w-2 h-2 rotate-45 bg-rose-600" />
            </motion.div>
          )}
        </AnimatePresence>
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-lg bg-[#fafaf7] border focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 focus:bg-white transition ${
            error ? "border-red-400" : popup && popup.field === name ? "border-red-400 ring-2 ring-red-400/20" : "border-black/10"
          }`}
        />
      </div>
    </div>
  );
}


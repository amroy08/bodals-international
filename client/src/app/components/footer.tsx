import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Mail, MapPin, Linkedin, Instagram, Facebook, MessageCircle, X } from "lucide-react";
import { useWebsite } from "../../contexts/WebsiteContext";

export function Footer() {
  const { settings, products, setActiveProductId } = useWebsite();
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const phone = settings?.mobile || "+91 9082377097";
  const email = settings?.email || "manishbodal@bodalsint.com";
  const address = settings?.address || "Mumbai, Maharashtra, India";
  const motto = settings?.motto || "We Care · We Commit · We Connect";
  const footerText = settings?.footer_text || "Premium Indian merchant export house — connecting authentic producers with international buyers.";
  const productNames = products.length > 0 ? products.map((p: any) => p.name) : ["Seafood", "Textiles", "Fresh Agricultural", "Cereals & Grains", "Premium Indian Coffee"];

  const handleProductClick = (name: string) => {
    const prod = products.find((p: any) => p.name === name);
    if (prod) {
      setActiveProductId(prod.id);
    }
    document.getElementById("businesses")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#08111f] text-white/70 pt-14 sm:pt-20 pb-6 sm:pb-8 relative overflow-hidden" role="contentinfo" aria-label="Footer">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-14">
          
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0 }}
          >
            <div className="flex flex-col items-start gap-4 mb-5">
              <img 
                src="/favicon.png" 
                alt="Bodal's International Icon" 
                className="h-14 w-14 object-contain" 
              />
              <div className="text-white text-sm tracking-widest uppercase font-bold" style={{ fontFamily: "Inter, sans-serif" }}>
                BODAL'S INTERNATIONAL
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ fontFamily: "Inter" }}>{footerText}</p>
            <div className="text-[#d4af37] tracking-[0.2em] text-xs uppercase">{motto.replace(/,/g, ' ·')}</div>
          </motion.div>

          <nav
            aria-label="Quick links"
          >
            <div className="text-white mb-4 tracking-wide" style={{ fontFamily: "Inter", fontWeight: 600 }}>Quick Links</div>
            <ul className="space-y-2 text-sm">
              {["Home", "About Us", "Businesses", "Contact"].map((l) => (
                <li key={l}>
                  <button onClick={() => document.getElementById(l.toLowerCase().replace(" us", "").replace(" ", ""))?.scrollIntoView({ behavior: "smooth" })} className="hover:text-[#d4af37] transition">{l}</button>
                </li>
              ))}
            </ul>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-white mb-4 tracking-wide" style={{ fontFamily: "Inter", fontWeight: 600 }}>Products</div>
            <ul className="space-y-2 text-sm">
              {productNames.map((p: string) => (
                <li key={p}>
                  <button onClick={() => handleProductClick(p)} className="hover:text-[#d4af37] transition text-left cursor-pointer">{p}</button>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <div className="text-white mb-4 tracking-wide" style={{ fontFamily: "Inter", fontWeight: 600 }}>Contact</div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-[#d4af37] flex-shrink-0" />
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-[#d4af37] transition">{phone}</a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-[#d4af37] flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-[#d4af37] transition break-all">{email}</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-[#d4af37] flex-shrink-0" />
                <span>{address}</span>
              </li>
            </ul>
            <div className="flex gap-2 mt-5">
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
                  whileHover={{ scale: 1.15 }}
                  href={url || "#"}
                  target={url ? "_blank" : undefined}
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#d4af37] hover:text-[#0a1628] flex items-center justify-center transition"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50"
        >
          <div>© {new Date().getFullYear()} {settings?.company_name || "BODAL'S INTERNATIONAL"} Pvt. Ltd. All rights reserved.</div>
          <div className="flex gap-5">
            <button onClick={() => setShowPrivacy(true)} className="hover:text-[#d4af37] transition cursor-pointer">Privacy Policy</button>
            <button onClick={() => setShowTerms(true)} className="hover:text-[#d4af37] transition cursor-pointer">Terms of Service</button>
          </div>
        </motion.div>
      </div>

      {/* Portals for Modals */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {showPrivacy && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPrivacy(false)}>
              <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: "spring", damping: 25 }} onClick={e => e.stopPropagation()} className="relative w-full max-w-2xl bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">
                <button onClick={() => setShowPrivacy(false)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#0a1628]/5 text-[#0a1628] flex items-center justify-center hover:bg-[#0a1628]/10 transition"><X className="w-4 h-4" /></button>
                <h3 className="text-[#0a1628] mb-2 text-xl font-bold tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>Privacy Policy</h3>
                <p className="text-xs text-[#717182] mb-6">Last Updated: June 2, 2026</p>
                <div className="space-y-6 text-[#3a4252] text-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-2" style={{ fontFamily: "Inter" }}>
                  <section>
                    <h4 className="text-[#0a1628] font-semibold mb-2 text-base">1. Introduction</h4>
                    <p>Welcome to <strong>BODAL'S INTERNATIONAL</strong> ("we", "us", "our"). We are committed to protecting your personal data and your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website <a href="https://bodalsint.com" className="text-[#d4af37] font-medium underline">bodalsint.com</a> and use our B2B trade services.</p>
                  </section>
                  <section>
                    <h4 className="text-[#0a1628] font-semibold mb-2 text-base">2. Information We Collect</h4>
                    <p>We may collect information about you in a variety of ways:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li><strong>Enquiry & Form Data</strong>: When you submit an enquiry on our site, we collect your Name, Corporate Email Address, Phone/WhatsApp Number, Company Name, and the specific details of your trade requirement.</li>
                      <li><strong>Technical & Geolocation Data</strong>: For security and market traffic analysis, our analytics suite automatically tracks your IP address, Country of origin, City, Browser type, and Device type when you navigate our site.</li>
                    </ul>
                  </section>
                  <section>
                    <h4 className="text-[#0a1628] font-semibold mb-2 text-base">3. How We Use Your Information</h4>
                    <p>We use your information to operate, maintain, and improve our services, including:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Responding directly to your B2B trade enquiries, coordinating pricing, and providing product documentation.</li>
                      <li>Analyzing global visitor geolocation trends to understand which international markets are showing demand for specific Indian exports (e.g. Seafood, Grains, Textiles).</li>
                      <li>Preventing fraudulent activities and ensuring the security of our website and services.</li>
                    </ul>
                  </section>
                  <section>
                    <h4 className="text-[#0a1628] font-semibold mb-2 text-base">4. Information Sharing & Disclosure</h4>
                    <p>We do not sell, rent, or trade your personal information. We only share relevant details with:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li><strong>Logistics & Shipping Partners</strong>: Verified freight forwarders, shipping lines, and customs clearing agents to coordinate transport and custom clearance for your orders.</li>
                      <li><strong>Financial Institutions</strong>: Banking partners for processing Letters of Credit (L/C) and wire transfers.</li>
                      <li><strong>Legal Requirements</strong>: When required by applicable Indian or international trade laws to comply with regulatory authorities.</li>
                    </ul>
                  </section>
                  <section>
                    <h4 className="text-[#0a1628] font-semibold mb-2 text-base">5. Data Security & Retention</h4>
                    <p>We employ robust electronic and administrative security measures to protect your data from unauthorized access or alteration. We retain your contact information only as long as necessary to facilitate your business relationship with us.</p>
                  </section>
                  <section>
                    <h4 className="text-[#0a1628] font-semibold mb-2 text-base">6. Contact Us</h4>
                    <p>For any questions or data access requests regarding this Privacy Policy, please contact us at:</p>
                    <p className="mt-2 font-medium text-[#0a1628]">Email: <a href="mailto:info@bodalsint.com" className="text-[#d4af37] underline">info@bodalsint.com</a> / <a href="mailto:manishbodal@bodalsint.com" className="text-[#d4af37] underline">manishbodal@bodalsint.com</a></p>
                  </section>
                </div>
              </motion.div>
            </motion.div>
          )}

          {showTerms && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowTerms(false)}>
              <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: "spring", damping: 25 }} onClick={e => e.stopPropagation()} className="relative w-full max-w-2xl bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">
                <button onClick={() => setShowTerms(false)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#0a1628]/5 text-[#0a1628] flex items-center justify-center hover:bg-[#0a1628]/10 transition"><X className="w-4 h-4" /></button>
                <h3 className="text-[#0a1628] mb-2 text-xl font-bold tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>Terms of Service</h3>
                <p className="text-xs text-[#717182] mb-6">Last Updated: June 2, 2026</p>
                <div className="space-y-6 text-[#3a4252] text-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-2" style={{ fontFamily: "Inter" }}>
                  <section>
                    <h4 className="text-[#0a1628] font-semibold mb-2 text-base">1. Acceptance of Terms</h4>
                    <p>By accessing and browsing <a href="https://bodalsint.com" className="text-[#d4af37] font-medium underline">bodalsint.com</a>, you agree to comply with and be bound by these Terms of Service. If you do not agree, please refrain from using our website.</p>
                  </section>
                  <section>
                    <h4 className="text-[#0a1628] font-semibold mb-2 text-base">2. B2B Enquiries & Non-Binding Nature</h4>
                    <p>Any product inquiry, pricing requests, or specifications sent through this website are strictly for informational and negotiation purposes. Submitting an enquiry does <strong>not</strong> constitute a binding purchase order or sales contract. All official transactions, shipping terms (FOB, CIF, CFR), and payments must be formally agreed upon via signed <strong>Proforma Invoices, Sales Contracts, and verified Letters of Credit (L/C)</strong>.</p>
                  </section>
                  <section>
                    <h4 className="text-[#0a1628] font-semibold mb-2 text-base">3. Product Descriptions & Visual representation</h4>
                    <p>We strive to display high-quality visual representation of our products (such as Seafood, Grains, Coffee, and Textiles). However, agricultural and ocean-harvested commodities vary in specifications, sizes, counts, and packaging depending on seasonal availability and market fluctuations. Final product specifications must be directly verified during commercial negotiation.</p>
                  </section>
                  <section>
                    <h4 className="text-[#0a1628] font-semibold mb-2 text-base">4. Limitation of Liability</h4>
                    <p>Bodal's International Pvt. Ltd. is a registered merchant export house. We work with verified producers and logistics lines. We shall not be held liable for shipment delays arising from third-party shipping lines, port congestion, customs clearance delays, customs inspections, or Force Majeure events (natural disasters, strikes, wars, disruptions).</p>
                  </section>
                  <section>
                    <h4 className="text-[#0a1628] font-semibold mb-2 text-base">5. Intellectual Property</h4>
                    <p>All content on this website, including but not limited to the Bodal's International logo, custom text layouts, product images, graphics, and source code, is the property of Bodal's International and is protected by copyright and intellectual property laws of India. Any unauthorized reproduction is strictly prohibited.</p>
                  </section>
                  <section>
                    <h4 className="text-[#0a1628] font-semibold mb-2 text-base">6. Governing Law & Dispute Resolution</h4>
                    <p>These Terms of Service and any commercial relationships resulting from website contact shall be governed by and construed in accordance with the laws of <strong>India</strong>. Any disputes shall be subject to the exclusive jurisdiction of the competent courts in <strong>Mumbai, Maharashtra, India</strong>.</p>
                  </section>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </footer>
  );
}

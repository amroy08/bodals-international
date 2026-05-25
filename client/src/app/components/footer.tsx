import { motion } from "motion/react";
import { Phone, Mail, MapPin, Linkedin, Instagram, Facebook, MessageCircle } from "lucide-react";
import { useWebsite } from "../../contexts/WebsiteContext";
import defaultLogo from "@/assets/logo_white.png";

export function Footer() {
  const { settings, products } = useWebsite();

  const phone = settings?.mobile || "+91 9082377097";
  const email = settings?.email || "b.manish95@gmail.com";
  const address = settings?.address || "Mumbai, Maharashtra, India";
  const motto = settings?.motto || "We Care · We Commit · We Connect";
  const footerText = settings?.footer_text || "Premium Indian merchant export house — connecting authentic producers with international buyers.";
  const productNames = products.length > 0 ? products.map((p: any) => p.name) : ["Seafood", "Textiles", "Fresh Agricultural", "Cereals & Grains", "Premium Indian Coffee"];

  const logoUrl = settings?.logo ? `/uploads/${settings.logo}` : defaultLogo;

  return (
    <footer className="bg-[#08111f] text-white/70 pt-20 pb-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <img 
                src={logoUrl} 
                alt="Bodal's International Logo - Indian Merchant Exporter" 
                className="h-12 w-auto object-contain transition-all" 
              />
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ fontFamily: "Inter" }}>{footerText}</p>
            <div className="text-[#d4af37] tracking-[0.2em] text-xs uppercase">{motto.replace(/,/g, ' ·')}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="text-white mb-4 tracking-wide" style={{ fontFamily: "Inter", fontWeight: 600 }}>Quick Links</div>
            <ul className="space-y-2 text-sm">
              {["Home", "About Us", "Businesses", "Contact"].map((l) => (
                <li key={l}>
                  <button onClick={() => document.getElementById(l.toLowerCase().replace(" us", "").replace(" ", ""))?.scrollIntoView({ behavior: "smooth" })} className="hover:text-[#d4af37] transition">{l}</button>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-white mb-4 tracking-wide" style={{ fontFamily: "Inter", fontWeight: 600 }}>Products</div>
            <ul className="space-y-2 text-sm">
              {productNames.map((p: string) => (
                <li key={p} className="hover:text-[#d4af37] transition cursor-pointer">{p}</li>
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
            <a href="#" className="hover:text-[#d4af37]">Privacy Policy</a>
            <a href="#" className="hover:text-[#d4af37]">Terms of Service</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

import { Phone, Mail, MapPin, Linkedin, Instagram, Facebook, MessageCircle } from "lucide-react";
import { useWebsite } from "../../contexts/WebsiteContext";

export function Footer() {
  const { settings, products } = useWebsite();

  const phone = settings?.mobile || "+91 9082377097";
  const email = settings?.email || "b.manish95@gmail.com";
  const address = settings?.address || "Mumbai, Maharashtra, India";
  const motto = settings?.motto || "We Care · We Commit · We Connect";
  const footerText = settings?.footer_text || "Premium Indian merchant export house — connecting authentic producers with international buyers.";
  const productNames = products.length > 0 ? products.map((p: any) => p.name) : ["Seafood", "Textiles", "Fresh Agricultural", "Cereals & Grains", "Premium Indian Coffee"];

  return (
    <footer className="bg-[#08111f] text-white/70 pt-20 pb-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-5">
              {settings?.logo ? (
                <img src={`/uploads/${settings.logo}`} alt="Logo" className="w-12 h-12 rounded-full object-cover border-2 border-[#d4af37]/40" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0a1628] to-[#1e3a8a] flex items-center justify-center text-[#d4af37] border-2 border-[#d4af37]/40">
                  <span style={{ fontFamily: "Playfair Display, serif", fontWeight: 800 }}>B</span>
                </div>
              )}
              <div>
                <div className="text-white tracking-tight" style={{ fontFamily: "Playfair Display, serif", fontWeight: 700 }}>BODAL'S</div>
                <div className="text-white/50 text-xs tracking-[0.18em] uppercase">INTERNATIONAL</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ fontFamily: "Inter" }}>{footerText}</p>
            <div className="text-[#d4af37] tracking-[0.2em] text-xs uppercase">{motto.replace(/,/g, ' ·')}</div>
          </div>

          <div>
            <div className="text-white mb-4 tracking-wide" style={{ fontFamily: "Inter", fontWeight: 600 }}>Quick Links</div>
            <ul className="space-y-2 text-sm">
              {["Home", "About Us", "Businesses", "Contact"].map((l) => (
                <li key={l}>
                  <button onClick={() => document.getElementById(l.toLowerCase().replace(" us", "").replace(" ", ""))?.scrollIntoView({ behavior: "smooth" })} className="hover:text-[#d4af37] transition">{l}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-white mb-4 tracking-wide" style={{ fontFamily: "Inter", fontWeight: 600 }}>Products</div>
            <ul className="space-y-2 text-sm">
              {productNames.map((p: string) => (
                <li key={p} className="hover:text-[#d4af37] transition cursor-pointer">{p}</li>
              ))}
            </ul>
          </div>

          <div>
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
                <a key={i} href={url || "#"} target={url ? "_blank" : undefined} rel="noreferrer" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#d4af37] hover:text-[#0a1628] flex items-center justify-center transition">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>© {new Date().getFullYear()} {settings?.company_name || "BODAL'S INTERNATIONAL"} Pvt. Ltd. All rights reserved.</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[#d4af37]">Privacy Policy</a>
            <a href="#" className="hover:text-[#d4af37]">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

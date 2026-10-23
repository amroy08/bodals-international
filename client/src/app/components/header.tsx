import { useState, useEffect } from "react";
import { Phone, Mail, Linkedin, Instagram, Facebook, MessageCircle, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useWebsite } from "../../contexts/WebsiteContext";
import defaultLogo from "@/assets/logo_black.png";
import { formatSocialUrl } from "../../utils/url";

const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Us" },
  { id: "businesses", label: "Businesses" },
  { id: "contact", label: "Contact" },
];

export function Header({ onAdminClick, introComplete = true }: { onAdminClick: () => void; introComplete?: boolean }) {
  const { settings } = useWebsite();
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 40);
      for (const n of NAV) {
        const el = document.getElementById(n.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActive(n.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const goTo = (id: string) => {
    setOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  const phone = settings?.mobile || '+91 9082377097';
  const email = settings?.email || 'manishbodal@bodalsint.com';

  const logoUrl = settings?.logo ? `/api/uploads/${settings.logo}` : defaultLogo;

  return (
    <header className="sticky top-0 z-50 w-full" role="banner">
      {/* Announcement Bar */}
      {(settings?.announcement_enabled === 1 || settings?.announcement_enabled === true) && settings?.announcement_text && (
        <div className="bg-[#420614] text-[#d4af37] text-[11px] sm:text-xs py-1.5 px-3 border-b border-[#d4af37]/20 text-center font-medium tracking-wide">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <span>{settings.announcement_text}</span>
            {settings.announcement_link && (
              <a 
                href={settings.announcement_link} 
                className="underline hover:text-white transition font-semibold"
              >
                Learn More →
              </a>
            )}
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="bg-[#63091E] text-white/90 text-[10px] sm:text-xs shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 sm:py-2 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-5 min-w-0">
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-1 sm:gap-1.5 hover:text-[#d4af37] transition whitespace-nowrap" aria-label={`Call us at ${phone}`}>
              <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" /> <span className="truncate">{phone}</span>
            </a>
            <a href={`mailto:${email}`} className="hidden sm:flex items-center gap-1.5 hover:text-[#d4af37] transition" aria-label={`Email us at ${email}`}>
              <Mail className="w-3.5 h-3.5 flex-shrink-0" /> <span className="truncate">{email}</span>
            </a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {settings?.linkedin_url && <a href={formatSocialUrl(settings.linkedin_url)} target="_blank" rel="noreferrer" className="hover:text-[#d4af37] transition" aria-label="LinkedIn"><Linkedin className="w-3 h-3 sm:w-3.5 sm:h-3.5" /></a>}
            {settings?.instagram_url && <a href={formatSocialUrl(settings.instagram_url)} target="_blank" rel="noreferrer" className="hover:text-[#d4af37] transition" aria-label="Instagram"><Instagram className="w-3 h-3 sm:w-3.5 sm:h-3.5" /></a>}
            {settings?.facebook_url && <a href={formatSocialUrl(settings.facebook_url)} target="_blank" rel="noreferrer" className="hover:text-[#d4af37] transition" aria-label="Facebook"><Facebook className="w-3 h-3 sm:w-3.5 sm:h-3.5" /></a>}
            {settings?.whatsapp_url && <a href={formatSocialUrl(settings.whatsapp_url)} target="_blank" rel="noreferrer" className="hover:text-[#d4af37] transition" aria-label="WhatsApp"><MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" /></a>}
            {!settings?.linkedin_url && !settings?.instagram_url && !settings?.facebook_url && !settings?.whatsapp_url && (
              [Linkedin, Instagram, Facebook, MessageCircle].map((Icon, i) => (
                <a key={i} href="#" className="hover:text-[#d4af37] transition"><Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" /></a>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className={`transition-all ${scrolled ? "bg-white/95 backdrop-blur-lg shadow-md" : "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]"}`} role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 sm:py-2.5 flex items-center justify-between">
          <button id="header-logo-target" onClick={() => goTo("home")} className="flex items-center gap-3 group" style={{ opacity: introComplete ? 1 : 0, transition: 'opacity 0.3s ease' }}>
            <img 
              src={logoUrl} 
              alt="Bodals International Logo - Premium Indian Merchant Export House" 
              className="h-12 sm:h-14 md:h-16 w-auto max-w-[200px] sm:max-w-[240px] md:max-w-[270px] object-contain transition-all" 
              onError={(e) => { e.currentTarget.src = defaultLogo; }}
            />
          </button>

          <nav className="hidden md:flex items-center gap-2">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => goTo(n.id)}
                className={`relative px-4 py-2 text-[15px] lg:text-base transition font-medium ${
                  active === n.id ? "text-[#63091E] font-semibold" : "text-[#4a4a58] hover:text-[#63091E]"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {n.label}
                {active === n.id && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#d4af37] rounded-full"
                  />
                )}
              </button>
            ))}
            <button
              onClick={() => goTo("contact")}
              className="ml-4 px-6 py-2.5 bg-[#63091E] text-white text-[15px] font-semibold rounded-full hover:bg-[#800d28] transition flex items-center gap-2 shadow-sm hover:shadow"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Send Enquiry
            </button>
          </nav>

          <button className="md:hidden text-[#63091E] p-1.5 focus:outline-none" onClick={() => setOpen((o) => !o)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-black/10 overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-2">
                {NAV.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => goTo(n.id)}
                    className={`text-left px-3 py-2 rounded ${
                      active === n.id ? "bg-[#63091E] text-white" : "text-[#63091E]"
                    }`}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

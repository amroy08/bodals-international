import { useState, useEffect } from "react";
import { Phone, Mail, Linkedin, Instagram, Facebook, MessageCircle, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useWebsite } from "../../contexts/WebsiteContext";
import defaultLogo from "@/assets/logo_black.png";

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
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const phone = settings?.mobile || '+91 9082377097';
  const email = settings?.email || 'b.manish95@gmail.com';

  const logoUrl = settings?.logo ? `/uploads/${settings.logo}` : defaultLogo;

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="bg-[#0a1628] text-white/80 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-5">
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 hover:text-[#d4af37] transition">
              <Phone className="w-3.5 h-3.5" /> {phone}
            </a>
            <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-[#d4af37] transition">
              <Mail className="w-3.5 h-3.5" /> {email}
            </a>
          </div>
          <div className="flex items-center gap-3">
            {settings?.linkedin_url && <a href={settings.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-[#d4af37] transition"><Linkedin className="w-3.5 h-3.5" /></a>}
            {settings?.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="hover:text-[#d4af37] transition"><Instagram className="w-3.5 h-3.5" /></a>}
            {settings?.facebook_url && <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="hover:text-[#d4af37] transition"><Facebook className="w-3.5 h-3.5" /></a>}
            {settings?.whatsapp_url && <a href={settings.whatsapp_url} target="_blank" rel="noreferrer" className="hover:text-[#d4af37] transition"><MessageCircle className="w-3.5 h-3.5" /></a>}
            {!settings?.linkedin_url && !settings?.instagram_url && !settings?.facebook_url && !settings?.whatsapp_url && (
              [Linkedin, Instagram, Facebook, MessageCircle].map((Icon, i) => (
                <a key={i} href="#" className="hover:text-[#d4af37] transition"><Icon className="w-3.5 h-3.5" /></a>
              ))
            )}
            <button onClick={onAdminClick} className="ml-2 px-2 py-0.5 rounded border border-white/20 hover:border-[#d4af37] hover:text-[#d4af37] transition">
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className={`transition-all ${scrolled ? "bg-white/95 backdrop-blur-lg shadow-md" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button id="header-logo-target" onClick={() => goTo("home")} className="flex items-center gap-3 group" style={{ opacity: introComplete ? 1 : 0, transition: 'opacity 0.3s ease' }}>
            <img 
              src={logoUrl} 
              alt="Bodal's International Logo - Premium Indian Merchant Export House" 
              className="h-14 w-auto object-contain transition-all" 
            />
            
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => goTo(n.id)}
                className={`relative px-4 py-2 text-sm transition ${
                  active === n.id ? "text-[#0a1628]" : "text-[#717182] hover:text-[#0a1628]"
                }`}
                style={{ fontFamily: "Inter" }}
              >
                {n.label}
                {active === n.id && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#d4af37]"
                  />
                )}
              </button>
            ))}
            <button
              onClick={() => goTo("contact")}
              className="ml-3 px-5 py-2.5 bg-[#0a1628] text-white text-sm rounded-full hover:bg-[#1e3a8a] transition flex items-center gap-2"
              style={{ fontFamily: "Inter" }}
            >
              Send Enquiry
            </button>
          </nav>

          <button className="md:hidden text-[#0a1628]" onClick={() => setOpen((o) => !o)}>
            {open ? <X /> : <Menu />}
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
                      active === n.id ? "bg-[#0a1628] text-white" : "text-[#0a1628]"
                    }`}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Mail, FileText } from "lucide-react";
import { useWebsite } from "../../contexts/WebsiteContext";

export function FloatingContactButtons() {
  const { settings, loading } = useWebsite();
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  if (loading || !settings) return null;

  // Check if floating contact is enabled
  const enabled = settings.floating_contact_enabled === 1 || settings.floating_contact_enabled === true;
  if (!enabled) return null;

  // Resolve contact details with fallbacks
  const whatsappNumber = (settings.whatsapp_number || settings.mobile || "+91 9082377097").replace(/[\s\-()]/g, "").replace("+", "");
  const whatsappMessage = settings.whatsapp_default_message || "Hello BODALS INTERNATIONAL, I would like to enquire about your export products.";
  const contactEmail = settings.contact_email || settings.email || "manishbodal@bodalsint.com";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent("Export Product Enquiry - BODALS INTERNATIONAL")}&body=${encodeURIComponent("Hello BODALS INTERNATIONAL,\n\nI would like to enquire about your export products.\n\nName:\nCompany:\nCountry:\nRequirement:")}`;

  const buttons = [
    {
      id: "brochure",
      href: "#brochure",
      icon: FileText,
      label: "View Company Brochure",
      tooltip: "Company Brochure",
      bg: "#d4af37",
      hoverBg: "#bca032",
      external: false,
    },
    {
      id: "whatsapp",
      href: whatsappUrl,
      icon: MessageCircle,
      label: "Chat with us on WhatsApp",
      tooltip: "Chat on WhatsApp",
      bg: "#25D366",
      hoverBg: "#1eba59",
      external: true,
    },
    {
      id: "email",
      href: mailtoUrl,
      icon: Mail,
      label: "Send us an email",
      tooltip: "Send Email",
      bg: "#0a1628",
      hoverBg: "#1e3a8a",
      external: false,
    },
  ];

  return (
    <div
      className="floating-contact-container"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9990,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        alignItems: "flex-end",
      }}
    >
      {buttons.map((btn, index) => (
        <motion.div
          key={btn.id}
          initial={{ opacity: 0, scale: 0, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.5 + index * 0.15, type: "spring", stiffness: 260, damping: 20 }}
          style={{ position: "relative" }}
          onMouseEnter={() => setHoveredBtn(btn.id)}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          {/* Tooltip */}
          <AnimatePresence>
            {hoveredBtn === btn.id && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "absolute",
                  right: "calc(100% + 12px)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#0a1628",
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  fontFamily: "Inter, sans-serif",
                  letterSpacing: "0.02em",
                  pointerEvents: "none",
                }}
              >
                {btn.tooltip}
                {/* Arrow */}
                <div
                  style={{
                    position: "absolute",
                    right: "-4px",
                    top: "50%",
                    transform: "translateY(-50%) rotate(45deg)",
                    width: "8px",
                    height: "8px",
                    background: "#0a1628",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Button */}
          <motion.a
            href={btn.href}
            onClick={(e) => {
              if (btn.id === "brochure") {
                e.preventDefault();
                document.getElementById("brochure")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            target={btn.external ? "_blank" : undefined}
            rel={btn.external ? "noopener noreferrer" : undefined}
            aria-label={btn.label}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              backgroundColor: hoveredBtn === btn.id ? btn.hoverBg : btn.bg,
              color: "#ffffff",
              textDecoration: "none",
              boxShadow: hoveredBtn === btn.id
                ? `0 8px 25px ${btn.bg}55, 0 4px 12px rgba(0,0,0,0.15)`
                : `0 4px 15px ${btn.bg}40, 0 2px 8px rgba(0,0,0,0.1)`,
              transition: "background-color 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer",
            }}
          >
            <btn.icon style={{ width: "22px", height: "22px" }} />
          </motion.a>
        </motion.div>
      ))}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .floating-contact-container {
            bottom: 16px !important;
            right: 16px !important;
            gap: 10px !important;
          }
          .floating-contact-container a {
            width: 46px !important;
            height: 46px !important;
          }
          .floating-contact-container a svg {
            width: 20px !important;
            height: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}

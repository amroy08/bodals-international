import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import { Toaster } from "react-hot-toast";
import { WebsiteProvider, useWebsite } from "../contexts/WebsiteContext";
import { AuthProvider } from "../contexts/AuthContext";
import { IntroAnimation } from "./components/intro-animation";
import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { About } from "./components/about";
import { Speciality } from "./components/speciality";
import { Vision } from "./components/vision";
import { Businesses } from "./components/businesses";
import { Brochure } from "./components/brochure";
import { Certifications } from "./components/certifications";
import { Contact } from "./components/contact";
import { Footer } from "./components/footer";
import { FloatingContactButtons } from "./components/FloatingContactButtons";
import { AdminPanel } from "./components/admin-panel";
import { analyticsApi } from "../api/analyticsApi";

function getDeviceType() {
  const w = window.innerWidth;
  if (w < 768) return 'Mobile';
  if (w < 1024) return 'Tablet';
  return 'Desktop';
}

function getBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edg')) return 'Edge';
  return 'Other';
}

function MainWebsite({ onAdminClick }: { onAdminClick: () => void }) {
  const { settings } = useWebsite();
  const introEnabled = settings?.section_intro_animation_enabled !== 0 && settings?.section_intro_animation_enabled !== false;
  const [introDone, setIntroDone] = useState(() => !introEnabled);
  const progress = useMotionValue(0);

  // If intro disabled from admin settings, immediately mark done
  useEffect(() => {
    if (!introEnabled) {
      setIntroDone(true);
    }
  }, [introEnabled]);

  // Synchronize SEO Meta Tags dynamically from admin settings
  useEffect(() => {
    if (settings?.seo_meta_title) {
      document.title = settings.seo_meta_title;
    }
    if (settings?.seo_meta_description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", settings.seo_meta_description);
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute("content", settings.seo_meta_description);
    }
    if (settings?.seo_meta_keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) metaKeywords.setAttribute("content", settings.seo_meta_keywords);
    }
  }, [settings]);

  // Derive site styles directly from scroll progress
  const siteOpacity = useTransform(progress, [0.85, 0.96], [0, 1]);
  const siteScale = useTransform(progress, [0.85, 0.96], [0.9, 1]);
  const siteBlur = useTransform(progress, [0.85, 0.96], [20, 0]);
  const siteFilter = useTransform(siteBlur, (b) => `blur(${b}px)`);

  const showSpecialities = settings?.section_specialities_enabled !== 0 && settings?.section_specialities_enabled !== false;
  const showBrochure = settings?.section_brochure_enabled !== 0 && settings?.section_brochure_enabled !== false;

  return (
    <>
      {/* Intro overlay — only rendered if enabled in settings and not completed */}
      {introEnabled && !introDone && (
        <IntroAnimation progress={progress} onDone={() => setIntroDone(true)} />
      )}

      {/* Site content */}
      <motion.div 
        style={{
          opacity: introDone ? 1 : siteOpacity,
          scale: introDone ? 1 : siteScale,
          filter: introDone ? "none" : siteFilter,
          position: introDone ? "relative" : "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: introDone ? "auto" : "100%",
          overflow: introDone ? "visible" : "hidden",
          pointerEvents: introDone ? "auto" : "none",
          fontFamily: "Inter, sans-serif"
        }}
        className="bg-white" 
      >
        <Header onAdminClick={onAdminClick} introComplete={introDone} />
        <Hero />
        <About />
        {showSpecialities && <Speciality />}
        <Vision />
        <Businesses />
        {showBrochure && <Brochure />}
        <Certifications />
        <Contact />
        <Footer />
      </motion.div>

      {/* Floating contact buttons — always fixed to viewport, visible when intro completes */}
      <AnimatePresence>
        {introDone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.5 }}
            className="fixed bottom-0 right-0 z-50 pointer-events-none"
          >
            <div className="pointer-events-auto">
              <FloatingContactButtons />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  const [view, setView] = useState<"site" | "admin">(() => {
    return window.location.pathname.startsWith("/admin") ? "admin" : "site";
  });

  // Sync browser URL with the active view
  useEffect(() => {
    if (view === "admin") {
      if (window.location.pathname !== "/admin") {
        window.history.pushState({}, "", "/admin");
      }
    } else {
      if (window.location.pathname !== "/") {
        window.history.pushState({}, "", "/");
      }
    }
  }, [view]);

  // Track visitor on mount
  useEffect(() => {
    analyticsApi.trackVisit({
      page: window.location.pathname,
      device: getDeviceType(),
      browser: getBrowser(),
    }).catch(() => {});
  }, []);

  return (
    <WebsiteProvider>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        {view === "admin" ? (
          <AdminPanel onExit={() => setView("site")} />
        ) : (
          <MainWebsite onAdminClick={() => setView("admin")} />
        )}
      </AuthProvider>
    </WebsiteProvider>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import { Toaster } from "react-hot-toast";
import { WebsiteProvider } from "../contexts/WebsiteContext";
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

export default function App() {
  const [view, setView] = useState<"site" | "admin">(() => {
    return window.location.pathname.startsWith("/admin") ? "admin" : "site";
  });
  const [introDone, setIntroDone] = useState(false);
  const progress = useMotionValue(0);

  // Derive site styles directly from scroll progress
  const siteOpacity = useTransform(progress, [0.85, 0.96], [0, 1]);
  const siteScale = useTransform(progress, [0.85, 0.96], [0.9, 1]);
  const siteBlur = useTransform(progress, [0.85, 0.96], [20, 0]);
  const siteFilter = useTransform(siteBlur, (b) => `blur(${b}px)`);

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
          <>
            {/* Intro overlay — removed from DOM once completed */}
            {!introDone && <IntroAnimation progress={progress} onDone={() => setIntroDone(true)} />}

            {/* Site content — always rendered beneath the overlay, zooms in when intro completes */}
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
              <Header onAdminClick={() => setView("admin")} introComplete={introDone} />
              <Hero />
              <About />
              <Speciality />
              <Vision />
              <Businesses />
              <Brochure />
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
        )}
      </AuthProvider>
    </WebsiteProvider>
  );
}

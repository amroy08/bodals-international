import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  const [view, setView] = useState<"site" | "admin">("site");
  const [introDone, setIntroDone] = useState(false);

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
            {!introDone && <IntroAnimation onDone={() => setIntroDone(true)} />}

            {/* Site content — always rendered beneath the overlay, zooms in when intro completes */}
            <motion.div 
              initial={false}
              animate={{ 
                scale: introDone ? 1 : 0.8,
                filter: introDone ? "blur(0px)" : "blur(20px)",
                opacity: introDone ? 1 : 0
              }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative min-h-screen w-full bg-white" 
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Header onAdminClick={() => setView("admin")} introComplete={introDone} />
              <Hero />
              <About />
              <Speciality />
              <Vision />
              <Businesses />
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

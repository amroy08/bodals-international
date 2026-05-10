import { useState, useEffect } from "react";
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
          <div className="relative min-h-screen w-full bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
            {!introDone && <IntroAnimation onDone={() => setIntroDone(true)} />}
            <Header onAdminClick={() => setView("admin")} />
            <Hero />
            <About />
            <Speciality />
            <Vision />
            <Businesses />
            <Certifications />
            <Contact />
            <Footer />
          </div>
        )}
      </AuthProvider>
    </WebsiteProvider>
  );
}

import { useState } from "react";
import { motion } from "motion/react";
import { LayoutDashboard, FileText, Package, Award, MessageSquare, BarChart3, Settings, LogOut, Lock, Mail, Image as ImageLucide } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Dashboard } from "./admin/Dashboard";
import { ContentManagement } from "./admin/ContentManagement";
import { ProductsManagement } from "./admin/ProductsManagement";
import { CertificationsManagement } from "./admin/CertificationsManagement";
import { EnquiriesManagement } from "./admin/EnquiriesManagement";
import { Analytics } from "./admin/Analytics";
import { ImageManagement } from "./admin/ImageManagement";
import toast from "react-hot-toast";

export function AdminPanel({ onExit }: { onExit: () => void }) {
  const { token, login, logout } = useAuth();
  const [section, setSection] = useState("dashboard");

  if (!token) return <AdminLogin onLogin={login} onExit={onExit} />;

  const handleLogout = () => { logout(); toast.success("Logged out"); };

  const items = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "content", label: "Website Content", icon: FileText },
    { id: "products", label: "Products", icon: Package },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "enquiries", label: "Enquiries", icon: MessageSquare },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "images", label: "Section Images", icon: ImageLucide },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-[#0a1628] text-white flex-col hidden lg:flex">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#d4af37] text-[#0a1628] flex items-center justify-center" style={{ fontFamily: "Playfair Display, serif", fontWeight: 800 }}>B</div>
            <div><div style={{ fontFamily: "Playfair Display, serif", fontWeight: 700 }}>BODALS</div><div className="text-xs text-white/50 tracking-wider">ADMIN PANEL</div></div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {items.map(it => (
            <button key={it.id} onClick={() => setSection(it.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${section === it.id ? "bg-[#d4af37] text-[#0a1628]" : "text-white/70 hover:bg-white/5 hover:text-white"}`}>
              <it.icon className="w-4 h-4" />{it.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-1">
          <button onClick={onExit} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition"><Settings className="w-4 h-4" /> View Website</button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition"><LogOut className="w-4 h-4" /> Logout</button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 p-6 lg:p-10 overflow-x-hidden">
        {section === "dashboard" && <Dashboard />}
        {section === "content" && <ContentManagement />}
        {section === "products" && <ProductsManagement />}
        {section === "certifications" && <CertificationsManagement />}
        {section === "enquiries" && <EnquiriesManagement />}
        {section === "analytics" && <Analytics />}
        {section === "images" && <ImageManagement />}
      </main>
    </div>
  );
}

function AdminLogin({ onLogin, onExit }: { onLogin: (email: string, password: string) => Promise<{ success: boolean; message: string }>; onExit: () => void }) {
  const [email, setEmail] = useState("admin@bodalsinternational.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Email and password are required"); return; }
    setLoading(true); setError("");
    const result = await onLogin(email, password);
    if (!result.success) { setError(result.message); setLoading(false); }
    else toast.success("Welcome back!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1b35] to-[#0a1628] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-[#d4af37] text-[#0a1628] items-center justify-center mb-4"><Lock className="w-7 h-7" /></div>
          <h1 className="text-white mb-2" style={{ fontFamily: "Playfair Display, serif", fontSize: "1.75rem", fontWeight: 700 }}>Admin Login</h1>
          <p className="text-white/60 text-sm">BODALS INTERNATIONAL — Control Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-2xl space-y-4">
          {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
          <div>
            <label className="block text-sm text-[#0a1628] mb-1.5" style={{ fontWeight: 500 }}>Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717182]" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#fafaf7] border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-[#0a1628] mb-1.5" style={{ fontWeight: 500 }}>Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717182]" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#fafaf7] border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-[#0a1628] text-white rounded-lg hover:bg-[#1e3a8a] transition disabled:opacity-60">
            {loading ? "Logging in..." : "Login"}
          </button>
          <button type="button" onClick={onExit} className="w-full py-2.5 text-sm text-[#717182] hover:text-[#0a1628] transition">← Back to website</button>
        </form>
      </motion.div>
    </div>
  );
}

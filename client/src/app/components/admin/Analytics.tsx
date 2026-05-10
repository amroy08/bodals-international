import { useState, useEffect } from "react";
import { Users, Globe, Activity, ArrowUpRight } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { PageHeader, StatCard } from "./AdminShared";
import { analyticsApi } from "../../../api/analyticsApi";

export function Analytics() {
  const [data, setData] = useState<any>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [visitors, setVisitors] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([analyticsApi.getDashboard(), analyticsApi.getCountries(), analyticsApi.getRecentVisitors()])
      .then(([d, c, v]) => { setData(d.data.data); setCountries(c.data.data || []); setVisitors(v.data.data || []); })
      .catch(() => {});
  }, []);

  const d = data || {};
  const barData = countries.slice(0, 8).map((c: any) => ({ country: c.country, visits: c.visits }));
  const maxVisits = Math.max(...barData.map((b: any) => b.visits), 1);

  // Device breakdown from recent visitors
  const devices: Record<string, number> = {};
  visitors.forEach((v: any) => { devices[v.device] = (devices[v.device] || 0) + 1; });
  const total = visitors.length || 1;

  return (
    <>
      <PageHeader title="User Analytics" sub="Track visitor behavior and country distribution." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Visitors" value={d.totalVisitors?.toLocaleString() || "0"} accent="bg-[#0a1628]/10 text-[#0a1628]" />
        <StatCard icon={Globe} label="Countries" value={d.countriesReached || "0"} accent="bg-[#d4af37]/15 text-[#d4af37]" />
        <StatCard icon={Activity} label="Unique Visitors" value={d.uniqueVisitors?.toLocaleString() || "0"} accent="bg-blue-50 text-blue-700" />
        <StatCard icon={ArrowUpRight} label="Enquiries" value={d.totalEnquiries || "0"} accent="bg-emerald-50 text-emerald-700" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <div className="p-6 bg-white rounded-xl border border-black/5">
          <div className="text-[#0a1628] mb-5" style={{ fontWeight: 600 }}>Visitors by Country</div>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="country" stroke="#94a3b8" fontSize={12} /><YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip /><Bar dataKey="visits" fill="#d4af37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="text-center py-16 text-sm text-[#717182]">No data yet</div>}
        </div>
        <div className="p-6 bg-white rounded-xl border border-black/5">
          <div className="text-[#0a1628] mb-5" style={{ fontWeight: 600 }}>Top Countries</div>
          <div className="space-y-3">
            {countries.slice(0, 8).map((c: any) => (
              <div key={c.country}>
                <div className="flex justify-between text-sm mb-1"><span className="text-[#0a1628]">{c.country}</span><span className="text-[#717182]">{c.visits}</span></div>
                <div className="h-2 bg-[#fafaf7] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#0a1628] to-[#d4af37] rounded-full" style={{ width: `${(c.visits / maxVisits) * 100}%` }} />
                </div>
              </div>
            ))}
            {countries.length === 0 && <div className="text-center py-10 text-sm text-[#717182]">No visitor data yet</div>}
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-xl border border-black/5">
        <div className="text-[#0a1628] mb-5" style={{ fontWeight: 600 }}>Device Breakdown</div>
        <div className="grid grid-cols-3 gap-4 text-center">
          {["Desktop", "Mobile", "Tablet"].map(dev => (
            <div key={dev} className="p-4 rounded-lg bg-[#fafaf7]">
              <div className="text-[#0a1628]" style={{ fontFamily: "Playfair Display, serif", fontSize: "1.75rem", fontWeight: 700 }}>{Math.round(((devices[dev] || 0) / total) * 100)}%</div>
              <div className="text-xs text-[#717182] mt-1">{dev}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

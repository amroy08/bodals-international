import { useState, useEffect } from "react";
import { Users, Globe, MailOpen, Package } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { PageHeader, StatCard, StatusBadge } from "./AdminShared";
import { analyticsApi } from "../../../api/analyticsApi";
import { enquiryApi } from "../../../api/enquiryApi";

export function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsApi.getDashboard(), analyticsApi.getCountries()])
      .then(([dash, ctry]) => { setData(dash.data.data); setCountries(ctry.data.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center text-[#717182]">Loading dashboard...</div>;

  const d = data || {};
  const COLORS = ["#0a1628", "#d4af37", "#1e3a8a", "#22c55e", "#94a3b8"];
  const pieData = countries.slice(0, 5).map((c: any, i: number) => ({ name: c.country, value: c.visits, color: COLORS[i % COLORS.length] }));
  const weekData = (d.weeklyVisitors || []).map((w: any) => ({ day: new Date(w.date).toLocaleDateString('en', { weekday: 'short' }), visits: w.visits }));

  return (
    <>
      <PageHeader title="Dashboard" sub="Welcome back — here's what's happening today." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Visitors" value={d.totalVisitors?.toLocaleString() || "0"} accent="bg-[#0a1628]/10 text-[#0a1628]" />
        <StatCard icon={Globe} label="Countries Reached" value={d.countriesReached || "0"} accent="bg-[#d4af37]/15 text-[#d4af37]" />
        <StatCard icon={MailOpen} label="Total Enquiries" value={d.totalEnquiries || "0"} accent="bg-emerald-50 text-emerald-700" />
        <StatCard icon={Package} label="Active Products" value={d.totalProducts || "0"} accent="bg-blue-50 text-blue-700" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2 p-6 bg-white rounded-xl border border-black/5">
          <div className="text-[#0a1628] mb-5" style={{ fontWeight: 600 }}>Website Visitors (Last 7 days)</div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weekData}>
              <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d4af37" stopOpacity={0.4} /><stop offset="100%" stopColor="#d4af37" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} /><YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip /><Area type="monotone" dataKey="visits" stroke="#d4af37" strokeWidth={2} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="p-6 bg-white rounded-xl border border-black/5">
          <div className="text-[#0a1628] mb-4" style={{ fontWeight: 600 }}>Visitors by Country</div>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart><Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2}>
                  {pieData.map((d: any, i: number) => <Cell key={i} fill={d.color} />)}
                </Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">{pieData.map((c: any) => (
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: c.color }} />{c.name}</div>
                  <span className="text-[#717182]">{c.value}</span>
                </div>
              ))}</div>
            </>
          ) : <div className="text-sm text-[#717182] text-center py-10">No visitor data yet</div>}
        </div>
      </div>

      <div className="p-6 bg-white rounded-xl border border-black/5">
        <div className="text-[#0a1628] mb-5" style={{ fontWeight: 600 }}>Recent Enquiries</div>
        {(d.recentEnquiries || []).length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-[#717182] uppercase tracking-wider">
                <th className="pb-3">Name</th><th className="pb-3">Company</th><th className="pb-3">Status</th><th className="pb-3">Date</th>
              </tr></thead>
              <tbody>{(d.recentEnquiries || []).map((e: any) => (
                <tr key={e.id} className="border-t border-black/5">
                  <td className="py-3 text-[#0a1628]">{e.name}</td>
                  <td className="py-3 text-[#717182]">{e.company}</td>
                  <td className="py-3"><StatusBadge status={e.status} /></td>
                  <td className="py-3 text-[#717182]">{new Date(e.created_at).toLocaleDateString()}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : <div className="text-sm text-[#717182] text-center py-6">No enquiries yet</div>}
      </div>
    </>
  );
}

import { useState, useEffect } from "react";
import { 
  Users, 
  Globe, 
  Activity, 
  ArrowUpRight, 
  Search, 
  Monitor, 
  Smartphone, 
  Tablet, 
  RefreshCw, 
  Calendar, 
  FileText, 
  Eye, 
  Chrome, 
  Compass, 
  Globe2 
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts";
import { PageHeader, StatCard } from "./AdminShared";
import { analyticsApi } from "../../../api/analyticsApi";

export function Analytics() {
  const [data, setData] = useState<any>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filter state for visitor logs
  const [searchTerm, setSearchTerm] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [browserFilter, setBrowserFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchData = async () => {
    try {
      const [d, c, v] = await Promise.all([
        analyticsApi.getDashboard(),
        analyticsApi.getCountries(),
        analyticsApi.getRecentVisitors()
      ]);
      setData(d.data.data);
      setCountries(c.data.data || []);
      setVisitors(v.data.data || []);
    } catch (err) {
      console.error("Error loading analytics data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <RefreshCw className="w-8 h-8 text-[#d4af37] animate-spin" />
        <p className="text-sm text-[#717182]">Loading analytics platform...</p>
      </div>
    );
  }

  const d = data || {};
  
  // Format the 14-day timeline trend chart data
  const trendData = (d.trendVisitors || []).map((w: any) => ({
    day: new Date(w.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    visits: w.visits
  }));

  // Popular Pages
  const popularPages = d.popularPages || [];
  const maxPageVisits = Math.max(...popularPages.map((p: any) => p.visits), 1);

  // Top Countries details
  const topCountries = countries.slice(0, 8);
  const maxCountryVisits = Math.max(...topCountries.map((c: any) => c.visits), 1);

  // Devices & Browser lists (aggregated database shares from getDashboard)
  const fullDevices = d.devices || [];
  const totalDeviceVisits = fullDevices.reduce((sum: number, curr: any) => sum + curr.count, 0) || 1;

  const fullBrowsers = d.browsers || [];
  const totalBrowserVisits = fullBrowsers.reduce((sum: number, curr: any) => sum + curr.count, 0) || 1;

  // Icons mapping for devices
  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'desktop': return <Monitor className="w-4 h-4 text-[#0a1628]" />;
      case 'mobile': return <Smartphone className="w-4 h-4 text-[#d4af37]" />;
      case 'tablet': return <Tablet className="w-4 h-4 text-[#1e3a8a]" />;
      default: return <Monitor className="w-4 h-4 text-gray-400" />;
    }
  };

  // Filtered visitor list for table view
  const filteredVisitors = visitors.filter((v: any) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (v.ip_address || "").toLowerCase().includes(term) ||
      (v.country || "").toLowerCase().includes(term) ||
      (v.city || "").toLowerCase().includes(term) ||
      (v.page || "").toLowerCase().includes(term);

    const matchesDevice = deviceFilter === "all" || v.device.toLowerCase() === deviceFilter.toLowerCase();
    const matchesBrowser = browserFilter === "all" || v.browser.toLowerCase() === browserFilter.toLowerCase();

    return matchesSearch && matchesDevice && matchesBrowser;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVisitors = filteredVisitors.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <PageHeader title="User Analytics" sub="Track website performance, traffic trends, and reader behaviors." />
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-[#0a1628] text-white hover:bg-[#162942] rounded-lg transition-colors border border-black/5 disabled:opacity-50 self-start sm:self-center"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* High-level stats summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Visitors" value={d.totalVisitors?.toLocaleString() || "0"} accent="bg-[#0a1628]/10 text-[#0a1628]" />
        <StatCard icon={Globe} label="Countries Reached" value={d.countriesReached || "0"} accent="bg-[#d4af37]/15 text-[#d4af37]" />
        <StatCard icon={Activity} label="Unique Visitors" value={d.uniqueVisitors?.toLocaleString() || "0"} accent="bg-blue-50 text-blue-700" />
        <StatCard icon={ArrowUpRight} label="Total Enquiries" value={d.totalEnquiries || "0"} accent="bg-emerald-50 text-emerald-700" />
      </div>

      {/* Traffic Trend Chart over 14 Days */}
      <div className="p-6 bg-white rounded-xl border border-black/5 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <div>
            <h3 className="text-base text-[#0a1628] font-semibold flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-[#d4af37]" />
              Traffic Trend (Last 14 Days)
            </h3>
            <p className="text-xs text-[#717182] mt-0.5">Overview of daily website visits & interaction spikes.</p>
          </div>
          <div className="text-xs text-[#717182] bg-[#fafaf7] px-3 py-1 rounded-full border border-black/5 self-start">
            Active Analytics Range: 14 Days
          </div>
        </div>
        
        {trendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  background: '#ffffff', 
                  border: '1px solid rgba(0,0,0,0.05)', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  fontSize: '12px' 
                }} 
              />
              <Area type="monotone" dataKey="visits" stroke="#d4af37" strokeWidth={2.5} fill="url(#analyticsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-20 text-sm text-[#717182]">No traffic records matching the date range.</div>
        )}
      </div>

      {/* Popular Pages & Top Countries */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Most Visited Pages */}
        <div className="p-6 bg-white rounded-xl border border-black/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#0a1628]" />
              <h3 className="text-[#0a1628] font-semibold">Most Visited Pages</h3>
            </div>
            <div className="space-y-4">
              {popularPages.map((p: any) => {
                const percentage = Math.round((p.visits / maxPageVisits) * 100);
                return (
                  <div key={p.page} className="group">
                    <div className="flex justify-between items-center text-sm mb-1.5">
                      <div className="flex items-center gap-2 font-mono text-xs text-[#0a1628] bg-slate-50 px-2 py-0.5 rounded border border-black/5">
                        {p.page}
                      </div>
                      <span className="text-xs text-[#717182] font-semibold">{p.visits.toLocaleString()} hits</span>
                    </div>
                    <div className="h-2 bg-[#fafaf7] rounded-full overflow-hidden border border-black/5">
                      <div 
                        className="h-full bg-gradient-to-r from-[#0a1628] to-[#d4af37] rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
              {popularPages.length === 0 && (
                <div className="text-center py-16 text-sm text-[#717182]">No page tracking record found yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Top Countries List */}
        <div className="p-6 bg-white rounded-xl border border-black/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe2 className="w-5 h-5 text-[#d4af37]" />
              <h3 className="text-[#0a1628] font-semibold">Audience Country Breakdown</h3>
            </div>
            <div className="space-y-4">
              {topCountries.map((c: any) => {
                const percentage = Math.round((c.visits / maxCountryVisits) * 100);
                return (
                  <div key={c.country}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-[#0a1628] font-medium flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        {c.country}
                      </span>
                      <span className="text-xs text-[#717182] font-semibold">{c.visits.toLocaleString()} sessions</span>
                    </div>
                    <div className="h-2 bg-[#fafaf7] rounded-full overflow-hidden border border-black/5">
                      <div 
                        className="h-full bg-gradient-to-r from-[#d4af37] to-[#0a1628] rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
              {topCountries.length === 0 && (
                <div className="text-center py-16 text-sm text-[#717182]">No audience geolocation data registered.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Platform & Device Shares (Aggregated DB statistics) */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Full DB Device Breakdown */}
        <div className="p-6 bg-white rounded-xl border border-black/5">
          <h3 className="text-[#0a1628] font-semibold mb-5 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-[#0a1628]" />
            Device Shares (Full Database)
          </h3>
          <div className="space-y-4">
            {fullDevices.map((dev: any) => {
              const pct = Math.round((dev.count / totalDeviceVisits) * 100);
              return (
                <div key={dev.device} className="flex items-center gap-4 bg-[#fafaf7] p-3 rounded-lg border border-black/5">
                  <div className="p-2 bg-white rounded-md border border-black/5">
                    {getDeviceIcon(dev.device)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span className="text-[#0a1628]">{dev.device}</span>
                      <span className="text-[#717182]">{pct}% ({dev.count})</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0a1628] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
            {fullDevices.length === 0 && (
              <div className="text-center py-10 text-sm text-[#717182]">No device stats captured.</div>
            )}
          </div>
        </div>

        {/* Full DB Browser Breakdown */}
        <div className="p-6 bg-white rounded-xl border border-black/5">
          <h3 className="text-[#0a1628] font-semibold mb-5 flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#d4af37]" />
            Browser Shares (Full Database)
          </h3>
          <div className="space-y-4">
            {fullBrowsers.map((br: any) => {
              const pct = Math.round((br.count / totalBrowserVisits) * 100);
              return (
                <div key={br.browser} className="flex items-center gap-4 bg-[#fafaf7] p-3 rounded-lg border border-black/5">
                  <div className="p-2 bg-white rounded-md border border-black/5">
                    {br.browser.toLowerCase().includes('chrome') ? (
                      <Chrome className="w-4 h-4 text-[#d4af37]" />
                    ) : (
                      <Compass className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span className="text-[#0a1628]">{br.browser}</span>
                      <span className="text-[#717182]">{pct}% ({br.count})</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#d4af37] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
            {fullBrowsers.length === 0 && (
              <div className="text-center py-10 text-sm text-[#717182]">No browser stats captured.</div>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Detailed Visitor Activity Log */}
      <div className="p-6 bg-white rounded-xl border border-black/5 mb-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-[#0a1628] font-semibold text-base flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#0a1628]" />
              Visitor Activity Log
            </h3>
            <p className="text-xs text-[#717182] mt-0.5">Real-time breakdown of all page hit occurrences.</p>
          </div>

          {/* Filtering Bars */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search inputs */}
            <div className="relative min-w-[200px] flex-1 sm:flex-initial">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search location, IP, page..."
                className="block w-full pl-9 pr-3 py-1.5 bg-[#fafaf7] border border-black/5 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
              />
            </div>

            {/* Device Filter */}
            <select
              value={deviceFilter}
              onChange={(e) => { setDeviceFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 bg-[#fafaf7] border border-black/5 rounded-lg text-sm text-[#0a1628] focus:outline-none"
            >
              <option value="all">All Devices</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="tablet">Tablet</option>
            </select>

            {/* Browser Filter */}
            <select
              value={browserFilter}
              onChange={(e) => { setBrowserFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 bg-[#fafaf7] border border-black/5 rounded-lg text-sm text-[#0a1628] focus:outline-none"
            >
              <option value="all">All Browsers</option>
              <option value="chrome">Chrome</option>
              <option value="safari">Safari</option>
              <option value="firefox">Firefox</option>
              <option value="edge">Edge</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto border border-black/5 rounded-lg">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-[#fafaf7] border-b border-black/5 text-xs text-[#717182] uppercase tracking-wider">
                <th className="px-5 py-3 font-semibold">Location</th>
                <th className="px-5 py-3 font-semibold">IP Address</th>
                <th className="px-5 py-3 font-semibold">Page Visited</th>
                <th className="px-5 py-3 font-semibold">Browser / OS</th>
                <th className="px-5 py-3 font-semibold text-center">Device</th>
                <th className="px-5 py-3 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-[#0a1628]">
              {currentVisitors.map((v: any, index: number) => (
                <tr key={v.id || index} className="hover:bg-[#fafaf7]/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-medium text-[#0a1628] flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        {v.country || "Unknown"}
                      </span>
                      <span className="text-xs text-[#717182] pl-5">{v.city || "Unknown"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-[#717182]">
                    {v.ip_address}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block font-mono text-xs text-[#0a1628] bg-slate-50 px-2 py-0.5 rounded border border-black/5">
                      {v.page || "/"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-700">
                    <div className="flex items-center gap-1.5">
                      {v.browser.toLowerCase().includes('chrome') ? (
                        <Chrome className="w-3.5 h-3.5 text-[#d4af37]" />
                      ) : (
                        <Compass className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span>{v.browser || "Unknown"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <div className="inline-flex items-center justify-center p-1.5 bg-slate-50 rounded-md border border-black/5 tooltip" title={v.device}>
                      {getDeviceIcon(v.device)}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right text-xs text-[#717182] font-medium">
                    {new Date(v.created_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </td>
                </tr>
              ))}
              {currentVisitors.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-sm text-[#717182]">
                    No visitors match the current search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Custom Pagination Footer */}
        {filteredVisitors.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-5 gap-3">
            <span className="text-xs text-[#717182]">
              Showing <span className="font-semibold text-[#0a1628]">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-semibold text-[#0a1628]">
                {Math.min(indexOfLastItem, filteredVisitors.length)}
              </span>{" "}
              of <span className="font-semibold text-[#0a1628]">{filteredVisitors.length}</span> logs
            </span>
            <div className="inline-flex gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-xs font-semibold rounded-md border border-black/5 bg-[#fafaf7] hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-md border border-black/5 transition-colors ${
                    currentPage === i + 1 
                      ? "bg-[#0a1628] text-white" 
                      : "bg-[#fafaf7] hover:bg-slate-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-xs font-semibold rounded-md border border-black/5 bg-[#fafaf7] hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

import { useState, useEffect } from "react";
import { Search, Filter, Eye, Trash2, X } from "lucide-react";
import { PageHeader, StatusBadge, ActionBtn, ConfirmModal } from "./AdminShared";
import { enquiryApi } from "../../../api/enquiryApi";
import toast from "react-hot-toast";

export function EnquiriesManagement() {
  const [data, setData] = useState<any>({ enquiries: [], pagination: { total: 0 } });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewItem, setViewItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = (params: Record<string, string> = {}) => {
    const p: Record<string, string> = {};
    if (search) p.search = search;
    if (statusFilter) p.status = statusFilter;
    Object.assign(p, params);
    enquiryApi.getAll(p).then(r => setData(r.data.data)).catch(() => {});
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { load(); }, [search, statusFilter]);

  const changeStatus = async (id: number, status: string) => {
    try { await enquiryApi.updateStatus(id, status); toast.success("Status updated"); load(); if (viewItem?.id === id) setViewItem({ ...viewItem, status }); }
    catch { toast.error("Failed"); }
  };

  const doDelete = async () => {
    if (!deleteId) return;
    try { await enquiryApi.delete(deleteId); toast.success("Deleted"); setDeleteId(null); load(); }
    catch { toast.error("Failed"); }
  };

  return (
    <>
      <PageHeader title="Enquiries" sub="Track and respond to all customer enquiries." />
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717182]" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-black/10 text-sm" placeholder="Search enquiries..." />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2.5 rounded-lg bg-white border border-black/10 text-sm">
          <option value="">All Status</option><option value="New">New</option><option value="Contacted">Contacted</option><option value="Closed">Closed</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-black/5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#fafaf7]"><tr className="text-left text-xs text-[#717182] uppercase tracking-wider">
            <th className="px-5 py-3">Name</th><th className="px-5 py-3">Company</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Location</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Date</th><th className="px-5 py-3"></th>
          </tr></thead>
          <tbody>{(data.enquiries || []).map((e: any) => (
            <tr key={e.id} className="border-t border-black/5">
              <td className="px-5 py-3.5 text-[#0a1628]">{e.name}</td>
              <td className="px-5 py-3.5 text-[#717182]">{e.company || "—"}</td>
              <td className="px-5 py-3.5 text-[#717182]">{e.email}</td>
              <td className="px-5 py-3.5 text-[#717182]">{e.city_country || "—"}</td>
              <td className="px-5 py-3.5">
                <select value={e.status} onChange={ev => changeStatus(e.id, ev.target.value)} className="text-xs px-2 py-1 rounded border border-black/10 bg-white">
                  <option value="New">New</option><option value="Contacted">Contacted</option><option value="Closed">Closed</option>
                </select>
              </td>
              <td className="px-5 py-3.5 text-[#717182]">{new Date(e.created_at).toLocaleDateString()}</td>
              <td className="px-5 py-3.5"><div className="flex justify-end gap-1">
                <ActionBtn icon={Eye} onClick={() => setViewItem(e)} />
                <ActionBtn icon={Trash2} danger onClick={() => setDeleteId(e.id)} />
              </div></td>
            </tr>
          ))}</tbody>
        </table>
        {(data.enquiries || []).length === 0 && <div className="text-center py-10 text-sm text-[#717182]">No enquiries found</div>}
      </div>

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setViewItem(null)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4"><h3 style={{ fontWeight: 600 }}>Enquiry Details</h3><button onClick={() => setViewItem(null)}><X className="w-5 h-5" /></button></div>
            <div className="space-y-3 text-sm">
              {[["Name", viewItem.name], ["Position", viewItem.position], ["Company", viewItem.company], ["Email", viewItem.email], ["Mobile", viewItem.mobile], ["Location", viewItem.city_country], ["Status", viewItem.status], ["Date", new Date(viewItem.created_at).toLocaleString()]].map(([l, v]) => v && (
                <div key={l as string}><span className="text-[#717182]">{l}: </span><span className="text-[#0a1628]">{v}</span></div>
              ))}
              <div><span className="text-[#717182]">Message:</span><p className="mt-1 p-3 bg-[#fafaf7] rounded-lg text-[#0a1628]">{viewItem.message}</p></div>
            </div>
          </div>
        </div>
      )}
      {deleteId && <ConfirmModal title="Delete Enquiry" message="Are you sure?" onConfirm={doDelete} onCancel={() => setDeleteId(null)} />}
    </>
  );
}

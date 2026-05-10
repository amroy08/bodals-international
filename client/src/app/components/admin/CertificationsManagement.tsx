import { useState, useEffect } from "react";
import { Upload, FileText, Edit, Trash2, Eye, Download, X } from "lucide-react";
import { PageHeader, StatusBadge, ActionBtn, ConfirmModal } from "./AdminShared";
import { certificationApi } from "../../../api/certificationApi";
import toast from "react-hot-toast";

export function CertificationsManagement() {
  const [certs, setCerts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", full_name: "", description: "", status: "active" });
  const [docFile, setDocFile] = useState<File | null>(null);

  const load = () => { certificationApi.getAll().then(r => setCerts(r.data.data || [])).catch(() => {}); };
  useEffect(load, []);

  const openAdd = () => { setEditItem(null); setForm({ name: "", full_name: "", description: "", status: "active" }); setDocFile(null); setShowForm(true); };
  const openEdit = (c: any) => { setEditItem(c); setForm({ name: c.name, full_name: c.full_name || "", description: c.description || "", status: c.status }); setDocFile(null); setShowForm(true); };

  const save = async () => {
    if (!form.name) { toast.error("Name required"); return; }
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (docFile) fd.append("document", docFile);
    try {
      if (editItem) { await certificationApi.update(editItem.id, fd); toast.success("Updated"); }
      else { await certificationApi.create(fd); toast.success("Created"); }
      setShowForm(false); load();
    } catch { toast.error("Save failed"); }
  };

  const doDelete = async () => {
    if (!deleteId) return;
    try { await certificationApi.delete(deleteId); toast.success("Deleted"); setDeleteId(null); load(); }
    catch { toast.error("Delete failed"); }
  };

  return (
    <>
      <PageHeader title="Certification Documents" sub="Upload and manage official certifications." />
      <div className="flex justify-end mb-5">
        <button onClick={openAdd} className="px-4 py-2.5 bg-[#d4af37] text-[#0a1628] rounded-lg text-sm flex items-center gap-1.5"><Upload className="w-4 h-4" /> Upload Certificate</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certs.map(c => (
          <div key={c.id} className="p-5 bg-white rounded-xl border border-black/5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-14 rounded-md bg-gradient-to-br from-[#0a1628] to-[#1e3a8a] flex items-center justify-center text-[#d4af37]"><FileText className="w-5 h-5" /></div>
              <StatusBadge status={c.status} />
            </div>
            <div className="text-[#0a1628] mb-1" style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, fontSize: "1.25rem" }}>{c.name}</div>
            <div className="text-xs text-[#717182] mb-4">{c.full_name || c.description || ""}</div>
            <div className="flex gap-1.5">
              {c.document && <ActionBtn icon={Eye} onClick={() => window.open(`/uploads/${c.document}`, '_blank')} />}
              {c.document && <ActionBtn icon={Download} onClick={() => { const a = document.createElement('a'); a.href = `/uploads/${c.document}`; a.download = c.name; a.click(); }} />}
              <ActionBtn icon={Edit} onClick={() => openEdit(c)} />
              <ActionBtn icon={Trash2} danger onClick={() => setDeleteId(c.id)} />
            </div>
          </div>
        ))}
        {certs.length === 0 && <div className="col-span-3 text-center py-10 text-sm text-[#717182]">No certifications</div>}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4"><h3 style={{ fontWeight: 600 }}>{editItem ? "Edit" : "Add"} Certification</h3><button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button></div>
            <div className="space-y-3">
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Short Name (e.g. IEC) *" className="w-full px-4 py-2.5 rounded-lg bg-[#fafaf7] border border-black/10 text-sm" />
              <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} placeholder="Full Name" className="w-full px-4 py-2.5 rounded-lg bg-[#fafaf7] border border-black/10 text-sm" />
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" rows={3} className="w-full px-4 py-2.5 rounded-lg bg-[#fafaf7] border border-black/10 text-sm" />
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-4 py-2.5 rounded-lg bg-[#fafaf7] border border-black/10 text-sm">
                <option value="active">Active</option><option value="inactive">Inactive</option>
              </select>
              <div><label className="text-sm text-[#717182]">Document (PDF/Image)</label><input type="file" accept=".pdf,.jpg,.png,.webp" onChange={e => setDocFile(e.target.files?.[0] || null)} className="mt-1 text-sm" /></div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border text-sm">Cancel</button>
              <button onClick={save} className="px-4 py-2 rounded-lg bg-[#0a1628] text-white text-sm">Save</button>
            </div>
          </div>
        </div>
      )}
      {deleteId && <ConfirmModal title="Delete Certification" message="Are you sure?" onConfirm={doDelete} onCancel={() => setDeleteId(null)} />}
    </>
  );
}

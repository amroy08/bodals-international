import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye, Package, X } from "lucide-react";
import { PageHeader, StatusBadge, ActionBtn, ConfirmModal } from "./AdminShared";
import { productApi } from "../../../api/productApi";
import toast from "react-hot-toast";

export function ProductsManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", category: "", short_description: "", full_description: "", badges: "", status: "active" });
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState(false);

  const load = () => { productApi.getAll().then(r => setProducts(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openAdd = () => {
    setEditItem(null);
    setForm({ name: "", category: "", short_description: "", full_description: "", badges: "", status: "active" });
    setNewImageFiles([]);
    setSavedImages([]);
    setCustomCategory(false);
    setShowForm(true);
  };

  const openEdit = (p: any) => {
    setEditItem(p);
    const badges = p.badges ? (typeof p.badges === 'string' ? JSON.parse(p.badges) : p.badges).join(', ') : '';
    setForm({ name: p.name, category: p.category, short_description: p.short_description || "", full_description: p.full_description || "", badges, status: p.status });
    setNewImageFiles([]);
    const imgs = p.images ? (typeof p.images === 'string' ? JSON.parse(p.images) : p.images) : [];
    if (imgs.length === 0 && p.image) {
      imgs.push(p.image);
    }
    setSavedImages(imgs);
    setCustomCategory(false);
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name || !form.category) { toast.error("Name and category required"); return; }
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'badges') {
        fd.append(k, JSON.stringify(v.split(',').map((s: string) => s.trim()).filter(Boolean)));
      } else {
        fd.append(k, v);
      }
    });
    fd.append("existing_images", JSON.stringify(savedImages));
    newImageFiles.forEach(file => {
      fd.append("images", file);
    });
    try {
      if (editItem) { await productApi.update(editItem.id, fd); toast.success("Product updated"); }
      else { await productApi.create(fd); toast.success("Product created"); }
      setShowForm(false); load();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Save failed";
      toast.error(msg);
    }
  };

  const doDelete = async () => {
    if (!deleteId) return;
    try { await productApi.delete(deleteId); toast.success("Product deleted"); setDeleteId(null); load(); }
    catch { toast.error("Delete failed"); }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <PageHeader title="Product Management" sub="Add, edit and manage your product portfolio." />
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717182]" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-black/10 text-sm" placeholder="Search products..." />
        </div>
        <button onClick={openAdd} className="px-4 py-2.5 bg-[#d4af37] text-[#0a1628] rounded-lg text-sm flex items-center gap-1.5"><Plus className="w-4 h-4" /> Add Product</button>
      </div>

      <div className="bg-white rounded-xl border border-black/5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#fafaf7]"><tr className="text-left text-xs text-[#717182] uppercase tracking-wider">
            <th className="px-5 py-3">Product</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th>
          </tr></thead>
          <tbody>{filtered.map(p => (
            <tr key={p.id} className="border-t border-black/5">
              <td className="px-5 py-3.5"><div className="flex items-center gap-3">
                {p.image ? <img src={`/api/uploads/${p.image}`} className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-[#0a1628]/5 flex items-center justify-center"><Package className="w-4 h-4 text-[#0a1628]" /></div>}
                <span className="text-[#0a1628]">{p.name}</span>
              </div></td>
              <td className="px-5 py-3.5 text-[#717182]">{p.category}</td>
              <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
              <td className="px-5 py-3.5"><div className="flex justify-end gap-1">
                <ActionBtn icon={Edit} onClick={() => openEdit(p)} />
                <ActionBtn icon={Trash2} danger onClick={() => setDeleteId(p.id)} />
              </div></td>
            </tr>
          ))}</tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-10 text-sm text-[#717182]">{loading ? "Loading..." : "No products found"}</div>}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl my-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#0a1628]" style={{ fontWeight: 600 }}>{editItem ? "Edit" : "Add"} Product</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Product Name *" className="w-full px-4 py-2.5 rounded-lg bg-[#fafaf7] border border-black/10 text-sm" />
              <div>
                {customCategory ? (
                  <div className="flex gap-2">
                    <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="Enter new category name *" className="flex-1 px-4 py-2.5 rounded-lg bg-[#fafaf7] border border-black/10 text-sm" autoFocus />
                    <button type="button" onClick={() => { setCustomCategory(false); setForm({...form, category: ""}); }} className="px-3 py-2 rounded-lg border border-black/10 text-xs text-[#717182] hover:bg-[#fafaf7]">Back</button>
                  </div>
                ) : (
                  <select value={form.category} onChange={e => { if (e.target.value === "__new__") { setCustomCategory(true); setForm({...form, category: ""}); } else { setForm({...form, category: e.target.value}); }}} className="w-full px-4 py-2.5 rounded-lg bg-[#fafaf7] border border-black/10 text-sm">
                    <option value="">Select Category *</option>
                    {[...new Set(products.map((p: any) => p.category))].map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="__new__">＋ Add New Category...</option>
                  </select>
                )}
              </div>
              <input value={form.short_description} onChange={e => setForm({...form, short_description: e.target.value})} placeholder="Short Description" className="w-full px-4 py-2.5 rounded-lg bg-[#fafaf7] border border-black/10 text-sm" />
              <textarea value={form.full_description} onChange={e => setForm({...form, full_description: e.target.value})} placeholder="Full Description" rows={4} className="w-full px-4 py-2.5 rounded-lg bg-[#fafaf7] border border-black/10 text-sm" />
              <input value={form.badges} onChange={e => setForm({...form, badges: e.target.value})} placeholder="Badges (comma-separated)" className="w-full px-4 py-2.5 rounded-lg bg-[#fafaf7] border border-black/10 text-sm" />
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-4 py-2.5 rounded-lg bg-[#fafaf7] border border-black/10 text-sm">
                <option value="active">Active</option><option value="inactive">Inactive</option>
              </select>
              <div>
                <label className="text-sm text-[#717182] block mb-1">Product Images (Can upload multiple)</label>
                <input type="file" accept="image/*" multiple onChange={e => setNewImageFiles(Array.from(e.target.files || []))} className="mt-1 text-sm block w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#d4af37]/10 file:text-[#0a1628] hover:file:bg-[#d4af37]/20" />
                
                {/* Pre-existing Saved Images */}
                {savedImages.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-[#717182] mb-1.5 font-medium">Currently Saved Images:</p>
                    <div className="flex flex-wrap gap-2">
                      {savedImages.map((img, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-black/10 group">
                          <img src={`/api/uploads/${img}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setSavedImages(savedImages.filter((_, i) => i !== idx))} className="absolute inset-0 bg-black/55 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                            <Trash2 className="w-4.5 h-4.5 text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Newly Selected Images Preview */}
                {newImageFiles.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-[#717182] mb-1.5 font-medium">New Images to Upload:</p>
                    <div className="flex flex-wrap gap-2">
                      {newImageFiles.map((file, idx) => {
                        const url = URL.createObjectURL(file);
                        return (
                          <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-black/10 group">
                            <img src={url} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => {
                              const updated = newImageFiles.filter((_, i) => i !== idx);
                              setNewImageFiles(updated);
                            }} className="absolute inset-0 bg-black/55 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                              <Trash2 className="w-4.5 h-4.5 text-red-400" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-5">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-black/10 text-sm">Cancel</button>
              <button onClick={save} className="px-4 py-2 rounded-lg bg-[#0a1628] text-white text-sm">Save</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && <ConfirmModal title="Delete Product" message="Are you sure? This cannot be undone." onConfirm={doDelete} onCancel={() => setDeleteId(null)} />}
    </>
  );
}

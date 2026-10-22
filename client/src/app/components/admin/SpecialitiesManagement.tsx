import { useState } from "react";
import { Plus, Edit, Trash2, Sprout, ShieldCheck, Search, Globe2, Tag, Package, ShoppingBag, Truck, Eye, ScanSearch, Headphones, HeartHandshake, Check, X } from "lucide-react";
import { PageHeader, ActionBtn, ConfirmModal } from "./AdminShared";
import { useWebsite } from "../../../contexts/WebsiteContext";
import { specialityApi } from "../../../api/specialityApi";
import toast from "react-hot-toast";

const AVAILABLE_ICONS = [
  { name: "Sprout", label: "Agriculture / Sprout", Icon: Sprout },
  { name: "ShieldCheck", label: "Certified / Shield", Icon: ShieldCheck },
  { name: "Search", label: "Inspection / Search", Icon: Search },
  { name: "Globe2", label: "Global / Export", Icon: Globe2 },
  { name: "Tag", label: "Pricing / Tag", Icon: Tag },
  { name: "Package", label: "Packaging / Box", Icon: Package },
  { name: "ShoppingBag", label: "Products / Bag", Icon: ShoppingBag },
  { name: "Truck", label: "Logistics / Freight", Icon: Truck },
  { name: "Eye", label: "Transparency / Eye", Icon: Eye },
  { name: "ScanSearch", label: "Traceability / Scan", Icon: ScanSearch },
  { name: "Headphones", label: "24/7 Support", Icon: Headphones },
  { name: "HeartHandshake", label: "Partnership / Trust", Icon: HeartHandshake },
];

export function SpecialitiesManagement() {
  const { specialities, refresh } = useWebsite();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", description: "", icon: "Sprout", sort_order: 0 });
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditingItem(null);
    setForm({ title: "", description: "", icon: "Sprout", sort_order: specialities.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      description: item.description,
      icon: item.icon || "Sprout",
      sort_order: item.sort_order || 0
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      if (editingItem) {
        await specialityApi.update(editingItem.id, form);
        toast.success("Speciality updated successfully");
      } else {
        await specialityApi.create(form);
        toast.success("Speciality created successfully");
      }
      await refresh();
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    if (!deleteId) return;
    try {
      await specialityApi.delete(deleteId);
      toast.success("Deleted successfully");
      await refresh();
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const renderIcon = (iconName: string) => {
    const found = AVAILABLE_ICONS.find(i => i.name === iconName) || AVAILABLE_ICONS[0];
    const IconCmp = found.Icon;
    return <IconCmp className="w-5 h-5 text-[#d4af37]" />;
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <PageHeader 
          title="What Makes Us Different" 
          sub="Manage the core speciality cards displayed in the 'What Makes Us Different' section." 
        />
        <button 
          onClick={openAdd}
          className="px-4 py-2 bg-[#d4af37] text-[#0a1628] rounded-lg text-sm font-semibold hover:bg-[#c29d2f] transition flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Speciality
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {specialities.map((item: any) => (
          <div 
            key={item.id} 
            className="p-5 bg-white rounded-xl border border-black/5 hover:border-[#d4af37]/40 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#0a1628] flex items-center justify-center">
                  {renderIcon(item.icon)}
                </div>
                <span className="text-xs font-mono text-[#717182] bg-slate-100 px-2 py-0.5 rounded">
                  Order: {item.sort_order ?? 0}
                </span>
              </div>
              <h4 className="text-base font-semibold text-[#0a1628] mb-1">{item.title}</h4>
              <p className="text-sm text-[#717182] line-clamp-3">{item.description}</p>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-black/5">
              <ActionBtn icon={Edit} onClick={() => openEdit(item)} />
              <ActionBtn icon={Trash2} danger onClick={() => setDeleteId(item.id)} />
            </div>
          </div>
        ))}
      </div>

      {specialities.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-black/5">
          <p className="text-[#717182] text-sm">No specialities added yet. Click &quot;Add Speciality&quot; to create one.</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="text-lg font-bold text-[#0a1628]">
                {editingItem ? "Edit Speciality Card" : "Add Speciality Card"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#717182] hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#717182] mb-1">
                  Title
                </label>
                <input 
                  type="text" 
                  value={form.title} 
                  onChange={e => setForm({ ...form, title: e.target.value })} 
                  placeholder="e.g. Direct Sourcing" 
                  className="w-full px-3.5 py-2.5 rounded-lg border border-black/10 focus:ring-2 focus:ring-[#d4af37]/40 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#717182] mb-1">
                  Description
                </label>
                <textarea 
                  rows={3} 
                  value={form.description} 
                  onChange={e => setForm({ ...form, description: e.target.value })} 
                  placeholder="Explain why this sets Bodals International apart..." 
                  className="w-full px-3.5 py-2.5 rounded-lg border border-black/10 focus:ring-2 focus:ring-[#d4af37]/40 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#717182] mb-2">
                  Select Icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {AVAILABLE_ICONS.map(i => {
                    const isSelected = form.icon === i.name;
                    const IconComponent = i.Icon;
                    return (
                      <button
                        type="button"
                        key={i.name}
                        onClick={() => setForm({ ...form, icon: i.name })}
                        className={`p-2.5 rounded-lg border flex flex-col items-center gap-1.5 transition text-xs ${
                          isSelected 
                            ? "border-[#d4af37] bg-[#d4af37]/10 text-[#0a1628] font-semibold" 
                            : "border-black/10 hover:border-black/20 text-[#717182]"
                        }`}
                      >
                        <IconComponent className={`w-5 h-5 ${isSelected ? "text-[#0a1628]" : "text-[#717182]"}`} />
                        <span className="truncate w-full text-center text-[10px]">{i.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#717182] mb-1">
                  Display Order
                </label>
                <input 
                  type="number" 
                  value={form.sort_order} 
                  onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} 
                  className="w-full px-3.5 py-2.5 rounded-lg border border-black/10 focus:ring-2 focus:ring-[#d4af37]/40 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-black/10 text-[#717182] hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-[#0a1628] text-white hover:bg-[#1e3a8a] transition disabled:opacity-60 font-semibold"
                >
                  {saving ? "Saving..." : "Save Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <ConfirmModal 
          title="Delete Speciality" 
          message="Are you sure you want to remove this speciality card?" 
          onConfirm={doDelete} 
          onCancel={() => setDeleteId(null)} 
        />
      )}
    </>
  );
}

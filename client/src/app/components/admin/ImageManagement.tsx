import { useState, useEffect } from "react";
import { Upload, Image as ImageIcon, Trash2, Edit, X, Plus } from "lucide-react";
import { PageHeader, ConfirmModal } from "./AdminShared";
import { sectionImageApi } from "../../../api/sectionImageApi";
import toast from "react-hot-toast";

export function ImageManagement() {
  const [images, setImages] = useState<any[]>([]);
  const [section, setSection] = useState("hero");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [caption, setCaption] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");

  const load = () => {
    sectionImageApi.getAll().then(r => setImages(r.data.data || [])).catch(() => {});
  };
  useEffect(load, []);

  const filtered = images.filter(i => i.section === section);

  const openAdd = () => {
    setEditItem(null); setCaption(""); setSortOrder(filtered.length); setImageFile(null); setImageUrl(""); setUploadMode("file"); setShowForm(true);
  };

  const openEdit = (item: any) => {
    setEditItem(item); setCaption(item.caption || ""); setSortOrder(item.sort_order); setImageFile(null); setImageUrl(item.image?.startsWith('http') ? item.image : ""); setUploadMode(item.image?.startsWith('http') ? "url" : "file"); setShowForm(true);
  };

  const save = async () => {
    const fd = new FormData();
    fd.append("section", section);
    fd.append("caption", caption);
    fd.append("sort_order", String(sortOrder));
    fd.append("status", "active");
    if (uploadMode === "file" && imageFile) {
      fd.append("image", imageFile);
    } else if (uploadMode === "url" && imageUrl) {
      fd.append("image_url", imageUrl);
    } else if (!editItem) {
      toast.error("Please provide an image"); return;
    }
    try {
      if (editItem) { await sectionImageApi.update(editItem.id, fd); toast.success("Updated"); }
      else { await sectionImageApi.create(fd); toast.success("Image added"); }
      setShowForm(false); load();
    } catch { toast.error("Save failed"); }
  };

  const doDelete = async () => {
    if (!deleteId) return;
    try { await sectionImageApi.delete(deleteId); toast.success("Deleted"); setDeleteId(null); load(); }
    catch { toast.error("Delete failed"); }
  };

  const getPreview = (img: any) => {
    if (img.image?.startsWith('http')) return img.image;
    return `/uploads/${img.image}`;
  };

  return (
    <>
      <PageHeader title="Section Images" sub="Manage slideshow images for Hero and About sections." />

      <div className="flex items-center gap-3 mb-6">
        {["hero", "about"].map(s => (
          <button key={s} onClick={() => setSection(s)} className={`px-5 py-2.5 rounded-lg text-sm capitalize transition ${section === s ? "bg-[#0a1628] text-white" : "bg-white border border-black/10 text-[#717182] hover:bg-[#fafaf7]"}`}>
            {s === "hero" ? "🏠 Hero Section" : "📖 About Section"}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={openAdd} className="px-4 py-2.5 bg-[#d4af37] text-[#0a1628] rounded-lg text-sm flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Image
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((img, i) => (
          <div key={img.id} className="group relative rounded-xl overflow-hidden border border-black/5 bg-white">
            <div className="relative h-48">
              <img src={getPreview(img)} alt={img.caption} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => openEdit(img)} className="w-10 h-10 rounded-full bg-white text-[#0a1628] flex items-center justify-center hover:bg-[#d4af37] transition">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteId(img.id)} className="w-10 h-10 rounded-full bg-white text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/50 text-white text-xs">#{img.sort_order}</div>
            </div>
            {img.caption && <div className="p-3 text-sm text-[#717182]">{img.caption}</div>}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-[#717182]">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No images for this section. Add one to create a slideshow.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4">
              <h3 style={{ fontWeight: 600 }}>{editItem ? "Edit" : "Add"} Image — {section}</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <button onClick={() => setUploadMode("file")} className={`flex-1 py-2 rounded-lg text-sm ${uploadMode === "file" ? "bg-[#0a1628] text-white" : "bg-[#fafaf7] border"}`}>Upload File</button>
                <button onClick={() => setUploadMode("url")} className={`flex-1 py-2 rounded-lg text-sm ${uploadMode === "url" ? "bg-[#0a1628] text-white" : "bg-[#fafaf7] border"}`}>Image URL</button>
              </div>
              {uploadMode === "file" ? (
                <div>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="text-sm" />
                  {imageFile && <img src={URL.createObjectURL(imageFile)} className="mt-2 h-32 rounded-lg object-cover" />}
                  {editItem && !imageFile && !editItem.image?.startsWith('http') && <img src={`/uploads/${editItem.image}`} className="mt-2 h-32 rounded-lg object-cover" />}
                </div>
              ) : (
                <div>
                  <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full px-4 py-2.5 rounded-lg bg-[#fafaf7] border border-black/10 text-sm" />
                  {imageUrl && <img src={imageUrl} className="mt-2 h-32 rounded-lg object-cover" onError={e => (e.currentTarget.style.display = 'none')} />}
                </div>
              )}
              <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Caption (optional)" className="w-full px-4 py-2.5 rounded-lg bg-[#fafaf7] border border-black/10 text-sm" />
              <input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} placeholder="Sort Order" className="w-full px-4 py-2.5 rounded-lg bg-[#fafaf7] border border-black/10 text-sm" />
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border text-sm">Cancel</button>
              <button onClick={save} className="px-4 py-2 rounded-lg bg-[#0a1628] text-white text-sm">Save</button>
            </div>
          </div>
        </div>
      )}
      {deleteId && <ConfirmModal title="Delete Image" message="Are you sure?" onConfirm={doDelete} onCancel={() => setDeleteId(null)} />}
    </>
  );
}

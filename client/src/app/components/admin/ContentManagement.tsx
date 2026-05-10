import { useState, useEffect } from "react";
import { Edit, Upload } from "lucide-react";
import { PageHeader } from "./AdminShared";
import { websiteApi } from "../../../api/websiteApi";
import toast from "react-hot-toast";

export function ContentManagement() {
  const [settings, setSettings] = useState<any>(null);
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    websiteApi.getSettings().then(r => setSettings(r.data.data)).catch(() => {});
  }, []);

  const fields = [
    { key: "company_name", label: "Company Name" }, { key: "motto", label: "Motto" },
    { key: "hero_title", label: "Hero Title" }, { key: "hero_subtitle", label: "Hero Subtitle" },
    { key: "about_us", label: "About Us" }, { key: "vision", label: "Vision" },
    { key: "purpose", label: "Purpose" }, { key: "mobile", label: "Contact Phone" },
    { key: "email", label: "Contact Email" }, { key: "address", label: "Address" },
    { key: "facebook_url", label: "Facebook URL" }, { key: "instagram_url", label: "Instagram URL" },
    { key: "linkedin_url", label: "LinkedIn URL" }, { key: "whatsapp_url", label: "WhatsApp URL" },
    { key: "footer_text", label: "Footer Text" },
  ];

  const saveField = async () => {
    if (!editField) return;
    try {
      const res = await websiteApi.updateSettings({ [editField]: editValue });
      setSettings(res.data.data);
      setEditField(null);
      toast.success("Updated successfully");
    } catch { toast.error("Update failed"); }
  };

  const uploadLogo = async () => {
    if (!logoFile) return;
    const fd = new FormData();
    fd.append("logo", logoFile);
    try {
      const res = await websiteApi.updateSettings(fd);
      setSettings(res.data.data);
      setLogoFile(null);
      toast.success("Logo updated");
    } catch { toast.error("Upload failed"); }
  };

  if (!settings) return <div className="p-10 text-center text-[#717182]">Loading...</div>;

  return (
    <>
      <PageHeader title="Website Content" sub="Update public-facing content. Changes go live immediately." />

      {/* Logo upload */}
      <div className="p-5 bg-white rounded-xl border border-black/5 mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-xs tracking-wider uppercase text-[#717182]">Logo</div>
          {settings.logo ? <img src={`/uploads/${settings.logo}`} alt="Logo" className="w-12 h-12 rounded-full object-cover border" /> : <span className="text-sm text-[#717182]">No logo uploaded</span>}
        </div>
        <div className="flex items-center gap-2">
          <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] || null)} className="text-sm" />
          {logoFile && <button onClick={uploadLogo} className="px-3 py-1.5 bg-[#d4af37] text-[#0a1628] rounded-lg text-sm flex items-center gap-1"><Upload className="w-3.5 h-3.5" /> Upload</button>}
        </div>
      </div>

      <div className="grid gap-3">
        {fields.map(f => (
          <div key={f.key} className="p-5 bg-white rounded-xl border border-black/5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-xs tracking-wider uppercase text-[#717182] mb-1">{f.label}</div>
              <div className="text-[#0a1628] text-sm whitespace-pre-wrap">{(settings[f.key] || "—").toString().substring(0, 200)}{(settings[f.key] || "").length > 200 ? "..." : ""}</div>
            </div>
            <button onClick={() => { setEditField(f.key); setEditValue(settings[f.key] || ""); }} className="px-3 py-1.5 rounded-lg bg-[#0a1628] text-white text-sm hover:bg-[#1e3a8a] transition flex items-center gap-1">
              <Edit className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editField && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditField(null)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-[#0a1628] mb-4" style={{ fontWeight: 600 }}>Edit {fields.find(f => f.key === editField)?.label}</h3>
            {["about_us", "vision", "purpose", "hero_subtitle", "footer_text"].includes(editField) ? (
              <textarea value={editValue} onChange={e => setEditValue(e.target.value)} rows={8} className="w-full px-4 py-3 rounded-lg bg-[#fafaf7] border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 text-sm" />
            ) : (
              <input value={editValue} onChange={e => setEditValue(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[#fafaf7] border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 text-sm" />
            )}
            <div className="flex gap-2 justify-end mt-4">
              <button onClick={() => setEditField(null)} className="px-4 py-2 rounded-lg border border-black/10 text-sm">Cancel</button>
              <button onClick={saveField} className="px-4 py-2 rounded-lg bg-[#0a1628] text-white text-sm">Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useState, useEffect } from "react";
import { Edit, Upload } from "lucide-react";
import { PageHeader } from "./AdminShared";
import { websiteApi } from "../../../api/websiteApi";
import { useWebsite } from "../../../contexts/WebsiteContext";
import toast from "react-hot-toast";

export function ContentManagement() {
  const { refresh } = useWebsite();
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

  const floatingFields = [
    { key: "whatsapp_number", label: "WhatsApp Number" },
    { key: "whatsapp_default_message", label: "WhatsApp Default Message" },
    { key: "contact_email", label: "Floating Contact Email" },
    { key: "floating_contact_enabled", label: "Floating Contact Buttons", type: "toggle" },
  ];

  const textareaFields = ["about_us", "vision", "purpose", "hero_subtitle", "footer_text", "whatsapp_default_message"];

  const saveField = async () => {
    if (!editField) return;
    try {
      let value: any = editValue;
      if (editField === "floating_contact_enabled") {
        value = editValue === "true" || editValue === "1" ? true : false;
      }
      const res = await websiteApi.updateSettings({ [editField]: value });
      setSettings(res.data.data);
      setEditField(null);
      await refresh();
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
      await refresh();
      toast.success("Logo updated");
    } catch { toast.error("Upload failed"); }
  };

  const getDisplayValue = (key: string, val: any) => {
    if (key === "floating_contact_enabled") {
      return val === 1 || val === true ? "Enabled" : "Disabled";
    }
    return (val || "—").toString().substring(0, 200) + ((val || "").toString().length > 200 ? "..." : "");
  };

  const getEditInitValue = (key: string) => {
    if (key === "floating_contact_enabled") {
      return settings[key] === 1 || settings[key] === true ? "true" : "false";
    }
    return settings[key] || "";
  };

  if (!settings) return <div className="p-10 text-center text-[#717182]">Loading...</div>;

  return (
    <>
      <PageHeader title="Website Content" sub="Update public-facing content. Changes go live immediately." />

      {/* Logo upload */}
      <div className="p-5 bg-white rounded-xl border border-black/5 mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-xs tracking-wider uppercase text-[#717182]">Logo</div>
          {settings.logo ? <img src={`/uploads/${settings.logo}`} alt="Logo" className="h-12 w-auto object-contain border rounded-lg bg-slate-50 p-1" /> : <span className="text-sm text-[#717182]">No logo uploaded</span>}
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
              <div className="text-[#0a1628] text-sm whitespace-pre-wrap">{getDisplayValue(f.key, settings[f.key])}</div>
            </div>
            <button onClick={() => { setEditField(f.key); setEditValue(getEditInitValue(f.key)); }} className="px-3 py-1.5 rounded-lg bg-[#0a1628] text-white text-sm hover:bg-[#1e3a8a] transition flex items-center gap-1">
              <Edit className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
        ))}
      </div>

      {/* Floating Contact Settings */}
      <div className="mt-8 mb-2">
        <h3 className="text-[#0a1628] text-base" style={{ fontWeight: 600 }}>Floating Contact Settings</h3>
        <p className="text-[#717182] text-xs mt-1">Manage the floating WhatsApp and Email quick-contact buttons on the public website.</p>
      </div>
      <div className="grid gap-3">
        {floatingFields.map(f => (
          <div key={f.key} className="p-5 bg-white rounded-xl border border-black/5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-xs tracking-wider uppercase text-[#717182] mb-1">{f.label}</div>
              <div className="text-[#0a1628] text-sm whitespace-pre-wrap">
                {f.key === "floating_contact_enabled" ? (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${settings[f.key] === 1 || settings[f.key] === true ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${settings[f.key] === 1 || settings[f.key] === true ? "bg-emerald-500" : "bg-red-400"}`} />
                    {getDisplayValue(f.key, settings[f.key])}
                  </span>
                ) : (
                  getDisplayValue(f.key, settings[f.key])
                )}
              </div>
            </div>
            <button onClick={() => { setEditField(f.key); setEditValue(getEditInitValue(f.key)); }} className="px-3 py-1.5 rounded-lg bg-[#0a1628] text-white text-sm hover:bg-[#1e3a8a] transition flex items-center gap-1">
              <Edit className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editField && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditField(null)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-[#0a1628] mb-4" style={{ fontWeight: 600 }}>Edit {[...fields, ...floatingFields].find(f => f.key === editField)?.label}</h3>
            {editField === "floating_contact_enabled" ? (
              <select value={editValue} onChange={e => setEditValue(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[#fafaf7] border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 text-sm">
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            ) : textareaFields.includes(editField) ? (
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

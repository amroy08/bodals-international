import { useState, useEffect } from "react";
import { Edit, Upload, FileText, Globe, Bell, Clock, Eye, Download, Check, Sparkles, ShieldAlert } from "lucide-react";
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
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [savingField, setSavingField] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);

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

  const statFields = [
    { key: "stat_quality", label: "Quality First Stat (e.g. 100%)" },
    { key: "stat_reach", label: "Global Reach Stat (e.g. 5 or 5+)" },
    { key: "stat_partnerships", label: "Partnerships Stat (e.g. 10 or 10+)" },
    { key: "stat_shipments", label: "Shipments Stat (e.g. 0)" },
  ];

  const announcementFields = [
    { key: "announcement_enabled", label: "Top Announcement Bar Visible", type: "toggle" },
    { key: "announcement_text", label: "Banner Message Text" },
    { key: "announcement_link", label: "Banner Action Link / URL (e.g. #contact or /#brochure)" },
  ];

  const officeFields = [
    { key: "working_hours", label: "Business & Working Hours (e.g. Mon – Sat: 9:00 AM – 7:00 PM IST)" },
  ];

  const sectionToggles = [
    { key: "section_brochure_enabled", label: "Company Brochure Section Visible", type: "toggle" },
    { key: "section_specialities_enabled", label: "What Makes Us Different Section Visible", type: "toggle" },
    { key: "section_intro_animation_enabled", label: "Cinematic Intro Animation Enabled", type: "toggle" },
    { key: "show_certificates", label: "View Certificate Buttons on Website", type: "toggle" },
  ];

  const seoFields = [
    { key: "seo_meta_title", label: "Page Title (Meta Title)" },
    { key: "seo_meta_description", label: "Meta Description (for Google Search)" },
    { key: "seo_meta_keywords", label: "Meta Keywords (comma separated)" },
  ];

  const legalFields = [
    { key: "privacy_policy", label: "Privacy Policy Document Content" },
    { key: "terms_of_service", label: "Terms of Service Document Content" },
  ];

  const booleanKeys = [
    "floating_contact_enabled",
    "show_certificates",
    "announcement_enabled",
    "section_brochure_enabled",
    "section_specialities_enabled",
    "section_intro_animation_enabled"
  ];

  const textareaFields = [
    "about_us", "vision", "purpose", "hero_subtitle", "footer_text", 
    "whatsapp_default_message", "seo_meta_description", "seo_meta_keywords",
    "privacy_policy", "terms_of_service"
  ];

  const saveField = async () => {
    if (!editField) return;
    setSavingField(true);
    try {
      let value: any = editValue;
      if (booleanKeys.includes(editField)) {
        value = editValue === "true" || editValue === "1" ? true : false;
      }
      const res = await websiteApi.updateSettings({ [editField]: value });
      setSettings(res.data.data);
      setEditField(null);
      await refresh();
      toast.success("Updated successfully");
    } catch { 
      toast.error("Update failed"); 
    } finally { 
      setSavingField(false); 
    }
  };

  const uploadLogo = async () => {
    if (!logoFile) return;
    const fd = new FormData();
    fd.append("logo", logoFile);
    setUploadingLogo(true);
    try {
      const res = await websiteApi.updateSettings(fd);
      setSettings(res.data.data);
      setLogoFile(null);
      await refresh();
      toast.success("Logo updated successfully");
    } catch { 
      toast.error("Logo upload failed"); 
    } finally { 
      setUploadingLogo(false); 
    }
  };

  const uploadBrochure = async () => {
    if (!brochureFile) return;
    const fd = new FormData();
    fd.append("brochure", brochureFile);
    setUploadingBrochure(true);
    try {
      const res = await websiteApi.updateSettings(fd);
      setSettings(res.data.data);
      setBrochureFile(null);
      await refresh();
      toast.success("Company Brochure PDF updated successfully");
    } catch { 
      toast.error("Brochure upload failed"); 
    } finally { 
      setUploadingBrochure(false); 
    }
  };

  const getDisplayValue = (key: string, val: any) => {
    if (booleanKeys.includes(key)) {
      return val === 1 || val === true ? "Enabled" : "Disabled";
    }
    return (val || "—").toString().substring(0, 200) + ((val || "").toString().length > 200 ? "..." : "");
  };

  const getEditInitValue = (key: string) => {
    if (booleanKeys.includes(key)) {
      return settings[key] === 1 || settings[key] === true ? "true" : "false";
    }
    return settings[key] || "";
  };

  if (!settings) return <div className="p-10 text-center text-[#717182]">Loading...</div>;

  const currentPdfUrl = settings.brochure_pdf ? `/api/uploads/${settings.brochure_pdf}` : "/brochure/brochure.pdf";

  return (
    <>
      <PageHeader title="Website Content & Settings" sub="Complete administrative control over all pages, sections, brochure, banner, and metadata." />

      {/* 1. Media Assets: Logo and Brochure PDF */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Logo Upload Card */}
        <div className="p-5 bg-white rounded-xl border border-black/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#717182]">Company Logo</span>
              {settings.logo && <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active</span>}
            </div>
            <div className="h-20 flex items-center justify-center bg-slate-50 border border-dashed rounded-lg p-3 mb-4">
              {settings.logo ? (
                <img src={`/api/uploads/${settings.logo}`} alt="Logo" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-xs text-[#717182]">Default site logo is active</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              accept="image/*" 
              onChange={e => setLogoFile(e.target.files?.[0] || null)} 
              className="text-xs flex-1 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:bg-slate-100" 
              disabled={uploadingLogo} 
            />
            {logoFile && (
              <button 
                onClick={uploadLogo} 
                disabled={uploadingLogo} 
                className={`px-3 py-1.5 bg-[#d4af37] text-[#0a1628] rounded-lg text-xs font-semibold flex items-center gap-1 ${uploadingLogo ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                <Upload className="w-3.5 h-3.5" />
                {uploadingLogo ? "Saving..." : "Save"}
              </button>
            )}
          </div>
        </div>

        {/* Brochure PDF Upload Card */}
        <div className="p-5 bg-white rounded-xl border border-black/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#717182]">Corporate Brochure PDF</span>
              <a 
                href={currentPdfUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs text-[#1e3a8a] hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> View Current PDF
              </a>
            </div>
            <div className="h-20 flex flex-col items-center justify-center bg-slate-50 border border-dashed rounded-lg p-3 mb-4 text-center">
              <FileText className="w-6 h-6 text-[#d4af37] mb-1" />
              <p className="text-xs text-[#0a1628] font-medium truncate max-w-full">
                {settings.brochure_pdf ? settings.brochure_pdf.split('/').pop() : "brochure.pdf (Default)"}
              </p>
              <span className="text-[10px] text-[#717182]">Connected to all Download Brochure buttons</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={e => setBrochureFile(e.target.files?.[0] || null)} 
              className="text-xs flex-1 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:bg-slate-100" 
              disabled={uploadingBrochure} 
            />
            {brochureFile && (
              <button 
                onClick={uploadBrochure} 
                disabled={uploadingBrochure} 
                className={`px-3 py-1.5 bg-[#d4af37] text-[#0a1628] rounded-lg text-xs font-semibold flex items-center gap-1 ${uploadingBrochure ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                <Upload className="w-3.5 h-3.5" />
                {uploadingBrochure ? "Uploading..." : "Upload PDF"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Top Announcement Bar */}
      <div className="mt-8 mb-2 flex items-center gap-2">
        <Bell className="w-4 h-4 text-[#d4af37]" />
        <h3 className="text-[#0a1628] text-base font-semibold">Top Announcement Bar</h3>
      </div>
      <p className="text-[#717182] text-xs mb-3">Display an alert or news banner at the very top of the website with an optional clickable link.</p>
      <div className="grid gap-3 mb-6">
        {announcementFields.map(f => (
          <div key={f.key} className="p-4 bg-white rounded-xl border border-black/5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-xs tracking-wider uppercase text-[#717182] mb-1">{f.label}</div>
              <div className="text-[#0a1628] text-sm whitespace-pre-wrap">
                {f.key === "announcement_enabled" ? (
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

      {/* 3. Section Visibility Toggles */}
      <div className="mt-8 mb-2 flex items-center gap-2">
        <Eye className="w-4 h-4 text-[#d4af37]" />
        <h3 className="text-[#0a1628] text-base font-semibold">Section & Feature Visibility</h3>
      </div>
      <p className="text-[#717182] text-xs mb-3">Turn major modules and sections on or off without altering code.</p>
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {sectionToggles.map(f => (
          <div key={f.key} className="p-4 bg-white rounded-xl border border-black/5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-xs tracking-wider uppercase text-[#717182] mb-1">{f.label}</div>
              <div className="text-[#0a1628] text-sm">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${settings[f.key] === 1 || settings[f.key] === true ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${settings[f.key] === 1 || settings[f.key] === true ? "bg-emerald-500" : "bg-red-400"}`} />
                  {getDisplayValue(f.key, settings[f.key])}
                </span>
              </div>
            </div>
            <button onClick={() => { setEditField(f.key); setEditValue(getEditInitValue(f.key)); }} className="px-3 py-1.5 rounded-lg bg-[#0a1628] text-white text-sm hover:bg-[#1e3a8a] transition flex items-center gap-1">
              <Edit className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
        ))}
      </div>

      {/* 4. SEO & Search Engine Preview */}
      <div className="mt-8 mb-2 flex items-center gap-2">
        <Globe className="w-4 h-4 text-[#d4af37]" />
        <h3 className="text-[#0a1628] text-base font-semibold">SEO & Google Search Preview</h3>
      </div>
      <p className="text-[#717182] text-xs mb-3">Optimize title, meta description, and keywords for search engines and social media shares.</p>

      {/* Live Google Search Card Mockup */}
      <div className="p-5 bg-white rounded-xl border border-black/5 mb-4">
        <div className="text-xs font-semibold text-[#717182] uppercase tracking-wider mb-2">Live Google Snippet Preview</div>
        <div className="max-w-xl font-sans">
          <div className="text-xs text-[#202124] flex items-center gap-1.5 mb-0.5">
            <div className="w-4 h-4 rounded-full bg-[#63091E] text-white text-[9px] flex items-center justify-center font-serif font-bold">B</div>
            <span className="text-xs text-[#202124]">https://bodalsinternational.com</span>
          </div>
          <div className="text-lg text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug">
            {settings.seo_meta_title || "BODALS INTERNATIONAL — Global Export & Sourcing"}
          </div>
          <div className="text-xs text-[#4d5156] mt-1 leading-relaxed">
            {settings.seo_meta_description || "BODALS INTERNATIONAL is a premier Indian merchant exporter delivering premium agricultural commodities, spices, and agro-products worldwide."}
          </div>
        </div>
      </div>

      <div className="grid gap-3 mb-6">
        {seoFields.map(f => (
          <div key={f.key} className="p-4 bg-white rounded-xl border border-black/5 flex items-start justify-between gap-4">
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

      {/* 5. Business Hours */}
      <div className="mt-8 mb-2 flex items-center gap-2">
        <Clock className="w-4 h-4 text-[#d4af37]" />
        <h3 className="text-[#0a1628] text-base font-semibold">Business & Working Hours</h3>
      </div>
      <div className="grid gap-3 mb-6">
        {officeFields.map(f => (
          <div key={f.key} className="p-4 bg-white rounded-xl border border-black/5 flex items-start justify-between gap-4">
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

      {/* 6. General Content Fields */}
      <div className="mt-8 mb-2">
        <h3 className="text-[#0a1628] text-base font-semibold">General Content & Corporate Texts</h3>
      </div>
      <div className="grid gap-3 mb-6">
        {fields.map(f => (
          <div key={f.key} className="p-4 bg-white rounded-xl border border-black/5 flex items-start justify-between gap-4">
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

      {/* 7. Statistics & Numbers */}
      <div className="mt-8 mb-2">
        <h3 className="text-[#0a1628] text-base font-semibold">Website Statistics & Counters</h3>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {statFields.map(f => (
          <div key={f.key} className="p-4 bg-white rounded-xl border border-black/5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-xs tracking-wider uppercase text-[#717182] mb-1">{f.label}</div>
              <div className="text-[#0a1628] text-lg font-bold">
                {getDisplayValue(f.key, settings[f.key])}
              </div>
            </div>
            <button onClick={() => { setEditField(f.key); setEditValue(getEditInitValue(f.key)); }} className="px-3 py-1.5 rounded-lg bg-[#0a1628] text-white text-sm hover:bg-[#1e3a8a] transition flex items-center gap-1">
              <Edit className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
        ))}
      </div>

      {/* 8. Floating Contact Buttons */}
      <div className="mt-8 mb-2">
        <h3 className="text-[#0a1628] text-base font-semibold">Floating Contact Settings</h3>
      </div>
      <div className="grid gap-3 mb-6">
        {floatingFields.map(f => (
          <div key={f.key} className="p-4 bg-white rounded-xl border border-black/5 flex items-start justify-between gap-4">
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

      {/* 9. Legal & Policies (Privacy Policy & Terms of Service) */}
      <div className="mt-8 mb-2 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-[#d4af37]" />
        <h3 className="text-[#0a1628] text-base font-semibold">Terms & Privacy Policies</h3>
      </div>
      <p className="text-[#717182] text-xs mb-3">Update the legal Terms of Service and Privacy Policy displayed in the website footer modals.</p>
      <div className="grid gap-3 mb-6">
        {legalFields.map(f => (
          <div key={f.key} className="p-4 bg-white rounded-xl border border-black/5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-xs tracking-wider uppercase text-[#717182] mb-1">{f.label}</div>
              <div className="text-[#0a1628] text-sm whitespace-pre-wrap max-h-24 overflow-hidden text-ellipsis">
                {settings[f.key] ? getDisplayValue(f.key, settings[f.key]) : <span className="text-[#717182] italic">Using standard default legal policy</span>}
              </div>
            </div>
            <button onClick={() => { setEditField(f.key); setEditValue(getEditInitValue(f.key)); }} className="px-3 py-1.5 rounded-lg bg-[#0a1628] text-white text-sm hover:bg-[#1e3a8a] transition flex items-center gap-1 flex-shrink-0">
              <Edit className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
        ))}
      </div>

      {/* Universal Edit Modal */}
      {editField && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => !savingField && setEditField(null)}>
          <div className={`bg-white rounded-xl p-6 w-full shadow-2xl ${textareaFields.includes(editField) ? "max-w-2xl" : "max-w-lg"}`} onClick={e => e.stopPropagation()}>
            <h3 className="text-[#0a1628] mb-4 font-semibold">
              Edit {[...fields, ...floatingFields, ...statFields, ...sectionToggles, ...announcementFields, ...officeFields, ...seoFields, ...legalFields].find(f => f.key === editField)?.label}
            </h3>
            {booleanKeys.includes(editField) ? (
              <select value={editValue} onChange={e => setEditValue(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[#fafaf7] border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 text-sm" disabled={savingField}>
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            ) : textareaFields.includes(editField) ? (
              <textarea 
                value={editValue} 
                onChange={e => setEditValue(e.target.value)} 
                rows={editField === "privacy_policy" || editField === "terms_of_service" ? 14 : 6} 
                className="w-full px-4 py-3 rounded-lg bg-[#fafaf7] border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 text-sm font-mono leading-relaxed" 
                placeholder="Enter document text or formatted sections..."
                disabled={savingField} 
              />
            ) : (
              <input value={editValue} onChange={e => setEditValue(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[#fafaf7] border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 text-sm" disabled={savingField} />
            )}
            <div className="flex gap-2 justify-end mt-4">
              <button onClick={() => !savingField && setEditField(null)} className={`px-4 py-2 rounded-lg border border-black/10 text-sm ${savingField ? "opacity-50 cursor-not-allowed" : ""}`} disabled={savingField}>Cancel</button>
              <button onClick={saveField} className={`px-4 py-2 rounded-lg bg-[#0a1628] text-white text-sm flex items-center gap-1.5 font-medium ${savingField ? "opacity-75 cursor-not-allowed" : ""}`} disabled={savingField}>
                {savingField ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

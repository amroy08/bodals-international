import { Eye, Edit, Trash2 } from "lucide-react";

export function PageHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-[#0a1628] mb-1" style={{ fontFamily: "Playfair Display, serif", fontSize: "1.75rem", fontWeight: 700 }}>{title}</h1>
      <p className="text-sm text-[#717182]">{sub}</p>
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, trend, accent }: any) {
  return (
    <div className="p-5 bg-white rounded-xl border border-black/5 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent}`}><Icon className="w-5 h-5" /></div>
        {trend && <span className="inline-flex items-center gap-1 text-xs text-emerald-600">{trend}</span>}
      </div>
      <div className="text-[#0a1628]" style={{ fontFamily: "Playfair Display, serif", fontSize: "1.75rem", fontWeight: 700 }}>{value}</div>
      <div className="text-xs text-[#717182] mt-1">{label}</div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    New: "bg-blue-50 text-blue-700", Contacted: "bg-amber-50 text-amber-700",
    Closed: "bg-emerald-50 text-emerald-700", Active: "bg-emerald-50 text-emerald-700",
    active: "bg-emerald-50 text-emerald-700", inactive: "bg-gray-100 text-gray-600",
    Inactive: "bg-gray-100 text-gray-600",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs ${map[status] || "bg-gray-100"}`}>{status}</span>;
}

export function ActionBtn({ icon: Icon, danger, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${danger ? "text-red-500 hover:bg-red-50" : "text-[#717182] hover:bg-[#fafaf7] hover:text-[#0a1628]"}`}>
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

export function ConfirmModal({ title, message, onConfirm, onCancel }: { title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-[#0a1628] mb-2" style={{ fontWeight: 600 }}>{title}</h3>
        <p className="text-sm text-[#717182] mb-6">{message}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-black/10 text-sm">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600">Delete</button>
        </div>
      </div>
    </div>
  );
}

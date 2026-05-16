import { Package, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

type KpiStats = {
  totalBatches: number;
  incompleteBatches: number;
  erpSyncedBatches: number;
  processingBatches: number;
};

export function ManufacturerKpiCards({ stats }: { stats: KpiStats }) {
  const erpPct = stats.totalBatches > 0 ? Math.round((stats.erpSyncedBatches / stats.totalBatches) * 100) : 0;
  const incompletePct = stats.totalBatches > 0 ? Math.round((stats.incompleteBatches / stats.totalBatches) * 100) : 0;
  const complianceScore = erpPct;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

      {/* Total Batches */}
      <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 to-white/40 p-6 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <Package size={18} className="text-slate-500" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">All</span>
        </div>
        <p className="text-4xl font-black text-slate-900 tracking-tight">{stats.totalBatches}</p>
        <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Batch Records</p>
        <div className="mt-4 h-1 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full w-full rounded-full bg-slate-200" />
        </div>
      </div>

      {/* ERP Synced */}
      <div className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/70 to-white/40 p-6 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 size={18} className="text-emerald-600" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">{erpPct}%</span>
        </div>
        <p className="text-4xl font-black text-emerald-700 tracking-tight">{stats.erpSyncedBatches}</p>
        <p className="text-xs font-semibold text-emerald-600/70 mt-1 uppercase tracking-wider">ERP Synced</p>
        <div className="mt-4 h-1 rounded-full bg-emerald-100 overflow-hidden">
          <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: `${erpPct}%` }} />
        </div>
      </div>

      {/* Incomplete */}
      <div className={`rounded-2xl border p-6 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] ${stats.incompleteBatches > 0 ? 'border-amber-200/60 bg-gradient-to-br from-amber-50/70 to-white/40' : 'border-white/60 bg-gradient-to-br from-white/80 to-white/40'}`}>
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stats.incompleteBatches > 0 ? 'bg-amber-100' : 'bg-slate-100'}`}>
            <AlertTriangle size={18} className={stats.incompleteBatches > 0 ? 'text-amber-600' : 'text-slate-400'} />
          </div>
          {stats.incompleteBatches > 0 ? (
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Data requested</span>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Clear</span>
          )}
        </div>
        <p className={`text-4xl font-black tracking-tight ${stats.incompleteBatches > 0 ? 'text-amber-700' : 'text-slate-400'}`}>{stats.incompleteBatches}</p>
        <p className={`text-xs font-semibold mt-1 uppercase tracking-wider ${stats.incompleteBatches > 0 ? 'text-amber-600/70' : 'text-slate-400'}`}>Incomplete</p>
        <div className="mt-4 h-1 rounded-full bg-amber-100 overflow-hidden">
          <div className="h-full rounded-full bg-amber-400 transition-all duration-700" style={{ width: `${incompletePct}%` }} />
        </div>
      </div>

      {/* Compliance Score */}
      <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 to-white/40 p-6 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <ShieldCheck size={18} className="text-emerald-500" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">EU 2023/1542</span>
        </div>
        <p className={`text-4xl font-black tracking-tight ${complianceScore === 100 ? 'text-emerald-600' : complianceScore >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
          {complianceScore}%
        </p>
        <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Batches Compliance Ready</p>
        <div className="mt-4 h-1 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${complianceScore === 100 ? 'bg-emerald-500' : complianceScore >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
            style={{ width: `${complianceScore}%` }}
          />
        </div>
      </div>

    </div>
  );
}

import { Package, AlertTriangle, CheckCircle2, Gauge } from 'lucide-react';

type KpiStats = {
  totalBatches: number;
  incompleteBatches: number;
  erpSyncedBatches: number;
  processingBatches: number;
};

type Props = {
  stats: KpiStats;
  avgReadiness: number;
  totalUnits: number;
};

export function ManufacturerKpiCards({ stats, avgReadiness, totalUnits }: Props) {
  const erpPct = stats.totalBatches > 0 ? Math.round((stats.erpSyncedBatches / stats.totalBatches) * 100) : 0;
  const incompletePct = stats.totalBatches > 0 ? Math.round((stats.incompleteBatches / stats.totalBatches) * 100) : 0;
  const hasIncomplete = stats.incompleteBatches > 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

      {/* Total Batches + Units */}
      <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 to-white/40 p-6 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <Package size={18} className="text-slate-500" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">All</span>
        </div>
        <p className="text-4xl font-black text-slate-900 tracking-tight">{stats.totalBatches}</p>
        <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Batch Records</p>
        <p className="text-[11px] text-slate-500 mt-2 font-medium">
          {totalUnits.toLocaleString()} units tracked
        </p>
        <div className="mt-3 h-1 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full w-full rounded-full bg-slate-200" />
        </div>
      </div>

      {/* Incomplete — Needs Action */}
      <div className={`rounded-2xl border p-6 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all ${
        hasIncomplete
          ? 'border-orange-300/60 bg-gradient-to-br from-orange-50/90 to-white/50 ring-1 ring-orange-200/40'
          : 'border-white/60 bg-gradient-to-br from-white/80 to-white/40'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${hasIncomplete ? 'bg-orange-100' : 'bg-slate-100'}`}>
            <AlertTriangle size={18} className={hasIncomplete ? 'text-orange-600' : 'text-slate-400'} />
          </div>
          {hasIncomplete ? (
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">Action required</span>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Clear</span>
          )}
        </div>
        <p className={`text-4xl font-black tracking-tight ${hasIncomplete ? 'text-orange-700' : 'text-slate-400'}`}>
          {stats.incompleteBatches}
        </p>
        <p className={`text-xs font-semibold mt-1 uppercase tracking-wider ${hasIncomplete ? 'text-orange-600/70' : 'text-slate-400'}`}>
          Incomplete
        </p>
        <p className={`text-[11px] mt-2 font-medium ${hasIncomplete ? 'text-orange-600' : 'text-slate-400'}`}>
          {hasIncomplete ? 'Awaiting supplier data' : 'No action needed'}
        </p>
        <div className={`mt-3 h-1 rounded-full overflow-hidden ${hasIncomplete ? 'bg-orange-100' : 'bg-slate-100'}`}>
          <div
            className={`h-full rounded-full transition-all duration-700 ${hasIncomplete ? 'bg-orange-500' : 'bg-slate-200'}`}
            style={{ width: `${incompletePct}%` }}
          />
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
        <p className="text-[11px] text-emerald-700 mt-2 font-medium">
          Passport issued &amp; compliant
        </p>
        <div className="mt-3 h-1 rounded-full bg-emerald-100 overflow-hidden">
          <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: `${erpPct}%` }} />
        </div>
      </div>

      {/* Avg Readiness */}
      <div className={`rounded-2xl border p-6 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] ${
        avgReadiness === 100
          ? 'border-emerald-200/60 bg-gradient-to-br from-emerald-50/70 to-white/40'
          : avgReadiness >= 70
          ? 'border-white/60 bg-gradient-to-br from-white/80 to-white/40'
          : 'border-orange-200/60 bg-gradient-to-br from-orange-50/60 to-white/40'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            avgReadiness === 100 ? 'bg-emerald-100' : avgReadiness >= 70 ? 'bg-slate-100' : 'bg-orange-100'
          }`}>
            <Gauge size={18} className={
              avgReadiness === 100 ? 'text-emerald-600' : avgReadiness >= 70 ? 'text-slate-500' : 'text-orange-600'
            } />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
            avgReadiness === 100
              ? 'text-emerald-600 bg-emerald-100'
              : avgReadiness >= 70
              ? 'text-slate-500 bg-slate-100'
              : 'text-orange-600 bg-orange-100'
          }`}>Avg</span>
        </div>
        <p className={`text-4xl font-black tracking-tight ${
          avgReadiness === 100 ? 'text-emerald-700' : avgReadiness >= 70 ? 'text-slate-800' : 'text-orange-700'
        }`}>{avgReadiness}%</p>
        <p className={`text-xs font-semibold mt-1 uppercase tracking-wider ${
          avgReadiness === 100 ? 'text-emerald-600/70' : 'text-slate-400'
        }`}>Avg Readiness</p>
        <p className="text-[11px] text-slate-500 mt-2 font-medium">
          Across all batches
        </p>
        <div className="mt-3 h-1 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              avgReadiness === 100 ? 'bg-emerald-500' : avgReadiness >= 70 ? 'bg-slate-400' : 'bg-orange-500'
            }`}
            style={{ width: `${avgReadiness}%` }}
          />
        </div>
      </div>

    </div>
  );
}

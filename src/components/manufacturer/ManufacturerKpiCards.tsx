import { Package, AlertTriangle, CheckCircle, RefreshCcw } from 'lucide-react';

type KpiStats = {
  totalBatches: number;
  incompleteBatches: number;
  erpSyncedBatches: number;
  processingBatches: number;
};

type KpiCardProps = {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
};

function KpiCard({ label, value, icon, colorClass }: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-white bg-white/60 p-6 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className={`mt-1 text-3xl font-bold tracking-tight ${colorClass}`}>{value}</p>
      </div>
    </div>
  );
}

export function ManufacturerKpiCards({ stats }: { stats: KpiStats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard 
        label="Total batches" 
        value={stats.totalBatches} 
        icon={<Package size={20} className="text-slate-400" />}
        colorClass="text-slate-900" 
      />
      <KpiCard 
        label="Incomplete" 
        value={stats.incompleteBatches} 
        icon={<AlertTriangle size={20} className="text-amber-500" />}
        colorClass="text-amber-600" 
      />
      <KpiCard 
        label="ERP synced" 
        value={stats.erpSyncedBatches} 
        icon={<CheckCircle size={20} className="text-emerald-500" />}
        colorClass="text-emerald-600" 
      />
      <KpiCard 
        label="Processing" 
        value={stats.processingBatches} 
        icon={<RefreshCcw size={20} className="text-slate-400" />}
        colorClass="text-slate-500" 
      />
    </div>
  );
}

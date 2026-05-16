type KpiStats = {
  totalBatches: number;
  incompleteBatches: number;
  erpSyncedBatches: number;
  processingBatches: number;
};

type KpiCardProps = {
  label: string;
  value: number;
  colorClass: string;
};

function KpiCard({ label, value, colorClass }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${colorClass}`}>{value}</p>
    </div>
  );
}

export function ManufacturerKpiCards({ stats }: { stats: KpiStats }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <KpiCard label="Total batches" value={stats.totalBatches} colorClass="text-zinc-900" />
      <KpiCard label="Incomplete" value={stats.incompleteBatches} colorClass="text-amber-600" />
      <KpiCard label="ERP synced" value={stats.erpSyncedBatches} colorClass="text-green-600" />
      <KpiCard label="Processing" value={stats.processingBatches} colorClass="text-zinc-500" />
    </div>
  );
}

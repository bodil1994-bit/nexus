import { getBatchStatusLabel } from '@/lib/manufacturer/dashboardStats';

export function BatchStatusBadge({ status }: { status: string }) {
  const label = getBatchStatusLabel(status);

  const colorClass =
    status === 'INCOMPLETE'
      ? 'bg-amber-100 text-amber-800'
      : status === 'ERP_SYNCED'
        ? 'bg-green-100 text-green-800'
        : 'bg-zinc-100 text-zinc-600';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {label}
    </span>
  );
}

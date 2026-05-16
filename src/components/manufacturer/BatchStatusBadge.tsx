import { getBatchStatusLabel } from '@/lib/manufacturer/dashboardStats';

export function BatchStatusBadge({ status }: { status: string }) {
  const label = getBatchStatusLabel(status);

  let styles = '';
  switch (status) {
    case 'INCOMPLETE':
      styles = 'bg-amber-100 text-amber-700 border border-amber-200/50';
      break;
    case 'ERP_SYNCED':
      styles = 'bg-emerald-100 text-emerald-700 border border-emerald-200/50';
      break;
    case 'PROCESSING':
    default:
      styles = 'bg-slate-100 text-slate-600 border border-slate-200/50';
      break;
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles} shadow-sm`}
    >
      {label}
    </span>
  );
}

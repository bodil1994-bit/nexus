import { parseMissingFields } from '@/lib/manufacturer/dashboardStats';
import { BatchStatusBadge } from './BatchStatusBadge';
import { Eye, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export type BatchPassport = {
  id: string;
  passportId?: string | null;
  passportType: string;
  passportUrl?: string | null;
  batteryData?: Record<string, unknown> | null;
};

export type BatchRow = {
  id: string;
  batchNumber: string;
  manufacturerSku: string;
  quantity: number;
  status: string;
  missingFieldsJson?: string | null;
  readinessScore: number;
  supplierNotifiedAt?: string | null;
  erpSyncedAt?: string | null;
  erpPayloadJson?: string | null;
  passport?: BatchPassport | null;
};

export type OrderRow = {
  id: string;
  orderNumber: string;
  supplier: { id: string; name: string; email?: string | null };
  manufacturer: { id: string; name: string };
  batches: BatchRow[];
};

type Props = {
  orders: OrderRow[];
  onSelectBatch: (batchId: string) => void;
};

function ReadinessBar({ score }: { score: number }) {
  const color = score === 100 ? 'bg-emerald-500' : score >= 70 ? 'bg-amber-400' : 'bg-red-400';
  const textColor = score === 100 ? 'text-emerald-700' : score >= 70 ? 'text-amber-700' : 'text-red-600';
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-[10px] font-bold tabular-nums ${textColor}`}>{score}%</span>
    </div>
  );
}

export function ManufacturerBatchTable({ orders, onSelectBatch }: Props) {
  const rows = orders.flatMap((order) =>
    order.batches.map((batch) => ({ order, batch })),
  );

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 to-white/40 shadow-[0_2px_16px_rgba(0,0,0,0.06)] backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-left">
              <th className="px-6 py-4 font-semibold text-slate-500">Order</th>
              <th className="px-6 py-4 font-semibold text-slate-500">Supplier</th>
              <th className="px-6 py-4 font-semibold text-slate-500">Batch</th>
              <th className="px-6 py-4 font-semibold text-slate-500">Passport ID</th>
              <th className="px-6 py-4 font-semibold text-slate-500">Readiness</th>
              <th className="px-6 py-4 font-semibold text-slate-500">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-500">Integration</th>
              <th className="px-6 py-4 font-semibold text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map(({ order, batch }) => {
              const missing = parseMissingFields(batch.missingFieldsJson);
              return (
                <tr key={batch.id} className="group transition-colors hover:bg-white/40">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-slate-900 font-medium">{order.orderNumber}</div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase tracking-tight">{batch.manufacturerSku}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600">{order.supplier.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-slate-900 font-medium">{batch.batchNumber}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-tight">{batch.quantity} units</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      {batch.passport?.passportId ?? 'PENDING'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ReadinessBar score={batch.readinessScore} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1.5">
                      <BatchStatusBadge status={batch.status} />
                      {batch.status === 'INCOMPLETE' && missing.length > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-amber-600">
                          <AlertCircle size={10} />
                          <span>{missing.length} fields missing</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {batch.supplierNotifiedAt ? (
                          <CheckCircle2 size={13} className="text-emerald-500" />
                        ) : (
                          <Clock size={13} className="text-slate-300" />
                        )}
                        <span className={`text-[11px] ${batch.supplierNotifiedAt ? 'text-slate-700' : 'text-slate-400'}`}>
                          Supplier notified
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {batch.status === 'ERP_SYNCED' ? (
                          <CheckCircle2 size={13} className="text-emerald-500" />
                        ) : (
                          <Clock size={13} className="text-slate-300" />
                        )}
                        <span className={`text-[11px] ${batch.status === 'ERP_SYNCED' ? 'text-slate-700' : 'text-slate-400'}`}>
                          ERP synced
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onSelectBatch(batch.id)}
                      className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                    >
                      <Eye size={13} />
                      View Detail
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

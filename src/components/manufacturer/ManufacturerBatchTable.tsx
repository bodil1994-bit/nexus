import { parseMissingFields } from '@/lib/manufacturer/dashboardStats';
import { BatchStatusBadge } from './BatchStatusBadge';
import { Eye, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

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
  const color = score === 100 ? 'bg-emerald-500' : score >= 70 ? 'bg-amber-400' : 'bg-orange-500';
  const textColor = score === 100 ? 'text-emerald-700' : score >= 70 ? 'text-amber-700' : 'text-orange-600';
  return (
    <div className="flex items-center gap-2 min-w-[72px]">
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
    <div className="overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 to-white/40 shadow-[0_2px_16px_rgba(0,0,0,0.06)] backdrop-blur-xl">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50 text-left">
            <th className="px-4 py-3 font-semibold text-slate-500 text-xs">Order / Supplier</th>
            <th className="px-4 py-3 font-semibold text-slate-500 text-xs">Batch</th>
            <th className="px-4 py-3 font-semibold text-slate-500 text-xs">Passport ID</th>
            <th className="px-4 py-3 font-semibold text-slate-500 text-xs">Readiness</th>
            <th className="px-4 py-3 font-semibold text-slate-500 text-xs">Status</th>
            <th className="px-4 py-3 font-semibold text-slate-500 text-xs text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map(({ order, batch }) => {
            const missing = parseMissingFields(batch.missingFieldsJson);
            const isIncomplete = batch.status === 'INCOMPLETE';
            return (
              <tr key={batch.id} className={`group transition-colors ${isIncomplete ? 'bg-orange-50/40 hover:bg-orange-50/60' : 'hover:bg-white/40'}`}>
                {/* Order + Supplier */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-slate-900 font-medium text-xs">{order.orderNumber}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{order.supplier.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{batch.manufacturerSku}</div>
                </td>

                {/* Batch */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-slate-900 font-medium text-xs">{batch.batchNumber}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{batch.quantity} units</div>
                </td>

                {/* Passport ID */}
                <td className="px-4 py-3 whitespace-nowrap">
                  {batch.passport?.passportId ? (
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-[10px] text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 whitespace-nowrap w-fit">
                        {batch.passport.passportId}
                      </span>
                      {batch.status === 'ERP_SYNCED' && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-600 mt-0.5">
                          <CheckCircle2 size={10} />
                          <span>ERP synced</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="font-mono text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 w-fit">
                      PENDING
                    </span>
                  )}
                </td>

                {/* Readiness */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <ReadinessBar score={batch.readinessScore} />
                </td>

                {/* Status */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <BatchStatusBadge status={batch.status} />
                    {isIncomplete && missing.length > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-orange-600">
                        <AlertTriangle size={10} />
                        <span>{missing.length} fields missing</span>
                      </div>
                    )}
                    {batch.supplierNotifiedAt && isIncomplete && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Clock size={10} />
                        <span>Notified {new Date(batch.supplierNotifiedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                      </div>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => onSelectBatch(batch.id)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                  >
                    <Eye size={12} />
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

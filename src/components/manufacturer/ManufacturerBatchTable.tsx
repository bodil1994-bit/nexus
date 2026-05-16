import { parseMissingFields } from '@/lib/manufacturer/dashboardStats';
import { BatchStatusBadge } from './BatchStatusBadge';

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

export function ManufacturerBatchTable({ orders, onSelectBatch }: Props) {
  const rows = orders.flatMap((order) =>
    order.batches.map((batch) => ({ order, batch })),
  );

  return (
    <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-left">
            <th className="px-4 py-3 font-medium text-zinc-500">Order</th>
            <th className="px-4 py-3 font-medium text-zinc-500">Supplier</th>
            <th className="px-4 py-3 font-medium text-zinc-500">Batch</th>
            <th className="px-4 py-3 font-medium text-zinc-500">SKU</th>
            <th className="px-4 py-3 font-medium text-zinc-500">Qty</th>
            <th className="px-4 py-3 font-medium text-zinc-500">Passport ID</th>
            <th className="px-4 py-3 font-medium text-zinc-500">Status</th>
            <th className="px-4 py-3 font-medium text-zinc-500">Missing Fields</th>
            <th className="px-4 py-3 font-medium text-zinc-500">Supplier Notified</th>
            <th className="px-4 py-3 font-medium text-zinc-500">ERP Sync</th>
            <th className="px-4 py-3 font-medium text-zinc-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ order, batch }) => {
            const missing = parseMissingFields(batch.missingFieldsJson);
            return (
              <tr
                key={batch.id}
                className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50"
              >
                <td className="px-4 py-3 text-zinc-700">{order.orderNumber}</td>
                <td className="px-4 py-3 text-zinc-700">{order.supplier.name}</td>
                <td className="px-4 py-3 text-zinc-700">{batch.batchNumber}</td>
                <td className="px-4 py-3 text-zinc-700">{batch.manufacturerSku}</td>
                <td className="px-4 py-3 text-zinc-700">{batch.quantity}</td>
                <td className="px-4 py-3 text-zinc-500">
                  {batch.passport?.passportId ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <BatchStatusBadge status={batch.status} />
                </td>
                <td className="px-4 py-3">
                  {batch.status === 'INCOMPLETE' && missing.length > 0 ? (
                    <span className="text-amber-700">{missing.length} missing</span>
                  ) : (
                    <span className="text-zinc-400">—</span>
                  )}
                  {batch.supplierNotifiedAt &&
                    batch.status === 'INCOMPLETE' && (
                      <p className="mt-0.5 text-xs text-zinc-500">
                        Data requested from supplier
                      </p>
                    )}
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {batch.supplierNotifiedAt ? (
                    <span className="text-zinc-600">Data requested from supplier</span>
                  ) : (
                    <span className="text-zinc-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {batch.status === 'ERP_SYNCED' ? (
                    <span className="text-green-700">ERP sync complete</span>
                  ) : (
                    <span className="text-zinc-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onSelectBatch(batch.id)}
                    className="rounded-md bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-200"
                  >
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

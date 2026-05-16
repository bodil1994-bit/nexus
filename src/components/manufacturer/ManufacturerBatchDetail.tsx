import { parseMissingFields } from '@/lib/manufacturer/dashboardStats';
import { BatchStatusBadge } from './BatchStatusBadge';
import { MissingFieldsList } from './MissingFieldsList';
import { ErpPayloadPreview } from './ErpPayloadPreview';
import type { OrderRow, BatchRow } from './ManufacturerBatchTable';

type Props = {
  order: OrderRow;
  batch: BatchRow;
  onClose: () => void;
};

const PASSPORT_DATA_FIELDS: [string, string][] = [
  ['batteryModel', 'Battery Model'],
  ['batteryChemistry', 'Battery Chemistry'],
  ['manufacturerName', 'Manufacturer Name'],
  ['manufactureYear', 'Manufacture Year'],
  ['grossCapacityKwh', 'Gross Capacity (kWh)'],
  ['carbonFootprintKgCo2ePerKwh', 'Carbon Footprint (kg CO2e/kWh)'],
  ['recycledCobaltPercentage', 'Recycled Cobalt (%)'],
  ['recycledLithiumPercentage', 'Recycled Lithium (%)'],
  ['declarationOfConformityRef', 'Declaration of Conformity Reference'],
  ['qrCodeAffixed', 'QR Code Affixed'],
];

export function ManufacturerBatchDetail({ order, batch, onClose }: Props) {
  const missingFields = parseMissingFields(batch.missingFieldsJson);
  const batteryData = batch.passport?.batteryData as Record<string, unknown> | null | undefined;

  return (
    <div className="mt-6 rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
        <h2 className="text-base font-semibold text-zinc-900">Batch Detail</h2>
        <button
          onClick={onClose}
          className="text-sm text-zinc-500 hover:text-zinc-700"
        >
          Close
        </button>
      </div>

      <div className="space-y-6 px-6 py-4">
        <section>
          <h3 className="mb-3 text-sm font-medium text-zinc-700">Batch Summary</h3>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-zinc-500">Order</dt>
              <dd className="text-zinc-900">{order.orderNumber}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Supplier</dt>
              <dd className="text-zinc-900">{order.supplier.name}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Batch</dt>
              <dd className="text-zinc-900">{batch.batchNumber}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">SKU</dt>
              <dd className="text-zinc-900">{batch.manufacturerSku}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Quantity</dt>
              <dd className="text-zinc-900">{batch.quantity}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Status</dt>
              <dd>
                <BatchStatusBadge status={batch.status} />
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">Passport ID</dt>
              <dd className="text-zinc-900">{batch.passport?.passportId ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Readiness Score</dt>
              <dd className="text-zinc-900">{batch.readinessScore}%</dd>
            </div>
            {batch.passport?.passportUrl && (
              <div className="col-span-2">
                <dt className="text-zinc-500">Passport URL</dt>
                <dd className="break-all text-zinc-900">{batch.passport.passportUrl}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="border-t border-zinc-100 pt-6">
          <h3 className="mb-3 text-sm font-medium text-zinc-700">Missing Information</h3>
          <MissingFieldsList
            missingFields={missingFields}
            supplierEmail={order.supplier.email}
            supplierNotifiedAt={batch.supplierNotifiedAt}
          />
        </section>

        <section className="border-t border-zinc-100 pt-6">
          <h3 className="mb-3 text-sm font-medium text-zinc-700">ERP Sync</h3>
          <ErpPayloadPreview
            status={batch.status}
            erpSyncedAt={batch.erpSyncedAt}
            erpPayloadJson={batch.erpPayloadJson}
            orderNumber={order.orderNumber}
            batchNumber={batch.batchNumber}
            passportReferenceId={batch.passport?.passportId}
          />
        </section>

        {batteryData && (
          <section className="border-t border-zinc-100 pt-6">
            <h3 className="mb-3 text-sm font-medium text-zinc-700">Passport Data</h3>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {PASSPORT_DATA_FIELDS.map(([key, label]) => (
                <div key={key}>
                  <dt className="text-zinc-500">{label}</dt>
                  <dd className="text-zinc-900">
                    {batteryData[key] != null ? String(batteryData[key]) : '—'}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>
    </div>
  );
}

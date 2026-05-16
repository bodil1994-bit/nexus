import { parseMissingFields } from '@/lib/manufacturer/dashboardStats';
import { BatchStatusBadge } from './BatchStatusBadge';
import { MissingFieldsList } from './MissingFieldsList';
import { ErpPayloadPreview } from './ErpPayloadPreview';
import { BatchActions } from './BatchActions';
import type { OrderRow, BatchRow } from './ManufacturerBatchTable';
import { X, Info, Database, FileText, Activity, ExternalLink } from 'lucide-react';

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
  ['declarationOfConformityRef', 'Compliance Ref'],
  ['qrCodeAffixed', 'QR Code Affixed'],
];

export function ManufacturerBatchDetail({ order, batch, onClose }: Props) {
  const missingFields = parseMissingFields(batch.missingFieldsJson);
  const batteryData = batch.passport?.batteryData as Record<string, unknown> | null | undefined;

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-white/85 to-white/50 shadow-[0_2px_16px_rgba(0,0,0,0.06)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5 bg-white/50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
            <Activity size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Batch Analysis</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Order <span className="text-slate-900 font-mono font-medium">#{order.orderNumber}</span> • Batch <span className="text-slate-900 font-mono font-medium">#{batch.batchNumber}</span>
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-full w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-colors shadow-sm"
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        {/* Main Content Area */}
        <div className="lg:col-span-2 p-8 space-y-10">
          
          {/* Summary Grid */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Info size={16} className="text-emerald-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700/70">Batch Summary</h3>
            </div>
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-1">
                <dt className="text-slate-400 font-medium">Supplier</dt>
                <dd className="text-slate-900 font-medium">{order.supplier.name}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-slate-400 font-medium">Manufacturer SKU</dt>
                <dd className="text-slate-900 font-mono">{batch.manufacturerSku}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-slate-400 font-medium">Quantity</dt>
                <dd className="text-slate-900 font-medium">{batch.quantity} units</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-slate-400 font-medium">Passport ID</dt>
                <dd className="text-slate-900 font-mono">{batch.passport?.passportId ?? 'PENDING'}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-slate-400 font-medium">Readiness</dt>
                <dd className="text-slate-900 font-bold">{batch.readinessScore}%</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-slate-400 font-medium">Status</dt>
                <dd><BatchStatusBadge status={batch.status} /></dd>
              </div>
            </dl>
          </section>

          {/* Missing Information Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} className="text-amber-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700/70">Missing Information</h3>
            </div>
            <div className="rounded-xl border border-slate-100 bg-white/40 p-6 shadow-sm">
              <MissingFieldsList
                missingFields={missingFields}
                supplierEmail={order.supplier.email}
                supplierNotifiedAt={batch.supplierNotifiedAt}
              />
            </div>
          </section>

          {/* Passport Data Section */}
          {batteryData && (
            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-emerald-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700/70">Extracted Passport Data</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4 text-sm bg-slate-50/50 rounded-xl border border-slate-100 p-6">
                {PASSPORT_DATA_FIELDS.map(([key, label]) => (
                  <div key={key} className="space-y-1">
                    <dt className="text-slate-400 font-medium">{label}</dt>
                    <dd className="text-slate-700">
                      {batteryData[key] != null ? String(batteryData[key]) : '—'}
                    </dd>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Actions Area */}
        <div className="p-8 bg-slate-50/30 space-y-10">
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Database size={16} className="text-emerald-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700/70">ERP Integration</h3>
            </div>
            <ErpPayloadPreview
              status={batch.status}
              erpSyncedAt={batch.erpSyncedAt}
              erpPayloadJson={batch.erpPayloadJson}
              orderNumber={order.orderNumber}
              batchNumber={batch.batchNumber}
              passportReferenceId={batch.passport?.passportId}
            />
          </section>

          <section className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Available Actions</h3>
            <BatchActions
              batchId={batch.id}
              status={batch.status}
              supplierNotifiedAt={batch.supplierNotifiedAt}
              erpPayloadJson={batch.erpPayloadJson}
              orderNumber={order.orderNumber}
              batchNumber={batch.batchNumber}
              passportReferenceId={batch.passport?.passportId}
            />
          </section>
          
          {batch.status === 'ERP_SYNCED' && batch.passport?.passportUrl && (
            <div className="pt-6 border-t border-slate-100">
              <a
                href={batch.passport.passportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-sm"
              >
                View Customer Passport
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AlertCircle({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

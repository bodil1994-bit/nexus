import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

type Props = {
  status: string;
  erpSyncedAt?: string | null;
  erpPayloadJson?: string | null;
  orderNumber: string;
  batchNumber: string;
  passportReferenceId?: string | null;
};

export function ErpPayloadPreview({
  status,
  erpSyncedAt,
  erpPayloadJson,
  orderNumber,
  batchNumber,
  passportReferenceId,
}: Props) {
  if (status === 'INCOMPLETE') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-orange-200 bg-orange-50 text-orange-700 shadow-sm">
        <AlertCircle size={18} />
        <p className="text-sm font-medium">ERP sync blocked: Required fields missing.</p>
      </div>
    );
  }

  if (status === 'PROCESSING') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 shadow-sm">
        <Clock size={18} />
        <p className="text-sm font-medium">ERP sync pending processing result.</p>
      </div>
    );
  }

  let parsed: Record<string, unknown> = {};
  try {
    parsed = erpPayloadJson ? JSON.parse(erpPayloadJson) : {};
  } catch {
    parsed = {};
  }

  const preview = {
    orderNumber: parsed.orderNumber ?? orderNumber,
    batchNumber: parsed.batchNumber ?? batchNumber,
    passportReferenceId: parsed.passportReferenceId ?? passportReferenceId ?? null,
    syncTimestamp: erpSyncedAt,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm">
        <CheckCircle2 size={18} />
        <div>
          <p className="text-sm font-bold uppercase tracking-wider">ERP Synced Successfully</p>
          {erpSyncedAt && (
            <p className="text-[10px] opacity-70 mt-0.5">
              Authorized: {new Date(erpSyncedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>
      
      <div className="relative group">
        <div className="absolute inset-0 bg-emerald-500/5 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <pre className="relative overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-5 text-[11px] font-mono text-emerald-700 leading-relaxed scrollbar-hide shadow-inner">
          {JSON.stringify(preview, null, 2)}
        </pre>
      </div>
    </div>
  );
}

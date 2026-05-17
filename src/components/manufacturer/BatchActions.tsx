'use client';

import { useState } from 'react';
import { Sparkles, Download, FileJson, AlertCircle, Clock } from 'lucide-react';

type Props = {
  batchId: string;
  status: string;
  supplierNotifiedAt?: string | null;
  erpPayloadJson?: string | null;
  orderNumber: string;
  batchNumber: string;
  passportReferenceId?: string | null;
};

export function BatchActions({
  batchId,
  status,
  supplierNotifiedAt,
  erpPayloadJson,
  orderNumber,
  batchNumber,
  passportReferenceId,
}: Props) {
  const [showErpPayload, setShowErpPayload] = useState(false);

  if (status === 'INCOMPLETE') {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-100 bg-white p-4 opacity-50 cursor-not-allowed group shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <Sparkles size={16} />
            <p className="text-sm font-bold uppercase tracking-wider">Enrichment</p>
          </div>
          <p className="text-xs text-slate-500">
            Enrichment unavailable until passport data is complete.
          </p>
        </div>
        
        <div className="rounded-xl border border-slate-100 bg-white p-4 opacity-50 cursor-not-allowed shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <Download size={16} />
            <p className="text-sm font-bold uppercase tracking-wider">Retailer export</p>
          </div>
          <p className="text-xs text-slate-500">
            Export unavailable until passport data is complete.
          </p>
        </div>

        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 flex items-start gap-3 shadow-sm">
          <AlertCircle size={16} className="text-orange-600 mt-0.5" />
          <div>
             <p className="text-xs font-bold text-orange-700 uppercase tracking-tight">Sync Blocked</p>
             {supplierNotifiedAt && (
               <p className="text-[10px] text-orange-600/80 mt-1">Information request sent to supplier.</p>
             )}
          </div>
        </div>
      </div>
    );
  }

  if (status === 'PROCESSING') {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-3 shadow-sm">
          <Clock size={16} className="text-slate-400" />
          <p className="text-xs font-medium text-slate-500">Sync pending processing...</p>
        </div>
        
        <div className="rounded-xl border border-slate-100 bg-white p-4 opacity-50 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Enrichment</p>
          <p className="text-[10px] text-slate-500">Available after processing.</p>
        </div>
      </div>
    );
  }

  if (status === 'ERP_SYNCED') {
    let erpPreview: Record<string, unknown> = {};
    try {
      erpPreview = erpPayloadJson ? JSON.parse(erpPayloadJson) : {};
    } catch {
      erpPreview = {};
    }
    const finalPayload = {
      orderNumber: erpPreview.orderNumber ?? orderNumber,
      batchNumber: erpPreview.batchNumber ?? batchNumber,
      passportReferenceId: erpPreview.passportReferenceId ?? passportReferenceId ?? null,
    };

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <a
            href={`/api/batches/${batchId}/enrichment`}
            className="flex items-center justify-between w-full rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-emerald-700 hover:bg-emerald-100 transition-all group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Sparkles size={18} />
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-wider">View Enrichment</p>
                <p className="text-[10px] opacity-70">AI-powered insights</p>
              </div>
            </div>
          </a>

          <a
            href={`/api/batches/${batchId}/retailer-passport`}
            className="flex items-center justify-between w-full rounded-xl bg-white border border-slate-200 p-4 text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Download size={18} className="text-slate-400" />
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-wider">Retailer Export</p>
                <p className="text-[10px] text-slate-500">Generate compliance PDF</p>
              </div>
            </div>
          </a>
        </div>

        <button
          onClick={() => setShowErpPayload((v) => !v)}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors pl-1"
        >
          <FileJson size={14} />
          {showErpPayload ? 'Hide ERP Payload' : 'View ERP Payload'}
        </button>

        {showErpPayload && (
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 animate-in fade-in zoom-in-95 duration-200 shadow-inner">
             <pre className="text-[10px] font-mono text-emerald-700/80 leading-relaxed overflow-x-auto">
               {JSON.stringify(finalPayload, null, 2)}
             </pre>
          </div>
        )}
      </div>
    );
  }

  return null;
}

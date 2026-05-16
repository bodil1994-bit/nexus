'use client';

import { useState } from 'react';

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
      <div className="space-y-3">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-800">Enrichment unavailable</p>
          <p className="mt-1 text-sm text-amber-700">
            Enrichment unavailable until passport data is complete enough.
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-800">Retailer export unavailable</p>
          <p className="mt-1 text-sm text-amber-700">
            Retailer export unavailable until passport data is complete enough.
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-sm text-zinc-600">ERP sync blocked.</p>
          {supplierNotifiedAt && (
            <p className="mt-1 text-sm text-zinc-500">Data requested from supplier.</p>
          )}
        </div>
      </div>
    );
  }

  if (status === 'PROCESSING') {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-sm text-zinc-600">ERP sync pending processing result.</p>
        </div>
        <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 opacity-50">
          <p className="text-sm font-medium text-zinc-500">Enrichment</p>
          <p className="mt-1 text-xs text-zinc-400">
            Available once processing is complete.
          </p>
        </div>
        <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 opacity-50">
          <p className="text-sm font-medium text-zinc-500">Retailer export</p>
          <p className="mt-1 text-xs text-zinc-400">
            Available once processing is complete.
          </p>
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
    const payload = {
      orderNumber: erpPreview.orderNumber ?? orderNumber,
      batchNumber: erpPreview.batchNumber ?? batchNumber,
      passportReferenceId: erpPreview.passportReferenceId ?? passportReferenceId ?? null,
    };

    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <p className="mb-3 text-sm font-medium text-zinc-700">Enrichment</p>
          <p className="mb-3 text-xs text-zinc-500">
            Provides an enriched view of the battery passport data with computed scores and
            regulatory references. This endpoint is not yet live.
          </p>
          <a
            href={`/api/batches/${batchId}/enrichment`}
            className="inline-flex items-center rounded-md bg-zinc-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700"
          >
            View enrichment
          </a>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <p className="mb-3 text-sm font-medium text-zinc-700">Retailer export</p>
          <p className="mb-3 text-xs text-zinc-500">
            Exports a retailer-facing passport summary suitable for product listing and
            compliance documentation. This endpoint is not yet live.
          </p>
          <a
            href={`/api/batches/${batchId}/retailer-passport`}
            className="inline-flex items-center rounded-md bg-zinc-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700"
          >
            Retailer export
          </a>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-700">ERP payload</p>
            <button
              onClick={() => setShowErpPayload((v) => !v)}
              className="text-xs text-zinc-500 hover:text-zinc-700"
            >
              {showErpPayload ? 'Hide' : 'View ERP payload'}
            </button>
          </div>
          {showErpPayload && (
            <pre className="mt-3 overflow-x-auto rounded-md border border-zinc-200 bg-white p-3 text-xs text-zinc-700">
              {JSON.stringify(payload, null, 2)}
            </pre>
          )}
        </div>
      </div>
    );
  }

  return null;
}

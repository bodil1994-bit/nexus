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
      <p className="text-sm text-amber-700">
        ERP sync blocked until required fields are complete.
      </p>
    );
  }

  if (status === 'PROCESSING') {
    return <p className="text-sm text-zinc-500">ERP sync pending processing result.</p>;
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
  };

  return (
    <div>
      {erpSyncedAt && (
        <p className="mb-2 text-sm text-zinc-500">
          Synced: {new Date(erpSyncedAt).toLocaleString()}
        </p>
      )}
      <pre className="overflow-x-auto rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-700">
        {JSON.stringify(preview, null, 2)}
      </pre>
    </div>
  );
}

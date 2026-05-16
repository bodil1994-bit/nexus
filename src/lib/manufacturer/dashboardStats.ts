export function parseMissingFields(json?: string | null): string[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function getBatchStatusLabel(status: string): string {
  switch (status) {
    case 'INCOMPLETE':
      return 'Data missing';
    case 'ERP_SYNCED':
      return 'ERP synced';
    case '_SUPPLIER_COMPLETE':
      return 'Complete';
    default:
      return 'Processing';
  }
}

export function getBatchStatusDescription(status: string): string {
  switch (status) {
    case 'INCOMPLETE':
      return 'Required passport fields are missing. Supplier has been notified to provide the missing data.';
    case 'ERP_SYNCED':
      return 'All required fields are present and the batch has been synced to the ERP system.';
    default:
      return 'Passport data is being processed and validated.';
  }
}

type BatchLike = { status: string };
type OrderLike = { batches: BatchLike[] };

export function calculateDashboardStats(orders: OrderLike[]): {
  totalBatches: number;
  incompleteBatches: number;
  erpSyncedBatches: number;
  processingBatches: number;
} {
  const batches = orders.flatMap((o) => o.batches);
  return {
    totalBatches: batches.length,
    incompleteBatches: batches.filter((b) => b.status === 'INCOMPLETE').length,
    erpSyncedBatches: batches.filter((b) => b.status === 'ERP_SYNCED').length,
    processingBatches: batches.filter((b) => b.status === 'PROCESSING').length,
  };
}

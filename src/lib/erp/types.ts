export interface ErpPayload {
  orderNumber: string;
  batchNumber: string;
  passportReferenceId: string;
  passportUrl: string;
}

export interface ErpSyncResult {
  success: boolean;
  externalId?: string | number;
  error?: string;
  skipped?: boolean;
}

export interface ErpAdapterConfig {
  type: string;
  baseUrl: string;
  database?: string | null;
  username?: string | null;
  apiKey: string;
  targetModel: string;
}

export interface ErpAdapter {
  sync(payload: ErpPayload): Promise<ErpSyncResult>;
}

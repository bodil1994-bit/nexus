import { prisma } from '@/lib/prisma';
import { getAdapter } from './adapter-factory';
import type { ErpAdapterConfig, ErpPayload, ErpSyncResult } from './types';

export async function syncBatchToErp(batchId: string): Promise<ErpSyncResult> {
  if (process.env.ERP_SYNC_ENABLED !== 'true') return { success: false, skipped: true };

  const batch = await prisma.batch.findUnique({
    where: { id: batchId },
    include: {
      order: {
        include: {
          manufacturer: {
            include: { erpIntegration: true },
          },
        },
      },
      passport: true,
    },
  });

  if (!batch) return { success: false, error: 'Batch not found' };

  const erpIntegration = batch.order.manufacturer.erpIntegration;
  if (!erpIntegration || !erpIntegration.enabled) return { success: false, skipped: true };

  const config: ErpAdapterConfig = {
    type: erpIntegration.type,
    baseUrl: erpIntegration.baseUrl,
    database: erpIntegration.database,
    username: erpIntegration.username,
    apiKey: erpIntegration.apiKey,
    targetModel: erpIntegration.targetModel,
  };

  const payload: ErpPayload = {
    orderNumber: batch.order.orderNumber,
    batchNumber: batch.batchNumber,
    passportReferenceId: batch.passport?.passportId ?? batchId,
    passportUrl: batch.passport?.passportUrl ?? '',
  };

  const result = await getAdapter(config).sync(payload);

  if (result.success) {
    await prisma.batch.update({
      where: { id: batchId },
      data: {
        status: 'ERP_SYNCED',
        erpSyncedAt: new Date(),
        erpPayloadJson: JSON.stringify(payload),
      },
    });
  }

  return result;
}

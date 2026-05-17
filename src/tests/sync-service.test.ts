// @vitest-environment node
import 'dotenv/config';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    batch: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/lib/erp/adapter-factory', () => ({
  getAdapter: vi.fn(),
}));

import { prisma } from '@/lib/prisma';
import { getAdapter } from '@/lib/erp/adapter-factory';
import { syncBatchToErp } from '@/lib/erp/sync-service';

const mockPrisma = prisma as unknown as {
  batch: {
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
};

const mockGetAdapter = getAdapter as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.resetAllMocks();
  delete process.env.ERP_SYNC_ENABLED;
});

afterEach(() => {
  delete process.env.ERP_SYNC_ENABLED;
});

describe('syncBatchToErp', () => {
  it('returns { success: false, skipped: true } when ERP_SYNC_ENABLED is unset', async () => {
    const start = Date.now();
    const result = await syncBatchToErp('batch-123');
    const elapsed = Date.now() - start;

    expect(result).toEqual({ success: false, skipped: true });
    expect(elapsed).toBeLessThan(5);
    expect(mockPrisma.batch.findUnique).not.toHaveBeenCalled();
    expect(mockGetAdapter).not.toHaveBeenCalled();
  });

  it('returns { success: false, skipped: true } when ERP_SYNC_ENABLED=true but erpIntegration.enabled=false', async () => {
    process.env.ERP_SYNC_ENABLED = 'true';

    mockPrisma.batch.findUnique.mockResolvedValue({
      id: 'batch-123',
      batchNumber: 'BAT-001',
      passport: null,
      order: {
        orderNumber: 'ORD-001',
        manufacturer: {
          erpIntegration: {
            type: 'ODOO',
            baseUrl: 'https://demo.odoo.com',
            database: 'demo',
            username: 'admin',
            apiKey: 'key',
            targetModel: 'stock.lot',
            enabled: false,
          },
        },
      },
    });

    const result = await syncBatchToErp('batch-123');

    expect(result).toEqual({ success: false, skipped: true });
    expect(mockGetAdapter).not.toHaveBeenCalled();
    expect(mockPrisma.batch.update).not.toHaveBeenCalled();
  });

  it('returns { success: false, skipped: true } when erpIntegration is null', async () => {
    process.env.ERP_SYNC_ENABLED = 'true';

    mockPrisma.batch.findUnique.mockResolvedValue({
      id: 'batch-123',
      batchNumber: 'BAT-001',
      passport: null,
      order: {
        orderNumber: 'ORD-001',
        manufacturer: { erpIntegration: null },
      },
    });

    const result = await syncBatchToErp('batch-123');

    expect(result).toEqual({ success: false, skipped: true });
    expect(mockGetAdapter).not.toHaveBeenCalled();
  });

  it('returns { success: false, error: "Batch not found" } when batch missing', async () => {
    process.env.ERP_SYNC_ENABLED = 'true';
    mockPrisma.batch.findUnique.mockResolvedValue(null);

    const result = await syncBatchToErp('nonexistent');

    expect(result).toEqual({ success: false, error: 'Batch not found' });
  });

  it('calls adapter sync and updates batch on success', async () => {
    process.env.ERP_SYNC_ENABLED = 'true';

    mockPrisma.batch.findUnique.mockResolvedValue({
      id: 'batch-123',
      batchNumber: 'BAT-001',
      passport: { passportId: 'PASS-001', passportUrl: '/passport/PASS-001' },
      order: {
        orderNumber: 'ORD-001',
        manufacturer: {
          erpIntegration: {
            type: 'ODOO',
            baseUrl: 'https://demo.odoo.com',
            database: 'demo',
            username: 'admin',
            apiKey: 'key',
            targetModel: 'stock.lot',
            enabled: true,
          },
        },
      },
    });

    const mockSync = vi.fn().mockResolvedValue({ success: true, externalId: 99 });
    mockGetAdapter.mockReturnValue({ sync: mockSync });
    mockPrisma.batch.update.mockResolvedValue({});

    const result = await syncBatchToErp('batch-123');

    expect(result).toEqual({ success: true, externalId: 99 });
    expect(mockSync).toHaveBeenCalledWith(
      expect.objectContaining({
        orderNumber: 'ORD-001',
        batchNumber: 'BAT-001',
        passportReferenceId: 'PASS-001',
        passportUrl: '/passport/PASS-001',
      })
    );
    expect(mockPrisma.batch.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'batch-123' },
        data: expect.objectContaining({ status: 'ERP_SYNCED' }),
      })
    );
  });
});

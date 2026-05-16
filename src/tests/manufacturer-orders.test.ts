// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';

const mockOrders = [
  {
    id: 'order-1',
    orderNumber: 'ORD-001',
    supplier: { id: 'sup-1', name: 'Test Supplier', email: 'supplier@test.com' },
    manufacturer: { id: 'man-1', name: 'Test Manufacturer' },
    batches: [
      {
        id: 'batch-1',
        batchNumber: 'B-001',
        manufacturerSku: 'SKU-001',
        quantity: 100,
        status: 'PROCESSING',
        missingFieldsJson: null,
        readinessScore: 0,
        supplierNotifiedAt: null,
        erpSyncedAt: null,
        erpPayloadJson: null,
        passport: null,
      },
    ],
  },
];

vi.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      findMany: vi.fn().mockResolvedValue(mockOrders),
    },
  },
}));

describe('GET /api/manufacturer/orders', () => {
  it('returns 200 with orders array', async () => {
    const { GET } = await import('@/app/api/manufacturer/orders/route');
    const response = await GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('orders');
    expect(Array.isArray(body.orders)).toBe(true);
    expect(body.orders).toHaveLength(1);
  });
});

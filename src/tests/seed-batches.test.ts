// @vitest-environment node
import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';
import { afterAll, describe, expect, it } from 'vitest';
import { seedSupplierBatches } from '../../prisma/seed-helpers';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

describe('seedSupplierBatches', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('creates exactly three batches with correct statuses', async () => {
    await seedSupplierBatches(prisma);

    const batches = await prisma.batch.findMany({ orderBy: { createdAt: 'asc' } });
    expect(batches).toHaveLength(3);

    const statuses = batches.map((b) => b.status);
    expect(statuses).toContain('processing');
    expect(statuses).toContain('complete');
    expect(statuses).toContain('missing_information');
  });

  it('each batch has at least one PassportDocument', async () => {
    const batches = await prisma.batch.findMany({ include: { passportDocuments: true } });
    for (const batch of batches) {
      expect(batch.passportDocuments.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('missing_information batch has at least two entries in missingFields', async () => {
    const batch = await prisma.batch.findFirst({
      where: { status: 'missing_information' },
      include: { passportDocuments: true },
    });
    expect(batch).not.toBeNull();
    const doc = batch!.passportDocuments[0];
    const missing = doc.missingFields as string[];
    expect(missing.length).toBeGreaterThanOrEqual(2);
  });

  it('complete batch has all five canonical fields populated', async () => {
    const batch = await prisma.batch.findFirst({
      where: { status: 'complete' },
      include: { passportDocuments: true },
    });
    expect(batch).not.toBeNull();
    const doc = batch!.passportDocuments[0];
    const fields = doc.extractedFields as Record<string, string | null>;
    const canonical = ['product_name', 'material', 'origin_country', 'supplier_name', 'sustainability_notes'];
    for (const key of canonical) {
      expect(fields[key]).toBeTruthy();
    }
  });
});

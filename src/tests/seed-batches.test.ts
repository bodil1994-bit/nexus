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

  it('complete batch has a DigitalProductPassport with battery data', async () => {
    const batch = await prisma.batch.findFirst({
      where: { status: 'complete' },
      include: { passport: { include: { batteryData: true } } },
    });
    expect(batch).not.toBeNull();
    expect(batch!.passport).not.toBeNull();
    expect(batch!.passport!.batteryData).not.toBeNull();
  });

  it('battery data has key identification fields populated', async () => {
    const passport = await prisma.digitalProductPassport.findFirst({
      include: { batteryData: true },
    });
    expect(passport).not.toBeNull();
    const bd = passport!.batteryData!;
    expect(bd.uniqueBatteryIdentifier).toBeTruthy();
    expect(bd.batteryModel).toBeTruthy();
    expect(bd.batteryChemistry).toBeTruthy();
    expect(bd.manufacturerName).toBeTruthy();
    expect(bd.grossCapacityKwh).toBeGreaterThan(0);
  });

  it('battery passport seed fields are not compound delimited values', async () => {
    const passport = await prisma.digitalProductPassport.findFirst({
      include: { batteryData: true },
    });
    expect(passport).not.toBeNull();
    const bd = passport!.batteryData!;

    const compoundFields = Object.entries(bd)
      .filter(([, value]) => typeof value === 'string' && value.includes(';'))
      .map(([field]) => field);

    expect(compoundFields).toEqual([]);
  });

  it('processing and missing_information batches have no passport', async () => {
    const batches = await prisma.batch.findMany({
      where: { status: { in: ['processing', 'missing_information'] } },
      include: { passport: true },
    });
    for (const batch of batches) {
      expect(batch.passport).toBeNull();
    }
  });
});

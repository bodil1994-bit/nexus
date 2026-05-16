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
    expect(statuses).toContain('PROCESSING');
    expect(statuses).toContain('ERP_SYNCED');
    expect(statuses).toContain('INCOMPLETE');
  });

  it('ERP-synced batch has a DigitalProductPassport with battery data', async () => {
    const batch = await prisma.batch.findFirst({
      where: { status: 'ERP_SYNCED' },
      include: { passport: { include: { batteryData: true } } },
    });
    expect(batch).not.toBeNull();
    expect(batch!.passport).not.toBeNull();
    expect(batch!.passport!.batteryData).not.toBeNull();
    expect(batch!.erpSyncedAt).not.toBeNull();
    expect(batch!.erpPayloadJson).toContain('passportReferenceId');
  });

  it('incomplete batch has missing fields, supplier notification, and passport ID', async () => {
    const batch = await prisma.batch.findFirst({
      where: { status: 'INCOMPLETE' },
      include: { passport: true },
    });
    expect(batch).not.toBeNull();
    expect(JSON.parse(batch!.missingFieldsJson!)).toEqual([
      'grossCapacityKwh',
      'carbonFootprintKgCo2ePerKwh',
      'declarationOfConformityRef',
    ]);
    expect(batch!.supplierNotifiedAt).not.toBeNull();
    expect(batch!.passport?.passportId).toBe('BAT-BSH-PT500-2024-008315');
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

  it('battery data stores carbon footprint leaves as top-level fields', async () => {
    const passport = await prisma.digitalProductPassport.findFirst({
      include: { batteryData: true },
    });
    expect(passport).not.toBeNull();
    const bd = passport!.batteryData!;

    expect(bd.carbonFootprintTotalValueKgCo2ePerKwh).toBe(148);
    expect(bd.carbonFootprintTotalTotalKgCo2e).toBe(92.5);
    expect(bd.carbonFootprintPerformanceClassValue).toBe('C');
    expect(bd.carbonDeclarationBatteryModelNominalVoltageV).toBe(36);
    expect(bd.carbonFootprintLifecycleEndOfLifeKgCo2e).toBe(-16.7);
    expect(bd.carbonDeclarationCarbonFootprintReportUrl).toBe(
      'www.bosch-ebike.com/assets/lca-powertube-625.pdf',
    );
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

  it('processing batches have no passport before upload data exists', async () => {
    const batches = await prisma.batch.findMany({
      where: { status: 'PROCESSING' },
      include: { passport: true },
    });
    for (const batch of batches) {
      expect(batch.passport).toBeNull();
    }
  });
});

// @vitest-environment node
import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';
import { afterAll, describe, expect, it } from 'vitest';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

describe('seed passport URLs', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('ERP-synced passport passportUrl starts with /passport/', async () => {
    const batch = await prisma.batch.findFirst({
      where: { status: 'ERP_SYNCED' },
      include: { passport: true },
    });
    expect(batch?.passport?.passportUrl).toMatch(/^\/passport\//);
  });

  it('erpPayloadJson includes passportUrl starting with /passport/', async () => {
    const batch = await prisma.batch.findFirst({
      where: { status: 'ERP_SYNCED' },
    });
    expect(batch?.erpPayloadJson).toBeTruthy();
    const payload = JSON.parse(batch!.erpPayloadJson!);
    expect(payload.passportUrl).toMatch(/^\/passport\//);
  });
});

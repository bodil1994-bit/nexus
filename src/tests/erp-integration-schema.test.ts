// @vitest-environment node
import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';
import { afterAll, describe, expect, it } from 'vitest';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

describe('ErpIntegration schema', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('ErpIntegration record exists and has correct defaults', async () => {
    const erp = await prisma.erpIntegration.findFirst({
      include: { manufacturer: true },
    });
    expect(erp).not.toBeNull();
    expect(erp!.type).toBe('ODOO');
    expect(erp!.targetModel).toBe('stock.lot');
    expect(erp!.enabled).toBe(false);
    expect(erp!.baseUrl).toBe('https://demo.odoo.com');
    expect(erp!.manufacturer).not.toBeNull();
  });
});

// @vitest-environment node
import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';
import { describe, expect, it } from 'vitest';

describe('Prisma models exist', () => {
  const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
  const prisma = new PrismaClient({ adapter });

  it('batch model is defined', () => {
    expect(prisma.batch).toBeDefined();
  });

  it('passportDocument model is defined', () => {
    expect(prisma.passportDocument).toBeDefined();
  });
});

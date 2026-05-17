import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';
import { seedErpIntegration, seedSupplierBatches } from './seed-helpers';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const { manufacturer } = await seedSupplierBatches(prisma);
  await seedErpIntegration(prisma, manufacturer.id);
  console.log('Seeded PassportOps demo data');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

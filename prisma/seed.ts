import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.batteryPassportData.deleteMany();
  await prisma.digitalProductPassport.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.order.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.manufacturer.deleteMany();

  const supplier = await prisma.supplier.create({
    data: {
      name: 'CellChem GmbH',
      email: 'supplier@cellchem.example',
    },
  });

  const manufacturer = await prisma.manufacturer.create({
    data: {
      name: 'VeloMotion GmbH',
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: 'ORD-4491',
      supplierId: supplier.id,
      manufacturerId: manufacturer.id,
      batches: {
        create: [
          {
            batchNumber: 'BAT-014',
            manufacturerSku: 'EBIKE-BAT-500',
            quantity: 500,
            status: 'PROCESSING',
          },
          {
            batchNumber: 'BAT-015',
            manufacturerSku: 'EBIKE-BAT-750',
            quantity: 300,
            status: 'PROCESSING',
          },
        ],
      },
    },
  });

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

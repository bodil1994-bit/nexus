import { PrismaClient } from '@prisma/client';

export const CANONICAL_FIELDS = [
  'product_name',
  'material',
  'origin_country',
  'supplier_name',
  'sustainability_notes',
] as const;

export async function seedSupplierBatches(prisma: PrismaClient) {
  await prisma.passportDocument.deleteMany();
  await prisma.batteryPassportData.deleteMany();
  await prisma.digitalProductPassport.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.order.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.manufacturer.deleteMany();

  const supplier = await prisma.supplier.create({
    data: { name: 'CellChem GmbH', email: 'supplier@cellchem.example' },
  });

  const manufacturer = await prisma.manufacturer.create({
    data: { name: 'VeloMotion GmbH' },
  });

  const order = await prisma.order.create({
    data: {
      orderNumber: 'ORD-4491',
      supplierId: supplier.id,
      manufacturerId: manufacturer.id,
    },
  });

  const processingBatch = await prisma.batch.create({
    data: {
      batchNumber: 'BAT-001',
      orderId: order.id,
      manufacturerSku: 'EBIKE-BAT-500',
      quantity: 500,
      status: 'processing',
    },
  });

  const completeBatch = await prisma.batch.create({
    data: {
      batchNumber: 'BAT-002',
      orderId: order.id,
      manufacturerSku: 'EBIKE-BAT-750',
      quantity: 300,
      status: 'complete',
    },
  });

  const missingBatch = await prisma.batch.create({
    data: {
      batchNumber: 'BAT-003',
      orderId: order.id,
      manufacturerSku: 'EBIKE-BAT-1000',
      quantity: 200,
      status: 'missing_information',
    },
  });

  await prisma.passportDocument.create({
    data: {
      batchId: processingBatch.id,
      filename: 'batch-001-passport.pdf',
      extractedFields: {
        product_name: null,
        material: null,
        origin_country: null,
        supplier_name: null,
        sustainability_notes: null,
      },
      missingFields: CANONICAL_FIELDS as unknown as string[],
    },
  });

  await prisma.passportDocument.create({
    data: {
      batchId: completeBatch.id,
      filename: 'batch-002-passport.json',
      extractedFields: {
        product_name: 'LFP Battery Pack 750Wh',
        material: 'Lithium Iron Phosphate',
        origin_country: 'Germany',
        supplier_name: 'CellChem GmbH',
        sustainability_notes: 'Certified carbon-neutral manufacturing process',
      },
      missingFields: [],
    },
  });

  await prisma.passportDocument.create({
    data: {
      batchId: missingBatch.id,
      filename: 'batch-003-passport.csv',
      extractedFields: {
        product_name: 'NMC Battery Pack 1000Wh',
        material: 'Nickel Manganese Cobalt',
        origin_country: null,
        supplier_name: null,
        sustainability_notes: null,
      },
      missingFields: ['origin_country', 'supplier_name', 'sustainability_notes'],
    },
  });

  return { processingBatch, completeBatch, missingBatch };
}

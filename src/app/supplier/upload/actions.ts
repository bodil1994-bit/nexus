'use server';

import { prisma } from '@/lib/prisma';
import { mockExtract } from '@/lib/mock-extraction';
import { redirect } from 'next/navigation';

export async function submitBatch(formData: FormData) {
  const orderNumber = formData.get('orderNumber') as string;
  const batchNumber = formData.get('batchNumber') as string;
  const files = formData.getAll('files') as File[];

  if (!orderNumber || !batchNumber) {
    throw new Error('Order number and batch number are required');
  }

  const supplier = await prisma.supplier.findFirst();
  const manufacturer = await prisma.manufacturer.findFirst();

  if (!supplier || !manufacturer) {
    throw new Error('No supplier or manufacturer found. Run the seed first.');
  }

  const order = await prisma.order.upsert({
    where: {
      orderNumber_supplierId_manufacturerId: {
        orderNumber,
        supplierId: supplier.id,
        manufacturerId: manufacturer.id,
      },
    },
    update: {},
    create: {
      orderNumber,
      supplierId: supplier.id,
      manufacturerId: manufacturer.id,
    },
  });

  const batch = await prisma.batch.create({
    data: {
      batchNumber,
      orderId: order.id,
      manufacturerSku: `SKU-${batchNumber}`,
      quantity: 1,
      status: 'processing',
    },
  });

  const filenames = files.length > 0 && files[0].size > 0
    ? files.map((f) => f.name)
    : ['passport.txt'];

  let finalStatus: 'complete' | 'missing_information' = 'complete';
  let allMissingFields: string[] = [];

  for (const filename of filenames) {
    const result = mockExtract(filename);
    if (result.status === 'missing_information') {
      finalStatus = 'missing_information';
      allMissingFields = [...new Set([...allMissingFields, ...result.missingFields])];
    }
  }

  await prisma.batch.update({
    where: { id: batch.id },
    data: {
      status: finalStatus,
      missingFieldsJson: allMissingFields.length > 0 ? JSON.stringify(allMissingFields) : null,
    },
  });

  redirect('/supplier/batches');
}

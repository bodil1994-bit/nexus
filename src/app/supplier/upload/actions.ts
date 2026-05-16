'use server';

import { prisma } from '@/lib/prisma';
import { CANONICAL_FIELDS, mockExtract } from '@/lib/mock-extraction';
import { createPassportReferenceId } from '@/lib/passport-reference';
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
      status: 'PROCESSING',
    },
  });

  const filenames = files.length > 0 && files[0].size > 0
    ? files.map((f) => f.name)
    : ['passport.txt'];

  let finalStatus: 'COMPLETE' | 'INCOMPLETE' = 'COMPLETE';
  let allMissingFields: string[] = [];
  let extractedFields: Record<string, string | null> = {};

  for (const filename of filenames) {
    const result = mockExtract(filename);
    if (result.status === 'missing_information') {
      finalStatus = 'INCOMPLETE';
      allMissingFields = [...new Set([...allMissingFields, ...result.missingFields])];
    }
    extractedFields = { ...extractedFields, ...result.extractedFields };
  }

  const passportReferenceId = createPassportReferenceId(orderNumber, batchNumber);
  const readinessScore = Math.round(
    ((CANONICAL_FIELDS.length - allMissingFields.length) / CANONICAL_FIELDS.length) * 100,
  );

  await prisma.batch.update({
    where: { id: batch.id },
    data: {
      status: finalStatus,
      readinessScore,
      missingFieldsJson: allMissingFields.length > 0 ? JSON.stringify(allMissingFields) : null,
      passport: {
        create: {
          passportId: passportReferenceId,
          passportType: 'BATTERY',
          passportUrl: `https://passport.nexus.local/${passportReferenceId}`,
          batteryData: {
            create: {
              uniqueBatteryIdentifier: passportReferenceId,
              batteryModel: extractedFields.product_name,
              batteryChemistry: extractedFields.material,
              manufacturerName: extractedFields.supplier_name,
            },
          },
        },
      },
    },
  });

  redirect('/supplier/batches');
}

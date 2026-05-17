'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveIntegration(formData: FormData) {
  const manufacturer = await prisma.manufacturer.findFirst();
  if (!manufacturer) throw new Error('No manufacturer found');

  const enabled = formData.get('enabled') === 'on';

  await prisma.erpIntegration.upsert({
    where: { manufacturerId: manufacturer.id },
    create: {
      manufacturerId: manufacturer.id,
      type: (formData.get('type') as string) || 'ODOO',
      baseUrl: formData.get('baseUrl') as string,
      database: (formData.get('database') as string) || null,
      username: (formData.get('username') as string) || null,
      apiKey: formData.get('apiKey') as string,
      targetModel: (formData.get('targetModel') as string) || 'stock.lot',
      enabled,
    },
    update: {
      type: (formData.get('type') as string) || 'ODOO',
      baseUrl: formData.get('baseUrl') as string,
      database: (formData.get('database') as string) || null,
      username: (formData.get('username') as string) || null,
      apiKey: formData.get('apiKey') as string,
      targetModel: (formData.get('targetModel') as string) || 'stock.lot',
      enabled,
    },
  });

  revalidatePath('/manufacturer/integrations');
}

export async function deleteIntegration(integrationId: string) {
  await prisma.erpIntegration.delete({ where: { id: integrationId } });
  revalidatePath('/manufacturer/integrations');
}

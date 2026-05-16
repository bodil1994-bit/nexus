import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      supplier: true,
      manufacturer: true,
      batches: {
        include: {
          passport: {
            include: {
              batteryData: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ orders });
}

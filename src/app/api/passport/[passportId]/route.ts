import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ passportId: string }> }
) {
  const { passportId } = await params;

  const passport = await prisma.digitalProductPassport.findUnique({
    where: { passportId },
    include: { batteryData: true },
  });

  if (!passport) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    passport: {
      id: passport.id,
      passportId: passport.passportId,
      passportUrl: passport.passportUrl,
      passportType: passport.passportType,
      batteryData: passport.batteryData,
    },
  });
}

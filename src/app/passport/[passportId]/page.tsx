import { prisma } from '@/lib/prisma';
import { buildRetailerPassport } from '@/lib/retailer/buildRetailerPassport';
import PassportView from './PassportView';

export default async function PassportPage({
  params,
}: {
  params: Promise<{ passportId: string }>;
}) {
  const { passportId } = await params;

  const passport = await prisma.digitalProductPassport.findUnique({
    where: { passportId },
    include: { batteryData: true },
  });

  if (!passport || !passport.batteryData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Passport not found</h1>
          <p className="text-slate-500 mt-2 text-sm">No passport with ID: {passportId}</p>
        </div>
      </div>
    );
  }

  const passportView = buildRetailerPassport(passport.batteryData);

  return <PassportView data={passportView} />;
}

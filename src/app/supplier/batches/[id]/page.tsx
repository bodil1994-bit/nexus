import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { BatchStatusBadge } from '@/components/manufacturer/BatchStatusBadge';
import { ChevronLeft, Info, FileText, Activity, AlertCircle } from 'lucide-react';
import { FIELD_LABELS } from '@/lib/domain/fieldLabels';

export default async function BatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const batch = await prisma.batch.findUnique({
    where: { id },
    include: {
      order: { include: { supplier: true, manufacturer: true } },
      passport: { include: { batteryData: true } },
    },
  });

  if (!batch) {
    notFound();
  }

  const missingFields: string[] = batch.missingFieldsJson
    ? (JSON.parse(batch.missingFieldsJson) as string[])
    : [];
  const passport = batch.passport;
  const bd = passport?.batteryData;
  const isMissingInformation = batch.status === 'INCOMPLETE';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden selection:bg-emerald-100">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-3xl py-12 px-6">
        <div className="mb-8">
          <Link href="/supplier/batches" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Archive
          </Link>
        </div>

        <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 to-white/40 shadow-[0_2px_16px_rgba(0,0,0,0.06)] backdrop-blur-xl p-8 lg:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
             <Activity size={120} className="text-emerald-600" />
          </div>

          <div className="relative">
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <BatchStatusBadge status={batch.status} />
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                  Submission ID: {batch.id.slice(-8)}
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {batch.order.orderNumber} <span className="text-slate-300 font-light mx-2">/</span> {batch.batchNumber}
              </h1>
              <p className="text-slate-500 mt-2">Submitted to {batch.order.manufacturer.name}</p>
            </header>

            {isMissingInformation && missingFields.length > 0 && (
              <div className="mb-10 rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
                <div className="flex items-center gap-2 text-amber-700 mb-4">
                  <AlertCircle size={18} />
                  <p className="text-sm font-bold uppercase tracking-wider">Required Information Missing</p>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                  {missingFields.map((field) => (
                    <li key={field} className="flex items-center gap-2 text-sm text-amber-800/80">
                      <div className="w-1 h-1 rounded-full bg-amber-500" />
                      {FIELD_LABELS[field] ?? field}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-xs text-slate-500 italic">
                  The manufacturer has been notified. Please provide the missing data to complete passport submission.
                </p>
              </div>
            )}

            {passport && (
              <div className="space-y-12">
                <section>
                  <div className="flex items-center gap-2 mb-6 text-emerald-600">
                    <Info size={16} />
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em]">Extraction Meta</h2>
                  </div>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-1">
                      <dt className="text-slate-400 font-medium">Passport Identifier</dt>
                      <dd className="text-slate-900 font-mono font-medium">{passport.passportId ?? 'PENDING'}</dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="text-slate-400 font-medium">Data Format</dt>
                      <dd className="text-slate-900">{passport.passportType}</dd>
                    </div>
                    {passport.passportUrl && (
                      <div className="col-span-full space-y-1">
                        <dt className="text-slate-400 font-medium">Source Document URL</dt>
                        <dd className="text-slate-500 font-mono text-[10px] break-all bg-slate-50/50 p-3 rounded border border-slate-100 mt-1">
                          {passport.passportUrl}
                        </dd>
                      </div>
                    )}
                  </dl>
                </section>

                {bd && (
                  <section>
                    <div className="flex items-center gap-2 mb-6 text-emerald-600">
                      <FileText size={16} />
                      <h2 className="text-xs font-bold uppercase tracking-[0.2em]">Normalized Battery Data</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                      {[
                        ['Model', bd.batteryModel],
                        ['Chemistry', bd.batteryChemistry],
                        ['Manufacturer', bd.manufacturerName],
                        ['Manufacture Year', bd.manufactureYear?.toString()],
                        ['Gross Capacity', bd.grossCapacityKwh ? `${bd.grossCapacityKwh} kWh` : null],
                        ['Carbon Footprint', bd.carbonFootprintKgCo2ePerKwh ? `${bd.carbonFootprintKgCo2ePerKwh} kg CO2e/kWh` : null],
                        ['Recycled Cobalt', bd.recycledCobaltPercentage != null ? `${bd.recycledCobaltPercentage}%` : null],
                        ['Recycled Lithium', bd.recycledLithiumPercentage != null ? `${bd.recycledLithiumPercentage}%` : null],
                        ['Compliance Ref', bd.declarationOfConformityRef],
                        ['QR Affixed', bd.qrCodeAffixed != null ? (bd.qrCodeAffixed ? 'Yes' : 'No') : null],
                      ].map(([label, value]) => (
                        <div key={label} className="space-y-1 border-l border-slate-100 pl-4">
                          <dt className="text-slate-400 font-medium">{label}</dt>
                          <dd className={value ? "text-slate-900 font-medium" : "text-slate-400 italic"}>
                            {value || 'Not extracted'}
                          </dd>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 text-center">
           <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-4">Veloport Digital Product Passport Gateway</p>
           <div className="flex justify-center gap-6 text-xs text-slate-500 font-medium">
             <Link href="/supplier/upload" className="hover:text-emerald-600 transition-colors">New Submission</Link>
             <Link href="/supplier/batches" className="hover:text-emerald-600 transition-colors">View Archive</Link>
           </div>
        </footer>
      </div>
    </div>
  );
}

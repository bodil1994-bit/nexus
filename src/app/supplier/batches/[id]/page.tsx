import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CANONICAL_FIELDS } from '@/lib/mock-extraction';

export default async function BatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const batch = await prisma.batch.findUnique({
    where: { id },
    include: {
      order: { include: { supplier: true, manufacturer: true } },
      passportDocuments: true,
      passport: { include: { batteryData: true } },
    },
  });

  if (!batch) {
    notFound();
  }

  const doc = batch.passportDocuments[0];
  const extractedFields = (doc?.extractedFields ?? {}) as Record<string, string | null>;
  const missingFields = (doc?.missingFields ?? []) as string[];
  const passport = batch.passport;
  const bd = passport?.batteryData;

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/supplier/batches" className="text-sm text-zinc-500 hover:text-zinc-800">
            ← Back to Batches
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-zinc-900">
              {batch.order.orderNumber} / {batch.batchNumber}
            </h1>
            <span
              className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                batch.status === 'processing'
                  ? 'bg-yellow-100 text-yellow-800'
                  : batch.status === 'complete'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
              }`}
            >
              {batch.status.replace('_', ' ')}
            </span>
          </div>

          {batch.status === 'missing_information' && missingFields.length > 0 && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800 mb-2">Missing fields:</p>
              <ul className="list-disc list-inside space-y-1">
                {missingFields.map((field) => (
                  <li key={field} className="text-sm text-red-700">
                    {field.replace('_', ' ')}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-4">
            Passport Fields
          </h2>
          <dl className="space-y-3">
            {CANONICAL_FIELDS.map((field) => {
              const value = extractedFields[field];
              const isMissing = !value;
              return (
                <div key={field} className="flex items-start gap-4">
                  <dt className="w-40 shrink-0 text-sm text-zinc-500">{field.replace(/_/g, ' ')}</dt>
                  <dd className="text-sm">
                    {isMissing ? (
                      <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-700">
                        Missing
                      </span>
                    ) : (
                      <span className="text-zinc-900">{value}</span>
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>

          {passport && (
            <div className="mt-8 pt-8 border-t border-zinc-100">
              <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-4">
                Digital Product Passport
              </h2>
              <dl className="space-y-3 mb-6">
                <div className="flex items-start gap-4">
                  <dt className="w-40 shrink-0 text-sm text-zinc-500">Passport ID</dt>
                  <dd className="text-sm text-zinc-900 font-mono">{passport.passportId}</dd>
                </div>
                <div className="flex items-start gap-4">
                  <dt className="w-40 shrink-0 text-sm text-zinc-500">Type</dt>
                  <dd className="text-sm text-zinc-900">{passport.passportType}</dd>
                </div>
                {passport.passportUrl && (
                  <div className="flex items-start gap-4">
                    <dt className="w-40 shrink-0 text-sm text-zinc-500">URL</dt>
                    <dd className="text-sm text-zinc-900 font-mono break-all">{passport.passportUrl}</dd>
                  </div>
                )}
              </dl>

              {bd && (
                <>
                  <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-4">
                    Battery Data
                  </h3>
                  <dl className="space-y-3">
                    {[
                      ['Model', bd.batteryModel],
                      ['Category', bd.batteryCategory],
                      ['Chemistry', bd.batteryChemistry],
                      ['Manufacturer', bd.manufacturerName],
                      ['Manufacture Year', bd.manufactureYear?.toString()],
                      ['Gross Capacity', bd.grossCapacityKwh ? `${bd.grossCapacityKwh} kWh` : null],
                      ['Carbon Footprint', bd.carbonFootprintKgCo2ePerKwh ? `${bd.carbonFootprintKgCo2ePerKwh} kg CO2e/kWh` : null],
                      ['Recycled Cobalt', bd.recycledCobaltPercentage != null ? `${bd.recycledCobaltPercentage}%` : null],
                      ['Recycled Lithium', bd.recycledLithiumPercentage != null ? `${bd.recycledLithiumPercentage}%` : null],
                      ['DoC Reference', bd.declarationOfConformityRef],
                      ['QR Affixed', bd.qrCodeAffixed != null ? (bd.qrCodeAffixed ? 'Yes' : 'No') : null],
                      ['Issue Date', bd.issueDate],
                    ].map(([label, value]) =>
                      value ? (
                        <div key={label} className="flex items-start gap-4">
                          <dt className="w-40 shrink-0 text-sm text-zinc-500">{label}</dt>
                          <dd className="text-sm text-zinc-900">{value}</dd>
                        </div>
                      ) : null,
                    )}
                  </dl>

                  <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wide mt-6 mb-4">
                    Sections (raw JSON)
                  </h3>
                  <dl className="space-y-3">
                    {[
                      ['Manufacturer ID', bd.manufacturerIdentification],
                      ['Category & Model', bd.batteryCategoryAndModel],
                      ['Place of Manufacture', bd.placeOfManufacture],
                      ['Chemical Composition', bd.chemicalComposition],
                      ['Hazardous Substances', bd.hazardousSubstances],
                      ['Critical Raw Materials', bd.criticalRawMaterials],
                      ['Carbon Footprint Total', bd.carbonFootprintTotal],
                      ['CO2 Performance Class', bd.carbonFootprintPerformanceClass],
                      ['CO2 Lifecycle Breakdown', bd.carbonFootprintLifecycleBreakdown],
                      ['Recycled Content — Cobalt', bd.recycledContentCobalt],
                      ['Recycled Content — Lithium', bd.recycledContentLithium],
                      ['Recycled Content — Nickel', bd.recycledContentNickel],
                      ['Recycled Content — Lead', bd.recycledContentLead],
                      ['Renewable Content', bd.renewableContentShare],
                      ['Due Diligence Strategy', bd.dueDiligenceStrategy],
                      ['Due Diligence Report', bd.dueDiligenceReport],
                      ['Supply Chain Origin', bd.supplyChainCountryOfOrigin],
                      ['Nominal Voltage', bd.nominalVoltage],
                      ['Rated Capacity (Ah)', bd.ratedCapacityAh],
                      ['Expected Lifetime Cycles', bd.expectedLifetimeCycles],
                      ['Round Trip Efficiency', bd.roundTripEfficiencyInitial],
                      ['CE Marking', bd.ceMarking],
                      ['Waste Info — Takeback', bd.wasteInfoTakebackPoints],
                      ['QR Code', bd.qrCode],
                      ['Operating Instructions', bd.operatingInstructionsReference],
                    ].map(([label, value]) =>
                      value ? (
                        <div key={label} className="flex items-start gap-4">
                          <dt className="w-40 shrink-0 text-sm text-zinc-500">{label}</dt>
                          <dd className="text-sm text-zinc-700 font-mono bg-zinc-50 rounded px-2 py-1 break-all">
                            {value}
                          </dd>
                        </div>
                      ) : null,
                    )}
                  </dl>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

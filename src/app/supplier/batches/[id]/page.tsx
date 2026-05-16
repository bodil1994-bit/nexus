import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CANONICAL_FIELDS } from '@/lib/mock-extraction';

export default async function BatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const batch = await prisma.batch.findUnique({
    where: { id },
    include: { order: true, passportDocuments: true },
  });

  if (!batch) {
    notFound();
  }

  const doc = batch.passportDocuments[0];
  const extractedFields = (doc?.extractedFields ?? {}) as Record<string, string | null>;
  const missingFields = (doc?.missingFields ?? []) as string[];

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
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { prisma } from '@/lib/prisma';

const STATUS_STYLES: Record<string, string> = {
  PROCESSING: 'bg-yellow-100 text-yellow-800',
  COMPLETE: 'bg-green-100 text-green-800',
  INCOMPLETE: 'bg-red-100 text-red-800',
  processing: 'bg-yellow-100 text-yellow-800',
  complete: 'bg-green-100 text-green-800',
  missing_information: 'bg-red-100 text-red-800',
};

export default async function BatchListPage() {
  const batches = await prisma.batch.findMany({
    include: { order: true, passport: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-zinc-900">Batches</h1>
          <Link
            href="/supplier/upload"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
          >
            New Batch
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
          {batches.length === 0 ? (
            <p className="p-8 text-center text-zinc-400 text-sm">No batches yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-zinc-500">Order</th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-500">Batch</th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-500">Passport ID</th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-500">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-500">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 text-zinc-700">
                      <Link href={`/supplier/batches/${batch.id}`} className="hover:underline">
                        {batch.order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-zinc-700">{batch.batchNumber}</td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-600">
                      {batch.passport?.passportId ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[batch.status] ?? 'bg-zinc-100 text-zinc-700'}`}
                      >
                        {batch.status.replace('_', ' ').toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {new Date(batch.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { BatchStatusBadge } from '@/components/manufacturer/BatchStatusBadge';
import { History, Plus, ChevronRight, CheckCircle2 } from 'lucide-react';

export default async function BatchListPage() {
  const batches = await prisma.batch.findMany({
    include: { order: true, passport: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden selection:bg-emerald-100">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl py-12 px-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-4">
              <History size={12} />
              <span>Submission Archive</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Batches</h1>
            <p className="text-slate-500 mt-1">Review and track your battery passport submissions.</p>
          </div>
          <Link
            href="/supplier/upload"
            className="group flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 transition-all"
          >
            <Plus size={16} />
            <span>New Submission</span>
          </Link>
        </header>

        <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 to-white/40 shadow-[0_2px_16px_rgba(0,0,0,0.06)] backdrop-blur-xl overflow-hidden">
          {batches.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-6 text-slate-300">
                <History size={32} />
              </div>
              <p className="text-slate-500 font-medium">No submission history found.</p>
              <Link href="/supplier/upload" className="text-emerald-600 text-sm mt-4 inline-block hover:underline">
                Upload your first batch passport →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-100 bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-500">Order Reference</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-500">Batch Serial</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-500">Passport ID</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-500">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-500">ERP Sync</th>
                    <th className="px-6 py-4 text-right font-semibold text-slate-500">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {batches.map((batch) => (
                    <tr key={batch.id} className="group hover:bg-white/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/supplier/batches/${batch.id}`} className="flex items-center gap-2 text-slate-900 font-medium hover:text-emerald-600 transition-colors">
                          {batch.order.orderNumber}
                          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">{batch.batchNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                          {batch.passport?.passportId ?? 'PENDING'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <BatchStatusBadge
                          status={batch.status === 'ERP_SYNCED' ? '_SUPPLIER_COMPLETE' : batch.status}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {batch.erpSyncedAt ? (
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                              {new Date(batch.erpSyncedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-300 uppercase tracking-wide font-bold">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-slate-400 font-medium whitespace-nowrap">
                        {new Date('2026-05-16').toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

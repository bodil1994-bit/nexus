'use client';

import { useEffect, useState } from 'react';
import { calculateDashboardStats } from '@/lib/manufacturer/dashboardStats';
import { ManufacturerKpiCards } from './ManufacturerKpiCards';
import { ManufacturerBatchTable, type OrderRow } from './ManufacturerBatchTable';
import { ManufacturerBatchDetail } from './ManufacturerBatchDetail';
import Link from 'next/link';
import { LayoutDashboard, RefreshCcw, AlertCircle } from 'lucide-react';

export function ManufacturerDashboard() {
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [error, setError] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/manufacturer/orders')
      .then((res) => {
        if (!res.ok) throw new Error('fetch failed');
        return res.json() as Promise<{ orders: OrderRow[] }>;
      })
      .then((data) => setOrders(data.orders))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 px-6 text-center">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-2">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-xl font-bold">Failed to load dashboard</h2>
          <p className="text-slate-500 max-w-xs">
            There was a problem connecting to the Veloport gateway. Please check your connection and try again.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (orders === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <div className="flex flex-col items-center gap-4">
          <RefreshCcw className="animate-spin text-emerald-600" size={32} />
          <p className="text-slate-500 animate-pulse font-medium tracking-wide uppercase text-[10px]">Synchronizing with ERP...</p>
        </div>
      </div>
    );
  }

  const manufacturerName = orders[0]?.manufacturer?.name;
  const stats = calculateDashboardStats(orders);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden selection:bg-emerald-100">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl py-12 px-6">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-4">
              <LayoutDashboard size={12} />
              <span>Manufacturer Central</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              {manufacturerName || 'Veloport Dashboard'}
            </h1>
            <p className="mt-2 text-slate-500 max-w-xl text-lg">
              Monitor supplier battery passport submissions, analyze compliance readiness, 
              and manage ERP synchronization for your global supply chain.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <Link href="/" className="px-6 py-2 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm">
               System Home
             </Link>
             <Link href="/supplier/upload" className="px-6 py-2 rounded-full bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
               New Submission
             </Link>
          </div>
        </header>

        {orders.length === 0 || stats.totalBatches === 0 ? (
          <div className="rounded-2xl border border-white bg-white/60 p-20 text-center backdrop-blur-xl shadow-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 mb-6">
              <LayoutDashboard size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No batches found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Supplier submissions will appear here once they are uploaded via the supplier portal.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            <ManufacturerKpiCards stats={stats} />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Global Batch Inventory</h2>
                <span className="text-[10px] font-mono text-slate-500 px-2 py-1 bg-white/80 rounded border border-white shadow-sm">
                  Showing {stats.totalBatches} active records
                </span>
              </div>
              <ManufacturerBatchTable
                orders={orders}
                onSelectBatch={setSelectedBatchId}
              />
            </div>

            {selectedBatchId && (() => {
              const entry = orders
                .flatMap((o) => o.batches.map((b) => ({ order: o, batch: b })))
                .find(({ batch }) => batch.id === selectedBatchId);
              return entry ? (
                <div className="pb-20">
                  <ManufacturerBatchDetail
                    order={entry.order}
                    batch={entry.batch}
                    onClose={() => setSelectedBatchId(null)}
                  />
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

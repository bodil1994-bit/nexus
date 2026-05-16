'use client';

import { useEffect, useState } from 'react';
import { calculateDashboardStats } from '@/lib/manufacturer/dashboardStats';
import { ManufacturerKpiCards } from './ManufacturerKpiCards';
import { ManufacturerBatchTable, type OrderRow } from './ManufacturerBatchTable';
import { ManufacturerBatchDetail } from './ManufacturerBatchDetail';

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
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-zinc-500">
          Could not load manufacturer dashboard. Please try again.
        </p>
      </div>
    );
  }

  if (orders === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-zinc-500">Loading manufacturer dashboard...</p>
      </div>
    );
  }

  const manufacturerName = orders[0]?.manufacturer?.name;
  const stats = calculateDashboardStats(orders);

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-900">Manufacturer Dashboard</h1>
          {manufacturerName && (
            <p className="mt-1 text-sm text-zinc-500">{manufacturerName}</p>
          )}
          <p className="mt-1 text-sm text-zinc-500">
            Track supplier passport submissions and ERP sync readiness.
          </p>
        </div>

        {orders.length === 0 || stats.totalBatches === 0 ? (
          <p className="text-zinc-400 text-sm">
            No supplier batches submitted yet. Supplier submissions will appear here once uploaded.
          </p>
        ) : (
          <>
            <ManufacturerKpiCards stats={stats} />
            <ManufacturerBatchTable
              orders={orders}
              onSelectBatch={setSelectedBatchId}
            />
            {selectedBatchId && (() => {
              const entry = orders
                .flatMap((o) => o.batches.map((b) => ({ order: o, batch: b })))
                .find(({ batch }) => batch.id === selectedBatchId);
              return entry ? (
                <ManufacturerBatchDetail
                  order={entry.order}
                  batch={entry.batch}
                  onClose={() => setSelectedBatchId(null)}
                />
              ) : null;
            })()}
          </>
        )}
      </div>
    </div>
  );
}

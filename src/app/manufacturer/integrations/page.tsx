import { prisma } from '@/lib/prisma';
import { IntegrationForm } from './IntegrationForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata = { title: 'ERP Integration · Veloport' };

export default async function IntegrationsPage() {
  const manufacturer = await prisma.manufacturer.findFirst({
    include: { erpIntegration: true },
  });

  if (!manufacturer) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">No manufacturer found. Run the seed first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-2xl py-12 px-6">
        <div className="mb-8">
          <Link
            href="/manufacturer/orders"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6"
          >
            <ChevronLeft size={16} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">ERP Integration</h1>
          <p className="mt-2 text-slate-500">
            Connect your ERP system to automatically receive passport data when a batch is complete.
          </p>
        </div>

        <IntegrationForm integration={manufacturer.erpIntegration} />
      </div>
    </div>
  );
}

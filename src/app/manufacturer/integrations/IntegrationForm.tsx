'use client';

import { ErpIntegration } from '@prisma/client';
import { saveIntegration, deleteIntegration } from './actions';
import { Plug, Trash2 } from 'lucide-react';

interface Props {
  integration: ErpIntegration | null;
}

export function IntegrationForm({ integration }: Props) {
  return (
    <div className="space-y-6">
      {!integration && (
        <div className="flex flex-col items-center gap-3 py-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Plug size={22} />
          </div>
          <div>
            <p className="font-semibold text-slate-800">No ERP connected</p>
            <p className="text-sm text-slate-500 mt-1">Fill in the form below to connect your ERP system.</p>
          </div>
        </div>
      )}

      {integration && (
        <div className="flex items-center gap-3 px-5 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Plug size={18} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-800">{integration.type}</p>
            <p className="text-xs text-slate-500 mt-0.5">{integration.baseUrl}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              integration.enabled
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {integration.enabled ? 'Active' : 'Disabled'}
          </span>
        </div>
      )}

      <form action={saveIntegration} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</label>
          <select
            name="type"
            defaultValue={integration?.type ?? 'ODOO'}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="ODOO">Odoo</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Base URL</label>
          <input
            name="baseUrl"
            type="text"
            placeholder="https://mycompany.odoo.com"
            defaultValue={integration?.baseUrl ?? ''}
            required
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Database</label>
          <input
            name="database"
            type="text"
            placeholder="mycompany"
            defaultValue={integration?.database ?? ''}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Username</label>
          <input
            name="username"
            type="text"
            defaultValue={integration?.username ?? ''}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">API Key</label>
          <input
            name="apiKey"
            type="password"
            defaultValue={integration?.apiKey ?? ''}
            required
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Model</label>
          <input
            name="targetModel"
            type="text"
            defaultValue={integration?.targetModel ?? 'stock.lot'}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            name="enabled"
            id="enabled"
            type="checkbox"
            defaultChecked={integration?.enabled ?? true}
            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-400"
          />
          <label htmlFor="enabled" className="text-sm font-medium text-slate-700">Enabled</label>
        </div>

        <button
          type="submit"
          className="px-5 py-2 rounded-full bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-sm"
        >
          {integration ? 'Update Integration' : 'Connect ERP'}
        </button>
      </form>

      {integration && (
        <form action={deleteIntegration.bind(null, integration.id)} className="pt-0">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} />
            Remove Integration
          </button>
        </form>
      )}
    </div>
  );
}

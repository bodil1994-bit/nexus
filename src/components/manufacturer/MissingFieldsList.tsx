import { FIELD_LABELS } from '@/lib/domain/fieldLabels';
import { AlertCircle, Mail, Clock } from 'lucide-react';

type Props = {
  missingFields: string[];
  supplierEmail?: string | null;
  supplierNotifiedAt?: string | null;
};

export function MissingFieldsList({ missingFields, supplierEmail, supplierNotifiedAt }: Props) {
  if (missingFields.length === 0) {
    return (
      <div className="flex items-center gap-2 text-emerald-600">
        <AlertCircle size={16} />
        <p className="text-sm font-semibold">All required fields are complete.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
        {missingFields.map((field) => (
          <li key={field} className="flex items-center gap-2 text-sm text-amber-700 font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-sm" />
            {FIELD_LABELS[field] ?? field}
          </li>
        ))}
      </ul>
      
      <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
        {supplierEmail && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
            <Mail size={12} className="text-slate-400" />
            <span>Supplier: <span className="text-slate-900 font-medium">{supplierEmail}</span></span>
          </div>
        )}
        {supplierNotifiedAt && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
            <Clock size={12} className="text-slate-400" />
            <span>Notified: <span className="text-slate-900 font-medium">{new Date(supplierNotifiedAt).toLocaleDateString()}</span></span>
          </div>
        )}
      </div>
    </div>
  );
}

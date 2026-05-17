import { FIELD_LABELS } from '@/lib/domain/fieldLabels';
import { CheckCircle2, Mail, Clock, AlertTriangle } from 'lucide-react';

type Props = {
  missingFields: string[];
  supplierEmail?: string | null;
  supplierNotifiedAt?: string | null;
};

export function MissingFieldsList({ missingFields, supplierEmail, supplierNotifiedAt }: Props) {
  if (missingFields.length === 0) {
    return (
      <div className="flex items-center gap-2 text-emerald-600">
        <CheckCircle2 size={16} />
        <p className="text-sm font-semibold">All required fields are complete.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
        {missingFields.map((field) => (
          <li key={field} className="flex items-center gap-2.5 text-sm text-orange-800 font-medium">
            <AlertTriangle size={12} className="text-orange-500 flex-shrink-0" />
            {FIELD_LABELS[field] ?? field}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-3 pt-4 border-t border-orange-100">
        {supplierEmail && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            <Mail size={12} className="text-slate-400" />
            <span>Supplier: <span className="text-slate-900 font-medium">{supplierEmail}</span></span>
          </div>
        )}
        {supplierNotifiedAt && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            <Clock size={12} className="text-slate-400" />
            <span>Notified: <span className="text-slate-900 font-medium">{new Date(supplierNotifiedAt).toLocaleDateString()}</span></span>
          </div>
        )}
      </div>
    </div>
  );
}

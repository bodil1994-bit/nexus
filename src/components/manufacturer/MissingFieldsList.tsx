import { FIELD_LABELS } from '@/lib/domain/fieldLabels';

type Props = {
  missingFields: string[];
  supplierEmail?: string | null;
  supplierNotifiedAt?: string | null;
};

export function MissingFieldsList({ missingFields, supplierEmail, supplierNotifiedAt }: Props) {
  if (missingFields.length === 0) {
    return <p className="text-sm text-zinc-500">No required fields missing.</p>;
  }

  return (
    <div>
      <ul className="mb-3 space-y-1">
        {missingFields.map((field) => (
          <li key={field} className="text-sm text-amber-700">
            {FIELD_LABELS[field] ?? field}
          </li>
        ))}
      </ul>
      {supplierEmail && (
        <p className="text-sm text-zinc-500">Supplier: {supplierEmail}</p>
      )}
      {supplierNotifiedAt && (
        <p className="text-sm text-zinc-500">
          Data requested: {new Date(supplierNotifiedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}

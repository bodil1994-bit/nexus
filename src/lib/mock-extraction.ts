export const CANONICAL_FIELDS = [
  'product_name',
  'material',
  'origin_country',
  'supplier_name',
  'sustainability_notes',
] as const;

export type ExtractionResult = {
  status: 'complete' | 'missing_information';
  extractedFields: Record<string, string | null>;
  missingFields: string[];
};

const MOCK_VALUES: Record<string, string> = {
  product_name: 'LFP Battery Pack',
  material: 'Lithium Iron Phosphate',
  origin_country: 'Germany',
  supplier_name: 'CellChem GmbH',
  sustainability_notes: 'Certified carbon-neutral manufacturing',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function mockExtract(_filename: string): ExtractionResult {
  const isComplete = Math.random() < 0.5;

  if (isComplete) {
    return {
      status: 'complete',
      extractedFields: Object.fromEntries(CANONICAL_FIELDS.map((f) => [f, MOCK_VALUES[f]])),
      missingFields: [],
    };
  }

  const missingCount = Math.floor(Math.random() * (CANONICAL_FIELDS.length - 1)) + 1;
  const missing = [...CANONICAL_FIELDS].sort(() => Math.random() - 0.5).slice(0, missingCount);

  return {
    status: 'missing_information',
    extractedFields: Object.fromEntries(
      CANONICAL_FIELDS.map((f) => [f, missing.includes(f) ? null : MOCK_VALUES[f]])
    ),
    missingFields: missing,
  };
}

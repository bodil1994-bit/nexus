export function createPassportReferenceId(orderNumber: string, batchNumber: string) {
  const normalize = (value: string) =>
    value
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  return `DPP-${normalize(orderNumber)}-${normalize(batchNumber)}`;
}

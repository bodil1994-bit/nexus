// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { CANONICAL_FIELDS, mockExtract } from '../lib/mock-extraction';

describe('mockExtract', () => {
  it('returns status complete or missing_information', () => {
    const result = mockExtract('test.pdf');
    expect(['complete', 'missing_information']).toContain(result.status);
  });

  it('always returns all five canonical field keys in extractedFields', () => {
    for (let i = 0; i < 20; i++) {
      const result = mockExtract(`file-${i}.csv`);
      for (const key of CANONICAL_FIELDS) {
        expect(result.extractedFields).toHaveProperty(key);
      }
    }
  });

  it('missing_information result has non-empty missingFields array', () => {
    let found = false;
    for (let i = 0; i < 100; i++) {
      const result = mockExtract(`file-${i}.json`);
      if (result.status === 'missing_information') {
        expect(result.missingFields.length).toBeGreaterThan(0);
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });
});

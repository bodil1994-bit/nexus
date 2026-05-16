// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { createPassportReferenceId } from '@/lib/passport-reference';

describe('createPassportReferenceId', () => {
  it('creates a deterministic passport ID from order and batch numbers', () => {
    expect(createPassportReferenceId('ord-bsh 2024/0441', 'bat-pt500-003')).toBe(
      'DPP-ORD-BSH-2024-0441-BAT-PT500-003',
    );
  });
});

// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  parseMissingFields,
  getBatchStatusLabel,
  calculateDashboardStats,
} from '@/lib/manufacturer/dashboardStats';

describe('parseMissingFields', () => {
  it('returns [] for null', () => {
    expect(parseMissingFields(null)).toEqual([]);
  });

  it('returns [] for undefined', () => {
    expect(parseMissingFields(undefined)).toEqual([]);
  });

  it('parses valid JSON array', () => {
    const json = JSON.stringify(['batteryModel', 'batteryChemistry']);
    expect(parseMissingFields(json)).toEqual(['batteryModel', 'batteryChemistry']);
  });

  it('returns [] for malformed JSON', () => {
    expect(parseMissingFields('not-valid-json')).toEqual([]);
  });
});

describe('getBatchStatusLabel', () => {
  it('returns Processing for PROCESSING', () => {
    expect(getBatchStatusLabel('PROCESSING')).toBe('Processing');
  });

  it('returns Data missing for INCOMPLETE', () => {
    expect(getBatchStatusLabel('INCOMPLETE')).toBe('Data missing');
  });

  it('returns ERP synced for ERP_SYNCED', () => {
    expect(getBatchStatusLabel('ERP_SYNCED')).toBe('ERP synced');
  });
});

describe('calculateDashboardStats', () => {
  it('counts correctly across multiple orders', () => {
    const orders = [
      {
        batches: [
          { status: 'PROCESSING' },
          { status: 'INCOMPLETE' },
          { status: 'ERP_SYNCED' },
        ],
      },
      {
        batches: [
          { status: 'INCOMPLETE' },
          { status: 'ERP_SYNCED' },
        ],
      },
    ];
    const stats = calculateDashboardStats(orders);
    expect(stats.totalBatches).toBe(5);
    expect(stats.processingBatches).toBe(1);
    expect(stats.incompleteBatches).toBe(2);
    expect(stats.erpSyncedBatches).toBe(2);
  });

  it('returns zeros for empty orders', () => {
    const stats = calculateDashboardStats([]);
    expect(stats.totalBatches).toBe(0);
    expect(stats.incompleteBatches).toBe(0);
    expect(stats.erpSyncedBatches).toBe(0);
    expect(stats.processingBatches).toBe(0);
  });
});

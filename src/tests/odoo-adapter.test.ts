// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OdooAdapter } from '../lib/erp/odoo-adapter';
import type { ErpAdapterConfig, ErpPayload } from '../lib/erp/types';

const config: ErpAdapterConfig = {
  type: 'ODOO',
  baseUrl: 'https://test.odoo.com',
  database: 'testdb',
  username: 'admin',
  apiKey: 'test-key',
  targetModel: 'stock.lot',
};

const payload: ErpPayload = {
  orderNumber: 'ORD-001',
  batchNumber: 'BAT-001',
  passportReferenceId: 'PASS-001',
  passportUrl: '/passport/PASS-001',
};

const authXml = `<?xml version="1.0"?><methodResponse><params><param><value><int>2</int></value></param></params></methodResponse>`;
const createXml = `<?xml version="1.0"?><methodResponse><params><param><value><int>42</int></value></param></params></methodResponse>`;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('OdooAdapter', () => {
  it('authenticate returns uid from mocked XML response', async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, text: async () => authXml })
      .mockResolvedValueOnce({ ok: true, text: async () => createXml });
    vi.stubGlobal('fetch', mockFetch);

    const adapter = new OdooAdapter(config);
    const result = await adapter.sync(payload);

    expect(result.success).toBe(true);
    // First call must be to /xmlrpc/2/common (authenticate)
    expect((mockFetch.mock.calls[0][0] as string)).toContain('/xmlrpc/2/common');
    // uid 2 from auth response must be used in second call body
    const executeBody = mockFetch.mock.calls[1][1].body as string;
    expect(executeBody).toContain('<int>2</int>');
  });

  it('sync calls execute_kw and returns externalId on success', async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, text: async () => authXml })
      .mockResolvedValueOnce({ ok: true, text: async () => createXml });
    vi.stubGlobal('fetch', mockFetch);

    const adapter = new OdooAdapter(config);
    const result = await adapter.sync(payload);

    expect(result).toEqual({ success: true, externalId: 42 });
    expect((mockFetch.mock.calls[1][0] as string)).toContain('/xmlrpc/2/object');
    const body = mockFetch.mock.calls[1][1].body as string;
    expect(body).toContain('execute_kw');
  });

  it('sync returns { success: false, error } when fetch throws', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    vi.stubGlobal('fetch', mockFetch);

    const adapter = new OdooAdapter(config);
    const result = await adapter.sync(payload);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network error');
  });
});

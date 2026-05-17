import { ErpAdapter, ErpAdapterConfig, ErpPayload, ErpSyncResult } from './types';

interface XmlRpcObject {
  [key: string]: XmlRpcValue;
}

type XmlRpcValue = string | number | boolean | null | XmlRpcObject | XmlRpcValue[];

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function serializeValue(v: XmlRpcValue): string {
  if (v === null || v === undefined) return '<value></value>';
  if (typeof v === 'boolean') return `<value><boolean>${v ? '1' : '0'}</boolean></value>`;
  if (typeof v === 'number' && Number.isInteger(v)) return `<value><int>${v}</int></value>`;
  if (typeof v === 'number') return `<value><double>${v}</double></value>`;
  if (typeof v === 'string') return `<value><string>${escapeXml(v)}</string></value>`;
  if (Array.isArray(v)) {
    return `<value><array><data>${v.map(serializeValue).join('')}</data></array></value>`;
  }
  const members = Object.entries(v)
    .map(([k, val]) => `<member><name>${escapeXml(k)}</name>${serializeValue(val)}</member>`)
    .join('');
  return `<value><struct>${members}</struct></value>`;
}

export function buildXmlRpcCall(method: string, params: XmlRpcValue[]): string {
  const paramsXml = params.map((p) => `<param>${serializeValue(p)}</param>`).join('');
  return `<?xml version="1.0"?><methodCall><methodName>${escapeXml(method)}</methodName><params>${paramsXml}</params></methodCall>`;
}

function parseIntFromXml(xml: string): number | null {
  const m = xml.match(/<int>(\d+)<\/int>/);
  return m ? parseInt(m[1], 10) : null;
}

export class OdooAdapter implements ErpAdapter {
  constructor(private config: ErpAdapterConfig) {}

  private async authenticate(): Promise<number> {
    const { baseUrl, database, username, apiKey } = this.config;
    const body = buildXmlRpcCall('authenticate', [database ?? '', username ?? '', apiKey, {}]);
    const res = await fetch(`${baseUrl}/xmlrpc/2/common`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml' },
      body,
    });
    if (!res.ok) throw new Error(`Authenticate failed: HTTP ${res.status}`);
    const text = await res.text();
    const uid = parseIntFromXml(text);
    if (uid === null) throw new Error('Authenticate failed: no uid in response');
    return uid;
  }

  async sync(payload: ErpPayload): Promise<ErpSyncResult> {
    try {
      const uid = await this.authenticate();
      const { baseUrl, database, apiKey, targetModel } = this.config;
      const body = buildXmlRpcCall('execute_kw', [
        database ?? '',
        uid,
        apiKey,
        targetModel,
        'create',
        [{ name: payload.passportReferenceId, note: JSON.stringify(payload) }],
        {},
      ]);
      const res = await fetch(`${baseUrl}/xmlrpc/2/object`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml' },
        body,
      });
      if (!res.ok) return { success: false, error: `HTTP ${res.status}` };
      const text = await res.text();
      const externalId = parseIntFromXml(text);
      if (externalId === null) return { success: false, error: 'No id in response' };
      return { success: true, externalId };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  }
}

import { OdooAdapter } from './odoo-adapter';
import { ErpAdapter, ErpAdapterConfig } from './types';

export function getAdapter(config: ErpAdapterConfig): ErpAdapter {
  if (config.type === 'ODOO') return new OdooAdapter(config);
  throw new Error(`Unsupported ERP type: ${config.type}`);
}

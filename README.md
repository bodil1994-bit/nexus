# Veloport

Battery passport compliance infrastructure for the EU e-bike supply chain.

Veloport connects battery manufacturers, bike manufacturers, and end customers around the EU Battery Regulation 2023/1542 — turning messy supplier data into verified digital product passports, automatically.

---

## What it does

**Suppliers** upload battery documentation in any format. Veloport's AI extraction normalises it into a clean, regulation-compliant passport record.

**Manufacturers** get a live compliance dashboard. Missing data is flagged immediately, suppliers are notified automatically, and complete batches are pushed to the manufacturer's ERP via API — no manual entry.

**Customers** scan a QR code and get a hosted digital passport: carbon footprint, recycled content, supply chain origin, and a live map of nearby recycling and repair points.

---

## Demo flows

| Flow | URL |
|------|-----|
| Supplier upload | `http://localhost:3000/supplier/upload` |
| Manufacturer dashboard | `http://localhost:3000/manufacturer/orders` |
| ERP integration settings | `http://localhost:3000/manufacturer/integrations` |
| Customer passport | `http://localhost:3000/passport/BAT-BSH-PT625-2026-008314` |

---

## Stack

- Next.js 16 · React 19
- Prisma 7 · SQLite
- Tailwind CSS 4
- Vitest

---

## Getting started

```bash
npm install
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

---

## Key commands

```bash
npm run dev          # start dev server
npm run db:seed      # reset and reseed demo data
npm run db:studio    # open database UI
npm run typecheck    # TypeScript check
npm run lint         # lint
npm test             # run tests
```

---

## ERP integration

Manufacturers can connect one ERP system at `/manufacturer/integrations`. When a batch reaches **COMPLETE** status, the passport payload is pushed to the configured ERP automatically.

Supported systems: **Odoo** (XML-RPC, no extra dependencies). The adapter pattern in `src/lib/erp/` makes it straightforward to add other systems.

The sync is gated behind an environment variable — set it in `.env.production` or your deployment environment:

```bash
ERP_SYNC_ENABLED=true
ODOO_BASE_URL=https://mycompany.odoo.com   # configured per manufacturer in the UI
```

In development (`npm run dev`) the sync is always skipped regardless of env vars — no Odoo instance required.

---

## Project structure

```
src/
  app/                  # Next.js routes and pages
  components/           # UI components
  lib/
    erp/                # ERP adapter interface, Odoo client, sync service
    retailer/           # Passport view builder
prisma/
  schema.prisma         # Database schema
  seed.ts               # Demo data
```

---

Built for EU Battery Regulation 2023/1542 compliance. Passport v1.0 · 2026.

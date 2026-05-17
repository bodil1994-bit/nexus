# Veloport

Battery passport compliance infrastructure for the EU e-bike supply chain.

Veloport connects battery manufacturers, bike manufacturers, and end customers around the EU Battery Regulation 2023/1542 — turning messy supplier data into verified digital product passports, automatically.

---

## What it does

**Suppliers** upload battery documentation in any format. Veloport's AI extraction normalises it into a clean, regulation-compliant passport record.

**Manufacturers** get a live compliance dashboard. Missing data is flagged immediately, suppliers are notified automatically, and complete batches are pushed to the manufacturer's ERP via API — no manual entry.

**Customers** scan a QR code and get a hosted digital passport: carbon footprint, recycled content, supply chain origin, and a live map of nearby recycling and repair points.

---

## Application routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/supplier/upload` | Supplier battery document upload |
| `/supplier/batches` | Supplier batch list |
| `/supplier/batches/:id` | Supplier batch detail |
| `/manufacturer/orders` | Manufacturer compliance dashboard |
| `/manufacturer/integrations` | ERP integration settings |
| `/manufacturer/erp` | ERP sync view (Odoo) |
| `/passport/:passportId` | Public digital product passport |

---

## API endpoints

### `GET /api/manufacturer/orders`

Returns all orders with associated suppliers, manufacturers, batches, and passport data.

**Response**
```json
{
  "orders": [
    {
      "id": "...",
      "orderNumber": "ORD-KTM-BSH-2026",
      "supplier": { ... },
      "manufacturer": { ... },
      "batches": [
        {
          "batchNumber": "BAT-BSH-PT625-002",
          "status": "COMPLETE",
          "passport": { ... }
        }
      ]
    }
  ]
}
```

---

### `GET /api/passport/:passportId`

Returns a single digital product passport by ID.

**Response**
```json
{
  "passport": {
    "id": "...",
    "passportId": "BAT-BSH-PT625-2026-008314",
    "passportUrl": "...",
    "passportType": "BATTERY",
    "batteryData": { ... }
  }
}
```

**404** when passport not found:
```json
{ "error": "Not found" }
```

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
npm run db:seed      # reset and reseed data
npm run db:studio    # open database UI
npm run typecheck    # TypeScript check
npm run lint         # lint
npm test             # run tests
```

---

## ERP integration

Manufacturers connect an ERP system at `/manufacturer/integrations`. When a batch reaches **COMPLETE** status, the passport payload is pushed to the configured ERP automatically.

Supported: **Odoo** (XML-RPC). The adapter interface in `src/lib/erp/` supports additional systems.

```bash
ERP_SYNC_ENABLED=true
ODOO_BASE_URL=https://mycompany.odoo.com
```

In development the sync is always skipped regardless of env vars.

---

## Project structure

```
src/
  app/                  # Next.js routes and pages
    api/
      manufacturer/orders/    # GET /api/manufacturer/orders
      passport/[passportId]/  # GET /api/passport/:passportId
  components/           # UI components
  lib/
    erp/                # ERP adapter interface, Odoo client, sync service
    retailer/           # Passport view builder
prisma/
  schema.prisma         # Database schema
  seed.ts               # Seed data
```

---

Built for EU Battery Regulation 2023/1542 compliance. Passport v1.0 · 2026.

# PassportOps PRD

## Goal
PassportOps is a hackathon MVP for manufacturer ERP integration with Digital Product Passports.

## Core Flow
```text
Supplier enters order number, batch number, and passport information
-> AI extracts and normalizes data into BatteryPassportData
-> system checks required fields
-> if incomplete: supplier sees missing fields and is notified
-> if complete: order number + batch number + passport reference ID sync to manufacturer ERP
-> manufacturer can view enrichment insights and retailer export
```

## Core Rules
- Supplier portal is scoped to exactly one manufacturer.
- Supplier does not select or switch manufacturers.
- Supplier enters the order number manually.
- Supplier creates one or more batches for that order.
- Each batch has exactly one passport.
- Backend finds or creates Order by `orderNumber + supplierId + manufacturerId`.
- One Order has many Batch records.
- One Batch has exactly one DigitalProductPassport.
- One DigitalProductPassport has exactly one BatteryPassportData.
- Batches only exist after supplier submission.
- Batch statuses are only `PROCESSING`, `INCOMPLETE`, and `ERP_SYNCED`.

## Database Models
Only use these models:
- Supplier
- Manufacturer
- Order
- Batch
- DigitalProductPassport
- BatteryPassportData

Do not add tables for:
- FieldMapping
- ValidationIssue
- Enrichment
- RetailerPassport
- ErpSyncEvent
- AuditLog

## Architecture Principles
- Keep it simple and explicit.
- Prefer plain functions over abstractions.
- Keep business logic in `src/lib`.
- Keep components focused on rendering and calling actions.
- Store core state; generate derived views.
- Do not add new DB tables unless agreed by the team.

## Stored Vs Generated
Store:
- raw supplier input
- canonical BatteryPassportData
- batch status
- missingFieldsJson
- supplierNotifiedAt
- erpSyncedAt
- erpPayloadJson

Generate:
- missing-field display
- supplier notification text
- ERP payload
- enrichment insights
- retailer passport view
- retailer export
- order status

## Required MVP Fields
Use this subset for missing-field checks:

```ts
export const REQUIRED_BATTERY_PASSPORT_FIELDS = [
  'uniqueBatteryIdentifier',
  'batteryCategory',
  'batteryModel',
  'batteryChemistry',
  'manufacturerName',
  'manufactureYear',
  'grossCapacityKwh',
  'carbonFootprintKgCo2ePerKwh',
  'recycledCobaltPercentage',
  'recycledLithiumPercentage',
  'declarationOfConformityRef',
  'qrCodeAffixed',
] as const;
```

Do not validate all 102 fields in the MVP.

## Modules
- `src/lib/passport-processing`: AI extraction, normalization, missing-field checks, readiness score
- `src/lib/erp`: ERP payload generation
- `src/lib/email`: supplier notification text
- `src/lib/enrichment`: manufacturer supplier-decision insights
- `src/lib/retailer`: retailer passport view/export

## API Routes
Core routes:
- `POST /api/supplier/batch-submissions`
- `GET /api/manufacturer/orders`
- `GET /api/batches/[batchId]/enrichment`
- `GET /api/batches/[batchId]/retailer-passport`

`POST /api/supplier/batch-submissions` should:
1. Read `orderNumber` and batches from request.
2. Use current `supplierId + manufacturerId` context.
3. Find or create Order.
4. Create Batch with status `PROCESSING`.
5. Save raw input.
6. AI extract and normalize passport fields.
7. Create DigitalProductPassport.
8. Create BatteryPassportData.
9. Calculate missing fields.
10. If missing: set `INCOMPLETE + supplierNotifiedAt`.
11. If complete: build ERP payload and set `ERP_SYNCED`.

## Supplier UI
Supplier sees:
- read-only manufacturer name
- order number input
- batch number input
- passport upload/input
- submitted batches
- status
- missing fields when incomplete

Supplier does not see:
- manufacturer selector
- enrichment
- retailer export
- ERP internals beyond status

## Manufacturer UI
Manufacturer sees:
- supplier-created orders and batches
- batch status
- missing fields
- data requested from supplier
- supplier notification timestamp
- ERP sync state
- ERP payload/reference
- enrichment insights
- retailer view/export

## AI Rules
AI may:
- extract supplier input
- normalize fields into BatteryPassportData
- summarize/enrich existing data
- generate supplier notification text

AI must not:
- invent missing values
- decide legal compliance
- bypass required-field checks
- mark incomplete data as complete

## Status Logic
`PROCESSING`:
Submitted and being processed.

`INCOMPLETE`:
Required fields are missing. Supplier sees missing fields. Manufacturer sees data was requested from supplier.

`ERP_SYNCED`:
Required fields are complete. `orderNumber + batchNumber + passport reference ID` were synced to ERP.

No `AWAITING_UPLOAD`.
No `COMPLETE` unless manual approval is added.

## Testing
Prioritize pure function tests:
- `getMissingFields`
- `calculateReadinessScore`
- `buildErpPayload`
- `buildSupplierEmail`
- `buildRetailerPassport`
- `buildEnrichmentInsight`

Before pushing:
```bash
npm run typecheck
npm run lint
npm run test
```

## Do Not Build
Do not build unless explicitly agreed:
- auth
- permissions
- real SAP integration
- real email sending
- audit trail
- mapping history
- supplier onboarding
- retailer login
- all 102-field validation
- multi-manufacturer supplier UI
- supplier order picker

## Definition Of Done
A change is done when:
- it has one responsibility
- it works with seed data
- it keeps the core flow working
- it is easy to read
- it does not add unnecessary tables
- it can be explained in one sentence

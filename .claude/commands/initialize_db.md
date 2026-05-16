Use this prompt in Cursor / Claude Code / ChatGPT agent:

Replace the current `prisma/schema.prisma` with the PassportOps MVP schema below.
Requirements:
- Keep SQLite datasource with `url = "file:./dev.db"`.
- Keep Prisma client generator.
- Models must be: Supplier, Manufacturer, Order, Batch, DigitalProductPassport, BatteryPassportData.
- Batch status values are stored as strings and should support: PROCESSING, INCOMPLETE, COMPLETE, ERP_SYNCED.
- A batch only exists after supplier upload
- One Order has many Batches.
- One Batch has exactly one DigitalProductPassport.
- One DigitalProductPassport has exactly one BatteryPassportData.
- Do not add FieldMapping, ValidationIssue, Enrichment, RetailerPassport, or ErpSyncEvent tables.
- After updating the schema, add/update `prisma/seed.ts` to create demo data:
    - Supplier: CellChem GmbH, email supplier@cellchem.example
    - Manufacturer: VeloMotion GmbH
    - Order: ORD-4491
    - Batches:
        - BAT-014, sku EBIKE-BAT-500, quantity 500, status PROCESSING
        - BAT-015, sku EBIKE-BAT-750, quantity 300, status PROCESSING
- Add package.json scripts:
    - "db:migrate": "prisma migrate dev"
    - "db:seed": "prisma db seed"
    - "db:studio": "prisma studio"
    - "db:reset": "prisma migrate reset --force"
- Add Prisma seed config to package.json:
  "prisma": { "seed": "tsx prisma/seed.ts" }
- Ensure `tsx` is installed as a dev dependency if not already present.
- Do not commit or create `prisma/dev.db`.
  Schema to use:
  <PASTE_SCHEMA_HERE>

Replace <PASTE_SCHEMA_HERE> with this:

datasource db {
provider = "sqlite"
url      = "file:./dev.db"
}
generator client {
provider = "prisma-client-js"
}
model Supplier {
id     String  @id @default(cuid())
name   String  @unique
email  String?
orders Order[]
}
model Manufacturer {
id     String @id @default(cuid())
name   String @unique
orders Order[]
}
model Order {
id          String @id @default(cuid())
orderNumber String
supplierId String
supplier   Supplier @relation(fields: [supplierId], references: [id])
manufacturerId String
manufacturer   Manufacturer @relation(fields: [manufacturerId], references: [id])
batches Batch[]
@@unique([orderNumber, supplierId, manufacturerId])
}
model Batch {
id              String @id @default(cuid())
batchNumber     String
orderId         String
order           Order  @relation(fields: [orderId], references: [id])
manufacturerSku String
quantity        Int
status          String @default("PROCESSING")
// PROCESSING | INCOMPLETE | ERP_SYNCED
rawInputText    String?
sourceFormat    String?
// CSV | JSON | XLSX | XML | PDF | API | TEXT
missingFieldsJson String?
readinessScore    Int @default(0)
supplierNotifiedAt DateTime?
erpSyncedAt        DateTime?
erpPayloadJson     String?
passport DigitalProductPassport?
@@unique([orderId, batchNumber])
}
model DigitalProductPassport {
id           String @id @default(cuid())
passportId   String? @unique
passportType String  @default("BATTERY")
passportUrl  String?
batchId String @unique
batch   Batch  @relation(fields: [batchId], references: [id])
batteryData BatteryPassportData?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}
model BatteryPassportData {
id String @id @default(cuid())
passportDbId String @unique
passport     DigitalProductPassport @relation(fields: [passportDbId], references: [id])
uniqueBatteryIdentifier String?
batteryCategory         String?
batteryModel            String?
batteryChemistry        String?
manufacturerName        String?
manufactureYear         Int?
grossCapacityKwh        Float?
carbonFootprintKgCo2ePerKwh Float?
recycledCobaltPercentage  Float?
recycledLithiumPercentage Float?
declarationOfConformityRef String?
qrCodeAffixed           Boolean?
qrCodeUrl               String?
issueDate               String?
manufacturerIdentification String?
batteryCategoryAndModel    String?
placeOfManufacture         String?
dateOfManufacture          String?
batteryWeight              String?
ratedCapacity              String?
chemicalComposition        String?
hazardousSubstances        String?
fireExtinguishingAgent     String?
criticalRawMaterials       String?
carbonFootprintTotal                   String?
carbonFootprintPerformanceClass        String?
carbonDeclarationManufacturerDetails   String?
carbonDeclarationBatteryModel          String?
carbonDeclarationManufacturingLocation String?
carbonFootprintLifecycleBreakdown      String?
carbonDeclarationDocReference          String?
carbonDeclarationWebLink               String?
recycledContentCobalt  String?
recycledContentLithium String?
recycledContentNickel  String?
recycledContentLead    String?
renewableContentShare  String?
dueDiligenceStrategy              String?
dueDiligenceReport                String?
dueDiligenceVerificationSummary   String?
supplyChainRawMaterialDescription String?
supplyChainSupplierInfo           String?
supplyChainCountryOfOrigin        String?
supplyChainRawMaterialQuantities  String?
supplyChainAuditReport            String?
supplyChainConflictAreas          String?
recycledSourceEvidence            String?
ratedCapacityAh                  String?
minimumVoltage                   String?
nominalVoltage                   String?
maximumVoltage                   String?
originalPowerCapability          String?
powerLimits                      String?
expectedLifetimeCycles           String?
capacityThresholdExhaustion      String?
temperatureRangeStorage          String?
warrantyCalendarLife             String?
roundTripEfficiencyInitial       String?
roundTripEfficiencyAt50PctCycles String?
internalResistanceCell           String?
internalResistancePack           String?
cRateCycleLifeTest               String?
euDeclarationOfConformity String?
docReferenceNumber        String?
ceMarking                 String?
labellingRequirements     String?
cadmiumMarking            String?
leadMarking               String?
wasteInfoEndUserRole               String?
wasteInfoSeparateCollection        String?
wasteInfoTakebackPoints            String?
wasteInfoSafetyInstructions        String?
wasteInfoLabelMeanings             String?
wasteInfoHazardousSubstanceImpacts String?
individualBatteryIdentifier    String?
qrCode                         String?
operatingInstructionsReference String?
previousBatteryPassportLink    String?
detailedCompositionCathode      String?
detailedCompositionAnode        String?
detailedCompositionElectrolyte  String?
partNumbersComponents           String?
sparePartsSupplierContacts      String?
disassemblyExplodedDiagrams     String?
disassemblySequence             String?
disassemblyJoiningTechniques    String?
disassemblyRequiredTools        String?
disassemblyDamageWarnings       String?
disassemblyCellCountArrangement String?
safetyMeasures                  String?
testReportResults                        String?
ceNotifiedBodyReference                  String?
technicalDocumentationStandards          String?
technicalDocumentationGeneralDescription String?
individualRatedCapacityAndFade String?
individualPowerAndFade         String?
individualInternalResistance   String?
individualRoundTripEfficiency  String?
individualRemainingLifetime    String?
sohStateOfCertifiedEnergy       String?
sohRemainingCapacity            String?
sohRemainingPower               String?
sohRemainingRoundTripEfficiency String?
sohSelfDischargeRate            String?
sohOhmicResistance              String?
lifetimeManufactureAndCommissioningDate String?
lifetimeEnergyThroughput                String?
lifetimeCapacityThroughput              String?
lifetimeDeepDischarges                  String?
lifetimeExtremeTemperatureExposure      String?
lifetimeEquivalentFullCycles            String?
batteryStatus             String?
chargeDischargeCycleCount String?
negativeEventsLog         String?
operatingTemperatureLog   String?
stateOfChargeLog          String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

For the seed file, use this:

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
await prisma.batteryPassportData.deleteMany();
await prisma.digitalProductPassport.deleteMany();
await prisma.batch.deleteMany();
await prisma.order.deleteMany();
await prisma.supplier.deleteMany();
await prisma.manufacturer.deleteMany();
const supplier = await prisma.supplier.create({
data: {
name: 'CellChem GmbH',
email: 'supplier@cellchem.example',
},
});
const manufacturer = await prisma.manufacturer.create({
data: {
name: 'VeloMotion GmbH',
},
});
await prisma.order.create({
data: {
orderNumber: 'ORD-4491',
supplierId: supplier.id,
manufacturerId: manufacturer.id,
batches: {
create: [
{
batchNumber: 'BAT-014',
manufacturerSku: 'EBIKE-BAT-500',
quantity: 500,
status: 'PROCESSING',
},
{
batchNumber: 'BAT-015',
manufacturerSku: 'EBIKE-BAT-750',
quantity: 300,
status: 'PROCESSING',
},
],
},
},
});
console.log('Seeded PassportOps demo data');
}
main()
.catch((error) => {
console.error(error);
process.exit(1);
})
.finally(async () => {
await prisma.$disconnect();
});

Add this to package.json:

{
"scripts": {
"db:migrate": "prisma migrate dev",
"db:seed": "prisma db seed",
"db:studio": "prisma studio",
"db:reset": "prisma migrate reset --force"
},
"prisma": {
"seed": "tsx prisma/seed.ts"
}
}

Then run:

npm install -D tsx
npx prisma migrate dev --name init
npm run db:seed

Final check:

npx prisma studio

You should see:

1 Supplier
1 Manufacturer
1 Order
2 Batches
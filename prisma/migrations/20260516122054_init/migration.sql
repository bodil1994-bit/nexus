-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT
);

-- CreateTable
CREATE TABLE "Manufacturer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "manufacturerId" TEXT NOT NULL,
    CONSTRAINT "Order_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "batchNumber" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "manufacturerSku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PROCESSING',
    "rawInputText" TEXT,
    "sourceFormat" TEXT,
    "missingFieldsJson" TEXT,
    "readinessScore" INTEGER NOT NULL DEFAULT 0,
    "supplierNotifiedAt" DATETIME,
    "erpSyncedAt" DATETIME,
    "erpPayloadJson" TEXT,
    CONSTRAINT "Batch_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DigitalProductPassport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "passportId" TEXT,
    "passportType" TEXT NOT NULL DEFAULT 'BATTERY',
    "passportUrl" TEXT,
    "batchId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DigitalProductPassport_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BatteryPassportData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "passportDbId" TEXT NOT NULL,
    "uniqueBatteryIdentifier" TEXT,
    "batteryCategory" TEXT,
    "batteryModel" TEXT,
    "batteryChemistry" TEXT,
    "manufacturerName" TEXT,
    "manufactureYear" INTEGER,
    "grossCapacityKwh" REAL,
    "carbonFootprintKgCo2ePerKwh" REAL,
    "recycledCobaltPercentage" REAL,
    "recycledLithiumPercentage" REAL,
    "declarationOfConformityRef" TEXT,
    "qrCodeAffixed" BOOLEAN,
    "qrCodeUrl" TEXT,
    "issueDate" TEXT,
    "manufacturerIdentification" TEXT,
    "batteryCategoryAndModel" TEXT,
    "placeOfManufacture" TEXT,
    "dateOfManufacture" TEXT,
    "batteryWeight" TEXT,
    "ratedCapacity" TEXT,
    "chemicalComposition" TEXT,
    "hazardousSubstances" TEXT,
    "fireExtinguishingAgent" TEXT,
    "criticalRawMaterials" TEXT,
    "carbonFootprintTotal" TEXT,
    "carbonFootprintPerformanceClass" TEXT,
    "carbonDeclarationManufacturerDetails" TEXT,
    "carbonDeclarationBatteryModel" TEXT,
    "carbonDeclarationManufacturingLocation" TEXT,
    "carbonFootprintLifecycleBreakdown" TEXT,
    "carbonDeclarationDocReference" TEXT,
    "carbonDeclarationWebLink" TEXT,
    "recycledContentCobalt" TEXT,
    "recycledContentLithium" TEXT,
    "recycledContentNickel" TEXT,
    "recycledContentLead" TEXT,
    "renewableContentShare" TEXT,
    "dueDiligenceStrategy" TEXT,
    "dueDiligenceReport" TEXT,
    "dueDiligenceVerificationSummary" TEXT,
    "supplyChainRawMaterialDescription" TEXT,
    "supplyChainSupplierInfo" TEXT,
    "supplyChainCountryOfOrigin" TEXT,
    "supplyChainRawMaterialQuantities" TEXT,
    "supplyChainAuditReport" TEXT,
    "supplyChainConflictAreas" TEXT,
    "recycledSourceEvidence" TEXT,
    "ratedCapacityAh" TEXT,
    "minimumVoltage" TEXT,
    "nominalVoltage" TEXT,
    "maximumVoltage" TEXT,
    "originalPowerCapability" TEXT,
    "powerLimits" TEXT,
    "expectedLifetimeCycles" TEXT,
    "capacityThresholdExhaustion" TEXT,
    "temperatureRangeStorage" TEXT,
    "warrantyCalendarLife" TEXT,
    "roundTripEfficiencyInitial" TEXT,
    "roundTripEfficiencyAt50PctCycles" TEXT,
    "internalResistanceCell" TEXT,
    "internalResistancePack" TEXT,
    "cRateCycleLifeTest" TEXT,
    "euDeclarationOfConformity" TEXT,
    "docReferenceNumber" TEXT,
    "ceMarking" TEXT,
    "labellingRequirements" TEXT,
    "cadmiumMarking" TEXT,
    "leadMarking" TEXT,
    "wasteInfoEndUserRole" TEXT,
    "wasteInfoSeparateCollection" TEXT,
    "wasteInfoTakebackPoints" TEXT,
    "wasteInfoSafetyInstructions" TEXT,
    "wasteInfoLabelMeanings" TEXT,
    "wasteInfoHazardousSubstanceImpacts" TEXT,
    "individualBatteryIdentifier" TEXT,
    "qrCode" TEXT,
    "operatingInstructionsReference" TEXT,
    "previousBatteryPassportLink" TEXT,
    "detailedCompositionCathode" TEXT,
    "detailedCompositionAnode" TEXT,
    "detailedCompositionElectrolyte" TEXT,
    "partNumbersComponents" TEXT,
    "sparePartsSupplierContacts" TEXT,
    "disassemblyExplodedDiagrams" TEXT,
    "disassemblySequence" TEXT,
    "disassemblyJoiningTechniques" TEXT,
    "disassemblyRequiredTools" TEXT,
    "disassemblyDamageWarnings" TEXT,
    "disassemblyCellCountArrangement" TEXT,
    "safetyMeasures" TEXT,
    "testReportResults" TEXT,
    "ceNotifiedBodyReference" TEXT,
    "technicalDocumentationStandards" TEXT,
    "technicalDocumentationGeneralDescription" TEXT,
    "individualRatedCapacityAndFade" TEXT,
    "individualPowerAndFade" TEXT,
    "individualInternalResistance" TEXT,
    "individualRoundTripEfficiency" TEXT,
    "individualRemainingLifetime" TEXT,
    "sohStateOfCertifiedEnergy" TEXT,
    "sohRemainingCapacity" TEXT,
    "sohRemainingPower" TEXT,
    "sohRemainingRoundTripEfficiency" TEXT,
    "sohSelfDischargeRate" TEXT,
    "sohOhmicResistance" TEXT,
    "lifetimeManufactureAndCommissioningDate" TEXT,
    "lifetimeEnergyThroughput" TEXT,
    "lifetimeCapacityThroughput" TEXT,
    "lifetimeDeepDischarges" TEXT,
    "lifetimeExtremeTemperatureExposure" TEXT,
    "lifetimeEquivalentFullCycles" TEXT,
    "batteryStatus" TEXT,
    "chargeDischargeCycleCount" TEXT,
    "negativeEventsLog" TEXT,
    "operatingTemperatureLog" TEXT,
    "stateOfChargeLog" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BatteryPassportData_passportDbId_fkey" FOREIGN KEY ("passportDbId") REFERENCES "DigitalProductPassport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_name_key" ON "Supplier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Manufacturer_name_key" ON "Manufacturer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_supplierId_manufacturerId_key" ON "Order"("orderNumber", "supplierId", "manufacturerId");

-- CreateIndex
CREATE UNIQUE INDEX "Batch_orderId_batchNumber_key" ON "Batch"("orderId", "batchNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DigitalProductPassport_passportId_key" ON "DigitalProductPassport"("passportId");

-- CreateIndex
CREATE UNIQUE INDEX "DigitalProductPassport_batchId_key" ON "DigitalProductPassport"("batchId");

-- CreateIndex
CREATE UNIQUE INDEX "BatteryPassportData_passportDbId_key" ON "BatteryPassportData"("passportDbId");

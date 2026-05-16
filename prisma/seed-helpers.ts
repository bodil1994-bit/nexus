import { PrismaClient } from '@prisma/client';

export const CANONICAL_FIELDS = [
  'product_name',
  'material',
  'origin_country',
  'supplier_name',
  'sustainability_notes',
] as const;

export async function seedSupplierBatches(prisma: PrismaClient) {
  await prisma.batteryPassportData.deleteMany();
  await prisma.digitalProductPassport.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.order.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.manufacturer.deleteMany();

  const supplier = await prisma.supplier.create({
    data: { name: 'Samsung SDI Co., Ltd.', email: 'battery-supply@samsungsdi.example' },
  });

  const manufacturer = await prisma.manufacturer.create({
    data: { name: 'Robert Bosch GmbH' },
  });

  const order = await prisma.order.create({
    data: {
      orderNumber: 'ORD-BSH-2024-0441',
      supplierId: supplier.id,
      manufacturerId: manufacturer.id,
    },
  });

  const processingBatch = await prisma.batch.create({
    data: {
      batchNumber: 'BAT-PT625-001',
      orderId: order.id,
      manufacturerSku: 'BPT625',
      quantity: 500,
      status: 'processing',
    },
  });

  const completeBatch = await prisma.batch.create({
    data: {
      batchNumber: 'BAT-PT625-002',
      orderId: order.id,
      manufacturerSku: 'BPT625',
      quantity: 300,
      status: 'complete',
    },
  });

  const missingBatch = await prisma.batch.create({
    data: {
      batchNumber: 'BAT-PT500-003',
      orderId: order.id,
      manufacturerSku: 'BPT500',
      quantity: 200,
      status: 'missing_information',
    },
  });

  const passport = await prisma.digitalProductPassport.create({
    data: {
      passportId: 'BAT-BSH-PT625-2024-008314',
      passportType: 'BATTERY',
      passportUrl: 'https://bat-passport.bosch.com/BAT-BSH-PT625-2024-008314',
      batchId: completeBatch.id,
    },
  });

  await prisma.batteryPassportData.create({
    data: {
      passportDbId: passport.id,

      // Section M — Identification
      uniqueBatteryIdentifier: 'BAT-BSH-PT625-2024-008314',
      batteryCategory: 'LMT',
      batteryModel: 'Bosch PowerTube 625 Wh',
      batteryChemistry: 'Lithium-Nickel-Manganese-Cobalt Oxide (NMC622)',
      manufacturerName: 'Robert Bosch GmbH',
      manufactureYear: 2024,
      grossCapacityKwh: 0.625,
      carbonFootprintKgCo2ePerKwh: 148,
      recycledCobaltPercentage: 0,
      recycledLithiumPercentage: 0,
      declarationOfConformityRef: 'BSH-BAT-2024-EU-003142',
      qrCodeAffixed: true,
      qrCodeUrl: 'https://bat-passport.bosch.com/BAT-BSH-PT625-2024-008314',
      issueDate: '2024-06-01',

      // Section A — General Info
      manufacturerIdentification: 'Robert Bosch GmbH',
      placeOfManufacture: 'Samsung SDI Automotive Battery Plant',
      dateOfManufacture: '2024',
      batteryWeight: '2.9 kg',
      ratedCapacity: '0.625 kWh',
      chemicalComposition: 'Lithium-Nickel-Manganese-Cobalt Oxide (NMC)',
      hazardousSubstances: 'Lithium hexafluorophosphate (LiPF6)',
      fireExtinguishingAgent: 'Water',
      criticalRawMaterials: 'Cobalt (Co)',

      // Section B — Carbon Footprint
      carbonFootprintTotal: '148 kg CO2e/kWh',
      carbonFootprintPerformanceClass: 'Class C (preliminary)',
      carbonDeclarationManufacturerDetails: 'Robert Bosch GmbH',
      carbonDeclarationBatteryModel: 'Bosch PowerTube 625 Wh',
      carbonDeclarationManufacturingLocation: 'Blaichach, Germany',
      carbonFootprintLifecycleBreakdown: '44.4 kg CO2e raw material extraction',
      carbonDeclarationDocReference: 'BSH-BAT-2024-EU-003142',
      carbonDeclarationWebLink: 'www.bosch-ebike.com/sustainability',

      // Section C — Recycled Content
      recycledContentCobalt: '0%',
      recycledContentLithium: '0%',
      recycledContentNickel: '0%',
      recycledContentLead: '0%',
      renewableContentShare: '55%',

      // Section D — Due Diligence
      dueDiligenceStrategy: 'Bosch Supplier Code of Conduct',
      dueDiligenceReport: 'Bosch Sustainability Report 2024',
      dueDiligenceVerificationSummary: 'Verified by KPMG AG',
      supplyChainRawMaterialDescription: 'Cobalt Sulphate (CoSO4·7H2O)',
      supplyChainCountryOfOrigin: 'DRC',
      supplyChainSupplierInfo: 'Samsung SDI Co., Ltd.',
      supplyChainRawMaterialQuantities: '0.062 kg Cobalt (Co)',
      supplyChainAuditReport: 'RMI Conformant Smelter Program',
      supplyChainConflictAreas: 'Cobalt high-risk region',
      recycledSourceEvidence: 'No recycled sources used',

      // Section E — Electrical Characteristics
      ratedCapacityAh: '17.5 Ah',
      minimumVoltage: '30 V',
      nominalVoltage: '36 V',
      maximumVoltage: '42 V',
      originalPowerCapability: '900 W',
      powerLimits: '900 W peak discharge',
      expectedLifetimeCycles: '500 cycles',
      capacityThresholdExhaustion: '60%',
      temperatureRangeStorage: '-20 to +60 °C',
      warrantyCalendarLife: '2 years',
      roundTripEfficiencyInitial: '91.5%',
      roundTripEfficiencyAt50PctCycles: '86%',
      internalResistanceCell: '20 mΩ',
      internalResistancePack: '120 mΩ',
      cRateCycleLifeTest: '0.5C discharge',

      // Section F — Conformity & Waste
      euDeclarationOfConformity: 'BSH-BAT-2024-EU-003142',
      docReferenceNumber: 'BSH-BAT-2024-EU-003142',
      ceMarking: 'CE marking affixed',
      labellingRequirements: 'Separate collection symbol',
      cadmiumMarking: '0% Cadmium',
      leadMarking: '0.001% Lead',
      wasteInfoEndUserRole: 'Charge after each ride',
      wasteInfoSeparateCollection: 'Separate collection required',
      wasteInfoTakebackPoints: 'www.bosch-ebike.com/dealer-finder',
      wasteInfoSafetyInstructions: 'ADR Class 9 (UN 3480)',
      wasteInfoLabelMeanings: 'Crossed-out wheelie bin',
      wasteInfoHazardousSubstanceImpacts: 'Cobalt aquatic toxicity',

      // Section M — Identification (continued)
      individualBatteryIdentifier: 'BAT-BSH-PT625-2024-008314',
      qrCode: 'QR code affixed',
      operatingInstructionsReference: 'www.bosch-ebike.com/powertube-625-manual',
      previousBatteryPassportLink: 'No predecessor',

      // Section G — Composition & Disassembly
      detailedCompositionCathode: 'NMC622 (LiNi0.6Mn0.2Co0.2O2)',
      detailedCompositionAnode: 'Synthetic graphite',
      detailedCompositionElectrolyte: 'LiPF6 1.0 mol/L',
      partNumbersComponents: 'BPT625-ASSY-001',
      sparePartsSupplierContacts: 'www.bosch-ebike.com/dealer-finder',
      disassemblyExplodedDiagrams: 'Integrated down tube vertical mount',
      disassemblySequence: 'Power off and remove battery from frame',
      disassemblyJoiningTechniques: 'Housing screws',
      disassemblyRequiredTools: 'Torx T10',
      disassemblyDamageWarnings: 'Pack voltage up to 42V DC',
      disassemblyCellCountArrangement: '10S2P',
      safetyMeasures: 'Overcharge cutoff 4.2V/cell',

      // Section H — Authority Info
      testReportResults: 'IEC 62133-2:2017 passed',
      ceNotifiedBodyReference: '0044',
      technicalDocumentationStandards: 'IEC 62133-2:2017',
      technicalDocumentationGeneralDescription: 'Bosch PowerTube 625 Wh Li-ion LMT Battery',

      // Section I-L — Individual Battery (as-new state at manufacture)
      individualRatedCapacityAndFade: '17.5 Ah',
      individualPowerAndFade: '900 W',
      individualInternalResistance: '120 mΩ',
      individualRoundTripEfficiency: '91.5%',
      individualRemainingLifetime: '500 cycles',
      sohStateOfCertifiedEnergy: '0.625 kWh',
      sohRemainingCapacity: '0.563 kWh',
      sohRemainingPower: '0.9 kW',
      sohRemainingRoundTripEfficiency: '91.5%',
      sohSelfDischargeRate: '2.5%/month',
      sohOhmicResistance: '120 mΩ',
      lifetimeManufactureAndCommissioningDate: '2024-06-15',
      lifetimeEnergyThroughput: '0 kWh',
      lifetimeCapacityThroughput: '0 Ah',
      lifetimeDeepDischarges: '0',
      lifetimeExtremeTemperatureExposure: '0 hours above 55 °C',
      lifetimeEquivalentFullCycles: '0',
      batteryStatus: 'original',
      chargeDischargeCycleCount: '0',
      negativeEventsLog: '0',
      operatingTemperatureLog: '19.5 °C',
      stateOfChargeLog: '68%',
    },
  });

  return { processingBatch, completeBatch, missingBatch };
}

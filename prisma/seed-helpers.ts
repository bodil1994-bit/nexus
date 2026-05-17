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
    data: { name: 'Robert Bosch GmbH', email: 'ebike@bosch.com' },
  });

  const manufacturer = await prisma.manufacturer.create({
    data: { name: 'KTM Fahrrad GmbH' },
  });

  const order = await prisma.order.create({
    data: {
      orderNumber: 'ORD-KTM-BSH-2026',
      supplierId: supplier.id,
      manufacturerId: manufacturer.id,
    },
  });

  const erpSyncedBatch = await prisma.batch.create({
    data: {
      batchNumber: 'BAT-BSH-PT625-002',
      orderId: order.id,
      manufacturerSku: 'BPT625-KTM',
      quantity: 300,
      status: 'ERP_SYNCED',
      readinessScore: 100,
      erpSyncedAt: new Date('2026-05-16T18:18:00.000Z'),
      erpPayloadJson: JSON.stringify({
        orderNumber: 'ORD-KTM-BSH-2026',
        batchNumber: 'BAT-BSH-PT625-002',
        passportReferenceId: 'BAT-BSH-PT625-2026-008314',
        passportUrl: '/passport/BAT-BSH-PT625-2026-008314',
      }),
    },
  });

  const missingBatch = await prisma.batch.create({
    data: {
      batchNumber: 'BAT-BSH-PT500-001',
      orderId: order.id,
      manufacturerSku: 'BPT500-KTM',
      quantity: 200,
      status: 'INCOMPLETE',
      readinessScore: 68,
      missingFieldsJson: JSON.stringify([
        'grossCapacityKwh',
        'carbonFootprintKgCo2ePerKwh',
        'declarationOfConformityRef',
      ]),
      supplierNotifiedAt: new Date('2026-05-16T10:15:00.000Z'),
    },
  });

  const passport = await prisma.digitalProductPassport.create({
    data: {
      passportId: 'BAT-BSH-PT625-2026-008314',
      passportType: 'BATTERY',
      passportUrl: '/passport/BAT-BSH-PT625-2026-008314',
      batchId: erpSyncedBatch.id,
    },
  });

  await prisma.digitalProductPassport.create({
    data: {
      passportId: 'BAT-BSH-PT500-2026-008315',
      passportType: 'BATTERY',
      passportUrl: '/passport/BAT-BSH-PT500-2026-008315',
      batchId: missingBatch.id,
      batteryData: {
        create: {
          uniqueBatteryIdentifier: 'BAT-BSH-PT500-2026-008315',
          batteryModel: 'Bosch PowerTube 500 Wh',
          batteryChemistry: 'Lithium-Nickel-Manganese-Cobalt Oxide (NMC622)',
          manufacturerName: 'Robert Bosch GmbH',
          manufactureYear: 2026,
        },
      },
    },
  });

  await prisma.batteryPassportData.create({
    data: {
      passportDbId: passport.id,

      // Section M — Identification
      uniqueBatteryIdentifier: 'BAT-BSH-PT625-2026-008314',
      batteryCategory: 'LMT',
      batteryModel: 'Bosch PowerTube 625 Wh',
      batteryChemistry: 'Lithium-Nickel-Manganese-Cobalt Oxide (NMC622)',
      manufacturerName: 'Robert Bosch GmbH',
      manufactureYear: 2026,
      grossCapacityKwh: 0.625,
      carbonFootprintKgCo2ePerKwh: 148,
      recycledCobaltPercentage: 0,
      recycledLithiumPercentage: 0,
      declarationOfConformityRef: 'BSH-BAT-2026-EU-003142',
      qrCodeAffixed: true,
      qrCodeUrl: 'https://bat-passport.bosch.com/BAT-BSH-PT625-2026-008314',
      issueDate: '2026-06-01',

      // Section A — General Info
      manufacturerIdentification: 'Robert Bosch GmbH',
      placeOfManufacture: 'Samsung SDI Automotive Battery Plant',
      dateOfManufacture: '2026',
      batteryWeight: '2.9 kg',
      ratedCapacity: '0.625 kWh',
      chemicalComposition: 'Lithium-Nickel-Manganese-Cobalt Oxide (NMC)',
      hazardousSubstances: 'Lithium hexafluorophosphate (LiPF6)',
      fireExtinguishingAgent: 'Water',
      criticalRawMaterials: 'Cobalt (Co)',

      // Section B — Carbon Footprint
      carbonFootprintTotalValueKgCo2ePerKwh: 148,
      carbonFootprintTotalTotalKgCo2e: 92.5,
      carbonFootprintTotalCalculationBasis: 'Cradle-to-gate battery pack (ISO 14067 methodology)',
      carbonFootprintPerformanceClassValue: 'C',
      carbonFootprintPerformanceClassStatus: 'preliminary',
      carbonDeclarationManufacturerCompanyName: 'Robert Bosch GmbH',
      carbonDeclarationManufacturerAddress: 'Robert-Bosch-Platz 1, 70839 Gerlingen, Germany',
      carbonDeclarationManufacturerSustainabilityUrl: 'www.bosch.com/sustainability',
      carbonDeclarationBatteryModelName: 'Bosch PowerTube 625 Wh',
      carbonDeclarationBatteryModelChemistry: 'NMC622',
      carbonDeclarationBatteryModelNominalCapacityAh: 17.5,
      carbonDeclarationBatteryModelNominalCapacityKwh: 0.625,
      carbonDeclarationBatteryModelNominalVoltageV: 36,
      carbonDeclarationBatteryModelApplication: 'E-bike (pedelec / speed pedelec) — integrated frame battery',
      carbonDeclarationManufacturingFacilityName: 'Bosch eBike Systems Manufacturing',
      carbonDeclarationManufacturingCity: 'Blaichach, Bavaria',
      carbonDeclarationManufacturingCountry: 'Germany',
      carbonFootprintLifecycleRawMaterialExtractionKgCo2e: 44.4,
      carbonFootprintLifecycleRawMaterialPct: 48,
      carbonFootprintLifecycleManufacturingKgCo2e: 27.8,
      carbonFootprintLifecycleManufacturingPct: 30,
      carbonFootprintLifecycleDistributionKgCo2e: 3.7,
      carbonFootprintLifecycleDistributionPct: 4,
      carbonFootprintLifecycleEndOfLifeKgCo2e: -16.7,
      carbonFootprintLifecycleEndOfLifePct: -18,
      carbonDeclarationDocReferenceNumber: 'BSH-BAT-2026-EU-003142',
      carbonDeclarationDocIssuedBy: 'Robert Bosch GmbH — eBike Systems',
      carbonDeclarationDocIssueDate: '2026-06-01',
      carbonDeclarationDocNotifiedBodyReference: '0044 (TÜV SÜD Product Service GmbH)',
      carbonDeclarationSustainabilityPageUrl: 'www.bosch-ebike.com/sustainability',
      carbonDeclarationCarbonFootprintReportUrl: 'www.bosch-ebike.com/assets/lca-powertube-625.pdf',

      // Section C — Recycled Content
      recycledContentCobalt: '0%',
      recycledContentLithium: '0%',
      recycledContentNickel: '0%',
      recycledContentLead: '0%',
      renewableContentShare: '55%',

      // Section D — Due Diligence
      dueDiligenceStrategy: 'Bosch Supplier Code of Conduct',
      dueDiligenceReport: 'Bosch Sustainability Report 2026',
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
      euDeclarationOfConformity: 'BSH-BAT-2026-EU-003142',
      docReferenceNumber: 'BSH-BAT-2026-EU-003142',
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
      individualBatteryIdentifier: 'BAT-BSH-PT625-2026-008314',
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

      // Section I-L — Individual Battery
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
      lifetimeManufactureAndCommissioningDate: '2026-06-15',
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

  return { erpSyncedBatch, missingBatch };
}

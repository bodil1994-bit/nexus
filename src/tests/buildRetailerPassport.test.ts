import { describe, expect, it } from 'vitest';
import { buildRetailerPassport } from '../lib/retailer/buildRetailerPassport';
import { BatteryPassportData } from '@prisma/client';

const seededData: BatteryPassportData = {
  id: 'test-id',
  passportDbId: 'passport-db-id',
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
  manufacturerIdentification: 'Robert Bosch GmbH',
  placeOfManufacture: 'Samsung SDI Automotive Battery Plant',
  dateOfManufacture: '2024',
  batteryWeight: '2.9 kg',
  ratedCapacity: '0.625 kWh',
  chemicalComposition: 'Lithium-Nickel-Manganese-Cobalt Oxide (NMC)',
  hazardousSubstances: 'Lithium hexafluorophosphate (LiPF6)',
  fireExtinguishingAgent: 'Water',
  criticalRawMaterials: 'Cobalt (Co)',
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
  carbonDeclarationBatteryModelApplication: 'E-bike',
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
  carbonDeclarationDocReferenceNumber: 'BSH-BAT-2024-EU-003142',
  carbonDeclarationDocIssuedBy: 'Robert Bosch GmbH',
  carbonDeclarationDocIssueDate: '2024-06-01',
  carbonDeclarationDocNotifiedBodyReference: '0044',
  carbonDeclarationSustainabilityPageUrl: 'www.bosch-ebike.com/sustainability',
  carbonDeclarationCarbonFootprintReportUrl: 'www.bosch-ebike.com/assets/lca-powertube-625.pdf',
  recycledContentCobalt: '0%',
  recycledContentLithium: '0%',
  recycledContentNickel: '0%',
  recycledContentLead: '0%',
  renewableContentShare: '55%',
  dueDiligenceStrategy: 'Bosch Supplier Code of Conduct',
  dueDiligenceReport: 'Bosch Sustainability Report 2024',
  dueDiligenceVerificationSummary: 'Verified by KPMG AG',
  supplyChainRawMaterialDescription: 'Cobalt Sulphate',
  supplyChainSupplierInfo: 'Samsung SDI Co., Ltd.',
  supplyChainCountryOfOrigin: 'DRC',
  supplyChainRawMaterialQuantities: '0.062 kg Cobalt (Co)',
  supplyChainAuditReport: 'RMI Conformant Smelter Program',
  supplyChainConflictAreas: 'Cobalt high-risk region',
  recycledSourceEvidence: 'No recycled sources used',
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
  individualBatteryIdentifier: 'BAT-BSH-PT625-2024-008314',
  qrCode: 'QR code affixed',
  operatingInstructionsReference: 'www.bosch-ebike.com/powertube-625-manual',
  previousBatteryPassportLink: 'No predecessor',
  detailedCompositionCathode: 'NMC622',
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
  testReportResults: 'IEC 62133-2:2017 passed',
  ceNotifiedBodyReference: '0044',
  technicalDocumentationStandards: 'IEC 62133-2:2017',
  technicalDocumentationGeneralDescription: 'Bosch PowerTube 625 Wh Li-ion LMT Battery',
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
  createdAt: new Date('2024-06-01'),
  updatedAt: new Date('2024-06-01'),
};

describe('buildRetailerPassport', () => {
  it('overallGrade is C for seeded data with carbonFootprintPerformanceClassValue=C', () => {
    const result = buildRetailerPassport(seededData);
    expect(result.overallGrade).toBe('C');
  });

  it('flags.length === 10', () => {
    const result = buildRetailerPassport(seededData);
    expect(result.flags.length).toBe(10);
  });

  it('exactly 5 positive flags', () => {
    const result = buildRetailerPassport(seededData);
    expect(result.flags.filter((f) => f.positive).length).toBe(5);
  });

  it('specs.length >= 4', () => {
    const result = buildRetailerPassport(seededData);
    expect(result.specs.length).toBeGreaterThanOrEqual(4);
  });

  it('categories.length === 5', () => {
    const result = buildRetailerPassport(seededData);
    expect(result.categories.length).toBe(5);
  });

  it('overallGrade defaults to C for null/unknown values', () => {
    const result = buildRetailerPassport({ ...seededData, carbonFootprintPerformanceClassValue: null });
    expect(result.overallGrade).toBe('C');
  });
});

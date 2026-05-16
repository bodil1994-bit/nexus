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
      manufacturerIdentification:
        'Robert Bosch GmbH (Bosch eBike Systems); Robert-Bosch-Platz 1, 70839 Gerlingen-Schillerhöhe, Germany; +49 711 400 40990; www.bosch-ebike.com; ebike@bosch.com',
      batteryCategoryAndModel:
        'LMT; Bosch PowerTube 625 Wh; BPT625; cell manufacturer: Samsung SDI Co., Ltd.',
      placeOfManufacture:
        'Cell & module production: Samsung SDI Automotive Battery Plant, Göd, Hungary; Pack assembly: Bosch eBike Systems Manufacturing, Blaichach, Germany',
      dateOfManufacture: '2024',
      batteryWeight: 'Modules: 2.1 kg; Complete system: 2.9 kg',
      ratedCapacity: 'Gross: 0.625 kWh; Net usable: 0.563 kWh',
      chemicalComposition:
        'Chemistry: Lithium-Nickel-Manganese-Cobalt Oxide (NMC); Cathode: NMC622 (Ni60:Mn20:Co20); Anode: Graphite (synthetic); Electrolyte: Liquid LiPF6 solution; Cell format: cylindrical 21700 (21 mm dia. x 70 mm length)',
      hazardousSubstances:
        'Lithium hexafluorophosphate (LiPF6): 0.085 kg; Cobalt (Co): 0.062 kg; Nickel (Ni): 0.186 kg; Ethylene carbonate (EC): 0.038 kg',
      fireExtinguishingAgent:
        'Primary: Water (sustained cooling, min. 50 l/min); Alternative: Special Li-ion extinguisher (F-500 EA or equivalent); Contraindicated: CO2, dry powder; Risk of re-ignition — keep battery cool after suppression; min. safe distance 5 m',
      criticalRawMaterials:
        'Cobalt (Co): 3.2% (EU CRM); Lithium (Li): 1.9% (EU CRM); Nickel (Ni): 9.7% (EU CRM); Natural Graphite: 21.4% (EU CRM)',

      // Section B — Carbon Footprint
      carbonFootprintTotal:
        '148 kg CO2e/kWh; 92.5 kg CO2e total; Cradle-to-gate battery pack (ISO 14067 methodology)',
      carbonFootprintPerformanceClass: 'Class C (preliminary)',
      carbonDeclarationManufacturerDetails:
        'Robert Bosch GmbH; Robert-Bosch-Platz 1, 70839 Gerlingen, Germany; www.bosch.com/sustainability',
      carbonDeclarationBatteryModel:
        'Bosch PowerTube 625 Wh; NMC622; 17.5 Ah; 0.625 kWh; 36 V; E-bike (pedelec / speed pedelec) — integrated frame battery',
      carbonDeclarationManufacturingLocation:
        'Bosch eBike Systems Manufacturing, Blaichach, Bavaria, Germany',
      carbonFootprintLifecycleBreakdown:
        'Raw material extraction: 44.4 kg CO2e (48%); Manufacturing: 27.8 kg CO2e (30%); Distribution: 3.7 kg CO2e (4%); End of life: -16.7 kg CO2e (-18%)',
      carbonDeclarationDocReference:
        'BSH-BAT-2024-EU-003142; issued by Robert Bosch GmbH — eBike Systems; 2024-06-01; notified body: 0044 (TUV SUD Product Service GmbH)',
      carbonDeclarationWebLink:
        'www.bosch-ebike.com/sustainability; LCA report: www.bosch-ebike.com/assets/lca-powertube-625.pdf',

      // Section C — Recycled Content
      recycledContentCobalt:
        'Recycled: 0%; Primary source: DRC / Philippines via Samsung SDI; Target 2031: 16%; Target 2036: 26%',
      recycledContentLithium:
        'Recycled: 0%; Primary source: Chile / Australia (lithium carbonate / hydroxide); Target 2031: 6%; Target 2036: 12%',
      recycledContentNickel:
        'Recycled: 0%; Primary source: Indonesia / Philippines (nickel sulphate, HPAL process); Target 2031: 6%; Target 2036: 15%',
      recycledContentLead: 'Recycled: 0%; Lead content: 0.001% by mass; Pb label required: no',
      renewableContentShare:
        'Cell manufacturing: 55% renewable; Pack assembly: 82% renewable; Sources: hydropower, wind, solar PV, I-RECs',

      // Section D — Due Diligence
      dueDiligenceStrategy:
        'Bosch Supplier Code of Conduct — Responsible Sourcing Policy (www.bosch.com/sustainability/supply-chain/responsible-sourcing); frameworks: OECD Due Diligence Guidance, UN Guiding Principles, RMI; traceability: supplier audits (annual), RMI-certified smelter program, blockchain pilot (cobalt); covers: Cobalt, Lithium, Nickel, Natural Graphite',
      dueDiligenceReport:
        'Bosch Sustainability Report 2024 (www.bosch.com/sustainability/reporting); reporting year: 2024; verified by KPMG AG Wirtschaftsprufungsgesellschaft',
      dueDiligenceVerificationSummary:
        'Verified by KPMG AG / RMI Conformant Smelter Program; OECD conformity confirmed; method: third-party supplier audits + RMI conformant smelter list; date: 2024-09-30',
      supplyChainRawMaterialDescription:
        'Cobalt: Cobalt Sulphate (CoSO4·7H2O); Lithium: Lithium Hydroxide (LiOH·H2O); Nickel: Nickel Sulphate (NiSO4·6H2O); Natural Graphite: Battery-grade flake graphite',
      supplyChainCountryOfOrigin:
        'Cobalt: DRC / Philippines; Lithium: Chile / Australia; Nickel: Indonesia / Philippines; Natural Graphite: China (natural) / Japan (synthetic); Cell production: Hungary (Samsung SDI, Göd); Pack assembly: Germany (Bosch, Blaichach)',
      supplyChainSupplierInfo:
        'Cell production: Samsung SDI Co., Ltd. (Hungary); Cathode active material: Umicore NV/SA — NMC622 cathode precursor (Belgium / South Korea)',
      supplyChainRawMaterialQuantities:
        'Cobalt (Co): 0.062 kg; Nickel (Ni): 0.186 kg; Lithium (Li): 0.028 kg; Graphite (anode): 0.449 kg',
      supplyChainAuditReport:
        'Audited by RMI + KPMG; method: RMI Conformant Smelter Program + annual supplier questionnaires; OECD conformity: yes; date: 2024-09-30',
      supplyChainConflictAreas:
        'Cobalt: high-risk region; artisanal mining involved: no; OECD conformity: yes',
      recycledSourceEvidence:
        'Recycled sources used: no; recycling partners: Umicore (Belgium), Redux (Germany — Bosch take-back); future targets: Co 16%/26%, Li 6%/12%, Ni 6%/15% by 2031/2036',

      // Section E — Electrical Characteristics
      ratedCapacityAh:
        '17.5 Ah; usable: 0.563 kWh; measurement: IEC 62133-2, 0.2C discharge at 23 °C',
      minimumVoltage:
        '30 V; temperature range: 0 to +50 °C (charging), -10 to +60 °C (discharging)',
      nominalVoltage: '36 V; architecture: 36V 10S2P (10 cells series, 2 parallel)',
      maximumVoltage: '42 V',
      originalPowerCapability:
        'Max discharge: 900 W; max DC charging: 144 W; temperature: 0 to +40 °C (charging), -10 to +40 °C (operation)',
      powerLimits:
        'Max discharge peak: 900 W; continuous discharge: 600 W; max DC charging: 144 W; optimal temp: 10 to +35 °C (cell); power reduced below 0 °C and above 40 °C — BMS thermal management active',
      expectedLifetimeCycles:
        '500 cycles; SoH threshold: 60%; reference: IEC 62133-2 / Bosch internal; warranty: 2 years',
      capacityThresholdExhaustion: '60%; 0.375 kWh',
      temperatureRangeStorage: '-20 to +60 °C; reference: IEC 62133-2',
      warrantyCalendarLife: '2 years; SoH at end: 60%; warranty starts: date of purchase',
      roundTripEfficiencyInitial:
        '91.5%; measurement: full cycle 0.2C charge / 0.5C discharge at 23 °C',
      roundTripEfficiencyAt50PctCycles: '86%',
      internalResistanceCell: '20 mΩ; measured at 23 °C, 50% SoC (DCIR method)',
      internalResistancePack: '120 mΩ; measured at 23 °C, 50% SoC',
      cRateCycleLifeTest: 'Discharge: 0.5C; charge: 0.5C; reference: IEC 62133-2',

      // Section F — Conformity & Waste
      euDeclarationOfConformity:
        'Bosch PowerTube 625 Wh; Robert Bosch GmbH; DoC ref: BSH-BAT-2024-EU-003142; notified body: 0044 (TUV SUD Product Service GmbH)',
      docReferenceNumber: 'BSH-BAT-2024-EU-003142; issued: 2024-06-01',
      ceMarking:
        'CE marking affixed; location: battery casing label (side panel); notified body: 0044',
      labellingRequirements:
        'Separate collection symbol: yes; capacity label: 0.625 kWh; Hg label: no; Cd label: no; Pb label: no; QR code: yes',
      cadmiumMarking: 'Cadmium: 0% by mass; Cd label required: no',
      leadMarking: 'Lead: 0.001% by mass; Pb label required: no',
      wasteInfoEndUserRole:
        'Charge after each ride; avoid storage below 20% SoC; remove from bike if storing >4 weeks; store at 30-60% SoC at 10-20 °C, avoid direct sunlight',
      wasteInfoSeparateCollection:
        'Separate collection required; return via Bosch eBike dealer network, municipal collection points, Bosch take-back scheme (Redux)',
      wasteInfoTakebackPoints:
        'Dealer locator: www.bosch-ebike.com/dealer-finder; recycling partners: Umicore (Belgium/Europe), Redux GmbH (Germany)',
      wasteInfoSafetyInstructions:
        'Transport: ADR Class 9 (UN 3480); reduce SoC to ≤30%; use original packaging; inspect for damage before transport; store away from flammable materials',
      wasteInfoLabelMeanings:
        'Crossed-out wheelie bin: do not dispose in household/general waste; QR code links to Digital Battery Passport',
      wasteInfoHazardousSubstanceImpacts:
        'Cobalt (0.062 kg): sensitising, carcinogenic Cat. 1B — handle with care at end-of-life; aquatic toxicity, persistent — never dispose in water or landfill. LiPF6 electrolyte (0.085 kg): corrosive, toxic (HF on contact with water) — do not puncture; toxic to aquatic organisms',

      // Section M — Identification (continued)
      individualBatteryIdentifier:
        'BAT-BSH-PT625-2024-008314; standard: ISO/IEC 15459-1:2014; traceability: Bosch eBike Connect + QR code; linked to VIN: no; access: QR code on label, Bosch eBike Connect app, dealer portal',
      qrCode:
        'QR code affixed; location: side panel label of PowerTube battery housing; standard: ISO/IEC 18004 (QR Code 2005), min. 20x20 mm; links to Digital Battery Passport (public tier); mandatory from: 2027-02-18',
      operatingInstructionsReference:
        'Use only Bosch-approved charger (4A, 36V); charge indoors at 10-40 °C; do not charge damaged battery; store at 30-60% SoC at 10-20 °C; manual: www.bosch-ebike.com/powertube-625-manual; emergency: +49 711 400 40990',
      previousBatteryPassportLink: 'No predecessor; operation: not applicable',

      // Section G — Composition & Disassembly
      detailedCompositionCathode: 'NMC622 (LiNi0.6Mn0.2Co0.2O2); stoichiometry Ni:Mn:Co = 6:2:2',
      detailedCompositionAnode: 'Synthetic graphite; 21.4% share',
      detailedCompositionElectrolyte:
        'LiPF6 1.0 mol/L; solvents: ethylene carbonate (EC), ethylmethyl carbonate (EMC), dimethyl carbonate (DMC); total: 0.085 kg',
      partNumbersComponents:
        'PowerTube 625 complete assembly: BPT625-ASSY-001; Samsung SDI INR21700-50E cell (x20): SDI-21700-50E-OEM; BMS module: BPT-BMS-625-001',
      sparePartsSupplierContacts:
        'Bosch eBike Systems — Authorised Dealer Network; www.bosch-ebike.com/dealer-finder',
      disassemblyExplodedDiagrams:
        'Integrated into down tube of e-bike frame (vertical mount); 1 module; MSD: key lock / release mechanism on top of battery tube',
      disassemblySequence:
        '1. Power off and remove battery from frame; 2. Open housing using Torx T10 screws (8x M3); 3. Disconnect BMS connector and busbars before removing cells',
      disassemblyJoiningTechniques:
        'Mechanical: housing screws (8x); electrical: cell-to-cell nickel strip spot welds (40x)',
      disassemblyRequiredTools:
        'Safety: insulated gloves (Class 0, 1000V), safety goggles, insulated screwdrivers (IEC 60900), multimeter; tools: Torx T10, plastic spudger, anti-static mat',
      disassemblyDamageWarnings:
        'Life danger: pack voltage up to 42V DC — avoid short circuit, do not pierce cells; fire hazard: damaged cells risk thermal runaway — store in fireproof container, do not disassemble swollen battery; chemical hazard: LiPF6 is corrosive and toxic — wear nitrile gloves',
      disassemblyCellCountArrangement:
        '1 module; 20 cells; arrangement: 10S2P; 36V pack; 5 Ah per cell; 3.6V nominal per cell; 21700 format (21 mm dia. x 70 mm); 0.069 kg per cell; housing: aluminium alloy tube (anodised); IP rating: IPX5',
      safetyMeasures:
        'Active: 20 cell voltage sensors, 3 temperature sensors, overcharge cutoff 4.2V/cell, deep discharge cutoff 3.0V/cell; passive: IPX5, manual service disconnect, 30A fuse, passive air cooling',

      // Section H — Authority Info
      testReportResults:
        'TUV SUD Product Service GmbH, Munich; report TR-LMT-2024-003142-DE; test period: 2024-03-01 to 2024-05-15; results: IEC 62133-2:2017 passed, UN 38.3 passed, EN 15194:2017 passed, ISO 14067 passed; overall compliance: yes',
      ceNotifiedBodyReference:
        'TUV SUD Product Service GmbH; reference: 0044; test report: TR-LMT-2024-003142-DE',
      technicalDocumentationStandards:
        'IEC 62133-2:2017; UN 38.3; EN 15194:2017; ISO 14067:2018; ISO/IEC 15459-1:2014',
      technicalDocumentationGeneralDescription:
        'Bosch PowerTube 625 Wh Li-ion LMT Battery; category: LMT; use: electric power storage for pedal-assist e-bike; 20 cells; cylindrical 21700; 0.625 kWh; 36V nominal',

      // Section I-L — Individual Battery (as-new state at manufacture)
      individualRatedCapacityAndFade:
        '17.5 Ah; 0.563 kWh usable; capacity fade: 0%; serial: BSH-PT625-2024-008314; measured: 2024-07-03T09:15:00Z',
      individualPowerAndFade:
        'Max discharge: 900 W; power fade: 0%; measured: 2024-07-03T09:15:00Z',
      individualInternalResistance:
        'Pack: 120 mΩ; resistance increase: 0%; measured: 2024-07-03T09:15:00Z',
      individualRoundTripEfficiency:
        'Efficiency: 91.5%; fade: 0%; measured: 2024-07-03T09:15:00Z',
      individualRemainingLifetime: 'Remaining cycles: 500; remaining calendar life: 3 years',
      sohStateOfCertifiedEnergy:
        'SoCE: 0.625 kWh (100% of rated); last measured: 2024-07-03T09:15:00Z; updated each full charge via Bosch eBike Connect',
      sohRemainingCapacity:
        'Remaining: 0.563 kWh; warranty threshold: 0.375 kWh; measured: 2024-07-03',
      sohRemainingPower:
        'Remaining peak: 0.9 kW; original rated: 0.9 kW; measured: 2024-07-03',
      sohRemainingRoundTripEfficiency: 'Current RTE: 91.5%; RTE loss: 0%',
      sohSelfDischargeRate:
        'Self-discharge: 2.5%/month; warning threshold: 8%/month; measured: 2024-07-03',
      sohOhmicResistance: 'Pack ohmic resistance: 120 mΩ; resistance increase: 0%',
      lifetimeManufactureAndCommissioningDate:
        'Manufacturing date: 2024-06-15; commissioning date: not yet commissioned',
      lifetimeEnergyThroughput: 'Cumulative: 0 kWh; expected to EOL: 281 kWh',
      lifetimeCapacityThroughput: 'Cumulative: 0 Ah; expected to EOL: 7875 Ah',
      lifetimeDeepDischarges:
        'Deep discharge count: 0; threshold: 10% SoC; BMS protection cutoff: 5% SoC',
      lifetimeExtremeTemperatureExposure:
        'Time above 55 °C: 0 hours; normal operating range: -10 to +40 °C; charging range: 0 to +40 °C',
      lifetimeEquivalentFullCycles: 'FEC current: 0; expected to EOL: 500',
      batteryStatus: 'Status: original; status change date: 2024-07-10',
      chargeDischargeCycleCount:
        'Charge cycles: 0; discharge cycles: 0; definition: 1 full cycle = 100% discharge from full (17.5 Ah); partials counted proportionally; measured: 2024-07-03',
      negativeEventsLog:
        'Accidents: 0; thermal runaway: 0; deep discharges: 0; overcharges: 0; measured: 2024-07-03',
      operatingTemperatureLog:
        'Avg operating temp: 19.5 °C; max cell temp: 38.2 °C; min cell temp: 8.4 °C; time above 45 °C: 0 hours; sensors: 3',
      stateOfChargeLog:
        'Current SoC: 68%; delivery SoC: 40%; avg SoC at charge start: 18.5%; avg SoC at charge end: 97.2%; serial: BSH-PT625-2024-008314; measured: 2024-08-22T16:44:00Z',
    },
  });

  return { processingBatch, completeBatch, missingBatch };
}

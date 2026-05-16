import { PrismaClient } from '@prisma/client';

export const CANONICAL_FIELDS = [
  'product_name',
  'material',
  'origin_country',
  'supplier_name',
  'sustainability_notes',
] as const;

export async function seedSupplierBatches(prisma: PrismaClient) {
  await prisma.passportDocument.deleteMany();
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

  await prisma.passportDocument.create({
    data: {
      batchId: processingBatch.id,
      filename: 'bat-pt625-001-passport-draft.pdf',
      extractedFields: {
        product_name: null,
        material: null,
        origin_country: null,
        supplier_name: null,
        sustainability_notes: null,
      },
      missingFields: CANONICAL_FIELDS as unknown as string[],
    },
  });

  await prisma.passportDocument.create({
    data: {
      batchId: completeBatch.id,
      filename: 'bat-pt625-002-passport.xlsx',
      extractedFields: {
        product_name: 'Bosch PowerTube 625 Wh',
        material: 'Lithium-Nickel-Manganese-Cobalt Oxide (NMC622)',
        origin_country: 'Germany',
        supplier_name: 'Samsung SDI Co., Ltd.',
        sustainability_notes:
          'Carbon footprint Class C (148 kg CO2e/kWh); 82% renewable energy at Blaichach assembly plant; Bosch Supplier Code of Conduct applied; KPMG-verified sustainability report 2024',
      },
      missingFields: [],
    },
  });

  await prisma.passportDocument.create({
    data: {
      batchId: missingBatch.id,
      filename: 'bat-pt500-003-passport-partial.csv',
      extractedFields: {
        product_name: 'Bosch PowerTube 500 Wh',
        material: 'Lithium-Nickel-Manganese-Cobalt Oxide (NMC622)',
        origin_country: null,
        supplier_name: null,
        sustainability_notes: null,
      },
      missingFields: ['origin_country', 'supplier_name', 'sustainability_notes'],
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
      manufacturerIdentification: JSON.stringify({
        name: 'Robert Bosch GmbH',
        registered_trade_name: 'Bosch eBike Systems',
        postal_address: 'Robert-Bosch-Platz 1, 70839 Gerlingen-Schillerhöhe, Germany',
        contact_point: '+49 711 400 40990',
        website: 'www.bosch-ebike.com',
        email: 'ebike@bosch.com',
      }),
      batteryCategoryAndModel: JSON.stringify({
        battery_category: 'LMT',
        battery_model: 'Bosch PowerTube 625 Wh',
        product_number: 'BPT625',
        cell_manufacturer: 'Samsung SDI Co., Ltd.',
      }),
      placeOfManufacture: JSON.stringify({
        cell_and_module_production: {
          facility_name: 'Samsung SDI Automotive Battery Plant',
          city: 'Göd',
          country: 'Hungary',
        },
        pack_assembly: {
          facility_name: 'Bosch eBike Systems Manufacturing',
          city: 'Blaichach',
          country: 'Germany',
        },
      }),
      dateOfManufacture: JSON.stringify({ month: null, year: 2024 }),
      batteryWeight: JSON.stringify({
        modules_weight_kg: 2.1,
        complete_system_weight_kg: 2.9,
      }),
      ratedCapacity: JSON.stringify({
        gross_kwh: 0.625,
        net_usable_kwh: 0.563,
      }),
      chemicalComposition: JSON.stringify({
        battery_chemistry: 'Lithium-Nickel-Manganese-Cobalt Oxide (NMC)',
        cathode_material: 'NMC622 (Ni60:Mn20:Co20)',
        anode_material: 'Graphite (synthetic)',
        electrolyte_type: 'Liquid LiPF6 solution',
        cell_format: 'cylindrical',
        cell_form_factor: '21700 (21 mm dia. x 70 mm length)',
      }),
      hazardousSubstances: JSON.stringify([
        { substance_name: 'Lithium hexafluorophosphate (LiPF6)', quantity_kg: 0.085 },
        { substance_name: 'Cobalt (Co)', quantity_kg: 0.062 },
        { substance_name: 'Nickel (Ni)', quantity_kg: 0.186 },
        { substance_name: 'Ethylene carbonate (EC)', quantity_kg: 0.038 },
      ]),
      fireExtinguishingAgent: JSON.stringify({
        primary_agent: 'Water (sustained cooling, min. 50 l/min)',
        alternative_agent: 'Special Li-ion extinguisher (F-500 EA or equivalent)',
        contraindicated_agents: 'CO2; dry powder',
        additional_instructions:
          'Risk of re-ignition; keep battery cool after suppression; minimum safe distance 5 m',
      }),
      criticalRawMaterials: JSON.stringify([
        { material_name: 'Cobalt (Co)', concentration_pct: 3.2, eu_crm_list: true },
        { material_name: 'Lithium (Li)', concentration_pct: 1.9, eu_crm_list: true },
        { material_name: 'Nickel (Ni)', concentration_pct: 9.7, eu_crm_list: true },
        { material_name: 'Natural Graphite', concentration_pct: 21.4, eu_crm_list: true },
      ]),

      // Section B — Carbon Footprint
      carbonFootprintTotal: JSON.stringify({
        value_kg_co2e_per_kwh: 148,
        total_kg_co2e: 92.5,
        calculation_basis: 'Cradle-to-gate battery pack (ISO 14067 methodology)',
      }),
      carbonFootprintPerformanceClass: JSON.stringify({
        performance_class: 'C',
        classification_status: 'preliminary',
      }),
      carbonDeclarationManufacturerDetails: JSON.stringify({
        company_name: 'Robert Bosch GmbH',
        address: 'Robert-Bosch-Platz 1, 70839 Gerlingen, Germany',
        sustainability_url: 'www.bosch.com/sustainability',
      }),
      carbonDeclarationBatteryModel: JSON.stringify({
        model_name: 'Bosch PowerTube 625 Wh',
        chemistry: 'NMC622',
        nominal_capacity_ah: 17.5,
        nominal_capacity_kwh: 0.625,
        nominal_voltage_v: 36,
        application: 'E-bike (pedelec / speed pedelec) — integrated frame battery',
      }),
      carbonDeclarationManufacturingLocation: JSON.stringify({
        facility_name: 'Bosch eBike Systems Manufacturing',
        city: 'Blaichach, Bavaria',
        country: 'Germany',
      }),
      carbonFootprintLifecycleBreakdown: JSON.stringify({
        raw_material_extraction_kg_co2e: 44.4,
        raw_material_pct: 48,
        manufacturing_kg_co2e: 27.8,
        manufacturing_pct: 30,
        distribution_kg_co2e: 3.7,
        distribution_pct: 4,
        end_of_life_kg_co2e: -16.7,
        end_of_life_pct: -18,
      }),
      carbonDeclarationDocReference: JSON.stringify({
        doc_reference_number: 'BSH-BAT-2024-EU-003142',
        issued_by: 'Robert Bosch GmbH — eBike Systems',
        issue_date: '2024-06-01',
        notified_body_reference: '0044 (TUV SUD Product Service GmbH)',
      }),
      carbonDeclarationWebLink: JSON.stringify({
        sustainability_page_url: 'www.bosch-ebike.com/sustainability',
        carbon_footprint_report_url: 'www.bosch-ebike.com/assets/lca-powertube-625.pdf',
      }),

      // Section C — Recycled Content
      recycledContentCobalt: JSON.stringify({
        recycled_pct: 0,
        primary_source: 'DRC / Philippines — via Samsung SDI supply chain',
        target_2031_pct: 16,
        target_2036_pct: 26,
      }),
      recycledContentLithium: JSON.stringify({
        recycled_pct: 0,
        primary_source: 'Chile / Australia — lithium carbonate / hydroxide',
        target_2031_pct: 6,
        target_2036_pct: 12,
      }),
      recycledContentNickel: JSON.stringify({
        recycled_pct: 0,
        primary_source: 'Indonesia / Philippines — nickel sulphate (HPAL process)',
        target_2031_pct: 6,
        target_2036_pct: 15,
      }),
      recycledContentLead: JSON.stringify({
        recycled_pct: 0,
        lead_content_pct_by_mass: 0.001,
        pb_label_required: false,
      }),
      renewableContentShare: JSON.stringify({
        cell_manufacturing_renewable_pct: 55,
        pack_assembly_renewable_pct: 82,
        renewable_sources: 'Hydropower; wind; solar PV; I-RECs',
      }),

      // Section D — Due Diligence
      dueDiligenceStrategy: JSON.stringify({
        policy_name: 'Bosch Supplier Code of Conduct — Responsible Sourcing Policy',
        policy_url: 'www.bosch.com/sustainability/supply-chain/responsible-sourcing',
        frameworks_referenced:
          'OECD Due Diligence Guidance; UN Guiding Principles on Business and Human Rights; RMI (Responsible Minerals Initiative)',
        traceability_mechanism:
          'Supplier audits (annual); RMI-certified smelter program; Blockchain traceability pilot (cobalt)',
        covered_materials: 'Cobalt; Lithium; Nickel; Natural Graphite',
      }),
      dueDiligenceReport: JSON.stringify({
        report_name: 'Bosch Sustainability Report 2024',
        report_url: 'www.bosch.com/sustainability/reporting',
        reporting_year: 2024,
        verifying_body: 'KPMG AG Wirtschaftsprufungsgesellschaft (independent auditor)',
      }),
      dueDiligenceVerificationSummary: JSON.stringify({
        verifying_body_name: 'KPMG AG / RMI Conformant Smelter Program',
        oecd_conformity_confirmed: true,
        verification_method: 'Third-party supplier audits; RMI conformant smelter list',
        verification_date: '2024-09-30',
      }),
      supplyChainRawMaterialDescription: JSON.stringify([
        { material_name: 'Cobalt', trade_name: 'Cobalt Sulphate (CoSO4·7H2O)' },
        { material_name: 'Lithium', trade_name: 'Lithium Hydroxide (LiOH·H2O)' },
        { material_name: 'Nickel', trade_name: 'Nickel Sulphate (NiSO4·6H2O)' },
        { material_name: 'Natural Graphite', trade_name: 'Battery-grade flake graphite' },
      ]),
      supplyChainCountryOfOrigin: JSON.stringify([
        { material: 'Cobalt', country_of_origin: 'Democratic Republic of Congo (DRC) / Philippines' },
        { material: 'Lithium', country_of_origin: 'Chile / Australia' },
        { material: 'Nickel', country_of_origin: 'Indonesia / Philippines' },
        { material: 'Natural Graphite', country_of_origin: 'China (natural); Japan (synthetic)' },
        { material: 'Cell production', country_of_origin: 'Hungary (Samsung SDI, Göd)' },
        { material: 'Pack assembly', country_of_origin: 'Germany (Bosch, Blaichach)' },
      ]),
      supplyChainSupplierInfo: JSON.stringify([
        { role: 'cell_production', company_name: 'Samsung SDI Co., Ltd.', country: 'Hungary (EU production plant)' },
        { role: 'cathode_active_material', company_name: 'Umicore NV/SA — NMC622 cathode precursor', country: 'Belgium / South Korea' },
      ]),
      supplyChainRawMaterialQuantities: JSON.stringify([
        { material: 'Cobalt (Co)', quantity_kg: 0.062 },
        { material: 'Nickel (Ni)', quantity_kg: 0.186 },
        { material: 'Lithium (Li)', quantity_kg: 0.028 },
        { material: 'Graphite (anode)', quantity_kg: 0.449 },
      ]),
      supplyChainAuditReport: JSON.stringify({
        auditing_body: 'RMI (Responsible Minerals Initiative) + KPMG',
        audit_method: 'RMI Conformant Smelter Program; annual supplier questionnaires',
        oecd_conformity: true,
        audit_date: '2024-09-30',
      }),
      supplyChainConflictAreas: JSON.stringify([
        {
          material: 'Cobalt',
          region_classification: 'high_risk',
          artisanal_mining_involved: false,
          oecd_conformity: true,
        },
      ]),
      recycledSourceEvidence: JSON.stringify({
        recycled_sources_used: false,
        recycling_partners: 'Umicore (Belgium); Redux (Germany — Bosch take-back partner)',
        future_recycled_content_targets: 'Co: 16% by 2031 / 26% by 2036; Li: 6% / 12%; Ni: 6% / 15%',
      }),

      // Section E — Electrical Characteristics
      ratedCapacityAh: JSON.stringify({
        capacity_ah: 17.5,
        usable_capacity_kwh: 0.563,
        measurement_method: 'IEC 62133-2, 0.2C discharge at 23 degC',
      }),
      minimumVoltage: JSON.stringify({
        min_voltage_v: 30,
        temperature_range_celsius: '0 to +50 (charging); -10 to +60 (discharging)',
      }),
      nominalVoltage: JSON.stringify({
        nominal_voltage_v: 36,
        architecture: '36V 10S2P — 10 cells in series, 2 in parallel',
      }),
      maximumVoltage: JSON.stringify({ max_voltage_v: 42 }),
      originalPowerCapability: JSON.stringify({
        max_discharge_power_w: 900,
        max_dc_charging_power_w: 144,
        temperature_range_celsius: '0 to +40 (charging); -10 to +40 (operation)',
      }),
      powerLimits: JSON.stringify({
        max_discharge_peak_w: 900,
        continuous_discharge_w: 600,
        max_dc_charging_w: 144,
        optimal_temp_range_celsius: '10 to +35 (cell temperature)',
        power_reduction_conditions:
          'Power reduced below 0 degC and above 40 degC; BMS thermal management active',
      }),
      expectedLifetimeCycles: JSON.stringify({
        expected_cycles: 500,
        soh_threshold_pct: 60,
        reference_test: 'IEC 62133-2 / Bosch internal cycle test',
        warranty_years: 2,
      }),
      capacityThresholdExhaustion: JSON.stringify({
        threshold_pct: 60,
        threshold_kwh: 0.375,
      }),
      temperatureRangeStorage: JSON.stringify({
        min_temp_celsius: -20,
        max_temp_celsius: 60,
        reference_test: 'IEC 62133-2',
      }),
      warrantyCalendarLife: JSON.stringify({
        warranty_years: 2,
        soh_at_warranty_end_pct: 60,
        warranty_start_event: 'date_of_purchase',
      }),
      roundTripEfficiencyInitial: JSON.stringify({
        efficiency_pct: 91.5,
        measurement_method: 'Full cycle 0.2C charge / 0.5C discharge at 23 degC',
      }),
      roundTripEfficiencyAt50PctCycles: JSON.stringify({ efficiency_pct: 86 }),
      internalResistanceCell: JSON.stringify({
        resistance_mohm: 20,
        measurement_conditions: '23 degC, 50% SoC (DCIR method)',
      }),
      internalResistancePack: JSON.stringify({
        resistance_mohm: 120,
        measurement_conditions: '23 degC, 50% SoC',
      }),
      cRateCycleLifeTest: JSON.stringify({
        discharge_c_rate: 0.5,
        charge_c_rate: 0.5,
        reference_standard: 'IEC 62133-2',
      }),

      // Section F — Conformity & Waste
      euDeclarationOfConformity: JSON.stringify({
        battery_model: 'Bosch PowerTube 625 Wh',
        manufacturer_name: 'Robert Bosch GmbH',
        doc_reference_number: 'BSH-BAT-2024-EU-003142',
        notified_body_reference_number: '0044 (TUV SUD Product Service GmbH)',
      }),
      docReferenceNumber: JSON.stringify({
        reference_number: 'BSH-BAT-2024-EU-003142',
        issue_date: '2024-06-01',
      }),
      ceMarking: JSON.stringify({
        ce_marking_affixed: true,
        location_on_battery: 'On battery casing label (side panel)',
        notified_body_reference_number: '0044',
      }),
      labellingRequirements: JSON.stringify({
        separate_collection_symbol_affixed: true,
        capacity_label_kwh: 0.625,
        hg_label_required: false,
        cd_label_required: false,
        pb_label_required: false,
        qr_code_affixed: true,
      }),
      cadmiumMarking: JSON.stringify({ cadmium_pct_by_mass: 0, cd_label_required: false }),
      leadMarking: JSON.stringify({ lead_pct_by_mass: 0.001, pb_label_required: false }),
      wasteInfoEndUserRole: JSON.stringify({
        daily_use_recommendations:
          'Charge after each ride; avoid storage below 20% SoC; remove from bike if storing > 4 weeks',
        storage_recommendations:
          'Store at 30-60% SoC; temperature 10-20 degC; avoid direct sunlight',
      }),
      wasteInfoSeparateCollection: JSON.stringify({
        separate_collection_required: true,
        return_channels:
          'Bosch eBike dealer network; municipal collection points; Bosch take-back scheme (Redux)',
      }),
      wasteInfoTakebackPoints: JSON.stringify({
        dealer_locator_url: 'www.bosch-ebike.com/dealer-finder',
        recycling_partners: 'Umicore (Belgium/Europe); Redux GmbH (Germany — Bosch take-back partner)',
      }),
      wasteInfoSafetyInstructions: JSON.stringify({
        transport_class: 'ADR Class 9 (UN 3480 — lithium-ion batteries)',
        transport_instructions:
          'Reduce SoC to <= 30%; use original packaging; visual inspection for damage before transport',
        storage_instructions:
          'Do not store next to flammable materials; regular visual inspection for swelling or damage',
      }),
      wasteInfoLabelMeanings: JSON.stringify({
        separate_collection_symbol_explanation:
          'Crossed-out wheelie bin: do not dispose in household or general waste',
        qr_code_explanation:
          'Links to Digital Battery Passport — scan with any smartphone QR reader',
      }),
      wasteInfoHazardousSubstanceImpacts: JSON.stringify([
        {
          substance: 'Cobalt (0.062 kg)',
          health_impact: 'Sensitising; carcinogenic (Cat. 1B) — handle with care during end-of-life',
          environmental_impact: 'Aquatic toxicity; persistent — never dispose in water or landfill',
        },
        {
          substance: 'LiPF6 electrolyte (0.085 kg)',
          health_impact: 'Corrosive; toxic (HF formation on contact with water) — do not puncture or open',
          environmental_impact: 'Toxic to aquatic organisms',
        },
      ]),

      // Section M — Identification (continued)
      individualBatteryIdentifier: JSON.stringify({
        unique_battery_identifier: 'BAT-BSH-PT625-2024-008314',
        format_standard: 'ISO/IEC 15459-1:2014',
        traceability_technology: 'Bosch eBike Connect cloud platform + QR code',
        linked_to_vin: false,
        access_channels: 'QR code on battery label; Bosch eBike Connect app; dealer portal',
      }),
      qrCode: JSON.stringify({
        qr_code_affixed: true,
        qr_location: 'Side panel label of PowerTube battery housing',
        format_standard: 'ISO/IEC 18004 (QR Code 2005), min. 20x20 mm',
        link_target: 'Digital Battery Passport (publicly accessible data tier)',
        mandatory_from_date: '2027-02-18',
      }),
      operatingInstructionsReference: JSON.stringify({
        charging_instructions:
          'Use only Bosch-approved charger (4A, 36V); charge indoors at 10-40 degC; do not charge damaged battery',
        storage_instructions:
          'Store at 30-60% SoC; temperature 10-20 degC; charge to 60% before storing > 4 weeks',
        full_manual_url: 'www.bosch-ebike.com/powertube-625-manual',
        emergency_phone: '+49 711 400 40990',
      }),
      previousBatteryPassportLink: JSON.stringify({
        has_predecessor: false,
        operation_performed: 'not_applicable',
      }),

      // Section G — Composition & Disassembly
      detailedCompositionCathode: JSON.stringify({
        material_name: 'NMC622 (LiNi0.6Mn0.2Co0.2O2)',
        stoichiometry: 'Ni:Mn:Co = 6:2:2',
      }),
      detailedCompositionAnode: JSON.stringify({
        material_name: 'Synthetic graphite',
        share_pct: 21.4,
      }),
      detailedCompositionElectrolyte: JSON.stringify({
        conducting_salt: 'LiPF6 1.0 mol/L',
        solvents: [
          { name: 'Ethylene carbonate (EC)' },
          { name: 'Ethylmethyl carbonate (EMC)' },
          { name: 'Dimethyl carbonate (DMC)' },
        ],
        total_quantity_kg: 0.085,
      }),
      partNumbersComponents: JSON.stringify([
        { component_name: 'PowerTube 625 complete assembly', part_number: 'BPT625-ASSY-001' },
        { component_name: 'Samsung SDI INR21700-50E cell (x20)', part_number: 'SDI-21700-50E-OEM' },
        { component_name: 'BMS module', part_number: 'BPT-BMS-625-001' },
      ]),
      sparePartsSupplierContacts: JSON.stringify([
        { company_name: 'Bosch eBike Systems — Authorised Dealer Network', website: 'www.bosch-ebike.com/dealer-finder' },
      ]),
      disassemblyExplodedDiagrams: JSON.stringify({
        battery_position_in_vehicle: 'Integrated into down tube of e-bike frame (vertical mount)',
        module_count: 1,
        msd_location: 'Key lock / release mechanism on top of battery tube',
      }),
      disassemblySequence: JSON.stringify([
        { step_number: 1, step_title: 'Power off and remove battery from frame' },
        { step_number: 2, step_title: 'Open housing using Torx T10 screws (8x M3 screws)' },
        { step_number: 3, step_title: 'Disconnect BMS connector and busbars before removing cells' },
      ]),
      disassemblyJoiningTechniques: JSON.stringify({
        mechanical_connections: [{ connection_type: 'Housing screws', quantity: 8 }],
        electrical_connections: [{ connection_type: 'Cell-to-cell nickel strip spot welds', quantity: 40 }],
      }),
      disassemblyRequiredTools: JSON.stringify({
        mandatory_safety_equipment: 'Insulated gloves (Class 0, 1000V); safety goggles; insulated screwdrivers (IEC 60900); multimeter',
        standard_tools: 'Torx T10 screwdriver; plastic spudger; anti-static mat',
      }),
      disassemblyDamageWarnings: JSON.stringify({
        life_danger_warnings: 'Pack voltage up to 42V DC — avoid short circuit; do not pierce cells',
        fire_hazard_warnings: 'Damaged cells risk thermal runaway; store in fireproof container; do not disassemble swollen battery',
        chemical_hazard_warnings: 'Electrolyte (LiPF6) — corrosive & toxic; avoid skin contact; wear nitrile gloves',
      }),
      disassemblyCellCountArrangement: JSON.stringify({
        total_module_count: 1,
        total_cell_count: 20,
        cell_arrangement_per_module: '10S2P',
        pack_voltage_v: 36,
        cell_capacity_ah: 5,
        cell_nominal_voltage_v: 3.6,
        cell_dimensions_mm: '21 mm dia. x 70 mm length (21700 format)',
        cell_weight_kg: 0.069,
        housing_material: 'Aluminium alloy tube (anodised)',
        ip_rating: 'IPX5',
      }),
      safetyMeasures: JSON.stringify({
        active_protection_systems: {
          cell_voltage_monitoring_sensors: 20,
          temperature_sensors: 3,
          overcharge_cutoff_v_per_cell: 4.2,
          deep_discharge_cutoff_v_per_cell: 3.0,
        },
        passive_protection_systems: {
          ip_rating: 'IPX5',
          manual_service_disconnect: true,
          fuse_rating_a: 30,
          cooling_system_type: 'Passive air cooling (no active thermal management)',
        },
      }),

      // Section H — Authority Info
      testReportResults: JSON.stringify({
        testing_institute: 'TUV SUD Product Service GmbH, Munich',
        test_report_number: 'TR-LMT-2024-003142-DE',
        test_period_start: '2024-03-01',
        test_period_end: '2024-05-15',
        test_results: [
          { test_name: 'Safety tests — IEC 62133-2:2017 (portable/LMT batteries)', result: 'passed' },
          { test_name: 'UN 38.3 Transport Safety (T1-T8)', result: 'passed' },
          { test_name: 'EN 15194:2017 (EPAC — electric power assisted cycles)', result: 'passed' },
          { test_name: 'CO2 footprint declaration (ISO 14067)', result: 'passed' },
        ],
        overall_compliance: true,
      }),
      ceNotifiedBodyReference: JSON.stringify({
        notified_body_name: 'TUV SUD Product Service GmbH',
        notified_body_reference_number: '0044',
        test_report_number: 'TR-LMT-2024-003142-DE',
      }),
      technicalDocumentationStandards: JSON.stringify({
        standards_applied: [
          { standard_name: 'IEC 62133-2:2017' },
          { standard_name: 'UN 38.3' },
          { standard_name: 'EN 15194:2017' },
          { standard_name: 'ISO 14067:2018' },
          { standard_name: 'ISO/IEC 15459-1:2014' },
        ],
      }),
      technicalDocumentationGeneralDescription: JSON.stringify({
        designation: 'Bosch PowerTube 625 Wh Li-ion LMT Battery',
        battery_category: 'LMT',
        intended_use: 'Electric power storage for pedal-assist e-bike (pedelec / speed pedelec)',
        total_cells: 20,
        cell_format: 'Cylindrical 21700',
        nominal_energy_kwh: 0.625,
        nominal_voltage_v: 36,
      }),

      // Section I-L — Individual Battery (as-new state at manufacture)
      individualRatedCapacityAndFade: JSON.stringify({
        rated_capacity_ah: 17.5,
        usable_capacity_kwh: 0.563,
        capacity_fade_pct: 0,
        serial_number: 'BSH-PT625-2024-008314',
        measurement_date: '2024-07-03T09:15:00Z',
      }),
      individualPowerAndFade: JSON.stringify({
        max_discharge_power_w: 900,
        power_fade_pct: 0,
        measurement_date: '2024-07-03T09:15:00Z',
      }),
      individualInternalResistance: JSON.stringify({
        pack_resistance_mohm: 120,
        resistance_increase_pct: 0,
        measurement_date: '2024-07-03T09:15:00Z',
      }),
      individualRoundTripEfficiency: JSON.stringify({
        efficiency_pct: 91.5,
        efficiency_fade_pct: 0,
        measurement_date: '2024-07-03T09:15:00Z',
      }),
      individualRemainingLifetime: JSON.stringify({
        remaining_cycles: 500,
        remaining_calendar_years: 3,
      }),
      sohStateOfCertifiedEnergy: JSON.stringify({
        soce_kwh: 0.625,
        soce_pct_of_rated: 100,
        last_measurement_datetime: '2024-07-03T09:15:00Z',
        measurement_frequency: 'Updated each full charge event via Bosch eBike Connect app',
      }),
      sohRemainingCapacity: JSON.stringify({
        remaining_capacity_kwh: 0.563,
        warranty_threshold_kwh: 0.375,
        measurement_date: '2024-07-03',
      }),
      sohRemainingPower: JSON.stringify({
        remaining_peak_power_kw: 0.9,
        original_rated_power_kw: 0.9,
        measurement_date: '2024-07-03',
      }),
      sohRemainingRoundTripEfficiency: JSON.stringify({
        current_rte_pct: 91.5,
        rte_loss_pct: 0,
      }),
      sohSelfDischargeRate: JSON.stringify({
        self_discharge_pct_per_month: 2.5,
        warning_threshold_pct_per_month: 8,
        measurement_date: '2024-07-03',
      }),
      sohOhmicResistance: JSON.stringify({
        ohmic_resistance_pack_mohm: 120,
        resistance_increase_pct: 0,
      }),
      lifetimeManufactureAndCommissioningDate: JSON.stringify({
        manufacturing_date: '2024-06-15',
        commissioning_date: null,
      }),
      lifetimeEnergyThroughput: JSON.stringify({
        cumulative_energy_throughput_kwh: 0,
        expected_total_to_eol_kwh: 281,
      }),
      lifetimeCapacityThroughput: JSON.stringify({
        cumulative_capacity_throughput_ah: 0,
        expected_total_to_eol_ah: 7875,
      }),
      lifetimeDeepDischarges: JSON.stringify({
        deep_discharge_count: 0,
        deep_discharge_threshold_soc_pct: 10,
        bms_protection_cutoff_soc_pct: 5,
      }),
      lifetimeExtremeTemperatureExposure: JSON.stringify({
        time_above_55c_operating_hours: 0,
        normal_operating_temp_range_celsius: '-10 to +40',
        charging_temp_range_celsius: '0 to +40',
      }),
      lifetimeEquivalentFullCycles: JSON.stringify({
        fec_current: 0,
        expected_fec_to_eol: 500,
      }),
      batteryStatus: JSON.stringify({
        status: 'original',
        status_change_date: '2024-07-10',
      }),
      chargeDischargeCycleCount: JSON.stringify({
        charge_cycle_count: 0,
        discharge_cycle_count: 0,
        cycle_definition: '1 full cycle = 100% discharge from full (17.5 Ah); partial cycles counted proportionally',
        measurement_date: '2024-07-03',
      }),
      negativeEventsLog: JSON.stringify({
        accident_count: 0,
        thermal_runaway_count: 0,
        deep_discharge_count: 0,
        overcharge_count: 0,
        measurement_date: '2024-07-03',
      }),
      operatingTemperatureLog: JSON.stringify({
        avg_operating_temp_celsius: 19.5,
        max_cell_temp_celsius: 38.2,
        min_cell_temp_celsius: 8.4,
        time_above_45c_hours: 0,
        sensor_count: 3,
      }),
      stateOfChargeLog: JSON.stringify({
        current_soc_pct: 68,
        delivery_soc_pct: 40,
        avg_soc_at_charge_start_pct: 18.5,
        avg_soc_at_charge_end_pct: 97.2,
        serial_number: 'BSH-PT625-2024-008314',
        measurement_datetime: '2024-08-22T16:44:00Z',
      }),
    },
  });

  return { processingBatch, completeBatch, missingBatch };
}

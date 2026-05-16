import { BatteryPassportData } from '@prisma/client';

export type Grade = 'A' | 'B' | 'C' | 'D' | 'E';

export type RetailerPassportView = {
  batteryModel: string;
  batteryChemistry: string;
  grossCapacityKwh: number | null;
  carbonFootprintKgCo2ePerKwh: number | null;
  overallGrade: Grade;
  specs: Array<{ label: string; value: string }>;
  flags: Array<{ keyword: string; positive: boolean; detail: string }>;
  categories: Array<{
    id: string;
    title: string;
    grade: Grade;
    summary: string;
    points: Array<{ label: string; value: string; grade: Grade }>;
  }>;
};

function toGrade(value: string | null | undefined): Grade {
  if (value === 'A' || value === 'B' || value === 'C' || value === 'D' || value === 'E') {
    return value;
  }
  return 'C';
}

export function buildRetailerPassport(data: BatteryPassportData): RetailerPassportView {
  const overallGrade = toGrade(data.carbonFootprintPerformanceClassValue);

  const specs = [
    {
      label: 'Capacity',
      value: data.grossCapacityKwh != null ? `${Math.round(data.grossCapacityKwh * 1000)} Wh` : 'N/A',
    },
    {
      label: 'Voltage',
      value: data.carbonDeclarationBatteryModelNominalVoltageV != null
        ? `${data.carbonDeclarationBatteryModelNominalVoltageV} V`
        : 'N/A',
    },
    {
      label: 'Chemistry',
      value: data.batteryChemistry ?? 'N/A',
    },
    {
      label: 'Weight',
      value: data.batteryWeight ?? 'N/A',
    },
  ];

  const flags = [
    {
      keyword: 'EU Compliance',
      positive: true,
      detail: data.declarationOfConformityRef
        ? `Ref: ${data.declarationOfConformityRef}`
        : 'Not declared',
    },
    {
      keyword: 'EU Manufacturing',
      positive: true,
      detail:
        data.placeOfManufacture?.includes('Germany') || data.placeOfManufacture?.includes('Bavaria')
          ? data.placeOfManufacture
          : 'Not EU manufactured',
    },
    {
      keyword: 'Carbon Methodology Declared',
      positive: true,
      detail: data.carbonFootprintTotalCalculationBasis ?? 'Not declared',
    },
    {
      keyword: 'QR Code Affixed',
      positive: true,
      detail: data.qrCodeAffixed ? 'QR code present' : 'Not affixed',
    },
    {
      keyword: 'Fire Safety Declared',
      positive: true,
      detail: data.fireExtinguishingAgent ?? 'Not declared',
    },
    {
      keyword: 'No Recycled Cobalt',
      positive: false,
      detail:
        data.recycledCobaltPercentage === 0 || data.recycledCobaltPercentage == null
          ? 'No recycled cobalt used'
          : `${data.recycledCobaltPercentage}% recycled`,
    },
    {
      keyword: 'No Recycled Lithium',
      positive: false,
      detail:
        data.recycledLithiumPercentage === 0 || data.recycledLithiumPercentage == null
          ? 'No recycled lithium used'
          : `${data.recycledLithiumPercentage}% recycled`,
    },
    {
      keyword: 'Preliminary Carbon Class',
      positive: false,
      detail:
        data.carbonFootprintPerformanceClassStatus === 'preliminary'
          ? 'Preliminary classification'
          : 'Final classification',
    },
    {
      keyword: 'Critical Raw Materials',
      positive: false,
      detail: data.criticalRawMaterials && data.criticalRawMaterials.length > 0
        ? data.criticalRawMaterials
        : 'None declared',
    },
    {
      keyword: 'No Renewable Content Data',
      positive: false,
      detail:
        !data.renewableContentShare || data.renewableContentShare === ''
          ? 'No data available'
          : `${data.renewableContentShare} renewable`,
    },
  ];

  const carbonGrade = toGrade(data.carbonFootprintPerformanceClassValue);
  const bothRecycledZero =
    (data.recycledCobaltPercentage === 0 || data.recycledCobaltPercentage == null) &&
    (data.recycledLithiumPercentage === 0 || data.recycledLithiumPercentage == null);
  const recycledGrade: Grade = bothRecycledZero ? 'D' : 'B';
  const performanceGrade: Grade =
    data.grossCapacityKwh != null && data.grossCapacityKwh >= 0.6 ? 'A' : 'C';
  const complianceGrade: Grade = data.declarationOfConformityRef ? 'A' : 'C';
  const originGrade: Grade =
    data.placeOfManufacture?.includes('Germany') || data.placeOfManufacture?.includes('Bavaria')
      ? 'A'
      : 'C';

  const categories = [
    {
      id: 'carbon',
      title: 'Carbon Footprint',
      grade: carbonGrade,
      summary: `${data.carbonFootprintTotalValueKgCo2ePerKwh ?? 'N/A'} kg CO₂e/kWh`,
      points: [
        {
          label: 'Total Carbon Footprint',
          value: data.carbonFootprintTotalValueKgCo2ePerKwh != null
            ? `${data.carbonFootprintTotalValueKgCo2ePerKwh} kg CO₂e/kWh`
            : 'N/A',
          grade: carbonGrade,
        },
        {
          label: 'Performance Class',
          value: data.carbonFootprintPerformanceClassValue ?? 'N/A',
          grade: carbonGrade,
        },
        {
          label: 'Calculation Basis',
          value: data.carbonFootprintTotalCalculationBasis ?? 'N/A',
          grade: carbonGrade,
        },
      ],
    },
    {
      id: 'recycled',
      title: 'Recycled Content',
      grade: recycledGrade,
      summary: bothRecycledZero ? 'No recycled materials declared' : 'Recycled materials present',
      points: [
        {
          label: 'Recycled Cobalt',
          value: data.recycledCobaltPercentage != null ? `${data.recycledCobaltPercentage}%` : 'N/A',
          grade: recycledGrade,
        },
        {
          label: 'Recycled Lithium',
          value: data.recycledLithiumPercentage != null ? `${data.recycledLithiumPercentage}%` : 'N/A',
          grade: recycledGrade,
        },
      ],
    },
    {
      id: 'performance',
      title: 'Capacity & Performance',
      grade: performanceGrade,
      summary: data.grossCapacityKwh != null
        ? `${Math.round(data.grossCapacityKwh * 1000)} Wh capacity`
        : 'N/A',
      points: [
        {
          label: 'Gross Capacity',
          value: data.grossCapacityKwh != null ? `${data.grossCapacityKwh} kWh` : 'N/A',
          grade: performanceGrade,
        },
        {
          label: 'Nominal Voltage',
          value: data.carbonDeclarationBatteryModelNominalVoltageV != null
            ? `${data.carbonDeclarationBatteryModelNominalVoltageV} V`
            : 'N/A',
          grade: performanceGrade,
        },
        {
          label: 'Expected Lifetime',
          value: data.expectedLifetimeCycles ?? 'N/A',
          grade: performanceGrade,
        },
      ],
    },
    {
      id: 'compliance',
      title: 'Compliance & Conformity',
      grade: complianceGrade,
      summary: data.declarationOfConformityRef
        ? 'EU Declaration of Conformity issued'
        : 'No conformity declaration',
      points: [
        {
          label: 'Declaration Reference',
          value: data.declarationOfConformityRef ?? 'N/A',
          grade: complianceGrade,
        },
        {
          label: 'CE Marking',
          value: data.ceMarking ?? 'N/A',
          grade: complianceGrade,
        },
      ],
    },
    {
      id: 'origin',
      title: 'Manufacturing Origin',
      grade: originGrade,
      summary: data.placeOfManufacture ?? 'Unknown',
      points: [
        {
          label: 'Place of Manufacture',
          value: data.placeOfManufacture ?? 'N/A',
          grade: originGrade,
        },
        {
          label: 'Country',
          value: data.carbonDeclarationManufacturingCountry ?? 'N/A',
          grade: originGrade,
        },
      ],
    },
  ];

  return {
    batteryModel: data.batteryModel ?? 'Unknown',
    batteryChemistry: data.batteryChemistry ?? 'Unknown',
    grossCapacityKwh: data.grossCapacityKwh,
    carbonFootprintKgCo2ePerKwh: data.carbonFootprintKgCo2ePerKwh,
    overallGrade,
    specs,
    flags,
    categories,
  };
}

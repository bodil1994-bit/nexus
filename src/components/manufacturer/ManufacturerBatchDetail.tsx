import { parseMissingFields } from '@/lib/manufacturer/dashboardStats';
import { BatchStatusBadge } from './BatchStatusBadge';
import { MissingFieldsList } from './MissingFieldsList';
import { ErpPayloadPreview } from './ErpPayloadPreview';
import { BatchActions } from './BatchActions';
import type { OrderRow, BatchRow } from './ManufacturerBatchTable';
import { X, Info, Database, FileText, Activity, ExternalLink, AlertTriangle } from 'lucide-react';

type PassportSection = {
  letter: string;
  title: string;
  fields: [string, string][];
};

const PASSPORT_SECTIONS: PassportSection[] = [
  {
    letter: 'M',
    title: 'Identification',
    fields: [
      ['uniqueBatteryIdentifier', 'Unique Battery Identifier'],
      ['individualBatteryIdentifier', 'Individual Battery Identifier'],
      ['batteryCategory', 'Battery Category'],
      ['batteryModel', 'Battery Model'],
      ['batteryChemistry', 'Battery Chemistry'],
      ['manufacturerName', 'Manufacturer Name'],
      ['manufactureYear', 'Manufacture Year'],
      ['grossCapacityKwh', 'Gross Capacity (kWh)'],
      ['carbonFootprintKgCo2ePerKwh', 'Carbon Footprint (kg CO2e/kWh)'],
      ['recycledCobaltPercentage', 'Recycled Cobalt (%)'],
      ['recycledLithiumPercentage', 'Recycled Lithium (%)'],
      ['declarationOfConformityRef', 'Declaration of Conformity Ref'],
      ['qrCodeAffixed', 'QR Code Affixed'],
      ['qrCodeUrl', 'QR Code URL'],
      ['qrCode', 'QR Code'],
      ['issueDate', 'Issue Date'],
      ['operatingInstructionsReference', 'Operating Instructions Ref'],
      ['previousBatteryPassportLink', 'Previous Passport Link'],
    ],
  },
  {
    letter: 'A',
    title: 'General Info',
    fields: [
      ['manufacturerIdentification', 'Manufacturer Identification'],
      ['placeOfManufacture', 'Place of Manufacture'],
      ['dateOfManufacture', 'Date of Manufacture'],
      ['batteryWeight', 'Battery Weight'],
      ['ratedCapacity', 'Rated Capacity'],
      ['chemicalComposition', 'Chemical Composition'],
      ['hazardousSubstances', 'Hazardous Substances'],
      ['fireExtinguishingAgent', 'Fire Extinguishing Agent'],
      ['criticalRawMaterials', 'Critical Raw Materials'],
    ],
  },
  {
    letter: 'B',
    title: 'Carbon Footprint',
    fields: [
      ['carbonFootprintTotalValueKgCo2ePerKwh', 'Total (kg CO2e/kWh)'],
      ['carbonFootprintTotalTotalKgCo2e', 'Total (kg CO2e)'],
      ['carbonFootprintTotalCalculationBasis', 'Calculation Basis'],
      ['carbonFootprintPerformanceClassValue', 'Performance Class'],
      ['carbonFootprintPerformanceClassStatus', 'Performance Class Status'],
      ['carbonDeclarationManufacturerCompanyName', 'Manufacturer Company'],
      ['carbonDeclarationManufacturerAddress', 'Manufacturer Address'],
      ['carbonDeclarationManufacturerSustainabilityUrl', 'Sustainability URL'],
      ['carbonDeclarationBatteryModelName', 'Battery Model Name'],
      ['carbonDeclarationBatteryModelChemistry', 'Battery Chemistry'],
      ['carbonDeclarationBatteryModelNominalCapacityAh', 'Nominal Capacity (Ah)'],
      ['carbonDeclarationBatteryModelNominalCapacityKwh', 'Nominal Capacity (kWh)'],
      ['carbonDeclarationBatteryModelNominalVoltageV', 'Nominal Voltage (V)'],
      ['carbonDeclarationBatteryModelApplication', 'Application'],
      ['carbonDeclarationManufacturingFacilityName', 'Manufacturing Facility'],
      ['carbonDeclarationManufacturingCity', 'Manufacturing City'],
      ['carbonDeclarationManufacturingCountry', 'Manufacturing Country'],
      ['carbonFootprintLifecycleRawMaterialExtractionKgCo2e', 'Raw Material Extraction (kg CO2e)'],
      ['carbonFootprintLifecycleRawMaterialPct', 'Raw Material Extraction (%)'],
      ['carbonFootprintLifecycleManufacturingKgCo2e', 'Manufacturing (kg CO2e)'],
      ['carbonFootprintLifecycleManufacturingPct', 'Manufacturing (%)'],
      ['carbonFootprintLifecycleDistributionKgCo2e', 'Distribution (kg CO2e)'],
      ['carbonFootprintLifecycleDistributionPct', 'Distribution (%)'],
      ['carbonFootprintLifecycleEndOfLifeKgCo2e', 'End of Life (kg CO2e)'],
      ['carbonFootprintLifecycleEndOfLifePct', 'End of Life (%)'],
      ['carbonDeclarationDocReferenceNumber', 'Doc Reference Number'],
      ['carbonDeclarationDocIssuedBy', 'Doc Issued By'],
      ['carbonDeclarationDocIssueDate', 'Doc Issue Date'],
      ['carbonDeclarationDocNotifiedBodyReference', 'Notified Body Reference'],
      ['carbonDeclarationSustainabilityPageUrl', 'Sustainability Page URL'],
      ['carbonDeclarationCarbonFootprintReportUrl', 'Carbon Footprint Report URL'],
    ],
  },
  {
    letter: 'C',
    title: 'Recycled Content',
    fields: [
      ['recycledContentCobalt', 'Cobalt'],
      ['recycledContentLithium', 'Lithium'],
      ['recycledContentNickel', 'Nickel'],
      ['recycledContentLead', 'Lead'],
      ['renewableContentShare', 'Renewable Content Share'],
    ],
  },
  {
    letter: 'D',
    title: 'Due Diligence',
    fields: [
      ['dueDiligenceStrategy', 'Strategy'],
      ['dueDiligenceReport', 'Report'],
      ['dueDiligenceVerificationSummary', 'Verification Summary'],
      ['supplyChainRawMaterialDescription', 'Raw Material Description'],
      ['supplyChainCountryOfOrigin', 'Country of Origin'],
      ['supplyChainSupplierInfo', 'Supplier Info'],
      ['supplyChainRawMaterialQuantities', 'Raw Material Quantities'],
      ['supplyChainAuditReport', 'Audit Report'],
      ['supplyChainConflictAreas', 'Conflict Areas'],
      ['recycledSourceEvidence', 'Recycled Source Evidence'],
    ],
  },
  {
    letter: 'E',
    title: 'Electrical Characteristics',
    fields: [
      ['ratedCapacityAh', 'Rated Capacity (Ah)'],
      ['minimumVoltage', 'Minimum Voltage'],
      ['nominalVoltage', 'Nominal Voltage'],
      ['maximumVoltage', 'Maximum Voltage'],
      ['originalPowerCapability', 'Power Capability'],
      ['powerLimits', 'Power Limits'],
      ['expectedLifetimeCycles', 'Expected Lifetime Cycles'],
      ['capacityThresholdExhaustion', 'Capacity Threshold Exhaustion'],
      ['temperatureRangeStorage', 'Temperature Range (Storage)'],
      ['warrantyCalendarLife', 'Warranty Calendar Life'],
      ['roundTripEfficiencyInitial', 'Round Trip Efficiency (Initial)'],
      ['roundTripEfficiencyAt50PctCycles', 'Round Trip Efficiency (50% Cycles)'],
      ['internalResistanceCell', 'Internal Resistance (Cell)'],
      ['internalResistancePack', 'Internal Resistance (Pack)'],
      ['cRateCycleLifeTest', 'C-Rate Cycle Life Test'],
    ],
  },
  {
    letter: 'F',
    title: 'Conformity & Waste',
    fields: [
      ['euDeclarationOfConformity', 'EU Declaration of Conformity'],
      ['docReferenceNumber', 'Doc Reference Number'],
      ['ceMarking', 'CE Marking'],
      ['labellingRequirements', 'Labelling Requirements'],
      ['cadmiumMarking', 'Cadmium Marking'],
      ['leadMarking', 'Lead Marking'],
      ['wasteInfoEndUserRole', 'End User Role'],
      ['wasteInfoSeparateCollection', 'Separate Collection'],
      ['wasteInfoTakebackPoints', 'Takeback Points'],
      ['wasteInfoSafetyInstructions', 'Safety Instructions'],
      ['wasteInfoLabelMeanings', 'Label Meanings'],
      ['wasteInfoHazardousSubstanceImpacts', 'Hazardous Substance Impacts'],
    ],
  },
  {
    letter: 'G',
    title: 'Composition & Disassembly',
    fields: [
      ['detailedCompositionCathode', 'Cathode Composition'],
      ['detailedCompositionAnode', 'Anode Composition'],
      ['detailedCompositionElectrolyte', 'Electrolyte Composition'],
      ['partNumbersComponents', 'Part Numbers'],
      ['sparePartsSupplierContacts', 'Spare Parts Contacts'],
      ['disassemblyExplodedDiagrams', 'Exploded Diagrams'],
      ['disassemblySequence', 'Disassembly Sequence'],
      ['disassemblyJoiningTechniques', 'Joining Techniques'],
      ['disassemblyRequiredTools', 'Required Tools'],
      ['disassemblyDamageWarnings', 'Damage Warnings'],
      ['disassemblyCellCountArrangement', 'Cell Count Arrangement'],
      ['safetyMeasures', 'Safety Measures'],
    ],
  },
  {
    letter: 'H',
    title: 'Authority Info',
    fields: [
      ['testReportResults', 'Test Report Results'],
      ['ceNotifiedBodyReference', 'CE Notified Body Reference'],
      ['technicalDocumentationStandards', 'Documentation Standards'],
      ['technicalDocumentationGeneralDescription', 'General Description'],
    ],
  },
  {
    letter: 'I–L',
    title: 'Individual Battery & Lifetime',
    fields: [
      ['batteryStatus', 'Battery Status'],
      ['individualRatedCapacityAndFade', 'Rated Capacity & Fade'],
      ['individualPowerAndFade', 'Power & Fade'],
      ['individualInternalResistance', 'Internal Resistance'],
      ['individualRoundTripEfficiency', 'Round Trip Efficiency'],
      ['individualRemainingLifetime', 'Remaining Lifetime'],
      ['sohStateOfCertifiedEnergy', 'SOH: Certified Energy'],
      ['sohRemainingCapacity', 'SOH: Remaining Capacity'],
      ['sohRemainingPower', 'SOH: Remaining Power'],
      ['sohRemainingRoundTripEfficiency', 'SOH: Round Trip Efficiency'],
      ['sohSelfDischargeRate', 'SOH: Self Discharge Rate'],
      ['sohOhmicResistance', 'SOH: Ohmic Resistance'],
      ['lifetimeManufactureAndCommissioningDate', 'Manufacture & Commissioning Date'],
      ['lifetimeEnergyThroughput', 'Energy Throughput'],
      ['lifetimeCapacityThroughput', 'Capacity Throughput'],
      ['lifetimeDeepDischarges', 'Deep Discharges'],
      ['lifetimeExtremeTemperatureExposure', 'Extreme Temperature Exposure'],
      ['lifetimeEquivalentFullCycles', 'Equivalent Full Cycles'],
      ['chargeDischargeCycleCount', 'Charge/Discharge Cycle Count'],
      ['negativeEventsLog', 'Negative Events Log'],
      ['operatingTemperatureLog', 'Operating Temperature Log'],
      ['stateOfChargeLog', 'State of Charge Log'],
    ],
  },
];

type Props = {
  order: OrderRow;
  batch: BatchRow;
  onClose: () => void;
};

export function ManufacturerBatchDetail({ order, batch, onClose }: Props) {
  const missingFields = parseMissingFields(batch.missingFieldsJson);
  const batteryData = batch.passport?.batteryData as Record<string, unknown> | null | undefined;
  const isIncomplete = batch.status === 'INCOMPLETE';

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-white/85 to-white/50 shadow-[0_2px_16px_rgba(0,0,0,0.06)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5 bg-white/50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
            <Activity size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Batch Analysis</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Order <span className="text-slate-900 font-mono font-medium">#{order.orderNumber}</span> · Batch <span className="text-slate-900 font-mono font-medium">#{batch.batchNumber}</span>
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-full w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-colors shadow-sm"
        >
          <X size={18} />
        </button>
      </div>

      {/* Incomplete warning banner */}
      {isIncomplete && missingFields.length > 0 && (
        <div className="flex items-center gap-3 px-8 py-3 bg-orange-50 border-b border-orange-200/60">
          <AlertTriangle size={15} className="text-orange-600 flex-shrink-0" />
          <p className="text-sm font-semibold text-orange-800">
            {missingFields.length} required field{missingFields.length !== 1 ? 's' : ''} missing — supplier data requested
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        {/* Main Content Area */}
        <div className="lg:col-span-2 p-8 space-y-10">

          {/* Summary Grid */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Info size={16} className="text-emerald-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700/70">Batch Summary</h3>
            </div>
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-1">
                <dt className="text-slate-400 font-medium">Supplier</dt>
                <dd className="text-slate-900 font-medium">{order.supplier.name}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-slate-400 font-medium">Manufacturer SKU</dt>
                <dd className="text-slate-900 font-mono">{batch.manufacturerSku}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-slate-400 font-medium">Quantity</dt>
                <dd className="text-slate-900 font-medium">{batch.quantity} units</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-slate-400 font-medium">Passport ID</dt>
                <dd className="text-slate-900 font-mono">{batch.passport?.passportId ?? 'PENDING'}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-slate-400 font-medium">Readiness</dt>
                <dd className="text-slate-900 font-bold">{batch.readinessScore}%</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-slate-400 font-medium">Status</dt>
                <dd><BatchStatusBadge status={batch.status} /></dd>
              </div>
            </dl>
          </section>

          {/* Missing Information Section */}
          {(isIncomplete || missingFields.length > 0) && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-orange-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-orange-700/80">Missing Information</h3>
              </div>
              <div className="rounded-xl border border-orange-200/60 bg-orange-50/60 p-6 shadow-sm">
                <MissingFieldsList
                  missingFields={missingFields}
                  supplierEmail={order.supplier.email}
                  supplierNotifiedAt={batch.supplierNotifiedAt}
                />
              </div>
            </section>
          )}

          {/* Passport Data Section — all sections */}
          {batteryData && (
            <section className="space-y-8">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-emerald-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700/70">Extracted Passport Data</h3>
              </div>

              {PASSPORT_SECTIONS.map((section) => {
                const hasAnyValue = section.fields.some(([key]) => batteryData[key] != null);
                return (
                  <div key={section.letter} className="rounded-xl border border-slate-100 overflow-hidden">
                    {/* Section header */}
                    <div className="flex items-center gap-3 px-5 py-3 bg-slate-50/80 border-b border-slate-100">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-200 text-slate-700 text-[10px] font-black font-mono tracking-tight flex-shrink-0">
                        {section.letter}
                      </span>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">{section.title}</h4>
                      {!hasAnyValue && (
                        <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-orange-500 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                          No data
                        </span>
                      )}
                    </div>

                    {/* Fields grid */}
                    <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4 p-5 text-sm">
                      {section.fields.map(([key, label]) => {
                        const value = batteryData[key];
                        const hasValue = value != null;
                        return (
                          <div key={key} className="space-y-0.5 min-w-0">
                            <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 truncate">{label}</dt>
                            <dd className={`text-sm font-medium break-words ${hasValue ? 'text-slate-800' : 'text-slate-300'}`}>
                              {hasValue ? String(value) : '—'}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  </div>
                );
              })}
            </section>
          )}
        </div>

        {/* Sidebar Actions Area */}
        <div className="p-8 bg-slate-50/30 space-y-10">
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Database size={16} className="text-emerald-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700/70">ERP Integration</h3>
            </div>
            <ErpPayloadPreview
              status={batch.status}
              erpSyncedAt={batch.erpSyncedAt}
              erpPayloadJson={batch.erpPayloadJson}
              orderNumber={order.orderNumber}
              batchNumber={batch.batchNumber}
              passportReferenceId={batch.passport?.passportId}
            />
          </section>

          <section className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Available Actions</h3>
            <BatchActions
              batchId={batch.id}
              status={batch.status}
              supplierNotifiedAt={batch.supplierNotifiedAt}
              erpPayloadJson={batch.erpPayloadJson}
              orderNumber={order.orderNumber}
              batchNumber={batch.batchNumber}
              passportReferenceId={batch.passport?.passportId}
            />
          </section>

          {batch.status === 'ERP_SYNCED' && batch.passport?.passportUrl && (
            <div className="pt-6 border-t border-slate-100">
              <a
                href={batch.passport.passportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-sm"
              >
                View Customer Passport
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

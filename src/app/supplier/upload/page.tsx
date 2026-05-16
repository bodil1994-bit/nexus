'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, ChevronRight, CheckCircle, Zap, Shield, Database } from 'lucide-react';

type Stage = 'idle' | 'extracting' | 'extracted';

const EXTRACTION_STEPS = [
  { label: 'Parsing document structure', icon: FileText },
  { label: 'Extracting battery data fields', icon: Zap },
  { label: 'Validating EU Battery Regulation', icon: Shield },
  { label: 'Building digital passport', icon: Database },
];

const EXTRACTED_PASSPORT = {
  passportId: 'BAT-BSH-PT625-2026-008314',
  passportType: 'BATTERY',
  readinessScore: 100,
  identification: {
    uniqueBatteryIdentifier: 'BAT-BSH-PT625-2026-008314',
    batteryCategory: 'LMT',
    batteryModel: 'Bosch PowerTube 625 Wh',
    batteryChemistry: 'Lithium-Nickel-Manganese-Cobalt Oxide (NMC622)',
    manufacturerName: 'Robert Bosch GmbH',
    manufactureYear: 2026,
    placeOfManufacture: 'Samsung SDI Automotive Battery Plant',
    batteryWeight: '2.9 kg',
    grossCapacityKwh: 0.625,
    issueDate: '2026-06-01',
    declarationOfConformityRef: 'BSH-BAT-2026-EU-003142',
    qrCodeAffixed: true,
  },
  carbonFootprint: {
    totalKgCo2ePerKwh: 148,
    totalKgCo2e: 92.5,
    performanceClass: 'C',
    calculationBasis: 'Cradle-to-gate battery pack (ISO 14067 methodology)',
    lifecycle: {
      rawMaterialExtraction: { kgCo2e: 44.4, pct: 48 },
      manufacturing: { kgCo2e: 27.8, pct: 30 },
      distribution: { kgCo2e: 3.7, pct: 4 },
      endOfLife: { kgCo2e: -16.7, pct: -18 },
    },
  },
  electricalCharacteristics: {
    nominalVoltage: '36 V',
    ratedCapacityAh: '17.5 Ah',
    originalPowerCapability: '900 W',
    expectedLifetimeCycles: '500 cycles',
    roundTripEfficiencyInitial: '91.5%',
    temperatureRangeStorage: '-20 to +60 °C',
  },
  recycledContent: {
    cobalt: '0%',
    lithium: '0%',
    nickel: '0%',
    renewableContentShare: '55%',
  },
  supplyChain: {
    rawMaterial: 'Cobalt Sulphate (CoSO4·7H2O)',
    countryOfOrigin: 'DRC',
    supplierInfo: 'Samsung SDI Co., Ltd.',
    auditReport: 'RMI Conformant Smelter Program',
  },
  conformity: {
    euDeclarationRef: 'BSH-BAT-2026-EU-003142',
    ceMarking: 'CE marking affixed',
    testReport: 'IEC 62133-2:2017 passed',
    notifiedBodyRef: '0044 (TÜV SÜD Product Service GmbH)',
  },
};

export default function SupplierUploadPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('idle');
  const [activeStep, setActiveStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => timerRefs.current.forEach(clearTimeout);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStage('extracting');
    setActiveStep(0);
    setCompletedSteps([]);

    const stepDuration = 2000;
    EXTRACTION_STEPS.forEach((_, i) => {
      const t1 = setTimeout(() => setActiveStep(i), i * stepDuration);
      const t2 = setTimeout(() => setCompletedSteps((prev) => [...prev, i]), i * stepDuration + stepDuration - 80);
      timerRefs.current.push(t1, t2);
    });

    const done = setTimeout(() => {
      setStage('extracted');
    }, EXTRACTION_STEPS.length * stepDuration + 500);
    timerRefs.current.push(done);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden selection:bg-emerald-100">
      <div className="fixed top-0 left-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl py-12 px-6 flex flex-col items-center">
        <div className={`w-full transition-all duration-500 ${stage === 'extracted' ? 'max-w-4xl' : 'max-w-xl'}`}>
          <header className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-4">
              <Upload size={12} />
              <span>Supplier Gateway</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-3">Submit Batch Passport</h1>
            <p className="text-slate-500 text-lg">
              Securely transmit battery passport data for{' '}
              <span className="text-slate-900 font-semibold">Manufacturer ERP integration.</span>
            </p>
          </header>

          {stage === 'idle' && (
            <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 to-white/40 p-8 backdrop-blur-xl relative group">
              <div className="absolute -inset-px bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <form onSubmit={handleSubmit} className="space-y-6 relative">
                <div className="space-y-2">
                  <label htmlFor="manufacturer" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                    Target Manufacturer
                  </label>
                  <div className="relative">
                    <select
                      id="manufacturer"
                      name="manufacturer"
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all cursor-pointer shadow-sm"
                    >
                      <option value="ktm">KTM Fahrrad GmbH</option>
                      <option value="fisher">Fisher E-Bikes</option>
                      <option value="giro">Giro Helmets &amp; Accessories</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronRight size={16} className="rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="orderNumber" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                      Order Reference
                    </label>
                    <input
                      id="orderNumber"
                      name="orderNumber"
                      type="text"
                      defaultValue="ORD-KTM-BSH-2026"
                      className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="batchNumber" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                      Batch Serial
                    </label>
                    <input
                      id="batchNumber"
                      name="batchNumber"
                      type="text"
                      defaultValue="BAT-BSH-PT625-002"
                      className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="files" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                    Passport Documentation
                  </label>
                  <div className="relative group/file">
                    <input
                      id="files"
                      name="files"
                      type="file"
                      multiple
                      accept=".csv,.json,.xlsx,.xml,.pdf,.txt"
                      onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                      className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-4 py-8 text-sm text-transparent file:hidden cursor-pointer hover:bg-white transition-all text-center shadow-sm"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none py-8">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 shadow-sm transition-all ${fileName ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-50 text-emerald-600 group-hover/file:scale-110'}`}>
                        {fileName ? <CheckCircle size={20} /> : <FileText size={20} />}
                      </div>
                      {fileName ? (
                        <>
                          <p className="text-sm font-semibold text-emerald-700">{fileName}</p>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">Ready for extraction</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-slate-600">Drop passport files or click to browse</p>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">CSV, JSON, XLSX, PDF, TXT up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full group relative flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 text-sm font-bold text-white hover:bg-emerald-600 transition-all"
                >
                  <span>Initialize AI Extraction</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          )}

          {stage === 'extracting' && (
            <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 to-white/40 p-10 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-400/10 animate-ping" style={{ animationDuration: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-emerald-400/10 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }} />
              </div>

              <div className="relative flex flex-col items-center text-center mb-10">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <Zap size={32} className="text-emerald-600 animate-pulse" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">AI Extraction Running</h2>
                <p className="text-slate-500 text-sm">Processing battery passport data from uploaded documents</p>
              </div>

              <div className="relative space-y-3 max-w-sm mx-auto">
                {EXTRACTION_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const isComplete = completedSteps.includes(i);
                  const isActive = activeStep === i && !isComplete;
                  const isPending = activeStep < i;
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${
                        isComplete
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : isActive
                          ? 'bg-white border-emerald-300 text-slate-900 shadow-sm'
                          : 'bg-white/40 border-slate-100 text-slate-400'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isComplete ? 'bg-emerald-500 text-white' : isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {isComplete ? <CheckCircle size={14} /> : <Icon size={14} className={isActive ? 'animate-pulse' : ''} />}
                      </div>
                      <span className={`text-xs font-semibold uppercase tracking-wide ${isPending ? 'text-slate-400' : ''}`}>
                        {step.label}
                      </span>
                      {isActive && (
                        <div className="ml-auto flex gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      )}
                      {isComplete && (
                        <span className="ml-auto text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Done</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 max-w-sm mx-auto">
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                    style={{ width: `${((completedSteps.length) / EXTRACTION_STEPS.length) * 100}%` }}
                  />
                </div>
                <p className="text-center text-[10px] uppercase tracking-widest text-slate-400 mt-2 font-bold">
                  {completedSteps.length}/{EXTRACTION_STEPS.length} steps complete
                </p>
              </div>
            </div>
          )}

          {stage === 'extracted' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 backdrop-blur-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white flex-shrink-0">
                  <CheckCircle size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-0.5">Extraction Complete</p>
                  <h2 className="text-xl font-bold text-slate-900">Bosch PowerTube 625 Wh</h2>
                  <p className="text-xs text-slate-500">Passport ID: <span className="font-mono text-slate-700">BAT-BSH-PT625-2026-008314</span></p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-3xl font-black text-emerald-600">100%</div>
                  <p className="text-[10px] uppercase tracking-widest text-emerald-700 font-bold">Readiness</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Chemistry', value: 'NMC622' },
                  { label: 'Capacity', value: '0.625 kWh' },
                  { label: 'Carbon Class', value: 'Class C' },
                  { label: 'CO₂e/kWh', value: '148 kg' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/60 bg-gradient-to-br from-white/80 to-white/40 p-4 shadow-sm backdrop-blur-xl text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                    <p className="text-base font-bold text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 to-white/40 shadow-[0_2px_16px_rgba(0,0,0,0.06)] backdrop-blur-xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="ml-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">extracted-passport.json</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">EU Battery Reg. 2023/1542</span>
                </div>
                <div className="overflow-auto max-h-96 p-6">
                  <pre className="text-xs text-slate-700 font-mono leading-relaxed whitespace-pre-wrap">
                    {JSON.stringify(EXTRACTED_PASSPORT, null, 2)}
                  </pre>
                </div>
              </div>

              <button
                onClick={() => router.push('/supplier/batches')}
                className="w-full group relative flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 text-sm font-bold text-white hover:bg-emerald-600 transition-all"
              >
                <CheckCircle size={16} />
                <span>Confirm &amp; Submit</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          <footer className="mt-12 text-center text-slate-400">
            <p className="text-[10px] uppercase tracking-widest mb-2 font-bold">End-to-End Encrypted Transmission</p>
            <p className="text-xs">
              Powered by Veloport. All data is processed according to <br />
              the <span className="text-slate-600 font-medium">EU Battery Regulation 2023/1542</span>.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

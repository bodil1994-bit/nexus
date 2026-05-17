'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  ChevronLeft, ChevronDown, ChevronUp,
  Leaf, RefreshCw, Zap, ShieldCheck, Globe,
  Truck, FlaskConical, Clock, Recycle, Wrench,
  MapPin, CheckCircle2, XCircle,
} from 'lucide-react';
import { RetailerPassportView, Grade } from '@/lib/retailer/buildRetailerPassport';
import type { MapLocation } from './RecyclingMap';

const RecyclingMap = dynamic(() => import('./RecyclingMap'), { ssr: false });

// ─── Grade system ──────────────────────────────────────────────────────────────

const GRADE_BG: Record<Grade, string> = {
  A: 'bg-emerald-600',
  B: 'bg-lime-600',
  C: 'bg-amber-500',
  D: 'bg-orange-500',
  E: 'bg-red-600',
};
const GRADE_TEXT: Record<Grade, string> = {
  A: 'text-emerald-700',
  B: 'text-lime-700',
  C: 'text-amber-700',
  D: 'text-orange-700',
  E: 'text-red-700',
};
const GRADE_BORDER: Record<Grade, string> = {
  A: 'border-emerald-200',
  B: 'border-lime-200',
  C: 'border-amber-200',
  D: 'border-orange-200',
  E: 'border-red-200',
};
const GRADE_DOT: Record<Grade, string> = {
  A: 'bg-emerald-500',
  B: 'bg-lime-500',
  C: 'bg-amber-400',
  D: 'bg-orange-500',
  E: 'bg-red-500',
};

function GradeBadge({ grade, size = 'sm' }: { grade: Grade; size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'lg' ? 'w-14 h-14 text-2xl rounded-2xl' : size === 'md' ? 'w-9 h-9 text-base rounded-xl' : 'w-7 h-7 text-sm rounded-lg';
  return (
    <div className={`${GRADE_BG[grade]} ${dim} flex items-center justify-center text-white font-black flex-shrink-0`}>
      {grade}
    </div>
  );
}

// ─── Category icons ─────────────────────────────────────────────────────────────

const CAT_ICONS: Record<string, React.ReactNode> = {
  carbon: <Leaf size={15} />,
  recycled: <RefreshCw size={15} />,
  performance: <Zap size={15} />,
  compliance: <ShieldCheck size={15} />,
  origin: <Globe size={15} />,
  supplychain: <Truck size={15} />,
  hazardous: <FlaskConical size={15} />,
  durability: <Clock size={15} />,
  endoflife: <Recycle size={15} />,
  repair: <Wrench size={15} />,
};

// ─── Extra mock categories ──────────────────────────────────────────────────────

type MockCategory = {
  id: string;
  title: string;
  grade: Grade;
  summary: string;
  points: { label: string; value: string; grade: Grade }[];
};

const EXTRA_CATEGORIES: MockCategory[] = [
  {
    id: 'supplychain',
    title: 'Supply Chain',
    grade: 'B',
    summary: 'OECD-audited cobalt sourcing',
    points: [
      { label: 'Cobalt Origin', value: 'Democratic Republic of Congo', grade: 'C' },
      { label: 'Audit Standard', value: 'OECD Due Diligence Guidance', grade: 'A' },
      { label: 'Conflict Area Risk', value: 'Low, third-party verified', grade: 'B' },
      { label: 'Supplier Disclosure', value: 'Robert Bosch GmbH, Tier 1', grade: 'A' },
    ],
  },
  {
    id: 'hazardous',
    title: 'Hazardous Substances',
    grade: 'B',
    summary: 'LiPF₆ declared, safety data provided',
    points: [
      { label: 'Electrolyte', value: 'Lithium hexafluorophosphate (LiPF₆)', grade: 'C' },
      { label: 'Cathode', value: 'NMC622, no cadmium or mercury', grade: 'A' },
      { label: 'Fire Agent', value: 'Water, non-toxic suppression', grade: 'A' },
      { label: 'REACH Compliance', value: 'Confirmed, no SVHC above threshold', grade: 'A' },
    ],
  },
  {
    id: 'durability',
    title: 'Battery Durability',
    grade: 'B',
    summary: '500 cycles to 80% capacity',
    points: [
      { label: 'Cycle Life', value: '500 cycles @ 80% DoD', grade: 'B' },
      { label: 'Calendar Warranty', value: '2 years', grade: 'C' },
      { label: 'Round-trip Efficiency', value: '96% (initial)', grade: 'A' },
      { label: 'Temperature Range', value: '-10 °C to +45 °C storage', grade: 'B' },
    ],
  },
  {
    id: 'endoflife',
    title: 'End of Life',
    grade: 'C',
    summary: 'EU take-back program available',
    points: [
      { label: 'Take-back Points', value: '23 authorised locations in AT/DE', grade: 'B' },
      { label: 'Recycled Content', value: '0% cobalt, 0% lithium', grade: 'D' },
      { label: 'Recovery Rate Target', value: '>70% by 2027 (EU mandate)', grade: 'C' },
      { label: 'Waste Classification', value: 'Hazardous, separate collection required', grade: 'C' },
    ],
  },
  {
    id: 'repair',
    title: 'Repairability',
    grade: 'C',
    summary: 'Disassembly instructions available',
    points: [
      { label: 'Disassembly Guide', value: 'Available, 12-step sequence', grade: 'B' },
      { label: 'Required Tools', value: 'T20 Torx, plastic pry tool', grade: 'A' },
      { label: 'Cell Replacement', value: 'Workshop only, not user-serviceable', grade: 'D' },
      { label: 'Spare Parts', value: 'Available via Bosch eBike Systems', grade: 'B' },
    ],
  },
];

// ─── Map data ──────────────────────────────────────────────────────────────────

const LOCATION_COLORS: Record<MapLocation['type'], string> = {
  buyback: '#059669',
  repair: '#d97706',
  authorised: '#1d4ed8',
  recycle: '#0891b2',
};
const LOCATION_LABELS: Record<MapLocation['type'], string> = {
  buyback: 'Buy-back',
  repair: 'Repair',
  authorised: 'Authorised',
  recycle: 'Recycle',
};

const VIENNA_LOCATIONS: MapLocation[] = [
  { id: 'ar', name: 'Altstoff Recycling Austria',  address: 'Mariahilfer Str. 123, 1060 Wien',   type: 'recycle',    lat: 48.1968, lng: 16.3431, distance: '2.1 km', hours: 'Mon–Fri 8–18h' },
  { id: 'rb', name: 'Bosch eBike Buy-Back Wien',   address: 'Favoritenstr. 44, 1040 Wien',        type: 'buyback',    lat: 48.1885, lng: 16.3710, distance: '4.3 km', hours: 'Mon–Sat 9–17h' },
  { id: 'rs', name: 'Radservice Zentrum',           address: 'Währinger Str. 18, 1090 Wien',       type: 'repair',     lat: 48.2188, lng: 16.3560, distance: '5.8 km', hours: 'Tue–Sat 9–18h' },
  { id: 'kt', name: 'KTM Service Center Wien',      address: 'Erdberger Lände 26, 1030 Wien',      type: 'authorised', lat: 48.2020, lng: 16.3920, distance: '7.2 km', hours: 'Mon–Fri 8–17h' },
  { id: 'dk', name: 'Donaufeld Recycling',          address: 'Donaufeldgasse 82, 1210 Wien',       type: 'recycle',    lat: 48.2520, lng: 16.3950, distance: '9.4 km', hours: 'Mon–Fri 7–19h, Sat 8–14h' },
];

// ─── Bike screen ───────────────────────────────────────────────────────────────

type ComponentCard = { label: string; grade: Grade; model: string; sub: string; clickable?: boolean };

const BIKE_OVERALL_GRADE: Grade = 'B';

const COMPONENT_CARDS: ComponentCard[] = [
  { label: 'Frame',   grade: 'B', model: 'KTM Macina Sport Frame',    sub: 'Aluminium 6061 · size M' },
  { label: 'Battery', grade: 'C', model: 'Bosch PowerTube 625 Wh',   sub: 'EU Battery Passport', clickable: true },
  { label: 'Wheels',  grade: 'B', model: 'Schwalbe Smart Sam 29"',    sub: 'Active Line · tubeless ready' },
  { label: 'Motor',   grade: 'A', model: 'Bosch Performance Line CX', sub: '85 Nm · 4th gen' },
];

function BikeScreen({ data, onBatteryClick }: { data: RetailerPassportView; onBatteryClick: () => void }) {
  return (
    <div className="space-y-5">
      {/* Brand header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-base leading-none">v</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">veloport</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Digital Passport
        </div>
      </div>

      {/* Bike image card */}
      <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80"
            alt="KTM Macina Sport 720"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-5 py-4">
            <h1 className="text-lg font-bold text-white leading-tight">KTM Macina Sport 720</h1>
            <p className="text-slate-300 text-xs mt-0.5">EU Digital Product Passport</p>
          </div>
        </div>
        <div className="px-5 py-3 flex items-center gap-3 border-t border-slate-100/60">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Overall</div>
          <GradeBadge grade={BIKE_OVERALL_GRADE} size="sm" />
          <span className={`text-xs font-bold ${GRADE_TEXT[BIKE_OVERALL_GRADE]}`}>Grade {BIKE_OVERALL_GRADE}</span>
        </div>
      </div>

      {/* Component cards */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Components</p>
        <div className="grid grid-cols-2 gap-3">
          {COMPONENT_CARDS.map((card) => {
            const isBattery = card.clickable;
            const grade = card.grade;
            const model = isBattery ? data.batteryModel : card.model;
            return (
              <button
                key={card.label}
                onClick={isBattery ? onBatteryClick : undefined}
                className={`rounded-xl p-4 text-left transition-all border ${
                  isBattery
                    ? 'bg-gradient-to-br from-emerald-50/80 to-white border-emerald-200 hover:border-emerald-300 hover:shadow-sm'
                    : 'bg-white/70 border-slate-100 cursor-default'
                } backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between mb-3">
                  <GradeBadge grade={grade} />
                  {isBattery && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                      View
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{card.label}</p>
                <p className="text-xs font-semibold text-slate-900 leading-tight mt-0.5 truncate">{model}</p>
                {card.sub && <p className="text-[10px] text-slate-400 mt-0.5 truncate">{card.sub}</p>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Compliance footer */}
      <div className="rounded-xl bg-slate-900 text-white p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={16} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-white leading-tight">EU Battery Regulation 2023/1542</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Certified compliant · Issued by Veloport</p>
        </div>
      </div>
    </div>
  );
}

// ─── Battery screen ─────────────────────────────────────────────────────────────

function BatteryScreen({ data, onBack }: { data: RetailerPassportView; onBack: () => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeFlag, setActiveFlag] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('ar');

  const capacity = data.specs.find((s) => s.label === 'Capacity')?.value ?? 'N/A';
  const voltage = data.specs.find((s) => s.label === 'Voltage')?.value ?? 'N/A';
  const weight = data.specs.find((s) => s.label === 'Weight')?.value ?? 'N/A';

  const allCategories = [...data.categories, ...EXTRA_CATEGORIES].sort((a, b) => {
    const order: Grade[] = ['A', 'B', 'C', 'D', 'E'];
    return order.indexOf(a.grade as Grade) - order.indexOf(b.grade as Grade);
  });

  const activeLoc = VIENNA_LOCATIONS.find((l) => l.id === selectedLocation) ?? VIENNA_LOCATIONS[0];
  const otherLocs = VIENNA_LOCATIONS.filter((l) => l.id !== selectedLocation);

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center hover:bg-white transition-colors shadow-sm backdrop-blur-sm"
        >
          <ChevronLeft size={18} className="text-slate-600" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs leading-none">v</span>
          </div>
          <span className="text-sm font-semibold text-slate-700">Battery Passport</span>
        </div>
      </div>

      {/* Hero card */}
      <div className="rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
        <div className="bg-slate-900 px-5 pt-5 pb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">EU Battery Passport</p>
              <h2 className="text-xl font-bold text-white leading-tight">{data.batteryModel}</h2>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-[10px] font-semibold text-slate-300 bg-white/10 px-2 py-0.5 rounded-full">{capacity}</span>
                <span className="text-[10px] font-semibold text-slate-300 bg-white/10 px-2 py-0.5 rounded-full">{voltage}</span>
                <span className="text-[10px] font-semibold text-slate-300 bg-white/10 px-2 py-0.5 rounded-full">{weight}</span>
              </div>
            </div>
            <GradeBadge grade={data.overallGrade} size="lg" />
          </div>
        </div>
        <div className="bg-emerald-600 px-5 py-2.5 flex items-center gap-2">
          <CheckCircle2 size={13} className="text-emerald-200" />
          <span className="text-[11px] font-semibold text-emerald-100">EU 2023/1542 compliant · Bosch PowerTube Series</span>
        </div>
      </div>

      {/* ESG flags */}
      <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">ESG Profile</p>
        <div className="flex flex-wrap gap-1.5">
          {data.flags.map((flag, i) => {
            const isActive = activeFlag === i;
            return (
              <button
                key={flag.keyword}
                onClick={() => setActiveFlag(isActive ? null : i)}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border transition-all ${
                  isActive
                    ? flag.positive
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-orange-600 border-orange-600 text-white'
                    : flag.positive
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-orange-50 border-orange-200 text-orange-800'
                }`}
              >
                {flag.positive
                  ? <CheckCircle2 size={10} className={isActive ? 'text-emerald-200' : 'text-emerald-500'} />
                  : <XCircle size={10} className={isActive ? 'text-orange-200' : 'text-orange-500'} />
                }
                {flag.keyword}
              </button>
            );
          })}
        </div>
        {activeFlag !== null && (
          <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${data.flags[activeFlag].positive ? 'text-emerald-600' : 'text-orange-600'}`}>
              {data.flags[activeFlag].positive ? 'Verified' : 'Concern'}
            </p>
            <p className="text-sm text-slate-700">{data.flags[activeFlag].detail}</p>
          </div>
        )}
      </div>

      {/* Recycling network */}
      <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="px-4 pt-4 pb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Vienna Recycling Network</p>

          {/* Outcome chips */}
          <div className="flex gap-2 mb-4">
            {[
              { label: 'Sell Back', value: '3', sub: 'buy-back', color: '#059669' },
              { label: 'Repair', value: '8', sub: 'workshops', color: '#d97706' },
              { label: 'Recycle', value: '12', sub: 'drop-offs', color: '#0891b2' },
            ].map((o) => (
              <div key={o.label} className="flex-1 bg-white rounded-xl border border-slate-100 p-3 text-center">
                <p className="text-xl font-black" style={{ color: o.color }}>{o.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 leading-tight mt-0.5">{o.label}</p>
                <p className="text-[10px] text-slate-400">{o.sub}</p>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-3">
            {(Object.entries(LOCATION_COLORS) as [MapLocation['type'], string][]).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-[10px] font-semibold text-slate-500">{LOCATION_LABELS[type]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <RecyclingMap locations={VIENNA_LOCATIONS} selectedId={selectedLocation} onSelect={setSelectedLocation} />

        {/* Selected location */}
        <div className="px-4 pt-3 pb-4">
          <div className="rounded-xl bg-white border border-slate-100 p-4">
            <div className="flex items-start gap-3">
              <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: LOCATION_COLORS[activeLoc.type] }} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: LOCATION_COLORS[activeLoc.type] }}>
                  {LOCATION_LABELS[activeLoc.type]}
                </p>
                <p className="text-sm font-semibold text-slate-900">{activeLoc.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{activeLoc.address}</p>
                <div className="flex gap-4 mt-2">
                  <span className="text-xs text-slate-400">{activeLoc.distance}</span>
                  <span className="text-xs text-slate-400">{activeLoc.hours}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {otherLocs.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc.id)}
                className="bg-white rounded-xl border border-slate-100 p-3 text-left hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: LOCATION_COLORS[loc.type] }} />
                  <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: LOCATION_COLORS[loc.type] }}>
                    {LOCATION_LABELS[loc.type]}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-800 leading-tight">{loc.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{loc.distance}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="px-4 pt-4 pb-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Category Breakdown</p>
        </div>
        <div className="divide-y divide-slate-100">
          {allCategories.map((cat) => {
            const isOpen = expandedId === cat.id;
            return (
              <div key={cat.id}>
                <button
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/40 transition-colors"
                  onClick={() => setExpandedId(isOpen ? null : cat.id)}
                >
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${GRADE_BORDER[cat.grade as Grade]}`}
                    style={{ color: LOCATION_COLORS['recycle'] }}>
                    <span className="text-slate-400">{CAT_ICONS[cat.id] ?? <span className="text-sm">·</span>}</span>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{cat.title}</p>
                    <p className="text-xs text-slate-400 truncate">{cat.summary}</p>
                  </div>
                  <GradeBadge grade={cat.grade as Grade} size="md" />
                  {isOpen
                    ? <ChevronUp size={14} className="text-slate-300 flex-shrink-0" />
                    : <ChevronDown size={14} className="text-slate-300 flex-shrink-0" />}
                </button>
                {isOpen && (
                  <div className="bg-slate-50/60 px-4 pt-3 pb-4 flex flex-col gap-3 border-t border-slate-100">
                    {cat.points.map((point) => (
                      <div key={point.label} className="flex items-center gap-3">
                        <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${GRADE_DOT[point.grade as Grade]}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{point.label}</p>
                          <p className="text-xs text-slate-700 mt-0.5">{point.value}</p>
                        </div>
                        <GradeBadge grade={point.grade as Grade} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="h-2" />
      </div>

      {/* Footer */}
      <div className="rounded-2xl bg-slate-900 text-white p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Why this passport?</p>
        <p className="text-sm font-semibold text-white leading-snug mb-3">
          EU Battery Regulation 2023/1542 requires full transparency on every battery sold in Europe.
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">
          From February 2027, every e-bike battery must carry a Digital Product Passport — disclosing carbon footprint, recycled content, supply chain origin and end-of-life data.
        </p>
        <div className="border-t border-slate-800 mt-4 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs leading-none">v</span>
            </div>
            <span className="text-xs font-semibold text-slate-300">veloport</span>
          </div>
          <span className="text-[10px] text-slate-500">Passport v1.0 · 2026</span>
        </div>
      </div>
    </div>
  );
}

// ─── Root export ────────────────────────────────────────────────────────────────

export default function PassportView({ data }: { data: RetailerPassportView }) {
  const [screen, setScreen] = useState<'bike' | 'battery'>('bike');

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden selection:bg-emerald-100">
      <div className="fixed top-0 left-0 -z-10 h-full w-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] h-[40%] w-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>
      <div className="max-w-md mx-auto px-4 py-8">
        {screen === 'bike'
          ? <BikeScreen data={data} onBatteryClick={() => setScreen('battery')} />
          : <BatteryScreen data={data} onBack={() => setScreen('bike')} />}
      </div>
    </div>
  );
}

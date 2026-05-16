'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  ChevronLeft, ChevronDown, ChevronUp, ArrowRight,
  Leaf, RefreshCw, Zap, ShieldCheck, Globe,
  Truck, FlaskConical, Clock, Recycle, Wrench,
} from 'lucide-react';
import { RetailerPassportView, Grade } from '@/lib/retailer/buildRetailerPassport';
import type { MapLocation } from './RecyclingMap';

const RecyclingMap = dynamic(() => import('./RecyclingMap'), { ssr: false });

// ─── Grade pill ────────────────────────────────────────────────────────────────

const GRADE_COLORS: Record<Grade, string> = {
  A: '#166534', B: '#65a30d', C: '#ca8a04', D: '#ea580c', E: '#991b1b',
};

function GradePill({ grade, size = 'sm' }: { grade: Grade; size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'lg' ? 56 : size === 'md' ? 36 : 28;
  const fontSize = size === 'lg' ? 28 : size === 'md' ? 18 : 14;
  const radius = size === 'lg' ? 14 : size === 'md' ? 10 : 8;
  return (
    <div style={{ backgroundColor: GRADE_COLORS[grade], width: dim, height: dim, fontSize, borderRadius: radius, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', flexShrink: 0 }}>
      {grade}
    </div>
  );
}

// ─── Category icons ────────────────────────────────────────────────────────────

const CAT_ICONS: Record<string, React.ReactNode> = {
  carbon: <Leaf size={16} className="text-slate-500" />,
  recycled: <RefreshCw size={16} className="text-slate-500" />,
  performance: <Zap size={16} className="text-slate-500" />,
  compliance: <ShieldCheck size={16} className="text-slate-500" />,
  origin: <Globe size={16} className="text-slate-500" />,
  supplychain: <Truck size={16} className="text-slate-500" />,
  hazardous: <FlaskConical size={16} className="text-slate-500" />,
  durability: <Clock size={16} className="text-slate-500" />,
  endoflife: <Recycle size={16} className="text-slate-500" />,
  repair: <Wrench size={16} className="text-slate-500" />,
};

// ─── Mocked extra categories ───────────────────────────────────────────────────

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
      { label: 'Conflict Area Risk', value: 'Low — third-party verified', grade: 'B' },
      { label: 'Supplier Disclosure', value: 'Robert Bosch GmbH — Tier 1', grade: 'A' },
    ],
  },
  {
    id: 'hazardous',
    title: 'Hazardous Substances',
    grade: 'B',
    summary: 'LiPF₆ declared, safety data provided',
    points: [
      { label: 'Electrolyte', value: 'Lithium hexafluorophosphate (LiPF₆)', grade: 'C' },
      { label: 'Cathode', value: 'NMC622 — no cadmium or mercury', grade: 'A' },
      { label: 'Fire Agent', value: 'Water — non-toxic suppression', grade: 'A' },
      { label: 'REACH Compliance', value: 'Confirmed — no SVHC above threshold', grade: 'A' },
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
      { label: 'Waste Classification', value: 'Hazardous — separate collection required', grade: 'C' },
    ],
  },
  {
    id: 'repair',
    title: 'Repairability',
    grade: 'C',
    summary: 'Disassembly instructions available',
    points: [
      { label: 'Disassembly Guide', value: 'Available — 12-step sequence', grade: 'B' },
      { label: 'Required Tools', value: 'T20 Torx, plastic pry tool', grade: 'A' },
      { label: 'Cell Replacement', value: 'Workshop only — not user-serviceable', grade: 'D' },
      { label: 'Spare Parts', value: 'Available via Bosch eBike Systems', grade: 'B' },
    ],
  },
];

// ─── Vienna map data ───────────────────────────────────────────────────────────

const LOCATION_COLORS: Record<MapLocation['type'], string> = {
  buyback: '#166534',
  repair: '#ca8a04',
  authorised: '#0c4a6e',
  recycle: '#1e40af',
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

const OUTCOMES = [
  { label: 'Sell Back', value: '3', sub: 'buy-back points', color: '#166534' },
  { label: 'Repair', value: '8', sub: 'workshops', color: '#ca8a04' },
  { label: 'Recycle', value: '12', sub: 'drop-offs', color: '#1e40af' },
];


// ─── Bike screen ───────────────────────────────────────────────────────────────

type ComponentCard = { label: string; grade: Grade; model: string; sub: string };

const COMPONENT_CARDS: ComponentCard[] = [
  { label: 'Frame',   grade: 'B', model: 'KTM Macina Sport Frame',    sub: 'Aluminium 6061 · size M' },
  { label: 'Battery', grade: 'C', model: 'Bosch PowerTube 625 Wh',   sub: '' },
  { label: 'Wheels',  grade: 'B', model: 'Schwalbe Smart Sam 29"',    sub: 'Active Line · tubeless ready' },
  { label: 'Motor',   grade: 'A', model: 'Bosch Performance Line CX', sub: '85 Nm · 4th gen' },
];

function BikeScreen({ data, onBatteryClick }: { data: RetailerPassportView; onBatteryClick: () => void }) {
  return (
    <div>
      <header className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
          <span className="text-white font-bold text-xl leading-none">v</span>
        </div>
        <span className="text-2xl font-semibold tracking-tight text-slate-900">veloport</span>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80"
          alt="KTM Macina Sport 720"
          className="w-full h-56 object-cover"
        />
        <div className="px-5 py-4">
          <h1 className="text-xl font-bold text-slate-900">KTM Macina Sport 720</h1>
          <p className="text-slate-500 text-sm">Digital Product Passport</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {COMPONENT_CARDS.map((card) => {
          const isBattery = card.label === 'Battery';
          const grade = isBattery ? data.overallGrade : card.grade;
          const model = isBattery ? data.batteryModel : card.model;
          return (
            <button
              key={card.label}
              onClick={isBattery ? onBatteryClick : undefined}
              className={`rounded-xl p-4 text-left flex flex-col gap-2 transition-colors border-2 ${
                isBattery
                  ? 'bg-white border-emerald-200 hover:border-emerald-300'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <GradePill grade={grade} />
                <ArrowRight size={16} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{card.label}</p>
                <p className="text-sm font-semibold text-slate-900 truncate">{model}</p>
                {card.sub && <p className="text-xs text-slate-400 truncate">{card.sub}</p>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Battery screen ────────────────────────────────────────────────────────────

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
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft size={18} className="text-slate-600" />
        </button>
        <h1 className="text-lg font-semibold text-slate-900">Battery Passport</h1>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Battery passport</p>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-900 leading-tight">{data.batteryModel}</h2>
            <p className="text-xs text-slate-500 mt-2">{capacity} · {voltage} · {weight}</p>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              NMC622 lithium-ion battery pack designed for e-bike (pedelec) applications.
              Cradle-to-gate carbon footprint declared under ISO 14067.
              Manufactured in Blaichach, Bavaria, Germany.
            </p>
          </div>
          <GradePill grade={data.overallGrade} size="lg" />
        </div>
      </div>

      {/* ESG flags */}
      <section>
        <h2 className="text-sm font-bold text-slate-900 mb-3">ESG Profile</h2>
        <div className="flex flex-wrap gap-2">
          {data.flags.map((flag, i) => {
            const isActive = activeFlag === i;
            return (
              <button
                key={flag.keyword}
                onClick={() => setActiveFlag(isActive ? null : i)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-all ${
                  isActive
                    ? flag.positive
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'bg-red-600 border-red-600 text-white'
                    : flag.positive
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${flag.positive ? 'bg-green-400' : 'bg-red-400'} ${isActive ? 'opacity-70' : ''}`} />
                {flag.keyword}
              </button>
            );
          })}
        </div>
        {activeFlag !== null && (
          <div className="mt-3 rounded-xl bg-white border border-slate-200 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              {data.flags[activeFlag].positive ? '✓ Verified' : '⚠ Concern'}
            </p>
            <p className="text-sm text-slate-700">{data.flags[activeFlag].detail}</p>
          </div>
        )}
      </section>

      {/* Recycling network */}
      <section>
        <h2 className="text-sm font-bold text-slate-900 mb-3">Vienna Recycling Network</h2>

        {/* 3-up outcome cards */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {OUTCOMES.map((o) => (
            <div key={o.label} className="bg-white rounded-xl border border-slate-200 p-3 text-center">
              <p className="text-2xl font-bold" style={{ color: o.color }}>{o.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mt-0.5">{o.label}</p>
              <p className="text-[10px] text-slate-400">{o.sub}</p>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-3">
          {(Object.entries(LOCATION_COLORS) as [MapLocation['type'], string][]).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-[10px] font-medium text-slate-500">{LOCATION_LABELS[type]}</span>
            </div>
          ))}
        </div>

        {/* Real map */}
        <RecyclingMap locations={VIENNA_LOCATIONS} selectedId={selectedLocation} onSelect={setSelectedLocation} />

        {/* Selected location detail */}
        <div className="mt-3 bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: LOCATION_COLORS[activeLoc.type] }} />
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

        {/* Other location tiles */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {otherLocs.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedLocation(loc.id)}
              className="bg-white rounded-xl border border-slate-200 p-3 text-left hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: LOCATION_COLORS[loc.type] }} />
                <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: LOCATION_COLORS[loc.type] }}>
                  {LOCATION_LABELS[loc.type]}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-800 leading-tight">{loc.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{loc.distance}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Deep dive */}
      <section>
        <h2 className="text-sm font-bold text-slate-900 mb-3">Category Breakdown</h2>
        <div className="flex flex-col gap-2">
          {allCategories.map((cat) => {
            const isOpen = expandedId === cat.id;
            return (
              <div key={cat.id} className="rounded-xl bg-white border border-slate-200">
                <button
                  className="w-full px-4 py-3 flex items-center gap-3"
                  onClick={() => setExpandedId(isOpen ? null : cat.id)}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                    {CAT_ICONS[cat.id] ?? <span className="text-slate-400 text-sm">•</span>}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{cat.title}</p>
                    <p className="text-xs text-slate-500 truncate">{cat.summary}</p>
                  </div>
                  <GradePill grade={cat.grade as Grade} size="md" />
                  {isOpen
                    ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" />
                    : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 px-4 pt-3 pb-4 flex flex-col gap-3">
                    {cat.points.map((point) => (
                      <div key={point.label} className="flex items-center gap-3">
                        <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: GRADE_COLORS[point.grade as Grade] }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{point.label}</p>
                          <p className="text-xs text-slate-700 mt-0.5">{point.value}</p>
                        </div>
                        <GradePill grade={point.grade as Grade} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <section className="rounded-2xl bg-slate-900 text-white p-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Why this passport?</p>
        <h3 className="text-lg font-bold leading-snug mb-3">
          EU Battery Regulation 2023/1542 requires full transparency on every battery sold in Europe.
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          From February 2027, every e-bike battery must carry a Digital Product Passport — disclosing carbon footprint, recycled content, supply chain origin and end-of-life data. This passport is generated automatically when the manufacturer ERP syncs with Veloport.
        </p>
        <div className="border-t border-slate-700 mt-5 pt-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm leading-none">v</span>
            </div>
            <span className="text-sm font-semibold text-slate-300">veloport</span>
          </div>
          <span className="text-[10px] text-slate-500">Passport v1.0 · 2026</span>
        </div>
      </section>
    </div>
  );
}

// ─── Root export ───────────────────────────────────────────────────────────────

export default function PassportView({ data }: { data: RetailerPassportView }) {
  const [screen, setScreen] = useState<'bike' | 'battery'>('bike');

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-md mx-auto px-5 py-8">
        {screen === 'bike'
          ? <BikeScreen data={data} onBatteryClick={() => setScreen('battery')} />
          : <BatteryScreen data={data} onBack={() => setScreen('bike')} />}
      </div>
    </div>
  );
}

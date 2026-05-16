'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp, ArrowRight, Leaf, RefreshCw, Zap, ShieldCheck, Globe } from 'lucide-react';
import { RetailerPassportView, Grade } from '@/lib/retailer/buildRetailerPassport';

function GradePill({ grade, size = 'sm' }: { grade: Grade; size?: 'sm' | 'lg' }) {
  const bgColors: Record<Grade, string> = {
    A: '#166534',
    B: '#65a30d',
    C: '#ca8a04',
    D: '#ea580c',
    E: '#991b1b',
  };

  const dim = size === 'lg' ? 56 : 28;
  const fontSize = size === 'lg' ? 28 : 14;

  return (
    <div
      style={{
        backgroundColor: bgColors[grade],
        width: dim,
        height: dim,
        fontSize,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        flexShrink: 0,
      }}
    >
      {grade}
    </div>
  );
}

const categoryIcons: Record<string, React.ReactNode> = {
  carbon: <Leaf size={16} className="text-slate-500" />,
  recycled: <RefreshCw size={16} className="text-slate-500" />,
  performance: <Zap size={16} className="text-slate-500" />,
  compliance: <ShieldCheck size={16} className="text-slate-500" />,
  origin: <Globe size={16} className="text-slate-500" />,
};

function BikeScreen({ data, onBatteryClick }: { data: RetailerPassportView; onBatteryClick: () => void }) {
  const cards = ['Frame', 'Battery', 'Wheels', 'Motor'] as const;

  return (
    <div>
      <header className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <span className="text-white font-bold text-xl leading-none">v</span>
        </div>
        <span className="text-2xl font-semibold tracking-tight text-slate-900">veloport</span>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80"
          alt="KTM Macina Sport 720"
          className="w-full h-56 object-cover rounded-t-2xl"
        />
        <div className="px-5 py-4">
          <h1 className="text-xl font-bold text-slate-900">KTM Macina Sport 720</h1>
          <p className="text-slate-500 text-sm">Digital Product Passport</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {cards.map((label) => {
          if (label === 'Battery') {
            return (
              <button
                key={label}
                onClick={onBatteryClick}
                className="bg-white border-2 border-emerald-200 rounded-xl p-4 text-left flex flex-col gap-2 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <GradePill grade={data.overallGrade} />
                  <ArrowRight size={16} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-500 truncate">{data.batteryModel}</p>
                </div>
              </button>
            );
          }
          return (
            <div
              key={label}
              className="bg-white/60 border border-slate-200 rounded-xl p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center">
                  <span className="text-slate-400 font-bold text-sm leading-none">?</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
                  Coming soon
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BatteryScreen({ data, onBack }: { data: RetailerPassportView; onBack: () => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const capacity = data.specs.find((s) => s.label === 'Capacity')?.value ?? 'N/A';
  const voltage = data.specs.find((s) => s.label === 'Voltage')?.value ?? 'N/A';
  const weight = data.specs.find((s) => s.label === 'Weight')?.value ?? 'N/A';

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft size={18} className="text-slate-600" />
        </button>
        <h1 className="text-lg font-semibold text-slate-900">Battery Passport</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Battery passport</p>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-900 leading-tight">{data.batteryModel}</h2>
            <p className="text-xs text-slate-500 mt-2">{capacity} · {voltage} · {weight}</p>
          </div>
          <GradePill grade={data.overallGrade} size="lg" />
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">ESG Profile</h2>
        <div className="flex flex-wrap gap-2">
          {data.flags.map((flag) => (
            <span
              key={flag.keyword}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                flag.positive
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  flag.positive ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              {flag.keyword}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Category Breakdown</h2>
        <div className="flex flex-col gap-2">
          {data.categories.map((cat) => {
            const isOpen = expandedId === cat.id;
            return (
              <div key={cat.id} className="rounded-xl bg-white border border-slate-200">
                <button
                  className="w-full px-4 py-3 flex items-center gap-3"
                  onClick={() => setExpandedId(isOpen ? null : cat.id)}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    {categoryIcons[cat.id] ?? <span className="text-slate-400 text-sm">•</span>}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{cat.title}</p>
                    <p className="text-xs text-slate-500 truncate">{cat.summary}</p>
                  </div>
                  <GradePill grade={cat.grade} />
                  {isOpen ? (
                    <ChevronUp size={16} className="text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 px-4 pt-3 pb-4">
                    <div className="flex flex-col gap-2">
                      {cat.points.map((point) => (
                        <div key={point.label} className="flex items-center gap-2">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 flex-1">
                            {point.label}
                          </p>
                          <p className="text-xs text-slate-700 text-right">{point.value}</p>
                          <GradePill grade={point.grade} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PassportView({ data }: { data: RetailerPassportView }) {
  const [screen, setScreen] = useState<'bike' | 'battery'>('bike');

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-md mx-auto px-5 py-8">
        {screen === 'bike' ? (
          <BikeScreen data={data} onBatteryClick={() => setScreen('battery')} />
        ) : (
          <BatteryScreen data={data} onBack={() => setScreen('bike')} />
        )}
      </div>
    </div>
  );
}

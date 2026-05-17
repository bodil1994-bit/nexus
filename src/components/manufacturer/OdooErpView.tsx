import Link from 'next/link';
import {
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  Settings,
  Grid3x3,
  Package,
  ShoppingCart,
  Factory,
  ClipboardList,
  BarChart2,
  Printer,
  CheckCircle2,
  Truck,
  FileText,
  MessageSquare,
  Phone,
} from 'lucide-react';

const MOCK = {
  orderNumber: 'ORD-KTM-BSH-2026',
  batchNumber: 'BAT-BSH-PT625-002',
  passportReferenceId: 'BAT-BSH-PT625-2026-008314',
  syncTimestamp: '2026-05-16T18:18:00.000Z',
};

const syncDate = new Date(MOCK.syncTimestamp);
const syncDateStr = syncDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/') + ' ' + syncDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

const APP_ICONS = [
  { icon: ShoppingCart, label: 'Purchase' },
  { icon: Package, label: 'Inventory', active: true },
  { icon: Factory, label: 'Manufacturing' },
  { icon: ClipboardList, label: 'Accounting' },
  { icon: BarChart2, label: 'Reporting' },
];

const SMART_BUTTONS = [
  { label: 'Valuation', value: '1', icon: BarChart2 },
  { label: 'Product Moves', value: '1', icon: Package },
  { label: 'Lot / SN', value: '1', icon: ClipboardList },
];

const STAGES = ['Ready', 'Waiting', 'In Progress', 'Done'];

const TAB_COLS = 'grid-cols-[2fr_1fr_1fr_1fr_1.6fr]';

export function OdooErpView() {
  return (
    <div className="flex h-screen overflow-hidden font-sans text-[13px] text-[#1f1f1f] bg-[#f0ede8]">
      {/* Sidebar */}
      <aside className="w-12 flex flex-col items-center bg-[#1c1c2b] py-3 gap-1 flex-shrink-0">
        <div className="w-8 h-8 rounded bg-[#714B67] flex items-center justify-center mb-2">
          <span className="text-white font-black text-sm leading-none">O</span>
        </div>
        <button className="w-9 h-9 rounded flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-colors">
          <Grid3x3 size={15} />
        </button>
        <div className="w-7 h-px bg-white/10 my-1" />
        {APP_ICONS.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            title={label}
            className={`w-9 h-9 rounded flex items-center justify-center transition-colors ${
              active ? 'bg-white/15 text-white' : 'text-white/40 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon size={15} />
          </button>
        ))}
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top navbar */}
        <nav className="h-10 bg-[#714B67] flex items-center px-3 gap-2 flex-shrink-0">
          <button className="text-white/70 hover:text-white transition-colors">
            <ChevronRight size={14} />
          </button>
          <div className="flex-1 flex items-center gap-2 bg-white/15 rounded h-6 px-3 max-w-md mx-auto">
            <Search size={11} className="text-white/60" />
            <span className="text-white/50 text-[11px]">Search...</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <button className="w-7 h-7 rounded flex items-center justify-center text-white/70 hover:bg-white/15 hover:text-white transition-colors">
              <Bell size={13} />
            </button>
            <button className="w-7 h-7 rounded flex items-center justify-center text-white/70 hover:bg-white/15 hover:text-white transition-colors">
              <MessageSquare size={13} />
            </button>
            <button className="w-7 h-7 rounded flex items-center justify-center text-white/70 hover:bg-white/15 hover:text-white transition-colors">
              <Settings size={13} />
            </button>
            <div className="w-7 h-7 rounded-full bg-[#2c1f26] border border-white/20 flex items-center justify-center text-white text-[10px] font-bold">
              KT
            </div>
          </div>
        </nav>

        {/* Content scroll area */}
        <div className="flex-1 overflow-auto min-h-0">
          {/* App menu bar */}
          <div className="bg-white border-b border-[#e0dbd6] px-4 py-1.5 flex items-center gap-4">
            <span className="text-[#714B67] font-semibold text-[13px]">Inventory</span>
            {['Operations', 'Products', 'Configuration', 'Reporting'].map((item) => (
              <button
                key={item}
                className="text-[#555] hover:text-[#1f1f1f] text-xs font-medium flex items-center gap-0.5 transition-colors"
              >
                {item}
                {item === 'Operations' && <ChevronDown size={10} />}
              </button>
            ))}
          </div>

          {/* Control panel */}
          <div className="bg-white border-b border-[#e0dbd6] px-4 py-2.5">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1 text-xs text-[#666]">
                <span className="text-[#714B67] hover:underline cursor-pointer font-medium">Receipts</span>
                <ChevronRight size={10} />
                <span className="font-semibold text-[#1f1f1f]">{MOCK.orderNumber}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="flex items-center gap-1 px-2.5 py-1 rounded border border-[#d0c9c4] bg-white text-[#1f1f1f] text-xs font-medium hover:bg-[#f5f0eb] transition-colors">
                  <Printer size={11} />
                  Print
                </button>
                <button className="flex items-center gap-1 px-2.5 py-1 rounded border border-[#d0c9c4] bg-white text-[#1f1f1f] text-xs font-medium hover:bg-[#f5f0eb] transition-colors">
                  Action
                  <ChevronDown size={10} />
                </button>
                <button className="px-3 py-1 rounded border border-[#714B67] bg-[#714B67] text-white text-xs font-medium hover:bg-[#5d3e57] transition-colors">
                  Edit
                </button>
              </div>
            </div>

            {/* Status bar */}
            <div className="flex items-center">
              {STAGES.map((stage, i) => {
                const isActive = stage === 'Done';
                const isPast = i < 3;
                return (
                  <button
                    key={stage}
                    className={`px-5 py-1 text-xs font-medium transition-colors border-b-2 ${
                      isActive
                        ? 'border-b-[#714B67] text-[#714B67]'
                        : isPast
                        ? 'border-b-transparent text-[#999]'
                        : 'border-b-transparent text-[#ccc]'
                    }`}
                  >
                    {stage}
                  </button>
                );
              })}
              <div className="ml-auto flex items-center gap-1 text-[11px] text-[#666]">
                <CheckCircle2 size={12} className="text-[#26a65b]" />
                <span className="font-medium">Validated</span>
              </div>
            </div>
          </div>

          {/* Form area */}
          <div className="p-4 space-y-4 max-w-5xl mx-auto">
            {/* Smart buttons */}
            <div className="flex gap-2">
              {SMART_BUTTONS.map(({ label, value, icon: Icon }) => (
                <button
                  key={label}
                  className="flex flex-col items-center px-5 py-2 rounded border border-[#e0dbd6] bg-white hover:bg-[#f5f0eb] transition-colors gap-0.5"
                >
                  <div className="flex items-center gap-1">
                    <Icon size={12} className="text-[#714B67]" />
                    <span className="text-sm font-bold text-[#714B67]">{value}</span>
                  </div>
                  <span className="text-[10px] text-[#666]">{label}</span>
                </button>
              ))}
            </div>

            {/* Main form card */}
            <div className="bg-white rounded border border-[#e0dbd6]">
              {/* Card header */}
              <div className="px-5 py-3.5 border-b border-[#f0ede8] flex items-center gap-2.5">
                <Truck size={16} className="text-[#714B67]" />
                <span className="font-semibold text-sm">{MOCK.orderNumber}</span>
                <span className="ml-1 px-2 py-0.5 rounded-full bg-[#26a65b]/10 text-[#26a65b] text-[10px] font-bold uppercase tracking-wide">
                  Done
                </span>
                <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-100">
                  ERP Synced
                </span>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-2 gap-x-10 px-5 py-4">
                {/* Left */}
                <div className="space-y-3">
                  {[
                    { label: 'Receipt Number', value: MOCK.orderNumber, link: false, purple: true },
                    { label: 'Vendor', value: 'Bosch eBike Systems GmbH', link: false, purple: true },
                    { label: 'Source Document', value: 'PO-2026-0042', link: false, purple: false },
                    { label: 'Scheduled Date', value: syncDateStr, link: false, purple: false },
                    { label: 'Effective Date', value: syncDateStr, link: false, purple: false },
                  ].map(({ label, value, purple }) => (
                    <div key={label} className="grid grid-cols-[140px_1fr] gap-2 items-start">
                      <span className="text-[#888] text-xs pt-0.5">{label}</span>
                      <span className={`text-xs font-medium ${purple ? 'text-[#714B67] cursor-pointer hover:underline' : ''}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Right */}
                <div className="space-y-3">
                  <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
                    <span className="text-[#888] text-xs pt-0.5">Operation Type</span>
                    <span className="text-xs font-medium text-[#714B67] cursor-pointer hover:underline">Receipts</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
                    <span className="text-[#888] text-xs pt-0.5">Company</span>
                    <span className="text-xs font-medium">KTM Fahrrad GmbH</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
                    <span className="text-[#888] text-xs pt-0.5">Responsible</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[#714B67]/20 flex items-center justify-center text-[#714B67] text-[8px] font-bold">
                        KT
                      </div>
                      <span className="text-xs font-medium">KTM Procurement</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
                    <span className="text-[#888] text-xs pt-0.5">ERP Sync Source</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-[8px] leading-none">v</span>
                      </div>
                      <span className="text-xs font-medium text-emerald-700">Veloport DPP Gateway</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
                    <span className="text-[#888] text-xs pt-0.5">Synced At</span>
                    <span className="text-xs font-medium">{syncDateStr}</span>
                  </div>
                </div>
              </div>

              {/* Operations tab */}
              <div className="border-t border-[#f0ede8]">
                <div className="flex border-b border-[#e0dbd6] px-5">
                  {['Operations', 'Additional Info', 'Note'].map((tab, i) => (
                    <button
                      key={tab}
                      className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
                        i === 0
                          ? 'border-b-[#714B67] text-[#714B67]'
                          : 'border-b-transparent text-[#666] hover:text-[#1f1f1f]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="px-5 py-3">
                  <div className={`grid ${TAB_COLS} gap-3 text-[10px] font-semibold text-[#888] uppercase tracking-wide pb-2 border-b border-[#f0ede8]`}>
                    <span>Product</span>
                    <span>Lot / Serial Number</span>
                    <span>Demand</span>
                    <span>Done</span>
                    <span>Battery Passport</span>
                  </div>
                  <div className={`grid ${TAB_COLS} gap-3 items-center py-3 text-xs`}>
                    <div>
                      <p className="text-[#714B67] font-medium cursor-pointer hover:underline">Bosch PowerTube 625Wh</p>
                      <p className="text-[10px] text-[#888] mt-0.5">PT625 · Li-Ion · 36V · 625 Wh</p>
                    </div>
                    <span className="text-[#714B67] font-medium cursor-pointer hover:underline">{MOCK.batchNumber}</span>
                    <span>1.00 Units</span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={11} className="text-[#26a65b]" />
                      1.00
                    </span>
                    <Link
                      href={`/passport/${MOCK.passportReferenceId}`}
                      className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 group min-w-0"
                    >
                      <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-[7px] leading-none">v</span>
                      </div>
                      <span className="underline underline-offset-2 truncate text-[11px] font-medium">
                        {MOCK.passportReferenceId}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Chatter */}
            <div className="bg-white rounded border border-[#e0dbd6]">
              <div className="px-5 py-3 border-b border-[#f0ede8] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="text-xs font-medium text-[#714B67] flex items-center gap-1.5 hover:text-[#5d3e57] transition-colors">
                    <MessageSquare size={12} />
                    Send message
                  </button>
                  <button className="text-xs text-[#666] flex items-center gap-1.5 hover:text-[#1f1f1f] transition-colors">
                    <FileText size={12} />
                    Log note
                  </button>
                  <button className="text-xs text-[#666] flex items-center gap-1.5 hover:text-[#1f1f1f] transition-colors">
                    <Phone size={12} />
                    Schedule activity
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#888]">
                  <span>Followers</span>
                  <div className="flex -space-x-1">
                    <div className="w-5 h-5 rounded-full bg-[#714B67] border-2 border-white flex items-center justify-center text-white text-[8px] font-bold">
                      KT
                    </div>
                    <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[8px] font-bold">
                      V
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 space-y-5">
                {/* Veloport sync log */}
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white font-bold text-[10px]">v</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-semibold text-emerald-700">Veloport DPP Gateway</span>
                      <span className="text-[10px] text-[#888]">16 May 2026, 18:18</span>
                    </div>
                    <div className="mt-1.5 p-3 rounded bg-[#f0faf4] border border-emerald-100 text-xs">
                      <p className="font-semibold text-emerald-800 mb-1.5">ERP Sync Completed</p>
                      <p className="text-[#555] mb-2">
                        Battery passport data synced automatically from supplier submission.
                      </p>
                      <div className="space-y-1 text-[11px]">
                        <p>
                          <span className="text-[#888]">Batch:</span>{' '}
                          <span className="font-medium">{MOCK.batchNumber}</span>
                        </p>
                        <p>
                          <span className="text-[#888]">Passport:</span>{' '}
                          <Link
                            href={`/passport/${MOCK.passportReferenceId}`}
                            className="text-emerald-700 underline hover:text-emerald-900 font-medium"
                          >
                            {MOCK.passportReferenceId}
                          </Link>
                        </p>
                        <p>
                          <span className="text-[#888]">Readiness:</span>{' '}
                          <span className="font-medium text-[#26a65b]">100% · All fields validated</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* KTM system log */}
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#714B67] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white font-bold text-[9px]">KT</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-semibold">KTM Procurement System</span>
                      <span className="text-[10px] text-[#888]">16 May 2026, 18:18</span>
                    </div>
                    <p className="mt-1 text-xs text-[#555] leading-relaxed">
                      Receipt <span className="font-medium">{MOCK.orderNumber}</span> validated and marked as Done. Stock move recorded for 1 unit of Bosch PowerTube 625Wh · Lot{' '}
                      <span className="font-medium">{MOCK.batchNumber}</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

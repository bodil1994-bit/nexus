import { submitBatch } from './actions';
import { Upload, FileText, ChevronRight } from 'lucide-react';

export default function SupplierUploadPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden selection:bg-emerald-100">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl py-12 px-6 flex flex-col items-center">
        <div className="w-full max-w-xl">
          <header className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-4">
              <Upload size={12} />
              <span>Supplier Gateway</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-3">Submit Batch Passport</h1>
            <p className="text-slate-500 text-lg">
              Securely transmit battery passport data for <br />
              <span className="text-slate-900 font-semibold">Manufacturer ERP integration.</span>
            </p>
          </header>

          <div className="rounded-2xl border border-white bg-white/60 p-8 shadow-2xl backdrop-blur-xl relative group">
            <div className="absolute -inset-px bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <form action={submitBatch} encType="multipart/form-data" className="space-y-6 relative">
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
                    <option value="ktm">KTM Sportmotorcycle GmbH</option>
                    <option value="fisher">Fisher E-Bikes</option>
                    <option value="giro">Giro Helmets & Accessories</option>
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
                    required
                    placeholder="ORD-12345"
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
                    required
                    placeholder="BAT-990"
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
                    className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-4 py-8 text-sm text-slate-400 file:hidden cursor-pointer hover:bg-white transition-all text-center shadow-sm"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none py-8">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-3 text-emerald-600 group-hover/file:scale-110 transition-transform shadow-sm">
                      <FileText size={20} />
                    </div>
                    <p className="text-sm font-medium text-slate-600">Drop passport files or click to browse</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">CSV, JSON, XLSX, PDF, TXT up to 10MB</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full group relative flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 hover:shadow-emerald-500/30 transition-all"
              >
                <span>Initialize AI Extraction</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

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

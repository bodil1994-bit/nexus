import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Zap, BarChart3, User, ChevronDown } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 overflow-hidden selection:bg-emerald-100">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl leading-none">v</span>
          </div>
          <span className="text-2xl font-semibold tracking-tight">veloport</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <Link href="#" className="hover:text-slate-900 transition-colors">Features</Link>
          <Link href="#" className="hover:text-slate-900 transition-colors">Enterprise</Link>
          <Link href="#" className="hover:text-slate-900 transition-colors">Compliance</Link>
          
          <Link 
            href="/manufacturer/orders" 
            className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 transition-all shadow-sm group"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border border-emerald-200">
              <User size={16} />
            </div>
            <div className="flex flex-col items-start -space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400">Manufacturer</span>
              <span className="text-xs font-bold flex items-center gap-1">
                KTM Fahrrad GmbH <ChevronDown size={10} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
              </span>
            </div>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 relative">
        {/* Hero Section */}
        <div className="max-w-4xl w-full text-center space-y-8 py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-sm font-medium mb-4">
            <Sparkles size={14} />
            <span>AI-Powered Passport Extraction</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-slate-900">
            AI-Powered Battery Passport Gateway <br />
            <span className="text-emerald-600">for Manufacturer ERP</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 leading-relaxed">
            Veloport turns messy supplier battery passport uploads into ERP-ready records, 
            supplier decision insights, and retailer-ready passport views.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/supplier/upload"
              className="group flex h-14 items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 text-white font-semibold transition-all hover:bg-emerald-600 hover:scale-105"
            >
              Get started
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/manufacturer/orders"
              className="flex h-14 items-center justify-center rounded-full border border-slate-200 bg-white/70 px-8 text-slate-700 font-medium backdrop-blur-xl transition-all hover:bg-white shadow-sm"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 py-20">
          {[
            {
              icon: <Zap className="text-emerald-600" />,
              title: "Instant Extraction",
              desc: "Automatically extract 100+ battery data points from supplier PDFs, CSVs, and portals using advanced LLMs."
            },
            {
              icon: <ShieldCheck className="text-emerald-600" />,
              title: "Compliant Batches",
              desc: "Automatically validate against EU Battery Regulation requirements and identify missing critical information."
            },
            {
              icon: <BarChart3 className="text-emerald-600" />,
              title: "Supplier Insights",
              desc: "Score suppliers on carbon footprint, recycled content, and due diligence performance from real passport data."
            }
          ].map((feature, i) => (
            <div key={i} className="rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 to-white/40 p-8 backdrop-blur-xl hover:border-emerald-200 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
        
        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 pb-32 opacity-70">
          {["AI Passport Extraction", "ERP Sync", "Supplier Data Requests", "Manufacturer Insights", "Retailer Export", "Customer Battery View", "DPP Ready"].map((pill) => (
            <span key={pill} className="px-4 py-1.5 rounded-full border border-slate-200 bg-white/50 text-sm font-medium text-slate-600">
              {pill}
            </span>
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-200 py-12 px-8 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm leading-none">v</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">veloport</span>
          </div>
          <p className="text-slate-400 text-sm">
            © 2026 Veloport Inc. All rights reserved. Built for the future of battery mobility.
          </p>
          <div className="flex gap-6 text-slate-400 text-sm">
            <Link href="#" className="hover:text-emerald-600 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

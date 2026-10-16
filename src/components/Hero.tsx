import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  FileCheck, 
  MapPin, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  Sparkles,
  Smartphone,
  Laptop,
  Tablet,
  ChevronRight,
  TrendingDown,
  Compass
} from 'lucide-react';

interface HeroProps {
  onStartRequest: () => void;
  onPartnerClick: () => void;
  onOpenLiveTracking: () => void;
  onOpenMap?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartRequest,
  onPartnerClick,
  onOpenLiveTracking,
  onOpenMap,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200">
      {/* Subtle radial ambient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-100/40 via-teal-50/20 to-transparent pointer-events-none -z-10 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              <span>Don’t just find a repairer. Find the right repairer.</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] text-balance">
              Repairing your device <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-teal-600">shouldn’t be a gamble.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
              Compare trusted local repairers, transparent prices, real repair timelines, and guaranteed warranties — all in one structured workflow.
            </p>

            {/* Quick Device Selector Pills in Hero */}
            <div className="pt-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-2">
                Select your device to compare Bhopal repair quotes:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={onStartRequest}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-slate-800 text-xs font-medium shadow-xs transition"
                >
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  <span>Smartphones</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500 font-mono text-[11px]">from ₹799</span>
                </button>
                <button
                  onClick={onStartRequest}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-slate-800 text-xs font-medium shadow-xs transition"
                >
                  <Laptop className="w-4 h-4 text-indigo-600" />
                  <span>Laptops & MacBooks</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500 font-mono text-[11px]">from ₹1,200</span>
                </button>
                <button
                  onClick={onStartRequest}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-slate-800 text-xs font-medium shadow-xs transition"
                >
                  <Tablet className="w-4 h-4 text-indigo-600" />
                  <span>Tablets & iPads</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500 font-mono text-[11px]">from ₹999</span>
                </button>
              </div>
            </div>

            {/* CTA Group */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onStartRequest}
                className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Get Your Device Repaired</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onOpenMap && (
                <button
                  onClick={onOpenMap}
                  className="px-5 py-3.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-indigo-600" />
                  <span>Find Repairers Near Me</span>
                </button>
              )}

              <button
                onClick={onPartnerClick}
                className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
              >
                <span>Become a Repair Partner</span>
              </button>
            </div>

            {/* Trust Markers Bar */}
            <div className="pt-4 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Repairers</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Transparent Quotes</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Live Status Tracking</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Digital Warranty Vault</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Journey UI Mockup */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Background Glow */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-teal-500 opacity-20 blur-xl"></div>

              {/* Main Container Card representing the live workflow */}
              <div className="relative rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden p-5 sm:p-6 space-y-4">
                {/* Header of Mockup */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-900">Repair Workflow Engine</span>
                  </div>
                  <button 
                    onClick={onOpenLiveTracking}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <span>View Active Job</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* The 7-step visual workflow progress */}
                <div className="space-y-1.5">
                  <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
                    <span>Structured Repair Journey</span>
                    <span className="text-indigo-600 font-mono font-semibold">Stage 4 of 7</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                    <div className="bg-indigo-600 h-full w-[57%] rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Request</span>
                    <span>Quotes</span>
                    <span className="text-indigo-600 font-semibold">Diagnosis</span>
                    <span>Repair</span>
                    <span>Warranty</span>
                  </div>
                </div>

                {/* Live Demonstration Card: Active Job Sample */}
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-slate-900">RS-BPL-10482</span>
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded">
                          MP Nagar Hub
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">
                        Samsung Galaxy S24 (AMOLED Screen)
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold font-mono text-slate-900">₹2,499</div>
                      <div className="text-[10px] text-slate-500">Quoted Price</div>
                    </div>
                  </div>

                  {/* Trust Clause / Approval Box */}
                  <div className="rounded-lg bg-amber-50/80 border border-amber-200/80 p-2.5 text-[11px] text-amber-900 space-y-1">
                    <div className="font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                      <span>Diagnosis Completed · Customer Approval Pending</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-snug">
                      Technician discovered micro-frame dent. Additional cost: <strong className="font-mono">+₹300</strong>. Requires your explicit authorization.
                    </p>
                    <div className="pt-1 flex gap-2">
                      <button 
                        onClick={onOpenLiveTracking}
                        className="px-2.5 py-1 bg-amber-600 text-white rounded font-medium text-[10px] hover:bg-amber-700 transition"
                      >
                        Review & Approve
                      </button>
                      <button 
                        onClick={onOpenLiveTracking}
                        className="px-2.5 py-1 bg-white border border-amber-300 text-amber-800 rounded font-medium text-[10px]"
                      >
                        Inspect Details
                      </button>
                    </div>
                  </div>

                  {/* Matched Partner summary */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[10px]">
                        TC
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-xs">TechCare Electronics</div>
                        <div className="text-[10px] text-slate-500">4.8 ★ (1,240 repairs) · 2.4 km away</div>
                      </div>
                    </div>
                    <div className="text-right font-mono text-[11px] text-emerald-700 font-semibold">
                      90-Day Warranty
                    </div>
                  </div>
                </div>

                {/* Bottom Trust Stamp */}
                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Cryptographic Digital Warranty attached</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">Escrow Security</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

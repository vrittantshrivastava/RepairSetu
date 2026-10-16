import React from 'react';
import { 
  FileText, 
  Layers, 
  Scale, 
  Activity, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  CheckCircle,
  Clock,
  QrCode
} from 'lucide-react';

interface HowItWorksProps {
  onStartRequest: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartRequest }) => {
  const steps = [
    {
      number: '01',
      title: 'Submit Repair Request',
      description: 'Select your smartphone, laptop, or tablet. Describe the symptoms, and our AI provides a preliminary classification of likely components.',
      icon: FileText,
      detail: 'Includes photo upload & Bhopal pickup preference',
    },
    {
      number: '02',
      title: 'Receive Transparent Quotes',
      description: 'Verified local repair centers evaluate your request and send structured bids with exact price, parts grade, and turnaround times.',
      icon: Layers,
      detail: 'No guesswork · Competing verified workshops',
    },
    {
      number: '03',
      title: 'Compare & Select Partner',
      description: 'Side-by-side comparison across 6 trust metrics: Price, estimated hours, warranty duration, parts specification, and verified customer ratings.',
      icon: Scale,
      detail: 'Highlighting Best Value, Fastest, or Highest Rated',
    },
    {
      number: '04',
      title: 'Track Diagnostic & Repair',
      description: 'Follow your device across all 9 milestones. If bench diagnosis uncovers additional hidden faults, cost increases require your explicit approval.',
      icon: Activity,
      detail: 'Strict zero-unauthorized-charge policy',
    },
    {
      number: '05',
      title: 'Pay & Receive Digital Warranty',
      description: 'Inspect your restored device. Upon completion, receive an immutable digital warranty certificate with QR claim tracking in your vault.',
      icon: ShieldCheck,
      detail: '60 to 180-day formal parts guarantee',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider">
            <span>Structured Repair Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How RepairSetu guarantees your peace of mind
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Finding a shop on Google Maps gives you a phone number and a promise. RepairSetu gives you a standardized, accountable transaction from start to finish.
          </p>
        </div>

        {/* Workflow Diagram Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono font-semibold text-slate-700">
            <span className="flex items-center gap-1.5 text-indigo-700">
              <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs">1</span>
              REQUEST
            </span>
            <span className="text-slate-300">→</span>
            <span className="flex items-center gap-1.5 text-indigo-700">
              <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs">2</span>
              QUOTE
            </span>
            <span className="text-slate-300">→</span>
            <span className="flex items-center gap-1.5 text-indigo-700">
              <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs">3</span>
              COMPARE
            </span>
            <span className="text-slate-300">→</span>
            <span className="flex items-center gap-1.5 text-indigo-700">
              <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs">4</span>
              BOOK
            </span>
            <span className="text-slate-300">→</span>
            <span className="flex items-center gap-1.5 text-indigo-700">
              <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs">5</span>
              TRACK
            </span>
            <span className="text-slate-300">→</span>
            <span className="flex items-center gap-1.5 text-indigo-700">
              <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs">6</span>
              PAY
            </span>
            <span className="text-slate-300">→</span>
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">7</span>
              WARRANTY
            </span>
          </div>
        </div>

        {/* 5 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.number}
                className="group relative bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-slate-300 group-hover:text-indigo-600 transition-colors">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] font-medium text-slate-500">
                  {step.detail}
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive CTA to test workflow */}
        <div className="text-center pt-2">
          <button
            onClick={onStartRequest}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-xs hover:shadow transition"
          >
            <span>Start a Repair Request Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

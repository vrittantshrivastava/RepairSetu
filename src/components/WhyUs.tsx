import React from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle, 
  Clock, 
  Award,
  DollarSign,
  Cpu,
  BadgeAlert
} from 'lucide-react';

export const WhyUs: React.FC = () => {
  const painPoints = [
    {
      question: '“Which repairer can I actually trust?”',
      reality: 'Unorganized street shops often swap working secondary parts or claim non-existent motherboard faults.',
      solution: 'Vetted & audited workshops with verified GST/trade licenses, verified physical addresses, and audited technician experience in Bhopal.',
      icon: ShieldCheck,
    },
    {
      question: '“Is this price fair or am I getting overcharged?”',
      reality: 'Prices fluctuate based on customer urgency or lack of technical knowledge, with arbitrary quotes ranging wildly.',
      solution: 'Competitive reverse-quotation marketplace. Multiple certified workshops bid on your job with transparent labor and component breakdowns.',
      icon: DollarSign,
    },
    {
      question: '“What parts are actually being put in my device?”',
      reality: 'Cheap counterfeit duplicate screens or refurbished battery cells sold as original parts without any batch documentation.',
      solution: 'Explicit parts grading: Genuine OEM, Grade-A OEM Spec, or Certified Compatible declared in the quote and recorded on the digital invoice.',
      icon: Cpu,
    },
    {
      question: '“When will I actually get my device back?”',
      reality: '“Bhaiya kal shaam ko aana” turns into 5 days of unanswered phone calls and delayed deliveries.',
      solution: 'Binding timeline SLA in the quotation with live 9-stage digital progress updates and SMS/WhatsApp status pings.',
      icon: Clock,
    },
    {
      question: '“What happens if something goes wrong after 2 days?”',
      reality: 'Verbal assurances disappear: “You must have dropped it again, no warranty on electronics.”',
      solution: 'Formal 60 to 180-Day Digital Warranty stored in your RepairSetu vault, backed by escrow dispute resolution.',
      icon: Award,
    },
  ];

  return (
    <section id="why-us" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
            <span>The Trust Deficit in Electronics Repair</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why RepairSetu?
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Electronics repair in India has been plagued by information asymmetry, unverified parts, and zero accountability. Here is how we change the equation.
          </p>
        </div>

        {/* 5 Contrast Cards */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {painPoints.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-indigo-300 transition-all space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {item.question}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* The Problem / Reality */}
                  <div className="rounded-lg bg-rose-50/60 border border-rose-100 p-3.5 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-rose-800 uppercase tracking-wider text-[10px]">
                      <BadgeAlert className="w-3.5 h-3.5 text-rose-600" />
                      <span>Traditional Unregulated Repair</span>
                    </div>
                    <p className="text-rose-950 leading-relaxed font-normal">
                      {item.reality}
                    </p>
                  </div>

                  {/* The RepairSetu Solution */}
                  <div className="rounded-lg bg-emerald-50/60 border border-emerald-100 p-3.5 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800 uppercase tracking-wider text-[10px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>The RepairSetu Standard</span>
                    </div>
                    <p className="text-emerald-950 leading-relaxed font-medium">
                      {item.solution}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Golden Rule of RepairSetu Banner */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase text-teal-400 font-semibold tracking-wider">
              Core Platform Principle
            </div>
            <h4 className="text-xl sm:text-2xl font-bold">
              The “Customer Cost-Lock” Guarantee
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              If bench diagnostic reveals any additional component damage, repairers cannot unilaterally add even ₹10 to your bill. You receive an itemized photographic inspection report and retain full right to approve or decline before work begins.
            </p>
          </div>
          <div className="shrink-0 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center min-w-[180px]">
            <div className="text-2xl font-bold font-mono text-teal-300">100%</div>
            <div className="text-xs text-slate-200 font-medium">Pre-Approval Required</div>
            <div className="text-[10px] text-slate-400 mt-1">Zero Hidden Surcharges</div>
          </div>
        </div>
      </div>
    </section>
  );
};

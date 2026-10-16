import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Layers, 
  Truck, 
  Award, 
  Building2,
  Sparkles
} from 'lucide-react';

export const BusinessModel: React.FC = () => {
  const streams = [
    {
      title: 'Success Commission',
      share: '8% – 12%',
      desc: 'Transparent success fee charged to verified repair partners only when a repair is completed and accepted by the customer.',
      icon: DollarSign,
      pill: 'Primary Engine',
    },
    {
      title: 'Partner SaaS Subscription',
      share: '₹999 / mo',
      desc: 'Digital workshop tools: diagnostic ticketing, SMS tracking updates, parts inventory ledger, and digital warranty issuance.',
      icon: Layers,
      pill: 'Workshop Productivity',
    },
    {
      title: 'Doorstep Convenience Logistics',
      share: '₹99 – ₹149',
      desc: 'Optional round-trip secure runner service for pickup and delivery in Bhopal with tamper-evident security pouches.',
      icon: Truck,
      pill: 'Logistics Cost-Plus',
    },
    {
      title: 'Extended Warranties & Fleet B2B',
      share: 'Enterprise AMC',
      desc: 'Corporate device maintenance contracts and extended repair protection packages for IT fleets, colleges, and startups.',
      icon: Building2,
      pill: 'Long-Term Moat',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider font-mono">
            <span>Sustainable Marketplace Economics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How RepairSetu generates value
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            A balanced commercial model aligned with customer trust and local workshop prosperity — we only profit when jobs are performed reliably.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {streams.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {item.pill}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                    <div className="text-lg font-extrabold font-mono text-indigo-700 mt-1">
                      {item.share}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Long-Term Data Flywheel Callout (Section 18) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl text-xs">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>The Proprietary Repair Intelligence Flywheel</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Every completed job feeds our structured database: <strong>Device Model → Symptom → Bench Diagnosis → Part Serial → Real Cost → Technician SLA → Warranty Outcome</strong>. Over time, this builds an unmatched predictive maintenance and component reliability index for the Indian consumer electronics market.
            </p>
          </div>
          <div className="font-mono text-xs text-indigo-900 bg-indigo-50 border border-indigo-100 px-4 py-3 rounded-xl shrink-0 font-medium">
            Data Network Effect
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Check, X, Minus, ShieldCheck, Zap } from 'lucide-react';

export const CompetitiveMatrix: React.FC = () => {
  const criteria = [
    { name: 'Multi-Shop Price Comparison', google: false, brand: false, unorganized: false, repairsetu: true },
    { name: 'Binding Upfront Quotations', google: false, brand: true, unorganized: false, repairsetu: true },
    { name: 'Multi-Brand Capability (Apple/Android/PC)', google: true, brand: false, unorganized: true, repairsetu: true },
    { name: 'Fair Market Pricing (Non-inflated)', google: 'Variable', brand: false, unorganized: 'Variable', repairsetu: true },
    { name: 'Live 9-Stage Milestone Tracking', google: false, brand: 'Partial', unorganized: false, repairsetu: true },
    { name: 'Mandatory Customer Approval on Cost Hike', google: false, brand: 'Varies', unorganized: false, repairsetu: true },
    { name: 'Cryptographic Digital Warranty Record', google: false, brand: 'Paper slip', unorganized: false, repairsetu: true },
    { name: 'Vetted Technician Audits & Escrow', google: false, brand: true, unorganized: false, repairsetu: true },
  ];

  return (
    <section id="comparison" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider">
            <span>Marketplace Positioning</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How RepairSetu fits into India’s repair landscape
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            We don’t replace existing repairers; we build the standardized workflow, trust, and accountability infrastructure that turns fragmented shops into a reliable service network.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 px-4 font-bold text-slate-900 w-1/3">
                  Workflow Capability
                </th>
                <th className="py-4 px-3 font-semibold text-slate-500 text-center">
                  Search / Maps Directory
                </th>
                <th className="py-4 px-3 font-semibold text-slate-500 text-center">
                  Brand Service Centers
                </th>
                <th className="py-4 px-3 font-semibold text-slate-500 text-center">
                  Random Local Repair Shop
                </th>
                <th className="py-4 px-4 font-bold text-indigo-700 bg-indigo-50/60 rounded-t-xl text-center">
                  <div className="flex items-center justify-center gap-1 font-bold text-indigo-900">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    RepairSetu
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {criteria.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {item.name}
                  </td>

                  {/* Google */}
                  <td className="py-3.5 px-3 text-center text-slate-500">
                    {item.google === true ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : item.google === false ? (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    ) : (
                      <span className="text-xs text-slate-500">{item.google}</span>
                    )}
                  </td>

                  {/* Brand Centers */}
                  <td className="py-3.5 px-3 text-center text-slate-500">
                    {item.brand === true ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : item.brand === false ? (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    ) : (
                      <span className="text-xs text-slate-500">{item.brand}</span>
                    )}
                  </td>

                  {/* Unorganized */}
                  <td className="py-3.5 px-3 text-center text-slate-500">
                    {item.unorganized === true ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : item.unorganized === false ? (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    ) : (
                      <span className="text-xs text-slate-500">{item.unorganized}</span>
                    )}
                  </td>

                  {/* RepairSetu */}
                  <td className="py-3.5 px-4 text-center bg-indigo-50/40 font-semibold text-indigo-950">
                    <div className="flex items-center justify-center gap-1 text-emerald-700">
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      <span>Guaranteed</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom context note */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs text-slate-600">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">Google / JustDial</div>
            <p>Great for discovery and road directions, but completely absent once money changes hands or parts fail.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">Authorized Centers</div>
            <p>Official and genuine, but frequently recommend full motherboard replacements (often exceeding 60% of device value).</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">Right to Repair India</div>
            <p>A vital national initiative expanding consumer repairability manuals; RepairSetu operates as the commercial execution bridge.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { 
  BarChart3, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { POPULAR_DEVICES, COMMON_ISSUES } from '../data/mockData';

interface PriceIntelligenceProps {
  onStartRequest: () => void;
}

export const PriceIntelligence: React.FC<PriceIntelligenceProps> = ({ onStartRequest }) => {
  const [selectedDevice, setSelectedDevice] = useState(POPULAR_DEVICES[0].id);
  const [selectedIssue, setSelectedIssue] = useState(COMMON_ISSUES[0].id);

  const device = POPULAR_DEVICES.find(d => d.id === selectedDevice) || POPULAR_DEVICES[0];
  const issue = COMMON_ISSUES.find(i => i.id === selectedIssue) || COMMON_ISSUES[0];

  // Dynamic pricing calculation based on device tier
  const tierMultiplier = device.brand === 'Apple' ? 1.4 : device.brand === 'Samsung' ? 1.2 : 1.0;
  const minCost = Math.round((issue.typicalCostRange.min * tierMultiplier) / 50) * 50;
  const maxCost = Math.round((issue.typicalCostRange.max * tierMultiplier) / 50) * 50;
  const medianCost = Math.round((minCost + maxCost) / 2);

  return (
    <section id="price-intel" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Marketplace Intelligence & Anomaly Guard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Transparent Price Index for Bhopal
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            RepairSetu tracks historical repair transactions to eliminate arbitrary quoting. See expected local costs before requesting quotes.
          </p>
        </div>

        {/* Interactive Benchmark Calculator Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Device Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Select Device Model
              </label>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                {POPULAR_DEVICES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.brand} {d.model} ({d.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Issue Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                2. Select Hardware Issue
              </label>
              <select
                value={selectedIssue}
                onChange={(e) => setSelectedIssue(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                {COMMON_ISSUES.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing Result Visualization */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Bhopal Marketplace Benchmark ({device.brand} {device.model})
                </span>
                <h4 className="text-xl font-bold text-slate-900 mt-0.5">
                  {issue.name}
                </h4>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 font-mono">
                  ₹{minCost.toLocaleString('en-IN')} – ₹{maxCost.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-500">
                  Median market quote: <span className="font-semibold text-slate-800 font-mono">₹{medianCost.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Breakdown metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  Turnaround Norm
                </span>
                <div className="font-bold text-slate-900 text-sm font-mono">
                  {issue.typicalDurationHours} to {issue.typicalDurationHours * 2} Hours
                </div>
                <div className="text-[11px] text-slate-500">
                  Same-day or next-day SLA
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Standard Warranty
                </span>
                <div className="font-bold text-slate-900 text-sm font-mono">
                  90 to 180 Days
                </div>
                <div className="text-[11px] text-slate-500">
                  Includes touch & display guarantee
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-500 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-teal-600" />
                  Recommended Part
                </span>
                <div className="font-bold text-slate-900 text-sm">
                  OEM Grade Specification
                </div>
                <div className="text-[11px] text-slate-500">
                  Color calibrated & tested
                </div>
              </div>
            </div>

            {/* Quotation Anomaly Detection Explanation */}
            <div className="p-3.5 rounded-lg bg-indigo-50/70 border border-indigo-100 flex items-start gap-3 text-xs text-indigo-950">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold">Automated Anomaly Detection Guard</div>
                <p className="text-indigo-900/80 leading-relaxed text-[11px]">
                  When local workshops submit quotes for your request, our price intelligence automatically flags any bid that deviates by more than 25% from the historical Bhopal average. This protects you from both predatory overcharging and suspiciously low counterfeit-part bids.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-xs text-slate-500">
              Ready to get exact quotes from verified technicians in your area?
            </span>
            <button
              onClick={onStartRequest}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition"
            >
              <span>Request Quotes for {device.brand}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

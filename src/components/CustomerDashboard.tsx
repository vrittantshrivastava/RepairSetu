import React, { useState } from 'react';
import { 
  Smartphone, 
  Laptop, 
  ShieldCheck, 
  Award, 
  Clock, 
  MapPin, 
  ArrowRight, 
  ChevronRight,
  User, 
  History, 
  Bookmark, 
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { ActiveRepairJob, DigitalWarranty } from '../types';
import { PAST_DEMO_WARRANTY, MOCK_REPAIRERS } from '../data/mockData';

interface CustomerDashboardProps {
  activeJob: ActiveRepairJob | null;
  onOpenTracking: (repairId?: string) => void;
  onOpenWarranty: (warranty: DigitalWarranty) => void;
  onStartNewRequest: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  activeJob,
  onOpenTracking,
  onOpenWarranty,
  onStartNewRequest,
}) => {
  const [activeTab, setActiveTab] = useState<'repairs' | 'warranties' | 'saved' | 'profile'>('repairs');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Profile Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-sm">
            AS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Aman Saxena</h1>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-mono font-bold px-2 py-0.5 rounded">
                Verified Member
              </span>
            </div>
            <div className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-2">
              <span>MP Nagar Zone II, Bhopal</span>
              <span>·</span>
              <span>+91 98260 44120</span>
            </div>
          </div>
        </div>

        <button
          onClick={onStartNewRequest}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow transition"
        >
          <span>+ Request New Repair</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto whitespace-nowrap text-xs font-semibold">
        <button
          onClick={() => setActiveTab('repairs')}
          className={`pb-3 px-3 border-b-2 transition ${
            activeTab === 'repairs'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Active & Past Repairs
        </button>
        <button
          onClick={() => setActiveTab('warranties')}
          className={`pb-3 px-3 border-b-2 transition ${
            activeTab === 'warranties'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Warranty Records (2)
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 px-3 border-b-2 transition ${
            activeTab === 'saved'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Saved Repairers (2)
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-3 border-b-2 transition ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Account & Addresses
        </button>
      </div>

      {/* TAB 1: REPAIRS */}
      {activeTab === 'repairs' && (
        <div className="space-y-6">
          {/* Active Repair Card */}
          {activeJob && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
                <span>Active Live Job</span>
                <span className="text-emerald-700 font-mono">In Progress</span>
              </div>

              <div className="bg-white rounded-2xl border-2 border-indigo-200 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">
                          {activeJob.request.brand} {activeJob.request.model}
                        </span>
                        <span className="font-mono text-xs text-slate-400">({activeJob.repairId})</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {activeJob.request.issue} · {activeJob.selectedQuotation.repairer.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold font-mono text-indigo-700 text-lg">
                      ₹{activeJob.selectedQuotation.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-400">Quoted Total</div>
                  </div>
                </div>

                {/* Status Callout */}
                <div className="flex items-center justify-between p-3.5 bg-indigo-50/70 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-semibold text-indigo-950 capitalize">
                      Stage: {activeJob.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="font-mono text-slate-500 text-[11px]">Ready tomorrow</span>
                </div>

                {/* Cost Approval notice if pending */}
                {activeJob.costAdjustment && activeJob.costAdjustment.status === 'pending' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-950">
                    <div className="flex items-center gap-2 font-medium">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Diagnostic notice: Frame dent discovered. Cost hike of +₹300 requires approval.</span>
                    </div>
                    <button
                      onClick={() => onOpenTracking(activeJob.repairId)}
                      className="px-3 py-1 bg-amber-600 text-white rounded font-bold text-[11px] hover:bg-amber-700"
                    >
                      Review
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500">
                    Doorstep pickup confirmed at MP Nagar Zone II
                  </span>
                  <button
                    onClick={() => onOpenTracking(activeJob.repairId)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <span>Open Live Tracker</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Past History */}
          <div className="space-y-3 pt-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Completed Repairs History
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">MacBook Air M2 (13.6-inch)</div>
                    <div className="text-slate-500">
                      Original Battery Replacement · ChipLevel Pro Labs (Indrapuri)
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 text-sm">₹4,200</span>
                  <div className="text-[10px] text-emerald-700 font-semibold">180-Day Warranty Active</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Completed: 12 Sep 2026 · Order #RS-BPL-8831</span>
                <button
                  onClick={() => onOpenWarranty(PAST_DEMO_WARRANTY)}
                  className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>View Warranty Certificate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WARRANTIES */}
      {activeTab === 'warranties' && (
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Active Digital Warranties in Vault
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Warranty 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Active Guarantee
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-2">{PAST_DEMO_WARRANTY.device}</h4>
                  <div className="text-xs text-slate-500">{PAST_DEMO_WARRANTY.repairPerformed}</div>
                </div>
                <Award className="w-6 h-6 text-emerald-600" />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Partner:</span>
                  <span className="text-slate-800 font-semibold">{PAST_DEMO_WARRANTY.repairerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expires On:</span>
                  <span className="text-emerald-700 font-bold">{PAST_DEMO_WARRANTY.expiryDate}</span>
                </div>
              </div>

              <button
                onClick={() => onOpenWarranty(PAST_DEMO_WARRANTY)}
                className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition"
              >
                Inspect Certificate & QR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SAVED REPAIRERS */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Favorite Bhopal Technicians
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_REPAIRERS.slice(0, 2).map((rep) => (
              <div key={rep.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{rep.name}</h4>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      {rep.rating} ★ ({rep.reviewCount} reviews) · {rep.area}
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    Verified
                  </span>
                </div>

                <p className="text-xs text-slate-600">{rep.partsPolicy}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">{rep.completedRepairs} jobs done</span>
                  <button
                    onClick={onStartNewRequest}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 max-w-xl text-xs">
          <h3 className="font-bold text-slate-900 text-sm">Saved Customer Information</h3>
          <div className="space-y-3 text-slate-700">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Full Name</span>
              <span className="font-semibold text-slate-900 text-sm">Aman Saxena</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Registered Phone</span>
              <span className="font-mono text-slate-800">+91 98260 44120</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Primary Bhopal Address</span>
              <span className="text-slate-800">Flat 302, Lakeview Heights, Near Jyoti Talkies, MP Nagar Zone II, Bhopal, MP - 462011</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

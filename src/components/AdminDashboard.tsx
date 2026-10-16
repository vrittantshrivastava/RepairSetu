import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  Store, 
  AlertTriangle, 
  TrendingUp, 
  Check, 
  X, 
  FileText, 
  Search,
  Eye,
  Activity
} from 'lucide-react';

interface AdminDashboardProps {
  onSwitchToCustomer: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSwitchToCustomer }) => {
  const [activeTab, setActiveTab] = useState<'anomalies' | 'verifications' | 'disputes' | 'audit'>('anomalies');
  const [verificationList, setVerificationList] = useState([
    {
      id: 'app-1',
      name: 'SmartChip Solutions',
      area: 'Kolar Road, Bhopal',
      owner: 'Deepak Patel',
      gst: '23AAECS9120H1ZX',
      experienceYears: 5,
      status: 'pending',
    },
    {
      id: 'app-2',
      name: 'AppleCare Unofficial Hub',
      area: 'New Market, Bhopal',
      owner: 'Ramesh Lodhi',
      gst: 'Invalid / Trade Registration only',
      experienceYears: 2,
      status: 'flagged',
    },
  ]);

  const handleApprove = (id: string) => {
    setVerificationList(
      verificationList.map((item) =>
        item.id === id ? { ...item, status: 'approved' } : item
      )
    );
  };

  const handleReject = (id: string) => {
    setVerificationList(
      verificationList.map((item) =>
        item.id === id ? { ...item, status: 'rejected' } : item
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Admin Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white font-bold text-xl flex items-center justify-center shadow-xs">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Trust & Safety Surveillance Console</h1>
              <span className="text-[10px] bg-rose-950 text-rose-300 font-mono font-bold px-2 py-0.5 rounded border border-rose-800">
                Marketplace Admin
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              Region: Bhopal Metropolitan Area (Cluster #04) · Real-Time Anomaly Engine Active
            </div>
          </div>
        </div>

        <button
          onClick={onSwitchToCustomer}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
        >
          ← Return to Customer View
        </button>
      </div>

      {/* High-Level Marketplace Health Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-1 shadow-xs">
          <span className="text-slate-500 text-[10px] font-semibold uppercase">Customers</span>
          <div className="text-xl font-bold font-mono text-slate-900">3,420</div>
          <span className="text-[10px] text-emerald-600 font-semibold">+14% MoM</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-1 shadow-xs">
          <span className="text-slate-500 text-[10px] font-semibold uppercase">Verified Workshops</span>
          <div className="text-xl font-bold font-mono text-slate-900">42</div>
          <span className="text-[10px] text-slate-400">All Bhopal zones</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-1 shadow-xs">
          <span className="text-slate-500 text-[10px] font-semibold uppercase">Active Repairs</span>
          <div className="text-xl font-bold font-mono text-indigo-600">84</div>
          <span className="text-[10px] text-slate-400">Bench & transit</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-1 shadow-xs">
          <span className="text-slate-500 text-[10px] font-semibold uppercase">Completed Repairs</span>
          <div className="text-xl font-bold font-mono text-slate-900">1,840</div>
          <span className="text-[10px] text-emerald-600 font-semibold">99.2% satisfaction</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-1 shadow-xs">
          <span className="text-slate-500 text-[10px] font-semibold uppercase">Open Disputes</span>
          <div className="text-xl font-bold font-mono text-amber-600">2</div>
          <span className="text-[10px] text-amber-600 font-semibold">Under mediation</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-1 shadow-xs">
          <span className="text-slate-500 text-[10px] font-semibold uppercase">Avg Rating</span>
          <div className="text-xl font-bold font-mono text-slate-900">4.82 ★</div>
          <span className="text-[10px] text-slate-400">Audited reviews</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-1 shadow-xs">
          <span className="text-slate-500 text-[10px] font-semibold uppercase">Gross GMV</span>
          <div className="text-xl font-bold font-mono text-slate-900">₹18.6L</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Bhopal Q3</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('anomalies')}
          className={`pb-3 px-3 border-b-2 transition ${
            activeTab === 'anomalies'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Quotation Anomaly Radar (1 Flag)
        </button>
        <button
          onClick={() => setActiveTab('verifications')}
          className={`pb-3 px-3 border-b-2 transition ${
            activeTab === 'verifications'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Workshop Verification Queue (2)
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`pb-3 px-3 border-b-2 transition ${
            activeTab === 'disputes'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Dispute Resolution Center (2)
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-3 border-b-2 transition ${
            activeTab === 'audit'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Repair Activity Feed
        </button>
      </div>

      {/* TAB 1: QUOTATION ANOMALY RADAR */}
      {activeTab === 'anomalies' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Automated Price Anomaly Detection
              </h3>
              <p className="text-xs text-slate-500">
                Machine intelligence flags bids that deviate &gt;25% from the median Bhopal component baseline.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              1 Active Suspicion Flag
            </span>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-3 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-bold text-rose-950 font-mono text-sm">
                  Flagged Bid: ₹4,800 for Redmi Note 13 Screen Replacement
                </span>
                <div className="text-rose-800 mt-0.5">
                  Submitted by: FastFix Electronics (Bairagarh) · Inquiry #REQ-7741
                </div>
              </div>
              <span className="font-mono text-rose-700 font-bold bg-white px-2 py-0.5 rounded border border-rose-200">
                +84% Above Median
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-3 rounded-lg border border-rose-100">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Quoted Amount</span>
                <span className="font-bold text-rose-700 font-mono text-sm">₹4,800</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Market Median</span>
                <span className="font-bold text-slate-800 font-mono text-sm">₹2,400 – ₹2,700</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">AI Risk Level</span>
                <span className="font-bold text-rose-600 text-sm">High Overpricing Alert</span>
              </div>
            </div>

            <p className="text-rose-900 text-[11px] leading-relaxed">
              <strong>System Action:</strong> Quote has been annotated with a fairness warning for the customer. Workshop alerted to justify parts grade or adjust bid.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => alert('Demo: Quotation accepted after partner uploaded invoice proving official genuine curved glass module.')}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition"
              >
                Request Partner Component Proof
              </button>
              <button
                onClick={() => alert('Demo: Quote dismissed from marketplace.')}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium"
              >
                Suppress Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VERIFICATION QUEUE */}
      {activeTab === 'verifications' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">New Repair Partner Applications</h3>
              <p className="text-xs text-slate-500">Every workshop requires physical inspection and GST validation.</p>
            </div>
          </div>

          <div className="space-y-3">
            {verificationList.map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      item.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      item.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="text-slate-500 mt-1">
                    {item.area} · Owner: {item.owner} · {item.experienceYears} Years Bench Work
                  </div>
                  <div className="text-slate-400 font-mono text-[11px] mt-0.5">
                    GST/Trade: {item.gst}
                  </div>
                </div>

                {item.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Partner</span>
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="px-3.5 py-1.5 bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold rounded-lg transition flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DISPUTES */}
      {activeTab === 'disputes' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Active Consumer Escalations</h3>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Case #DSP-102: Touch Latency on iPad 9th Gen</span>
              <span className="text-amber-700 font-bold font-mono">Escrow On Hold</span>
            </div>
            <p className="text-slate-600">
              Customer reported ghost touches after glass replacement. RepairSetu triggered free 48-hour re-bench inspection under 90-day digital warranty SLA.
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Real-Time Bhopal Marketplace Event Stream</h3>
          <div className="space-y-2 text-xs font-mono text-slate-600">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-100 flex justify-between">
              <span>[15:24] RS-BPL-10482: Customer approved +₹300 frame alignment</span>
              <span className="text-slate-400">MP Nagar</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-100 flex justify-between">
              <span>[15:10] RS-BPL-8831: 180-Day digital warranty claim verification passed</span>
              <span className="text-slate-400">Indrapuri</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-100 flex justify-between">
              <span>[14:45] RS-BPL-10490: Dell Inspiron hinge re-casing completed</span>
              <span className="text-slate-400">Arera Colony</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Store, 
  TrendingUp, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Star, 
  Send, 
  AlertTriangle, 
  ChevronRight, 
  FileText,
  User,
  ShieldCheck,
  Check,
  MessageSquare
} from 'lucide-react';
import { ActiveRepairJob, ChatMessage } from '../types';
import { RepairChatDrawer } from './RepairChatDrawer';

interface RepairerDashboardProps {
  activeJob: ActiveRepairJob;
  onUpdateJob: (job: ActiveRepairJob) => void;
  onSwitchToCustomer: () => void;
}

export const RepairerDashboard: React.FC<RepairerDashboardProps> = ({
  activeJob,
  onUpdateJob,
  onSwitchToCustomer,
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'inquiries' | 'adjustments' | 'reviews' | 'chat'>('queue');
  const [quoteAmount, setQuoteAmount] = useState('2499');
  const [turnaroundHours, setTurnaroundHours] = useState('24');
  const [warrantyDays, setWarrantyDays] = useState('90');
  const [quoteSent, setQuoteSent] = useState(false);
  const [repairerChatOpen, setRepairerChatOpen] = useState(false);

  const handleRepairerSendMessage = (text: string, sender: 'customer' | 'repairer') => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender,
      senderName: sender === 'repairer' ? 'Rohit Sharma' : (activeJob.request.customerName || 'Aman Saxena'),
      senderRole: sender === 'repairer' ? 'Lead Technician, TechCare' : 'Device Owner',
      text,
      timestamp: 'Just now',
    };
    onUpdateJob({
      ...activeJob,
      messages: [...(activeJob.messages || []), newMessage],
    });
  };

  // Status progression action for technician
  const handleTechnicianUpdateStatus = (newStatus: any, note: string) => {
    onUpdateJob({
      ...activeJob,
      status: newStatus,
      statusHistory: [
        ...activeJob.statusHistory,
        {
          status: newStatus,
          timestamp: 'Just now (Workshop Portal)',
          note,
        },
      ],
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Shop Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-500 text-slate-950 font-bold text-xl flex items-center justify-center shadow-xs">
            TC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">TechCare Electronics</h1>
              <span className="text-[10px] bg-teal-900 text-teal-300 font-mono font-bold px-2 py-0.5 rounded border border-teal-700">
                Verified Workshop #BPL-08
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              MP Nagar Zone II, Bhopal · Bench Master: Rohit Sharma · GST: 23AABCT8812K1Z9
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSwitchToCustomer}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
          >
            ← View as Customer
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <span className="text-slate-500 text-[11px] font-medium">New Inquiries</span>
          <div className="text-2xl font-bold font-mono text-indigo-700">3</div>
          <span className="text-[10px] text-emerald-600 font-semibold">2 waiting quote</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <span className="text-slate-500 text-[11px] font-medium">Active on Bench</span>
          <div className="text-2xl font-bold font-mono text-slate-900">5</div>
          <span className="text-[10px] text-indigo-600 font-semibold">1 awaiting approval</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <span className="text-slate-500 text-[11px] font-medium">Completed (Month)</span>
          <div className="text-2xl font-bold font-mono text-slate-900">48</div>
          <span className="text-[10px] text-emerald-600 font-semibold">+18% vs last month</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <span className="text-slate-500 text-[11px] font-medium">Gross Payout</span>
          <div className="text-2xl font-bold font-mono text-slate-900">₹1,42,800</div>
          <span className="text-[10px] text-slate-400 font-mono">Direct Bank Escrow</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-slate-500 text-[11px] font-medium">Workshop Rating</span>
          <div className="text-2xl font-bold font-mono text-amber-600 flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>4.85</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">342 reviews</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('queue')}
          className={`pb-3 px-3 border-b-2 transition ${
            activeTab === 'queue'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Active Bench Queue (5)
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`pb-3 px-3 border-b-2 transition ${
            activeTab === 'inquiries'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Incoming Inquiries (3)
        </button>
        <button
          onClick={() => setActiveTab('adjustments')}
          className={`pb-3 px-3 border-b-2 transition ${
            activeTab === 'adjustments'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Customer Cost Approvals (1)
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 px-3 border-b-2 transition ${
            activeTab === 'reviews'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Customer Reviews
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'chat'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Customer Chat ({(activeJob.messages?.length || 0)})</span>
        </button>
      </div>

      {/* TAB 1: ACTIVE BENCH QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-600">
                  Priority Active Job #{activeJob.repairId}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {activeJob.request.brand} {activeJob.request.model} · {activeJob.request.issue}
                </h3>
                <div className="text-xs text-slate-500">
                  Customer: Aman Saxena ({activeJob.request.area}, Bhopal)
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-slate-900">
                  Quoted: ₹{activeJob.selectedQuotation.amount}
                </span>
                <div className="text-[10px] text-emerald-700 font-mono capitalize">
                  Status: {activeJob.status.replace(/_/g, ' ')}
                </div>
              </div>
            </div>

            {/* Technician Workflow Controls */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Update Repair Milestone (Synchronizes with Customer Live Tracking):
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() =>
                    handleTechnicianUpdateStatus(
                      'diagnosis_in_progress',
                      'Technician placed unit under stereo microscope for frame and digitizer testing.'
                    )
                  }
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                    activeJob.status === 'diagnosis_in_progress'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  Diagnosis Active
                </button>

                <button
                  onClick={() =>
                    handleTechnicianUpdateStatus(
                      'repair_in_progress',
                      'Display assembly unsealed; logic board cleaned with ultrasonic wash and replacement panel seated.'
                    )
                  }
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                    activeJob.status === 'repair_in_progress'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  Repair in Progress
                </button>

                <button
                  onClick={() =>
                    handleTechnicianUpdateStatus(
                      'quality_check',
                      'Passed 18-point hardware test: multi-touch calibration, ambient light sensor, and earpiece acoustics.'
                    )
                  }
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                    activeJob.status === 'quality_check'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  Quality Check Done
                </button>

                <button
                  onClick={() =>
                    handleTechnicianUpdateStatus(
                      'ready_for_delivery',
                      'Packaged in ESD protective pouch with RepairSetu tamper seal. Ready for customer handoff.'
                    )
                  }
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                    activeJob.status === 'ready_for_delivery'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  Ready for Delivery
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Customer is actively tracking this repair from Bhopal.
                </span>
                <button
                  onClick={() => setRepairerChatOpen(true)}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Open Live Customer Chat ({activeJob.messages?.length || 0})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INCOMING INQUIRIES & SUBMIT QUOTATION */}
      {activeTab === 'inquiries' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">New Inquiries in Bhopal</h3>
              <p className="text-xs text-slate-500">Quote quickly to win customer jobs before competitors.</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
              3 Nearby Inquiries
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-start justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 text-sm">OnePlus 12 (5G) · Green Line & Display</span>
                <div className="text-slate-500 mt-0.5">Location: Arera Colony (3.4 km) · Customer: Dr. V. Sen</div>
              </div>
              <span className="font-mono text-indigo-700 font-semibold">Standard Pickup</span>
            </div>

            <p className="text-xs text-slate-600 italic">
              “Single vertical green line appeared after OxygenOS update. Touch is fully functional.”
            </p>

            {/* Quotation Submission Form */}
            <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-600 block mb-1">Your Quote (₹)</label>
                <input
                  type="number"
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-600 block mb-1">Turnaround (Hours)</label>
                <input
                  type="number"
                  value={turnaroundHours}
                  onChange={(e) => setTurnaroundHours(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-600 block mb-1">Warranty (Days)</label>
                <input
                  type="number"
                  value={warrantyDays}
                  onChange={(e) => setWarrantyDays(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setQuoteSent(true);
                    setTimeout(() => setQuoteSent(false), 3000);
                  }}
                  className="w-full p-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{quoteSent ? 'Quote Dispatched!' : 'Submit Bid'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER COST APPROVALS */}
      {activeTab === 'adjustments' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Cost Adjustment Requests</h3>
              <p className="text-xs text-slate-500">
                Any deviation from the original bid requires explicit customer authorization.
              </p>
            </div>
          </div>

          {activeJob.costAdjustment && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 font-mono">Job #{activeJob.repairId}</span>
                <span className="font-mono text-xs font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded capitalize">
                  Status: {activeJob.costAdjustment.status}
                </span>
              </div>

              <div className="text-slate-800">
                <strong>Discovery:</strong> {activeJob.costAdjustment.diagnosisDetails}
              </div>
              <div className="text-slate-800">
                <strong>Requested Price Change:</strong> ₹{activeJob.costAdjustment.initialAmount} → ₹{activeJob.costAdjustment.updatedAmount} (+₹{activeJob.costAdjustment.difference})
              </div>

              <div className="text-xs text-slate-500 italic">
                Aman Saxena has this prompt in their live tracking interface. Work remains paused until approved.
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Verified Customer Reviews (Bhopal)</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Aditya Sharma (MP Nagar)</span>
                <span className="text-amber-500 font-bold">5.0 ★</span>
              </div>
              <p className="text-slate-600">
                “Samsung S23 screen replaced in 24 hours. Transparent pricing and official warranty card provided.”
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CUSTOMER CHAT STREAM */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Live Customer Communications</h3>
              <p className="text-xs text-slate-500">
                Direct bench messages for active repair orders. Respond promptly to maintain 4.8+ workshop rating.
              </p>
            </div>
            <button
              onClick={() => setRepairerChatOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Launch Technician Chat Window</span>
            </button>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2 font-mono">
                <span className="font-bold text-slate-900">Order #{activeJob.repairId}</span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-600">{activeJob.request.customerName}</span>
                <span className="text-slate-400">({activeJob.request.brand} {activeJob.request.model})</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded font-semibold">
                Active Channel
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto text-xs pr-1">
              {(activeJob.messages || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-xl border text-xs ${
                    msg.sender === 'repairer'
                      ? 'bg-indigo-50/60 border-indigo-100 text-indigo-950 ml-6'
                      : msg.sender === 'customer'
                      ? 'bg-white border-slate-200 text-slate-800 mr-6'
                      : 'bg-slate-100 border-slate-200 text-slate-500 text-center text-[11px]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                    <span className="font-bold text-slate-700">{msg.senderName}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setRepairerChatOpen(true)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <span>Reply to {activeJob.request.customerName?.split(' ')[0] || 'Customer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Repair Chat Drawer (Workshop Mode) */}
      <RepairChatDrawer
        job={activeJob}
        isOpen={repairerChatOpen}
        onClose={() => setRepairerChatOpen(false)}
        onSendMessage={handleRepairerSendMessage}
        currentRole="repairer"
      />
    </div>
  );
};

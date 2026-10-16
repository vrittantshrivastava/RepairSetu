import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Truck, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  FileCheck,
  Check
} from 'lucide-react';
import { Quotation, RepairRequest, ActiveRepairJob } from '../types';

interface BookingConfirmationProps {
  request: RepairRequest;
  quotation: Quotation;
  onConfirmBooking: (job: ActiveRepairJob) => void;
  onCancel: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  request,
  quotation,
  onConfirmBooking,
  onCancel,
}) => {
  const [agreedToTrustTerms, setAgreedToTrustTerms] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [repairId, setRepairId] = useState('RS-BPL-10482');

  const handleConfirm = () => {
    const generatedId = `RS-BPL-${Math.floor(10000 + Math.random() * 90000)}`;
    setRepairId(generatedId);
    setConfirmed(true);

    const activeJob: ActiveRepairJob = {
      repairId: generatedId,
      request,
      selectedQuotation: quotation,
      status: 'repairer_accepted',
      statusHistory: [
        {
          status: 'request_submitted',
          timestamp: 'Just now',
          note: `Repair request submitted for ${request.brand} ${request.model}`,
        },
        {
          status: 'repairer_accepted',
          timestamp: 'Just now',
          note: `${quotation.repairer.name} confirmed workshop bench reservation`,
        },
      ],
      paymentStatus: 'pending',
      technicianNotes: 'Device scheduled for diagnostic intake at MP Nagar facility.',
    };

    setTimeout(() => {
      onConfirmBooking(activeJob);
    }, 1800);
  };

  if (confirmed) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2 max-w-md">
          <span className="text-xs font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
            Booking Confirmed
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Repair Order Generated
          </h2>
          <div className="font-mono text-xl font-bold text-indigo-700 bg-slate-100 py-2 px-4 rounded-xl border border-slate-200 inline-block">
            {repairId}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {quotation.repairer.name} has been notified. Redirecting you to the live 9-stage tracking console...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Title */}
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-mono font-semibold uppercase text-indigo-600">
            Final Step · Booking Confirmation
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Review & Confirm Your Repair Request
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review the chosen repair center, binding quote amount, and our mandatory customer protection terms.
          </p>
        </div>

        {/* Selected Partner Highlight */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-4 text-xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Chosen Repairer</div>
              <div className="text-base font-bold text-slate-900">{quotation.repairer.name}</div>
              <div className="text-slate-500 font-mono mt-0.5">
                {quotation.repairer.address} · {quotation.repairer.rating} ★
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-extrabold text-indigo-700 font-mono">
                ₹{quotation.amount.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-500">Quoted Total</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200 text-slate-700">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Device</span>
              <span className="font-semibold text-slate-900">{request.brand} {request.model}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Reported Issue</span>
              <span className="font-semibold text-slate-900">{request.issue}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Turnaround</span>
              <span className="font-semibold text-slate-900 font-mono">{quotation.estimatedHours} Hours</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Warranty</span>
              <span className="font-semibold text-emerald-700 font-mono">{quotation.warrantyDays} Days</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
            <span>
              Service Type: <strong className="capitalize text-slate-900">{request.serviceType === 'pickup' ? 'Doorstep Pickup & Drop' : 'Workshop Visit'}</strong>
            </span>
            <span>
              Parts: <strong className="text-slate-900">{quotation.partsType}</strong>
            </span>
          </div>
        </div>

        {/* IMPORTANT TRUST NOTICE REQUIREMENT */}
        <div className="p-4 sm:p-5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2 text-xs text-amber-950">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Customer Cost Protection Notice</span>
          </div>
          <p className="leading-relaxed">
            “Final repair cost may change after physical diagnosis at the workshop workbench. Any additional cost strictly requires your explicit approval before work begins. No repairer is permitted to unilaterally increase your bill.”
          </p>
        </div>

        {/* Agreement Checkbox */}
        <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreedToTrustTerms}
            onChange={(e) => setAgreedToTrustTerms(e.target.checked)}
            className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
          />
          <span>
            I understand that my device will be inspected at {quotation.repairer.name} and any deviation from the initial ₹{quotation.amount} quote requires my mobile approval.
          </span>
        </label>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Back to Quotations
          </button>

          <button
            type="button"
            disabled={!agreedToTrustTerms}
            onClick={handleConfirm}
            className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition ${
              agreedToTrustTerms
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Confirm Repair Request</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

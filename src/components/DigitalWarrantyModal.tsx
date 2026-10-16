import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  QrCode, 
  Download, 
  ExternalLink, 
  X, 
  CheckCircle, 
  Calendar, 
  Wrench,
  AlertCircle
} from 'lucide-react';
import { DigitalWarranty } from '../types';

interface DigitalWarrantyModalProps {
  warranty: DigitalWarranty;
  onClose: () => void;
}

export const DigitalWarrantyModal: React.FC<DigitalWarrantyModalProps> = ({
  warranty,
  onClose,
}) => {
  const [claimInitiated, setClaimInitiated] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Certificate Watermark / Header accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600"></div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Official Digital Certificate
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                RepairSetu Warranty Vault
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Card Body */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 space-y-5 text-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Certificate ID</div>
              <div className="font-mono text-sm font-bold text-slate-900">{warranty.warrantyId}</div>
              <div className="text-[11px] text-slate-500 font-mono">Linked Job: {warranty.repairId}</div>
            </div>

            {/* Simulated QR Code for Trust Verification */}
            <div className="w-14 h-14 bg-white rounded-lg border border-slate-200 p-1 flex flex-col items-center justify-center shadow-xs">
              <QrCode className="w-10 h-10 text-slate-800" />
              <span className="text-[7px] font-mono text-slate-400">VERIFIED</span>
            </div>
          </div>

          {/* Device & Repair Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Protected Device</span>
              <span className="font-bold text-slate-900 text-sm">{warranty.device}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Repair Performed</span>
              <span className="font-bold text-slate-900">{warranty.repairPerformed}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Certified Partner</span>
              <span className="font-semibold text-slate-800">{warranty.repairerName}</span>
              <div className="text-[10px] text-slate-500">{warranty.repairerArea}</div>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Settled Amount</span>
              <span className="font-bold text-slate-900 font-mono text-sm">
                ₹{warranty.amountPaid.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Parts Used */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Registered Components</span>
            <div className="font-medium text-slate-800 text-[11px]">
              {warranty.partsUsed}
            </div>
          </div>

          {/* Validity Timeline */}
          <div className="flex items-center justify-between p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-mono">
            <div>
              <span className="text-[10px] uppercase block text-emerald-800">Coverage Duration</span>
              <span className="font-bold text-sm text-emerald-900">{warranty.warrantyDays} Days Comprehensive</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase block text-emerald-800">Valid Until</span>
              <span className="font-bold text-sm text-emerald-900">{warranty.expiryDate}</span>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-1.5 text-[11px] text-slate-600">
            <div className="font-bold text-slate-800 uppercase text-[10px]">Warranty Terms:</div>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
              {warranty.terms.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Claim Notice */}
        {claimInitiated ? (
          <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-xs text-emerald-900 font-medium space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>Warranty Claim Ticket #CLM-9912 Opened</span>
            </div>
            <p className="text-[11px]">
              {warranty.repairerName} and RepairSetu Trust & Safety have been alerted. Doorstep pickup re-inspection is authorized with zero diagnostic fees.
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Keep this digital record for future warranty claims.</span>
            <button
              onClick={() => setClaimInitiated(true)}
              className="text-indigo-600 font-bold hover:underline"
            >
              Initiate Claim Assistance
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <button
            onClick={() => {
              window.print();
            }}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download / Print PDF</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

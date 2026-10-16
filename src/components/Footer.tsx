import React from 'react';
import { Wrench, ShieldCheck, ArrowRight, Heart } from 'lucide-react';

interface FooterProps {
  onStartRequest: () => void;
  onNavigateSection: (sectionId: string) => void;
  onSwitchRole: (role: 'customer' | 'repairer' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onStartRequest,
  onNavigateSection,
  onSwitchRole,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      {/* High-Impact Final CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 lg:py-20 border-b border-slate-900">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-900/60 p-8 sm:p-12 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-700/60 text-indigo-300 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Guaranteed Transparent Quotations & Digital Warranties</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight max-w-2xl mx-auto leading-tight">
            Your device deserves more than a random repair shop.
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Get transparent quotes from Bhopal’s highest-rated electronics technicians in under 5 minutes. No surprise bills. No fake parts.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onStartRequest}
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition cursor-pointer"
            >
              <span>Start a Repair Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSwitchRole('repairer')}
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition"
            >
              Partner Workshop Login
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Wrench className="w-4 h-4" />
            </div>
            <span>RepairSetu</span>
          </div>

          <p className="text-slate-400 max-w-sm leading-relaxed text-xs">
            “Don’t just find a repairer. Find the right repairer.”
            The structured trust, quotation, and workflow platform for electronics repair across Bhopal and Madhya Pradesh.
          </p>

          <div className="text-[11px] text-slate-500 font-mono">
            Headquartered in MP Nagar, Bhopal · ISO-Compliant Repair Standards
          </div>
        </div>

        {/* Column 1: Marketplace */}
        <div className="space-y-3">
          <div className="font-bold text-white uppercase text-[11px] tracking-wider font-mono">Platform</div>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onNavigateSection('how-it-works')} className="hover:text-white transition">
                How It Works
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('why-us')} className="hover:text-white transition">
                Why RepairSetu
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('price-intel')} className="hover:text-white transition">
                Bhopal Price Index
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('comparison')} className="hover:text-white transition">
                Competitive Comparison
              </button>
            </li>
          </ul>
        </div>

        {/* Column 2: Supported Categories */}
        <div className="space-y-3">
          <div className="font-bold text-white uppercase text-[11px] tracking-wider font-mono">Device Categories</div>
          <ul className="space-y-2">
            <li>Smartphones (Samsung, Apple, OnePlus)</li>
            <li>Laptops & MacBooks</li>
            <li>iPads & Android Tablets</li>
            <li className="text-slate-600">Smart TVs (Phase 2)</li>
            <li className="text-slate-600">Gaming Consoles (Phase 2)</li>
          </ul>
        </div>

        {/* Column 3: Roles & Portals */}
        <div className="space-y-3">
          <div className="font-bold text-white uppercase text-[11px] tracking-wider font-mono">Demo Portals</div>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onSwitchRole('customer')} className="hover:text-teal-400 transition">
                Customer Workflow
              </button>
            </li>
            <li>
              <button onClick={() => onSwitchRole('repairer')} className="hover:text-teal-400 transition">
                TechCare Workshop Portal
              </button>
            </li>
            <li>
              <button onClick={() => onSwitchRole('admin')} className="hover:text-teal-400 transition">
                Trust & Safety Console
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal / Copyright */}
      <div className="border-t border-slate-900 py-6 max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <div>
          © 2026 RepairSetu Technologies Pvt. Ltd. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <span>Terms of Service</span>
          <span>·</span>
          <span>Privacy & Data Protection</span>
          <span>·</span>
          <span>Right to Repair Alignment</span>
        </div>
      </div>
    </footer>
  );
};

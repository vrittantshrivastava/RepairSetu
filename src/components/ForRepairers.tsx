import React from 'react';
import { 
  Store, 
  TrendingUp, 
  FileText, 
  ShieldCheck, 
  Award, 
  ArrowRight,
  CheckCircle,
  Users
} from 'lucide-react';

interface ForRepairersProps {
  onOpenRepairerDashboard: () => void;
}

export const ForRepairers: React.FC<ForRepairersProps> = ({ onOpenRepairerDashboard }) => {
  return (
    <section id="for-repairers" className="py-16 lg:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-800 text-teal-400 text-xs font-mono font-medium">
              <Store className="w-3.5 h-3.5" />
              <span>For Certified Repair Businesses</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Grow your repair workshop with structured digital customer demand.
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Stop relying on unpredictable walk-in foot traffic. RepairSetu connects vetted local technicians in Bhopal directly to high-intent smartphone, laptop, and tablet owners ready to get repairs done.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal-400" />
                  <span>Structured Inquiries</span>
                </div>
                <p className="text-slate-400">
                  Pre-classified device models, diagnostic symptoms, and photos before you even quote.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <span>Transparent Bidding</span>
                </div>
                <p className="text-slate-400">
                  Quote your fair rate, timeline, and parts quality. Compete on skill, not predatory price cutting.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Customer Cost Approvals</span>
                </div>
                <p className="text-slate-400">
                  Built-in digital workflow to request extra component approval with zero payment disputes.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Verified Reputation</span>
                </div>
                <p className="text-slate-400">
                  Collect authentic customer ratings and build a permanent digital track record in Bhopal.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={onOpenRepairerDashboard}
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-lg cursor-pointer"
              >
                <span>Launch Repairer Partner Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Zero onboarding fee during Bhopal rollout</span>
              </div>
            </div>
          </div>

          {/* Right Workshop Visual & Stats */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 shadow-2xl">
              {/* Image with fallback */}
              <div className="relative h-64 sm:h-72 w-full bg-slate-800">
                <img
                  src="/src/assets/images/verified_workshop_1791239310153.jpg"
                  alt="Verified RepairSetu Electronics Workshop"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Styled CSS fallback container
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-teal-500/90 text-slate-950 font-bold text-[10px] uppercase">
                      Audited Facility
                    </span>
                    <div className="text-white font-bold text-sm mt-1">TechCare Electronics · MP Nagar</div>
                    <div className="text-slate-300 text-[11px]">Bhopal Partner #08 · ESD-Safe Workstation Certified</div>
                  </div>
                  <div className="text-right font-mono text-teal-400 font-bold text-xs">
                    1,240 Repairs Logged
                  </div>
                </div>
              </div>

              {/* Partner Onboarding Criteria */}
              <div className="p-5 bg-slate-800/90 border-t border-slate-700/80 space-y-3">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Partner Verification Standards
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
                    <span>Physical Workshop Verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
                    <span>GST & Trade License Check</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
                    <span>Minimum 3-Year Bench Experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
                    <span>Agreement to 90-Day Warranty SLA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

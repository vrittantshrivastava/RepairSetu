import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Wrench, 
  Sparkles, 
  ChevronDown, 
  User, 
  Store, 
  ShieldAlert,
  ArrowRight,
  Menu,
  X,
  Compass
} from 'lucide-react';

interface NavbarProps {
  currentRole: 'customer' | 'repairer' | 'admin';
  onRoleChange: (role: 'customer' | 'repairer' | 'admin') => void;
  onStartRequest: () => void;
  onOpenTracking: (repairId?: string) => void;
  onOpenWarranty: () => void;
  onNavigateSection: (sectionId: string) => void;
  activeView: string;
  onJumpToDemo: (checkpoint: string) => void;
  onOpenNearbyMap?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  onStartRequest,
  onOpenTracking,
  onOpenWarranty,
  onNavigateSection,
  activeView,
  onJumpToDemo,
  onOpenNearbyMap,
}) => {
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Demo Bar / Quick Navigation Strip for Judges & Teammates */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto whitespace-nowrap scrollbar-none">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Interactive Prototype
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">Bhopal Hub (MP Nagar · Arera · Indrapuri)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 hidden md:inline">Jump demo checkpoint:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onJumpToDemo('request')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition"
              >
                1. Request Flow
              </button>
              <button
                onClick={() => onJumpToDemo('quotes')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition"
              >
                2. Quotations & Compare
              </button>
              <button
                onClick={() => onJumpToDemo('tracking')}
                className="px-2 py-0.5 rounded bg-indigo-900/80 text-indigo-200 hover:bg-indigo-900 text-[11px] font-bold transition flex items-center gap-1 border border-indigo-700/50"
                title="Live Tracker with real 2D/3D Map, Extruded Buildings & OSRM Route"
              >
                <span>3. Live Tracker with 2D/3D Map & Route</span>
              </button>
              <button
                onClick={() => onJumpToDemo('cost_approval')}
                className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 hover:bg-amber-900/80 text-[11px] font-medium transition"
              >
                4. Cost Approval (+₹300)
              </button>
              <button
                onClick={() => onJumpToDemo('chat')}
                className="px-2 py-0.5 rounded bg-teal-950/70 text-teal-300 hover:bg-teal-900/80 text-[11px] font-medium transition flex items-center gap-1"
              >
                <span>5. Chat with Repairer</span>
              </button>
              <button
                onClick={() => onJumpToDemo('warranty')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition"
              >
                6. Digital Warranty
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Top Bar adhering to 3-zone contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand Title Element */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigateSection('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-200">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight font-sans">
                Repair<span className="text-indigo-600">Setu</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Clean Single-line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button 
            onClick={() => onNavigateSection('how-it-works')} 
            className="hover:text-indigo-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            How It Works
          </button>
          <button 
            onClick={() => onNavigateSection('why-us')} 
            className="hover:text-indigo-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            Why RepairSetu
          </button>
          <button 
            onClick={() => onNavigateSection('price-intel')} 
            className="hover:text-indigo-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            Fair Price Index
          </button>
          <button 
            onClick={() => onNavigateSection('comparison')} 
            className="hover:text-indigo-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            Market Comparison
          </button>
          <button 
            onClick={() => onOpenTracking('RS-BPL-10482')} 
            className="hover:text-indigo-600 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer text-slate-800 font-semibold px-2 py-1 rounded-lg hover:bg-slate-100"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>Live Tracker & Map</span>
          </button>
          <button 
            onClick={onOpenWarranty} 
            className="hover:text-indigo-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            Warranty Vault
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Role Switching */}
        <div className="flex items-center gap-2.5">
          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 whitespace-nowrap"
              title="Switch user perspective"
            >
              {currentRole === 'customer' && <User className="w-3.5 h-3.5 text-indigo-600" />}
              {currentRole === 'repairer' && <Store className="w-3.5 h-3.5 text-emerald-600" />}
              {currentRole === 'admin' && <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />}
              <span className="capitalize">{currentRole} View</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {demoMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs"
                onMouseLeave={() => setDemoMenuOpen(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Interface Role
                </div>
                <button
                  onClick={() => {
                    onRoleChange('customer');
                    setDemoMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-start gap-2.5 hover:bg-slate-50 transition ${
                    currentRole === 'customer' ? 'bg-indigo-50/70 text-indigo-900 font-semibold' : 'text-slate-700'
                  }`}
                >
                  <User className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium">Customer Experience</div>
                    <div className="text-[11px] text-slate-500 font-normal">Book, compare quotes, live tracking & warranty</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onRoleChange('repairer');
                    setDemoMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-start gap-2.5 hover:bg-slate-50 transition ${
                    currentRole === 'repairer' ? 'bg-emerald-50/70 text-emerald-900 font-semibold' : 'text-slate-700'
                  }`}
                >
                  <Store className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium">Repair Partner Dashboard</div>
                    <div className="text-[11px] text-slate-500 font-normal">TechCare MP Nagar: quotes, job queue & approvals</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onRoleChange('admin');
                    setDemoMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-start gap-2.5 hover:bg-slate-50 transition ${
                    currentRole === 'admin' ? 'bg-rose-50/70 text-rose-900 font-semibold' : 'text-slate-700'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium">Admin & Trust/Safety Console</div>
                    <div className="text-[11px] text-slate-500 font-normal">Verification, anomaly radar & dispute audit</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Primary CTA */}
          <button
            onClick={onStartRequest}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all duration-200 whitespace-nowrap cursor-pointer active:scale-95"
          >
            <span>Get Repair Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <button 
              onClick={() => { onNavigateSection('how-it-works'); setMobileMenuOpen(false); }} 
              className="text-left py-2 hover:text-indigo-600"
            >
              How It Works
            </button>
            <button 
              onClick={() => { onNavigateSection('why-us'); setMobileMenuOpen(false); }} 
              className="text-left py-2 hover:text-indigo-600"
            >
              Why RepairSetu
            </button>
            <button 
              onClick={() => { onNavigateSection('price-intel'); setMobileMenuOpen(false); }} 
              className="text-left py-2 hover:text-indigo-600"
            >
              Fair Price Index
            </button>
            <button 
              onClick={() => { onNavigateSection('comparison'); setMobileMenuOpen(false); }} 
              className="text-left py-2 hover:text-indigo-600"
            >
              Market Comparison
            </button>
            <button 
              onClick={() => { onOpenTracking('RS-BPL-10482'); setMobileMenuOpen(false); }} 
              className="text-left py-2 text-indigo-700 font-semibold flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span>Live Tracker & Map (Bhopal)</span>
            </button>
            <button 
              onClick={() => { onOpenWarranty(); setMobileMenuOpen(false); }} 
              className="text-left py-2 hover:text-indigo-600"
            >
              Digital Warranty Vault
            </button>
          </div>
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => { onStartRequest(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-center text-sm shadow"
            >
              Start Repair Request
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

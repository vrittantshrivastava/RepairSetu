import React from 'react';
import { 
  Smartphone, 
  Laptop, 
  Tablet, 
  Tv, 
  Gamepad2, 
  Watch, 
  ArrowRight,
  Sparkles,
  Check
} from 'lucide-react';
import { SUPPORTED_CATEGORIES } from '../data/mockData';
import { DeviceCategory } from '../types';

interface CategoriesProps {
  onSelectCategory: (category: DeviceCategory) => void;
}

export const Categories: React.FC<CategoriesProps> = ({ onSelectCategory }) => {
  const futureCategories = [
    { name: 'Smart TVs & Monitors', icon: Tv, tag: 'Bhopal Phase 2' },
    { name: 'Gaming Consoles', icon: Gamepad2, tag: 'PS5 & Xbox' },
    { name: 'Smartwatches', icon: Watch, tag: 'Apple & Galaxy Watch' },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 font-mono">
              Supported Hardware Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Specialized device repair categories
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Every device category has distinct diagnostic procedures, precision jigs, and component sourcing networks.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-500 bg-slate-100 px-3.5 py-2 rounded-lg shrink-0">
            Active Hub: Bhopal, MP · Expanding to Indore & Jabalpur
          </div>
        </div>

        {/* 3 Core Primary Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUPPORTED_CATEGORIES.map((cat) => {
            const Icon = 
              cat.id === 'smartphone' ? Smartphone :
              cat.id === 'laptop' ? Laptop : Tablet;

            return (
              <div
                key={cat.id}
                className="group relative bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-indigo-500 p-6 sm:p-8 transition-all duration-200 shadow-xs hover:shadow-lg flex flex-col justify-between space-y-6 cursor-pointer"
                onClick={() => onSelectCategory(cat.id)}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100/70 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-mono">
                      {cat.typicalRepairs}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-200/60 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-teal-600" />
                      <span>Certified logic-board bench diagnosis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-teal-600" />
                      <span>OEM grade & genuine calibrated parts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-teal-600" />
                      <span>Up to 180-day digital warranty guarantee</span>
                    </div>
                  </div>
                </div>

                <button className="w-full py-2.5 px-4 rounded-xl bg-white group-hover:bg-indigo-600 group-hover:text-white border border-slate-300 group-hover:border-indigo-600 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all">
                  <span>Start {cat.name} Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Future Expandable Categories Banner */}
        <div className="bg-slate-50/80 rounded-xl border border-dashed border-slate-300 p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800">Coming soon to the Bhopal Network:</span>
              <span className="text-slate-500 ml-1.5">Smart TVs, Gaming Consoles (PS5/Xbox), Smartwatches & Audio gear.</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {futureCategories.map((item, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded bg-white border border-slate-200 text-[11px] text-slate-600 font-medium">
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

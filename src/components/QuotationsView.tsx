import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Star, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Truck, 
  Store, 
  Scale, 
  ArrowRight, 
  Check, 
  X, 
  Info, 
  ExternalLink,
  Filter,
  Sparkles,
  Award,
  AlertTriangle
} from 'lucide-react';
import { Quotation, RepairRequest, RepairerProfile } from '../types';

interface QuotationsViewProps {
  request: RepairRequest;
  quotations: Quotation[];
  onSelectQuotation: (quotation: Quotation) => void;
  onBackToEdit: () => void;
}

export const QuotationsView: React.FC<QuotationsViewProps> = ({
  request,
  quotations,
  onSelectQuotation,
  onBackToEdit,
}) => {
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<RepairerProfile | null>(null);
  const [sortBy, setSortBy] = useState<'recommended' | 'price' | 'time' | 'rating'>('recommended');

  // Loading animation simulation
  useEffect(() => {
    const timer1 = setTimeout(() => setLoadingStep(1), 700);
    const timer2 = setTimeout(() => setLoadingStep(2), 1400);
    const timer3 = setTimeout(() => {
      setLoading(false);
      // Pre-select top 2 for easy comparison demonstration
      if (quotations.length >= 2) {
        setSelectedForCompare([quotations[0].id, quotations[1].id]);
      }
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [quotations]);

  const toggleCompare = (quoteId: string) => {
    if (selectedForCompare.includes(quoteId)) {
      setSelectedForCompare(selectedForCompare.filter((id) => id !== quoteId));
    } else {
      if (selectedForCompare.length >= 3) {
        alert('You can compare up to 3 repairers simultaneously.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, quoteId]);
    }
  };

  const sortedQuotations = [...quotations].sort((a, b) => {
    if (sortBy === 'price') return a.amount - b.amount;
    if (sortBy === 'time') return a.estimatedHours - b.estimatedHours;
    if (sortBy === 'rating') return b.repairer.rating - a.repairer.rating;
    return 0; // recommended order
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-indigo-700">
            {loadingStep === 0 && '25%'}
            {loadingStep === 1 && '68%'}
            {loadingStep === 2 && '94%'}
          </div>
        </div>

        <div className="space-y-2 max-w-md">
          <h3 className="text-xl font-bold text-slate-900">
            Finding verified repair partners in Bhopal...
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            {loadingStep === 0 && 'Broadcasting anonymous request to verified workshops in MP Nagar, Arera & Indrapuri...'}
            {loadingStep === 1 && `Matching ${request.brand} ${request.model} parts inventory & bench availability...`}
            {loadingStep === 2 && 'Calibrating quotation transparency & warranty assurances...'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Bhopal Active Hub · 4 workshops currently bidding</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Banner with Request Context */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider font-mono">
            <span>{quotations.length} Verified Quotations Received</span>
            <span>·</span>
            <span className="text-slate-500">{request.city} ({request.area})</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Compare repairers for your {request.brand} {request.model}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Issue: <span className="font-semibold text-slate-700">{request.issue}</span> · Service:{' '}
            <span className="font-semibold text-slate-700 capitalize">{request.serviceType}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="recommended">Best Match / Recommended</option>
              <option value="price">Lowest Price</option>
              <option value="time">Fastest Turnaround</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>

          {selectedForCompare.length >= 2 && (
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition animate-bounce cursor-pointer"
            >
              <Scale className="w-4 h-4" />
              <span>Compare Selected ({selectedForCompare.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Comparison Drawer if repairers are checked */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-teal-400" />
            <span className="font-bold">{selectedForCompare.length} repairers selected</span>
          </div>
          <div className="h-4 w-px bg-slate-700"></div>
          <button
            onClick={() => setShowCompareModal(true)}
            className="px-3.5 py-1.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-lg transition"
          >
            Launch Comparison Table
          </button>
          <button
            onClick={() => setSelectedForCompare([])}
            className="text-slate-400 hover:text-white"
          >
            Clear
          </button>
        </div>
      )}

      {/* Quotation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedQuotations.map((quote) => {
          const isSelected = selectedForCompare.includes(quote.id);
          const rep = quote.repairer;

          return (
            <div
              key={quote.id}
              className={`relative bg-white rounded-2xl border transition-all duration-200 p-6 flex flex-col justify-between space-y-5 shadow-xs hover:shadow-md ${
                isSelected ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{rep.name}</h3>
                      {rep.verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>Verified Partner</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-mono">
                      <span className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {rep.rating}
                      </span>
                      <span>({rep.reviewCount} reviews)</span>
                      <span>·</span>
                      <span>{rep.completedRepairs.toLocaleString()} repairs</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {rep.distanceKm} km ({rep.area})
                      </span>
                    </div>
                  </div>

                  {/* Badge */}
                  {rep.badge && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-tight uppercase font-mono bg-indigo-50 text-indigo-800 border border-indigo-100">
                      {rep.badge}
                    </span>
                  )}
                </div>

                {/* Pricing & Key Metrics Bar */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-500">Quoted Price</div>
                    <div className="text-xl font-extrabold text-slate-900 font-mono mt-0.5">
                      ₹{quote.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">All inclusive</div>
                  </div>

                  <div className="border-x border-slate-200">
                    <div className="text-[10px] uppercase font-mono text-slate-500">Estimated Time</div>
                    <div className="text-sm font-bold text-slate-800 mt-1 font-mono flex items-center justify-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{quote.estimatedHours} Hours</span>
                    </div>
                    <div className="text-[10px] text-slate-500">Ready tomorrow</div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-500">Warranty</div>
                    <div className="text-sm font-bold text-emerald-700 mt-1 font-mono">
                      {quote.warrantyDays} Days
                    </div>
                    <div className="text-[10px] text-emerald-800 font-medium">Digital Record</div>
                  </div>
                </div>

                {/* Parts & Pickup Meta */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-500">Components Used:</span>
                    <span className="font-semibold text-slate-800">{quote.partsType}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-500">Pickup & Delivery:</span>
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      {quote.pickupAvailable ? 'Doorstep pickup in Bhopal included' : 'Workshop walk-in only'}
                    </span>
                  </div>

                  <div className="pt-2 text-slate-600 text-[11px] italic bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                    “{quote.notes}”
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleCompare(quote.id)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{isSelected ? 'Selected' : 'Compare'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewingProfile(rep)}
                    className="text-xs font-medium text-slate-600 hover:text-indigo-600 underline underline-offset-4"
                  >
                    View Details
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectQuotation(quote)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                >
                  <span>Choose Repairer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SIDE-BY-SIDE COMPARISON MODAL */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-indigo-600">
                  Side-By-Side Comparison Matrix
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  Comparing Selected Bhopal Repair Partners
                </h3>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-3 font-semibold text-slate-500 w-1/4">Metric</th>
                    {selectedForCompare.map((quoteId) => {
                      const q = quotations.find((i) => i.id === quoteId);
                      if (!q) return null;
                      return (
                        <th key={q.id} className="py-3 px-3 font-bold text-slate-900 text-center">
                          <div className="text-sm">{q.repairer.name}</div>
                          {q.repairer.badge && (
                            <span className="text-[10px] font-mono text-indigo-600 font-medium">
                              {q.repairer.badge}
                            </span>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {/* Price */}
                  <tr>
                    <td className="py-3 px-3 text-slate-500">Quoted Price</td>
                    {selectedForCompare.map((quoteId) => {
                      const q = quotations.find((i) => i.id === quoteId);
                      if (!q) return null;
                      return (
                        <td key={q.id} className="py-3 px-3 text-center font-bold text-base font-mono text-indigo-700">
                          ₹{q.amount.toLocaleString('en-IN')}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Repair Time */}
                  <tr>
                    <td className="py-3 px-3 text-slate-500">Repair Turnaround</td>
                    {selectedForCompare.map((quoteId) => {
                      const q = quotations.find((i) => i.id === quoteId);
                      if (!q) return null;
                      return (
                        <td key={q.id} className="py-3 px-3 text-center font-mono text-slate-800">
                          {q.estimatedHours} Hours
                        </td>
                      );
                    })}
                  </tr>

                  {/* Warranty */}
                  <tr>
                    <td className="py-3 px-3 text-slate-500">Warranty Coverage</td>
                    {selectedForCompare.map((quoteId) => {
                      const q = quotations.find((i) => i.id === quoteId);
                      if (!q) return null;
                      return (
                        <td key={q.id} className="py-3 px-3 text-center font-bold text-emerald-700 font-mono">
                          {q.warrantyDays} Days Digital Guarantee
                        </td>
                      );
                    })}
                  </tr>

                  {/* Parts Type */}
                  <tr>
                    <td className="py-3 px-3 text-slate-500">Component Specification</td>
                    {selectedForCompare.map((quoteId) => {
                      const q = quotations.find((i) => i.id === quoteId);
                      if (!q) return null;
                      return (
                        <td key={q.id} className="py-3 px-3 text-center text-slate-800">
                          {q.partsType}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Rating */}
                  <tr>
                    <td className="py-3 px-3 text-slate-500">Customer Rating</td>
                    {selectedForCompare.map((quoteId) => {
                      const q = quotations.find((i) => i.id === quoteId);
                      if (!q) return null;
                      return (
                        <td key={q.id} className="py-3 px-3 text-center text-amber-600 font-bold">
                          {q.repairer.rating} ★ ({q.repairer.reviewCount})
                        </td>
                      );
                    })}
                  </tr>

                  {/* Completed Repairs */}
                  <tr>
                    <td className="py-3 px-3 text-slate-500">Completed Repairs</td>
                    {selectedForCompare.map((quoteId) => {
                      const q = quotations.find((i) => i.id === quoteId);
                      if (!q) return null;
                      return (
                        <td key={q.id} className="py-3 px-3 text-center text-slate-700 font-mono">
                          {q.repairer.completedRepairs} jobs in Bhopal
                        </td>
                      );
                    })}
                  </tr>

                  {/* Distance */}
                  <tr>
                    <td className="py-3 px-3 text-slate-500">Distance from {request.area}</td>
                    {selectedForCompare.map((quoteId) => {
                      const q = quotations.find((i) => i.id === quoteId);
                      if (!q) return null;
                      return (
                        <td key={q.id} className="py-3 px-3 text-center text-slate-700">
                          {q.repairer.distanceKm} km ({q.repairer.area})
                        </td>
                      );
                    })}
                  </tr>

                  {/* Pickup */}
                  <tr>
                    <td className="py-3 px-3 text-slate-500">Pickup & Drop Support</td>
                    {selectedForCompare.map((quoteId) => {
                      const q = quotations.find((i) => i.id === quoteId);
                      if (!q) return null;
                      return (
                        <td key={q.id} className="py-3 px-3 text-center text-emerald-700">
                          {q.pickupAvailable ? 'Included' : 'Walk-in only'}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Action CTA */}
                  <tr className="bg-slate-50">
                    <td className="py-4 px-3 text-slate-500">Select</td>
                    {selectedForCompare.map((quoteId) => {
                      const q = quotations.find((i) => i.id === quoteId);
                      if (!q) return null;
                      return (
                        <td key={q.id} className="py-4 px-3 text-center">
                          <button
                            onClick={() => {
                              setShowCompareModal(false);
                              onSelectQuotation(q);
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition"
                          >
                            Choose {q.repairer.name.split(' ')[0]}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPAIRER DETAIL MODAL */}
      {viewingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">{viewingProfile.name}</h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Verified Workshop
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-mono">
                  <span className="text-amber-600 font-bold">{viewingProfile.rating} ★</span>
                  <span>({viewingProfile.reviewCount} customer reviews)</span>
                  <span>·</span>
                  <span>{viewingProfile.experienceYears} Years Experience</span>
                </div>
              </div>
              <button
                onClick={() => setViewingProfile(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="space-y-4 text-xs text-slate-700">
              <div>
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Workshop Address</div>
                <p className="mt-1 text-slate-600">{viewingProfile.address}</p>
                <div className="text-[11px] text-slate-500 mt-0.5">Hours: {viewingProfile.openingHours}</div>
              </div>

              <div>
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Technical Specialties</div>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {viewingProfile.specialties.map((spec, i) => (
                    <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-800 rounded font-medium text-[11px]">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">Component Policy</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{viewingProfile.partsPolicy}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">Warranty Policy</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{viewingProfile.warrantyPolicy}</p>
                </div>
              </div>

              {/* Customer Reviews */}
              <div className="space-y-3 pt-2">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Verified Customer Reviews in Bhopal
                </div>
                <div className="space-y-2.5">
                  {viewingProfile.reviews.map((rev) => (
                    <div key={rev.id} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-900">{rev.author}</span>
                        <span className="text-slate-400">{rev.date}</span>
                      </div>
                      <div className="text-[11px] text-indigo-700 font-medium">Repaired: {rev.device}</div>
                      <p className="text-slate-600 text-xs">“{rev.comment}”</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setViewingProfile(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const matchingQuote = quotations.find((q) => q.repairerId === viewingProfile.id);
                  if (matchingQuote) {
                    setViewingProfile(null);
                    onSelectQuotation(matchingQuote);
                  }
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Select {viewingProfile.name}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

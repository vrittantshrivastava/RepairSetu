import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Laptop, 
  Tablet, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  MapPin, 
  Truck, 
  Store, 
  Zap, 
  ShieldCheck, 
  Upload, 
  Camera, 
  X, 
  AlertCircle,
  Map
} from 'lucide-react';
import { 
  POPULAR_DEVICES, 
  COMMON_ISSUES, 
  BHOPAL_AREAS, 
  classifyIssueWithAI 
} from '../data/mockData';
import { 
  DeviceCategory, 
  RepairRequest, 
  ServiceType, 
  RepairPriority 
} from '../types';

interface RequestWizardProps {
  initialCategory?: DeviceCategory;
  onSubmit: (request: RepairRequest) => void;
  onCancel: () => void;
  onOpenMap?: () => void;
}

export const RequestWizard: React.FC<RequestWizardProps> = ({
  initialCategory = 'smartphone',
  onSubmit,
  onCancel,
  onOpenMap,
}) => {
  const [step, setStep] = useState<number>(1);
  const [category, setCategory] = useState<DeviceCategory>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>('Samsung');
  const [selectedModel, setSelectedModel] = useState<string>('Galaxy S24 / S24 Ultra');
  const [selectedIssue, setSelectedIssue] = useState<string>('Screen Damage / Display Glitch');
  const [customDescription, setCustomDescription] = useState<string>(
    'Screen cracked after a small drop on tile floor. Touch works on the top half, but the bottom half flickers with faint green lines.'
  );
  const [city, setCity] = useState<string>('Bhopal, Madhya Pradesh');
  const [area, setArea] = useState<string>('MP Nagar Zone II');
  const [pincode, setPincode] = useState<string>('462011');
  const [serviceType, setServiceType] = useState<ServiceType>('pickup');
  const [priority, setPriority] = useState<RepairPriority>('standard');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80',
  ]);
  const [customerName, setCustomerName] = useState<string>('Aman Saxena');
  const [customerPhone, setCustomerPhone] = useState<string>('+91 98260 44120');

  // Filter devices for selected category
  const filteredDevices = POPULAR_DEVICES.filter((d) => d.category === category);
  const availableBrands = Array.from(new Set(filteredDevices.map((d) => d.brand)));

  // Synchronize model options when brand changes
  useEffect(() => {
    const brandDevices = filteredDevices.filter((d) => d.brand === selectedBrand);
    if (brandDevices.length > 0) {
      setSelectedModel(brandDevices[0].model);
    }
  }, [selectedBrand, category]);

  // AI preliminary classification result
  const aiResult = classifyIssueWithAI(
    `${selectedBrand} ${selectedModel} ${selectedIssue}`,
    customDescription
  );

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinalSubmit = () => {
    const newRequest: RepairRequest = {
      id: `REQ-${Date.now().toString().slice(-5)}`,
      category,
      brand: selectedBrand,
      model: selectedModel,
      issue: selectedIssue,
      customDescription,
      aiClassification: aiResult,
      city,
      area,
      pincode,
      serviceType,
      priority,
      images: uploadedPhotos,
      createdAt: new Date().toISOString(),
      customerName,
      customerPhone,
    };
    onSubmit(newRequest);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden my-6">
        {/* Modal Top Header with Stepper */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center justify-between pb-3">
            <div>
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-indigo-600">
                Step {step} of 5 · Repair Request
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {step === 1 && 'Select Your Device'}
                {step === 2 && 'Describe the Problem'}
                {step === 3 && 'Location & Service Area'}
                {step === 4 && 'Pickup & Priority Preferences'}
                {step === 5 && 'Review Request & Find Repairers'}
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex">
            <div
              className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: SELECT DEVICE */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  1. What device needs repair?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCategory('smartphone');
                      setSelectedBrand('Samsung');
                    }}
                    className={`p-3.5 rounded-xl border text-center flex flex-col items-center gap-2 transition cursor-pointer ${
                      category === 'smartphone'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 font-medium'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs">Smartphone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCategory('laptop');
                      setSelectedBrand('Apple');
                    }}
                    className={`p-3.5 rounded-xl border text-center flex flex-col items-center gap-2 transition cursor-pointer ${
                      category === 'laptop'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 font-medium'
                    }`}
                  >
                    <Laptop className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs">Laptop / PC</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCategory('tablet');
                      setSelectedBrand('Apple');
                    }}
                    className={`p-3.5 rounded-xl border text-center flex flex-col items-center gap-2 transition cursor-pointer ${
                      category === 'tablet'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 font-medium'
                    }`}
                  >
                    <Tablet className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs">Tablet / iPad</span>
                  </button>
                </div>
              </div>

              {/* Brand Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. Select Brand
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableBrands.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBrand(b)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium border transition cursor-pointer ${
                        selectedBrand === b
                          ? 'border-indigo-600 bg-indigo-600 text-white font-semibold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  3. Select Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  {filteredDevices
                    .filter((d) => d.brand === selectedBrand)
                    .map((d) => (
                      <option key={d.id} value={d.model}>
                        {d.model}
                      </option>
                    ))}
                </select>
                <div className="text-[11px] text-slate-500">
                  Can't find your exact variant? You can specify exact sub-model details in the next step.
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT ISSUE & AI CLASSIFICATION */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Primary Issue Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {COMMON_ISSUES.map((issue) => (
                    <button
                      key={issue.id}
                      type="button"
                      onClick={() => setSelectedIssue(issue.name)}
                      className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                        selectedIssue === issue.name
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-medium'
                      }`}
                    >
                      <div className="truncate">{issue.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        ~₹{issue.typicalCostRange.min} - ₹{issue.typicalCostRange.max}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Describe what happened (symptoms, drop, liquid, etc.)
                </label>
                <textarea
                  rows={3}
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="e.g. dropped on floor, sound works but black screen, battery discharges from 40% to 0% suddenly..."
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              {/* AI-Assisted Preliminary Classification Box */}
              <div className="rounded-xl bg-indigo-50/70 border border-indigo-200/80 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>AI-Assisted Preliminary Classification</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    {aiResult.confidence} confidence
                  </span>
                </div>

                <div className="font-semibold text-indigo-900">
                  Probable Diagnosis: {aiResult.primaryCategory}
                  {aiResult.secondaryCategory && (
                    <span className="text-indigo-700 font-normal"> · Sub-check: {aiResult.secondaryCategory}</span>
                  )}
                </div>

                <p className="text-indigo-950/80 text-[11px] leading-relaxed">
                  {aiResult.explanation}
                </p>

                <div className="pt-1 text-[10px] text-indigo-700/80 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-indigo-500 shrink-0" />
                  <span>
                    Note: This is an AI-assisted preliminary triage and not a definitive hardware diagnosis. Final bench inspection occurs at the workshop.
                  </span>
                </div>
              </div>

              {/* Optional Photos */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                  <span>Attach Device Photos (Optional)</span>
                  <span className="text-[11px] text-slate-400 font-normal">Helps repairers quote accurately</span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden relative group">
                    <img 
                      src={uploadedPhotos[0]} 
                      alt="Device damage preview" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <span className="text-[10px] text-white font-medium">1 photo</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      alert('Demo: Sample photo attached. In production, users can upload from camera or gallery.');
                    }}
                    className="h-16 px-4 rounded-xl border border-dashed border-slate-300 hover:border-indigo-400 text-slate-600 hover:text-indigo-600 text-xs flex items-center gap-2 transition"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Upload more</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: LOCATION */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Target City
                </label>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <span>Bhopal, Madhya Pradesh</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded">
                    Active Market Hub
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Your Area in Bhopal
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  {BHOPAL_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-500">
                  We use your locality to calculate verified workshop distance and doorstep pickup availability.
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Area Pincode
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 462011"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">Privacy Notice:</div>
                <p className="text-[11px]">
                  Your exact home address is only shared with the single workshop you choose after reviewing bids. Unselected workshops only see the locality.
                </p>
              </div>

              {onOpenMap && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={onOpenMap}
                    className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <Map className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Or Explore & Select Nearby Repair Stores on Map</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: PREFERENCES & CONTACT */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Service Mode Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setServiceType('pickup')}
                    className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                      serviceType === 'pickup'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold">Doorstep Pickup & Drop</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Verified runner collects device with tamper-proof bag & digital handoff receipt.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType('visit')}
                    className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                      serviceType === 'visit'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Store className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold">Visit Repair Workshop</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Drop off device directly at the selected partner’s verified physical center in Bhopal.
                    </p>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Priority Speed
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPriority('standard')}
                    className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                      priority === 'standard'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-medium'
                    }`}
                  >
                    <div className="font-bold">Standard Turnaround</div>
                    <div className="text-[11px] text-slate-500 font-normal">Within 24–48 hours</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPriority('express')}
                    className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                      priority === 'express'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-medium'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>Express / Same-Day</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">Priority bench queue</div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Your Name (Demo Contact)
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Mobile Phone (For Quote Alerts)
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: SUMMARY & DISPATCH */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="font-bold text-slate-900 uppercase tracking-wider">
                    Repair Request Summary
                  </span>
                  <span className="text-[11px] font-mono text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                    Ready to Dispatch
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Device Model</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedBrand} {selectedModel}
                    </span>
                    <span className="text-[11px] text-slate-500 block capitalize">Category: {category}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Reported Fault</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedIssue}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold block">
                      AI: {aiResult.primaryCategory}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Location</span>
                    <span className="font-semibold text-slate-800">
                      {area}, Bhopal ({pincode})
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Preferences</span>
                    <span className="font-semibold text-slate-800 capitalize">
                      {serviceType === 'pickup' ? 'Doorstep Pickup' : 'Shop Visit'} · {priority} speed
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-slate-600 text-[11px]">
                  <span className="font-semibold text-slate-800">Customer Description:</span> "{customDescription}"
                </div>
              </div>

              {/* Zero-Spam / Transparency Promise */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>The RepairSetu Privacy & Zero-Spam Promise</span>
                </div>
                <p className="text-[11px] text-emerald-900/90 leading-relaxed">
                  Your phone number will never be sold or spammed by random call centers. Only verified Bhopal workshops registered on RepairSetu can submit bids for your job.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-6 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-2 shadow-md hover:shadow-indigo-600/30 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Find Verified Repairers</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

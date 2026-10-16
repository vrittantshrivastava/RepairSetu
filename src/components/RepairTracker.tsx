import React, { useState, useMemo, useRef } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Wrench, 
  Phone, 
  FileCheck, 
  ArrowRight, 
  Sparkles, 
  Award, 
  Play, 
  Check, 
  X, 
  CreditCard, 
  MessageSquare, 
  Navigation, 
  Compass, 
  Box, 
  Layers, 
  Search, 
  SlidersHorizontal, 
  Star, 
  Info,
  Maximize2
} from 'lucide-react';
import { ActiveRepairJob, RepairStatus, ChatMessage, NearbyRepairStore, UserLocation } from '../types';
import { RepairChatDrawer } from './RepairChatDrawer';
import { InteractiveRepairMap } from './InteractiveRepairMap';
import { getStoresWithDistances, calculateDistanceKm } from '../data/nearbyStoresData';

interface RepairTrackerProps {
  job: ActiveRepairJob;
  onUpdateJob: (updatedJob: ActiveRepairJob) => void;
  onOpenWarranty: () => void;
}

const ORDERED_STATUSES: { key: RepairStatus; label: string; desc: string }[] = [
  { key: 'request_submitted', label: 'Request Submitted', desc: 'Customer placed inquiry' },
  { key: 'repairer_accepted', label: 'Repairer Accepted', desc: 'Workshop accepted bench booking' },
  { key: 'device_received', label: 'Device Received', desc: 'Arrived at workshop bench' },
  { key: 'diagnosis_in_progress', label: 'Diagnosis in Progress', desc: 'Bench multimeter & optic inspection' },
  { key: 'cost_approval_pending', label: 'Cost Approval Pending', desc: 'Diagnostic discovery awaiting authorization' },
  { key: 'repair_in_progress', label: 'Repair in Progress', desc: 'Precision parts installation' },
  { key: 'quality_check', label: 'Quality Check', desc: '18-point hardware & touch testing' },
  { key: 'ready_for_delivery', label: 'Ready for Delivery', desc: 'Packaged in tamper-proof seal' },
  { key: 'completed', label: 'Completed', desc: 'Delivered & Warranty Activated' },
];

type SortOption = 'nearest' | 'highest_rated' | 'fastest_repair' | 'best_warranty' | 'price_low';

function parsePriceLow(priceRange?: string, startingPrice?: number): number {
  if (priceRange) {
    const match = priceRange.match(/₹([0-9,]+)/);
    if (match) return parseInt(match[1].replace(/,/g, ''), 10);
  }
  return startingPrice || 9999;
}

function parseWarrantyDays(warranty?: string, days?: number): number {
  if (days) return days;
  if (warranty) {
    const match = warranty.match(/(\d+)\s*Days/i);
    if (match) return parseInt(match[1], 10);
  }
  return 0;
}

export const RepairTracker: React.FC<RepairTrackerProps> = ({
  job,
  onUpdateJob,
  onOpenWarranty,
}) => {
  const [costModalOpen, setCostModalOpen] = useState(
    job.status === 'diagnosis_in_progress' || job.status === 'cost_approval_pending'
  );
  const [paymentDone, setPaymentDone] = useState(job.paymentStatus === 'paid');
  const [chatOpen, setChatOpen] = useState(false);

  // Geolocation and map controls state
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation>({
    city: 'Bhopal, Madhya Pradesh',
    area: job.request.area || 'MP Nagar Zone II',
    pincode: job.request.pincode || '462011',
    latitude: 23.2384,
    longitude: 77.4012,
    source: 'preset',
  });

  // Repairer search, filter, and selection state (Consolidating Real Bhopal Map features)
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState<SortOption>('nearest');
  const [selectedMapStoreId, setSelectedMapStoreId] = useState<string | null>('store-techcare');
  const [detailModalStore, setDetailModalStore] = useState<NearbyRepairStore | null>(null);

  // Card element references for smooth scrolling when a map marker is clicked
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Dynamic stores computed with distances relative to active user coordinates
  const allStores = useMemo(() => {
    return getStoresWithDistances(userLocation.latitude, userLocation.longitude);
  }, [userLocation.latitude, userLocation.longitude]);

  // Target assigned workshop bench for the active repair job
  const targetWorkshop = useMemo(() => {
    return allStores.find((s) => s.id === 'store-techcare') || allStores[0];
  }, [allStores]);

  // Active route target store (defaults to assigned workshop)
  const [routeTargetStore, setRouteTargetStore] = useState<NearbyRepairStore | null>(targetWorkshop);

  // Browser Geolocation handler with graceful fallback to Bhopal center
  const handleMyLocation = () => {
    setIsLocating(true);
    setLocationNotice(null);

    if (!navigator.geolocation) {
      setIsLocating(false);
      setLocationNotice('Geolocation is not supported by your browser. Keeping Bhopal map center.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        setUserLocation({
          city: 'Bhopal, Madhya Pradesh',
          area: 'Detected Location',
          pincode: '462011',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          source: 'gps',
        });
        setLocationNotice('Map centered around your location in Bhopal.');
      },
      () => {
        setIsLocating(false);
        setLocationNotice('Location access not granted. Map centered around Bhopal, Madhya Pradesh.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Two-way interaction: marker click scrolls card into view
  const handleSelectStoreFromMap = (storeId: string) => {
    setSelectedMapStoreId(storeId);
    if (cardRefs.current[storeId]) {
      cardRefs.current[storeId]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Card click: highlights marker & centers map (does NOT auto-calculate route per Step 3 spec)
  const handleCardClick = (store: NearbyRepairStore) => {
    setSelectedMapStoreId(store.id);
  };

  // View Route action: calculates OSRM driving route, fits road geometry, and displays route card
  const handleViewRoute = (store: NearbyRepairStore) => {
    setSelectedMapStoreId(store.id);
    setRouteTargetStore(store);
  };

  // Filtered and sorted repairers list
  const filteredAndSortedRepairers = useMemo(() => {
    let list = allStores.filter((store) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchName = store.name.toLowerCase().includes(q);
      const matchArea = store.area.toLowerCase().includes(q);
      const matchAddress = store.address.toLowerCase().includes(q);
      const matchServices = store.services.some((s) => s.toLowerCase().includes(q));
      const matchDevices = store.devices.some((d) => d.toLowerCase().includes(q));
      return matchName || matchArea || matchAddress || matchServices || matchDevices;
    });

    return list.sort((a, b) => {
      if (activeSort === 'nearest') {
        return a.distanceKm - b.distanceKm;
      }
      if (activeSort === 'highest_rated') {
        return b.rating - a.rating;
      }
      if (activeSort === 'fastest_repair') {
        return a.estimatedHours - b.estimatedHours;
      }
      if (activeSort === 'best_warranty') {
        return parseWarrantyDays(b.warranty, b.warrantyDays) - parseWarrantyDays(a.warranty, a.warrantyDays);
      }
      if (activeSort === 'price_low') {
        return parsePriceLow(a.priceRange, a.startingPrice) - parsePriceLow(b.priceRange, b.startingPrice);
      }
      return 0;
    });
  }, [allStores, searchQuery, activeSort]);

  const handleSendMessage = (text: string, sender: 'customer' | 'repairer') => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender,
      senderName: sender === 'customer' ? (job.request.customerName || 'Aman Saxena') : 'Rohit Sharma',
      senderRole: sender === 'customer' ? 'Device Owner' : 'Lead Technician, TechCare',
      text,
      timestamp: 'Just now',
    };
    const updatedJob: ActiveRepairJob = {
      ...job,
      messages: [...(job.messages || []), newMessage],
    };
    onUpdateJob(updatedJob);
  };

  const currentIndex = ORDERED_STATUSES.findIndex((s) => s.key === job.status);

  // Helper to jump to a specific status for demo presentations
  const handleSimulateStatus = (targetStatus: RepairStatus) => {
    const updatedHistory = [...job.statusHistory];
    const statusDef = ORDERED_STATUSES.find((s) => s.key === targetStatus);

    if (!updatedHistory.find((h) => h.status === targetStatus)) {
      updatedHistory.push({
        status: targetStatus,
        timestamp: 'Just now (Simulated)',
        note: statusDef ? statusDef.desc : 'Status progressed',
      });
    }

    onUpdateJob({
      ...job,
      status: targetStatus,
      statusHistory: updatedHistory,
    });
  };

  const handleNextStep = () => {
    if (currentIndex < ORDERED_STATUSES.length - 1) {
      handleSimulateStatus(ORDERED_STATUSES[currentIndex + 1].key);
    }
  };

  // Cost approval handlers
  const handleApproveCost = () => {
    if (!job.costAdjustment) return;
    const updatedJob: ActiveRepairJob = {
      ...job,
      selectedQuotation: {
        ...job.selectedQuotation,
        amount: job.costAdjustment.updatedAmount,
      },
      costAdjustment: {
        ...job.costAdjustment,
        status: 'approved',
      },
      status: 'repair_in_progress',
      statusHistory: [
        ...job.statusHistory,
        {
          status: 'repair_in_progress',
          timestamp: 'Just now',
          note: `Customer approved adjustment (+₹${job.costAdjustment.difference}). New total: ₹${job.costAdjustment.updatedAmount}. Precision repair initiated.`,
        },
      ],
    };
    onUpdateJob(updatedJob);
    setCostModalOpen(false);
  };

  const handleDeclineCost = () => {
    if (!job.costAdjustment) return;
    const updatedJob: ActiveRepairJob = {
      ...job,
      costAdjustment: {
        ...job.costAdjustment,
        status: 'declined',
      },
      status: 'repair_in_progress',
      statusHistory: [
        ...job.statusHistory,
        {
          status: 'repair_in_progress',
          timestamp: 'Just now',
          note: `Customer declined frame micro-milling. Proceeding with standard display replacement at original ₹${job.costAdjustment.initialAmount} quote.`,
        },
      ],
    };
    onUpdateJob(updatedJob);
    setCostModalOpen(false);
  };

  const handleSimulatePayment = () => {
    setPaymentDone(true);
    onUpdateJob({
      ...job,
      status: 'completed',
      paymentStatus: 'paid',
      finalPaidAmount: job.selectedQuotation.amount,
      completedAt: new Date().toLocaleDateString('en-GB'),
      warrantyExpiry: '03 Jan 2027',
      statusHistory: [
        ...job.statusHistory,
        {
          status: 'completed',
          timestamp: 'Just now',
          note: `Payment of ₹${job.selectedQuotation.amount} settled. Cryptographic digital warranty #WAR-${job.repairId} issued.`,
        },
      ],
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Demo Simulation Banner for Judges & Testing */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <Play className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold text-white">Interactive Demo Stage Controller:</span>
            <span className="text-slate-400 ml-1.5 hidden sm:inline">
              Simulate milestones to test the real customer workflow
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSimulateStatus('diagnosis_in_progress')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-mono text-[11px]"
          >
            4. Diagnosis
          </button>
          <button
            onClick={() => {
              handleSimulateStatus('cost_approval_pending');
              setCostModalOpen(true);
            }}
            className="px-2.5 py-1 bg-amber-900/60 hover:bg-amber-800 text-amber-200 rounded font-mono text-[11px]"
          >
            5. Cost Approval (+₹300)
          </button>
          <button
            onClick={() => handleSimulateStatus('quality_check')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-mono text-[11px]"
          >
            7. Quality Check
          </button>
          <button
            onClick={() => handleSimulateStatus('completed')}
            className="px-2.5 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 rounded font-mono text-[11px]"
          >
            9. Completed
          </button>
          <button
            onClick={() => setChatOpen(true)}
            className="px-2.5 py-1 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 rounded font-mono text-[11px] flex items-center gap-1"
          >
            <MessageSquare className="w-3 h-3 text-teal-400" />
            <span>Chat ({job.messages?.length || 0})</span>
          </button>
          <button
            onClick={handleNextStep}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold text-[11px] flex items-center gap-1"
          >
            <span>Next Stage</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Repair Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="font-bold text-slate-900 text-sm">{job.repairId}</span>
              <span className="text-slate-300">·</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                Live Tracking Active
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
              {job.request.brand} {job.request.model}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Reported: <span className="font-semibold text-slate-700">{job.request.issue}</span> · Assigned Workshop:{' '}
              <span className="font-semibold text-slate-800">{targetWorkshop.name}</span> ({targetWorkshop.area})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-start sm:justify-end">
            <div className="text-left sm:text-right">
              <div className="text-[10px] uppercase font-mono text-slate-400">Total Authorized Amount</div>
              <div className="text-2xl font-bold font-mono text-indigo-700">
                ₹{job.selectedQuotation.amount.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-500">
                {job.paymentStatus === 'paid' ? 'Paid & Settled' : 'Payment upon completion'}
              </div>
            </div>

            <button
              onClick={() => setChatOpen(true)}
              className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-xs cursor-pointer"
              title="Open direct technician chat"
            >
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Chat with Repairer</span>
              {(job.messages?.length ?? 0) > 0 && (
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-mono">
                  {job.messages?.length}
                </span>
              )}
            </button>

            {job.status === 'completed' && (
              <button
                onClick={onOpenWarranty}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition"
              >
                <Award className="w-4 h-4" />
                <span>View Digital Warranty</span>
              </button>
            )}
          </div>
        </div>

        {/* Current Status Callout */}
        <div className="rounded-xl bg-indigo-50/60 border border-indigo-100 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              {currentIndex + 1}
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-indigo-700 tracking-wider">
                Current Milestone ({currentIndex + 1} of 9)
              </span>
              <h3 className="text-lg font-bold text-indigo-950 mt-0.5">
                {ORDERED_STATUSES[currentIndex]?.label}
              </h3>
              <p className="text-xs text-indigo-900/80">
                {ORDERED_STATUSES[currentIndex]?.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right text-xs font-mono">
              <span className="text-slate-500 block text-[10px]">Warranty SLA</span>
              <span className="font-bold text-emerald-700">{job.selectedQuotation.warrantyDays} Days Guaranteed</span>
            </div>
          </div>
        </div>

        {/* The 9-Stage Progress Timeline */}
        <div className="space-y-4 pt-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Lifecycle Milestones
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {ORDERED_STATUSES.map((step, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;

              return (
                <div key={step.key} className="relative group">
                  <div
                    className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono transition ${
                      isPast
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 font-bold'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    }`}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div>
                      <div
                        className={`font-bold ${
                          isCurrent
                            ? 'text-indigo-900 text-sm'
                            : isPast
                            ? 'text-slate-900'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </div>
                      <div className={`text-[11px] ${isCurrent ? 'text-indigo-700' : 'text-slate-500'}`}>
                        {step.desc}
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="inline-block text-[10px] font-mono font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded sm:self-center">
                        Active Now
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DIAGNOSIS COST APPROVAL CARD */}
        {job.costAdjustment && (
          <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-5 sm:p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <h4 className="text-base font-bold text-amber-950">
                    Workshop Diagnosis & Cost Approval Required
                  </h4>
                  <p className="text-xs text-amber-900/80">
                    Technician completed microscopic physical bench diagnosis.
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded ${
                  job.costAdjustment.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : job.costAdjustment.status === 'declined'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-200 text-amber-900 animate-pulse'
                }`}
              >
                {job.costAdjustment.status === 'pending'
                  ? 'Awaiting Your Approval'
                  : `Customer ${job.costAdjustment.status.toUpperCase()}`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white rounded-xl p-4 border border-amber-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Initial Quotation</span>
                <span className="font-bold text-slate-800 text-sm font-mono">
                  ₹{job.costAdjustment.initialAmount.toLocaleString('en-IN')}
                </span>
                <div className="text-[10px] text-slate-500">Screen replacement only</div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Updated Diagnosis</span>
                <span className="font-bold text-indigo-700 text-sm font-mono">
                  ₹{job.costAdjustment.updatedAmount.toLocaleString('en-IN')}
                </span>
                <div className="text-[10px] text-amber-700 font-bold font-mono">
                  Difference: +₹{job.costAdjustment.difference}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Reason for Adjustment</span>
                <span className="font-medium text-slate-800 text-[11px] leading-tight block">
                  {job.costAdjustment.reason}
                </span>
              </div>
            </div>

            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>Technician Bench Note:</strong> “{job.costAdjustment.diagnosisDetails}”
            </p>

            {job.costAdjustment.status === 'pending' ? (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleApproveCost}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve Additional Cost (+₹{job.costAdjustment.difference})</span>
                </button>

                <button
                  onClick={handleDeclineCost}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <X className="w-4 h-4 text-rose-500" />
                  <span>Decline (Proceed with Original Scope Only)</span>
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-600 font-medium">
                Decision recorded in blockchain-backed audit trail. No further price changes permitted.
              </div>
            )}
          </div>
        )}

        {/* Completion & Payment Simulation */}
        {job.status === 'ready_for_delivery' && (
          <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 p-5 space-y-3 text-xs text-emerald-950">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-emerald-900">Device Ready for Handoff</div>
                <p className="text-emerald-800">18-point quality check passed. Total due: ₹{job.selectedQuotation.amount}</p>
              </div>
              <button
                onClick={handleSimulatePayment}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow transition"
              >
                <CreditCard className="w-4 h-4" />
                <span>Simulate Payment & Activate Warranty</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* UNIFIED REAL BHOPAL MAP & LIVE TRACKER: FULL TWO-WAY 2D/3D EXPERIENCE    */}
        {/* Consolidates all features from Step 1, Step 2, and Step 3 into Live Tracker */}
        {/* ========================================================================= */}
        <div className="space-y-5 pt-8 border-t border-slate-200">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                  Live Workshop Location & Real Bhopal Repair Network
                </span>
                <span className="text-[10px] font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                  2D / 3D Extruded Buildings
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1.5">
                Two-Way Repairer Marketplace & Live Road Tracking
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Explore verified Bhopal workshops, compare warranties and repair times, inspect genuine 3D city buildings, and follow real road routes calculated via OSRM.
              </p>
            </div>

            {/* Quick Actions Header */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleMyLocation}
                disabled={isLocating}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-60"
                title="Detect browser GPS location and center map"
              >
                <Navigation className={`w-3.5 h-3.5 text-indigo-600 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Locating…' : 'My Location'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleViewRoute(targetWorkshop)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                title="Calculate road driving route to your assigned workshop bench"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Route to Assigned Workshop</span>
              </button>
            </div>
          </div>

          {/* Location Notice Banner if triggered */}
          {locationNotice && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between animate-in fade-in">
              <span className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{locationNotice}</span>
              </span>
              <button onClick={() => setLocationNotice(null)} className="text-amber-700 hover:text-amber-900 font-bold cursor-pointer">
                ✕
              </button>
            </div>
          )}

          {/* TWO-WAY SPLIT SCREEN: LEFT = REPAIRER LIST, RIGHT = INTERACTIVE MAP */}
          <div className="flex flex-col lg:flex-row gap-6 items-stretch pt-2">
            {/* ================================================================ */}
            {/* LEFT SIDE: SCROLLABLE REPAIRER CARDS LIST & SEARCH / FILTERS    */}
            {/* ================================================================ */}
            <div className="w-full lg:w-[42%] flex flex-col space-y-3.5">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search repairers, area, or service in Bhopal…"
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort & Filter Strip */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-1 text-[11px] font-semibold text-slate-500">
                  <span className="flex items-center gap-1 uppercase tracking-wider font-mono">
                    <SlidersHorizontal className="w-3 h-3 text-indigo-600" />
                    Sort & Filter:
                  </span>
                  <span className="font-mono text-slate-700">
                    {filteredAndSortedRepairers.length} workshops shown
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {[
                    { id: 'nearest', label: 'Nearest' },
                    { id: 'highest_rated', label: 'Highest Rated' },
                    { id: 'fastest_repair', label: 'Fastest Repair' },
                    { id: 'best_warranty', label: 'Best Warranty' },
                    { id: 'price_low', label: 'Price: Low' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setActiveSort(opt.id as SortOption)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        activeSort === opt.id
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pinned Active Workshop Bench Callout */}
              <div 
                onClick={() => handleCardClick(targetWorkshop)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedMapStoreId === targetWorkshop.id
                    ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                    : 'bg-indigo-50/50 border-indigo-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-700">
                      Assigned Device Bench
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                    Active Job #{job.repairId}
                  </span>
                </div>

                <div className="mt-1.5 flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{targetWorkshop.name}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">{targetWorkshop.address}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-indigo-700 font-mono">
                      📍 {targetWorkshop.distanceKm} km
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-indigo-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailModalStore(targetWorkshop);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-slate-700 hover:text-indigo-600 text-xs font-semibold transition cursor-pointer"
                  >
                    View Details
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewRoute(targetWorkshop);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>View Road Route</span>
                  </button>
                </div>
              </div>

              {/* Scrollable Repairer Cards List */}
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {filteredAndSortedRepairers.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-2xl border border-slate-200 p-6">
                    <Search className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">No repairers found in this category.</p>
                    <p className="mt-1">Try clearing your search query or sorting criteria.</p>
                  </div>
                ) : (
                  filteredAndSortedRepairers.map((store) => {
                    const isSelected = selectedMapStoreId === store.id;
                    const isTargetWorkshop = store.id === targetWorkshop.id;

                    return (
                      <div
                        key={store.id}
                        ref={(el) => {
                          cardRefs.current[store.id] = el;
                        }}
                        onClick={() => handleCardClick(store)}
                        className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md -translate-y-0.5'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-xs'
                        }`}
                      >
                        {/* Header: Name, Rating, Distance, Demo Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors">
                                {store.name}
                              </h3>
                              <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                                Demo
                              </span>
                              {isTargetWorkshop && (
                                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                                  Assigned
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-1 text-xs">
                              <span className="font-bold text-amber-600 flex items-center gap-0.5">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                {store.rating}
                              </span>
                              <span className="text-slate-400">·</span>
                              <span className="text-slate-500 font-mono text-[11px]">
                                {store.reviewCount} reviews
                              </span>
                              <span className="text-slate-400">·</span>
                              <span className="font-bold text-indigo-700 font-mono text-[11px] flex items-center gap-0.5">
                                <MapPin className="w-3 h-3 text-indigo-500" />
                                {store.distanceKm} km away
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs font-extrabold text-slate-900 font-mono">
                              {store.priceRange || '₹₹'}
                            </span>
                          </div>
                        </div>

                        {/* Services Badges */}
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {store.services.slice(0, 3).map((srv, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                            >
                              {srv}
                            </span>
                          ))}
                        </div>

                        {/* Estimated Repair Time, Warranty, Price Range */}
                        <div className="mt-3 grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-mono text-slate-400 block">Est. Repair</span>
                            <span className="font-bold text-slate-800 text-[11px] flex items-center gap-0.5 mt-0.5">
                              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                              {store.estimatedHours < 24 ? `${store.estimatedHours} hrs` : `${Math.round(store.estimatedHours / 24)} days`}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-mono text-slate-400 block">Warranty</span>
                            <span className="font-bold text-emerald-700 text-[11px] flex items-center gap-0.5 mt-0.5">
                              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                              {store.warrantyDays} Days
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-mono text-slate-400 block">Price Range</span>
                            <span className="font-bold text-slate-900 font-mono text-[11px] block mt-0.5">
                              {store.priceRange || '₹₹'}
                            </span>
                          </div>
                        </div>

                        {/* Card Action Buttons: [View Details] & [View Route] */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDetailModalStore(store);
                            }}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
                          >
                            View Details
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewRoute(store);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>View Route</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* ================================================================ */}
            {/* RIGHT SIDE: LARGE INTERACTIVE MAP (MapLibre 2D/3D & OSRM)        */}
            {/* ================================================================ */}
            <div className="w-full lg:w-[58%] h-[480px] sm:h-[560px] lg:h-[680px] relative rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 flex-1">
              <InteractiveRepairMap
                userLocation={userLocation}
                stores={allStores}
                selectedStoreId={selectedMapStoreId}
                onSelectStore={handleSelectStoreFromMap}
                onViewDetails={(store) => setDetailModalStore(store)}
                routeTargetStore={routeTargetStore}
                onClearRoute={() => setRouteTargetStore(null)}
                isTrackingMode={true}
                trackingTitle={`Device at ${targetWorkshop.name}`}
                trackingSubtitle={`${ORDERED_STATUSES[currentIndex]?.label} · ${targetWorkshop.area}`}
              />
            </div>
          </div>

          {/* Assigned Workshop Credentials Footer */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <MapPin className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">{targetWorkshop.name}</span>
                <span className="text-slate-500 text-[11px]">{targetWorkshop.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500">
              <span>⏱ Turnaround: {targetWorkshop.estimatedHours} hrs</span>
              <span>·</span>
              <span className="text-emerald-700 font-bold">🛡 {targetWorkshop.warrantyDays} Days Guaranteed</span>
              <span>·</span>
              <button
                type="button"
                onClick={() => setChatOpen(true)}
                className="text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
              >
                Chat with Technician
              </button>
            </div>
          </div>
        </div>

        {/* Workshop Contact & Quick Actions Footer */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
              TC
            </div>
            <div>
              <div className="font-bold text-slate-900">{job.selectedQuotation.repairer.name}</div>
              <div className="text-slate-500 text-[11px]">{job.selectedQuotation.repairer.address}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setChatOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat with Technician</span>
            </button>

            <a
              href="tel:+919826012345"
              onClick={(e) => {
                e.preventDefault();
                alert('Demo: Workshop direct phone link +91 98260 12345.');
              }}
              className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 hover:text-indigo-600 font-semibold flex items-center gap-1.5 transition text-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Workshop</span>
            </a>
          </div>
        </div>
      </div>

      {/* Floating Action Chat Button */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold transition hover:scale-105 active:scale-95 cursor-pointer border border-indigo-400 group"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-300"></span>
        </span>
        <MessageSquare className="w-4 h-4 text-white" />
        <span>Chat with Repairer</span>
        {(job.messages?.length ?? 0) > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-mono">
            {job.messages?.length}
          </span>
        )}
      </button>

      {/* Repair Chat Drawer */}
      <RepairChatDrawer
        job={job}
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        onSendMessage={handleSendMessage}
        currentRole="customer"
      />

      {/* Workshop Details Modal */}
      {detailModalStore && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-slate-900">{detailModalStore.name}</h3>
                  <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    Demo Repairer
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{detailModalStore.address}</p>
              </div>
              <button
                onClick={() => setDetailModalStore(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-mono">Rating</span>
                <span className="font-extrabold text-slate-900 text-sm flex items-center justify-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {detailModalStore.rating}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-mono">Turnaround</span>
                <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                  {detailModalStore.estimatedHours} hrs
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-mono">Warranty</span>
                <span className="font-extrabold text-emerald-700 text-sm mt-0.5 block">
                  {detailModalStore.warrantyDays} Days
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-mono">Experience</span>
                <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                  {detailModalStore.experienceYears} Years
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                Parts & Calibration Policy
              </span>
              <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                {detailModalStore.partsPolicy}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                Supported Devices & Services
              </span>
              <div className="flex flex-wrap gap-1.5">
                {detailModalStore.services.map((srv, idx) => (
                  <span key={idx} className="bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-lg">
                    {srv}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setDetailModalStore(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  handleViewRoute(detailModalStore);
                  setDetailModalStore(null);
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>View Route on Map</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

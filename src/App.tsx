/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { WhyUs } from './components/WhyUs';
import { Categories } from './components/Categories';
import { PriceIntelligence } from './components/PriceIntelligence';
import { CompetitiveMatrix } from './components/CompetitiveMatrix';
import { ForRepairers } from './components/ForRepairers';
import { BusinessModel } from './components/BusinessModel';
import { Footer } from './components/Footer';

import { RequestWizard } from './components/RequestWizard';
import { QuotationsView } from './components/QuotationsView';
import { BookingConfirmation } from './components/BookingConfirmation';
import { RepairTracker } from './components/RepairTracker';
import { DigitalWarrantyModal } from './components/DigitalWarrantyModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { RepairerDashboard } from './components/RepairerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { NearbyStoresView } from './components/NearbyStoresView';

import { 
  INITIAL_DEMO_JOB, 
  PAST_DEMO_WARRANTY, 
  generateQuotationsForRequest 
} from './data/mockData';
import { 
  RepairRequest, 
  Quotation, 
  ActiveRepairJob, 
  DigitalWarranty,
  DeviceCategory,
  NearbyRepairStore 
} from './types';

export default function App() {
  // Navigation & Role states
  const [currentRole, setCurrentRole] = useState<'customer' | 'repairer' | 'admin'>('customer');
  const [activeView, setActiveView] = useState<'landing' | 'quotes' | 'booking' | 'tracking' | 'dashboard' | 'nearby_map'>('landing');

  // Request & Active Job states
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardCategory, setWizardCategory] = useState<DeviceCategory>('smartphone');
  const [currentRequest, setCurrentRequest] = useState<RepairRequest | null>(INITIAL_DEMO_JOB.request);
  const [quotations, setQuotations] = useState<Quotation[]>(
    generateQuotationsForRequest(INITIAL_DEMO_JOB.request)
  );
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(
    INITIAL_DEMO_JOB.selectedQuotation
  );
  const [activeJob, setActiveJob] = useState<ActiveRepairJob>(INITIAL_DEMO_JOB);
  const [warrantyModalData, setWarrantyModalData] = useState<DigitalWarranty | null>(null);

  // Jump demo checkpoints for rapid presentation
  const handleJumpToDemo = (checkpoint: string) => {
    setCurrentRole('customer');
    if (checkpoint === 'request') {
      setActiveView('landing');
      setWizardOpen(true);
    } else if (checkpoint === 'quotes') {
      setWizardOpen(false);
      if (!currentRequest) {
        setCurrentRequest(INITIAL_DEMO_JOB.request);
        setQuotations(generateQuotationsForRequest(INITIAL_DEMO_JOB.request));
      }
      setActiveView('quotes');
    } else if (checkpoint === 'tracking') {
      setWizardOpen(false);
      setActiveView('tracking');
    } else if (checkpoint === 'cost_approval') {
      setWizardOpen(false);
      setActiveJob({
        ...activeJob,
        status: 'diagnosis_in_progress',
        costAdjustment: {
          initialAmount: 2499,
          updatedAmount: 2799,
          difference: 300,
          diagnosisDetails: 'Corner aluminum chassis rim dented inward by 0.6mm during drop. Requires micro-milling to seat the AMOLED display flat and eliminate pressure spots.',
          reason: 'Chassis recontouring required for uniform pressure distribution.',
          status: 'pending',
        },
      });
      setActiveView('tracking');
    } else if (checkpoint === 'chat') {
      setWizardOpen(false);
      setActiveView('tracking');
    } else if (checkpoint === 'nearby_map') {
      setWizardOpen(false);
      setActiveView('tracking');
    } else if (checkpoint === 'warranty') {
      setWizardOpen(false);
      setWarrantyModalData(PAST_DEMO_WARRANTY);
    }
  };

  // Customer creates a request
  const handleWizardSubmit = (request: RepairRequest) => {
    setCurrentRequest(request);
    const newQuotes = generateQuotationsForRequest(request);
    setQuotations(newQuotes);
    setWizardOpen(false);
    setActiveView('quotes');
  };

  // Customer selects a store from the interactive map to get quote
  const handleSelectStoreForQuote = (store: NearbyRepairStore) => {
    const baseReq: RepairRequest = currentRequest || {
      id: `REQ-${Date.now().toString().slice(-5)}`,
      category: store.devices[0] || 'smartphone',
      brand: 'Samsung',
      model: 'Galaxy S24',
      issue: 'Screen Damage / Display Glitch',
      customDescription: `Customer requested direct quotation from ${store.name} in ${store.area}.`,
      city: 'Bhopal',
      area: store.area,
      pincode: '462011',
      serviceType: store.pickupAvailable ? 'pickup' : 'visit',
      priority: 'standard',
      images: [],
      createdAt: new Date().toISOString(),
      customerName: 'Aman Saxena',
      customerPhone: '+91 98260 44120',
    };
    setCurrentRequest(baseReq);

    const storeProfile = {
      id: store.id,
      name: store.name,
      verified: store.verified,
      rating: store.rating,
      reviewCount: store.reviewCount,
      completedRepairs: store.completedRepairs,
      experienceYears: store.experienceYears,
      address: store.address,
      area: store.area,
      distanceKm: store.distanceKm,
      badge: store.badge,
      specialties: store.specialties,
      partsPolicy: store.partsPolicy,
      warrantyPolicy: store.warranty,
      openingHours: store.openingHours,
      reviews: store.reviews,
    };

    const targetedQuotation: Quotation = {
      id: `quote-${store.id}`,
      repairerId: store.id,
      repairer: storeProfile as any,
      amount: store.startingPrice >= 600 ? store.startingPrice * 3 : 2499,
      estimatedHours: store.estimatedHours,
      warrantyDays: store.warrantyDays,
      partsType: 'OEM Grade',
      pickupAvailable: store.pickupAvailable,
      notes: `${store.warranty}. Certified bench diagnostic and calibration at ${store.area}.`,
    };

    setSelectedQuotation(targetedQuotation);
    setActiveView('booking');
  };

  // Customer selects a quotation
  const handleSelectQuotation = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setActiveView('booking');
  };

  // Customer confirms booking
  const handleConfirmBooking = (job: ActiveRepairJob) => {
    setActiveJob(job);
    setActiveView('tracking');
  };

  // Smooth navigation to anchors on landing page
  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === 'home') {
      setActiveView('landing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (sectionId === 'nearby-stores') {
      setActiveView('tracking');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (activeView !== 'landing') {
      setActiveView('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Universal Top Navigation conforming to 3-zone contract */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={(role) => setCurrentRole(role)}
        onStartRequest={() => {
          setWizardCategory('smartphone');
          setWizardOpen(true);
        }}
        onOpenTracking={() => {
          setCurrentRole('customer');
          setActiveView('tracking');
        }}
        onOpenWarranty={() => {
          setWarrantyModalData(PAST_DEMO_WARRANTY);
        }}
        onNavigateSection={handleNavigateSection}
        activeView={activeView}
        onJumpToDemo={handleJumpToDemo}
        onOpenNearbyMap={() => setActiveView('tracking')}
      />

      {/* Main View Router based on role and active state */}
      <main className="flex-1">
        {/* REPAIRER VIEW */}
        {currentRole === 'repairer' && (
          <RepairerDashboard
            activeJob={activeJob}
            onUpdateJob={(updated) => setActiveJob(updated)}
            onSwitchToCustomer={() => setCurrentRole('customer')}
          />
        )}

        {/* ADMIN VIEW */}
        {currentRole === 'admin' && (
          <AdminDashboard onSwitchToCustomer={() => setCurrentRole('customer')} />
        )}

        {/* CUSTOMER VIEWS */}
        {currentRole === 'customer' && (
          <>
            {activeView === 'landing' && (
              <>
                <Hero
                  onStartRequest={() => {
                    setWizardCategory('smartphone');
                    setWizardOpen(true);
                  }}
                  onPartnerClick={() => setCurrentRole('repairer')}
                  onOpenLiveTracking={() => setActiveView('tracking')}
                  onOpenMap={() => setActiveView('tracking')}
                />
                <HowItWorks
                  onStartRequest={() => {
                    setWizardCategory('smartphone');
                    setWizardOpen(true);
                  }}
                />
                <WhyUs />
                <Categories
                  onSelectCategory={(cat) => {
                    setWizardCategory(cat);
                    setWizardOpen(true);
                  }}
                />
                <PriceIntelligence
                  onStartRequest={() => {
                    setWizardCategory('smartphone');
                    setWizardOpen(true);
                  }}
                />
                <CompetitiveMatrix />
                <ForRepairers
                  onOpenRepairerDashboard={() => setCurrentRole('repairer')}
                />
                <BusinessModel />
              </>
            )}

            {activeView === 'nearby_map' && (
              <NearbyStoresView
                onBackToHome={() => setActiveView('landing')}
                onSelectStoreForQuote={handleSelectStoreForQuote}
                initialDeviceCategory={wizardCategory}
              />
            )}

            {activeView === 'quotes' && currentRequest && (
              <QuotationsView
                request={currentRequest}
                quotations={quotations}
                onSelectQuotation={handleSelectQuotation}
                onBackToEdit={() => setWizardOpen(true)}
              />
            )}

            {activeView === 'booking' && currentRequest && selectedQuotation && (
              <BookingConfirmation
                request={currentRequest}
                quotation={selectedQuotation}
                onConfirmBooking={handleConfirmBooking}
                onCancel={() => setActiveView('quotes')}
              />
            )}

            {activeView === 'tracking' && (
              <RepairTracker
                job={activeJob}
                onUpdateJob={(updated) => setActiveJob(updated)}
                onOpenWarranty={() => setWarrantyModalData(PAST_DEMO_WARRANTY)}
              />
            )}

            {activeView === 'dashboard' && (
              <CustomerDashboard
                activeJob={activeJob}
                onOpenTracking={() => setActiveView('tracking')}
                onOpenWarranty={(w) => setWarrantyModalData(w)}
                onStartNewRequest={() => {
                  setWizardCategory('smartphone');
                  setWizardOpen(true);
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Global Interactive Request Wizard Modal */}
      {wizardOpen && (
        <RequestWizard
          initialCategory={wizardCategory}
          onSubmit={handleWizardSubmit}
          onCancel={() => setWizardOpen(false)}
          onOpenMap={() => {
            setWizardOpen(false);
            setActiveView('tracking');
          }}
        />
      )}

      {/* Global Digital Warranty Certificate Modal */}
      {warrantyModalData && (
        <DigitalWarrantyModal
          warranty={warrantyModalData}
          onClose={() => setWarrantyModalData(null)}
        />
      )}

      {/* Clean quiet footer conforming to guidelines */}
      <Footer
        onStartRequest={() => {
          setWizardCategory('smartphone');
          setWizardOpen(true);
        }}
        onNavigateSection={handleNavigateSection}
        onSwitchRole={(role) => setCurrentRole(role)}
      />
    </div>
  );
}

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Filter, 
  Star, 
  ShieldCheck, 
  Truck, 
  Clock, 
  ArrowRight, 
  Check, 
  X, 
  RotateCcw, 
  Smartphone, 
  Laptop, 
  Tablet, 
  SlidersHorizontal,
  ChevronDown,
  Info,
  Phone,
  Store,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { NearbyRepairStore, UserLocation, DeviceCategory } from '../types';
import { 
  DEFAULT_BHOPAL_LOCATION, 
  BHOPAL_LOCATION_PRESETS, 
  getStoresWithDistances,
  calculateDistanceKm
} from '../data/nearbyStoresData';
import { InteractiveRepairMap } from './InteractiveRepairMap';

interface NearbyStoresViewProps {
  onBackToHome: () => void;
  onSelectStoreForQuote: (store: NearbyRepairStore) => void;
  initialDeviceCategory?: DeviceCategory;
}

export const NearbyStoresView: React.FC<NearbyStoresViewProps> = ({
  onBackToHome,
  onSelectStoreForQuote,
  initialDeviceCategory,
}) => {
  // User location state
  const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_BHOPAL_LOCATION);
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Interactive selection state
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>('store-techcare');
  const [detailModalStore, setDetailModalStore] = useState<NearbyRepairStore | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [routeTargetStore, setRouteTargetStore] = useState<NearbyRepairStore | null>(null);

  // Filter states
  const [selectedDevice, setSelectedDevice] = useState<DeviceCategory | 'all'>(
    initialDeviceCategory || 'all'
  );
  const [selectedService, setSelectedService] = useState<string>('all');
  const [maxDistance, setMaxDistance] = useState<number | 'all'>('all'); // 2, 5, 10, 'all'
  const [minRating, setMinRating] = useState<number>(0); // 0, 4.0, 4.5
  const [onlyPickup, setOnlyPickup] = useState(false);
  const [onlyWarranty, setOnlyWarranty] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price' | 'time'>('distance');

  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Calculate stores dynamically relative to userLocation
  const allStoresWithDistance = useMemo(() => {
    return getStoresWithDistances(userLocation.latitude, userLocation.longitude);
  }, [userLocation]);

  // Filtered stores
  const filteredStores = useMemo(() => {
    return allStoresWithDistance.filter((store) => {
      // Search query filter (name or area)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = store.name.toLowerCase().includes(query);
        const matchesArea = store.area.toLowerCase().includes(query);
        const matchesAddress = store.address.toLowerCase().includes(query);
        if (!matchesName && !matchesArea && !matchesAddress) return false;
      }

      // Device filter
      if (selectedDevice !== 'all' && !store.devices.includes(selectedDevice)) {
        return false;
      }

      // Service filter
      if (selectedService !== 'all' && !store.services.includes(selectedService)) {
        return false;
      }

      // Distance filter
      if (maxDistance !== 'all' && store.distanceKm > maxDistance) {
        return false;
      }

      // Rating filter
      if (minRating > 0 && store.rating < minRating) {
        return false;
      }

      // Pickup filter
      if (onlyPickup && !store.pickupAvailable) {
        return false;
      }

      // Warranty filter
      if (onlyWarranty && !store.warrantyDays) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return a.startingPrice - b.startingPrice;
      if (sortBy === 'time') return a.estimatedHours - b.estimatedHours;
      return 0;
    });
  }, [
    allStoresWithDistance,
    searchQuery,
    selectedDevice,
    selectedService,
    maxDistance,
    minRating,
    onlyPickup,
    onlyWarranty,
    sortBy,
  ]);

  // Handle browser geolocation
  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setLocationNotice(null);

    if (!navigator.geolocation) {
      setIsLocating(false);
      setLocationNotice('Browser geolocation is unavailable. Defaulting to Bhopal central hub.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        // User granted geolocation
        setUserLocation({
          city: 'My Location',
          area: 'Detected Location',
          pincode: '462011',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          source: 'gps',
        });
        triggerScanAnimation();
        setLocationNotice('Location updated from device GPS.');
        setTimeout(() => setLocationNotice(null), 3500);
      },
      (error) => {
        setIsLocating(false);
        // Fallback gracefully without breaking or forcing - Section 2 requirement
        setUserLocation(DEFAULT_BHOPAL_LOCATION);
        setLocationNotice("We couldn't access your location. Search your area manually.");
        setTimeout(() => setLocationNotice(null), 5000);
      },
      { timeout: 8000 }
    );
  };

  const handleSelectPresetArea = (preset: typeof BHOPAL_LOCATION_PRESETS[0]) => {
    setUserLocation({
      city: 'Bhopal, Madhya Pradesh',
      area: preset.area,
      pincode: preset.pincode,
      latitude: preset.lat,
      longitude: preset.lng,
      source: 'preset',
    });
    setShowLocationDropdown(false);
    triggerScanAnimation();
  };

  // Shark Tank Junior Demo Mode Rapid Trigger (Section 14 Requirement)
  const handleSharkTankDemo = () => {
    setUserLocation(DEFAULT_BHOPAL_LOCATION);
    resetFilters();
    triggerScanAnimation();
    setTimeout(() => {
      setSelectedStoreId('store-chiplevel');
      if (cardRefs.current['store-chiplevel']) {
        cardRefs.current['store-chiplevel']?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 800);
  };

  const triggerScanAnimation = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 800);
  };

  const handleSearchThisArea = (newLat: number, newLng: number) => {
    setUserLocation((prev) => ({
      ...prev,
      latitude: newLat,
      longitude: newLng,
      area: 'Current Map Area',
    }));
    triggerScanAnimation();
  };

  const handleStoreClick = (storeId: string) => {
    setSelectedStoreId(storeId);
    // Smooth scroll the corresponding card into view
    if (cardRefs.current[storeId]) {
      cardRefs.current[storeId]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleViewRoute = (store: NearbyRepairStore) => {
    setSelectedStoreId(store.id);
    setRouteTargetStore(store);
  };

  const resetFilters = () => {
    setSelectedDevice('all');
    setSelectedService('all');
    setMaxDistance('all');
    setMinRating(0);
    setOnlyPickup(false);
    setOnlyWarranty(false);
    setSortBy('distance');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* TOP HEADER & LOCATION BAR */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 space-y-3">
          {/* Row 1: Back + Title + Location Search Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToHome}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition py-1"
              >
                ← Back to Home
              </button>
              <span className="text-slate-300">·</span>
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Find Trusted Repairers Near You</span>
                <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {filteredStores.length} Stores Found
                </span>
              </h1>
            </div>

            {/* LOCATION SELECTOR & GPS TRIGGER */}
            <div className="flex flex-wrap items-center gap-2 relative">
              {/* Preset / Search Area dropdown trigger */}
              <div className="relative">
                <button
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-800 flex items-center gap-1.5 transition"
                >
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="font-semibold">{userLocation.area}</span>
                  <span className="text-slate-400">· Bhopal</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
                </button>

                {/* Preset Area Dropdown */}
                {showLocationDropdown && (
                  <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 font-mono">
                      Select Bhopal Area Preset
                    </div>
                    {BHOPAL_LOCATION_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => handleSelectPresetArea(preset)}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-slate-50 transition ${
                          userLocation.area === preset.area ? 'bg-indigo-50 text-indigo-900 font-bold' : 'text-slate-700'
                        }`}
                      >
                        <span>{preset.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">PIN {preset.pincode}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Use My Location Button (Section 2 Requirement) */}
              <button
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="Detect location using browser geolocation"
              >
                <Navigation className={`w-3.5 h-3.5 text-indigo-600 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Detecting GPS…' : 'Use My Location'}</span>
              </button>

              {/* Shark Tank Demo Quick Trigger (Section 14 Requirement) */}
              <button
                onClick={handleSharkTankDemo}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer active:scale-95"
                title="Launch 20-30s Shark Tank Junior Demo: Bhopal Central Hub"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>⚡ Shark Tank Demo</span>
              </button>

              {/* Text Search Input */}
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search store name, area..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Graceful Location Notice if GPS denied or updated */}
          {locationNotice && (
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 flex items-center justify-between animate-in fade-in">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>{locationNotice}</span>
              </span>
              <button onClick={() => setLocationNotice(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Row 2: Filter Pills Bar (Section 6 Requirement) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
              {/* Device Filters */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setSelectedDevice('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition ${
                    selectedDevice === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                  }`}
                >
                  All Devices
                </button>
                <button
                  onClick={() => setSelectedDevice('smartphone')}
                  className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition ${
                    selectedDevice === 'smartphone' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                  }`}
                >
                  Smartphones
                </button>
                <button
                  onClick={() => setSelectedDevice('laptop')}
                  className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition ${
                    selectedDevice === 'laptop' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                  }`}
                >
                  Laptops
                </button>
                <button
                  onClick={() => setSelectedDevice('tablet')}
                  className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition ${
                    selectedDevice === 'tablet' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                  }`}
                >
                  Tablets
                </button>
              </div>

              {/* Service Filter */}
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-[11px] font-medium focus:outline-none"
              >
                <option value="all">All Services</option>
                <option value="Screen">Screen Repair</option>
                <option value="Battery">Battery Replacement</option>
                <option value="Charging">Charging Port</option>
                <option value="Water Damage">Water Damage</option>
                <option value="Motherboard">Motherboard / Logic</option>
                <option value="Software">Software Issues</option>
              </select>

              {/* Radius Filter */}
              <select
                value={String(maxDistance)}
                onChange={(e) => setMaxDistance(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-[11px] font-medium focus:outline-none"
              >
                <option value="all">Any Distance</option>
                <option value="2">Within 2 km</option>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
              </select>

              {/* Rating Filter */}
              <select
                value={String(minRating)}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-[11px] font-medium focus:outline-none"
              >
                <option value="0">All Ratings</option>
                <option value="4.0">4.0★ and above</option>
                <option value="4.5">4.5★ and above</option>
              </select>

              {/* Toggles */}
              <button
                onClick={() => setOnlyPickup(!onlyPickup)}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-medium transition flex items-center gap-1 ${
                  onlyPickup
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                    : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Truck className="w-3 h-3 text-emerald-600" />
                <span>Pickup & Drop</span>
              </button>

              <button
                onClick={() => setOnlyWarranty(!onlyWarranty)}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-medium transition flex items-center gap-1 ${
                  onlyWarranty
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-bold'
                    : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-3 h-3 text-indigo-600" />
                <span>Warranty Guaranteed</span>
              </button>
            </div>

            {/* Sort by dropdown */}
            <div className="flex items-center gap-1.5 text-[11px] shrink-0">
              <span className="text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="distance">Nearest Distance</option>
                <option value="rating">Highest Rated</option>
                <option value="price">Lowest Starting Price</option>
                <option value="time">Fastest Turnaround</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN VIEWPORT: SPLIT SCREEN (DESKTOP: LIST LEFT, MAP RIGHT; MOBILE: MAP TOP, LIST BELOW) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* LEFT / SCROLLABLE REPAIRER LIST (lg:order-1) */}
        <div className="w-full lg:w-[44%] flex-1 lg:h-[calc(100vh-140px)] overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/60 order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-slate-200">
          {/* Active summary bar (Sections 10 & 11) */}
          <div className="space-y-1 pb-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  Repairers near {userLocation.area}
                </span>
                <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {filteredStores.length} found within {maxDistance === 'all' ? '10' : maxDistance} km
                </span>
              </div>
              {(selectedDevice !== 'all' || selectedService !== 'all' || maxDistance !== 'all' || minRating > 0 || onlyPickup || onlyWarranty || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 text-xs cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset filters</span>
                </button>
              )}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Bhopal Metropolitan Area · Real Geographic Map</span>
              <span className="text-amber-800 font-medium font-mono text-[10px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Demo Mode: Benchmark Bhopal Dataset
              </span>
            </div>
          </div>

          {/* EMPTY STATE (Section 11 Requirement) */}
          {filteredStores.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-4 my-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Store className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base">
                  We couldn't find repair partners nearby
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No repair stores match your active radius or filter criteria. Try expanding your search distance or clearing filters.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setMaxDistance(10)}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition"
                >
                  Expand to 10 km Radius
                </button>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => handleSelectPresetArea(BHOPAL_LOCATION_PRESETS[0])}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-xl text-xs transition"
                >
                  View Central Bhopal Hub
                </button>
              </div>
            </div>
          ) : (
            /* STORE CARDS LIST (Section 5 & Step 3 Requirement) */
            <div className="space-y-3.5">
              {filteredStores.map((store) => {
                const isSelected = selectedStoreId === store.id;

                const devicesText = store.devices
                  .map((d) => (d === 'smartphone' ? 'Mobile' : d === 'laptop' ? 'Laptop' : 'Tablet'))
                  .join(' • ');

                return (
                  <div
                    key={store.id}
                    ref={(el) => {
                      cardRefs.current[store.id] = el;
                    }}
                    onClick={() => handleStoreClick(store.id)}
                    className={`bg-white rounded-2xl border transition-all duration-200 p-5 space-y-3.5 shadow-xs cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/15 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    {/* Card Header: Name + Verification status as "Demo" */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-slate-900 hover:text-indigo-600 transition truncate">
                            {store.name}
                          </h3>
                        </div>

                        {/* Rating, Reviews, Distance */}
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-mono">
                          <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {store.rating}
                          </span>
                          <span>({store.reviewCount} reviews)</span>
                          <span>·</span>
                          <span className="font-bold text-slate-800">📍 {store.distanceKm} km away</span>
                        </div>
                      </div>

                      {/* Verification status as "Demo" for now */}
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded shrink-0">
                        Demo
                      </span>
                    </div>

                    {/* Main services (e.g. Mobile • Laptop • Tablet) */}
                    <div className="text-xs text-slate-700 font-medium">
                      {devicesText}
                    </div>

                    {/* Estimated repair time, Warranty & Price range */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-1 text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="text-slate-500">⏱ Estimated repair:</span>
                        <span className="font-bold text-slate-900">{store.estimatedHours} hours</span>
                      </div>

                      <div className="flex items-center gap-1 text-emerald-800 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-slate-500">🛡 Warranty:</span>
                        <span className="font-bold">{store.warrantyDays} days</span>
                      </div>

                      <div className="shrink-0">
                        <span className="font-mono font-bold text-slate-800 text-xs px-2 py-0.5 bg-white border border-slate-200 rounded">
                          {store.priceRange || (store.startingPrice < 500 ? '₹' : store.startingPrice < 800 ? '₹₹' : '₹₹₹')}
                        </span>
                      </div>
                    </div>

                    {/* Card Actions: [View Details] [View Route] [Get Quote] */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
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
                          className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-indigo-200"
                        >
                          <Navigation className="w-3 h-3 text-indigo-600" />
                          <span>View Route</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStoreForQuote(store);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition active:scale-95 cursor-pointer ml-auto"
                      >
                        <span>Get Quote</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT / TOP: INTERACTIVE MAP CANVAS (lg:order-2) */}
        <div className="w-full lg:w-[56%] h-[340px] sm:h-[440px] lg:h-[calc(100vh-140px)] relative border-b lg:border-b-0 order-1 lg:order-2">
          <InteractiveRepairMap
            userLocation={userLocation}
            stores={filteredStores}
            selectedStoreId={selectedStoreId}
            onSelectStore={(id) => handleStoreClick(id)}
            onViewDetails={(store) => setDetailModalStore(store)}
            onGetQuote={(store) => onSelectStoreForQuote(store)}
            onSearchThisArea={handleSearchThisArea}
            isScanning={isScanning}
            routeTargetStore={routeTargetStore}
            onClearRoute={() => setRouteTargetStore(null)}
          />
        </div>
      </div>

      {/* STORE DETAILS MODAL (Section 12 Requirement) */}
      {detailModalStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[88vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">{detailModalStore.name}</h3>
                  {detailModalStore.verified && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Verified Partner
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-mono">
                  <span className="text-amber-600 font-bold flex items-center">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                    {detailModalStore.rating}
                  </span>
                  <span>({detailModalStore.reviewCount} customer reviews)</span>
                  <span>·</span>
                  <span>📍 {detailModalStore.distanceKm} km from you</span>
                </div>
              </div>
              <button
                onClick={() => setDetailModalStore(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details Content */}
            <div className="space-y-4 text-xs text-slate-700">
              {/* Address & Hours & Contact (Section 12 Requirement) */}
              <div className="space-y-2">
                <div>
                  <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Workshop Address</div>
                  <p className="mt-1 text-slate-600">{detailModalStore.address}</p>
                  <div className="text-[11px] text-slate-500 mt-0.5">Hours: {detailModalStore.openingHours}</div>
                </div>

                {/* Direct Contact Options */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href={`tel:${detailModalStore.phone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Call Bench: {detailModalStore.phone}</span>
                  </a>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Partner Hub: RS-BPL-{detailModalStore.id.slice(-4).toUpperCase()}</span>
                  </span>
                </div>
              </div>

              {/* Supported Devices & Services */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Devices Handled</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {detailModalStore.devices.join(', ')}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Starting Price</span>
                  <div className="font-bold text-indigo-700 font-mono text-sm mt-0.5">
                    ₹{detailModalStore.startingPrice} onwards
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Turnaround SLA</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    Within {detailModalStore.estimatedHours} Hours
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Completed Repairs</span>
                  <div className="font-bold text-slate-900 font-mono mt-0.5">
                    {detailModalStore.completedRepairs} jobs in Bhopal
                  </div>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Bench Specialties</div>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {detailModalStore.specialties.map((spec, i) => (
                    <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-800 rounded-lg font-medium text-[11px]">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Component & Warranty Policies */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 text-[11px]">Quality Guarantee & Spares</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{detailModalStore.partsPolicy}</p>
                  <div className="text-emerald-700 font-bold font-mono text-[11px] pt-0.5">
                    {detailModalStore.warrantyDays}-day digital warranty backed by RepairSetu vault.
                  </div>
                </div>
              </div>

              {/* Verified Customer Reviews */}
              <div className="space-y-2 pt-1">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Recent Bhopal Customer Feedback
                </div>
                {detailModalStore.reviews.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-900">{rev.author}</span>
                      <span className="text-amber-500 font-bold">{rev.rating} ★</span>
                    </div>
                    <div className="text-[11px] text-indigo-700 font-medium">Device: {rev.device}</div>
                    <p className="text-slate-600 text-xs italic">“{rev.comment}”</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setDetailModalStore(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const s = detailModalStore;
                  setDetailModalStore(null);
                  onSelectStoreForQuote(s);
                }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Get a Repair Quote from {detailModalStore.name.split(' ')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

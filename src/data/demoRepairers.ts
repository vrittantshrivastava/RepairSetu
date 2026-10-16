/**
 * Step 1: Demo Repairer Dataset for Bhopal Map Foundation
 * 
 * NOTE: These are strictly DEMO / TESTING locations within Bhopal, Madhya Pradesh.
 * They are not real or verified businesses and are provided to test the map interface
 * until the live repairer database/API is connected.
 */

export interface DemoRepairer {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  rating: number;
  services: string[];
  estimatedRepairTime: string;
  warranty: string;
  priceRange: string;
  area: string;
  address: string;
  isDemo: true;
}

export const BHOPAL_CENTER = {
  latitude: 23.2599,
  longitude: 77.4126,
  name: 'Bhopal, Madhya Pradesh, India',
  defaultZoom: 12,
};

export const DEMO_REPAIRERS: DemoRepairer[] = [
  {
    id: 'demo-rep-1',
    name: 'TechCare Electronics (Demo)',
    latitude: 23.2332,
    longitude: 77.4342,
    rating: 4.8,
    services: ['Smartphone Screen', 'Battery Replacement', 'Charging Port'],
    estimatedRepairTime: '2 - 4 hours',
    warranty: '90 Days Warranty',
    priceRange: '₹499 - ₹2,499',
    area: 'MP Nagar Zone II',
    address: 'Plot 82, Near Jyoti Talkies, MP Nagar, Bhopal',
    isDemo: true,
  },
  {
    id: 'demo-rep-2',
    name: 'ChipLevel Pro Labs (Demo)',
    latitude: 23.2495,
    longitude: 77.4690,
    rating: 4.9,
    services: ['Motherboard Micro-Soldering', 'Laptop Repair', 'Liquid Damage'],
    estimatedRepairTime: 'Same-day (4 - 6 hours)',
    warranty: '180 Days Extended Warranty',
    priceRange: '₹899 - ₹4,500',
    area: 'Indrapuri (BHEL Sector)',
    address: 'Commercial Complex, Near Raisen Road, Indrapuri, Bhopal',
    isDemo: true,
  },
  {
    id: 'demo-rep-3',
    name: 'Apex Mobile Care (Demo)',
    latitude: 23.2384,
    longitude: 77.4012,
    rating: 4.6,
    services: ['Express Screen Swap', 'Speaker & Mic', 'Software Flash'],
    estimatedRepairTime: '1 - 2 hours',
    warranty: '60 Days Warranty',
    priceRange: '₹399 - ₹1,899',
    area: 'New Market / TT Nagar',
    address: 'City Plaza, Roshanpura Square, New Market, Bhopal',
    isDemo: true,
  },
  {
    id: 'demo-rep-4',
    name: 'QuickFix Digital Studio (Demo)',
    latitude: 23.2185,
    longitude: 77.4320,
    rating: 4.7,
    services: ['iPad & Tablet Display', 'Camera Sensor', 'Battery Replacement'],
    estimatedRepairTime: '3 - 5 hours',
    warranty: '90 Days Warranty',
    priceRange: '₹599 - ₹3,200',
    area: 'Arera Colony (E-3)',
    address: 'Commercial Market, Near 10 No. Stop, Arera Colony, Bhopal',
    isDemo: true,
  },
  {
    id: 'demo-rep-5',
    name: 'Lake City Chip Solutions (Demo)',
    latitude: 23.2560,
    longitude: 77.4080,
    rating: 4.8,
    services: ['MacBook Logic Board', 'Liquid Damage Recovery', 'Display Repair'],
    estimatedRepairTime: '4 - 8 hours',
    warranty: '120 Days Warranty',
    priceRange: '₹799 - ₹4,999',
    area: 'VIP Road / Kohefiza',
    address: 'Near VIP Road Viewpoint, Kohefiza, Bhopal',
    isDemo: true,
  },
  {
    id: 'demo-rep-6',
    name: 'Bhopal Laptop Clinic (Demo)',
    latitude: 23.2080,
    longitude: 77.4420,
    rating: 4.8,
    services: ['Laptop Hinge Repair', 'Keyboard Swap', 'Thermal Overhaul'],
    estimatedRepairTime: 'Same-day',
    warranty: '120 Days Hardware Warranty',
    priceRange: '₹699 - ₹3,800',
    area: 'Shahpura / Manisha Market',
    address: 'Lake View Arcade, Shahpura, Bhopal',
    isDemo: true,
  },
  {
    id: 'demo-rep-7',
    name: 'SmartChip Solutions (Demo)',
    latitude: 23.1852,
    longitude: 77.4190,
    rating: 4.4,
    services: ['Budget Screen Repair', 'Charging Jack', 'Battery'],
    estimatedRepairTime: '2 - 3 hours',
    warranty: '45 Days Warranty',
    priceRange: '₹349 - ₹1,699',
    area: 'Kolar Road',
    address: 'Opposite D-Mart, Kolar Main Road, Bhopal',
    isDemo: true,
  },
  {
    id: 'demo-rep-8',
    name: 'Bairagarh Tech Clinic (Demo)',
    latitude: 23.2650,
    longitude: 77.3450,
    rating: 4.5,
    services: ['Phone Display', 'Jack Soldering', 'Battery Replacement'],
    estimatedRepairTime: '2 - 4 hours',
    warranty: '60 Days Warranty',
    priceRange: '₹399 - ₹1,999',
    area: 'Bairagarh / Sant Hirdaram Nagar',
    address: 'Main Market Road, Near Railway Station, Bairagarh, Bhopal',
    isDemo: true,
  },
];

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return Math.round(dist * 10) / 10;
}


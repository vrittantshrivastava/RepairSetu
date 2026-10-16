import {
  DeviceCategory,
  DeviceModel,
  IssueType,
  RepairRequest,
  RepairerProfile,
  Quotation,
  ActiveRepairJob,
  DigitalWarranty,
} from '../types';

export const SUPPORTED_CATEGORIES: {
  id: DeviceCategory;
  name: string;
  description: string;
  icon: string;
  typicalRepairs: string;
}[] = [
  {
    id: 'smartphone',
    name: 'Smartphones',
    description: 'Screen replacement, battery, motherboard micro-soldering, water damage recovery',
    icon: 'Smartphone',
    typicalRepairs: '15,000+ completed in Bhopal',
  },
  {
    id: 'laptop',
    name: 'Laptops & MacBooks',
    description: 'Hinge repair, keyboard, thermal repasting, RAM/SSD upgrade, logic board repair',
    icon: 'Laptop',
    typicalRepairs: '8,400+ completed in Bhopal',
  },
  {
    id: 'tablet',
    name: 'Tablets & iPads',
    description: 'Digitizer replacement, charging port repair, Apple Pencil sensor calibration',
    icon: 'Tablet',
    typicalRepairs: '3,200+ completed in Bhopal',
  },
];

export const POPULAR_DEVICES: DeviceModel[] = [
  // Smartphones
  { id: 'dev-1', category: 'smartphone', brand: 'Samsung', model: 'Galaxy S24 / S24 Ultra', popularIssues: ['Screen Damage', 'Battery Drain', 'Camera Lens'] },
  { id: 'dev-2', category: 'smartphone', brand: 'Apple', model: 'iPhone 15 / 15 Pro', popularIssues: ['Back Glass Crack', 'OLED Display Flickering', 'Battery Health'] },
  { id: 'dev-3', category: 'smartphone', brand: 'OnePlus', model: 'OnePlus 12 / 12R', popularIssues: ['Green Line on Screen', 'Warp Charge Port', 'Overheating'] },
  { id: 'dev-4', category: 'smartphone', brand: 'Xiaomi', model: 'Redmi Note 13 Pro', popularIssues: ['Touch Screen Lag', 'Charging Socket', 'Speaker Buzz'] },
  { id: 'dev-5', category: 'smartphone', brand: 'Google', model: 'Pixel 8 / 8 Pro', popularIssues: ['Display Tint', 'Battery Drain', 'Microphone Issue'] },
  // Laptops
  { id: 'dev-6', category: 'laptop', brand: 'Apple', model: 'MacBook Air M2 / M3', popularIssues: ['Battery Cycle Degradation', 'Trackpad Click Issue', 'Liquid Spill'] },
  { id: 'dev-7', category: 'laptop', brand: 'Dell', model: 'Inspiron 15 / XPS 13', popularIssues: ['Broken Hinge', 'Overheating Fan Noise', 'Display Flickering'] },
  { id: 'dev-8', category: 'laptop', brand: 'HP', model: 'Pavilion 14 / Victus', popularIssues: ['Keyboard Key Stuck', 'Slow Boot / SSD Failure', 'Charging Port Pin'] },
  { id: 'dev-9', category: 'laptop', brand: 'Lenovo', model: 'ThinkPad E14 / IdeaPad', popularIssues: ['Battery Not Charging', 'BIOS Boot Loop', 'Screen Hinge Crack'] },
  // Tablets
  { id: 'dev-10', category: 'tablet', brand: 'Apple', model: 'iPad Air 5th Gen / Pro 11"', popularIssues: ['Cracked Touch Glass', 'Charging Port Loose', 'Battery Draining'] },
  { id: 'dev-11', category: 'tablet', brand: 'Samsung', model: 'Galaxy Tab S9 FE', popularIssues: ['S-Pen Lag / Screen Touch', 'Display Bleed', 'Volume Key Jam'] },
];

export const COMMON_ISSUES: IssueType[] = [
  { id: 'screen', name: 'Screen Damage / Display Glitch', iconName: 'Monitor', typicalCostRange: { min: 2200, max: 4500 }, typicalDurationHours: 24 },
  { id: 'battery', name: 'Battery Problem / Rapid Drain', iconName: 'BatteryCharging', typicalCostRange: { min: 1200, max: 2400 }, typicalDurationHours: 6 },
  { id: 'charging', name: 'Charging Port / Cable Loose', iconName: 'Zap', typicalCostRange: { min: 600, max: 1500 }, typicalDurationHours: 4 },
  { id: 'water', name: 'Water / Liquid Spill Damage', iconName: 'Droplets', typicalCostRange: { min: 1800, max: 4000 }, typicalDurationHours: 48 },
  { id: 'overheating', name: 'Overheating / Thermal Throttling', iconName: 'Flame', typicalCostRange: { min: 800, max: 1800 }, typicalDurationHours: 12 },
  { id: 'speaker', name: 'Speaker / Microphone Muffled', iconName: 'Volume2', typicalCostRange: { min: 700, max: 1600 }, typicalDurationHours: 6 },
  { id: 'camera', name: 'Camera Lens Broken / Blurry Focus', iconName: 'Camera', typicalCostRange: { min: 1400, max: 3200 }, typicalDurationHours: 18 },
  { id: 'motherboard', name: 'Motherboard / Chip-Level Fault', iconName: 'Cpu', typicalCostRange: { min: 2500, max: 6500 }, typicalDurationHours: 48 },
  { id: 'other', name: 'Other Hardware / Unknown Problem', iconName: 'HelpCircle', typicalCostRange: { min: 1000, max: 3000 }, typicalDurationHours: 24 },
];

export const BHOPAL_AREAS = [
  'MP Nagar Zone I & II',
  'Arera Colony (E1-E7)',
  'Indrapuri / BHEL Sector',
  'New Market / TT Nagar',
  'Kolar Road',
  'Gulmohar Colony',
  'Shahpura / Bawadiya Kalan',
  'Ayodhya Bypass / Hoshangabad Rd',
];

export const MOCK_REPAIRERS: RepairerProfile[] = [
  {
    id: 'rep-techcare',
    name: 'TechCare Electronics',
    verified: true,
    rating: 4.8,
    reviewCount: 342,
    completedRepairs: 1240,
    experienceYears: 9,
    address: 'Shop 14, Plot 82, Near Jyoti Talkies, MP Nagar Zone II, Bhopal',
    area: 'MP Nagar Zone II',
    distanceKm: 2.4,
    badge: 'Best Value',
    specialties: ['OLED Display Calibration', 'Motherboard Micro-Soldering', 'Same-day Battery Swap'],
    partsPolicy: 'Grade-A OEM spec components with traceable barcodes and quality certificates.',
    warrantyPolicy: '90 days comprehensive replacement warranty covering touch sensitivity and display dead pixels.',
    openingHours: '10:00 AM - 8:30 PM (Mon-Sat)',
    reviews: [
      {
        id: 'rev-1',
        author: 'Aditya Sharma',
        date: '3 days ago',
        rating: 5,
        device: 'Samsung Galaxy S23',
        comment: 'Super professional. They diagnosed my broken screen in MP Nagar and fixed it within 24 hours. The price was exactly as quoted with 90 days warranty receipt.',
      },
      {
        id: 'rev-2',
        author: 'Priya Malviya',
        date: '2 weeks ago',
        rating: 5,
        device: 'OnePlus 11',
        comment: 'Very clean repair job. They even sent diagnostic photos before replacing the charging flex. No hidden charges.',
      },
    ],
  },
  {
    id: 'rep-chiplevel',
    name: 'ChipLevel Pro Labs',
    verified: true,
    rating: 4.9,
    reviewCount: 512,
    completedRepairs: 2150,
    experienceYears: 12,
    address: 'C-Block Commercial Complex, Near Raisen Road, Indrapuri, Bhopal',
    area: 'Indrapuri',
    distanceKm: 4.1,
    badge: 'Highest Rated',
    specialties: ['Logic Board Level 3 Repair', 'MacBook Liquid Damage Treatment', 'Thermal BGA Reballing'],
    partsPolicy: '100% Genuine OEM procured from authorized supply distributors.',
    warrantyPolicy: '180 days extended warranty on board components and 90 days on display modules.',
    openingHours: '9:30 AM - 9:00 PM (Daily)',
    reviews: [
      {
        id: 'rev-3',
        author: 'Dr. Vivek Mishra',
        date: '1 week ago',
        rating: 5,
        device: 'MacBook Pro 14"',
        comment: 'Apple service center asked for ₹48,000 for logic board replacement. ChipLevel Pro solved the capacitor short circuit for ₹4,200 with 6 months warranty.',
      },
      {
        id: 'rev-4',
        author: 'Sunil Saxena',
        date: '1 month ago',
        rating: 5,
        device: 'Dell XPS 13',
        comment: 'Fastest diagnostic report in Bhopal. Highly recommended for complex laptop repairs.',
      },
    ],
  },
  {
    id: 'rep-apex',
    name: 'Apex Mobile Care',
    verified: true,
    rating: 4.6,
    reviewCount: 210,
    completedRepairs: 890,
    experienceYears: 7,
    address: 'Ground Floor, City Plaza, Roshanpura Square, New Market, Bhopal',
    area: 'New Market / TT Nagar',
    distanceKm: 3.2,
    badge: 'Fastest Turnaround',
    specialties: ['Quick Screen Replacement', 'Speaker & Mic Overhaul', 'Battery Health Restoration'],
    partsPolicy: 'Tested high-grade compatible spares with individual lab test reports.',
    warrantyPolicy: '60 days standard parts warranty backed by RepairSetu digital certificate.',
    openingHours: '10:30 AM - 8:00 PM (Mon-Sat)',
    reviews: [
      {
        id: 'rev-5',
        author: 'Rohit Verma',
        date: '5 days ago',
        rating: 4,
        device: 'Redmi Note 12',
        comment: 'Affordable and honest. They explained that my issue was just lint in the charging port and charged minimal diagnostic fee.',
      },
    ],
  },
  {
    id: 'rep-quickfix',
    name: 'QuickFix Digital Studio',
    verified: true,
    rating: 4.7,
    reviewCount: 178,
    completedRepairs: 640,
    experienceYears: 6,
    address: 'E-3/12 Commercial Hub, Near 10 No. Market, Arera Colony, Bhopal',
    area: 'Arera Colony',
    distanceKm: 1.8,
    badge: 'Top Specialist',
    specialties: ['iPad & Tablet Glass Lamination', 'Camera Sensor Realignment', 'Express Doorstep Pickup'],
    partsPolicy: 'Certified Grade-A components with calibrated color temperature and touch latency.',
    warrantyPolicy: '90 days doorstep warranty support with free re-inspection.',
    openingHours: '10:00 AM - 8:00 PM (Daily)',
    reviews: [
      {
        id: 'rev-6',
        author: 'Ananya Deshmukh',
        date: '2 weeks ago',
        rating: 5,
        device: 'iPad Air',
        comment: 'Super convenient doorstep pickup in Arera Colony. Digital tracking showed every step until delivery.',
      },
    ],
  },
];

export function generateQuotationsForRequest(request: Partial<RepairRequest>): Quotation[] {
  const baseCost = request.issue?.toLowerCase().includes('screen') ? 2499 : 1850;

  return [
    {
      id: 'quote-1',
      repairerId: 'rep-techcare',
      repairer: MOCK_REPAIRERS[0],
      amount: baseCost,
      estimatedHours: 24,
      warrantyDays: 90,
      partsType: 'OEM Grade',
      pickupAvailable: true,
      notes: 'Includes free ultrasonic internal dust cleaning, display color calibration and 90-day warranty.',
    },
    {
      id: 'quote-2',
      repairerId: 'rep-chiplevel',
      repairer: MOCK_REPAIRERS[1],
      amount: Math.round(baseCost * 1.15),
      estimatedHours: 14,
      warrantyDays: 180,
      partsType: 'Original Genuine',
      pickupAvailable: true,
      notes: 'Genuine factory-grade component with official calibration tool verification. 6-month full warranty.',
    },
    {
      id: 'quote-3',
      repairerId: 'rep-apex',
      repairer: MOCK_REPAIRERS[2],
      amount: Math.round(baseCost * 0.88),
      estimatedHours: 36,
      warrantyDays: 60,
      partsType: 'Certified Compatible',
      pickupAvailable: false,
      notes: 'Cost-effective certified replacement tested for multi-touch accuracy and drop tolerance.',
    },
    {
      id: 'quote-4',
      repairerId: 'rep-quickfix',
      repairer: MOCK_REPAIRERS[3],
      amount: Math.round(baseCost * 1.05),
      estimatedHours: 20,
      warrantyDays: 90,
      partsType: 'OEM Grade',
      pickupAvailable: true,
      notes: 'Doorstep pickup in Arera Colony / MP Nagar corridor included. Express 20-hour turnaround.',
    },
  ];
}

export function classifyIssueWithAI(deviceText: string, problemText: string) {
  const text = (deviceText + ' ' + problemText).toLowerCase();
  
  if (text.includes('screen') || text.includes('crack') || text.includes('glass') || text.includes('display') || text.includes('flicker') || text.includes('touch')) {
    return {
      primaryCategory: 'Display & Digitizer Assembly',
      confidence: 'high' as const,
      secondaryCategory: 'Frame or Bezel Alignment',
      explanation: 'Analysis matches physical impact on front panel with probable digitizer flex cable tension. Typical local repair price: ₹2,200 – ₹2,900 in Bhopal.',
    };
  }
  
  if (text.includes('heat') || text.includes('hot') || text.includes('drain') || text.includes('battery') || text.includes('shutdown') || text.includes('charge')) {
    return {
      primaryCategory: 'Power Management / Battery Cell',
      confidence: 'high' as const,
      secondaryCategory: 'Thermal Paste / Thermal Throttling',
      explanation: 'Symptoms indicate either chemical battery cell internal resistance or power IC charging circuit draw. Typical local repair price: ₹1,200 – ₹2,200.',
    };
  }
  
  if (text.includes('water') || text.includes('liquid') || text.includes('rain') || text.includes('spill') || text.includes('wet')) {
    return {
      primaryCategory: 'Liquid Ingress & Board Corrosion',
      confidence: 'high' as const,
      secondaryCategory: 'Short-Circuit Ultrasonic Bath Recovery',
      explanation: 'Requires immediate power disconnect and ultrasonic isopropyl alcohol board wash to arrest galvanic copper corrosion. Typical repair: ₹1,800 – ₹3,800.',
    };
  }
  
  return {
    primaryCategory: 'Hardware Functional Inspection',
    confidence: 'medium' as const,
    secondaryCategory: 'Component Logic Check',
    explanation: 'Preliminary analysis recommends physical multimeter diagnostic by a certified local partner to isolate sub-assembly fault. Typical quote: ₹1,400 – ₹2,600.',
  };
}

export const INITIAL_DEMO_JOB: ActiveRepairJob = {
  repairId: 'RS-BPL-10482',
  request: {
    id: 'req-demo-1',
    category: 'smartphone',
    brand: 'Samsung',
    model: 'Galaxy S24',
    issue: 'Screen Damage / Display Glitch',
    customDescription: 'Screen glass cracked near bottom right corner after drop. Touch still works intermittently, but faint horizontal line visible.',
    aiClassification: {
      primaryCategory: 'Display & Digitizer Assembly',
      confidence: 'high',
      secondaryCategory: 'Frame Realignment',
      explanation: 'Damage localized to AMOLED panel glass layer; requires structural frame inspection before bonding.',
    },
    city: 'Bhopal',
    area: 'MP Nagar Zone II',
    pincode: '462011',
    serviceType: 'pickup',
    priority: 'standard',
    images: ['https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80'],
    createdAt: '2026-10-04T10:15:00.000Z',
    customerName: 'Aman Saxena',
    customerPhone: '+91 98260 44120',
  },
  selectedQuotation: {
    id: 'quote-1',
    repairerId: 'rep-techcare',
    repairer: MOCK_REPAIRERS[0],
    amount: 2499,
    estimatedHours: 24,
    warrantyDays: 90,
    partsType: 'OEM Grade',
    pickupAvailable: true,
    notes: 'Includes full panel replacement, dust seal gasket, and 90-day comprehensive screen warranty.',
  },
  status: 'diagnosis_in_progress',
  statusHistory: [
    { status: 'request_submitted', timestamp: 'Yesterday, 10:15 AM', note: 'Customer submitted repair request for Samsung Galaxy S24' },
    { status: 'repairer_accepted', timestamp: 'Yesterday, 10:28 AM', note: 'TechCare Electronics accepted quotation and assigned technician Rohit' },
    { status: 'device_received', timestamp: 'Yesterday, 2:30 PM', note: 'Doorstep pickup completed at MP Nagar. Handed over with digital chain of custody' },
    { status: 'diagnosis_in_progress', timestamp: 'Today, 11:00 AM', note: 'Bench inspection on diagnostic station #2. Microscopic frame analysis underway' },
  ],
  costAdjustment: {
    initialAmount: 2499,
    updatedAmount: 2799,
    difference: 300,
    diagnosisDetails: 'Display assembly cracked. During precision micro-bench check, the technician noticed the corner aluminum chassis rim is dented inwards by 0.6mm.',
    reason: 'Corner chassis micro-recontouring required to seat the replacement display flush and avoid pressure-induced dead pixels.',
    status: 'pending',
  },
  paymentStatus: 'pending',
  technicianNotes: 'Chassis rim requires precision file milling before adhesive seal. Awaiting customer confirmation for +₹300 adjustment.',
  messages: [
    {
      id: 'msg-1',
      sender: 'system',
      senderName: 'RepairSetu System',
      text: 'Repair Order RS-BPL-10482 assigned to TechCare Electronics (MP Nagar Zone II). Direct technician communication channel opened.',
      timestamp: 'Yesterday, 10:30 AM',
    },
    {
      id: 'msg-2',
      sender: 'repairer',
      senderName: 'Rohit Sharma',
      senderRole: 'Lead Technician, TechCare',
      text: 'Namaste Aman ji! Your Samsung Galaxy S24 has safely arrived at our workshop bench #2. I have completed preliminary multimeter tests on the display logic.',
      timestamp: 'Today, 10:45 AM',
    },
    {
      id: 'msg-3',
      sender: 'customer',
      senderName: 'Aman Saxena',
      senderRole: 'Device Owner',
      text: 'Hi Rohit, will all my photos and personal apps remain intact during the screen replacement? Do you need my screen lock PIN?',
      timestamp: 'Today, 10:50 AM',
    },
    {
      id: 'msg-4',
      sender: 'repairer',
      senderName: 'Rohit Sharma',
      senderRole: 'Lead Technician, TechCare',
      text: 'Your data is 100% safe. We never erase device storage during hardware screen swaps. Also, we perform touch tests using Samsung\'s factory diagnostics menu (*#0*#), so we do NOT require your lock PIN or access to any private data.',
      timestamp: 'Today, 10:54 AM',
    },
    {
      id: 'msg-5',
      sender: 'repairer',
      senderName: 'Rohit Sharma',
      senderRole: 'Lead Technician, TechCare',
      text: 'During micro-bench inspection, we noticed the top-right corner aluminum rim has a 0.6mm dent from the impact. I have logged a +₹300 frame alignment request in your cost approval section so the new display seats 100% flush.',
      timestamp: 'Today, 11:02 AM',
      attachmentUrl: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80',
      isDiagnosticPhoto: true,
    },
  ],
};

export const PAST_DEMO_WARRANTY: DigitalWarranty = {
  warrantyId: 'WAR-RS-BPL-8831',
  repairId: 'RS-BPL-8831',
  device: 'MacBook Air M2 (13.6-inch)',
  repairPerformed: 'Original Battery Replacement + Thermal Paste Recalibration',
  partsUsed: 'OEM High-Density Li-Po Cell 52.6Wh with Battery Controller BQ40Z50',
  repairerName: 'ChipLevel Pro Labs',
  repairerArea: 'Indrapuri, Bhopal',
  repairDate: '12 Sep 2026',
  amountPaid: 4200,
  warrantyDays: 180,
  expiryDate: '11 Mar 2027',
  terms: [
    'Covers battery capacity retention above 85% for 180 calendar days.',
    'Covers sudden shutdowns or thermal expansion defects.',
    'Excludes deliberate liquid ingress or unauthorized physical tampering.',
  ],
  status: 'active',
};

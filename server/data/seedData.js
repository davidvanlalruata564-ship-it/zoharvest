export const initialCategories = [
  { id: 'all', name: 'All Commodities', nameMizo: 'Thil Zawng Zawng', icon: 'Layers' },
  { id: 'spices', name: 'Spices & Herbs', nameMizo: 'Chawhmeh Hnah & Spices', icon: 'Flame' },
  { id: 'grains', name: 'Rice & Grains/Cereals', nameMizo: 'Buh & Buhbal', icon: 'Wheat' },
  { id: 'fruits', name: 'Fruits & Vegetables', nameMizo: 'Thei & Thlai', icon: 'Apple' },
  { id: 'cashcrops', name: 'Cash Crops & Fibre', nameMizo: 'Hralh Thlai & Hmunphiah', icon: 'Trees' },
  { id: 'handicrafts', name: 'Regional Handicrafts', nameMizo: 'Kut Kawih / Mau Thil', icon: 'Palette' },
  { id: 'organic', name: 'Certified Organic', nameMizo: 'Damdawi Telh Loh (Organic)', icon: 'ShieldCheck' }
];

export const initialDistricts = [
  'Aizawl', 'Champhai', 'Kolasib', 'Lunglei', 'Serchhip', 
  'Mamit', 'Lawngtlai', 'Siaha', 'Saitual', 'Khawzawl', 'Hnahthial'
];

export const initialProducts = [
  {
    id: 'prod-1',
    name: "GI-Tagged Mizo Chilli (Bird's Eye / Hmarchate)",
    nameMizo: "Mizo Hmarchate (GI Tagged)",
    category: 'spices',
    district: 'Champhai',
    fpoName: 'Champhai High-Altitude Organic FPO',
    sellerId: 'user-farmer-1',
    rating: 4.9,
    reviewsCount: 38,
    isOrganic: true,
    giTagged: true,
    grade: 'Grade A (Whole Sun-Dried)',
    unit: 'kg',
    pricePerUnit: 780,
    marketPriceComparison: 950,
    minOrderQty: 50,
    availableStock: 3500,
    isAdvanceHarvest: false,
    harvestDate: 'Ready in Stock (Harvested Oct 2026)',
    images: [
      'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
    ],
    description: "Authentic, extremely pungent Geographical Indication (GI) tagged Bird's Eye Chilli from the pristine hills of Champhai. High capsaicin content (50,000 to 100,000 SHU), naturally shade-dried by local women cooperatives.",
    descriptionMizo: "Champhai tlang sang a mi Mizo Hmarchate tak tak. Thak em em, GI Tag nei, chemical hman miah loh a ni.",
    certifications: ['GI Tag: GI-371', 'India Organic NPOP', 'FSSAI Wholesale License'],
    bulkPricing: [
      { minQty: 50, maxQty: 200, price: 780 },
      { minQty: 201, maxQty: 1000, price: 730 },
      { minQty: 1001, maxQty: 5000, price: 690 }
    ],
    packaging: '25kg multi-wall moisture-proof gunny bags with food-grade poly liner',
    shelfLife: '12 Months'
  },
  {
    id: 'prod-2',
    name: 'Mizoram High-Oleoresin Organic Fresh Ginger',
    nameMizo: 'Mizoram Thingpui Thianghlim (Ginger)',
    category: 'spices',
    district: 'Kolasib',
    fpoName: 'Tlawng River Valley Producers Co-op',
    sellerId: 'user-farmer-1',
    rating: 4.8,
    reviewsCount: 42,
    isOrganic: true,
    giTagged: false,
    grade: 'Grade A (Washed & Air-Cured)',
    unit: 'quintal',
    pricePerUnit: 6400,
    marketPriceComparison: 7800,
    minOrderQty: 10,
    availableStock: 280,
    isAdvanceHarvest: true,
    harvestDate: 'Advance Harvest: Dec 15 - Dec 28, 2026',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Renowned Nadia and Rio-de-Janeiro ginger cultivars grown organically on virgin slopes of Kolasib. Low crude fiber (<4%) and high oil content make it perfect for oleoresin extraction and national wholesale markets.',
    descriptionMizo: 'Kolasib tlang pang a ching thingpui thar thar. Thau tha tak, hrui tlem leh tui hnai.',
    certifications: ['Mission Organic Value Chain Development (MOVCD-NER)', 'FSSAI'],
    bulkPricing: [
      { minQty: 10, maxQty: 50, price: 6400 },
      { minQty: 51, maxQty: 200, price: 6100 }
    ],
    packaging: '50kg breathable jute sacks',
    shelfLife: '45 Days fresh cold-store'
  },
  {
    id: 'prod-3',
    name: 'High-Curcumin Pure Turmeric Fingers (Aieng)',
    nameMizo: 'Aieng Tlang Sang (Curcumin 7.2%)',
    category: 'spices',
    district: 'Serchhip',
    fpoName: 'Serchhip Agro-Spice FPO',
    sellerId: 'user-farmer-2',
    rating: 4.9,
    reviewsCount: 29,
    isOrganic: true,
    giTagged: false,
    grade: 'Grade A (Cured & Polished)',
    unit: 'quintal',
    pricePerUnit: 14200,
    marketPriceComparison: 16800,
    minOrderQty: 5,
    availableStock: 120,
    isAdvanceHarvest: false,
    harvestDate: 'Ready in Stock (Nov Batch)',
    images: [
      'https://images.unsplash.com/photo-1615485290119-98a323d99049?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Lab-tested high curcumin (7.2%) organic turmeric fingers cultivated without synthetic pesticides. Intense golden color, deep aroma, ideal for pharmaceutical extracts and high-end masala brands.',
    descriptionMizo: 'Aieng serchhip a mi, a rawng a eng tha em em a, damdawi atan pawh a tha hle.',
    certifications: ['Lab Curcumin Test Certified 7.2%', 'NPOP Organic'],
    bulkPricing: [
      { minQty: 5, maxQty: 20, price: 14200 },
      { minQty: 21, maxQty: 100, price: 13500 }
    ],
    packaging: '50kg double-stitched jute bags',
    shelfLife: '24 Months'
  },
  {
    id: 'prod-4',
    name: 'Indigenous Mizo Red Rice (Buhsen / Buhban)',
    nameMizo: 'Mizo Buhsen Thianghlim (Paddy & Polished)',
    category: 'grains',
    district: 'Champhai',
    fpoName: 'Champhai Rice Valley Farmer Union',
    sellerId: 'user-farmer-1',
    rating: 4.7,
    reviewsCount: 19,
    isOrganic: true,
    giTagged: false,
    grade: 'Grade A (Semi-Polished)',
    unit: 'quintal',
    pricePerUnit: 8200,
    marketPriceComparison: 9800,
    minOrderQty: 5,
    availableStock: 350,
    isAdvanceHarvest: true,
    harvestDate: 'Advance Harvest: Nov 20 - Dec 10, 2026',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Indigenous aromatic red sticky rice grown in the famous Champhai rice bowl plain. Rich in anthocyanins, micronutrients, zinc, and dietary fiber. Zero chemical fertilizers.',
    descriptionMizo: 'Champhai phaizawl a thar Mizo Buhsen tak tak. Hrisel em em, thil dang telh loh.',
    certifications: ['Traditional Heirloom Certification', 'FSSAI'],
    bulkPricing: [
      { minQty: 5, maxQty: 25, price: 8200 },
      { minQty: 26, maxQty: 100, price: 7750 }
    ],
    packaging: '25kg HDPE woven bags',
    shelfLife: '12 Months'
  },
  {
    id: 'prod-5',
    name: 'Wild Mizoram Hatkora Citrus (Citrus Macroptera)',
    nameMizo: 'Mizoram Ser / Hatkora (Wild Citrus)',
    category: 'fruits',
    district: 'Mamit',
    fpoName: 'Mamit Horticultural Clan Group',
    sellerId: 'user-farmer-2',
    rating: 4.8,
    reviewsCount: 15,
    isOrganic: true,
    giTagged: true,
    grade: 'Grade A (Hand-Picked Firm)',
    unit: 'crate (20kg)',
    pricePerUnit: 1450,
    marketPriceComparison: 1900,
    minOrderQty: 20,
    availableStock: 500,
    isAdvanceHarvest: false,
    harvestDate: 'Ready in Stock (Weekly harvest)',
    images: [
      'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Wild heirloom medicinal citrus renowned for its aromatic thick rind used extensively in traditional gourmet culinary recipes, pickles, and essential perfume oils.',
    descriptionMizo: 'Hatkora tui hnai tak, a kawr chhah tha, anṭam leh sa hmehna a tui tak.',
    certifications: ['GI Tag Verified', 'Phytosanitary Cleared'],
    bulkPricing: [
      { minQty: 20, maxQty: 50, price: 1450 },
      { minQty: 51, maxQty: 200, price: 1300 }
    ],
    packaging: '20kg ventilated corrugated fruit crates',
    shelfLife: '20 Days'
  },
  {
    id: 'prod-6',
    name: 'Mizo Handcrafted Bamboo Storage Baskets (Paikawv & Thlangra)',
    nameMizo: 'Mizo Mau Thil / Paikawv leh Thlangra',
    category: 'handicrafts',
    district: 'Khawzawl',
    fpoName: 'Khawzawl Bamboo Artisans Cooperative',
    sellerId: 'user-farmer-2',
    rating: 5.0,
    reviewsCount: 31,
    isOrganic: true,
    giTagged: false,
    grade: 'Grade A (Treated & Smoked Bamboo)',
    unit: 'piece',
    pricePerUnit: 340,
    marketPriceComparison: 550,
    minOrderQty: 50,
    availableStock: 1200,
    isAdvanceHarvest: false,
    harvestDate: 'Ready in Stock (Handcrafted)',
    images: [
      'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Masterfully handwoven traditional Mizo bamboo baskets crafted by multigenerational artisan families. Natural borax/smoke-treated for anti-borer and termite resistance.',
    descriptionMizo: 'Khawzawl kutchhuak mau paikawv leh thlangra. A nghet tha em em a, tlo tak a ni.',
    certifications: ['Artisan Guild Certified', 'Forest Dept Transit Pass'],
    bulkPricing: [
      { minQty: 50, maxQty: 200, price: 340 },
      { minQty: 201, maxQty: 500, price: 295 }
    ],
    packaging: 'Master bundle packs of 10 in corrugated cartons',
    shelfLife: 'Years (Durable craft)'
  },
  {
    id: 'prod-7',
    name: 'High-Tensile Mizoram Hill Broom Grass (Hmunphiah)',
    nameMizo: 'Mizoram Hmunphiah (Raw Hill Broom)',
    category: 'cashcrops',
    district: 'Lunglei',
    fpoName: 'Lunglei Forest Produce Union',
    sellerId: 'user-farmer-1',
    rating: 4.6,
    reviewsCount: 22,
    isOrganic: true,
    giTagged: false,
    grade: 'Grade A (Long Fibre 110cm+ Uncombed)',
    unit: 'quintal',
    pricePerUnit: 8900,
    marketPriceComparison: 10500,
    minOrderQty: 10,
    availableStock: 400,
    isAdvanceHarvest: true,
    harvestDate: 'Advance Harvest: Jan 15 - Feb 10, 2027',
    images: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Premier quality broom grass harvested from the precipitous hillsides of Southern Mizoram. Exceptional fiber flexibility and dust-free longevity for bulk industrial brush manufacturers.',
    descriptionMizo: 'Lunglei tlang pang hmunphiah hrui sei leh tlo tha tak.',
    certifications: ['State Forest Minor Forest Produce (MFP) License'],
    bulkPricing: [
      { minQty: 10, maxQty: 50, price: 8900 },
      { minQty: 51, maxQty: 150, price: 8400 }
    ],
    packaging: 'Compressed 50kg round bales secured with galvanized wire',
    shelfLife: '24 Months dry storage'
  },
  {
    id: 'prod-8',
    name: 'Mizoram Export-Grade Anthurium Cut Stems',
    nameMizo: 'Mizo Anthurium Pangpar (Export Quality)',
    category: 'fruits',
    district: 'Aizawl',
    fpoName: 'Aizawl Floriculture Growers Union',
    sellerId: 'user-farmer-1',
    rating: 4.9,
    reviewsCount: 27,
    isOrganic: false,
    giTagged: false,
    grade: 'Grade A (Stem length 45cm+, Heart 12cm+)',
    unit: 'box (50 stems)',
    pricePerUnit: 2200,
    marketPriceComparison: 3200,
    minOrderQty: 5,
    availableStock: 150,
    isAdvanceHarvest: false,
    harvestDate: 'Daily fresh cut shipment via Lengpui Airport',
    images: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Exotic tropical red, pink, and white Anthurium cut flowers grown in computerized polyhouses across Aizawl hills. Direct air-cargo fulfillment for major hotel chains and luxury events across India.',
    descriptionMizo: 'Aizawl pangpar chingtu te kutchhuak anthurium mawi tak tak, Lengpui Airport aṭanga thawn nghal thei.',
    certifications: ['APEDA Registered', 'Floriculture Board Inspection'],
    bulkPricing: [
      { minQty: 5, maxQty: 20, price: 2200 },
      { minQty: 21, maxQty: 50, price: 1950 }
    ],
    packaging: 'Individual water-capsule vial in thermocol air-cargo cartons',
    shelfLife: '18 Days vase life'
  }
];

export const initialRFQs = [
  {
    id: 'RFQ-701',
    productId: 'prod-1',
    productName: "GI-Tagged Mizo Chilli (Bird's Eye / Hmarchate)",
    buyerId: 'user-buyer-1',
    buyerName: 'Spices India Wholesale Corp',
    buyerLocation: 'Kochi, Kerala (Pincode: 682003)',
    sellerId: 'user-farmer-1',
    sellerName: 'Champhai High-Altitude Organic FPO',
    quantity: 500,
    unit: 'kg',
    targetPrice: 710,
    offeredPrice: 730,
    status: 'Counter-Offered', // 'Pending', 'Counter-Offered', 'Accepted', 'PO_Generated', 'Escrow_Paid', 'Dispatched', 'Settled', 'Rejected'
    targetDeliveryDate: '2026-11-20',
    shippingDestination: 'Willingdon Island Terminal, Kochi, Kerala',
    specifications: 'Moisture content strictly < 9.5%, aflatoxin test certificate required with shipment.',
    createdAt: '2026-10-18T10:30:00Z',
    history: [
      { sender: 'buyer', message: 'Tendered bid of ₹710/kg for 500kg consignment.', date: '2026-10-18T10:30:00Z', price: 710 },
      { sender: 'seller', message: 'Counter-offer: We can deliver premium double-cleaned Grade A at ₹730/kg including export-grade moisture proof liners.', date: '2026-10-19T14:15:00Z', price: 730 }
    ]
  },
  {
    id: 'RFQ-702',
    productId: 'prod-2',
    productName: 'Mizoram High-Oleoresin Organic Fresh Ginger',
    buyerId: 'user-buyer-1',
    buyerName: 'Spices India Wholesale Corp',
    buyerLocation: 'Mumbai Distribution Hub, MH (400001)',
    sellerId: 'user-farmer-1',
    sellerName: 'Champhai High-Altitude Organic FPO',
    quantity: 25,
    unit: 'quintal',
    targetPrice: 6200,
    offeredPrice: 6200,
    status: 'Accepted',
    targetDeliveryDate: '2026-12-24',
    shippingDestination: 'Vashi APMC Wholesale Market, Navi Mumbai',
    specifications: 'Advance pre-order contract for mid-December harvest. Clean washed, minimum fiber.',
    createdAt: '2026-10-15T09:00:00Z',
    history: [
      { sender: 'buyer', message: 'Requesting 25 quintals advance harvest lock-in at ₹6,200/quintal.', date: '2026-10-15T09:00:00Z', price: 6200 },
      { sender: 'seller', message: 'Accepted. Harvest lot reserved for harvest dates Dec 15-20.', date: '2026-10-16T11:20:00Z', price: 6200 }
    ]
  },
  {
    id: 'RFQ-703',
    productId: 'prod-3',
    productName: 'High-Curcumin Pure Turmeric Fingers (Aieng)',
    buyerId: 'user-buyer-2',
    buyerName: 'AyurVeda Naturals Bangalore',
    buyerLocation: 'Bangalore, KA (560068)',
    sellerId: 'user-farmer-2',
    sellerName: 'Serchhip Agro-Spice FPO',
    quantity: 15,
    unit: 'quintal',
    targetPrice: 13800,
    offeredPrice: 14000,
    status: 'PO_Generated',
    targetDeliveryDate: '2026-11-10',
    shippingDestination: 'Electronic City Phase II, Bangalore',
    specifications: 'Batch tested curcumin report must accompany invoice. Double jute packaging.',
    createdAt: '2026-10-12T16:00:00Z',
    history: [
      { sender: 'buyer', message: 'RFQ submitted for 15 quintals at ₹13,800/quintal', date: '2026-10-12T16:00:00Z', price: 13800 },
      { sender: 'seller', message: 'Accepted at ₹14,000/quintal with batch test certificate.', date: '2026-10-13T10:00:00Z', price: 14000 },
      { sender: 'buyer', message: 'Formal PO generated. Ready for Escrow deposit.', date: '2026-10-14T11:45:00Z', price: 14000 }
    ]
  }
];

export const initialOrders = [
  {
    id: 'PO-ZH-9101',
    rfqId: 'RFQ-703',
    productId: 'prod-3',
    productName: 'High-Curcumin Pure Turmeric Fingers (Aieng)',
    buyerId: 'user-buyer-2',
    buyerName: 'AyurVeda Naturals Bangalore',
    sellerId: 'user-farmer-2',
    sellerName: 'Serchhip Agro-Spice FPO',
    quantity: 15,
    unit: 'quintal',
    unitPrice: 14000,
    totalCommodityAmount: 210000,
    platformFeeRate: 0.025, // 2.5% platform commission
    platformFeeAmount: 5250,
    netPayableToSeller: 204750,
    shippingDestination: 'AyurVeda Warehouse, Hosur Road, Bangalore, KA - 560068',
    status: 'Escrow_Paid', // 'PO_Created', 'Escrow_Paid', 'Dispatched', 'Delivered_Inspected', 'Settled'
    escrowTransactionId: 'ESC-RZP-99238419',
    escrowPaidAt: '2026-10-19T14:22:00Z',
    dispatchInfo: {
      carrier: 'NorthEast Express Cargo / BlueDart Freight',
      trackingNumber: 'NEC-BLR-8839201',
      dispatchedAt: null,
      estimatedArrival: '2026-11-04'
    },
    verificationNotes: 'Pending seller dispatch confirmation.'
  },
  {
    id: 'PO-ZH-8890',
    rfqId: 'RFQ-650',
    productId: 'prod-1',
    productName: "GI-Tagged Mizo Chilli (Bird's Eye / Hmarchate)",
    buyerId: 'user-buyer-1',
    buyerName: 'Spices India Wholesale Corp',
    sellerId: 'user-farmer-1',
    sellerName: 'Champhai High-Altitude Organic FPO',
    quantity: 200,
    unit: 'kg',
    unitPrice: 750,
    totalCommodityAmount: 150000,
    platformFeeRate: 0.025,
    platformFeeAmount: 3750,
    netPayableToSeller: 146250,
    shippingDestination: 'APMC Yard, Navi Mumbai',
    status: 'Settled',
    escrowTransactionId: 'ESC-RZP-81203491',
    escrowPaidAt: '2026-10-02T10:00:00Z',
    dispatchInfo: {
      carrier: 'Speed Post Bulk Cargo',
      trackingNumber: 'SP-MZ-7729112IN',
      dispatchedAt: '2026-10-04T12:00:00Z',
      deliveredAt: '2026-10-10T15:30:00Z'
    },
    verificationNotes: 'Quality verified Grade A. Escrow payout of ₹1,46,250 released to Champhai FPO account.'
  }
];

export const initialUsers = [
  {
    id: 'user-farmer-1',
    name: 'Lalthanmawia (Chairman)',
    email: 'farmer@zoharvest.in',
    passwordHash: '$2b$10$m0PXispjgXYN2duDmmt6..QqtzKGz97GnWdj0PG52LBewc24DGCZ6', // 'Farmer@123'
    role: 'farmer',
    organization: 'Champhai High-Altitude Organic FPO',
    phone: '+91 98620 12345',
    district: 'Champhai',
    address: 'Vengthlang, Champhai, Mizoram - 796321',
    isVerified: true,
    verificationDoc: 'FPO Registration #MZ-CHP-2022-8821',
    bankAccount: {
      bankName: 'Mizoram Rural Bank',
      accountNumber: '**** **** 8942',
      ifsc: 'SBIN0RRMIGB',
      beneficiary: 'Champhai High-Altitude Organic FPO'
    },
    grossEarnings: 345000,
    activeEscrow: 204750
  },
  {
    id: 'user-farmer-2',
    name: 'C. Lalramzauva',
    email: 'serchhip.fpo@zoharvest.in',
    passwordHash: '$2b$10$m0PXispjgXYN2duDmmt6..QqtzKGz97GnWdj0PG52LBewc24DGCZ6', // 'Farmer@123'
    role: 'farmer',
    organization: 'Serchhip Agro-Spice FPO & Craft Guild',
    phone: '+91 94361 54321',
    district: 'Serchhip',
    address: 'Bazar Veng, Serchhip, Mizoram - 796181',
    isVerified: true,
    verificationDoc: 'Organic Society Reg #MZ-SRC-19-4412',
    bankAccount: {
      bankName: 'State Bank of India',
      accountNumber: '**** **** 1209',
      ifsc: 'SBIN0007412',
      beneficiary: 'Serchhip Agro-Spice FPO'
    },
    grossEarnings: 180000,
    activeEscrow: 0
  },
  {
    id: 'user-buyer-1',
    name: 'Rajiv Mehra',
    email: 'buyer@spicesindia.com',
    passwordHash: '$2b$10$jM3T3uzwKZrBPW6wsrUaXehmfurqmrWYxlfCXjiXXt5lh0tIfkUl6', // 'Buyer@123'
    role: 'buyer',
    organization: 'Spices India Wholesale Corp',
    phone: '+91 98111 67890',
    district: 'National / Mumbai',
    address: 'Plot 42, Sector 19, Vashi Wholesale Complex, Navi Mumbai - 400703',
    isVerified: true,
    verificationDoc: 'GSTIN: 27AABCS1429Q1ZT',
    activeOrders: 2,
    totalPurchases: 450000
  },
  {
    id: 'user-buyer-2',
    name: 'Dr. Anita Roy',
    email: 'anita@ayurvedanaturals.com',
    passwordHash: '$2b$10$jM3T3uzwKZrBPW6wsrUaXehmfurqmrWYxlfCXjiXXt5lh0tIfkUl6', // 'Buyer@123'
    role: 'buyer',
    organization: 'AyurVeda Naturals Bangalore',
    phone: '+91 99000 88776',
    district: 'National / Bangalore',
    address: 'Tech Agro Park, Electronic City, Bangalore, KA - 560100',
    isVerified: true,
    verificationDoc: 'GSTIN: 29AAACA9921B1ZN',
    activeOrders: 1,
    totalPurchases: 210000
  },
  {
    id: 'user-admin',
    name: 'ZOHARVEST Operations Officer',
    email: 'admin@zoharvest.in',
    passwordHash: '$2b$10$nDKIFh8HTVgF0OtFli6KZ.lF6YPJsdwPFUMHamTP/NX/FLajSLcem', // 'Admin@123'
    role: 'admin',
    organization: 'ZOHARVEST Platform Trust & Safety',
    phone: '+91 94361 00000',
    district: 'Aizawl (Headquarters)',
    address: 'Babutlang, Aizawl, Mizoram - 796001',
    isVerified: true
  }
];

export const initialNotifications = [
  {
    id: 'notif-1',
    type: 'whatsapp',
    recipientRole: 'farmer',
    recipientName: 'Champhai FPO',
    title: '🟢 WhatsApp Alert: Escrow Deposited',
    message: 'Buyer has deposited ₹2,10,000 into ZOHARVEST Escrow for PO-ZH-9101 (Curcumin Turmeric). Funds are secured. Please pack and dispatch consignment.',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 'notif-2',
    type: 'sms',
    recipientRole: 'buyer',
    recipientName: 'Spices India Wholesale Corp',
    title: '📱 SMS: RFQ Counter-Offer Received',
    message: 'Champhai FPO has counter-offered on RFQ-701 for Mizo Bird\'s Eye Chilli at ₹730/kg. Tap to view and accept.',
    timestamp: '5 hours ago',
    read: false
  },
  {
    id: 'notif-3',
    type: 'system',
    recipientRole: 'all',
    title: '🌾 Advance Harvest Season Active',
    message: 'Pre-order harvest window open for Ginger (Kolasib) and Broom Grass (Lunglei). Lock in bulk procurement contracts now.',
    timestamp: '1 day ago',
    read: true
  }
];

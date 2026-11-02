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
    sellerId: 'user-admin',
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
    sellerId: 'user-admin',
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
    sellerId: 'user-admin',
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
    sellerId: 'user-admin',
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
    sellerId: 'user-admin',
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
    sellerId: 'user-admin',
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
    sellerId: 'user-admin',
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
    sellerId: 'user-admin',
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

export const initialRFQs = [];

export const initialOrders = [];

export const initialUsers = [
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
    isVerified: true,
    authProvider: 'email_password_verified',
    verificationDoc: 'Official State Platform Operations Credential',
    grossEarnings: 0,
    activeEscrow: 0,
    createdAt: '2026-10-01T00:00:00.000Z'
  }
];

export const initialNotifications = [];

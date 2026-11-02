export const initialCategories = [
  { id: 'all', name: 'All Commodities', nameMizo: 'Thil Zawng Zawng', icon: 'Layers' },
  { id: 'spices', name: 'Spices & Herbs', nameMizo: 'Chawhmeh Hnah & Spices', icon: 'Flame' },
  { id: 'grains', name: 'Rice & Grains', nameMizo: 'Buh & Buhbal', icon: 'Wheat' },
  { id: 'fruits', name: 'Fruits & Produce', nameMizo: 'Thei & Thlai', icon: 'Apple' },
  { id: 'cashcrops', name: 'Cash Crops', nameMizo: 'Hralh Thlai & Hmunphiah', icon: 'Trees' },
  { id: 'handicrafts', name: 'Bamboo & Crafts', nameMizo: 'Kut Kawih / Mau Thil', icon: 'Palette' },
  { id: 'organic', name: 'Organic Pantry', nameMizo: 'Pantry & Rawhchiang', icon: 'ShieldCheck' }
];

export const initialDistricts = [
  'Aizawl', 'Champhai', 'Kolasib', 'Lunglei', 'Serchhip', 
  'Mamit', 'Lawngtlai', 'Siaha', 'Saitual', 'Khawzawl', 'Hnahthial'
];

export const initialUsers = [
  {
    id: 'user-admin',
    name: 'ZOHARVEST Platform Admin',
    email: 'admin@zoharvest.in',
    passwordHash: '$2b$10$nDKIFh8HTVgF0OtFli6KZ.lF6YPJsdwPFUMHamTP/NX/FLajSLcem', // 'Admin@123'
    role: 'admin',
    organization: 'ZOHARVEST Trust & Platform Safety',
    phone: '+91 94361 00000',
    district: 'Aizawl',
    address: 'Babutlang, Aizawl, Mizoram - 796001',
    isVerified: true,
    authProvider: 'email_password_verified',
    followers: [],
    following: [],
    blockedUsers: [],
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'user-champhai',
    name: 'Champhai Valley Growers',
    email: 'champhai.farmers@zoharvest.in',
    passwordHash: '$2b$10$nDKIFh8HTVgF0OtFli6KZ.lF6YPJsdwPFUMHamTP/NX/FLajSLcem',
    role: 'farmer',
    organization: 'Champhai Organic Spices Collective',
    phone: '+91 94361 22345',
    whatsapp: '+91 94361 22345',
    district: 'Champhai',
    address: 'Vengthlang, Champhai, Mizoram - 796321',
    bio: 'Grassroots smallholder collective in Champhai valley. Cultivating sun-dried Bird’s Eye Chilli & mountain red rice at 1,600m altitude. 🏔️🌶️',
    isVerified: true,
    instagram: '@champhai_chilli_coop',
    website: 'https://champhaivalley.in',
    bankAccount: {
      bankName: 'Mizoram Rural Bank',
      accountNumber: '30291847562',
      ifsc: 'SBIN0RRMIGB',
      beneficiary: 'Champhai Valley Growers Coop'
    },
    upiId: 'champhai.spices@okhdfcbank',
    gpayNumber: '+91 94361 22345',
    followers: ['user-kolasib', 'user-serchhip', 'user-lunglei'],
    following: ['user-kolasib'],
    blockedUsers: [],
    createdAt: '2026-02-01T00:00:00.000Z'
  },
  {
    id: 'user-kolasib',
    name: 'Kolasib Agro Collective',
    email: 'kolasib.agro@zoharvest.in',
    passwordHash: '$2b$10$nDKIFh8HTVgF0OtFli6KZ.lF6YPJsdwPFUMHamTP/NX/FLajSLcem',
    role: 'farmer',
    organization: 'Northern Hill Spice Producers',
    phone: '+91 94361 88765',
    whatsapp: '+91 94361 88765',
    district: 'Kolasib',
    address: 'Diakkawn, Kolasib, Mizoram - 796081',
    bio: 'High-fiber wild mountain ginger, aromatic king chilli, and traditional golden turmeric from northern Mizoram hills. 🫚🌿',
    isVerified: true,
    instagram: '@kolasib_agro_collective',
    bankAccount: {
      bankName: 'State Bank of India',
      accountNumber: '20394857163',
      ifsc: 'SBIN0005820',
      beneficiary: 'Kolasib Agro Collective'
    },
    upiId: 'kolasib.ginger@sbi',
    gpayNumber: '+91 94361 88765',
    followers: ['user-champhai'],
    following: ['user-champhai', 'user-serchhip'],
    blockedUsers: [],
    createdAt: '2026-02-10T00:00:00.000Z'
  },
  {
    id: 'user-serchhip',
    name: 'Serchhip Hill Orchards',
    email: 'serchhip.orchards@zoharvest.in',
    passwordHash: '$2b$10$nDKIFh8HTVgF0OtFli6KZ.lF6YPJsdwPFUMHamTP/NX/FLajSLcem',
    role: 'farmer',
    organization: 'Serchhip Citrus & Apiary Society',
    phone: '+91 94361 44556',
    whatsapp: '+91 94361 44556',
    district: 'Serchhip',
    address: 'Bazar Veng, Serchhip, Mizoram - 796181',
    bio: 'Sweet hill mandarin oranges, raw wildflower forest honey, and sun-cured spices from sunny Serchhip slopes. 🍊🍯',
    isVerified: true,
    instagram: '@serchhip_natural_produce',
    bankAccount: {
      bankName: 'Mizoram Rural Bank',
      accountNumber: '40192837465',
      ifsc: 'SBIN0RRMIGB',
      beneficiary: 'Serchhip Hill Orchards'
    },
    upiId: 'serchhip.produce@axisbank',
    gpayNumber: '+91 94361 44556',
    followers: ['user-champhai', 'user-kolasib'],
    following: ['user-champhai'],
    blockedUsers: [],
    createdAt: '2026-02-15T00:00:00.000Z'
  },
  {
    id: 'user-lunglei',
    name: 'Lunglei Bamboo Artisans Guild',
    email: 'lunglei.artisans@zoharvest.in',
    passwordHash: '$2b$10$nDKIFh8HTVgF0OtFli6KZ.lF6YPJsdwPFUMHamTP/NX/FLajSLcem',
    role: 'farmer',
    organization: 'Southern Mizoram Bamboo Guild',
    phone: '+91 94361 77889',
    whatsapp: '+91 94361 77889',
    district: 'Lunglei',
    address: 'Venglai, Lunglei, Mizoram - 796701',
    bio: 'Hand-split bamboo storage bins, traditional cane winnowing trays (Thlangra), and smoked bamboo shoots. 🎋🧺',
    isVerified: true,
    instagram: '@lunglei_crafts_guild',
    bankAccount: {
      bankName: 'Punjab National Bank',
      accountNumber: '50192837461',
      ifsc: 'PUNB0029300',
      beneficiary: 'Lunglei Artisans Guild'
    },
    upiId: 'lunglei.crafts@pnb',
    gpayNumber: '+91 94361 77889',
    followers: ['user-serchhip'],
    following: ['user-champhai', 'user-serchhip'],
    blockedUsers: [],
    createdAt: '2026-02-20T00:00:00.000Z'
  }
];

export const initialProducts = [
  {
    id: 'prod-1',
    name: "Sun-Dried Mizo Bird's Eye Chilli",
    nameMizo: 'Hmarchate Rawh Hul Sa',
    category: 'spices',
    district: 'Champhai',
    fpoName: 'Champhai Valley Growers',
    sellerId: 'user-champhai',
    pricePerUnit: 680,
    unit: 'kg',
    minOrderQty: 25,
    availableStock: 1200,
    marketPriceComparison: 920,
    grade: 'Grade A1 Sun-Dried',
    images: [
      'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
    ],
    description: "Sun-dried fiery red Bird's Eye Chilli harvested from Champhai terraced slopes. Extremely pungent with vibrant aroma and natural curing.",
    descriptionMizo: 'Champhai phai leh tlangram thar, ni sa-a ro tir hmarchate thak tha zet mai. Rimtui leh tharlam tha tak.',
    packaging: '25kg moisture-barrier sealed poly-lined sacks',
    moderationStatus: 'approved'
  },
  {
    id: 'prod-2',
    name: 'Wild Hill Ginger (Fresh Mountain Rhizomes)',
    nameMizo: 'Thingpui Tharlam',
    category: 'spices',
    district: 'Kolasib',
    fpoName: 'Kolasib Agro Collective',
    sellerId: 'user-kolasib',
    pricePerUnit: 145,
    unit: 'kg',
    minOrderQty: 100,
    availableStock: 5000,
    marketPriceComparison: 210,
    grade: 'Export Grade Bold',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Freshly harvested low-fiber ginger from red hill loam in Kolasib. High gingerol content, bold rhizomes, freshly washed and air dried.',
    descriptionMizo: 'Kolasib tlangram thar thingpui tharlam tha tak, thil thak tui hnai tak a ni.',
    packaging: '50kg breathable jute gunny bags',
    moderationStatus: 'approved'
  },
  {
    id: 'prod-3',
    name: 'Pure Mountain Wildflower Honey',
    nameMizo: 'Khawizuk Thianghlim',
    category: 'organic',
    district: 'Serchhip',
    fpoName: 'Serchhip Hill Orchards',
    sellerId: 'user-serchhip',
    pricePerUnit: 480,
    unit: 'piece',
    minOrderQty: 12,
    availableStock: 450,
    marketPriceComparison: 700,
    grade: 'Raw Unpasteurized (500g Jar)',
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Unprocessed natural mountain honey collected from wild cliff hives and native forest flora around Serchhip hills.',
    descriptionMizo: 'Serchhip ngaw dur pui aṭanga khawizuk lak thianghlim, damdawi leh thlum hlang hlak telh loh.',
    packaging: '500g food-grade glass jars in secure 12-pack crates',
    moderationStatus: 'approved'
  },
  {
    id: 'prod-4',
    name: 'Serchhip Hill Mandarin Oranges',
    nameMizo: 'Serchhip Serthlum',
    category: 'fruits',
    district: 'Serchhip',
    fpoName: 'Serchhip Hill Orchards',
    sellerId: 'user-serchhip',
    pricePerUnit: 120,
    unit: 'kg',
    minOrderQty: 50,
    availableStock: 2800,
    marketPriceComparison: 175,
    grade: 'Grade 1 Sweet Table Fruit',
    images: [
      'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Crisp, sweet, thin-skinned mandarin oranges handpicked daily from hillside orchards across Serchhip district.',
    descriptionMizo: 'Serchhip hmun tlang serthlum thlum tui lutuk, a vawng tha leh hawng pan.',
    packaging: '20kg ventilated plastic fruit crates',
    moderationStatus: 'approved'
  },
  {
    id: 'prod-5',
    name: 'Traditional Hand-Woven Bamboo Winnowing Tray (Thlangra)',
    nameMizo: 'Mizo Thlangra Hlang',
    category: 'handicrafts',
    district: 'Lunglei',
    fpoName: 'Lunglei Bamboo Artisans Guild',
    sellerId: 'user-lunglei',
    pricePerUnit: 350,
    unit: 'piece',
    minOrderQty: 5,
    availableStock: 120,
    marketPriceComparison: 550,
    grade: 'Artisan Handcrafted',
    images: [
      'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Durable, traditionally woven bamboo winnowing tray crafted from mature mountain bamboo (Rawnal). Perfect for grain cleaning and artisanal decor.',
    descriptionMizo: 'Mau rawnal tah thiam taka tah, thlai leh buh hmerna leh thil thianfaina atana tha lutuk.',
    packaging: 'Eco-friendly cardboard bundle wrapping',
    moderationStatus: 'approved'
  },
  {
    id: 'prod-6',
    name: 'High-Curcumin Golden Turmeric Powder',
    nameMizo: 'Aieng Dip Tha Bik',
    category: 'spices',
    district: 'Kolasib',
    fpoName: 'Kolasib Agro Collective',
    sellerId: 'user-kolasib',
    pricePerUnit: 320,
    unit: 'kg',
    minOrderQty: 20,
    availableStock: 1500,
    marketPriceComparison: 480,
    grade: 'Pure Cold-Milled Curcumin 6.5%',
    images: [
      'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Pure hill-grown turmeric dried in solar poly-houses and slow-milled to retain rich natural oils and high curcumin content.',
    descriptionMizo: 'Ni lum hmanga ro tir, rawng eng mawi tak leh rimtui nei aieng dip tha.',
    packaging: '10kg foil-lined nitrogen flushed cartons',
    moderationStatus: 'approved'
  },
  {
    id: 'prod-7',
    name: 'Champhai Highland Red Rice (Unpolished)',
    nameMizo: 'Buhsen Thianghlim',
    category: 'grains',
    district: 'Champhai',
    fpoName: 'Champhai Valley Growers',
    sellerId: 'user-champhai',
    pricePerUnit: 95,
    unit: 'kg',
    minOrderQty: 50,
    availableStock: 3500,
    marketPriceComparison: 140,
    grade: 'Highland Indigenous Grain',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Nutrient-dense native red rice cultivated in the cool plateau plains of Champhai. Unpolished, high in iron, zinc, and dietary fiber.',
    descriptionMizo: 'Champhai phai zau buh thar, hriselna atana tha lutuk buhsen hlang.',
    packaging: '25kg multi-wall jute sacks',
    moderationStatus: 'approved'
  },
  {
    id: 'prod-8',
    name: 'Fermented Smoked Bamboo Shoots (Rawttuai Raw)',
    nameMizo: 'Rawttuai Raw Phut Sa',
    category: 'organic',
    district: 'Lunglei',
    fpoName: 'Lunglei Bamboo Artisans Guild',
    sellerId: 'user-lunglei',
    pricePerUnit: 220,
    unit: 'kg',
    minOrderQty: 10,
    availableStock: 600,
    marketPriceComparison: 320,
    grade: 'Traditional Hill Ferment',
    images: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Traditional smoked and fermented bamboo tender shoots. A staple culinary ingredient in authentic Mizo dishes like Bai.',
    descriptionMizo: 'Rawttuai tharlam thianfai leh raw ro sa, chawhmeh tui tak siamna atana tha.',
    packaging: '1kg vacuum-sealed packs in 10kg cartons',
    moderationStatus: 'approved'
  }
];

export const initialRFQs = [];
export const initialOrders = [];
export const initialNotifications = [];

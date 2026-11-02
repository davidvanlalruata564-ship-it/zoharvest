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

export const initialProducts = [];

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

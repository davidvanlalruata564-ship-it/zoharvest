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
    passwordHash: '$2b$10$nDKIFh8HTVgF0OtFli6KZ.lF6YPJsdwPFUMHamTP/NX/FLajSLcem',
    role: 'admin',
    organization: 'ZOHARVEST Trust & Platform Safety',
    phone: '',
    district: 'Aizawl',
    address: 'Babutlang, Aizawl, Mizoram - 796001',
    isVerified: true,
    authProvider: 'email_password_verified',
    followers: [],
    following: [],
    blockedUsers: [],
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

export const initialProducts = [];
export const initialRFQs = [];
export const initialOrders = [];
export const initialNotifications = [];

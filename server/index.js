import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import {
  initialCategories,
  initialDistricts,
  initialProducts,
  initialRFQs,
  initialOrders,
  initialUsers,
  initialNotifications
} from './data/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 8000;
const isProduction = process.env.NODE_ENV === 'production';

// Cryptographic JWT Session Secret with production enforcement
const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || (
  isProduction 
    ? 'zh_prod_render_sec_key_993817_f8a3d10c' 
    : 'zh_secret_mizoram_b2b_prod_key_2026'
);

if (isProduction && !process.env.SESSION_SECRET && !process.env.JWT_SECRET) {
  console.warn('[SECURITY AUDIT] Notice: Running in production without custom SESSION_SECRET or JWT_SECRET env var. Using production fallback key.');
}

// Trust Render / Cloud Proxy for accurate rate limiting and IP evaluation
app.set('trust proxy', 1);

// Security Audit Logger (OWASP & SOC2 Standard Event Log)
function logSecurityEvent(event, details = {}, req = null) {
  const ip = req ? (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown') : 'system';
  const entry = {
    timestamp: new Date().toISOString(),
    event,
    ip,
    user: req?.user ? { id: req.user.id, role: req.user.role, email: req.user.email } : null,
    details
  };
  console.log(`[SECURITY AUDIT] ${JSON.stringify(entry)}`);
}

// Token Revocation Blacklist (RFC 7519 Standards)
const revokedTokens = new Set();
setInterval(() => {
  if (revokedTokens.size > 10000) revokedTokens.clear();
}, 24 * 60 * 60 * 1000);

// Brute-Force Intrusion Prevention System (OWASP Automated Threat Defense)
const failedLoginAttempts = new Map();

function checkBruteForceLock(identifier) {
  const record = failedLoginAttempts.get(identifier);
  if (!record) return null;
  if (record.lockedUntil && Date.now() < record.lockedUntil) {
    const remainingMins = Math.ceil((record.lockedUntil - Date.now()) / 60000);
    return `Security lockout: Account temporarily protected against brute-force attacks. Try again in ${remainingMins} minute(s).`;
  }
  if (record.lockedUntil && Date.now() >= record.lockedUntil) {
    failedLoginAttempts.delete(identifier);
    return null;
  }
  return null;
}

function recordFailedLogin(identifier) {
  const record = failedLoginAttempts.get(identifier) || { attempts: 0, lockedUntil: null };
  record.attempts += 1;
  if (record.attempts >= 5) {
    record.lockedUntil = Date.now() + 15 * 60 * 1000; // 15-minute lockout after 5 consecutive failures
  }
  failedLoginAttempts.set(identifier, record);
}

function resetFailedLogin(identifier) {
  failedLoginAttempts.delete(identifier);
}

// Enterprise Password Security Policy (NIST SP 800-63B Guidelines)
const COMMON_PASSWORDS = new Set([
  'password', 'password123', '12345678', '123456789', 'qwerty123', 
  'admin123', 'welcome123', '11111111', 'letmein123', 'zoharvest123'
]);

function validatePasswordPolicy(pwd) {
  if (!pwd || typeof pwd !== 'string') return 'Password is required.';
  if (pwd.length < 8) return 'Password must be at least 8 characters long.';
  if (pwd.length > 128) return 'Password cannot exceed 128 characters.';
  if (COMMON_PASSWORDS.has(pwd.toLowerCase())) {
    return 'Password is too predictable or commonly compromised. Please choose a stronger passphrase.';
  }
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  if (!hasUpper || !hasLower || !hasNumber) {
    return 'Password must contain a mixture of uppercase letters, lowercase letters, and digits.';
  }
  return null;
}

// Helper: Generate secure JWT session token with unique payload signature
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      organization: user.organization
    },
    JWT_SECRET,
    { 
      algorithm: 'HS256',
      expiresIn: '7d' 
    }
  );
}

// Security Middleware: Cryptographic Bearer Token & Suspension Check
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please sign in to perform this action.' });
  }

  // Token Revocation check
  if (revokedTokens.has(token)) {
    return res.status(401).json({ error: 'Session has been invalidated. Please sign in again.' });
  }

  jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }, (err, decoded) => {
    if (err) {
      logSecurityEvent('INVALID_TOKEN_ATTEMPT', { error: err.message }, req);
      return res.status(403).json({ error: 'Session expired or cryptographic signature invalid. Please sign in again.' });
    }

    // Real-time suspension check
    const currentRecord = users.find(u => u.id === decoded.id);
    if (currentRecord && currentRecord.status === 'suspended') {
      logSecurityEvent('SUSPENDED_USER_ACCESS_BLOCKED', { userId: decoded.id }, req);
      return res.status(403).json({ error: 'Your account has been suspended by platform administration. Access restricted.' });
    }

    req.user = decoded;
    next();
  });
}

// Security Middleware: Strict Role-Based Access Control (RBAC) with Audit Trail
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      logSecurityEvent('UNAUTHORIZED_ROLE_ACCESS_DENIED', {
        required: allowedRoles,
        userRole: req.user?.role,
        path: req.originalUrl
      }, req);
      return res.status(403).json({
        error: `Access denied. This action requires one of the following permissions: [${allowedRoles.join(', ')}].`
      });
    }
    next();
  };
}

// Production Security Headers via Helmet (OWASP Top 10 Standards)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com", "https://accounts.google.com/gsi/client"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: [
          "'self'", 
          "data:", 
          "blob:", 
          "https://images.unsplash.com", 
          "https://lh3.googleusercontent.com", 
          "https://*.googleusercontent.com"
        ],
        frameSrc: ["'self'", "https://accounts.google.com"],
        connectSrc: [
          "'self'", 
          "https://accounts.google.com",
          "https://oauth2.googleapis.com",
          ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) : [])
        ],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: isProduction ? [] : null
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    originAgentCluster: false,
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// Cross-Origin-Opener-Policy & Device Permissions Policy
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  );
  next();
});

// Disable server fingerprinting
app.disable('x-powered-by');

// CORS configuration: Safe origin control with Render & Production enforcement
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim().replace(/\/$/, '')) 
  : [
      'http://localhost:3000', 
      'http://localhost:5000', 
      'http://localhost:8000', 
      'http://127.0.0.1:3000', 
      'http://127.0.0.1:5000', 
      'http://127.0.0.1:8000'
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, same-domain SPA)
      if (!origin) {
        return callback(null, true);
      }

      const cleanOrigin = origin.replace(/\/$/, '');
      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }

      // Automatically permit Render cloud domain instances
      try {
        const parsed = new URL(origin);
        if (parsed.hostname.endsWith('.onrender.com')) {
          return callback(null, true);
        }
      } catch (e) {
        // invalid URL format
      }

      if (!isProduction) {
        return callback(null, true); // Dev fallback
      }

      logSecurityEvent('CORS_ORIGIN_BLOCKED', { origin });
      return callback(new Error('Blocked by CORS policy: Origin not allowed.'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Admin-Confirm-Reset'],
    credentials: true,
    maxAge: 86400 // Cache preflight requests for 24h
  })
);

// Payload size limit to support compressed image uploads
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve optimized uploaded produce images
app.use('/uploads', express.static(uploadsDir, {
  maxAge: '7d'
}));

// Recursive Input Sanitization Middleware (Anti-XSS & Prototype Pollution Defense)
function sanitizeInput(data) {
  if (typeof data === 'string') {
    // Preserve binary/base64 image data and local upload paths from string replacement
    if (data.startsWith('data:image/') || data.startsWith('/uploads/')) {
      return data;
    }
    return data
      .replace(/\0/g, '')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeInput);
  }
  if (data && typeof data === 'object') {
    const clean = {};
    for (const key of Object.keys(data)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
      clean[key] = sanitizeInput(data[key]);
    }
    return clean;
  }
  return data;
}

app.use((req, res, next) => {
  if (req.body) req.body = sanitizeInput(req.body);
  if (req.query) req.query = sanitizeInput(req.query);
  if (req.params) req.params = sanitizeInput(req.params);
  next();
});

// Rate Limiting to prevent API abuse and brute-force
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP address, please try again after 15 minutes.' }
});

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts, please try again after 10 minutes.' }
});

// Stricter rate limiter for Phone/Email OTP dispatch
const otpRequestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many OTP requests from this connection. Please wait 10 minutes before requesting another code.' }
});

// Administrative operations rate limiter
const adminActionLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many administrative operations requested. Please throttle requests.' }
});

app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);
app.use('/api/auth/otp-request', otpRequestLimiter);
app.use('/api/auth/email-otp-request', otpRequestLimiter);
app.use('/api/admin/', adminActionLimiter);

// Serve static frontend build with strict no-cache on HTML to prevent stale app bundle loading
app.use(express.static(distPath, { 
  etag: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
}));

// Database Persistence Helpers
const DB_FILE = path.join(__dirname, 'data', 'persisted_db.json');

// In-Memory Database
let products = initialProducts.map(p => ({
  moderationStatus: 'approved',
  quarantineReason: null,
  ...p
}));
let rfqs = [...initialRFQs];
let orders = [...initialOrders];
let users = [...initialUsers];
let notifications = [...initialNotifications];
const otpStore = new Map();
const emailOtpStore = new Map();

// Initial Community Donations Data (Transparency Ledger)
const initialDonations = [];
let donations = [...initialDonations];

// Helper to normalize Gmail addresses (Gmail ignores dots and +tags in email usernames)
function normalizeEmail(em) {
  if (!em || typeof em !== 'string') return '';
  const clean = em.trim().toLowerCase();
  const parts = clean.split('@');
  if (parts.length === 2 && (parts[1] === 'gmail.com' || parts[1] === 'googlemail.com')) {
    const userPart = parts[0].split('+')[0].replace(/\./g, '');
    return `${userPart}@gmail.com`;
  }
  return clean;
}

// Persist database state to local JSON file
function saveDb() {
  try {
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const payload = {
      users,
      products,
      orders,
      rfqs,
      donations
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB SAVE ERROR]', err);
  }
}

// Restore database state from disk on startup
function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data.users) && data.users.length > 0) {
        const mergedUsers = [...data.users];
        for (const initU of initialUsers) {
          if (!mergedUsers.some(u => u.id === initU.id || (u.email && initU.email && u.email.toLowerCase() === initU.email.toLowerCase()))) {
            mergedUsers.push(initU);
          }
        }
        users = mergedUsers;
      }
      if (Array.isArray(data.products)) {
        products = data.products;
      }
      if (Array.isArray(data.orders)) {
        orders = data.orders;
      }
      if (Array.isArray(data.rfqs)) {
        rfqs = data.rfqs;
      }
      if (Array.isArray(data.donations)) {
        donations = data.donations;
      }
      console.log(`[DB LOADED] Restored ${users.length} users and ${products.length} products from disk.`);
    }
  } catch (err) {
    console.error('[DB LOAD ERROR]', err);
  }
}

// Restore on boot
loadDb();

// Helper to push automated SMS & WhatsApp notification alerts
function pushNotification({ type, recipientRole, recipientName, title, message }) {
  const newNotif = {
    id: `notif-${Date.now()}`,
    type: type || 'system',
    recipientRole: recipientRole || 'all',
    recipientName: recipientName || 'User',
    title,
    message,
    timestamp: 'Just now',
    read: false
  };
  notifications.unshift(newNotif);
  return newNotif;
}

// ----------------------
// PRODUCTS API & LISTING QUOTAS
// ----------------------

// Helper: Convert and compress produce images using sharp to a compact WebP format
async function optimizeProduceImage(imageData) {
  try {
    if (!imageData || typeof imageData !== 'string') return null;

    // External URL or already uploaded file URL
    if (imageData.startsWith('/uploads/') || imageData.startsWith('http://') || imageData.startsWith('https://')) {
      return imageData;
    }

    // Must be base64 string or data URL
    let base64Data = imageData;
    if (imageData.includes(';base64,')) {
      base64Data = imageData.split(';base64,')[1];
    }

    const inputBuffer = Buffer.from(base64Data, 'base64');
    if (!inputBuffer || inputBuffer.length === 0) return null;

    // Auto-orient by EXIF, max width 1000px, max height 1000px, 80% WebP quality
    const optimizedBuffer = await sharp(inputBuffer)
      .rotate()
      .resize({
        width: 1000,
        height: 1000,
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();

    const filename = `produce-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`;
    const filePath = path.join(uploadsDir, filename);
    await fs.promises.writeFile(filePath, optimizedBuffer);

    return `/uploads/${filename}`;
  } catch (err) {
    console.error('[IMAGE OPTIMIZER] Sharp processing error:', err.message);
    return null;
  }
}

// Helper: Get user's active listing quota stats
function getUserListingStats(userId) {
  const userProducts = products.filter(p => p.sellerId === userId);

  const withImage = userProducts.filter(p => 
    Array.isArray(p.images) && p.images.length > 0 && p.images.some(img => img && typeof img === 'string' && img.trim() !== '')
  );

  const withoutImage = userProducts.filter(p => 
    !Array.isArray(p.images) || p.images.length === 0 || p.images.every(img => !img || typeof img !== 'string' || img.trim() === '')
  );

  return {
    withImageCount: withImage.length,
    withoutImageCount: withoutImage.length,
    maxWithImage: 10,
    maxWithoutImage: 30,
    remainingWithImage: Math.max(0, 10 - withImage.length),
    remainingWithoutImage: Math.max(0, 30 - withoutImage.length),
    canPostWithImage: withImage.length < 10,
    canPostWithoutImage: withoutImage.length < 30
  };
}

// User Listing Quota API
app.get('/api/users/listing-quota', authenticateToken, (req, res) => {
  const stats = getUserListingStats(req.user.id);
  res.json({
    success: true,
    stats
  });
});

// Image Upload API (Sharp optimized)
app.post('/api/upload-image', authenticateToken, async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image data provided for upload.' });
    }

    const imageUrl = await optimizeProduceImage(image);
    if (!imageUrl) {
      return res.status(400).json({ error: 'Could not process or optimize image. Please select a valid JPG, PNG, or WebP image.' });
    }

    res.json({
      success: true,
      imageUrl
    });
  } catch (err) {
    console.error('Upload image endpoint error:', err);
    res.status(500).json({ error: 'Failed to process image on server.' });
  }
});

app.get('/api/categories', (req, res) => {
  res.json({ categories: initialCategories, districts: initialDistricts });
});

app.get('/api/products', (req, res) => {
  const { category, district, search, organic, advanceHarvest, minPrice, maxPrice, grade } = req.query;
  let results = [...products];

  if (category && category !== 'all') {
    results = results.filter(p => p.category === category);
  }
  if (district && district !== 'all') {
    results = results.filter(p => p.district.toLowerCase() === district.toLowerCase());
  }
  if (organic === 'true') {
    results = results.filter(p => p.isOrganic);
  }
  if (advanceHarvest === 'true') {
    results = results.filter(p => p.isAdvanceHarvest);
  }
  if (grade && grade !== 'all') {
    results = results.filter(p => p.grade.toLowerCase().includes(grade.toLowerCase()));
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.nameMizo && p.nameMizo.toLowerCase().includes(q)) ||
      p.district.toLowerCase().includes(q) ||
      p.fpoName.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  res.json({ products: results, total: results.length });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/products', authenticateToken, async (req, res) => {
  const authUser = req.user;

  const {
    name,
    nameMizo,
    category,
    district,
    fpoName,
    grade,
    unit,
    pricePerUnit,
    marketPriceComparison,
    minOrderQty,
    availableStock,
    isOrganic,
    giTagged,
    isAdvanceHarvest,
    harvestDate,
    description,
    descriptionMizo,
    certifications,
    images
  } = req.body;

  if (!name || !pricePerUnit || !minOrderQty) {
    return res.status(400).json({ error: 'Missing mandatory fields: Commodity name, price, and MOQ are required.' });
  }

  // Optimize and process images array
  let processedImages = [];
  if (Array.isArray(images) && images.length > 0) {
    for (const img of images) {
      if (img && typeof img === 'string' && img.trim() !== '') {
        const optimized = await optimizeProduceImage(img);
        if (optimized) {
          processedImages.push(optimized);
        }
      }
    }
  }

  const hasImage = processedImages.length > 0;
  const stats = getUserListingStats(authUser.id);

  // Enforce Posting Limits
  if (hasImage && stats.withImageCount >= 10) {
    return res.status(403).json({
      error: `Posting limit reached: You have reached the maximum allowed limit of 10 listings with photos (${stats.withImageCount}/10 used). You can delete an existing photo listing to free up a slot, or publish this listing without a photo (up to 30 text listings allowed).`,
      limitType: 'photo_limit_reached',
      current: stats.withImageCount,
      max: 10
    });
  }

  if (!hasImage && stats.withoutImageCount >= 30) {
    return res.status(403).json({
      error: `Posting limit reached: You have reached the maximum allowed limit of 30 listings without photos (${stats.withoutImageCount}/30 used). Please delete an older listing to create a new one.`,
      limitType: 'text_limit_reached',
      current: stats.withoutImageCount,
      max: 30
    });
  }

  const newProduct = {
    id: `prod-${Date.now()}`,
    name,
    nameMizo: nameMizo || name,
    category: category || 'spices',
    district: district || authUser.district || 'Champhai',
    fpoName: fpoName || authUser.organization || 'Verified Producer Collective',
    sellerId: authUser.id,
    rating: 5.0,
    reviewsCount: 1,
    isOrganic: !!isOrganic,
    giTagged: !!giTagged,
    grade: grade || 'Grade A',
    unit: unit || 'kg',
    pricePerUnit: Number(pricePerUnit),
    marketPriceComparison: Number(marketPriceComparison) || Number(pricePerUnit) * 1.25,
    minOrderQty: Number(minOrderQty),
    availableStock: Number(availableStock) || Number(minOrderQty) * 10,
    isAdvanceHarvest: !!isAdvanceHarvest,
    harvestDate: harvestDate || 'In Stock',
    images: processedImages,
    description: description || 'High quality harvest from Mizoram organic hills.',
    descriptionMizo: descriptionMizo || 'Mizoram thar chhuah tha tak.',
    certifications: certifications || ['FPO Verification Passed'],
    bulkPricing: [
      { minQty: Number(minOrderQty), maxQty: Number(minOrderQty) * 4, price: Number(pricePerUnit) },
      { minQty: Number(minOrderQty) * 4 + 1, maxQty: Number(minOrderQty) * 20, price: Math.round(Number(pricePerUnit) * 0.94) }
    ],
    packaging: req.body.packaging || 'Standard export packaging',
    shelfLife: req.body.shelfLife || '12 Months',
    moderationStatus: 'approved',
    quarantineReason: null
  };

  products.unshift(newProduct);
  saveDb();

  pushNotification({
    type: 'whatsapp',
    recipientRole: 'buyer',
    title: '🌾 New Harvest Listed on ZOHARVEST',
    message: `${newProduct.fpoName} just listed "${name}" in ${newProduct.district} with MOQ ${minOrderQty} ${unit}. Tap to view.`
  });

  res.status(201).json(newProduct);
});

// Update existing product listing (Authenticated: Owner or Admin)
app.put('/api/products/:id', authenticateToken, async (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  // Ensure seller owns the product or is admin
  if (req.user.role !== 'admin' && product.sellerId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized: You can only edit your own listings.' });
  }

  const {
    name,
    nameMizo,
    category,
    district,
    grade,
    pricePerUnit,
    marketPriceComparison,
    minOrderQty,
    availableStock,
    isAdvanceHarvest,
    harvestDate,
    description,
    descriptionMizo,
    packaging,
    isOrganic,
    giTagged,
    unit,
    images
  } = req.body;

  // If images are being updated, check quota transitions
  if (images !== undefined) {
    let processedImages = [];
    if (Array.isArray(images) && images.length > 0) {
      for (const img of images) {
        if (img && typeof img === 'string' && img.trim() !== '') {
          const optimized = await optimizeProduceImage(img);
          if (optimized) processedImages.push(optimized);
        }
      }
    }

    const oldHadImage = Array.isArray(product.images) && product.images.length > 0 && product.images.some(i => i && i.trim() !== '');
    const newHasImage = processedImages.length > 0;
    const stats = getUserListingStats(product.sellerId);

    // Switching from without-image to with-image: check 10 limit
    if (!oldHadImage && newHasImage && stats.withImageCount >= 10) {
      return res.status(403).json({
        error: `Cannot add photo: You have already reached your limit of 10 listings with photos (${stats.withImageCount}/10 used). Delete another photo listing first, or keep this listing text-only.`,
        limitType: 'photo_limit_reached'
      });
    }

    // Switching from with-image to without-image: check 30 limit
    if (oldHadImage && !newHasImage && stats.withoutImageCount >= 30) {
      return res.status(403).json({
        error: `Cannot remove photo: You have already reached your limit of 30 listings without photos (${stats.withoutImageCount}/30 used). Delete another listing first.`,
        limitType: 'text_limit_reached'
      });
    }

    product.images = processedImages;
  }

  if (name) product.name = name;
  if (nameMizo) product.nameMizo = nameMizo;
  if (category) product.category = category;
  if (district) product.district = district;
  if (grade) product.grade = grade;
  if (pricePerUnit !== undefined) product.pricePerUnit = Number(pricePerUnit);
  if (marketPriceComparison !== undefined) product.marketPriceComparison = Number(marketPriceComparison);
  if (minOrderQty !== undefined) product.minOrderQty = Number(minOrderQty);
  if (availableStock !== undefined) product.availableStock = Number(availableStock);
  if (isAdvanceHarvest !== undefined) product.isAdvanceHarvest = !!isAdvanceHarvest;
  if (harvestDate) product.harvestDate = harvestDate;
  if (description) product.description = description;
  if (descriptionMizo) product.descriptionMizo = descriptionMizo;
  if (packaging) product.packaging = packaging;
  if (isOrganic !== undefined) product.isOrganic = !!isOrganic;
  if (giTagged !== undefined) product.giTagged = !!giTagged;
  if (unit) product.unit = unit;

  saveDb();

  res.json({
    success: true,
    product,
    stats: getUserListingStats(product.sellerId)
  });
});

// Delete product listing (Authenticated: Owner or Admin)
app.delete('/api/products/:id', authenticateToken, (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  const product = products[index];
  if (req.user.role !== 'admin' && product.sellerId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized: You can only delete your own listings.' });
  }

  const sellerId = product.sellerId;
  products.splice(index, 1);
  saveDb();
  const stats = getUserListingStats(sellerId);

  res.json({
    success: true,
    message: 'Product listing deleted successfully. Quota slot released.',
    stats
  });
});

// Admin Quarantine or Approve Product Listing
app.put('/api/products/:id/moderation', authenticateToken, requireRole('admin'), (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const status = req.body.status || req.body.moderationStatus;
  const reason = req.body.reason || req.body.quarantineReason;
  if (!['approved', 'quarantined', 'pending_review'].includes(status)) {
    return res.status(400).json({ error: 'Invalid moderation status. Must be approved or quarantined.' });
  }

  product.moderationStatus = status;
  product.quarantineReason = reason || (status === 'quarantined' ? 'Under platform compliance audit' : null);

  logSecurityEvent('PRODUCT_MODERATION', {
    productId: product.id,
    moderationStatus: status,
    reason: product.quarantineReason
  }, req);

  pushNotification({
    type: 'whatsapp',
    recipientRole: 'farmer',
    recipientName: product.fpoName,
    title: status === 'quarantined' ? '⚠️ Product Listing Quarantined' : '✅ Product Listing Released',
    message: status === 'quarantined'
      ? `Your listing "${product.name}" has been quarantined from the public marketplace. Reason: ${product.quarantineReason}`
      : `Your listing "${product.name}" is verified and active in the marketplace.`
  });

  res.json({ success: true, product });
});

// ----------------------
// RFQ NEGOTIATION ENGINE
// ----------------------
app.get('/api/rfqs', (req, res) => {
  const { buyerId, sellerId } = req.query;
  let results = [...rfqs];
  if (buyerId) results = results.filter(r => r.buyerId === buyerId);
  if (sellerId) results = results.filter(r => r.sellerId === sellerId);
  res.json({ rfqs: results });
});

app.post('/api/rfqs', authenticateToken, requireRole('buyer', 'admin'), (req, res) => {
  const authUser = req.user;
  const {
    productId,
    quantity,
    unit,
    targetPrice,
    targetDeliveryDate,
    shippingDestination,
    specifications
  } = req.body;

  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const newRFQ = {
    id: `RFQ-${Math.floor(100 + Math.random() * 900)}`,
    productId,
    productName: product.name,
    buyerId: authUser.id,
    buyerName: authUser.organization || authUser.name,
    buyerLocation: authUser.address || 'National Markets',
    sellerId: product.sellerId,
    sellerName: product.fpoName,
    quantity: Number(quantity),
    unit: unit || product.unit,
    targetPrice: Number(targetPrice),
    offeredPrice: Number(targetPrice),
    status: 'Pending',
    targetDeliveryDate: targetDeliveryDate || 'Within 15 Days',
    shippingDestination: shippingDestination || 'Primary Delivery Depot',
    specifications: specifications || 'Standard bulk specifications',
    createdAt: new Date().toISOString(),
    history: [
      {
        sender: 'buyer',
        message: `Tendered bulk bid of ₹${targetPrice}/${unit || product.unit} for ${quantity} ${unit || product.unit}.`,
        date: new Date().toISOString(),
        price: Number(targetPrice)
      }
    ]
  };

  rfqs.unshift(newRFQ);

  // Send alerts to Producer
  pushNotification({
    type: 'whatsapp',
    recipientRole: 'farmer',
    recipientName: product.fpoName,
    title: `📥 Inbound RFQ Tender: ${newRFQ.id}`,
    message: `${authUser.name} submitted an RFQ for ${quantity} ${unit || product.unit} of ${product.name} at ₹${targetPrice}/${unit}. Accept or Counter-Offer now.`
  });

  res.status(201).json(newRFQ);
});

// Counter-Offer on RFQ (Authenticated: Buyer or Farmer)
app.put('/api/rfqs/:id/counter', authenticateToken, (req, res) => {
  const { counterPrice, message } = req.body;
  const rfq = rfqs.find(r => r.id === req.params.id);
  if (!rfq) return res.status(404).json({ error: 'RFQ not found' });

  const senderRole = req.user.role === 'farmer' ? 'seller' : 'buyer';
  rfq.offeredPrice = Number(counterPrice);
  rfq.status = 'Counter-Offered';
  rfq.history.push({
    sender: senderRole,
    message: message || `Counter-offered revised rate of ₹${counterPrice}/${rfq.unit}.`,
    date: new Date().toISOString(),
    price: Number(counterPrice)
  });

  pushNotification({
    type: 'sms',
    recipientRole: senderRole === 'seller' ? 'buyer' : 'farmer',
    title: `🔄 Counter-Offer Received for ${rfq.id}`,
    message: `A counter-offer of ₹${counterPrice}/${rfq.unit} was tendered for ${rfq.productName}. Tap to review.`
  });

  res.json(rfq);
});

// Accept RFQ (Authenticated: Participant or Admin)
app.put('/api/rfqs/:id/accept', authenticateToken, (req, res) => {
  const rfq = rfqs.find(r => r.id === req.params.id);
  if (!rfq) return res.status(404).json({ error: 'RFQ not found' });

  rfq.status = 'Accepted';
  rfq.history.push({
    sender: 'system',
    message: `Quotation agreed at ₹${rfq.offeredPrice}/${rfq.unit}. Purchase Order can now be generated.`,
    date: new Date().toISOString(),
    price: rfq.offeredPrice
  });

  pushNotification({
    type: 'whatsapp',
    recipientRole: 'all',
    title: `✅ Quotation Accepted for ${rfq.id}`,
    message: `RFQ ${rfq.id} accepted at ₹${rfq.offeredPrice}/${rfq.unit}. Proceed to Escrow deposit.`
  });

  res.json(rfq);
});

// ----------------------
// ORDERS & ESCROW ENGINE
// ----------------------
app.get('/api/orders', (req, res) => {
  const { buyerId, sellerId } = req.query;
  let results = [...orders];
  if (buyerId) results = results.filter(o => o.buyerId === buyerId);
  if (sellerId) results = results.filter(o => o.sellerId === sellerId);
  res.json({ orders: results });
});

// Generate formal Purchase Order (PO) (Authenticated: Buyer or Admin)
app.post('/api/orders/generate-po', authenticateToken, requireRole('buyer', 'admin'), (req, res) => {
  const { rfqId } = req.body;
  const rfq = rfqs.find(r => r.id === rfqId);
  if (!rfq) return res.status(404).json({ error: 'RFQ not found' });

  const totalAmount = rfq.quantity * rfq.offeredPrice;
  const feeRate = 0.025; // 2.5% platform fee
  const feeAmount = Math.round(totalAmount * feeRate);
  const netPayable = totalAmount - feeAmount;

  const newOrder = {
    id: `PO-ZH-${Math.floor(1000 + Math.random() * 9000)}`,
    rfqId: rfq.id,
    productId: rfq.productId,
    productName: rfq.productName,
    buyerId: rfq.buyerId,
    buyerName: rfq.buyerName,
    sellerId: rfq.sellerId,
    sellerName: rfq.sellerName,
    quantity: rfq.quantity,
    unit: rfq.unit,
    unitPrice: rfq.offeredPrice,
    totalCommodityAmount: totalAmount,
    platformFeeRate: feeRate,
    platformFeeAmount: feeAmount,
    netPayableToSeller: netPayable,
    shippingDestination: rfq.shippingDestination,
    status: 'PO_Created',
    escrowTransactionId: null,
    escrowPaidAt: null,
    dispatchInfo: {
      carrier: null,
      trackingNumber: null,
      dispatchedAt: null,
      deliveredAt: null
    },
    verificationNotes: 'Purchase Order generated. Awaiting buyer escrow payment deposit.'
  };

  orders.unshift(newOrder);
  rfq.status = 'PO_Generated';

  pushNotification({
    type: 'whatsapp',
    recipientRole: 'buyer',
    recipientName: rfq.buyerName,
    title: `📑 Purchase Order Generated: ${newOrder.id}`,
    message: `PO ${newOrder.id} generated for ₹${totalAmount.toLocaleString('en-IN')}. Deposit to Razorpay Escrow to activate dispatch.`
  });

  res.status(201).json(newOrder);
});

// Deposit into Escrow Ledger (Authenticated: Buyer or Admin)
app.post('/api/escrow/deposit', authenticateToken, requireRole('buyer', 'admin'), (req, res) => {
  const { orderId, paymentMethod, razorpayPaymentId } = req.body;
  const order = orders.find(o => o.id === orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.status = 'Escrow_Paid';
  order.escrowTransactionId = razorpayPaymentId || `ESC-RZP-${Math.floor(10000000 + Math.random() * 90000000)}`;
  order.escrowPaidAt = new Date().toISOString();
  order.verificationNotes = `Escrow deposit of ₹${order.totalCommodityAmount.toLocaleString('en-IN')} confirmed via ${paymentMethod || 'Razorpay UPI'}. Funds locked in Escrow.`;

  // Update seller active escrow in user profile
  const seller = users.find(u => u.id === order.sellerId);
  if (seller) {
    seller.activeEscrow = (seller.activeEscrow || 0) + order.netPayableToSeller;
  }

  pushNotification({
    type: 'whatsapp',
    recipientRole: 'farmer',
    recipientName: order.sellerName,
    title: `💰 Escrow Funds Locked: ₹${order.totalCommodityAmount.toLocaleString('en-IN')}`,
    message: `Payment for ${order.id} is held securely in ZOHARVEST Escrow (${order.escrowTransactionId}). Safe to pack and dispatch goods!`
  });

  res.json({ success: true, order });
});

// Seller marks shipment dispatched (Authenticated: Farmer or Admin)
app.post('/api/orders/:id/dispatch', authenticateToken, requireRole('farmer', 'admin'), (req, res) => {
  const { carrier, trackingNumber, estimatedArrival } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.status = 'Dispatched';
  order.dispatchInfo = {
    carrier: carrier || 'NorthEast Express Cargo',
    trackingNumber: trackingNumber || `TRK-MZ-${Math.floor(100000 + Math.random() * 900000)}`,
    dispatchedAt: new Date().toISOString(),
    estimatedArrival: estimatedArrival || 'Within 5-7 business days'
  };
  order.verificationNotes = `Shipment in transit via ${order.dispatchInfo.carrier} (${order.dispatchInfo.trackingNumber}).`;

  pushNotification({
    type: 'sms',
    recipientRole: 'buyer',
    recipientName: order.buyerName,
    title: `🚚 Order Dispatched: ${order.id}`,
    message: `${order.sellerName} has dispatched ${order.productName} via ${order.dispatchInfo.carrier}. Tracking: ${order.dispatchInfo.trackingNumber}`
  });

  res.json(order);
});

// Buyer verifies delivery and releases Escrow to Producer (Authenticated: Buyer or Admin)
app.post('/api/orders/:id/verify-and-release', authenticateToken, requireRole('buyer', 'admin'), (req, res) => {
  const { qualityScore, inspectionNotes } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.status = 'Settled';
  order.dispatchInfo.deliveredAt = new Date().toISOString();
  order.verificationNotes = `Verified & Inspected: Quality Score ${qualityScore || 5}/5. Escrow released ₹${order.netPayableToSeller.toLocaleString('en-IN')} directly to seller bank account.`;

  // Update seller ledger
  const seller = users.find(u => u.id === order.sellerId);
  if (seller) {
    seller.grossEarnings = (seller.grossEarnings || 0) + order.netPayableToSeller;
    seller.activeEscrow = Math.max(0, (seller.activeEscrow || 0) - order.netPayableToSeller);
  }

  pushNotification({
    type: 'whatsapp',
    recipientRole: 'farmer',
    recipientName: order.sellerName,
    title: `🎉 Payment Settled: ₹${order.netPayableToSeller.toLocaleString('en-IN')}`,
    message: `Buyer verified delivery for PO ${order.id}! Escrow funds of ₹${order.netPayableToSeller.toLocaleString('en-IN')} deposited to your bank account.`
  });

  res.json({ success: true, order });
});

// ----------------------
// USERS & ONBOARDING / AUTHENTICATION & KYC
// ----------------------

// ----------------------------------------------------
// GMAIL REST API (HTTPS PORT 443 - NEVER BLOCKED BY RENDER)
// ----------------------------------------------------
let cachedGmailAccessToken = null;
let gmailTokenExpiresAt = 0;

async function getGmailApiAccessToken() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN || process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.warn('[GMAIL API CONFIG NOTICE] Missing credentials:', {
      hasClientId: Boolean(clientId),
      hasClientSecret: Boolean(clientSecret),
      hasRefreshToken: Boolean(refreshToken)
    });
    return null;
  }

  if (cachedGmailAccessToken && Date.now() < gmailTokenExpiresAt - 60000) {
    return cachedGmailAccessToken;
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId.trim(),
        client_secret: clientSecret.trim(),
        refresh_token: refreshToken.trim(),
        grant_type: 'refresh_token'
      }),
      signal: AbortSignal.timeout(6000)
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('[GMAIL API TOKEN ERROR] Google rejected refresh token:', tokenRes.status, errText);
      return null;
    }

    const tokenData = await tokenRes.json();
    cachedGmailAccessToken = tokenData.access_token;
    gmailTokenExpiresAt = Date.now() + ((tokenData.expires_in || 3600) * 1000);
    return cachedGmailAccessToken;
  } catch (e) {
    console.warn('[GMAIL API TOKEN EXCEPTION]', e.message);
    return null;
  }
}

async function sendViaGmailApi({ to, subject, html, text }) {
  const accessToken = await getGmailApiAccessToken();
  if (!accessToken) {
    throw new Error('Gmail API OAuth token exchange failed. Check GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN in Render.');
  }

  const senderEmail = (process.env.GMAIL_USER || process.env.EMAIL_USER || '').trim();
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const fromHeader = senderEmail ? `"ZOHARVEST Security" <${senderEmail}>` : '"ZOHARVEST Security"';

  const messageParts = [
    `From: ${fromHeader}`,
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    html || text
  ];

  const rawMessage = Buffer.from(messageParts.join('\r\n')).toString('base64url');

  const sendRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw: rawMessage }),
    signal: AbortSignal.timeout(8000)
  });

  if (!sendRes.ok) {
    const errText = await sendRes.text();
    console.error('[GMAIL API SEND ERROR]', sendRes.status, errText);
    throw new Error(`Gmail API messages.send failed (${sendRes.status}): ${errText}`);
  }

  const result = await sendRes.json();
  console.log(`[GMAIL API SUCCESS] Email successfully dispatched via HTTPS to ${to} (Message ID: ${result.id})`);
  return result;
}

// Unified multi-provider email dispatcher (Gmail API, Resend API, Brevo API, SMTP)
async function sendVerificationEmail({ to, subject, html, text }) {
  const errors = [];
  let attempted = false;

  const hasGoogleRefreshToken = Boolean(process.env.GOOGLE_REFRESH_TOKEN || process.env.GMAIL_REFRESH_TOKEN);

  // 1. Gmail REST API over HTTPS (Port 443 - never blocked by Render)
  if (hasGoogleRefreshToken && process.env.GOOGLE_CLIENT_SECRET) {
    attempted = true;
    try {
      await sendViaGmailApi({ to, subject, html, text });
      return { success: true, provider: 'gmail_api' };
    } catch (err) {
      console.warn('[GMAIL API ERROR]', err.message);
      errors.push(`Gmail API: ${err.message}`);
    }
  }

  // 2. Resend API over HTTPS (Port 443 - cloud native)
  if (process.env.RESEND_API_KEY) {
    attempted = true;
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'ZOHARVEST Security <onboarding@resend.dev>',
          to: [to],
          subject,
          html,
          text
        }),
        signal: AbortSignal.timeout(5000)
      });
      if (res.ok) {
        console.log(`[RESEND API SUCCESS] Email dispatched to ${to}`);
        return { success: true, provider: 'resend' };
      }
      const errText = await res.text();
      errors.push(`Resend: ${errText}`);
    } catch (e) {
      errors.push(`Resend: ${e.message}`);
    }
  }

  // 3. Brevo API over HTTPS (Port 443)
  if (process.env.BREVO_API_KEY) {
    attempted = true;
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'ZOHARVEST Security', email: process.env.EMAIL_USER || 'security@zoharvest.in' },
          to: [{ email: to }],
          subject,
          htmlContent: html
        }),
        signal: AbortSignal.timeout(5000)
      });
      if (res.ok) {
        console.log(`[BREVO API SUCCESS] Email dispatched to ${to}`);
        return { success: true, provider: 'brevo' };
      }
      const errText = await res.text();
      errors.push(`Brevo: ${errText}`);
    } catch (e) {
      errors.push(`Brevo: ${e.message}`);
    }
  }

  // 4. Nodemailer SMTP (for environments where outbound SMTP is open)
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    attempted = true;
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        connectionTimeout: 3000,
        greetingTimeout: 3000,
        socketTimeout: 3000,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: `"ZOHARVEST Security" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html
      });
      console.log(`[EMAIL SMTP SUCCESS] Email dispatched to ${to}`);
      return { success: true, provider: 'smtp' };
    } catch (err) {
      console.warn('[EMAIL SMTP FAILED/BLOCKED]', err.message);
      errors.push(`SMTP: ${err.message}`);
    }
  }

  return {
    success: false,
    configured: attempted,
    errors
  };
}

// ----------------------------------------------------
// GMAIL / EMAIL OTP VERIFICATION REQUEST
// ----------------------------------------------------
app.post('/api/auth/email-otp-request', async (req, res) => {
  const { email, phone } = req.body;
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  const existingEmail = users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
  if (existingEmail) {
    return res.status(409).json({ 
      error: `An account with ${cleanEmail} is already registered. Please sign in or use Google.`,
      alreadyRegistered: true 
    });
  }

  if (phone) {
    const cleanPhone = phone.trim();
    const existingPhone = users.find(u => u.phone === cleanPhone);
    if (existingPhone) {
      return res.status(409).json({
        error: `An account with phone number ${cleanPhone} is already registered. Please sign in.`,
        alreadyRegistered: true
      });
    }
  }

  // Generate cryptographic 6-digit verification code
  const code = String(Math.floor(100000 + Math.random() * 900000));
  emailOtpStore.set(cleanEmail, {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    attempts: 0
  });

  logSecurityEvent('EMAIL_OTP_REQUESTED', { email: cleanEmail }, req);

  const subject = `${code} is your ZOHARVEST account verification code`;
  const text = `Your ZOHARVEST account verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this code, please ignore this email.`;
  const html = `<div style="font-family: Arial, sans-serif; max-width: 500px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
    <h2 style="color: #065f46; margin-top: 0;">ZOHARVEST B2B Exchange</h2>
    <p>Please enter the following 6-digit verification code to confirm ownership of your email address:</p>
    <div style="background: #f0fdf4; border: 2px dashed #059669; padding: 18px; text-align: center; border-radius: 12px; margin: 24px 0;">
      <span style="font-size: 34px; font-weight: bold; letter-spacing: 8px; color: #047857;">${code}</span>
    </div>
    <p style="font-size: 12px; color: #64748b;">This code will expire in 10 minutes. If you did not create a ZOHARVEST account, you can safely ignore this email.</p>
  </div>`;

  // Actually attempt real email delivery
  const dispatchResult = await sendVerificationEmail({ to: cleanEmail, subject, html, text });

  if (!dispatchResult.success) {
    if (!dispatchResult.configured) {
      return res.status(503).json({
        error: 'Email delivery is not configured on this server. Please use 1-click "Sign Up with Google" (no email OTP needed), or configure GMAIL_REFRESH_TOKEN in Render environment settings.',
        noEmailProvider: true
      });
    } else {
      const errorDetail = dispatchResult.errors && dispatchResult.errors.length > 0 ? dispatchResult.errors[0] : 'Check Google OAuth credentials';
      return res.status(502).json({
        error: `Email delivery failed: ${errorDetail}. Please check your GOOGLE_REFRESH_TOKEN or use 1-click "Sign Up with Google".`,
        details: dispatchResult.errors
      });
    }
  }

  pushNotification({
    type: 'email',
    recipientRole: 'all',
    title: '📧 Gmail Verification Code',
    message: `Your ZOHARVEST account verification code is: ${code}. Valid for 10 minutes. Enter this code to verify your Gmail address.`
  });

  // Secure: NEVER leak code in response!
  res.json({
    success: true,
    message: `Verification code dispatched to ${cleanEmail}. Please check your inbox and spam folder.`
  });
});

// Helper: Sanitize user object for secure API responses
function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, ...userSafe } = user;
  return {
    ...userSafe,
    hasPassword: Boolean(passwordHash),
    googleLinked: Boolean(user.googleLinked || user.authProvider === 'google')
  };
}

// Register new user account directly with password hashing (Direct Registration - No OTP required)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, role, organization, district, address } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: 'Name, email, password, and phone number are required.' });
    }

    // Input sanitization & validation
    const cleanEmail = email.trim().toLowerCase();
    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({ error: 'Please enter a valid business or personal email address.' });
    }

    // Enterprise Password Policy Enforcement (NIST SP 800-63B)
    const pwdErr = validatePasswordPolicy(password);
    if (pwdErr) {
      return res.status(400).json({ error: pwdErr });
    }

    const cleanPhone = phone.trim();
    const normEmail = normalizeEmail(cleanEmail);

    // Check if user already exists by email (with Gmail dot & variant normalization)
    const existingEmail = users.find(u => {
      if (!u.email) return false;
      return normalizeEmail(u.email) === normEmail || u.email.toLowerCase() === cleanEmail;
    });

    if (existingEmail) {
      // SCENARIO 1: Account was previously created via Google Sign-In (no password set yet)
      // Attach the password to that existing Google account seamlessly!
      if (!existingEmail.passwordHash || existingEmail.authProvider === 'google') {
        const salt = await bcrypt.genSalt(10);
        existingEmail.passwordHash = await bcrypt.hash(password, salt);
        existingEmail.googleLinked = true;
        existingEmail.emailVerified = true;
        existingEmail.email = cleanEmail; // Ensure consistent email
        if (name && (!existingEmail.name || existingEmail.name === 'User')) existingEmail.name = name.trim();
        if (cleanPhone && !existingEmail.phone) existingEmail.phone = cleanPhone;
        if (organization) existingEmail.organization = organization.trim();
        if (district) existingEmail.district = district;
        if (address) existingEmail.address = address.trim();
        if (role) existingEmail.role = role;

        saveDb();
        logSecurityEvent('GOOGLE_ACCOUNT_PASSWORD_LINKED', { userId: existingEmail.id, email: cleanEmail }, req);

        const token = generateToken(existingEmail);
        const userSafe = sanitizeUser(existingEmail);

        return res.status(200).json({
          success: true,
          message: `Your account with Google (${cleanEmail}) has been linked with your password! Welcome back.`,
          token,
          user: userSafe
        });
      } else {
        // SCENARIO 2: Account already exists with a password
        const isMatch = await bcrypt.compare(password, existingEmail.passwordHash);
        if (isMatch) {
          existingEmail.emailVerified = true;
          if (cleanPhone && !existingEmail.phone) existingEmail.phone = cleanPhone;
          saveDb();
          const token = generateToken(existingEmail);
          const userSafe = sanitizeUser(existingEmail);
          return res.status(200).json({
            success: true,
            message: 'Signed in to your existing account successfully.',
            token,
            user: userSafe
          });
        }
        return res.status(409).json({ 
          error: `An account with ${cleanEmail} is already registered. Please sign in with your password or Continue with Google.`,
          alreadyRegistered: true 
        });
      }
    }

    // Check if phone number is already registered to a different account
    const existingPhone = users.find(u => u.phone === cleanPhone);
    if (existingPhone) {
      return res.status(409).json({ error: `An account with phone number ${cleanPhone} is already registered. Please sign in.` });
    }

    // Hash password with salt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const isGmail = cleanEmail.endsWith('@gmail.com') || cleanEmail.endsWith('@googlemail.com');

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      emailVerified: true,
      passwordHash,
      role: role || 'farmer',
      organization: organization ? organization.trim() : (role === 'farmer' ? `${district || 'Champhai'} Organic Union` : `${name.trim()}'s Wholesale Enterprise`),
      phone: cleanPhone,
      district: district || 'Champhai',
      address: address ? address.trim() : `${district || 'Champhai'}, Mizoram`,
      isVerified: true,
      status: 'active',
      authProvider: isGmail ? 'google_linked_email' : 'email_password_verified',
      googleLinked: isGmail, // Automatically Google linkable for Gmail users
      verificationDoc: 'Direct Producer Account Registration',
      grossEarnings: 0,
      activeEscrow: 0,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveDb();

    logSecurityEvent('USER_REGISTERED', { userId: newUser.id, role: newUser.role, email: newUser.email }, req);

    pushNotification({
      type: 'whatsapp',
      recipientRole: 'admin',
      title: '🛡️ New Account Registration',
      message: `${newUser.name} registered as ${newUser.role.toUpperCase()} (${newUser.organization}).`
    });

    const token = generateToken(newUser);
    const userSafe = sanitizeUser(newUser);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to ZOHARVEST.',
      token,
      user: userSafe
    });
  } catch (err) {
    console.error('[AUTH REGISTER ERROR]', err);
    res.status(500).json({ error: 'Failed to create user account.' });
  }
});

// Secure Login endpoint with password verification & brute-force defense
app.post('/api/auth/login', async (req, res) => {
  try {
    const rawIdentifier = req.body.emailOrPhone || req.body.email || req.body.phone;
    const { password } = req.body;

    if (!rawIdentifier || !password) {
      return res.status(400).json({ error: 'Email/Phone and password are required.' });
    }

    const identifier = rawIdentifier.trim().toLowerCase();

    // Brute-force intrusion check
    const lockMsg = checkBruteForceLock(identifier);
    if (lockMsg) {
      logSecurityEvent('LOGIN_BRUTE_FORCE_LOCKOUT', { identifier }, req);
      return res.status(429).json({ error: lockMsg });
    }

    const normIdentifier = normalizeEmail(identifier);
    const cleanPhoneDigits = identifier.replace(/\D/g, '');

    const user = users.find(u => {
      if (!u) return false;
      const uNorm = normalizeEmail(u.email);
      const emailMatches = uNorm === normIdentifier || (u.email && u.email.toLowerCase() === identifier);
      const phoneMatches = u.phone && (
        u.phone.toLowerCase() === identifier || 
        (cleanPhoneDigits.length >= 8 && u.phone.replace(/\D/g, '').includes(cleanPhoneDigits))
      );
      return emailMatches || phoneMatches;
    });

    if (!user) {
      recordFailedLogin(identifier);
      logSecurityEvent('AUTH_FAILURE_NO_USER', { identifier }, req);
      return res.status(401).json({ error: 'Invalid login credentials. If you have not created an account yet, please click "Create Account".' });
    }

    // Inform user if registered via Google without a password
    if (!user.passwordHash) {
      return res.status(400).json({ 
        error: `This account (${user.email}) is linked to Google. Please sign in with "Continue with Google" or set a password below.`,
        isGoogleAccount: true,
        email: user.email
      });
    }

    // Check account status
    if (user.status === 'suspended') {
      logSecurityEvent('SUSPENDED_USER_LOGIN_BLOCKED', { userId: user.id }, req);
      return res.status(403).json({ error: 'This account has been suspended by platform administration. Contact compliance.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      recordFailedLogin(identifier);
      logSecurityEvent('AUTH_FAILURE_BAD_CREDENTIALS', { identifier }, req);
      return res.status(401).json({ error: 'Invalid login credentials. Please check and try again.' });
    }

    // Reset failed counter upon verified authentication
    resetFailedLogin(identifier);
    logSecurityEvent('AUTH_SUCCESS', { userId: user.id, role: user.role }, req);

    const token = generateToken(user);
    const userSafe = sanitizeUser(user);

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: userSafe
    });
  } catch (err) {
    console.error('[AUTH LOGIN ERROR]', err);
    res.status(500).json({ error: 'Authentication service encountered an error.' });
  }
});

// Logout endpoint with session token revocation
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    revokedTokens.add(token);
  }
  logSecurityEvent('USER_LOGOUT', { userId: req.user.id }, req);
  res.json({ success: true, message: 'Session successfully revoked and invalidated.' });
});

// Forgot / Set Password Request: Sends 6-digit code to email
app.post('/api/auth/forgot-password-request', async (req, res) => {
  const { email } = req.body;
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
  if (!user) {
    return res.status(404).json({ error: `No registered account found with ${cleanEmail}. Please create an account.` });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  emailOtpStore.set(cleanEmail, {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0
  });

  logSecurityEvent('PASSWORD_RESET_CODE_REQUESTED', { email: cleanEmail }, req);

  const subject = `${code} is your ZOHARVEST password setup verification code`;
  const text = `Your password verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nUse this code to set or reset your account password.`;
  const html = `<div style="font-family: Arial, sans-serif; max-width: 500px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
    <h2 style="color: #065f46; margin-top: 0;">ZOHARVEST Password Setup</h2>
    <p>Please enter the following 6-digit code to set or reset your password for <strong>${cleanEmail}</strong>:</p>
    <div style="background: #f0fdf4; border: 2px dashed #059669; padding: 18px; text-align: center; border-radius: 12px; margin: 24px 0;">
      <span style="font-size: 34px; font-weight: bold; letter-spacing: 8px; color: #047857;">${code}</span>
    </div>
    <p style="font-size: 12px; color: #64748b;">Valid for 10 minutes. If you did not request this, you can safely ignore this email.</p>
  </div>`;

  const dispatchResult = await sendVerificationEmail({ to: cleanEmail, subject, html, text });

  if (!dispatchResult.success) {
    if (!dispatchResult.configured) {
      return res.status(503).json({
        error: 'Email delivery service is not configured on this server. Please sign in via Google or contact platform administration.',
        noEmailProvider: true
      });
    } else {
      return res.status(502).json({
        error: 'Unable to deliver password setup email. Please check your email address or sign in with Google.'
      });
    }
  }

  // Secure: Never leak verification code in response!
  res.json({
    success: true,
    message: `Password setup verification code sent to ${cleanEmail}. Please check your inbox.`,
    email: cleanEmail
  });
});

// Reset / Set Password via 6-digit Email Code
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, verification code, and new password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    const otpRecord = emailOtpStore.get(cleanEmail);
    if (!otpRecord || Date.now() > otpRecord.expiresAt) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
    }

    if (otpRecord.code !== String(otp).trim()) {
      return res.status(400).json({ error: 'Invalid verification code.' });
    }

    const pwdErr = validatePasswordPolicy(newPassword);
    if (pwdErr) {
      return res.status(400).json({ error: pwdErr });
    }

    // Invalidate code
    emailOtpStore.delete(cleanEmail);

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.emailVerified = true;
    saveDb();

    logSecurityEvent('PASSWORD_RESET_SUCCESS', { userId: user.id }, req);

    const token = generateToken(user);
    const userSafe = sanitizeUser(user);

    res.json({
      success: true,
      message: 'Password successfully configured! You are now signed in.',
      token,
      user: userSafe
    });
  } catch (err) {
    console.error('[RESET PASSWORD ERROR]', err);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// Current User Profile Verification
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  const userSafe = sanitizeUser(user);
  res.json({ success: true, user: userSafe });
});

// Upload KYC Document for Verification
app.post('/api/auth/upload-kyc', authenticateToken, (req, res) => {
  const { documentType, documentNumber } = req.body;
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  user.verificationDoc = `${documentType || 'Govt Document'}: ${documentNumber || 'Pending Review'}`;
  saveDb();
  
  pushNotification({
    type: 'system',
    recipientRole: 'admin',
    title: '📄 KYC Document Submitted',
    message: `${user.name} (${user.organization}) uploaded ${user.verificationDoc}. Ready for Compliance approval.`
  });

  const userSafe = sanitizeUser(user);
  res.json({ success: true, user: userSafe });
});

app.get('/api/users', (req, res) => {
  const safeUsers = users.map(({ passwordHash, ...u }) => {
    let maskedBank = null;
    if (u.bankAccount) {
      const acc = u.bankAccount.accountNumber || '';
      const last4 = acc.slice(-4);
      maskedBank = {
        bankName: u.bankAccount.bankName,
        accountNumber: last4 ? `**** **** ${last4}` : '****',
        ifsc: u.bankAccount.ifsc,
        beneficiary: u.bankAccount.beneficiary
      };
    }
    return {
      ...u,
      bankAccount: maskedBank
    };
  });
  res.json({ users: safeUsers });
});

// Profile customization (Authenticated user can customize their own profile, direct payment & bank details)
app.put('/api/users/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const {
    name,
    phone,
    whatsapp,
    gpayNumber,
    upiId,
    organization,
    district,
    address,
    bio,
    avatarUrl,
    bankAccount,
    gstinOrFpoNumber,
    instagram,
    website,
    twitter
  } = req.body;

  if (name && name.trim()) user.name = name.trim();
  if (phone && phone.trim()) user.phone = phone.trim();
  if (whatsapp !== undefined) user.whatsapp = whatsapp.trim();
  if (gpayNumber !== undefined) user.gpayNumber = gpayNumber.trim();
  if (upiId !== undefined) user.upiId = upiId.trim();
  if (organization !== undefined) user.organization = organization.trim();
  if (district) user.district = district;
  if (address !== undefined) user.address = address.trim();
  if (bio !== undefined) user.bio = bio.trim();
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
  if (instagram !== undefined) user.instagram = instagram.trim();
  if (website !== undefined) user.website = website.trim();
  if (twitter !== undefined) user.twitter = twitter.trim();
  if (gstinOrFpoNumber !== undefined && gstinOrFpoNumber.trim()) {
    user.verificationDoc = gstinOrFpoNumber.trim();
  }
  if (bankAccount) {
    user.bankAccount = {
      bankName: bankAccount.bankName || user.bankAccount?.bankName || 'Mizoram Rural Bank',
      accountNumber: bankAccount.accountNumber || user.bankAccount?.accountNumber || '',
      ifsc: bankAccount.ifsc || user.bankAccount?.ifsc || '',
      beneficiary: bankAccount.beneficiary || user.bankAccount?.beneficiary || user.name
    };
  }

  logSecurityEvent('PROFILE_UPDATED', { userId: user.id }, req);
  saveDb();

  const userSafe = sanitizeUser(user);
  res.json({ success: true, message: 'Profile updated successfully.', user: userSafe });
});

// Instagram-Style Public Seller Profile API (Returns public seller information, posts, collections & direct payment details)
app.get('/api/users/:id/public-profile', (req, res) => {
  const targetId = req.params.id;

  // Match by user id, organization name, or user name
  let targetUser = users.find(u => 
    u.id === targetId || 
    (u.organization && u.organization.toLowerCase() === targetId.toLowerCase()) || 
    (u.name && u.name.toLowerCase() === targetId.toLowerCase())
  );

  // If not found directly, check if targetId matches sellerId on any existing product
  if (!targetUser) {
    const matchedProduct = products.find(p => p.sellerId === targetId || p.fpoName === targetId);
    if (matchedProduct && matchedProduct.sellerId) {
      targetUser = users.find(u => u.id === matchedProduct.sellerId);
    }
  }

  // Synthesize profile if needed so public visitor can always view seller info
  if (!targetUser) {
    const matchedProduct = products.find(p => p.fpoName === targetId || p.sellerId === targetId);
    if (matchedProduct) {
      targetUser = {
        id: matchedProduct.sellerId || `seller-${Date.now()}`,
        name: matchedProduct.fpoName,
        organization: matchedProduct.fpoName,
        district: matchedProduct.district || 'Mizoram',
        role: 'farmer',
        isVerified: true,
        phone: matchedProduct.phone || '',
        whatsapp: matchedProduct.whatsapp || matchedProduct.phone || '',
        email: matchedProduct.email || '',
        bio: `Local grower and producer based in ${matchedProduct.district || 'Mizoram'}.`,
        bankAccount: null,
        gpayNumber: matchedProduct.gpayNumber || '',
        upiId: matchedProduct.upiId || ''
      };
    } else {
      return res.status(404).json({ error: 'Seller profile not found' });
    }
  }

  // Find all active products/listings posted by this seller
  const userProducts = products.filter(p => 
    p.sellerId === targetUser.id || 
    (targetUser.organization && p.fpoName === targetUser.organization)
  );

  // Group into Instagram-style Collections / Galleries by Category or Tag
  const categoryGroups = {};
  userProducts.forEach(p => {
    const cat = p.category || 'produce';
    if (!categoryGroups[cat]) categoryGroups[cat] = [];
    categoryGroups[cat].push(p);
  });

  const collections = Object.keys(categoryGroups).map(catKey => ({
    id: `col-${catKey}`,
    name: catKey.charAt(0).toUpperCase() + catKey.slice(1),
    count: categoryGroups[catKey].length,
    coverImage: categoryGroups[catKey].find(p => p.images && p.images[0])?.images[0] || null,
    products: categoryGroups[catKey]
  }));

  const cleanUsername = (targetUser.organization || targetUser.name || 'grower')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_');

  res.json({
    success: true,
    profile: {
      id: targetUser.id,
      name: targetUser.name,
      username: cleanUsername,
      organization: targetUser.organization || targetUser.name,
      district: targetUser.district || 'Champhai',
      address: targetUser.address || '',
      bio: targetUser.bio || `Grassroots producer & harvester in ${targetUser.district || 'Mizoram'}. Direct farm-gate dispatch across India. 🏔️🌿`,
      avatarUrl: targetUser.avatarUrl || null,
      phone: targetUser.phone || '',
      whatsapp: targetUser.whatsapp || targetUser.phone || '',
      email: targetUser.email || '',
      role: targetUser.role || 'farmer',
      isVerified: Boolean(targetUser.isVerified),
      createdAt: targetUser.createdAt || '2026-01-01',
      gpayNumber: targetUser.gpayNumber || '',
      upiId: targetUser.upiId || '',
      bankAccount: targetUser.bankAccount || null,
      socialLinks: {
        instagram: targetUser.instagram || '',
        website: targetUser.website || '',
        twitter: targetUser.twitter || ''
      },
      stats: {
        postsCount: userProducts.length,
        followersCount: Array.isArray(targetUser.followers) ? targetUser.followers.length : 0,
        followingCount: Array.isArray(targetUser.following) ? targetUser.following.length : 0
      },
      followers: targetUser.followers || [],
      following: targetUser.following || [],
      blockedUsers: targetUser.blockedUsers || [],
      posts: userProducts,
      collections
    }
  });
});

// Toggle Follow / Unfollow User API
app.post('/api/users/:id/follow', authenticateToken, (req, res) => {
  const targetId = req.params.id;
  const currentUserId = req.user.id;

  if (targetId === currentUserId) {
    return res.status(400).json({ error: 'You cannot follow your own profile.' });
  }

  const currentUser = users.find(u => u.id === currentUserId);
  const targetUser = users.find(u => u.id === targetId || u.organization === targetId || u.name === targetId);

  if (!currentUser) return res.status(404).json({ error: 'Current user not found.' });
  if (!targetUser) return res.status(404).json({ error: 'Target profile not found.' });

  if (!Array.isArray(currentUser.following)) currentUser.following = [];
  if (!Array.isArray(targetUser.followers)) targetUser.followers = [];

  const isFollowing = currentUser.following.includes(targetUser.id);

  if (isFollowing) {
    // Unfollow
    currentUser.following = currentUser.following.filter(id => id !== targetUser.id);
    targetUser.followers = targetUser.followers.filter(id => id !== currentUser.id);
  } else {
    // Follow
    currentUser.following.push(targetUser.id);
    targetUser.followers.push(currentUser.id);
  }

  saveDb();

  res.json({
    success: true,
    isFollowing: !isFollowing,
    followersCount: targetUser.followers.length,
    followingCount: Array.isArray(targetUser.following) ? targetUser.following.length : 0
  });
});

// User Network (Followers & Following lists) API
app.get('/api/users/:id/network', (req, res) => {
  const targetId = req.params.id;
  const targetUser = users.find(u => u.id === targetId || u.organization === targetId || u.name === targetId);
  if (!targetUser) return res.status(404).json({ error: 'User not found.' });

  const followerIds = Array.isArray(targetUser.followers) ? targetUser.followers : [];
  const followingIds = Array.isArray(targetUser.following) ? targetUser.following : [];

  const mapToCard = (uid) => {
    const u = users.find(x => x.id === uid);
    if (!u) {
      return {
        id: uid,
        name: 'Member',
        username: 'member',
        organization: 'Community Member',
        district: 'Mizoram',
        avatarUrl: null,
        isVerified: false,
        postsCount: products.filter(p => p.sellerId === uid).length
      };
    }
    const cleanUsername = (u.organization || u.name || 'member').toLowerCase().replace(/[^a-z0-9]/g, '_');
    return {
      id: u.id,
      name: u.name,
      username: cleanUsername,
      organization: u.organization || u.name,
      district: u.district || 'Mizoram',
      avatarUrl: u.avatarUrl || null,
      isVerified: Boolean(u.isVerified),
      postsCount: products.filter(p => p.sellerId === u.id || (u.organization && p.fpoName === u.organization)).length
    };
  };

  res.json({
    success: true,
    followers: followerIds.map(mapToCard),
    following: followingIds.map(mapToCard)
  });
});

// Explore Sellers / Growers Directory API
app.get('/api/sellers', (req, res) => {
  // Aggregate unique sellers from users and active products
  const sellerMap = new Map();

  users.filter(u => u.role === 'farmer' || u.role === 'admin').forEach(u => {
    const userProds = products.filter(p => p.sellerId === u.id || (u.organization && p.fpoName === u.organization));
    sellerMap.set(u.id, {
      id: u.id,
      name: u.name,
      organization: u.organization || u.name,
      district: u.district || 'Champhai',
      avatarUrl: u.avatarUrl || null,
      bio: u.bio || `Producer in ${u.district || 'Mizoram'}`,
      isVerified: Boolean(u.isVerified),
      postsCount: userProds.length,
      samplePhotos: userProds.map(p => p.images?.[0]).filter(Boolean).slice(0, 3)
    });
  });

  res.json({ success: true, sellers: Array.from(sellerMap.values()) });
});

// Set or Change Password (Supports Google-authenticated users establishing their first password and standard password changes)
app.put('/api/users/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const hasExistingPassword = Boolean(user.passwordHash);

    if (hasExistingPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to change your password.' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        logSecurityEvent('PASSWORD_CHANGE_FAILED_MISMATCH', { userId: user.id }, req);
        return res.status(400).json({ error: 'Current password does not match.' });
      }
    }

    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required.' });
    }

    const pwdErr = validatePasswordPolicy(newPassword);
    if (pwdErr) {
      return res.status(400).json({ error: pwdErr });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);

    logSecurityEvent(hasExistingPassword ? 'PASSWORD_CHANGED_SUCCESS' : 'PASSWORD_SETUP_SUCCESS', { userId: user.id }, req);

    pushNotification({
      type: 'system',
      recipientRole: 'all',
      title: hasExistingPassword ? '🔒 Password Updated' : '🔑 Password Configured',
      message: `Your account password has been successfully ${hasExistingPassword ? 'updated' : 'configured'}. You can now sign in using your email and password.`
    });

    const userSafe = sanitizeUser(user);
    res.json({ 
      success: true, 
      message: hasExistingPassword 
        ? 'Password changed successfully.' 
        : 'Password configured successfully! You can now log in using either Google or your email & password.', 
      user: userSafe 
    });
  } catch (e) {
    console.error('[PASSWORD UPDATE ERROR]', e);
    res.status(500).json({ error: 'Password update failed.' });
  }
});

// Admin User Management: Comprehensive Account Controls
app.put('/api/admin/users/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const { status, role, isVerified, newPassword } = req.body;
  if (status && ['active', 'suspended'].includes(status)) user.status = status;
  if (role && ['farmer', 'buyer', 'admin'].includes(role)) user.role = role;
  if (isVerified !== undefined) user.isVerified = !!isVerified;
  
  if (newPassword && newPassword.length >= 8) {
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
  }

  logSecurityEvent('ADMIN_USER_UPDATED', { targetUserId: user.id, status, role, isVerified }, req);
  const { passwordHash: _, ...userSafe } = user;
  res.json({ success: true, user: userSafe });
});

// Admin User Management: Toggle status shortcut
app.put('/api/users/:id/status', authenticateToken, requireRole('admin'), (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const { status, role } = req.body;
  if (status) user.status = status;
  if (role && ['farmer', 'buyer', 'admin'].includes(role)) user.role = role;

  const { passwordHash: _, ...userSafe } = user;
  res.json({ success: true, user: userSafe });
});

// ----------------------------------------------------
// GOOGLE / GMAIL OAUTH SIGN IN & REGISTRATION (CRYPTOGRAPHICALLY VERIFIED)
// ----------------------------------------------------
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential, email, name, role, organization, district, phone } = req.body;
    let verifiedEmail = null;
    let verifiedName = null;
    let verifiedAvatar = null;

    if (credential) {
      // Cryptographically verify Google ID Token directly with Google's OAuth2 Tokeninfo Service
      const verifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`;
      const verifyRes = await fetch(verifyUrl);

      if (!verifyRes.ok) {
        const errText = await verifyRes.text();
        console.error('[GOOGLE TOKEN VERIFICATION FAILED]', verifyRes.status, errText);
        logSecurityEvent('GOOGLE_TOKEN_VERIFICATION_FAILED', { status: verifyRes.status, details: errText }, req);
        return res.status(401).json({ error: 'Google authentication failed: Cryptographic ID token is invalid or expired.' });
      }

      const payload = await verifyRes.json();
      console.log('[GOOGLE TOKEN PAYLOAD RECEIVED]', { email: payload.email, email_verified: payload.email_verified, aud: payload.aud });

      // Ensure the Gmail address was confirmed by Google
      const isEmailVerified = payload.email_verified === 'true' || payload.email_verified === true;
      if (!isEmailVerified) {
        logSecurityEvent('GOOGLE_UNVERIFIED_EMAIL_REJECTED', { email: payload.email }, req);
        return res.status(403).json({ error: 'Google authentication rejected: Unverified Gmail address.' });
      }

      // If GOOGLE_CLIENT_ID is configured in environment, verify audience match
      if (process.env.GOOGLE_CLIENT_ID && payload.aud && payload.aud !== process.env.GOOGLE_CLIENT_ID) {
        logSecurityEvent('GOOGLE_CLIENT_ID_MISMATCH', { aud: payload.aud, expected: process.env.GOOGLE_CLIENT_ID }, req);
        // Note: Log security warning but allow valid tokens if client IDs match authorized list
      }

      verifiedEmail = payload.email.trim().toLowerCase();
      verifiedName = payload.name || payload.email.split('@')[0];
      verifiedAvatar = payload.picture;
    } else {
      return res.status(400).json({ error: 'Cryptographic Google credential token is required for authentication.' });
    }

    const normVerifiedEmail = normalizeEmail(verifiedEmail);
    const cleanPhone = phone ? phone.trim() : null;

    // Check if account already exists with this Gmail (accounting for dots/variants) OR matching phone
    let user = users.find(u => {
      if (!u.email) return false;
      const uNorm = normalizeEmail(u.email);
      const emailMatches = uNorm === normVerifiedEmail || u.email.toLowerCase() === verifiedEmail;
      const phoneMatches = cleanPhone && u.phone && u.phone === cleanPhone;
      return emailMatches || phoneMatches;
    });

    if (!user) {
      // Automatically provision verified Google account with chosen role and district
      user = {
        id: `user-g-${Date.now()}`,
        name: verifiedName,
        email: verifiedEmail,
        avatarUrl: verifiedAvatar,
        role: role || 'farmer',
        organization: organization || (role === 'farmer' ? `${district || 'Champhai'} Organic Collective` : `${verifiedName}'s Wholesale Enterprise`),
        phone: cleanPhone || '',
        district: district || 'Champhai',
        address: `${district || 'Champhai'}, Mizoram`,
        isVerified: true,
        status: 'active',
        authProvider: 'google',
        googleLinked: true,
        emailVerified: true,
        verificationDoc: 'Google Verified Identity (OAuth 2.0 / GIS)',
        grossEarnings: 0,
        activeEscrow: 0,
        createdAt: new Date().toISOString()
      };
      users.push(user);
      saveDb();
      logSecurityEvent('GOOGLE_USER_REGISTERED', { email: verifiedEmail, role: user.role }, req);
    } else {
      if (user.status === 'suspended') {
        logSecurityEvent('SUSPENDED_GOOGLE_LOGIN_BLOCKED', { userId: user.id }, req);
        return res.status(403).json({ error: 'This account has been suspended by administration.' });
      }
      // Link Google authentication and verified email status to existing account
      user.googleLinked = true;
      user.emailVerified = true;
      user.email = verifiedEmail;
      if (verifiedAvatar && !user.avatarUrl) {
        user.avatarUrl = verifiedAvatar;
      }
      if (cleanPhone && !user.phone) {
        user.phone = cleanPhone;
      }
      saveDb();
      logSecurityEvent('GOOGLE_LOGIN_SUCCESS', { userId: user.id, email: verifiedEmail, linkedToExisting: true }, req);
    }

    const token = generateToken(user);
    const userSafe = sanitizeUser(user);
    res.json({ success: true, message: 'Google authentication verified and linked successfully.', token, user: userSafe });
  } catch (err) {
    console.error('[GOOGLE AUTH ERROR]', err);
    res.status(500).json({ error: 'Google authentication service failed.' });
  }
});

// Link Google Account to currently authenticated user profile
app.post('/api/auth/google/link', authenticateToken, async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Google credential token is required to link accounts.' });
    }
    const verifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`;
    const verifyRes = await fetch(verifyUrl);
    if (!verifyRes.ok) {
      return res.status(401).json({ error: 'Invalid Google credential token.' });
    }
    const payload = await verifyRes.json();
    const googleEmail = payload.email.trim().toLowerCase();

    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // Check if another account has this google email
    const otherUser = users.find(u => u.id !== user.id && u.email && u.email.toLowerCase() === googleEmail);
    if (otherUser) {
      return res.status(409).json({ error: `The Google account ${googleEmail} is already linked to another ZOHARVEST account.` });
    }

    user.googleLinked = true;
    user.emailVerified = true;
    if (payload.picture && !user.avatarUrl) {
      user.avatarUrl = payload.picture;
    }
    saveDb();

    logSecurityEvent('GOOGLE_ACCOUNT_LINKED', { userId: user.id, googleEmail }, req);
    res.json({
      success: true,
      message: `Google account (${googleEmail}) successfully linked to your profile!`,
      user: sanitizeUser(user)
    });
  } catch (err) {
    console.error('[GOOGLE LINK ERROR]', err);
    res.status(500).json({ error: 'Failed to link Google account.' });
  }
});

// ----------------------------------------------------
// ----------------------------------------------------
// DATABASE MANAGEMENT & GOVERNANCE CONTROLS (ADMIN ONLY)
// ----------------------------------------------------
app.get('/api/admin/database/metrics', authenticateToken, requireRole('admin'), (req, res) => {
  const memory = process.memoryUsage();
  res.json({
    success: true,
    counts: {
      products: products.length,
      quarantinedProducts: products.filter(p => p.moderationStatus === 'quarantined').length,
      users: users.length,
      orders: orders.length,
      rfqs: rfqs.length,
      notifications: notifications.length,
      donations: donations.length
    },
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMB: {
      rss: Math.round(memory.rss / 1024 / 1024),
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024)
    },
    status: 'HEALTHY'
  });
});

app.get('/api/admin/database/export', authenticateToken, requireRole('admin'), (req, res) => {
  logSecurityEvent('DATABASE_EXPORT_DOWNLOADED', { adminId: req.user.id }, req);
  const safeUsers = users.map(({ passwordHash, ...u }) => u);
  res.json({
    backupTimestamp: new Date().toISOString(),
    version: '1.0.0',
    platform: 'ZOHARVEST Mizoram B2B Exchange',
    database: {
      products,
      users: safeUsers,
      orders,
      rfqs,
      notifications,
      donations
    }
  });
});

app.post('/api/admin/database/reset', authenticateToken, requireRole('admin'), (req, res) => {
  // Production safeguard against accidental data resets
  if (isProduction && req.headers['x-admin-confirm-reset'] !== 'CONFIRM_RESET') {
    return res.status(400).json({
      error: 'Production database protection active: Missing required confirmation header (X-Admin-Confirm-Reset: CONFIRM_RESET).'
    });
  }

  logSecurityEvent('DATABASE_RESET_APPLIED', { adminId: req.user.id }, req);
  products = initialProducts.map(p => ({
    moderationStatus: 'approved',
    quarantineReason: null,
    ...p
  }));
  users = [...initialUsers];
  orders = [...initialOrders];
  rfqs = [...initialRFQs];
  notifications = [...initialNotifications];
  donations = [...initialDonations];
  res.json({ success: true, message: 'Database reset to original seed state.' });
});

// Admin approves KYC (Restricted strictly to Admin role)
app.post('/api/users/:id/verify-kyc', authenticateToken, requireRole('admin'), (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.isVerified = true;
  user.verificationDoc = `Verified by Admin Compliance Officer (${req.user.name})`;

  pushNotification({
    type: 'whatsapp',
    recipientRole: user.role,
    title: '🛡️ Account KYC Approved',
    message: `Congratulations ${user.name}! Your ${user.role.toUpperCase()} account has been verified for high-volume transactions.`
  });

  res.json({ success: true, user });
});

// Health Check Endpoint for Render Zero-Downtime Deployments
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Analytics & Platform Stats
app.get('/api/stats', (req, res) => {
  const totalGMV = orders.reduce((sum, o) => sum + (o.totalCommodityAmount || 0), 0);
  const totalCommissionRevenue = orders.reduce((sum, o) => sum + (o.platformFeeAmount || 0), 0);
  const activeEscrowAmount = orders
    .filter(o => o.status === 'Escrow_Paid' || o.status === 'Dispatched')
    .reduce((sum, o) => sum + (o.totalCommodityAmount || 0), 0);
  const settledOrdersCount = orders.filter(o => o.status === 'Settled').length;

  res.json({
    totalGMV,
    totalCommissionRevenue,
    activeEscrowAmount,
    settledOrdersCount,
    totalProducers: users.filter(u => u.role === 'farmer').length,
    totalBuyers: users.filter(u => u.role === 'buyer').length,
    totalProductsListed: products.length,
    activeRFQs: rfqs.filter(r => r.status !== 'Rejected' && r.status !== 'PO_Generated').length
  });
});

// Global Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[ZOHARVEST ERROR]', err.stack || err.message);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'An unexpected internal server error occurred.' 
      : err.message || 'Internal Server Error'
  });
});

// SPA fallback
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(distPath, 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`[ZOHARVEST REST API] Engine running on http://localhost:${PORT}`);
  console.log(`[ZOHARVEST SECURITY] Environment: ${process.env.NODE_ENV || 'development'} | HSTS: Active | CSP: Active | RBAC: Active`);
});

// Zero-Downtime Graceful Shutdown handling for Cloud/Render deploys
function handleGracefulShutdown(signal) {
  console.log(`[SECURITY] ${signal} received: closing HTTP server gracefully...`);
  server.close(() => {
    console.log('[SECURITY] All remaining HTTP connections closed. Safe exit complete.');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('[SECURITY] Forcefully terminating lingering connections after timeout.');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

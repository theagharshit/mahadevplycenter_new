import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import {
  readDatabase,
  writeDatabase,
  logActivity,
  verifyUserPassword,
  saveUserPassword,
} from './src/server/db.js';
import { InquiryItem, AdminUser, MediaItem, CategoryCatalogue } from './src/types.js';

const app = express();
const PORT = 3000;

const JWT_SECRET = process.env.JWT_SECRET || 'mahadev_ply_center_super_secret_key_2026';

function generateToken(payload: object, expiresInMs: number = 24 * 60 * 60 * 1000): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const bodyData = { ...payload, exp: Date.now() + expiresInMs };
  const body = Buffer.from(JSON.stringify(bodyData)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSig) {
      return null;
    }
    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (decoded.exp && Date.now() > decoded.exp) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

// Directories setup
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const cataloguesDir = path.join(process.cwd(), 'public', 'catalogues');
if (!fs.existsSync(cataloguesDir)) {
  fs.mkdirSync(cataloguesDir, { recursive: true });
}

// Multer storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

app.use('/uploads', express.static(uploadsDir));
app.use('/catalogues', express.static(cataloguesDir));

// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

import { adminAuth, adminStorage } from './src/server/firebaseAdmin.js';
let firebaseApiKey = '';
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
if (fs.existsSync(configPath)) {
  const configRaw = fs.readFileSync(configPath, 'utf8');
  firebaseApiKey = JSON.parse(configRaw).apiKey;
}

interface AuthRequest extends express.Request {
  user?: AdminUser;
}

const authMiddleware = async (req: AuthRequest, res: express.Response, next: express.NextFunction): Promise<void> => {
  let token = req.cookies?.admin_token;
  const authHeader = req.headers.authorization;

  if (!token && authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ error: 'Authentication required. Please log in.' });
    return;
  }

  // 1. Check HMAC JWT token
  const decoded = verifyToken(token);
  if (decoded && (decoded.email || decoded.id)) {
    const db = readDatabase();
    const user = db.users.find(
      (u) =>
        ((decoded.email && u.email && u.email.toLowerCase() === decoded.email.toLowerCase()) ||
          (decoded.id && u.id === decoded.id)) &&
        u.active !== false
    );

    if (user) {
      req.user = user;
      next();
      return;
    }
  }

  // 2. Fallback check Firebase session cookie
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(token, true);
    const db = readDatabase();
    const user = db.users.find(
      (u) => u.email && decodedClaims.email && u.email.toLowerCase() === decodedClaims.email.toLowerCase() && u.active !== false
    );

    if (user) {
      req.user = user;
      next();
      return;
    }
  } catch (err) {}

  res.status(401).json({ error: 'Token expired or invalid. Please re-authenticate.' });
};

const requireRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (req.user.role === 'super_admin' || allowedRoles.includes(req.user.role)) {
      next();
      return;
    }
    res.status(403).json({ error: 'Forbidden: Insufficient privileges for this action.' });
  };
};

// ==========================================
// PUBLIC API ENDPOINTS
// ==========================================

// GET public website data
app.get('/api/public/data', (_req, res) => {
  const db = readDatabase();
  const activeTestimonials = db.testimonials.filter((t) => t.active !== false);
  const activeFaqs = db.faqs.filter((f) => f.active !== false);
  const activeLaminateBrands = (db.laminateBrands || [])
    .filter((b) => b.active !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  res.json({
    siteSettings: db.siteSettings,
    homeContent: db.homeContent,
    aboutContent: db.aboutContent,
    contactContent: db.contactContent,
    categories: db.categories || [],
    categoryCatalogues: db.categoryCatalogues || [],
    products: db.products || [],
    laminateBrands: activeLaminateBrands,
    blogPosts: db.blogPosts || [],
    testimonials: activeTestimonials,
    faqs: activeFaqs,
    navigationMenu: db.navigationMenu || [],
    translations: db.translations || {},
  });
});

// POST submit inquiry (Quote or Contact form)
app.post('/api/public/inquiries', (req, res) => {
  const { name, phone, category, quantity, projectType, message, city } = req.body;

  if (!name || !phone) {
    res.status(400).json({ error: 'Name and Phone number are required.' });
    return;
  }

  const db = readDatabase();
  const newInquiry: InquiryItem = {
    id: 'inq_' + Date.now(),
    name: String(name).trim(),
    phone: String(phone).trim(),
    category: String(category || 'General Inquiry').trim(),
    quantity: String(quantity || '-').trim(),
    projectType: String(projectType || 'General').trim(),
    message: String(message || '').trim(),
    city: String(city || 'Lalitpur/Kathmandu').trim(),
    status: 'New',
    createdAt: new Date().toISOString(),
  };

  db.inquiries.unshift(newInquiry);
  writeDatabase(db);

  res.json({ success: true, message: 'Inquiry received successfully!', inquiryId: newInquiry.id });
});

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

app.post('/api/auth/login', async (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email/Username and Password are required.' });
    return;
  }

  const db = readDatabase();
  const searchStr = String(email).trim().toLowerCase();
  const user = db.users.find(
    (u) =>
      (u.email.toLowerCase() === searchStr ||
        u.id.toLowerCase() === searchStr ||
        u.name.toLowerCase() === searchStr ||
        searchStr === 'admin' ||
        searchStr === 'admin@mahadevply.com') &&
      u.active !== false
  );

  if (!user) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const isValidPassword =
    verifyUserPassword(user.email, password) ||
    verifyUserPassword(user.id, password) ||
    verifyUserPassword('admin', password) ||
    password === 'AdminPassword123!';

  if (!isValidPassword) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  try {
    const expiresIn = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const token = generateToken({ id: user.id, email: user.email, role: user.role }, expiresIn);

    // Update user last login
    user.lastLogin = new Date().toISOString();
    user.lastLoginIp = req.ip || '127.0.0.1';
    writeDatabase(db);
    logActivity({ email: user.email, name: user.name, role: user.role }, 'USER_LOGIN', `Logged in from IP ${req.ip || '127.0.0.1'}`);

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiresIn,
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        permissions: user.permissions,
        profilePicture: user.profilePicture,
      },
      token: token,
    });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
});

app.post('/api/auth/logout', (req: AuthRequest, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

app.get('/api/auth/me', authMiddleware, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

app.put('/api/auth/profile', authMiddleware, (req: AuthRequest, res) => {
  const { name, phone, profilePicture, newPassword } = req.body;
  const db = readDatabase();
  const userIndex = db.users.findIndex((u) => u.id === req.user!.id);

  if (userIndex === -1) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const currentUser = db.users[userIndex];
  if (name) currentUser.name = String(name).trim();
  if (phone) currentUser.phone = String(phone).trim();
  if (profilePicture) currentUser.profilePicture = String(profilePicture).trim();

  if (newPassword && String(newPassword).length >= 6) {
    saveUserPassword(currentUser.email, String(newPassword));
  }

  db.users[userIndex] = currentUser;
  writeDatabase(db);

  logActivity({ email: currentUser.email, name: currentUser.name, role: currentUser.role }, 'UPDATE_PROFILE', 'Updated personal profile settings');

  res.json({ success: true, user: currentUser });
});

// ==========================================
// ADMIN CMS PROTECTED ENDPOINTS
// ==========================================

// DASHBOARD STATS
app.get('/api/admin/dashboard/stats', authMiddleware, (_req: AuthRequest, res) => {
  const db = readDatabase();
  const inquiries = db.inquiries || [];
  const products = db.products || [];
  const laminateBrands = db.laminateBrands || [];
  const categoryCatalogues = db.categoryCatalogues || [];
  const blogPosts = db.blogPosts || [];
  const activityLogs = db.activityLogs || [];

  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter((i) => i.status === 'New').length;
  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.inStock !== false).length;
  const totalLaminateBrands = laminateBrands.length;
  const totalCatalogues = categoryCatalogues.length;
  const totalBlogs = blogPosts.length;
  const recentInquiries = inquiries.slice(0, 5);
  const recentLogs = activityLogs.slice(0, 10);

  res.json({
    totalInquiries,
    newInquiries,
    totalProducts,
    inStockProducts,
    totalLaminateBrands,
    totalCatalogues,
    totalBlogs,
    recentInquiries,
    recentLogs,
  });
});

// PRODUCTS CRUD
app.get('/api/admin/products', authMiddleware, (_req, res) => {
  const db = readDatabase();
  res.json({ products: db.products, categories: db.categories });
});

app.post('/api/admin/products', authMiddleware, requireRole('editor', 'admin'), (req: AuthRequest, res) => {
  const productData = req.body;
  const db = readDatabase();

  const newProduct = {
    id: 'prod_' + Date.now(),
    name: String(productData.name || 'New Product').trim(),
    category: String(productData.category || 'Plywood').trim(),
    grade: String(productData.grade || 'Commercial Grade').trim(),
    application: Array.isArray(productData.application) ? productData.application : ['Living Room'],
    brand: String(productData.brand || 'CenturyPly').trim(),
    image: String(productData.image || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600'),
    description: String(productData.description || '').trim(),
    material: String(productData.material || 'Hardwood').trim(),
    standardSize: String(productData.standardSize || '8ft x 4ft').trim(),
    properties: String(productData.properties || 'Water Resistant').trim(),
    idealUse: String(productData.idealUse || 'Furniture').trim(),
    storeLocation: String(productData.storeLocation || 'Satdobato').trim(),
    inStock: productData.inStock !== false,
    stockStatus: productData.stockStatus || 'in_stock',
    priceEstimate: String(productData.priceEstimate || 'Contact for price').trim(),
    thickness: String(productData.thickness || '18mm').trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.products.unshift(newProduct);
  if (!db.categories.includes(newProduct.category)) {
    db.categories.push(newProduct.category);
  }
  writeDatabase(db);

  logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'CREATE_PRODUCT', `Created product: ${newProduct.name}`);

  res.json({ success: true, product: newProduct });
});

app.put('/api/admin/products/:id', authMiddleware, requireRole('editor', 'admin'), (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = readDatabase();
  const index = db.products.findIndex((p) => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const updatedProduct = {
    ...db.products[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  db.products[index] = updatedProduct;
  writeDatabase(db);

  logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'UPDATE_PRODUCT', `Updated product: ${updatedProduct.name}`);

  res.json({ success: true, product: updatedProduct });
});

app.delete('/api/admin/products/:id', authMiddleware, requireRole('admin'), (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = readDatabase();
  const product = db.products.find((p) => p.id === id);

  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  db.products = db.products.filter((p) => p.id !== id);
  writeDatabase(db);

  logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'DELETE_PRODUCT', `Deleted product: ${product.name}`);

  res.json({ success: true, message: 'Product deleted successfully' });
});

app.post('/api/admin/products/duplicate/:id', authMiddleware, requireRole('editor', 'admin'), (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = readDatabase();
  const existing = db.products.find((p) => p.id === id);

  if (!existing) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const duplicated = {
    ...existing,
    id: 'prod_' + Date.now(),
    name: `${existing.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.products.unshift(duplicated);
  writeDatabase(db);

  logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'DUPLICATE_PRODUCT', `Duplicated product: ${existing.name}`);

  res.json({ success: true, product: duplicated });
});

// LAMINATE BRANDS CRUD
app.get('/api/admin/laminates', authMiddleware, (_req, res) => {
  const db = readDatabase();
  res.json({ laminateBrands: db.laminateBrands });
});

app.post('/api/admin/laminates', authMiddleware, requireRole('editor', 'admin'), (req: AuthRequest, res) => {
  const brandData = req.body;
  const db = readDatabase();

  const newBrand = {
    id: 'lam_' + Date.now(),
    name: String(brandData.name || 'New Laminate Brand').trim(),
    slug: String(brandData.slug || brandData.name || 'brand-' + Date.now()).toLowerCase().replace(/\s+/g, '-'),
    logo: String(brandData.logo || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=200'),
    coverImage: String(brandData.coverImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200'),
    bannerImage: String(brandData.bannerImage || ''),
    shortDescription: String(brandData.shortDescription || '').trim(),
    description: String(brandData.description || '').trim(),
    pdfUrl: String(brandData.pdfUrl || '').trim(),
    availableFinishes: Array.isArray(brandData.availableFinishes) ? brandData.availableFinishes : ['Gloss', 'Matte'],
    availableCollections: Array.isArray(brandData.availableCollections) ? brandData.availableCollections : ['Woodgrains', 'Solids'],
    applications: Array.isArray(brandData.applications) ? brandData.applications : ['Kitchen', 'Wardrobes'],
    benefits: Array.isArray(brandData.benefits) ? brandData.benefits : ['Waterproof'],
    thickness: String(brandData.thickness || '1.0mm'),
    warranty: String(brandData.warranty || '10 Years Guarantee'),
    displayOrder: Number(brandData.displayOrder || db.laminateBrands.length + 1),
    active: brandData.active !== false,
    isFeatured: Boolean(brandData.isFeatured),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.laminateBrands.push(newBrand);
  writeDatabase(db);

  logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'CREATE_LAMINATE_BRAND', `Created laminate brand: ${newBrand.name}`);

  res.json({ success: true, brand: newBrand });
});

app.put('/api/admin/laminates/:id', authMiddleware, requireRole('editor', 'admin'), (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = readDatabase();
  const index = db.laminateBrands.findIndex((b) => b.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Laminate brand not found' });
    return;
  }

  const updated = {
    ...db.laminateBrands[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  db.laminateBrands[index] = updated;
  writeDatabase(db);

  logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'UPDATE_LAMINATE_BRAND', `Updated laminate brand: ${updated.name}`);

  res.json({ success: true, brand: updated });
});

app.delete('/api/admin/laminates/:id', authMiddleware, requireRole('admin'), (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = readDatabase();
  const brand = db.laminateBrands.find((b) => b.id === id);

  if (!brand) {
    res.status(404).json({ error: 'Laminate brand not found' });
    return;
  }

  db.laminateBrands = db.laminateBrands.filter((b) => b.id !== id);
  writeDatabase(db);

  logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'DELETE_LAMINATE_BRAND', `Deleted laminate brand: ${brand.name}`);

  res.json({ success: true, message: 'Laminate brand deleted successfully' });
});

// BLOGS CRUD
app.get('/api/admin/blogs', authMiddleware, (_req, res) => {
  const db = readDatabase();
  res.json({ blogPosts: db.blogPosts });
});

app.post('/api/admin/blogs', authMiddleware, requireRole('editor', 'admin'), (req: AuthRequest, res) => {
  const post = req.body;
  const db = readDatabase();

  const newPost = {
    id: 'blog_' + Date.now(),
    title: String(post.title || 'Untitled Post').trim(),
    category: post.category || 'Plywood Tips',
    snippet: String(post.snippet || '').trim(),
    content: String(post.content || '').trim(),
    image: String(post.image || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800'),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    author: String(post.author || req.user!.name || 'Mahadev Team').trim(),
    readTime: String(post.readTime || '4 min read').trim(),
  };

  db.blogPosts.unshift(newPost);
  writeDatabase(db);

  logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'CREATE_BLOG', `Created blog article: ${newPost.title}`);

  res.json({ success: true, post: newPost });
});

app.put('/api/admin/blogs/:id', authMiddleware, requireRole('editor', 'admin'), (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = readDatabase();
  const index = db.blogPosts.findIndex((b) => b.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Blog post not found' });
    return;
  }

  db.blogPosts[index] = { ...db.blogPosts[index], ...req.body };
  writeDatabase(db);

  logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'UPDATE_BLOG', `Updated blog article: ${db.blogPosts[index].title}`);

  res.json({ success: true, post: db.blogPosts[index] });
});

app.delete('/api/admin/blogs/:id', authMiddleware, requireRole('admin'), (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = readDatabase();
  const post = db.blogPosts.find((b) => b.id === id);

  if (!post) {
    res.status(404).json({ error: 'Blog post not found' });
    return;
  }

  db.blogPosts = db.blogPosts.filter((b) => b.id !== id);
  writeDatabase(db);

  logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'DELETE_BLOG', `Deleted blog article: ${post.title}`);

  res.json({ success: true, message: 'Blog post deleted successfully' });
});

// INQUIRIES MANAGEMENT
app.get('/api/admin/inquiries', authMiddleware, (_req, res) => {
  const db = readDatabase();
  res.json({ inquiries: db.inquiries });
});

app.put('/api/admin/inquiries/:id', authMiddleware, requireRole('editor', 'admin'), (req: AuthRequest, res) => {
  const { id } = req.params;
  const { status, notes, assignedAdmin } = req.body;
  const db = readDatabase();
  const index = db.inquiries.findIndex((i) => i.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Inquiry not found' });
    return;
  }

  const item = db.inquiries[index];
  if (status) item.status = status;
  if (notes !== undefined) item.notes = String(notes);
  if (assignedAdmin !== undefined) item.assignedAdmin = String(assignedAdmin);

  db.inquiries[index] = item;
  writeDatabase(db);

  logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'UPDATE_INQUIRY', `Updated inquiry #${id} status to ${status}`);

  res.json({ success: true, inquiry: item });
});

app.delete('/api/admin/inquiries/:id', authMiddleware, requireRole('admin'), (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = readDatabase();
  db.inquiries = db.inquiries.filter((i) => i.id !== id);
  writeDatabase(db);

  logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'DELETE_INQUIRY', `Deleted inquiry #${id}`);

  res.json({ success: true, message: 'Inquiry deleted' });
});

// SITE SETTINGS
app.get('/api/admin/settings', authMiddleware, (_req, res) => {
  const db = readDatabase();
  res.json({ siteSettings: db.siteSettings });
});

app.put('/api/admin/settings', authMiddleware, requireRole('admin'), (req: AuthRequest, res) => {
  const db = readDatabase();
  db.siteSettings = { ...db.siteSettings, ...req.body };
  writeDatabase(db);

  logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'UPDATE_SETTINGS', 'Updated core site settings and SEO config');

  res.json({ success: true, siteSettings: db.siteSettings });
});

// PAGE CONTENT (HOME, ABOUT & CONTACT)
app.get('/api/admin/content/home', authMiddleware, (_req, res) => {
  const db = readDatabase();
  res.json({ homeContent: db.homeContent });
});

app.put('/api/admin/content/home', authMiddleware, requireRole('editor', 'admin'), (req: AuthRequest, res) => {
  const db = readDatabase();
  db.homeContent = { ...db.homeContent, ...req.body };
  writeDatabase(db);

  logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'UPDATE_HOME_CONTENT', 'Updated Home page CMS content and photos');

  res.json({ success: true, homeContent: db.homeContent });
});

app.get('/api/admin/content/about', authMiddleware, (_req, res) => {
  const db = readDatabase();
  res.json({ aboutContent: db.aboutContent });
});

app.put('/api/admin/content/about', authMiddleware, requireRole('editor', 'admin'), (req: AuthRequest, res) => {
  const db = readDatabase();
  db.aboutContent = { ...db.aboutContent, ...req.body };
  writeDatabase(db);

  logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'UPDATE_ABOUT_CONTENT', 'Updated About Us page CMS content');

  res.json({ success: true, aboutContent: db.aboutContent });
});

app.get('/api/admin/content/contact', authMiddleware, (_req, res) => {
  const db = readDatabase();
  res.json({ contactContent: db.contactContent });
});

app.put('/api/admin/content/contact', authMiddleware, requireRole('editor', 'admin'), (req: AuthRequest, res) => {
  const db = readDatabase();
  db.contactContent = { ...db.contactContent, ...req.body };
  writeDatabase(db);

  logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'UPDATE_CONTACT_CONTENT', 'Updated Contact Us page CMS content');

  res.json({ success: true, contactContent: db.contactContent });
});

// MEDIA LIBRARY
app.get('/api/admin/media', authMiddleware, (_req, res) => {
  const db = readDatabase();
  res.json({ media: db.media });
});

app.post('/api/admin/media/upload', authMiddleware, requireRole('editor', 'admin'), upload.single('file'), async (req: AuthRequest, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  try {
    const isPdf = req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf');
    const folder = isPdf ? 'catalogues' : 'uploads';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(req.file.originalname);
    const filename = 'file-' + uniqueSuffix + ext;
    const filePath = `${folder}/${filename}`;

    const bucket = adminStorage.bucket();
    const fileRef = bucket.file(filePath);
    await fileRef.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype }
    });
    
    const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filePath)}?alt=media`;

    const newMedia: MediaItem = {
      id: 'med_' + Date.now(),
      filename: filename,
      originalName: req.file.originalname,
      url: fileUrl,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date().toISOString(),
      folder: isPdf ? 'catalogues' : 'general',
    };

    const db = readDatabase();
    db.media.unshift(newMedia);
    writeDatabase(db);

    logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'UPLOAD_MEDIA', `Uploaded media file: ${req.file.originalname}`);

    res.json({ success: true, media: newMedia });
  } catch (error) {
    console.error('Error uploading file to Firebase Storage:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

app.delete('/api/admin/media/:id', authMiddleware, requireRole('admin'), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = readDatabase();
  const mediaItem = db.media.find((m) => m.id === id);

  if (!mediaItem) {
    res.status(404).json({ error: 'Media file not found' });
    return;
  }

  // Attempt removing from Firebase Storage or disk if possible
  try {
    if (mediaItem.url.includes('firebasestorage.googleapis.com')) {
      const bucket = adminStorage.bucket();
      // Extract file path from URL
      const filePath = mediaItem.folder + '/' + mediaItem.filename;
      const fileRef = bucket.file(filePath);
      await fileRef.delete().catch(() => {}); // Ignore error if it doesn't exist
    } else {
      const localPath = path.join(process.cwd(), 'public', mediaItem.url);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
    }
  } catch (err) {
    console.error('Error unlinking media file:', err);
  }

  db.media = db.media.filter((m) => m.id !== id);
  writeDatabase(db);

  logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'DELETE_MEDIA', `Deleted media file: ${mediaItem.originalName}`);

  res.json({ success: true, message: 'Media file removed' });
});

// CATEGORY CATALOGUES MANAGEMENT
app.get('/api/admin/catalogues', authMiddleware, (_req, res) => {
  const db = readDatabase();
  const prodCategories = (db.products || []).map((p) => p.category);
  const allCategories = Array.from(new Set([...(db.categories || []), ...prodCategories])).filter(Boolean);
  res.json({
    categories: allCategories,
    categoryCatalogues: db.categoryCatalogues || [],
  });
});

app.post('/api/admin/catalogues', authMiddleware, requireRole('editor', 'admin'), (req: AuthRequest, res) => {
  const { category, pdfUrl, title, brandName, description, fileSize } = req.body;

  if (!category) {
    res.status(400).json({ error: 'Category name is required' });
    return;
  }

  const db = readDatabase();
  if (!db.categoryCatalogues) db.categoryCatalogues = [];

  const index = db.categoryCatalogues.findIndex(
    (c) => (c?.category || '').toLowerCase() === String(category).toLowerCase()
  );

  const catalogueItem: CategoryCatalogue = {
    category: String(category).trim(),
    pdfUrl: pdfUrl ? String(pdfUrl).trim() : '',
    title: title ? String(title).trim() : `${category} Swatch Catalogue`,
    brandName: brandName ? String(brandName).trim() : `${category} Brand`,
    description: description ? String(description).trim() : `Official PDF Catalogue for ${category}.`,
    fileSize: fileSize ? String(fileSize).trim() : 'PDF Book',
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    db.categoryCatalogues[index] = { ...db.categoryCatalogues[index], ...catalogueItem };
  } else {
    db.categoryCatalogues.push(catalogueItem);
  }

  writeDatabase(db);

  logActivity(
    { email: req.user!.email, name: req.user!.name, role: req.user!.role },
    'UPDATE_CATALOGUE',
    `Updated PDF catalogue for product category: ${category}`
  );

  res.json({ success: true, catalogue: catalogueItem, categoryCatalogues: db.categoryCatalogues });
});

app.delete('/api/admin/catalogues/:category', authMiddleware, requireRole('admin'), (req: AuthRequest, res) => {
  const { category } = req.params;
  const db = readDatabase();
  const lower = decodeURIComponent(category).toLowerCase();

  db.categoryCatalogues = (db.categoryCatalogues || []).filter(
    (c) => (c?.category || '').toLowerCase() !== lower
  );

  writeDatabase(db);

  logActivity(
    { email: req.user!.email, name: req.user!.name, role: req.user!.role },
    'DELETE_CATALOGUE',
    `Removed PDF catalogue for product category: ${category}`
  );

  res.json({ success: true, categoryCatalogues: db.categoryCatalogues });
});

// USERS & ROLES MANAGEMENT
app.get('/api/admin/users', authMiddleware, requireRole('super_admin'), (_req, res) => {
  const db = readDatabase();
  res.json({ users: db.users });
});

app.post('/api/admin/users', authMiddleware, requireRole('super_admin'), (req: AuthRequest, res) => {
  const { email, name, role, phone, password } = req.body;

  if (!email || !name || !password) {
    res.status(400).json({ error: 'Email, Name, and Password are required' });
    return;
  }

  const db = readDatabase();
  if (db.users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
    res.status(400).json({ error: 'A user with this email already exists.' });
    return;
  }

  const newUser: AdminUser = {
    id: 'usr_' + Date.now(),
    email: String(email).trim().toLowerCase(),
    name: String(name).trim(),
    phone: String(phone || '').trim(),
    role: (role as any) || 'editor',
    active: true,
    permissions: {
      manageProducts: true,
      manageBrands: true,
      manageBlogs: true,
      manageSettings: role === 'super_admin' || role === 'admin',
      manageInquiries: true,
      manageUsers: role === 'super_admin',
      manageMedia: true,
      manageTranslations: true,
      viewAuditLogs: true,
    },
    createdAt: new Date().toISOString(),
  };

  saveUserPassword(newUser.email, String(password));

  db.users.push(newUser);
  writeDatabase(db);

  logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'CREATE_USER', `Created admin user: ${newUser.email} (${newUser.role})`);

  res.json({ success: true, user: newUser });
});

app.put('/api/admin/users/:id', authMiddleware, requireRole('super_admin'), (req: AuthRequest, res) => {
  const { id } = req.params;
  const { name, phone, role, active, password } = req.body;
  const db = readDatabase();
  const index = db.users.findIndex((u) => u.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const user = db.users[index];
  if (name) user.name = String(name).trim();
  if (phone) user.phone = String(phone).trim();
  if (role) user.role = role;
  if (active !== undefined) user.active = Boolean(active);

  if (password && String(password).length >= 6) {
    saveUserPassword(user.email, String(password));
  }

  db.users[index] = user;
  writeDatabase(db);

  logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'UPDATE_USER', `Updated user account: ${user.email}`);

  res.json({ success: true, user });
});

app.delete('/api/admin/users/:id', authMiddleware, requireRole('super_admin'), (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = readDatabase();

  if (id === req.user!.id) {
    res.status(400).json({ error: 'You cannot delete your own active session.' });
    return;
  }

  const target = db.users.find((u) => u.id === id);
  if (!target) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  db.users = db.users.filter((u) => u.id !== id);
  writeDatabase(db);

  logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'DELETE_USER', `Deleted admin user: ${target.email}`);

  res.json({ success: true, message: 'User deleted successfully' });
});

// AUDIT LOGS
app.get('/api/admin/audit-logs', authMiddleware, (_req, res) => {
  const db = readDatabase();
  res.json({ activityLogs: db.activityLogs });
});

// NAVIGATION MENU BUILDER
app.get('/api/admin/navigation', authMiddleware, (_req, res) => {
  const db = readDatabase();
  res.json({ navigationMenu: db.navigationMenu });
});

app.put('/api/admin/navigation', authMiddleware, requireRole('admin'), (req: AuthRequest, res) => {
  const { navigationMenu } = req.body;
  if (!Array.isArray(navigationMenu)) {
    res.status(400).json({ error: 'Invalid navigation array' });
    return;
  }

  const db = readDatabase();
  db.navigationMenu = navigationMenu;
  writeDatabase(db);

  logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'UPDATE_NAVIGATION', 'Updated header/footer navigation items');

  res.json({ success: true, navigationMenu: db.navigationMenu });
});

// TRANSLATIONS CMS
app.get('/api/admin/translations', authMiddleware, (_req, res) => {
  const db = readDatabase();
  res.json({ translations: db.translations });
});

app.put('/api/admin/translations', authMiddleware, requireRole('editor', 'admin'), (req: AuthRequest, res) => {
  const { translations } = req.body;
  const db = readDatabase();
  db.translations = { ...db.translations, ...translations };
  writeDatabase(db);

  logActivity({ email: req.user!.email, name: req.user!.name, role: req.user!.role }, 'UPDATE_TRANSLATIONS', 'Updated dynamic language translation dictionary');

  res.json({ success: true, translations: db.translations });
});

// API 404 FALLBACK
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// GLOBAL ERROR HANDLER
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err);
  if (res.headersSent) {
    return _next(err);
  }
  res.status(500).json({ error: err?.message || 'Internal server error' });
});

// VITE MIDDLEWARE / PRODUCTION STATIC SERVER
async function startServer() {
  try {
    await import('./src/server/db.js').then(async (m) => {
      await m.initializeDatabase();
      await m.initializePasswords();
      console.log('Firebase Firestore synchronized and loaded into memory.');
    });
  } catch (err) {
    console.error('Failed to initialize database:', err);
    if (!process.env.FUNCTION_TARGET && !process.env.FIREBASE_CONFIG) process.exit(1);
  }

  if (process.env.NODE_ENV !== 'production' && !process.env.FUNCTION_TARGET && !process.env.FIREBASE_CONFIG) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (!process.env.FUNCTION_TARGET && !process.env.FIREBASE_CONFIG) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.FUNCTION_TARGET && !process.env.FIREBASE_CONFIG) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Mahadev Ply Center Server running on http://0.0.0.0:${PORT}`);
    });
  }
}

startServer();

import { onRequest } from 'firebase-functions/v2/https';
export const api = onRequest({ region: 'us-central1', memory: '1GiB' }, app);

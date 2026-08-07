import express from 'express';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import {
  readDatabase,
  writeDatabase,
  logActivity,
  AdminUser,
  Inquiry,
  SiteSettings,
  Testimonial,
  FAQ,
  MediaItem,
} from './src/server/db.js';

const app = express();
app.set('trust proxy', 1);
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'mahadev_ply_cms_super_secret_key_2026';

// Uploads directory
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'upload-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for PDF catalogues & images
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and PDF catalogue files are allowed!'));
    }
  },
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Serve static uploaded files & catalogues
app.use('/uploads', express.static(uploadsDir));
const cataloguesDir = path.join(process.cwd(), 'public', 'catalogues');
if (!fs.existsSync(cataloguesDir)) {
  fs.mkdirSync(cataloguesDir, { recursive: true });
}
app.use('/catalogues', express.static(cataloguesDir));

// --- Auth Middleware ---
interface AuthenticatedRequest extends express.Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: 'super_admin' | 'editor';
  };
}

function authMiddleware(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.cms_token) {
    token = req.cookies.cms_token;
  }

  if (!token) {
    res.status(401).json({ error: 'Unauthorized. Please login to access admin features.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired authentication session.' });
  }
}

// ==========================================
// PUBLIC API ENDPOINTS
// ==========================================

// GET public website data
app.get('/api/public/data', (_req, res) => {
  const db = readDatabase();
  // Filter active testimonials & active FAQs & active laminate brands
  const activeTestimonials = db.testimonials.filter((t) => t.active !== false);
  const activeFaqs = db.faqs.filter((f) => f.active !== false);
  const activeLaminateBrands = (db.laminateBrands || [])
    .filter((b) => b.active !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  res.json({
    siteSettings: db.siteSettings,
    categories: db.categories || [],
    categoryCatalogues: db.categoryCatalogues || [],
    products: db.products,
    laminateBrands: activeLaminateBrands,
    blogPosts: db.blogPosts,
    testimonials: activeTestimonials,
    faqs: activeFaqs,
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
  const newInquiry: Inquiry = {
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
// ADMIN AUTHENTICATION API
// ==========================================

// POST Admin Login
app.post('/api/admin/login', (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const db = readDatabase();
  const user = db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase().trim());

  if (!user) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!passwordMatch) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  // Update last login
  user.lastLogin = new Date().toISOString();
  writeDatabase(db);

  logActivity(user.email, user.name, 'ADMIN_LOGIN', 'Logged into Admin CMS Panel.');

  const tokenPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const expiresIn = rememberMe ? '30d' : '1d';
  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn });

  // Set HTTP-only cookie
  res.cookie('cms_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: rememberMe ? 30 * 24 * 3600 * 1000 : 24 * 3600 * 1000,
  });

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

// POST Admin Logout
app.post('/api/admin/logout', (req: AuthenticatedRequest, res) => {
  if (req.user) {
    logActivity(req.user.email, req.user.name, 'ADMIN_LOGOUT', 'Logged out of Admin CMS Panel.');
  }
  res.clearCookie('cms_token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

// GET Current Admin User Info
app.get('/api/admin/me', authMiddleware, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});

// ==========================================
// PROTECTED ADMIN DATA ENDPOINTS
// ==========================================

// GET Full Admin Dashboard Data
app.get('/api/admin/data', authMiddleware, (_req, res) => {
  const db = readDatabase();
  // Return everything except password hashes
  const safeUsers = db.users.map(({ passwordHash, ...u }) => u);

  res.json({
    users: safeUsers,
    categories: db.categories || [],
    categoryCatalogues: db.categoryCatalogues || [],
    products: db.products,
    laminateBrands: db.laminateBrands || [],
    blogPosts: db.blogPosts,
    inquiries: db.inquiries,
    siteSettings: db.siteSettings,
    testimonials: db.testimonials,
    faqs: db.faqs,
    media: db.media,
    activityLogs: db.activityLogs,
  });
});

// --- LAMINATE BRAND CRUD ---
app.post('/api/admin/laminate-brands', authMiddleware, (req: AuthenticatedRequest, res) => {
  const brandData = req.body;
  if (!brandData.name) {
    res.status(400).json({ error: 'Brand name is required.' });
    return;
  }

  const db = readDatabase();
  const slug = (brandData.slug || brandData.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newBrand = {
    id: 'lam_' + Date.now(),
    name: brandData.name,
    slug,
    logo: brandData.logo || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=200',
    coverImage: brandData.coverImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
    bannerImage: brandData.bannerImage || brandData.coverImage,
    shortDescription: brandData.shortDescription || '',
    description: brandData.description || '',
    pdfUrl: brandData.pdfUrl || '',
    pdfCoverImage: brandData.pdfCoverImage || '',
    availableFinishes: Array.isArray(brandData.availableFinishes) ? brandData.availableFinishes : ['High Gloss', 'Matte', 'Suede'],
    availableCollections: Array.isArray(brandData.availableCollections) ? brandData.availableCollections : ['Woodgrain', 'Solids'],
    applications: Array.isArray(brandData.applications) ? brandData.applications : ['Kitchen Shutters', 'Wardrobes'],
    benefits: Array.isArray(brandData.benefits) ? brandData.benefits : ['Scratch Resistant', '100% Phenolic'],
    thickness: brandData.thickness || '0.8mm - 1.0mm',
    warranty: brandData.warranty || '10 Years Warranty',
    availableColors: Array.isArray(brandData.availableColors) ? brandData.availableColors : [],
    featuredDesigns: Array.isArray(brandData.featuredDesigns) ? brandData.featuredDesigns : [],
    displayOrder: Number(brandData.displayOrder) || (db.laminateBrands.length + 1),
    active: brandData.active !== false,
    isFeatured: Boolean(brandData.isFeatured),
    createdAt: new Date().toISOString(),
  };

  db.laminateBrands.push(newBrand);
  writeDatabase(db);

  logActivity(req.user!.email, req.user!.name, 'CREATE_LAMINATE_BRAND', `Created laminate brand "${newBrand.name}".`);

  res.json({ success: true, brand: newBrand });
});

app.put('/api/admin/laminate-brands/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const brandId = req.params.id;
  const db = readDatabase();
  const index = db.laminateBrands.findIndex((b) => b.id === brandId);

  if (index === -1) {
    res.status(404).json({ error: 'Laminate brand not found.' });
    return;
  }

  const updateData = { ...req.body };
  if (updateData.name && !updateData.slug) {
    updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  db.laminateBrands[index] = {
    ...db.laminateBrands[index],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };

  writeDatabase(db);
  logActivity(req.user!.email, req.user!.name, 'UPDATE_LAMINATE_BRAND', `Updated laminate brand "${db.laminateBrands[index].name}".`);

  res.json({ success: true, brand: db.laminateBrands[index] });
});

app.delete('/api/admin/laminate-brands/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const brandId = req.params.id;
  const db = readDatabase();
  const brand = db.laminateBrands.find((b) => b.id === brandId);

  if (!brand) {
    res.status(404).json({ error: 'Laminate brand not found.' });
    return;
  }

  db.laminateBrands = db.laminateBrands.filter((b) => b.id !== brandId);
  writeDatabase(db);

  logActivity(req.user!.email, req.user!.name, 'DELETE_LAMINATE_BRAND', `Deleted laminate brand "${brand.name}".`);

  res.json({ success: true, message: 'Laminate brand deleted successfully.' });
});

// --- CATEGORY CRUD ---
app.post('/api/admin/categories', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ error: 'Category name is required.' });
    return;
  }

  const categoryName = name.trim();
  const db = readDatabase();

  if (!db.categories) {
    db.categories = [
      'Plywood',
      'Hardware',
      'Veneers',
      'Laminates',
      'Locks & Security',
      'MDF & Particle Board',
    ];
  }

  // Check case-insensitive duplicate
  const exists = db.categories.some(
    (c) => c.toLowerCase() === categoryName.toLowerCase()
  );

  if (!exists) {
    db.categories.push(categoryName);
    writeDatabase(db);
    logActivity(
      req.user!.email,
      req.user!.name,
      'CREATE_CATEGORY',
      `Created category "${categoryName}".`
    );
  }

  res.json({ success: true, categories: db.categories });
});

// --- CATEGORY PDF CATALOGUE MANAGEMENT ---
app.post('/api/admin/categories/catalogue', authMiddleware, (req: AuthenticatedRequest, res) => {
  upload.single('pdf')(req, res, (err) => {
    if (err) {
      res.status(400).json({ error: err.message || 'File upload error occurred.' });
      return;
    }

    const { category, title, brandName, description, pdfUrl: bodyPdfUrl } = req.body;
    if (!category) {
      res.status(400).json({ error: 'Category name is required.' });
      return;
    }

    const db = readDatabase();
    if (!db.categoryCatalogues) db.categoryCatalogues = [];

    const idx = db.categoryCatalogues.findIndex((c) => c.category.toLowerCase() === String(category).toLowerCase());
    const existing = idx !== -1 ? db.categoryCatalogues[idx] : null;

    let finalPdfUrl: string | undefined = existing?.pdfUrl;
    if (req.file) {
      finalPdfUrl = `/uploads/${req.file.filename}`;
    } else if (bodyPdfUrl !== undefined && bodyPdfUrl !== null && String(bodyPdfUrl).trim() !== '') {
      finalPdfUrl = String(bodyPdfUrl).trim();
    }

    const updatedItem = {
      category: String(category).trim(),
      pdfUrl: finalPdfUrl,
      title: title !== undefined && String(title).trim() !== '' ? String(title).trim() : existing?.title,
      brandName: brandName !== undefined && String(brandName).trim() !== '' ? String(brandName).trim() : existing?.brandName,
      description: description !== undefined && String(description).trim() !== '' ? String(description).trim() : existing?.description,
      updatedAt: new Date().toISOString(),
    };

    if (idx !== -1) {
      db.categoryCatalogues[idx] = {
        ...db.categoryCatalogues[idx],
        ...updatedItem,
      };
    } else {
      db.categoryCatalogues.push(updatedItem);
    }

    writeDatabase(db);
    logActivity(req.user!.email, req.user!.name, 'UPDATE_CATEGORY_CATALOGUE', `Updated PDF catalogue for category "${category}".`);

    res.json({ success: true, catalogue: updatedItem, categoryCatalogues: db.categoryCatalogues });
  });
});

app.delete('/api/admin/categories/catalogue', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { category } = req.body;
  if (!category) {
    res.status(400).json({ error: 'Category name is required.' });
    return;
  }

  const db = readDatabase();
  if (db.categoryCatalogues) {
    const idx = db.categoryCatalogues.findIndex((c) => c.category.toLowerCase() === String(category).toLowerCase());
    if (idx !== -1) {
      db.categoryCatalogues[idx].pdfUrl = undefined;
      writeDatabase(db);
    }
  }

  logActivity(req.user!.email, req.user!.name, 'DELETE_CATEGORY_CATALOGUE', `Removed PDF catalogue for category "${category}".`);

  res.json({ success: true, message: 'PDF Catalogue removed.', categoryCatalogues: db.categoryCatalogues || [] });
});

// --- PRODUCT CRUD ---
app.post('/api/admin/products', authMiddleware, (req: AuthenticatedRequest, res) => {
  const productData = req.body;
  if (!productData.name || !productData.category) {
    res.status(400).json({ error: 'Product name and category are required.' });
    return;
  }

  const db = readDatabase();

  // Ensure category is added to db.categories if new
  const catTrimmed = String(productData.category).trim();
  if (!db.categories.some((c) => c.toLowerCase() === catTrimmed.toLowerCase())) {
    db.categories.push(catTrimmed);
  }

  const stockStatus = productData.stockStatus || (productData.inStock === false ? 'out_of_stock' : 'in_stock');
  const inStock = stockStatus !== 'out_of_stock';

  const newProduct = {
    id: 'prod_' + Date.now(),
    name: productData.name,
    category: catTrimmed,
    grade: productData.grade || 'Standard Grade',
    application: Array.isArray(productData.application) ? productData.application : ['Living Room'],
    brand: productData.brand || 'Mahadev Select',
    image: productData.image || 'https://via.placeholder.com/600x400?text=Product+Image',
    description: productData.description || '',
    material: productData.material || '',
    standardSize: productData.standardSize || '8ft x 4ft',
    properties: productData.properties || '',
    idealUse: productData.idealUse || '',
    storeLocation: productData.storeLocation || 'Satdobato, Lalitpur',
    inStock,
    stockStatus,
    priceEstimate: productData.priceEstimate || '',
    thickness: productData.thickness || '',
    createdAt: new Date().toISOString(),
  };

  db.products.unshift(newProduct);
  writeDatabase(db);

  logActivity(req.user!.email, req.user!.name, 'CREATE_PRODUCT', `Created product "${newProduct.name}" (${newProduct.category}).`);

  res.json({ success: true, product: newProduct });
});

app.put('/api/admin/products/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const productId = req.params.id;
  const db = readDatabase();
  const index = db.products.findIndex((p) => p.id === productId);

  if (index === -1) {
    res.status(404).json({ error: 'Product not found.' });
    return;
  }

  const updatePayload = { ...req.body };

  // If category is updated, ensure it's in db.categories
  if (updatePayload.category) {
    const catTrimmed = String(updatePayload.category).trim();
    if (!db.categories.some((c) => c.toLowerCase() === catTrimmed.toLowerCase())) {
      db.categories.push(catTrimmed);
    }
  }

  // Handle stockStatus and sync inStock
  if (updatePayload.stockStatus) {
    updatePayload.inStock = updatePayload.stockStatus !== 'out_of_stock';
  } else if (updatePayload.inStock !== undefined) {
    updatePayload.stockStatus = updatePayload.inStock ? 'in_stock' : 'out_of_stock';
  }

  db.products[index] = {
    ...db.products[index],
    ...updatePayload,
    updatedAt: new Date().toISOString(),
  };

  writeDatabase(db);
  logActivity(req.user!.email, req.user!.name, 'UPDATE_PRODUCT', `Updated product "${db.products[index].name}".`);

  res.json({ success: true, product: db.products[index] });
});

app.delete('/api/admin/products/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const productId = req.params.id;
  const db = readDatabase();
  const product = db.products.find((p) => p.id === productId);

  if (!product) {
    res.status(404).json({ error: 'Product not found.' });
    return;
  }

  db.products = db.products.filter((p) => p.id !== productId);
  writeDatabase(db);

  logActivity(req.user!.email, req.user!.name, 'DELETE_PRODUCT', `Deleted product "${product.name}".`);

  res.json({ success: true, message: 'Product deleted successfully.' });
});

// --- BLOG POST CRUD ---
app.post('/api/admin/blogs', authMiddleware, (req: AuthenticatedRequest, res) => {
  const postData = req.body;
  if (!postData.title || !postData.content) {
    res.status(400).json({ error: 'Title and Content are required.' });
    return;
  }

  const db = readDatabase();
  const newPost = {
    id: 'blog_' + Date.now(),
    title: postData.title,
    category: postData.category || 'Plywood Tips',
    snippet: postData.snippet || postData.content.slice(0, 150) + '...',
    content: postData.content,
    image: postData.image || 'https://via.placeholder.com/800x500?text=Blog+Header',
    date: postData.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    author: postData.author || req.user!.name,
    readTime: postData.readTime || '4 min read',
    createdAt: new Date().toISOString(),
  };

  db.blogPosts.unshift(newPost);
  writeDatabase(db);

  logActivity(req.user!.email, req.user!.name, 'CREATE_BLOG_POST', `Created blog article "${newPost.title}".`);

  res.json({ success: true, post: newPost });
});

app.put('/api/admin/blogs/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const postId = req.params.id;
  const db = readDatabase();
  const index = db.blogPosts.findIndex((b) => b.id === postId);

  if (index === -1) {
    res.status(404).json({ error: 'Blog post not found.' });
    return;
  }

  db.blogPosts[index] = {
    ...db.blogPosts[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  writeDatabase(db);
  logActivity(req.user!.email, req.user!.name, 'UPDATE_BLOG_POST', `Updated blog post "${db.blogPosts[index].title}".`);

  res.json({ success: true, post: db.blogPosts[index] });
});

app.delete('/api/admin/blogs/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const postId = req.params.id;
  const db = readDatabase();
  const post = db.blogPosts.find((b) => b.id === postId);

  if (!post) {
    res.status(404).json({ error: 'Blog post not found.' });
    return;
  }

  db.blogPosts = db.blogPosts.filter((b) => b.id !== postId);
  writeDatabase(db);

  logActivity(req.user!.email, req.user!.name, 'DELETE_BLOG_POST', `Deleted blog post "${post.title}".`);

  res.json({ success: true, message: 'Blog post deleted successfully.' });
});

// --- INQUIRY MANAGEMENT ---
app.put('/api/admin/inquiries/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const inqId = req.params.id;
  const { status, notes } = req.body;
  const db = readDatabase();

  const index = db.inquiries.findIndex((i) => i.id === inqId);
  if (index === -1) {
    res.status(404).json({ error: 'Inquiry not found.' });
    return;
  }

  if (status) db.inquiries[index].status = status;
  if (notes !== undefined) db.inquiries[index].notes = notes;

  writeDatabase(db);
  logActivity(req.user!.email, req.user!.name, 'UPDATE_INQUIRY', `Updated inquiry #${inqId} status to "${status}".`);

  res.json({ success: true, inquiry: db.inquiries[index] });
});

app.delete('/api/admin/inquiries/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const inqId = req.params.id;
  const db = readDatabase();
  db.inquiries = db.inquiries.filter((i) => i.id !== inqId);
  writeDatabase(db);

  logActivity(req.user!.email, req.user!.name, 'DELETE_INQUIRY', `Deleted inquiry #${inqId}.`);

  res.json({ success: true, message: 'Inquiry deleted successfully.' });
});

// --- SITE SETTINGS UPDATE ---
app.put('/api/admin/settings', authMiddleware, (req: AuthenticatedRequest, res) => {
  const newSettings = req.body as Partial<SiteSettings>;
  const db = readDatabase();

  db.siteSettings = {
    ...db.siteSettings,
    ...newSettings,
  };

  writeDatabase(db);
  logActivity(req.user!.email, req.user!.name, 'UPDATE_SITE_SETTINGS', 'Updated website business & hero settings.');

  res.json({ success: true, siteSettings: db.siteSettings });
});

// --- TESTIMONIALS & FAQS CRUD ---
app.post('/api/admin/testimonials', authMiddleware, (req: AuthenticatedRequest, res) => {
  const db = readDatabase();
  const newItem: Testimonial = {
    id: 't_' + Date.now(),
    name: req.body.name || 'Anonymous Client',
    role: req.body.role || 'Home Owner',
    comment: req.body.comment || '',
    rating: Number(req.body.rating) || 5,
    active: req.body.active !== false,
  };

  db.testimonials.push(newItem);
  writeDatabase(db);
  logActivity(req.user!.email, req.user!.name, 'CREATE_TESTIMONIAL', `Added testimonial by "${newItem.name}".`);

  res.json({ success: true, testimonial: newItem });
});

app.put('/api/admin/testimonials/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const id = req.params.id;
  const db = readDatabase();
  const idx = db.testimonials.findIndex((t) => t.id === id);
  if (idx === -1) {
    res.status(404).json({ error: 'Testimonial not found.' });
    return;
  }

  db.testimonials[idx] = { ...db.testimonials[idx], ...req.body };
  writeDatabase(db);
  logActivity(req.user!.email, req.user!.name, 'UPDATE_TESTIMONIAL', `Updated testimonial by "${db.testimonials[idx].name}".`);

  res.json({ success: true, testimonial: db.testimonials[idx] });
});

app.delete('/api/admin/testimonials/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const id = req.params.id;
  const db = readDatabase();
  db.testimonials = db.testimonials.filter((t) => t.id !== id);
  writeDatabase(db);
  logActivity(req.user!.email, req.user!.name, 'DELETE_TESTIMONIAL', `Deleted testimonial ${id}.`);

  res.json({ success: true, message: 'Testimonial deleted.' });
});

app.post('/api/admin/faqs', authMiddleware, (req: AuthenticatedRequest, res) => {
  const db = readDatabase();
  const newItem: FAQ = {
    id: 'faq_' + Date.now(),
    question: req.body.question || '',
    answer: req.body.answer || '',
    category: req.body.category || 'General',
    active: req.body.active !== false,
  };

  db.faqs.push(newItem);
  writeDatabase(db);
  logActivity(req.user!.email, req.user!.name, 'CREATE_FAQ', `Added FAQ "${newItem.question}".`);

  res.json({ success: true, faq: newItem });
});

app.put('/api/admin/faqs/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const id = req.params.id;
  const db = readDatabase();
  const idx = db.faqs.findIndex((f) => f.id === id);
  if (idx === -1) {
    res.status(404).json({ error: 'FAQ not found.' });
    return;
  }

  db.faqs[idx] = { ...db.faqs[idx], ...req.body };
  writeDatabase(db);
  logActivity(req.user!.email, req.user!.name, 'UPDATE_FAQ', `Updated FAQ "${db.faqs[idx].question}".`);

  res.json({ success: true, faq: db.faqs[idx] });
});

app.delete('/api/admin/faqs/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const id = req.params.id;
  const db = readDatabase();
  db.faqs = db.faqs.filter((f) => f.id !== id);
  writeDatabase(db);
  logActivity(req.user!.email, req.user!.name, 'DELETE_FAQ', `Deleted FAQ ${id}.`);

  res.json({ success: true, message: 'FAQ deleted.' });
});

// --- MEDIA LIBRARY UPLOAD & MANAGE ---
app.post('/api/admin/media/upload', authMiddleware, upload.single('file'), (req: AuthenticatedRequest, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No image file uploaded.' });
    return;
  }

  const mediaUrl = `/uploads/${req.file.filename}`;
  const newItem: MediaItem = {
    id: 'med_' + Date.now(),
    filename: req.file.filename,
    originalName: req.file.originalname,
    url: mediaUrl,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedAt: new Date().toISOString(),
  };

  const db = readDatabase();
  db.media.unshift(newItem);
  writeDatabase(db);

  logActivity(req.user!.email, req.user!.name, 'UPLOAD_MEDIA', `Uploaded image "${req.file.originalname}".`);

  res.json({ success: true, media: newItem });
});

app.delete('/api/admin/media/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const id = req.params.id;
  const db = readDatabase();
  const item = db.media.find((m) => m.id === id);

  if (item && item.url.startsWith('/uploads/')) {
    const filename = path.basename(item.url);
    const filepath = path.join(uploadsDir, filename);
    if (fs.existsSync(filepath)) {
      try {
        fs.unlinkSync(filepath);
      } catch (e) {
        console.error('Failed deleting image file:', e);
      }
    }
  }

  db.media = db.media.filter((m) => m.id !== id);
  writeDatabase(db);

  logActivity(req.user!.email, req.user!.name, 'DELETE_MEDIA', `Deleted media item "${item?.originalName || id}".`);

  res.json({ success: true, message: 'Media item deleted.' });
});

// --- ADMIN USERS MANAGEMENT ---
app.post('/api/admin/users', authMiddleware, (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== 'super_admin') {
    res.status(403).json({ error: 'Only Super Administrators can manage admin accounts.' });
    return;
  }

  const { email, name, password, role } = req.body;
  if (!email || !password || !name) {
    res.status(400).json({ error: 'Email, Name, and Password are required.' });
    return;
  }

  const db = readDatabase();
  if (db.users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
    res.status(400).json({ error: 'An admin user with this email already exists.' });
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const newUser: AdminUser = {
    id: 'usr_' + Date.now(),
    email: String(email).toLowerCase().trim(),
    name: String(name).trim(),
    passwordHash,
    role: role === 'super_admin' ? 'super_admin' : 'editor',
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  writeDatabase(db);

  logActivity(req.user!.email, req.user!.name, 'CREATE_ADMIN_USER', `Created admin account for "${newUser.email}" (${newUser.role}).`);

  const { passwordHash: _, ...safeUser } = newUser;
  res.json({ success: true, user: safeUser });
});

app.put('/api/admin/users/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const userId = req.params.id;
  const { name, password, role } = req.body;
  const db = readDatabase();

  const idx = db.users.findIndex((u) => u.id === userId);
  if (idx === -1) {
    res.status(404).json({ error: 'Admin user not found.' });
    return;
  }

  // Only super admin or self can update
  if (req.user?.role !== 'super_admin' && req.user?.id !== userId) {
    res.status(403).json({ error: 'Permission denied.' });
    return;
  }

  if (name) db.users[idx].name = String(name).trim();
  if (role && req.user?.role === 'super_admin') db.users[idx].role = role;
  if (password && password.trim().length >= 6) {
    const salt = bcrypt.genSaltSync(10);
    db.users[idx].passwordHash = bcrypt.hashSync(password.trim(), salt);
  }

  writeDatabase(db);
  logActivity(req.user!.email, req.user!.name, 'UPDATE_ADMIN_USER', `Updated user account for "${db.users[idx].email}".`);

  const { passwordHash: _, ...safeUser } = db.users[idx];
  res.json({ success: true, user: safeUser });
});

app.delete('/api/admin/users/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== 'super_admin') {
    res.status(403).json({ error: 'Only Super Administrators can delete admin accounts.' });
    return;
  }

  const userId = req.params.id;
  const db = readDatabase();

  if (userId === req.user.id) {
    res.status(400).json({ error: 'You cannot delete your own account while logged in.' });
    return;
  }

  const superAdminCount = db.users.filter((u) => u.role === 'super_admin').length;
  const targetUser = db.users.find((u) => u.id === userId);

  if (targetUser?.role === 'super_admin' && superAdminCount <= 1) {
    res.status(400).json({ error: 'Cannot delete the final Super Administrator account.' });
    return;
  }

  db.users = db.users.filter((u) => u.id !== userId);
  writeDatabase(db);

  logActivity(req.user!.email, req.user!.name, 'DELETE_ADMIN_USER', `Deleted admin account "${targetUser?.email}".`);

  res.json({ success: true, message: 'Admin user deleted.' });
});

// ==========================================
// VITE MIDDLEWARE / PRODUCTION STATIC SERVER
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('/admin*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mahadev Ply Center CMS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

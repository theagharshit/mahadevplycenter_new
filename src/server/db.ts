import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { PRODUCTS } from '../data/products.js';
import { BLOG_POSTS } from '../data/blogs.js';

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'super_admin' | 'editor';
  createdAt: string;
  lastLogin?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  category: string;
  quantity: string;
  projectType: string;
  message: string;
  city: string;
  status: 'New' | 'In Progress' | 'Resolved';
  notes?: string;
  createdAt: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  taglineNe: string;
  phone: string;
  altPhone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  storeLocation: string;
  openingHours: string;
  mapsEmbedUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  heroHeadline: string;
  heroHeadlineNe: string;
  heroSubtitle: string;
  heroBadgeText: string;
  bannerImage: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
  avatar?: string;
  active: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  active: boolean;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

export interface ActivityLog {
  id: string;
  adminEmail: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface CategoryCatalogue {
  category: string;
  pdfUrl?: string;
  title?: string;
  brandName?: string;
  description?: string;
  updatedAt?: string;
}

export interface LaminateBrandDesign {
  id: string;
  name: string;
  finish: string;
  image: string;
}

export interface LaminateBrand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  coverImage: string;
  bannerImage?: string;
  shortDescription: string;
  description: string;
  pdfUrl?: string;
  pdfCoverImage?: string;
  availableFinishes: string[];
  availableCollections?: string[];
  applications?: string[];
  benefits?: string[];
  thickness?: string;
  warranty?: string;
  availableColors?: string[];
  featuredDesigns?: LaminateBrandDesign[];
  displayOrder: number;
  active: boolean;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CMSData {
  users: AdminUser[];
  categories: string[];
  categoryCatalogues?: CategoryCatalogue[];
  products: any[];
  laminateBrands: LaminateBrand[];
  blogPosts: any[];
  inquiries: Inquiry[];
  siteSettings: SiteSettings;
  testimonials: Testimonial[];
  faqs: FAQ[];
  media: MediaItem[];
  activityLogs: ActivityLog[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'cms_database.json');

// Ensure data directory exists
function ensureDataDirectory() {
  const dir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Initial Seed Generation
function generateInitialData(): CMSData {
  const defaultSalt = bcrypt.genSaltSync(10);
  const initialPasswordHash = bcrypt.hashSync('AdminPassword123!', defaultSalt);

  const initialUser: AdminUser = {
    id: 'usr_super_01',
    email: 'admin@mahadevply.com',
    passwordHash: initialPasswordHash,
    name: 'Mahadev Store Owner',
    role: 'super_admin',
    createdAt: new Date().toISOString(),
  };

  const initialSettings: SiteSettings = {
    brandName: 'Mahadev Ply Center',
    tagline: "YOUR INTERIOR'S CHOICE",
    taglineNe: 'तपाईंको इन्टेरियरको उत्कृष्ट रोजाइ',
    phone: '01-5400921 / 9766383188',
    altPhone: '01-5400921',
    whatsappNumber: '9779766383188',
    email: 'info@mahadevply.com',
    address: 'Ring Road, Satdobato, Lalitpur, Nepal',
    storeLocation: 'Satdobato Chowk, Lalitpur & Chabahil, Kathmandu',
    openingHours: 'Sun - Fri: 10:00 AM - 7:00 PM | Sat: 10:00 AM - 12:00 PM',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=Mahadev%20Ply%20Center%20Satdobato%20Lalitpur%20Nepal&t=&z=16&ie=UTF8&iwloc=&output=embed',
    facebookUrl: 'https://www.facebook.com/p/Mahadev-Ply-Center-61565692444993/',
    instagramUrl: 'https://www.instagram.com/mahadevplycenter/',
    heroHeadline: "Nepal's Trusted Destination for Quality Plywood & Hardware",
    heroHeadlineNe: 'गुणस्तरीय प्लाईवूड र हार्डवेयरको भरपर्दो केन्द्र',
    heroSubtitle: 'Direct authorized distributor of CenturyPly, Greenply, Hafele & premium interior hardware. Serving Lalitpur & Kathmandu with guaranteed durability.',
    heroBadgeText: 'Official Authorized Distributor',
    bannerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbK720HycchuXAS6hlJxEQF2kaDEw-5jcEeT7UUkduF4o-femVDnW9Xz05ASwrqJ3O-0Sebzh5KmDWsb-XBZoBzU0P3m5MWXjAkgLiZUVtL1qXWqQWY5awQv6NJ2mg51M_SvOYe2TpWTXCI24e255ib58q90iqUJVntIhu3UGSOXSCdKtRF7_RFAYTGlhWO2CU4DypH9QqbkIim9xXMZIOHkEvPI_h-ewy6TOoqcDeNB2wryAzmk0UMUW5SgSXBg7OQg5qnFQr8rh-',
    metaTitle: 'Mahadev Ply Center | Quality Plywood, Veneers & Hardware Lalitpur Nepal',
    metaDescription: 'Leading supplier of CenturyPly, Greenply, Veneers, Laminates, Door Locks & Kitchen Hardware in Satdobato Lalitpur & Kathmandu.',
    keywords: 'Plywood Lalitpur, CenturyPly Nepal, Greenply Kathmandu, Hardware Store Nepal, Marine Plywood price',
  };

  const initialInquiries: Inquiry[] = [
    {
      id: 'inq_1001',
      name: 'Subash Shrestha',
      phone: '9841234567',
      category: 'Plywood',
      quantity: '45 Sheets (18mm BWP)',
      projectType: 'Residential Villa Kitchen & Wardrobes',
      message: 'Need price quote and delivery timeline for 18mm Marine BWP plywood for kitchen cabinets near Kupondole, Lalitpur.',
      city: 'Lalitpur',
      status: 'New',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'inq_1002',
      name: 'Rohan Interior Decorators',
      phone: '9801987654',
      category: 'Hardware & Locks',
      quantity: '12 Sets Mortise Handles + Soft Close Hinges',
      projectType: 'Commercial Office Renovation',
      message: 'Looking for wholesale rate on Hafele soft close drawer channels and matte black door handles for an office project in Naxal.',
      city: 'Kathmandu',
      status: 'In Progress',
      notes: 'Sent catalog on WhatsApp on July 27.',
      createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    },
  ];

  const initialTestimonials: Testimonial[] = [
    {
      id: 't-1',
      name: 'Er. Rajesh Maharjan',
      role: 'Principal Architect, Skyline Designs',
      comment: 'Mahadev Ply Center has been our go-to material supplier for over 8 years in Lalitpur. Their 100% genuine CenturyPly BWP sheets and consistent veneer quality make every project seamless.',
      rating: 5,
      active: true,
    },
    {
      id: 't-2',
      name: 'Pooja Sharma',
      role: 'Home Owner, Jhamsikhel',
      comment: 'The team guided us perfectly on choosing moisture-resistant plywood for our modular kitchen. Transparent pricing, authentic guarantee cards, and prompt delivery!',
      rating: 5,
      active: true,
    },
    {
      id: 't-3',
      name: 'Binod Karki',
      role: 'Interior Contractor',
      comment: 'Best range of architectural door locks, soft-close hinges, and natural wood veneers under one roof. Unbeatable wholesale rates for bulk orders.',
      rating: 5,
      active: true,
    },
  ];

  const initialFaqs: FAQ[] = [
    {
      id: 'faq-1',
      question: 'Do you deliver plywood and hardware across Kathmandu Valley?',
      answer: 'Yes! We provide direct door-step delivery across Lalitpur, Kathmandu, and Bhaktapur. Free delivery is available for eligible project-scale orders.',
      category: 'Delivery & Shipping',
      active: true,
    },
    {
      id: 'faq-2',
      question: 'How do I know if I need BWR or BWP Marine Grade Plywood?',
      answer: 'BWR (Boiling Water Resistant) is ideal for living room furniture, wardrobes, and general kitchen shutters. BWP (Boiling Water Proof IS 710) Marine grade is essential for under-sink cabinets, bathroom vanities, and areas exposed to severe water moisture.',
      category: 'Product Advice',
      active: true,
    },
    {
      id: 'faq-3',
      question: 'Are your products backed by manufacturer warranty?',
      answer: 'Absolutely. We are direct authorized dealers for CenturyPly, Greenply, and Hafele. Every purchase comes with official manufacturer authenticity guarantees.',
      category: 'Warranty & Quality',
      active: true,
    },
  ];

  // Extract initial media items from seed products/blogs
  const initialMedia: MediaItem[] = [
    {
      id: 'med-01',
      filename: 'hero-banner.jpg',
      originalName: 'Mahadev Ply Storefront Banner',
      url: initialSettings.bannerImage,
      mimeType: 'image/jpeg',
      size: 420000,
      uploadedAt: new Date().toISOString(),
    },
  ];

  const initialLogs: ActivityLog[] = [
    {
      id: 'log-01',
      adminEmail: 'admin@mahadevply.com',
      adminName: 'System Engine',
      action: 'INITIALIZE_CMS_DATABASE',
      details: 'CMS database successfully provisioned with default products, blogs, and settings.',
      timestamp: new Date().toISOString(),
    },
  ];

  const defaultCategories = [
    'Plywood',
    'Hardware',
    'Veneers',
    'Laminates',
    'Locks & Security',
    'MDF & Particle Board',
  ];

  const initialLaminateBrands: LaminateBrand[] = [
    {
      id: 'lam_futurelam',
      name: 'FutureLam',
      slug: 'futurelam',
      logo: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
      bannerImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600',
      shortDescription: '100% Pure Phenolic Bespoke Decor Surfaces & Next Generation Collection.',
      description: 'FutureLam delivers 100% pure phenolic high-pressure laminates crafted for luxury interior spaces. Featuring scratch-resistant finishes, waterproof properties, and artistic abstract decor surfaces for kitchens, wardrobes, and high-end commercial interiors.',
      pdfUrl: '/catalogues/futurelam.pdf',
      availableFinishes: ['High Gloss', 'Mustang Stone', 'Silky Matt', 'Classic Ash', 'Leather', 'Write On', 'Scratch Tough', 'SF Solids'],
      availableCollections: ['Abstract Art', 'Natural Oak', 'Mustang Stone', 'Metallic Gloss', 'Silky Matt Woods', 'Glitter Collection'],
      applications: ['Modular Kitchen Shutters', 'Wardrobe Doors', 'Wall Paneling', 'Office Desks & Partition Work'],
      benefits: ['100% Phenolic Core', 'Waterproof & Moisture Proof', 'Termite & Borer Proof', 'Scratch & Wear Resistant', 'Anti-Fingerprint Coating'],
      thickness: '0.8mm - 1.0mm',
      warranty: '10 Years Manufacturer Warranty',
      availableColors: ['Warm Teak', 'Dark Oak', 'Imperial Marble', 'Gold Rust', 'Volcanic Stone', 'Classic Ivory'],
      featuredDesigns: [
        { id: 'fd-1', name: 'Spectra Wood 4148-02', finish: 'High Gloss', image: 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&q=80&w=600' },
        { id: 'fd-2', name: 'Fluted Marble 4146-01', finish: 'High Gloss', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600' },
        { id: 'fd-3', name: 'Crara Marble 1096-02', finish: 'Mustang Stone', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600' },
      ],
      displayOrder: 1,
      active: true,
      isFeatured: true,
    },
    {
      id: 'lam_greenlam',
      name: 'Greenlam Laminates',
      slug: 'greenlam',
      logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1200',
      shortDescription: "Asia's leading decorative laminate brand engineered with SAFEGUARD anti-bacterial technology.",
      description: 'Greenlam Laminates offer exquisite woodgrains, solid textures, and digital print surface solutions engineered with SAFEGUARD anti-bacterial protection. Perfect for modern kitchens, commercial wardrobes, and architectural paneling.',
      pdfUrl: '/catalogues/greenlam.pdf',
      availableFinishes: ['Anti-Bacterial Matte', 'High Gloss Unicore', 'Suede Finish', 'Textured Woodgrain'],
      availableCollections: ['Woodgrain Excellence', 'Solid Pastels', 'Metallic Elegance', 'Anti-Fingerprint Silk'],
      applications: ['Modular Kitchens', 'Bedroom Wardrobes', 'Office Tables', 'Wall Liners'],
      benefits: ['SAFEGUARD Anti-Bacterial', 'Heat Resistant', 'Stain Proof', 'Borer & Termite Guarantee'],
      thickness: '1.0mm',
      warranty: '10 Years Warranty',
      displayOrder: 2,
      active: true,
      isFeatured: true,
    },
    {
      id: 'lam_centurylaminates',
      name: 'CenturyLaminates',
      slug: 'centurylaminates',
      logo: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200',
      shortDescription: 'Premium high-pressure decorative laminates with ViroKill virus protection technology.',
      description: 'CenturyLaminates offer superior scuff resistance, color fastness, and 99.99% ViroKill protection. Ideal for demanding residential interiors and hygienic commercial environments.',
      pdfUrl: '/catalogues/centurylaminates.pdf',
      availableFinishes: ['ViroKill Silk Matte', 'High Gloss Look', 'Textured Veneer Grain', 'Solid Pastels'],
      availableCollections: ['LookBook 1mm Collection', 'Monochrome Solids', 'Exotic Veneer Textures'],
      applications: ['Kitchen Cabinets', 'Living Room Partition Walls', 'Door Skins', 'Study Desks'],
      benefits: ['ViroKill Technology', '90 Degree Bendable', 'High Scuff Resistance'],
      thickness: '1.0mm',
      warranty: '7 Years Warranty',
      displayOrder: 3,
      active: true,
      isFeatured: true,
    },
    {
      id: 'lam_merino',
      name: 'Merino Laminates',
      slug: 'merino',
      logo: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=1200',
      shortDescription: 'Ultra-modern surfaces including anti-fingerprint, high gloss and metallic laminates.',
      description: 'Merino is a world leader in surface decor, offering super-matte Luvih anti-fingerprint laminates, high gloss Gloss Meister panels, and Metalam metallic finishes.',
      pdfUrl: '/catalogues/merino.pdf',
      availableFinishes: ['Super Matt (Luvih)', 'High Gloss (Gloss Meister)', 'Metalam', 'Digital Art'],
      availableCollections: ['Luvih Anti-Fingerprint', 'Gloss Meister', 'Impresza Digital', 'Tuff Gloss'],
      applications: ['Luxury Kitchen Shutters', 'Executive Office Furniture', 'Display Cabinets'],
      benefits: ['Anti-Fingerprint Touch', 'Thermal Healing', 'Scratch Resistant', 'UV Resistant'],
      thickness: '1.0mm',
      warranty: '10 Years Warranty',
      displayOrder: 4,
      active: true,
      isFeatured: true,
    },
    {
      id: 'lam_formica',
      name: 'Formica',
      slug: 'formica',
      logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1200',
      shortDescription: 'The original surface pioneer with timeless woodgrains and solid decor colors.',
      description: 'Formica brand laminates represent the global benchmark in surface design. Durable, easy to clean, and available in hundreds of architectural patterns and solid hues.',
      pdfUrl: '',
      availableFinishes: ['Formica Solid Core', 'Natural Woodgrain', 'Micro-Dot Texture', 'Matte Finish'],
      availableCollections: ['Global Woodgrains', 'Architectural Hues', 'Formica Compact'],
      applications: ['Countertops', 'Kitchen Cabinets', 'Restroom Cubicles', 'Retail Displays'],
      benefits: ['Global Design Heritage', 'Impact Resistant', 'Easy Maintenance'],
      thickness: '0.8mm - 1.0mm',
      warranty: '10 Years Warranty',
      displayOrder: 5,
      active: true,
      isFeatured: false,
    },
    {
      id: 'lam_stylam',
      name: 'Stylam Laminates',
      slug: 'stylam',
      logo: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
      shortDescription: 'Tough, impact-resistant phenolic laminates designed for heavy-duty usage.',
      description: 'Stylam produces advanced high-pressure decorative laminates with anti-fingerprint TouchMe technology, acrylic gloss, and fire-retardant phenolic properties.',
      pdfUrl: '',
      availableFinishes: ['Fascia Metallic', 'TouchMe Anti-Fingerprint', 'Chalk Board', 'High Gloss'],
      availableCollections: ['TouchMe Velvet', 'Metallica', 'Chalk & Marker Board'],
      applications: ['Hospital Interior Walls', 'Schools & Offices', 'Kitchen Worktops'],
      benefits: ['Fire Retardant', 'Moisture Resistant', 'Chemical Resistant'],
      thickness: '0.8mm - 1.5mm',
      warranty: '10 Years Warranty',
      displayOrder: 6,
      active: true,
      isFeatured: false,
    },
    {
      id: 'lam_royale_touche',
      name: 'Royale Touche',
      slug: 'royale-touche',
      logo: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      shortDescription: 'Luxury 1mm laminates featuring handcrafted exclusive surface textures.',
      description: 'Royale Touche introduces a new design every 4 days. Featuring 1mm luxury decorative laminates with deep 3D surface textures, stone finishes, and handcrafted wood tactile feel.',
      pdfUrl: '',
      availableFinishes: ['1mm Luxury Texture', 'High Gloss Crystal', 'Feather Matt', 'Stone & Cement'],
      availableCollections: ['3D Texture Series', 'Luxury Marble', 'Handcrafted Wood'],
      applications: ['Feature Accent Walls', 'Master Bedroom Wardrobes', 'Reception Counters'],
      benefits: ['Deep 3D Tactile Texture', 'Handcrafted Designs', 'Scratch Resistant'],
      thickness: '1.0mm',
      warranty: '10 Years Warranty',
      displayOrder: 7,
      active: true,
      isFeatured: true,
    },
  ];

  return {
    users: [initialUser],
    categories: defaultCategories,
    products: PRODUCTS,
    laminateBrands: initialLaminateBrands,
    blogPosts: BLOG_POSTS,
    inquiries: initialInquiries,
    siteSettings: initialSettings,
    testimonials: initialTestimonials,
    faqs: initialFaqs,
    media: initialMedia,
    activityLogs: initialLogs,
    categoryCatalogues: [
      {
        category: 'Laminates (Formica)',
        pdfUrl: '/catalogues/centurylaminates.pdf',
        title: 'CenturyLaminates & Greenlam 3D Swatch Catalogue',
        brandName: 'CenturyLaminates & Greenlam',
        description: 'Browse 500+ decorative high-pressure laminates, suede finishes, and gloss swatches.',
        updatedAt: new Date().toISOString(),
      },
      {
        category: 'Plywood',
        pdfUrl: '/catalogues/centurylaminates.pdf',
        title: 'CenturyPly & Greenply Marine Plywood Swatch Book',
        brandName: 'CenturyPly & Greenply',
        description: 'Official BWR/BWP Marine grade 710 and Architect grade plywood specification catalogue.',
        updatedAt: new Date().toISOString(),
      },
    ],
  };
}

export function readDatabase(): CMSData {
  ensureDataDirectory();
  if (!fs.existsSync(DB_FILE_PATH)) {
    const initial = generateInitialData();
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }

  try {
    const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const data = JSON.parse(content);

    // Normalize categories
    if (!data.categories || !Array.isArray(data.categories)) {
      data.categories = [
        'Plywood',
        'Hardware',
        'Veneers',
        'Laminates',
        'Locks & Security',
        'MDF & Particle Board',
      ];
    }

    // Normalize categoryCatalogues
    if (!data.categoryCatalogues || !Array.isArray(data.categoryCatalogues)) {
      data.categoryCatalogues = [
        {
          category: 'Laminates (Formica)',
          pdfUrl: '/catalogues/centurylaminates.pdf',
          title: 'CenturyLaminates & Greenlam 3D Swatch Catalogue',
          brandName: 'CenturyLaminates & Greenlam',
          description: 'Browse 500+ decorative high-pressure laminates, suede finishes, and gloss swatches.',
          updatedAt: new Date().toISOString(),
        },
        {
          category: 'Plywood',
          pdfUrl: '/catalogues/centurylaminates.pdf',
          title: 'CenturyPly & Greenply Marine Plywood Swatch Book',
          brandName: 'CenturyPly & Greenply',
          description: 'Official BWR/BWP Marine grade 710 and Architect grade plywood specification catalogue.',
          updatedAt: new Date().toISOString(),
        },
      ];
    }

    // Ensure Laminate Brands exists
    if (!data.laminateBrands || !Array.isArray(data.laminateBrands) || data.laminateBrands.length === 0) {
      const initial = generateInitialData();
      data.laminateBrands = initial.laminateBrands;
    }
    // Ensure categories has all categories used in products
    if (data.products && Array.isArray(data.products)) {
      data.products.forEach((p: any) => {
        if (p.category && !data.categories.includes(p.category)) {
          data.categories.push(p.category);
        }
        // Normalize stockStatus
        if (!p.stockStatus) {
          p.stockStatus = p.inStock ? 'in_stock' : 'out_of_stock';
        }
      });
    }

    return data;
  } catch (err) {
    console.error('Failed reading CMS database, re-initializing...', err);
    const initial = generateInitialData();
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

export function writeDatabase(data: CMSData): void {
  ensureDataDirectory();
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export function logActivity(adminEmail: string, adminName: string, action: string, details: string): void {
  const db = readDatabase();
  const newLog: ActivityLog = {
    id: 'log_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    adminEmail,
    adminName,
    action,
    details,
    timestamp: new Date().toISOString(),
  };
  db.activityLogs.unshift(newLog);
  // Keep last 200 logs
  if (db.activityLogs.length > 200) {
    db.activityLogs = db.activityLogs.slice(0, 200);
  }
  writeDatabase(db);
}

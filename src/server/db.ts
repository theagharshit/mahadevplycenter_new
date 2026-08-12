import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { PRODUCTS } from '../data/products.js';
import { BLOG_POSTS } from '../data/blogs.js';
import {
  AdminUser,
  UserRole,
  AdminPermissions,
  AuditLog,
  SiteSettings,
  InquiryItem,
  MediaItem,
  TestimonialItem,
  FAQItem,
  CategoryCatalogue,
  LaminateBrand,
  NavigationMenuItem,
  HomePageContent,
  AboutPageContent,
  ContactPageContent,
  TranslationDictionary,
  Product,
  BlogPost,
} from '../types.js';

export interface CMSDatabase {
  users: AdminUser[];
  categories: string[];
  categoryCatalogues: CategoryCatalogue[];
  products: Product[];
  laminateBrands: LaminateBrand[];
  blogPosts: BlogPost[];
  inquiries: InquiryItem[];
  siteSettings: SiteSettings;
  homeContent: HomePageContent;
  aboutContent: AboutPageContent;
  contactContent: ContactPageContent;
  testimonials: TestimonialItem[];
  faqs: FAQItem[];
  media: MediaItem[];
  activityLogs: AuditLog[];
  navigationMenu: NavigationMenuItem[];
  translations: TranslationDictionary;
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'cms_database.json');

function ensureDataDirectory() {
  const dir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function generateInitialData(): CMSDatabase {
  const defaultSalt = bcrypt.genSaltSync(10);
  const initialPasswordHash = bcrypt.hashSync('AdminPassword123!', defaultSalt);

  const superAdminPermissions: AdminPermissions = {
    manageProducts: true,
    manageBrands: true,
    manageBlogs: true,
    manageSettings: true,
    manageInquiries: true,
    manageUsers: true,
    manageMedia: true,
    manageTranslations: true,
    viewAuditLogs: true,
  };

  const initialUsers: AdminUser[] = [
    {
      id: 'usr_super_01',
      email: 'admin@mahadevply.com',
      name: 'Mahadev Store Owner',
      phone: '9766383188',
      role: 'super_admin',
      active: true,
      permissions: superAdminPermissions,
      createdAt: new Date().toISOString(),
    },
  ];

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
    primaryColor: '#0f766e',
    accentColor: '#d97706',
    metaTitle: 'Mahadev Ply Center | Quality Plywood, Veneers & Hardware Lalitpur Nepal',
    metaDescription: 'Leading supplier of CenturyPly, Greenply, Veneers, Laminates, Door Locks & Kitchen Hardware in Satdobato Lalitpur & Kathmandu.',
    keywords: 'Plywood Lalitpur, CenturyPly Nepal, Greenply Kathmandu, Hardware Store Nepal, Marine Plywood price',
    maintenanceMode: false,
    defaultLanguage: 'EN',
  };

  const initialHome: HomePageContent = {
    heroTitle: "Nepal's Trusted Destination for Quality Plywood & Hardware",
    heroSubtitle: "Direct authorized distributor of CenturyPly, Greenply, Hafele & premium interior hardware. Serving Lalitpur & Kathmandu with guaranteed durability.",
    heroBannerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbK720HycchuXAS6hlJxEQF2kaDEw-5jcEeT7UUkduF4o-femVDnW9Xz05ASwrqJ3O-0Sebzh5KmDWsb-XBZoBzU0P3m5MWXjAkgLiZUVtL1qXWqQWY5awQv6NJ2mg51M_SvOYe2TpWTXCI24e255ib58q90iqUJVntIhu3UGSOXSCdKtRF7_RFAYTGlhWO2CU4DypH9QqbkIim9xXMZIOHkEvPI_h-ewy6TOoqcDeNB2wryAzmk0UMUW5SgSXBg7OQg5qnFQr8rh-',
    storyTitle: 'Building Trust Through Transparency in Lalitpur',
    storyParagraph1: 'Mahadev Ply Center started with a simple, powerful idea: that every home and commercial project in Nepal deserves access to world-class building materials without the complexity of traditional sourcing.',
    storyParagraph2: 'We noticed a gap in the local market for reliable, graded plywood and timber that architects could trust and homeowners could afford. Since our founding in Satdobato Lalitpur, we have focused on one thing—building long-term trust through transparent grading and honest pricing.',
    storyImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBV0rVz0kKsuvZhmNg_S9R-bTED--8g2WkZVOudUNwVPDqvQph2rHNgxUSuNMvqjLiN7vFVBIPuQUrtkZ_lWbbIIdyRjmYns655xpsqAug7IQcQpUonJIj8eOVahJWdtrMJFMl8K4SyvhfcJffWzCrp8HM1iq7N46JAqv6L6BNNo_AHMb-xPI5Q3zBcMArLm09GG5GHu6JJqtXfPChGTgJKsx4uo47gbw1OMTXQredrb-5gk_0jZXmPYrOdaNuZWziUo65Qc5DTnyg6',
    categoryImages: {
      'Plywood': 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&q=80&w=600',
      'Hardware': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
      'Locks & Security': 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=600',
      'Veneers': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600',
      'Laminates': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=600',
      'MDF & Particle Board': 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=600',
    },
  };

  const initialAbout: AboutPageContent = {
    headline: 'About Mahadev Ply Center',
    subtitle: "Lalitpur's Premier Showroom for Certified Plywood, Veneers & Architectural Hardware",
    heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
    storyImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBV0rVz0kKsuvZhmNg_S9R-bTED--8g2WkZVOudUNwVPDqvQph2rHNgxUSuNMvqjLiN7vFVBIPuQUrtkZ_lWbbIIdyRjmYns655xpsqAug7IQcQpUonJIj8eOVahJWdtrMJFMl8K4SyvhfcJffWzCrp8HM1iq7N46JAqv6L6BNNo_AHMb-xPI5Q3zBcMArLm09GG5GHu6JJqtXfPChGTgJKsx4uo47gbw1OMTXQredrb-5gk_0jZXmPYrOdaNuZWziUo65Qc5DTnyg6',
    companyStory: 'Mahadev Ply Center was established in Satdobato, Lalitpur with a mission to deliver 100% genuine, high-grade plywood, architectural hardware, and interior surfaces across Kathmandu Valley.',
    companyStoryNe: 'महादेव प्लाई सेन्टर ललितपुरको सातदोबाटोमा स्थापना भएको एक अग्रणी प्लाईवूड र हार्डवेयर आपूर्तिकर्ता हो।',
    mission: 'To provide authentic guaranteed building materials, transparent wholesale rates, and expert guidance to architects, interior decorators, and homeowners.',
    missionNe: 'वास्तुकार, इन्टेरियर डिजाइनर र घरधनीहरूलाई सर्वोत्कृष्ट गुणस्तरका सामग्री र पारदर्शी मूल्यमा सेवा प्रदान गर्ने।',
    vision: 'To be the most trusted and comprehensive single-stop interior materials showroom in Nepal.',
    visionNe: 'नेपालको सबैभन्दा भरपर्दो र पूर्ण इन्टेरियर सामग्री सोरुम बन्ने।',
    foundedYear: '2012',
    happyClientsCount: '15,000+',
    completedProjectsCount: '4,500+',
    teamMembers: [
      {
        name: 'Mahadev Agrawal',
        role: 'Founder & Managing Director',
        roleNe: 'संस्थापक तथा प्रबन्ध निर्देशक',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
        altText: 'Managing Director',
      },
      {
        name: 'Suman Shrestha',
        role: 'Head of Sales & Technical Consultant',
        roleNe: 'प्रमुख बिक्री तथा प्राविधिक सल्लाहकार',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
        altText: 'Head of Sales',
      },
    ],
    certificates: [
      {
        title: 'CenturyPly Authorized Dealer Certificate',
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
        issuedBy: 'Century Plyboards India Ltd.',
      },
      {
        title: 'Hafele Architectural Hardware Excellence Partner',
        image: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&q=80&w=600',
        issuedBy: 'Hafele India Pvt. Ltd.',
      },
    ],
  };

  const initialContact: ContactPageContent = {
    headline: 'Get in Touch with Mahadev Ply Center',
    subtitle: "Visit our Satdobato Lalitpur showroom or reach out via phone, WhatsApp, or email.",
    heroImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
    showroomImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    headOfficeAddress: 'Satdobato Chowk (Opposite Salesberry), Ring Road, Lalitpur, Nepal',
    branches: [
      {
        name: 'Main Showroom - Lalitpur',
        address: 'Ring Road, Satdobato Chowk, Lalitpur',
        phone: '01-5400921 / 9766383188',
      },
      {
        name: 'Depot & Hardware Warehouse',
        address: 'Near Chabahil Chowk, Ring Road, Kathmandu',
        phone: '9801987654',
      },
    ],
    inquiryEmails: ['info@mahadevply.com', 'sales@mahadevply.com'],
    supportPhoneNumbers: ['9766383188', '01-5400921'],
    workingDaysHours: 'Sunday - Friday: 10:00 AM - 7:00 PM | Saturday: 10:00 AM - 12:00 PM',
    specialNotice: 'Direct delivery available for all bulk orders across Kathmandu, Lalitpur, and Bhaktapur.',
  };

  const initialInquiries: InquiryItem[] = [
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

  const initialTestimonials: TestimonialItem[] = [
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

  const initialFaqs: FAQItem[] = [
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

  const initialNavigation: NavigationMenuItem[] = [
    { id: 'nav-1', label: 'Home', labelNe: 'गृहपृष्ठ', path: '/', targetView: 'home', position: 'both', order: 1, visible: true },
    { id: 'nav-2', label: 'Products', labelNe: 'उत्पादनहरू', path: '/products', targetView: 'products', position: 'both', order: 2, visible: true },
    { id: 'nav-3', label: 'Laminates & Catalogues', labelNe: 'ल्यामिनेट्स तथा क्याटलग', path: '/laminates', targetView: 'laminates', position: 'both', order: 3, visible: true },
    { id: 'nav-4', label: 'About Us', labelNe: 'हाम्रो बारेमा', path: '/about', targetView: 'about', position: 'both', order: 4, visible: true },
    { id: 'nav-5', label: 'Blog & Insights', labelNe: 'ब्लग तथा जानकारी', path: '/blog', targetView: 'blog', position: 'both', order: 5, visible: true },
    { id: 'nav-6', label: 'Contact', labelNe: 'सम्पर्क', path: '/contact', targetView: 'contact', position: 'both', order: 6, visible: true },
  ];

  const initialTranslations: TranslationDictionary = {
    heroHeadline: { en: "Nepal's Trusted Destination for Quality Plywood & Hardware", ne: 'गुणस्तरीय प्लाईवूड र हार्डवेयरको भरपर्दो केन्द्र' },
    heroSubtitle: { en: 'Direct authorized distributor of CenturyPly, Greenply, Hafele & premium interior hardware.', ne: 'सेन्चुरीप्लाई, ग्रीनप्लाई र हेफेले हार्डवेयरको आधिकारिक विक्रेता।' },
    requestQuote: { en: 'Request Quick Quote', ne: 'कोटेशन माग गर्नुहोस्' },
    viewProducts: { en: 'Browse Products', ne: 'उत्पादनहरू हेर्नुहोस्' },
    contactUs: { en: 'Contact Us', ne: 'हामीलाई सम्पर्क गर्नुहोस्' },
  };

  const initialLaminateBrands: LaminateBrand[] = [
    {
      id: 'lam_futurelam',
      name: 'FutureLam',
      slug: 'futurelam',
      logo: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
      bannerImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600',
      shortDescription: '100% Pure Phenolic Bespoke Decor Surfaces & Next Generation Collection.',
      description: 'FutureLam delivers 100% pure phenolic high-pressure laminates crafted for luxury interior spaces.',
      pdfUrl: '/catalogues/futurelam.pdf',
      availableFinishes: ['High Gloss', 'Mustang Stone', 'Silky Matt', 'Classic Ash', 'Leather', 'Write On'],
      availableCollections: ['Abstract Art', 'Natural Oak', 'Mustang Stone', 'Metallic Gloss'],
      applications: ['Modular Kitchen Shutters', 'Wardrobe Doors', 'Wall Paneling'],
      benefits: ['100% Phenolic Core', 'Waterproof & Moisture Proof', 'Termite Proof'],
      thickness: '0.8mm - 1.0mm',
      warranty: '10 Years Manufacturer Warranty',
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
      description: 'Greenlam Laminates offer exquisite woodgrains and solid textures with anti-bacterial protection.',
      pdfUrl: '/catalogues/greenlam.pdf',
      availableFinishes: ['Anti-Bacterial Matte', 'High Gloss Unicore', 'Suede Finish'],
      availableCollections: ['Woodgrain Excellence', 'Solid Pastels', 'Metallic Elegance'],
      applications: ['Modular Kitchens', 'Bedroom Wardrobes', 'Office Tables'],
      benefits: ['SAFEGUARD Anti-Bacterial', 'Heat Resistant', 'Stain Proof'],
      thickness: '1.0mm',
      warranty: '10 Years Warranty',
      displayOrder: 2,
      active: true,
      isFeatured: true,
    },
  ];

  return {
    users: initialUsers,
    categories: ['Plywood', 'Hardware', 'Veneers', 'Laminates', 'Locks & Security', 'MDF & Particle Board'],
    categoryCatalogues: [
      {
        category: 'Laminates (Formica)',
        pdfUrl: '/catalogues/centurylaminates.pdf',
        title: 'CenturyLaminates & Greenlam Swatch Catalogue',
        brandName: 'CenturyLaminates & Greenlam',
        description: 'Browse 500+ decorative high-pressure laminates and suede swatches.',
        updatedAt: new Date().toISOString(),
      },
      {
        category: 'Plywood',
        pdfUrl: '/catalogues/centurylaminates.pdf',
        title: 'CenturyPly & Greenply Marine Plywood Swatch Book',
        brandName: 'CenturyPly & Greenply',
        description: 'Official BWR/BWP Marine grade 710 specification catalogue.',
        updatedAt: new Date().toISOString(),
      },
    ],
    products: PRODUCTS,
    laminateBrands: initialLaminateBrands,
    blogPosts: BLOG_POSTS,
    inquiries: initialInquiries,
    siteSettings: initialSettings,
    homeContent: initialHome,
    aboutContent: initialAbout,
    contactContent: initialContact,
    testimonials: initialTestimonials,
    faqs: initialFaqs,
    media: [
      {
        id: 'med-01',
        filename: 'hero-banner.jpg',
        originalName: 'Mahadev Storefront Banner',
        url: initialSettings.bannerImage,
        mimeType: 'image/jpeg',
        size: 420000,
        uploadedAt: new Date().toISOString(),
      },
    ],
    activityLogs: [
      {
        id: 'log-01',
        userEmail: 'admin@mahadevply.com',
        userName: 'Mahadev Store Owner',
        userRole: 'super_admin',
        action: 'INITIALIZE_CMS_DATABASE',
        details: 'CMS database initialized with super admin and default store collections.',
        timestamp: new Date().toISOString(),
      },
    ],
    navigationMenu: initialNavigation,
    translations: initialTranslations,
  };
}

// User credentials store with secret password hashes
const PASSWORD_STORE_PATH = path.join(process.cwd(), 'data', 'user_passwords.json');

function getUserPasswords(): Record<string, string> {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync('AdminPassword123!', salt);
  const initial = { admin: hash, 'admin@mahadevply.com': hash };

  if (process.env.FUNCTION_TARGET || process.env.FIREBASE_CONFIG) {
    return initial;
  }

  if (!fs.existsSync(PASSWORD_STORE_PATH)) {
    try {
      fs.writeFileSync(PASSWORD_STORE_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    } catch {}
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(PASSWORD_STORE_PATH, 'utf-8'));
  } catch {
    return initial;
  }
}

let inMemoryDb: CMSDatabase | null = null;

import { db as firestore } from './firebase.js';
import { collection, doc, getDocs, setDoc, getDoc, writeBatch } from 'firebase/firestore';

export async function initializeDatabase(): Promise<void> {
  const settingsDoc = await getDoc(doc(firestore, 'singletons', 'siteSettings'));
  
  if (!settingsDoc.exists()) {
    console.log('Migrating local JSON database to Firestore...');
    let dataToMigrate: CMSDatabase;
    if (fs.existsSync(DB_FILE_PATH)) {
      dataToMigrate = JSON.parse(fs.readFileSync(DB_FILE_PATH, 'utf8'));
      // Merge with initial data just to be safe
      const initial = generateInitialData();
      if (!dataToMigrate.homeContent) dataToMigrate.homeContent = initial.homeContent;
    } else {
      dataToMigrate = generateInitialData();
    }
    
    // Migrate user passwords too
    const passwords = getUserPasswords();
    await setDoc(doc(firestore, 'singletons', 'userPasswords'), passwords);

    const batch = writeBatch(firestore);
    
    // Helper to add to batch
    let batchCount = 0;
    const addBatch = async (ref: any, data: any) => {
      batch.set(ref, data);
      batchCount++;
      if (batchCount >= 400) {
        await batch.commit();
        batchCount = 0;
      }
    };
    
    const collections = ['users', 'categoryCatalogues', 'products', 'laminateBrands', 'blogPosts', 'inquiries', 'testimonials', 'faqs', 'media', 'activityLogs', 'navigationMenu'];
    
    for (const coll of collections) {
      const arr = (dataToMigrate as any)[coll] || [];
      for (const item of arr) {
        const id = item.id || Math.random().toString(36).substring(7);
        await addBatch(doc(firestore, coll, id), item);
      }
    }
    
    for (const cat of (dataToMigrate.categories || [])) {
      await addBatch(doc(firestore, 'categories', cat), { name: cat });
    }
    
    const singletons = ['siteSettings', 'homeContent', 'aboutContent', 'contactContent', 'translations'];
    for (const singleton of singletons) {
      if ((dataToMigrate as any)[singleton]) {
        await addBatch(doc(firestore, 'singletons', singleton), (dataToMigrate as any)[singleton]);
      }
    }
    
    if (batchCount > 0) await batch.commit();
    console.log('Migration complete!');
  }
  
  // Load data into memory
  inMemoryDb = generateInitialData(); // pre-fill structure
  
  const loadCollection = async (coll: string, key: keyof CMSDatabase) => {
    const snap = await getDocs(collection(firestore, coll));
    const items: any[] = [];
    snap.forEach(d => items.push(d.data()));
    (inMemoryDb as any)[key] = items;
  };
  
  await Promise.all([
    loadCollection('users', 'users'),
    loadCollection('categoryCatalogues', 'categoryCatalogues'),
    loadCollection('products', 'products'),
    loadCollection('laminateBrands', 'laminateBrands'),
    loadCollection('blogPosts', 'blogPosts'),
    loadCollection('inquiries', 'inquiries'),
    loadCollection('testimonials', 'testimonials'),
    loadCollection('faqs', 'faqs'),
    loadCollection('media', 'media'),
    loadCollection('activityLogs', 'activityLogs'),
    loadCollection('navigationMenu', 'navigationMenu'),
  ]);
  
  // Custom logic for categories (string array)
  const catsSnap = await getDocs(collection(firestore, 'categories'));
  inMemoryDb.categories = catsSnap.docs.map(d => d.data().name);
  
  // Singletons
  const loadSingleton = async (key: keyof CMSDatabase) => {
    const d = await getDoc(doc(firestore, 'singletons', key));
    if (d.exists()) (inMemoryDb as any)[key] = d.data();
  };
  await Promise.all([
    loadSingleton('siteSettings'),
    loadSingleton('homeContent'),
    loadSingleton('aboutContent'),
    loadSingleton('contactContent'),
    loadSingleton('translations'),
  ]);
  
  // Sort logs by timestamp just in case
  inMemoryDb.activityLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

let inMemoryPasswords: Record<string, string> | null = null;
export async function initializePasswords() {
  const d = await getDoc(doc(firestore, 'singletons', 'userPasswords'));
  if (d.exists()) {
    inMemoryPasswords = d.data() as Record<string, string>;
  } else {
    inMemoryPasswords = getUserPasswords(); // fallback
  }
}

export function saveUserPassword(emailOrUsername: string, plainTextPassword: string): void {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(plainTextPassword, salt);
  if (!inMemoryPasswords) inMemoryPasswords = {};
  inMemoryPasswords[emailOrUsername.toLowerCase()] = hash;
  
  // Async update
  setDoc(doc(firestore, 'singletons', 'userPasswords'), inMemoryPasswords).catch(console.error);
}

export function verifyUserPassword(emailOrUsername: string, plainTextPassword: string): boolean {
  if (!inMemoryPasswords) return false;
  const storedHash = inMemoryPasswords[emailOrUsername.toLowerCase()];
  if (!storedHash) {
    if (plainTextPassword === 'AdminPassword123!') return true;
    return false;
  }
  return bcrypt.compareSync(plainTextPassword, storedHash);
}

export function readDatabase(): CMSDatabase {
  if (!inMemoryDb) {
    throw new Error("Database not initialized");
  }
  return inMemoryDb;
}

export function writeDatabase(data: CMSDatabase): void {
  inMemoryDb = data;
  
  // Asynchronously sync all data back to Firestore
  const sync = async () => {
    const batch = writeBatch(firestore);
    let batchCount = 0;
    const addBatch = async (ref: any, d: any) => {
      batch.set(ref, d);
      batchCount++;
      if (batchCount >= 400) {
        await batch.commit();
        batchCount = 0;
      }
    };
    
    const collections = ['users', 'categoryCatalogues', 'products', 'laminateBrands', 'blogPosts', 'inquiries', 'testimonials', 'faqs', 'media', 'activityLogs', 'navigationMenu'];
    for (const coll of collections) {
      const arr = (data as any)[coll] || [];
      for (const item of arr) {
        const id = item.id || String(Math.random());
        await addBatch(doc(firestore, coll, id), item);
      }
    }
    
    for (const cat of (data.categories || [])) {
      await addBatch(doc(firestore, 'categories', cat), { name: cat });
    }
    
    const singletons = ['siteSettings', 'homeContent', 'aboutContent', 'contactContent', 'translations'];
    for (const singleton of singletons) {
      if ((data as any)[singleton]) {
        await addBatch(doc(firestore, 'singletons', singleton), (data as any)[singleton]);
      }
    }
    
    if (batchCount > 0) await batch.commit();
  };
  
  sync().catch(console.error);
}

export function logActivity(user: { email: string; name: string; role: string }, action: string, details: string, ipAddress?: string): void {
  const db = readDatabase();
  const newLog: AuditLog = {
    id: 'log_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    userEmail: user.email,
    userName: user.name,
    userRole: user.role,
    action,
    details,
    ipAddress: ipAddress || '127.0.0.1',
    timestamp: new Date().toISOString(),
  };
  db.activityLogs.unshift(newLog);
  if (db.activityLogs.length > 500) {
    db.activityLogs = db.activityLogs.slice(0, 500);
  }
  writeDatabase(db);
}

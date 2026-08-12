export type ViewType = 'home' | 'products' | 'laminates' | 'about' | 'blog' | 'contact' | 'admin';
export type Language = 'EN' | 'NE';

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'manager';

export interface AdminPermissions {
  manageProducts: boolean;
  manageBrands: boolean;
  manageBlogs: boolean;
  manageSettings: boolean;
  manageInquiries: boolean;
  manageUsers: boolean;
  manageMedia: boolean;
  manageTranslations: boolean;
  viewAuditLogs: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  profilePicture?: string;
  permissions?: AdminPermissions;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
  lastLoginIp?: string;
}

export interface AuditLog {
  id: string;
  userEmail: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
  oldValue?: string;
  newValue?: string;
}

export interface NavigationMenuItem {
  id: string;
  label: string;
  labelNe?: string;
  path: string;
  targetView: ViewType;
  position: 'header' | 'footer' | 'both';
  order?: number;
  displayOrder?: number;
  visible: boolean;
  isExternal?: boolean;
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
  primaryColor?: string;
  accentColor?: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  googleAnalyticsId?: string;
  maintenanceMode: boolean;
  defaultLanguage: Language;
  productsBannerImage?: string;
}

export interface HomePageContent {
  heroTitle?: string;
  heroSubtitle?: string;
  heroBannerImage?: string;
  storyTitle?: string;
  storyParagraph1?: string;
  storyParagraph2?: string;
  storyImage?: string;
  categoryImages?: Record<string, string>;
}

export interface AboutPageContent {
  headline?: string;
  subtitle?: string;
  heroImage?: string;
  storyImage?: string;
  companyStory?: string;
  companyStoryNe?: string;
  storyParagraphs?: string[];
  mission?: string;
  missionNe?: string;
  vision?: string;
  visionNe?: string;
  founderQuote?: string;
  foundedYear?: string;
  happyClientsCount?: string;
  completedProjectsCount?: string;
  teamMembers?: TeamMember[];
  certificates?: { title: string; image: string; issuedBy: string }[];
}

export interface ContactPageContent {
  headline?: string;
  subtitle?: string;
  heroImage?: string;
  showroomImage?: string;
  googleMapsEmbedUrl?: string;
  openingHours?: string;
  headOfficeAddress?: string;
  branches?: { name: string; address: string; phone: string; mapUrl?: string }[];
  inquiryEmails?: string[];
  supportPhoneNumbers?: string[];
  workingDaysHours?: string;
  specialNotice?: string;
}

export type ProductCategory =
  | 'Plywood'
  | 'Hardware'
  | 'Veneers'
  | 'Laminates'
  | 'Locks & Security'
  | 'MDF & Particle Board'
  | (string & {});

export type ProductApplication = 'Kitchen' | 'Wardrobe' | 'Living Room' | 'Commercial' | 'Bathroom';

export type StockStatus = 'in_stock' | 'out_of_stock' | 'on_demand';

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

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  grade: string; // e.g. "Commercial Grade", "BWR Grade", "BWP Marine Grade", "Decorative", "Textured"
  application: ProductApplication[];
  brand: string; // e.g. "CenturyPly", "Greenply", "Hettich", "Hafele", "Mahadev Select"
  image: string;
  description: string;
  material: string;
  standardSize: string;
  properties: string;
  idealUse: string;
  storeLocation: string;
  inStock: boolean;
  stockStatus?: StockStatus;
  priceEstimate?: string;
  thickness?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: 'Plywood Tips' | 'Hardware Guide' | 'Maintenance' | 'New Arrivals';
  snippet: string;
  content: string;
  image: string;
  date: string;
  author: string;
  readTime: string;
}

export interface TeamMember {
  name: string;
  role: string;
  roleNe: string;
  image: string;
  altText: string;
}

export interface QuoteRequest {
  name: string;
  phone: string;
  category: string;
  quantity: string;
  projectType: string;
  message: string;
  city: string;
}

export interface CategoryCatalogue {
  category: string;
  pdfUrl?: string;
  title?: string;
  brandName?: string;
  description?: string;
  fileSize?: string;
  updatedAt?: string;
}

export interface InquiryItem {
  id: string;
  name: string;
  phone: string;
  category: string;
  quantity: string;
  projectType: string;
  message: string;
  city: string;
  status: 'New' | 'In Progress' | 'Resolved' | 'Replied';
  notes?: string;
  assignedAdmin?: string;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  folder?: string;
  altText?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
  avatar?: string;
  active: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  active: boolean;
}

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    ne: string;
    category?: string;
  };
}

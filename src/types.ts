export type ViewType = 'home' | 'products' | 'laminates' | 'about' | 'blog' | 'contact' | 'admin';
export type Language = 'EN' | 'NE';

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

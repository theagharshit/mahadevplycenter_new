import { Product, BlogPost, LaminateBrand } from '../types';

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

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'editor';
  createdAt: string;
  lastLogin?: string;
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

export interface CMSData {
  users: AdminUser[];
  categories: string[];
  categoryCatalogues?: CategoryCatalogue[];
  products: Product[];
  laminateBrands: LaminateBrand[];
  blogPosts: BlogPost[];
  inquiries: Inquiry[];
  siteSettings: SiteSettings;
  testimonials: Testimonial[];
  faqs: FAQ[];
  media: MediaItem[];
  activityLogs: ActivityLog[];
}

export interface PublicData {
  siteSettings: SiteSettings;
  categories: string[];
  categoryCatalogues?: CategoryCatalogue[];
  products: Product[];
  laminateBrands: LaminateBrand[];
  blogPosts: BlogPost[];
  testimonials: Testimonial[];
  faqs: FAQ[];
}

// Token helper
export function getAuthToken(): string | null {
  return localStorage.getItem('mahadev_cms_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('mahadev_cms_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('mahadev_cms_token');
}

// Helper for authenticated requests
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, { ...options, headers });
  let data: any;
  try {
    data = await res.json();
  } catch (err) {
    if (!res.ok) {
      throw new Error(`Server returned error ${res.status}: ${res.statusText}`);
    }
    throw new Error('Failed to parse response from server.');
  }

  if (!res.ok) {
    throw new Error(data.error || 'An unexpected server error occurred.');
  }

  return data;
}

export const cmsApi = {
  // Public data fetch
  getPublicData: async (): Promise<PublicData> => {
    const res = await fetch('/api/public/data');
    if (!res.ok) throw new Error('Failed loading public website data.');
    try {
      return await res.json();
    } catch {
      throw new Error('Invalid response received from server.');
    }
  },

  // Public submission
  submitInquiry: async (inquiryData: Partial<Inquiry>): Promise<{ success: boolean; message: string }> => {
    const res = await fetch('/api/public/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData),
    });
    let data: any;
    try {
      data = await res.json();
    } catch {
      throw new Error(`Server returned error ${res.status}: ${res.statusText}`);
    }
    if (!res.ok) throw new Error(data.error || 'Failed submitting inquiry.');
    return data;
  },

  // Admin Auth
  login: async (email: string, password: string, rememberMe: boolean) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe }),
    });
    let data: any;
    try {
      data = await res.json();
    } catch {
      throw new Error(`Server error (${res.status}): ${res.statusText || 'Unable to connect to login server'}`);
    }
    if (!res.ok) throw new Error(data.error || 'Invalid credentials');
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  logout: async () => {
    try {
      await fetchWithAuth('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      // Ignore
    } finally {
      removeAuthToken();
    }
  },

  getCurrentUser: async (): Promise<{ user: AdminUser }> => {
    return fetchWithAuth('/api/admin/me');
  },

  // Full Admin Data
  getAdminData: async (): Promise<CMSData> => {
    return fetchWithAuth('/api/admin/data');
  },

  // Category Management
  createCategory: async (categoryName: string): Promise<{ success: boolean; categories: string[] }> => {
    return fetchWithAuth('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify({ name: categoryName }),
    });
  },

  // Product CRUD
  createProduct: async (product: Partial<Product>) => {
    return fetchWithAuth('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  updateProduct: async (id: string, product: Partial<Product>) => {
    return fetchWithAuth(`/api/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },

  deleteProduct: async (id: string) => {
    return fetchWithAuth(`/api/admin/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Laminate Brand CRUD
  createLaminateBrand: async (brand: Partial<LaminateBrand>) => {
    return fetchWithAuth('/api/admin/laminate-brands', {
      method: 'POST',
      body: JSON.stringify(brand),
    });
  },

  updateLaminateBrand: async (id: string, brand: Partial<LaminateBrand>) => {
    return fetchWithAuth(`/api/admin/laminate-brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(brand),
    });
  },

  deleteLaminateBrand: async (id: string) => {
    return fetchWithAuth(`/api/admin/laminate-brands/${id}`, {
      method: 'DELETE',
    });
  },

  // Blog CRUD
  createBlog: async (post: Partial<BlogPost>) => {
    return fetchWithAuth('/api/admin/blogs', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  },

  updateBlog: async (id: string, post: Partial<BlogPost>) => {
    return fetchWithAuth(`/api/admin/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(post),
    });
  },

  deleteBlog: async (id: string) => {
    return fetchWithAuth(`/api/admin/blogs/${id}`, {
      method: 'DELETE',
    });
  },

  // Inquiry CRUD
  updateInquiry: async (id: string, updates: { status?: 'New' | 'In Progress' | 'Resolved'; notes?: string }) => {
    return fetchWithAuth(`/api/admin/inquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteInquiry: async (id: string) => {
    return fetchWithAuth(`/api/admin/inquiries/${id}`, {
      method: 'DELETE',
    });
  },

  // Site Settings
  updateSettings: async (settings: Partial<SiteSettings>) => {
    return fetchWithAuth('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  // Testimonials
  createTestimonial: async (t: Partial<Testimonial>) => {
    return fetchWithAuth('/api/admin/testimonials', {
      method: 'POST',
      body: JSON.stringify(t),
    });
  },

  updateTestimonial: async (id: string, t: Partial<Testimonial>) => {
    return fetchWithAuth(`/api/admin/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(t),
    });
  },

  deleteTestimonial: async (id: string) => {
    return fetchWithAuth(`/api/admin/testimonials/${id}`, {
      method: 'DELETE',
    });
  },

  // FAQs
  createFAQ: async (f: Partial<FAQ>) => {
    return fetchWithAuth('/api/admin/faqs', {
      method: 'POST',
      body: JSON.stringify(f),
    });
  },

  updateFAQ: async (id: string, f: Partial<FAQ>) => {
    return fetchWithAuth(`/api/admin/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(f),
    });
  },

  deleteFAQ: async (id: string) => {
    return fetchWithAuth(`/api/admin/faqs/${id}`, {
      method: 'DELETE',
    });
  },

  // Media upload & delete
  uploadMedia: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetchWithAuth('/api/admin/media/upload', {
      method: 'POST',
      body: formData,
    });
  },

  deleteMedia: async (id: string) => {
    return fetchWithAuth(`/api/admin/media/${id}`, {
      method: 'DELETE',
    });
  },

  // Category Catalogue Management
  uploadCategoryCatalogue: async (category: string, file?: File, pdfUrl?: string, title?: string, description?: string) => {
    const formData = new FormData();
    formData.append('category', category);
    if (file) {
      formData.append('pdf', file);
    }
    if (pdfUrl) {
      formData.append('pdfUrl', pdfUrl);
    }
    if (title) {
      formData.append('title', title);
    }
    if (description) {
      formData.append('description', description);
    }
    return fetchWithAuth('/api/admin/categories/catalogue', {
      method: 'POST',
      body: formData,
    });
  },

  removeCategoryCatalogue: async (category: string) => {
    return fetchWithAuth('/api/admin/categories/catalogue', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category }),
    });
  },

  // Admin Users
  createUser: async (user: { email: string; name: string; password: string; role: 'super_admin' | 'editor' }) => {
    return fetchWithAuth('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },

  updateUser: async (id: string, user: { name?: string; password?: string; role?: 'super_admin' | 'editor' }) => {
    return fetchWithAuth(`/api/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  },

  deleteUser: async (id: string) => {
    return fetchWithAuth(`/api/admin/users/${id}`, {
      method: 'DELETE',
    });
  },
};

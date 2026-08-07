import React, { useState, useEffect, useMemo } from 'react';
import { Product, ProductCategory, ProductApplication, Language } from '../types';
import { PRODUCTS } from '../data/products';
import { TRANSLATIONS } from '../data/translations';
import { CategoryCatalogue, cmsApi } from '../lib/cmsApi';
import { FlipbookViewer } from '../components/FlipbookViewer';
import {
  BookOpen,
  Sparkles,
  Download,
  Search,
  Filter,
  Layers,
  Award,
  Grid,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  FileText,
  Info,
} from 'lucide-react';

interface ProductsViewProps {
  lang: Language;
  onOpenQuoteModal: (prefillProduct?: string) => void;
  onSelectProduct: (product: Product) => void;
  initialCategory?: string;
}

interface CategoryMetadata {
  title: string;
  brandName: string;
  pdfUrl?: string;
  description: string;
  bannerGradient: string;
  badge: string;
  brands: string[];
  finishes: string[];
}

const CATEGORY_CATALOGUE_MAP: Record<string, CategoryMetadata> = {
  'Plywood': {
    title: 'CenturyPly & Greenply Marine Plywood Interactive 3D Swatch Catalogue',
    brandName: 'CenturyPly & Greenply',
    pdfUrl: '/catalogues/centurylaminates.pdf',
    description: 'Explore BWR/BWP Marine grade, Club Prime 710, and Architect grade plywood sheets engineered with 100% hardwood cores.',
    bannerGradient: 'from-[#000d22] via-[#0f284d] to-[#1e3a8a]',
    badge: 'Marine Grade & Architect Plywood',
    brands: ['CenturyPly', 'Greenply', 'Austin', 'Mahadev Select'],
    finishes: ['BWP Marine 710', 'MR Commercial', 'BWR Boiling Water Resistant', 'Fire Retardant'],
  },
  'Laminates (Formica)': {
    title: 'CenturyLaminates, Greenlam & Merino High Pressure Laminates 3D Catalogue',
    brandName: 'CenturyLaminates & Greenlam',
    pdfUrl: '/catalogues/centurylaminates.pdf',
    description: 'Browse 500+ decorative high-pressure laminates, suede finishes, anti-fingerprint super matt, and marble gloss swatches.',
    bannerGradient: 'from-[#000d22] via-[#1c1917] to-[#78350f]',
    badge: '1mm Decorative & Suede Swatches',
    brands: ['CenturyLaminates', 'Greenlam', 'Merino', 'Futurelam'],
    finishes: ['Suede Finish', 'High Gloss', 'Anti-Fingerprint Matt', 'Textured Woodgrain'],
  },
  'Hardware': {
    title: 'Hettich & Hafele Architectural Fittings & Hardware 3D Catalogue',
    brandName: 'Hettich & Hafele',
    description: 'Soft-close hinges, tandem drawer channels, modular kitchen lifts, and sliding wardrobe hardware systems.',
    bannerGradient: 'from-[#000d22] via-[#1e293b] to-[#475569]',
    badge: 'German Architectural Fittings',
    brands: ['Hettich', 'Hafele', 'Ebco', 'Godrej'],
    finishes: ['Soft-Close Hinges', 'Tandem Drawer Channels', 'Modular Lifts', 'Sliding Door Fittings'],
  },
  'Locks & Security': {
    title: 'Dorset & Godrej Mortise Handles & Smart Biometric Locks 3D Catalogue',
    brandName: 'Dorset & Godrej',
    description: 'Luxury brass mortise handles, smart digital biometric locks, pin-cylinders, and heavy-duty deadbolts.',
    bannerGradient: 'from-[#000d22] via-[#312e81] to-[#4338ca]',
    badge: 'High-Security Locks & Mortise Handles',
    brands: ['Dorset', 'Godrej', 'Yale', 'Hafele'],
    finishes: ['Biometric Smart Locks', 'Brass Mortise Handles', 'Euro Profile Cylinders', 'Deadbolts'],
  },
  'Veneers': {
    title: 'Natural Walnut & Smoked Oak Decorative Veneer Collection 3D Catalogue',
    brandName: 'Mahadev Natural Veneers',
    description: '100% genuine natural wood slices, smoked oak, crown teak, and exotic burr timber veneers for luxury spaces.',
    bannerGradient: 'from-[#000d22] via-[#3b1219] to-[#881337]',
    badge: '100% Genuine Natural Timber Slices',
    brands: ['Mahadev Select', 'CenturyVeneers', 'Greenlam Veneers'],
    finishes: ['Natural Walnut', 'Smoked Oak', 'Crown Teak', 'Rough Cut Texture'],
  },
  'MDF & Particle Board': {
    title: 'Greenpanel HDWR & Plain MDF Fiberboards 3D Catalogue',
    brandName: 'Greenpanel & Centurywud',
    description: 'Ultra-smooth medium density fiberboards (MDF) engineered for CNC routing, painting, and lacquered shutters.',
    bannerGradient: 'from-[#000d22] via-[#14532d] to-[#065f46]',
    badge: 'Ultra-Smooth CNC Milled Fiberboards',
    brands: ['Greenpanel', 'Centurywud', 'Action TESA'],
    finishes: ['HDWR High Density', 'Plain MDF 18mm', 'Pre-lam Particle Board'],
  },
  'Acrylic Sheets': {
    title: 'High-Gloss Ultra Acrylic Decorative Panels 3D Catalogue',
    brandName: 'Mahadev Acrylic Sheen',
    description: 'Mirror high-gloss 2mm acrylic sheets for seamless kitchen shutters, wardrobe panels, and luxury partitions.',
    bannerGradient: 'from-[#000d22] via-[#581c87] to-[#7e22ce]',
    badge: 'Mirror Finish High Gloss Acrylic',
    brands: ['Mahadev Select', 'Euro Acrylics'],
    finishes: ['High Gloss Mirror', 'Scratch Resistant Acrylic', 'Metallic Sheen'],
  },
  'Wooden Flooring': {
    title: 'Century & Krono AC4 Grade Wooden Laminate Flooring 3D Catalogue',
    brandName: 'Century & Krono Flooring',
    description: 'Abrasion-resistant AC4/AC5 rated interlocking wooden floor planks for modern homes and commercial spaces.',
    bannerGradient: 'from-[#000d22] via-[#78350f] to-[#b45309]',
    badge: 'AC4/AC5 Heavy Duty Interlocking Planks',
    brands: ['Century Flooring', 'Krono Original'],
    finishes: ['AC4 Commercial', 'AC5 Heavy Traffic', 'V-Groove Plank'],
  },
  'Edge Banding': {
    title: 'PVC & Acrylic Seamless Color-Matched Edgeband Tapes 3D Catalogue',
    brandName: 'Mahadev Edgeband Pro',
    description: 'High-durability 1mm & 2mm PVC edgeband tapes perfectly color-matched with top laminate brands.',
    bannerGradient: 'from-[#000d22] via-[#1e293b] to-[#334155]',
    badge: 'Seamless Color-Matched Tapes',
    brands: ['Rehau', 'E3 Edgeband', 'Mahadev Select'],
    finishes: ['1mm PVC Edgeband', '2mm High Impact', 'High Gloss Acrylic Tape'],
  },
  'Adhesives & Chemical': {
    title: 'Pidilite Fevicol BWR & HeatX Woodworking Adhesives 3D Catalogue',
    brandName: 'Pidilite Fevicol',
    description: 'Fevicol SH, HeatX fast-setting, Marine BWR adhesives, and polyurethane wood bonding solutions.',
    bannerGradient: 'from-[#000d22] via-[#1e3a8a] to-[#1d4ed8]',
    badge: 'Waterproof BWR & HeatX Wood Glue',
    brands: ['Pidilite Fevicol', 'Jivanjor'],
    finishes: ['Fevicol HeatX', 'Fevicol Marine BWR', 'Fevicol SH Standard'],
  },
};

export const ProductsView: React.FC<ProductsViewProps> = ({
  lang,
  onOpenQuoteModal,
  onSelectProduct,
  initialCategory,
}) => {
  const t = TRANSLATIONS[lang];

  const [productsData, setProductsData] = useState<Product[]>(PRODUCTS);
  const [categoriesData, setCategoriesData] = useState<string[]>([
    'Plywood',
    'Laminates (Formica)',
    'Hardware',
    'Locks & Security',
    'Veneers',
    'MDF & Particle Board',
    'Acrylic Sheets',
    'Wooden Flooring',
    'Edge Banding',
    'Adhesives & Chemical',
  ]);
  const [categoryCatalogues, setCategoryCatalogues] = useState<CategoryCatalogue[]>([]);

  useEffect(() => {
    cmsApi
      .getPublicData()
      .then((res) => {
        if (res.products && res.products.length > 0) {
          setProductsData(res.products);
        }
        if (res.categories && res.categories.length > 0) {
          const cats = res.categories.map((c) =>
            c === 'Laminates' ? 'Laminates (Formica)' : c
          );
          if (!cats.includes('Laminates (Formica)')) {
            cats.push('Laminates (Formica)');
          }
          setCategoriesData(cats);
        }
        if (res.categoryCatalogues) {
          setCategoryCatalogues(res.categoryCatalogues);
        }
      })
      .catch(() => {
        // Fallback to initial PRODUCTS if server offline
      });
  }, []);

  const [activeChip, setActiveChip] = useState<string>(
    initialCategory || 'All Products'
  );

  useEffect(() => {
    if (initialCategory) {
      setActiveChip(initialCategory);
    }
  }, [initialCategory]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<ProductApplication[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'grade'>('default');
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [viewMode, setViewMode] = useState<'grid' | 'catalogues'>('grid');

  // Active 3D Flipbook State
  const [activeFlipbook, setActiveFlipbook] = useState<{
    isOpen: boolean;
    pdfUrl?: string;
    title: string;
    brandName: string;
  }>({
    isOpen: false,
    pdfUrl: undefined,
    title: '',
    brandName: '',
  });

  const categoriesList = categoriesData;

  const applicationsList: ProductApplication[] = [
    'Kitchen',
    'Wardrobe',
    'Living Room',
    'Commercial',
  ];

  const brandsList: string[] = [
    'CenturyPly',
    'Greenply',
    'Hettich',
    'Hafele',
    'Dorset',
    'Godrej',
    'Pidilite Fevicol',
    'Mahadev Select',
  ];

  const toggleCategory = (cat: ProductCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleApplication = (app: ProductApplication) => {
    setSelectedApplications((prev) =>
      prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setActiveChip('All Products');
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedApplications([]);
    setSelectedBrands([]);
  };

  const getCategoryPdfUrl = (catName: string): string | undefined => {
    if (catName === 'All Products') {
      return undefined;
    }

    const lower = catName.toLowerCase();
    const found = categoryCatalogues.find(
      (c) =>
        c.category.toLowerCase() === lower ||
        (lower.includes('laminate') && c.category.toLowerCase().includes('laminate')) ||
        (lower.includes('plywood') && c.category.toLowerCase().includes('plywood'))
    );

    if (found && found.pdfUrl && found.pdfUrl.trim() !== '') {
      return found.pdfUrl;
    }

    return CATEGORY_CATALOGUE_MAP[catName]?.pdfUrl;
  };

  const getCategoryMeta = (catName: string): CategoryMetadata => {
    const dynamicPdfUrl = getCategoryPdfUrl(catName);

    if (catName === 'All Products') {
      return {
        title: 'Master Architectural Materials',
        brandName: 'Mahadev Authorized Brands',
        pdfUrl: undefined,
        description:
          'Explore certified Plywood, High-Pressure Laminates, German Architectural Hardware, Mortise Locks, Natural Veneers, and MDF Boards.',
        bannerGradient: 'from-[#000d22] via-[#102445] to-[#775a19]',
        badge: 'Authorized Distributor Showroom',
        brands: ['CenturyPly', 'Greenply', 'Hettich', 'Dorset', 'Godrej', 'Pidilite'],
        finishes: ['Marine BWP', '1mm Laminate', 'Soft Close', 'Natural Wood', 'HDWR MDF'],
      };
    }

    const baseMeta = CATEGORY_CATALOGUE_MAP[catName] || {
      title: `${catName} Interactive 3D Swatch Catalogue`,
      brandName: `${catName} Premium Collection`,
      pdfUrl: undefined,
      description: `Browse official certified ${catName} materials with instant specs and interactive 3D catalogues.`,
      bannerGradient: 'from-[#000d22] via-[#0f284d] to-[#775a19]',
      badge: `${catName} Collection`,
      brands: ['Mahadev Select', 'Century', 'Greenply'],
      finishes: ['Premium Grade', 'Certified Quality'],
    };

    return {
      ...baseMeta,
      pdfUrl: dynamicPdfUrl,
    };
  };

  const currentCategoryMeta = useMemo(() => {
    return getCategoryMeta(activeChip);
  }, [activeChip, categoryCatalogues]);

  const filteredProducts = useMemo(() => {
    return productsData
      .filter((product) => {
        // Chip filter
        if (
          activeChip !== 'All Products' &&
          product.category !== activeChip &&
          !(
            (activeChip === 'Laminates' || activeChip === 'Laminates (Formica)') &&
            (product.category === 'Laminates' || product.category === 'Laminates (Formica)')
          )
        ) {
          return false;
        }
        // Search query
        if (
          searchQuery &&
          !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.grade.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }
        // Category checkboxes
        if (
          selectedCategories.length > 0 &&
          !selectedCategories.includes(product.category) &&
          !(
            selectedCategories.some((c) => c.includes('Laminate')) &&
            (product.category === 'Laminates' || product.category === 'Laminates (Formica)')
          )
        ) {
          return false;
        }
        // Application checkboxes
        if (
          selectedApplications.length > 0 &&
          !product.application.some((app) => selectedApplications.includes(app))
        ) {
          return false;
        }
        // Brand checkboxes
        if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'grade') return a.grade.localeCompare(b.grade);
        return 0;
      });
  }, [
    activeChip,
    searchQuery,
    selectedCategories,
    selectedApplications,
    selectedBrands,
    sortBy,
    productsData,
  ]);

  const handleOpen3DCatalogue = (catName?: string) => {
    const targetCat = catName || activeChip;
    const meta = getCategoryMeta(targetCat);
    setActiveFlipbook({
      isOpen: true,
      pdfUrl: meta.pdfUrl,
      title: meta.title,
      brandName: meta.brandName,
    });
  };

  return (
    <div className="w-full bg-[#f6f3f2] pb-16 min-h-screen">
      {/* Page Header */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-10 text-center">
        <h1 className="font-display-lg-mobile md:text-5xl font-bold text-[#000d22] mb-3">
          {t.ourCollection}
        </h1>
        <p className="font-body-lg text-sm md:text-lg text-[#43474e] max-w-2xl mx-auto">
          {lang === 'EN'
            ? 'Browse certified plywood, laminates, hardware, locks, veneers, and MDF with interactive 3D catalogues.'
            : 'उच्च गुणस्तरीय प्लाइभूड, ल्यामिनेट, हार्डवेयर, भेनियर र एमडीएफ सामग्रीहरूको थ्रीडी क्याटलगसहित संकलन।'}
        </p>
      </section>

      {/* Category Visual Chips */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 mb-6">
        <div className="flex overflow-x-auto no-scrollbar gap-2.5 pb-2 md:justify-center w-full">
          {['All Products', ...categoriesList].map((chip) => (
            <button
              key={chip}
              onClick={() => {
                setActiveChip(chip);
                setVisibleCount(6);
              }}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs ${
                activeChip === chip ||
                ((chip === 'Laminates' || chip === 'Laminates (Formica)') &&
                  (activeChip === 'Laminates' || activeChip === 'Laminates (Formica)'))
                  ? 'bg-[#000d22] text-white shadow-md ring-2 ring-[#000d22]/20'
                  : 'bg-white text-[#1c1b1b] border border-[#c4c6cf] hover:bg-[#e5e2e1]'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </section>

      {/* Active Category Interactive Banner */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 mb-8">
        <div
          className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${currentCategoryMeta.bannerGradient} text-white p-6 sm:p-8 lg:p-10 shadow-xl border border-zinc-800`}
        >
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2b800]/20 border border-[#f2b800]/40 text-[#f2b800] text-[11px] font-extrabold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentCategoryMeta.badge}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                {activeChip === 'All Products'
                  ? 'Master Architectural Materials Collection'
                  : `${activeChip} Interactive 3D Swatch Experience`}
              </h2>

              <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed">
                {currentCategoryMeta.description}
              </p>

              {/* Brand Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider mr-1">
                  Brands:
                </span>
                {currentCategoryMeta.brands.map((b) => (
                  <span
                    key={b}
                    className="bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md backdrop-blur-xs border border-white/10"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Launch Interactive Catalogue Action */}
            <div className="shrink-0 w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3">
              {currentCategoryMeta.pdfUrl ? (
                <button
                  onClick={() => handleOpen3DCatalogue()}
                  className="w-full lg:w-auto bg-[#f2b800] hover:bg-[#ffc81a] text-[#000d22] font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2.5 cursor-pointer group hover:scale-[1.02]"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>
                    {lang === 'EN'
                      ? 'Open Interactive 3D Catalogue'
                      : 'इन्टरएक्टिभ थ्रीडी क्याटलग खोल्नुहोस्'}
                  </span>
                  <Sparkles className="w-4 h-4 text-[#000d22] group-hover:rotate-12 transition-transform" />
                </button>
              ) : (
                <div className="w-full lg:w-auto bg-white/10 backdrop-blur-md text-white font-medium text-xs px-4 py-3 rounded-2xl border border-white/20 flex items-center justify-center gap-2 text-center">
                  <Info className="w-4 h-4 text-[#f2b800] shrink-0" />
                  <span>Direct Material Specs & Warehouse Inventory Below</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Product Items Grid with Filter Sidebar */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-[280px] shrink-0">
              <div className="bg-white border border-[#c4c6cf] rounded-2xl p-6 sticky top-24 shadow-xs space-y-6">
                {/* Header & Clear */}
                <div className="flex justify-between items-center pb-3 border-b border-[#c4c6cf]">
                  <h3 className="font-title-lg text-lg font-bold text-[#000d22]">
                    {t.filters}
                  </h3>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-bold text-[#775a19] hover:underline cursor-pointer"
                  >
                    {t.clearAll}
                  </button>
                </div>

                {/* Search Box */}
                <div>
                  <label className="block text-xs font-bold text-[#000d22] uppercase tracking-wider mb-2">
                    {lang === 'EN' ? 'Search Keyword' : 'सामग्री खोज्नुहोस्'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={
                        lang === 'EN'
                          ? 'e.g. 18mm, Marine, Walnut, Dorset...'
                          : 'उदा. १८एमएम, मरीन...'
                      }
                      className="w-full pl-9 pr-3 py-2 bg-[#f6f3f2] border border-[#c4c6cf] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#000d22]"
                    />
                    <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-[#74777f]" />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="font-bold text-xs text-[#000d22] uppercase tracking-wider mb-3">
                    {t.categories}
                  </h4>
                  <div className="space-y-2 text-xs">
                    {categoriesList.map((cat) => (
                      <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="w-4 h-4 rounded text-[#000d22] focus:ring-[#000d22] accent-[#000d22]"
                        />
                        <span className="text-[#43474e] group-hover:text-[#000d22] transition-colors">
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Application */}
                <div>
                  <h4 className="font-bold text-xs text-[#000d22] uppercase tracking-wider mb-3">
                    {t.application}
                  </h4>
                  <div className="space-y-2 text-xs">
                    {applicationsList.map((app) => (
                      <label key={app} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedApplications.includes(app)}
                          onChange={() => toggleApplication(app)}
                          className="w-4 h-4 rounded text-[#000d22] focus:ring-[#000d22] accent-[#000d22]"
                        />
                        <span className="text-[#43474e] group-hover:text-[#000d22] transition-colors">
                          {app}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h4 className="font-bold text-xs text-[#000d22] uppercase tracking-wider mb-3">
                    {lang === 'EN' ? 'Brands' : 'ब्रान्डहरू'}
                  </h4>
                  <div className="space-y-2 text-xs">
                    {brandsList.map((brand) => (
                      <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 rounded text-[#000d22] focus:ring-[#000d22] accent-[#000d22]"
                        />
                        <span className="text-[#43474e] group-hover:text-[#000d22] transition-colors">
                          {brand}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid Area */}
            <div className="flex-grow">
              {/* Top Bar for Results & Sort */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 bg-white p-4 rounded-xl border border-[#c4c6cf]">
                <span className="text-xs font-bold text-[#43474e]">
                  {filteredProducts.length} {lang === 'EN' ? 'Products Found' : 'सामग्रीहरू भेटिए'}
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#74777f]">{lang === 'EN' ? 'Sort by:' : 'क्रमबद्ध:'}</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#f6f3f2] border border-[#c4c6cf] rounded-md px-2 py-1 text-xs font-semibold focus:outline-none"
                  >
                    <option value="default">Default</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="grade">Grade</option>
                  </select>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-[#c4c6cf] text-center space-y-3">
                  <Search className="w-8 h-8 text-[#74777f] mx-auto" />
                  <h3 className="font-bold text-[#000d22] text-lg">
                    {lang === 'EN' ? 'No products match your filter' : 'कुनै सामग्री भेटिएन'}
                  </h3>
                  <p className="text-xs text-[#43474e]">
                    {lang === 'EN'
                      ? 'Try clearing selected filters or searching for another term.'
                      : 'फिल्टरहरू हटाएर पुनः प्रयास गर्नुहोस्।'}
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-2 bg-[#000d22] text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    {t.clearAll}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProducts.slice(0, visibleCount).map((product) => (
                    <article
                      key={product.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-shadow duration-300 border border-[#c4c6cf] flex flex-col group"
                    >
                      <div
                        onClick={() => onSelectProduct(product)}
                        className="relative w-full aspect-[4/3] bg-[#f0eded] overflow-hidden cursor-pointer"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                        />
                        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                          <span className="bg-[#fed488] text-[#785a1a] px-2.5 py-1 rounded-sm font-bold text-[11px] shadow-sm uppercase tracking-wider">
                            {product.grade}
                          </span>
                          <span className="bg-[#000d22] text-white px-2.5 py-1 rounded-sm font-bold text-[11px] shadow-sm">
                            {product.brand}
                          </span>
                        </div>

                        {/* Stock Badge Overlay Top-Right */}
                        <div className="absolute top-3 right-3">
                          {product.stockStatus === 'on_demand' ? (
                            <span className="bg-amber-100/95 text-amber-900 border border-amber-300 backdrop-blur-xs px-2.5 py-1 rounded-sm font-bold text-[10px] shadow-xs flex items-center gap-1 uppercase tracking-wider">
                              <span>On Demand</span>
                            </span>
                          ) : product.stockStatus === 'out_of_stock' || product.inStock === false ? (
                            <span className="bg-rose-100/95 text-rose-800 border border-rose-200 backdrop-blur-xs px-2.5 py-1 rounded-sm font-bold text-[10px] shadow-xs flex items-center gap-1 uppercase tracking-wider">
                              <span>Out of Stock</span>
                            </span>
                          ) : (
                            <span className="bg-emerald-100/95 text-emerald-800 border border-emerald-200 backdrop-blur-xs px-2.5 py-1 rounded-sm font-bold text-[10px] shadow-xs flex items-center gap-1 uppercase tracking-wider">
                              <span>In Stock</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        <h2
                          onClick={() => onSelectProduct(product)}
                          className="font-title-lg text-lg font-bold text-[#000d22] mb-2 cursor-pointer hover:text-[#775a19] transition-colors"
                        >
                          {product.name}
                        </h2>
                        <p className="font-body-md text-xs text-[#43474e] mb-6 flex-grow line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex gap-2">
                          <button
                            onClick={() => onSelectProduct(product)}
                            className="flex-1 bg-[#f0eded] hover:bg-[#000d22] text-[#000d22] hover:text-white font-bold text-xs py-3 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer border border-[#c4c6cf]"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>{lang === 'EN' ? 'Specs' : 'विवरण'}</span>
                          </button>
                          <button
                            onClick={() => onOpenQuoteModal(product.name)}
                            className="flex-1 bg-[#775a19] hover:bg-[#000d22] text-white font-bold text-xs py-3 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{t.inquireNow}</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {visibleCount < filteredProducts.length && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 4)}
                    className="bg-white text-[#000d22] border-2 border-[#000d22] hover:bg-[#000d22] hover:text-white font-bold text-sm px-8 py-3 rounded-lg transition-colors cursor-pointer"
                  >
                    {t.loadMoreProducts}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

      {/* Interactive 3D Flipbook Modal */}
      <FlipbookViewer
        isOpen={activeFlipbook.isOpen}
        onClose={() =>
          setActiveFlipbook((prev) => ({ ...prev, isOpen: false }))
        }
        pdfUrl={activeFlipbook.pdfUrl}
        title={activeFlipbook.title}
        brandName={activeFlipbook.brandName}
        onOpenQuoteModal={onOpenQuoteModal}
      />
    </div>
  );
};

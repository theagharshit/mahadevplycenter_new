import React, { useState, useEffect } from 'react';
import { Language, LaminateBrand } from '../types';
import { FlipbookViewer } from '../components/FlipbookViewer';
import {
  BookOpen,
  FileText,
  Phone,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Download,
  Search,
  Filter,
  Layers,
  Award,
  Grid,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface LaminatesViewProps {
  lang: Language;
  onOpenQuoteModal: (brandName?: string) => void;
  initialBrandSlug?: string;
}

export const LaminatesView: React.FC<LaminatesViewProps> = ({
  lang,
  onOpenQuoteModal,
  initialBrandSlug,
}) => {
  const [brands, setBrands] = useState<LaminateBrand[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Brand for Detail View
  const [selectedBrand, setSelectedBrand] = useState<LaminateBrand | null>(null);

  // Flipbook Viewer Modal state
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

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFinish, setSelectedFinish] = useState<string>('All');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/public/data');
        const data = await res.json();
        const activeBrands = (data.laminateBrands || []).filter((b: LaminateBrand) => b.active !== false);
        setBrands(activeBrands);

        if (initialBrandSlug) {
          const initLower = initialBrandSlug.toLowerCase();
          const match = activeBrands.find(
            (b: LaminateBrand) => (b.slug || '').toLowerCase() === initLower || b.id === initialBrandSlug
          );
          if (match) setSelectedBrand(match);
        }
      } catch (err) {
        console.error('Failed fetching laminate brands:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [initialBrandSlug]);

  // Extract all unique finish types for filtering
  const allFinishes = Array.from(
    new Set(brands.flatMap((b) => b.availableFinishes || []))
  ).filter(Boolean);

  const filteredBrands = brands.filter((b) => {
    const sq = (searchQuery || '').toLowerCase();
    const nameMatch = (b.name || '').toLowerCase().includes(sq);
    const descMatch = (b.shortDescription || '').toLowerCase().includes(sq);
    const finishMatch = Boolean(
      b.availableFinishes && b.availableFinishes.some((f) => (f || '').toLowerCase().includes(sq))
    );
    const matchesSearch = nameMatch || descMatch || finishMatch;

    const matchesFinish =
      selectedFinish === 'All' || (b.availableFinishes && b.availableFinishes.includes(selectedFinish));

    return matchesSearch && matchesFinish;
  });

  const handleOpenCatalogue = (brand: LaminateBrand) => {
    setActiveFlipbook({
      isOpen: true,
      pdfUrl: brand.pdfUrl,
      title: `${brand.name} Interactive Catalogue`,
      brandName: brand.name,
    });
  };

  return (
    <div className="w-full bg-[#fcf9f8] min-h-screen pb-20">
      {/* Brand Detail Sub-View */}
      {selectedBrand ? (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 animate-fadeIn">
          {/* Back Button */}
          <button
            onClick={() => {
              setSelectedBrand(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#000d22] bg-white border border-zinc-200 hover:border-[#000d22] px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Laminates Brands</span>
          </button>

          {/* Hero Banner Section */}
          <div className="relative rounded-3xl overflow-hidden bg-[#000d22] text-white p-8 lg:p-12 shadow-2xl border border-zinc-800 mb-10">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
              style={{
                backgroundImage: `url(${selectedBrand.bannerImage || selectedBrand.coverImage})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#000d22] via-[#000d22]/90 to-transparent" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2b800]/20 border border-[#f2b800]/40 text-[#f2b800] text-xs font-bold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Authorized Distributor Collection</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                  {selectedBrand.name}
                </h1>

                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  {selectedBrand.description}
                </p>

                {/* Technical Badges */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {selectedBrand.thickness && (
                    <span className="bg-zinc-800/80 text-zinc-200 border border-zinc-700 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#f2b800]" />
                      Thickness: {selectedBrand.thickness}
                    </span>
                  )}
                  {selectedBrand.warranty && (
                    <span className="bg-zinc-800/80 text-zinc-200 border border-zinc-700 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      {selectedBrand.warranty}
                    </span>
                  )}
                </div>
              </div>

              {/* Main Interactive Flipbook Callout Card */}
              <div className="bg-gradient-to-b from-zinc-800/90 to-zinc-900/90 p-6 rounded-2xl border border-zinc-700/80 shadow-2xl text-center space-y-4">
                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-zinc-700 shadow-inner group cursor-pointer" onClick={() => handleOpenCatalogue(selectedBrand)}>
                  <img
                    src={selectedBrand.coverImage}
                    alt={selectedBrand.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="bg-[#f2b800] text-[#000d22] font-black text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce">
                      <BookOpen className="w-4 h-4" />
                      <span>Flipbook Preview</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenCatalogue(selectedBrand)}
                  className="w-full bg-[#f2b800] hover:bg-amber-400 text-[#000d22] font-extrabold py-3.5 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>View Interactive Catalogue</span>
                </button>

                {selectedBrand.pdfUrl && (
                  <a
                    href={selectedBrand.pdfUrl}
                    download
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs border border-zinc-700"
                  >
                    <Download className="w-4 h-4 text-[#f2b800]" />
                    <span>Download PDF File</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Grid Layout: Finishes, Collections, Applications & Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Available Finishes */}
            <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 text-[#000d22] border-b border-zinc-100 pb-3">
                <Sparkles className="w-5 h-5 text-[#f2b800]" />
                <h3 className="font-extrabold text-lg">Available Finishes</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedBrand.availableFinishes?.map((finish, i) => (
                  <span
                    key={i}
                    className="bg-amber-50 text-amber-900 border border-amber-200/80 px-3 py-1 rounded-lg text-xs font-bold"
                  >
                    {finish}
                  </span>
                ))}
              </div>
            </div>

            {/* Available Collections */}
            {selectedBrand.availableCollections && selectedBrand.availableCollections.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 text-[#000d22] border-b border-zinc-100 pb-3">
                  <Grid className="w-5 h-5 text-[#f2b800]" />
                  <h3 className="font-extrabold text-lg">Featured Collections</h3>
                </div>
                <ul className="space-y-2">
                  {selectedBrand.availableCollections.map((col, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                      <ChevronRight className="w-3.5 h-3.5 text-[#f2b800]" />
                      <span>{col}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Applications */}
            {selectedBrand.applications && selectedBrand.applications.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 text-[#000d22] border-b border-zinc-100 pb-3">
                  <Layers className="w-5 h-5 text-[#f2b800]" />
                  <h3 className="font-extrabold text-lg">Ideal Applications</h3>
                </div>
                <ul className="space-y-2">
                  {selectedBrand.applications.map((app, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Benefits Section */}
          {selectedBrand.benefits && selectedBrand.benefits.length > 0 && (
            <div className="bg-gradient-to-r from-zinc-900 to-[#000d22] text-white p-8 rounded-3xl mb-12 shadow-xl border border-zinc-800">
              <h3 className="text-xl font-extrabold text-[#f2b800] mb-6 flex items-center gap-2">
                <Award className="w-6 h-6" />
                <span>Why Choose {selectedBrand.name} at Mahadev Ply Center</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedBrand.benefits.map((benefit, i) => (
                  <div key={i} className="bg-zinc-800/60 p-4 rounded-xl border border-zinc-700/60 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-zinc-200 leading-snug">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Swatch Gallery (if featured designs exist) */}
          {selectedBrand.featuredDesigns && selectedBrand.featuredDesigns.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-extrabold text-zinc-900 mb-6 flex items-center gap-2">
                <Grid className="w-5 h-5 text-[#775a19]" />
                <span>Featured Swatches & Texture Samples</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {selectedBrand.featuredDesigns.map((design) => (
                  <div key={design.id} className="bg-white rounded-2xl overflow-hidden border border-zinc-200/80 shadow-sm hover:shadow-md transition-all group">
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={design.image}
                        alt={design.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                        {design.finish}
                      </span>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-sm text-zinc-900">{design.name}</h4>
                      <button
                        onClick={() => onOpenQuoteModal(`${selectedBrand.name} - ${design.name}`)}
                        className="mt-3 w-full bg-zinc-100 hover:bg-[#000d22] text-zinc-800 hover:text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Inquire This Swatch</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lead Capture Sticky Bar */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xl text-center max-w-3xl mx-auto space-y-4">
            <h3 className="text-xl font-extrabold text-[#000d22]">Ready to Order or Request Swatches?</h3>
            <p className="text-xs sm:text-sm text-zinc-600">
              Get direct contractor rates, verify stock availability, or request physical catalogue books sent to your site in Lalitpur & Kathmandu.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onOpenQuoteModal(selectedBrand.name)}
                className="bg-[#000d22] hover:bg-[#775a19] text-white font-extrabold px-6 py-3 rounded-xl transition-all shadow-md text-xs sm:text-sm cursor-pointer flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-[#f2b800]" />
                <span>Request Price Quote</span>
              </button>
              <a
                href="tel:+977015400921"
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold px-5 py-3 rounded-xl transition-colors text-xs sm:text-sm flex items-center gap-2 border border-zinc-200"
              >
                <Phone className="w-4 h-4 text-[#775a19]" />
                <span>Call Showroom</span>
              </a>
              <a
                href="https://wa.me/9779766383188"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-5 py-3 rounded-xl transition-colors text-xs sm:text-sm flex items-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* Main Laminates Showcase Landing Page */
        <div>
          {/* Main Hero Header */}
          <div className="bg-[#000d22] text-white relative overflow-hidden py-16 lg:py-20 px-4 sm:px-6 border-b border-zinc-800">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f2b800_1px,transparent_1px)] [background-size:16px_16px]" />
            
            <div className="max-w-[1200px] mx-auto relative z-10 space-y-4 text-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2b800]/20 border border-[#f2b800]/40 text-[#f2b800] text-xs font-bold tracking-wider uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Official Authorized Distributor</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
                Laminates (Formica) Showcase
              </h1>

              <p className="text-zinc-300 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
                Explore Nepal's most comprehensive collection of high-pressure decorative laminates, 100% pure phenolic decor surfaces, anti-bacterial sheets, and interactive 3D PDF catalogues.
              </p>

              {/* Quick Jump Brand Pills */}
              <div className="pt-6 flex flex-wrap justify-center items-center gap-2 max-w-3xl mx-auto">
                <span className="text-xs font-bold text-zinc-400 uppercase mr-1">Brands:</span>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBrand(b);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-zinc-800/80 hover:bg-[#f2b800] hover:text-[#000d22] text-zinc-200 border border-zinc-700/80 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer"
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              {/* Search Box */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search brand, finish, texture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-[#000d22]"
                />
              </div>

              {/* Finish Filters */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                <span className="text-xs font-bold text-zinc-400 uppercase shrink-0 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Finish:
                </span>
                <button
                  onClick={() => setSelectedFinish('All')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                    selectedFinish === 'All'
                      ? 'bg-[#000d22] text-white'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  All Finishes
                </button>
                {allFinishes.slice(0, 6).map((finish) => (
                  <button
                    key={finish}
                    onClick={() => setSelectedFinish(finish)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                      selectedFinish === finish
                        ? 'bg-[#000d22] text-white'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    {finish}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Cards Grid */}
            {loading ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-4 border-[#000d22] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-semibold text-zinc-500">Loading Laminate Catalogue Brands...</p>
              </div>
            ) : filteredBrands.length === 0 ? (
              <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center max-w-md mx-auto my-12">
                <Search className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                <h3 className="font-bold text-base text-zinc-800">No laminate brands found</h3>
                <p className="text-xs text-zinc-500 mt-1">Try resetting your search filter or query.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFinish('All');
                  }}
                  className="mt-4 bg-[#000d22] text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBrands.map((brand) => (
                  <div
                    key={brand.id}
                    className="bg-white rounded-3xl border border-zinc-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Cover Header */}
                      <div className="relative h-48 overflow-hidden bg-zinc-900">
                        <img
                          src={brand.coverImage}
                          alt={brand.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Top Badge */}
                        {brand.isFeatured && (
                          <span className="absolute top-3 right-3 bg-[#f2b800] text-[#000d22] text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Featured Brand
                          </span>
                        )}

                        {/* Brand Name on Cover */}
                        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                          <h2 className="text-xl font-black text-white drop-shadow-md">{brand.name}</h2>
                          {brand.pdfUrl && (
                            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/30 flex items-center gap-1">
                              <BookOpen className="w-3 h-3 text-[#f2b800]" /> 3D Flipbook
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-6 space-y-4">
                        <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                          {brand.shortDescription}
                        </p>

                        {/* Available Finishes Pills */}
                        <div>
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                            Available Finishes
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {brand.availableFinishes?.slice(0, 4).map((finish, i) => (
                              <span
                                key={i}
                                className="bg-zinc-100 text-zinc-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-zinc-200/80"
                              >
                                {finish}
                              </span>
                            ))}
                            {brand.availableFinishes && brand.availableFinishes.length > 4 && (
                              <span className="text-[11px] font-semibold text-zinc-500 self-center">
                                +{brand.availableFinishes.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 pt-0 space-y-2 border-t border-zinc-100">
                      {/* Primary CTA: View Catalogue */}
                      <button
                        onClick={() => handleOpenCatalogue(brand)}
                        className="w-full bg-[#000d22] hover:bg-[#775a19] text-white font-extrabold py-3 px-4 rounded-xl transition-all shadow-md text-xs cursor-pointer flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                      >
                        <BookOpen className="w-4 h-4 text-[#f2b800]" />
                        <span>View Interactive Catalogue</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => {
                            setSelectedBrand(brand);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold py-2 px-3 rounded-lg text-xs transition-colors cursor-pointer text-center"
                        >
                          Brand Info
                        </button>

                        <button
                          onClick={() => onOpenQuoteModal(brand.name)}
                          className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold py-2 px-3 rounded-lg text-xs transition-colors cursor-pointer text-center"
                        >
                          Request Quote
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive PDF Flipbook Viewer Modal */}
      <FlipbookViewer
        isOpen={activeFlipbook.isOpen}
        pdfUrl={activeFlipbook.pdfUrl}
        title={activeFlipbook.title}
        brandName={activeFlipbook.brandName}
        onClose={() =>
          setActiveFlipbook((prev) => ({ ...prev, isOpen: false }))
        }
        onOpenQuoteModal={onOpenQuoteModal}
      />
    </div>
  );
};

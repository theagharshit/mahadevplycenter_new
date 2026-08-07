import React, { useState } from 'react';
import {
  FileText,
  Upload,
  BookOpen,
  CheckCircle,
  XCircle,
  Trash2,
  ExternalLink,
  FileUp,
  Layers,
  Search,
  Check,
  X,
  Plus,
  Edit2,
  Loader2,
} from 'lucide-react';
import { CMSData, cmsApi } from '../../lib/cmsApi';
import { LaminateBrand } from '../../types';

interface CataloguePDFsManagerProps {
  data: CMSData;
  onRefreshData: () => void;
  onShowToast: (msg: string) => void;
}

export const CataloguePDFsManager: React.FC<CataloguePDFsManagerProps> = ({
  data,
  onRefreshData,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'brands'>('categories');
  const [searchQuery, setSearchQuery] = useState('');

  // Category PDF upload state
  const [selectedFileForCat, setSelectedFileForCat] = useState<Record<string, File | null>>({});
  const [customUrlForCat, setCustomUrlForCat] = useState<Record<string, string>>({});
  const [uploadingCat, setUploadingCat] = useState<string | null>(null);
  const [deletingCatPdf, setDeletingCatPdf] = useState<string | null>(null);

  // Brand PDF upload state
  const [selectedFileForBrand, setSelectedFileForBrand] = useState<Record<string, File | null>>({});
  const [uploadingBrandPdf, setUploadingBrandPdf] = useState<string | null>(null);

  const categoriesList =
    data.categories && data.categories.length > 0
      ? data.categories
      : [
          'Plywood',
          'Hardware',
          'Veneers',
          'Laminates',
          'Locks & Security',
          'MDF & Particle Board',
        ];

  const findCategoryCatalogue = (cat: string) => {
    if (!data.categoryCatalogues || data.categoryCatalogues.length === 0) return undefined;
    const lower = cat.toLowerCase();
    return data.categoryCatalogues.find(
      (c) =>
        c.category.toLowerCase() === lower ||
        (lower.includes('laminate') && c.category.toLowerCase().includes('laminate')) ||
        (lower.includes('plywood') && c.category.toLowerCase().includes('plywood'))
    );
  };

  // --- Category Upload Handlers ---
  const handleFileChangeForCat = (cat: string, file: File | null) => {
    setSelectedFileForCat((prev) => ({ ...prev, [cat]: file }));
  };

  const handleUploadCategoryPdf = async (cat: string) => {
    const file = selectedFileForCat[cat];
    const url = customUrlForCat[cat];

    if (!file && (!url || !url.trim())) {
      alert('Please select a PDF file or enter a valid PDF URL.');
      return;
    }

    setUploadingCat(cat);
    try {
      await cmsApi.uploadCategoryCatalogue(cat, file || undefined, url ? url.trim() : undefined);
      onShowToast(`PDF Catalogue saved successfully for "${cat}"!`);
      setSelectedFileForCat((prev) => ({ ...prev, [cat]: null }));
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to upload category PDF catalogue.');
    } finally {
      setUploadingCat(null);
    }
  };

  const handleRemoveCategoryPdf = async (cat: string) => {
    if (
      !confirm(
        `Are you sure you want to remove the PDF catalogue for "${cat}"?\n\nThe 3D flipbook viewer for this category will be updated.`
      )
    ) {
      return;
    }

    setDeletingCatPdf(cat);
    try {
      await cmsApi.removeCategoryCatalogue(cat);
      onShowToast(`PDF Catalogue removed for "${cat}".`);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to remove category catalogue.');
    } finally {
      setDeletingCatPdf(null);
    }
  };

  // --- Brand Upload Handlers ---
  const handleBrandPdfUpload = async (brand: LaminateBrand, file: File) => {
    setUploadingBrandPdf(brand.id);
    try {
      const res = await cmsApi.uploadMedia(file);
      if (res && res.media && res.media.url) {
        await cmsApi.updateLaminateBrand(brand.id, {
          ...brand,
          pdfUrl: res.media.url,
        });
        onShowToast(`Uploaded PDF catalogue for ${brand.name}!`);
        onRefreshData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to upload brand PDF.');
    } finally {
      setUploadingBrandPdf(null);
    }
  };

  const filteredCategories = categoriesList.filter((c) =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBrands = (data.laminateBrands || []).filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#000d22] via-[#0b2240] to-[#102445] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-[#c4c6cf]/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#f2b800]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#f2b800] text-[#000d22] text-[10px] font-black uppercase tracking-wider">
                Digital Catalogue Manager
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Category & Brand PDF Catalogues
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-2xl leading-relaxed">
              Upload official PDF catalogues for product categories and laminate brands. Active PDF files power the interactive 3D flipbook swatch viewer across the website.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shrink-0">
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'categories'
                  ? 'bg-[#f2b800] text-[#000d22] shadow-sm font-black'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Category Catalogues</span>
            </button>
            <button
              onClick={() => setActiveTab('brands')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'brands'
                  ? 'bg-[#f2b800] text-[#000d22] shadow-sm font-black'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Laminate Brands</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder={activeTab === 'categories' ? 'Search categories...' : 'Search brand catalogues...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-[#000d22] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-3 text-xs font-bold text-zinc-600">
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>
              {activeTab === 'categories'
                ? `${
                    categoriesList.filter((cat) => {
                      const c = findCategoryCatalogue(cat);
                      return Boolean(c && c.pdfUrl);
                    }).length
                  } / ${categoriesList.length} Categories Active`
                : `${
                    (data.laminateBrands || []).filter((b) => Boolean(b.pdfUrl)).length
                  } / ${(data.laminateBrands || []).length} Brands Active`}
            </span>
          </div>
        </div>
      </div>

      {/* TAB 1: Category PDF Catalogues */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCategories.map((cat) => {
            const catCat = findCategoryCatalogue(cat);
            const hasPdf = Boolean(catCat && catCat.pdfUrl && catCat.pdfUrl.trim() !== '');
            const selectedFile = selectedFileForCat[cat];
            const isUploading = uploadingCat === cat;

            return (
              <div
                key={cat}
                className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#775a19] bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 inline-block mb-2">
                      Category Catalogue
                    </span>
                    <h3 className="text-xl font-black text-zinc-900">{cat}</h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      {hasPdf
                        ? 'Active PDF attached. Shows 3D Interactive Flipbook on website.'
                        : 'No PDF attached yet. Upload a PDF file or paste a PDF link below.'}
                    </p>
                  </div>

                  {hasPdf ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold flex items-center gap-1.5 shrink-0 shadow-2xs">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      PDF Active
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-500 border border-zinc-200 text-xs font-bold flex items-center gap-1.5 shrink-0">
                      <XCircle className="w-3.5 h-3.5 text-zinc-400" />
                      Missing PDF
                    </span>
                  )}
                </div>

                {/* Current Active PDF Info */}
                {hasPdf && (
                  <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-700 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-[#775a19]" />
                        <span>Current Catalogue File:</span>
                      </span>
                      <a
                        href={catCat!.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#775a19] hover:underline font-extrabold flex items-center gap-1 text-[11px]"
                      >
                        <span>Preview PDF</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <p className="text-[11px] font-mono text-zinc-500 break-all bg-white p-2 rounded-xl border border-zinc-200">
                      {catCat!.pdfUrl}
                    </p>
                  </div>
                )}

                {/* Upload or Custom Link Input Box */}
                <div className="pt-2 border-t border-zinc-100 space-y-3">
                  <span className="text-xs font-extrabold text-zinc-700 block">
                    Upload New PDF File or Set PDF Link:
                  </span>

                  {/* File Selection Box */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <label
                      htmlFor={`pdf-file-${cat.replace(/\s+/g, '-')}`}
                      className="flex-1 bg-zinc-50 hover:bg-zinc-100 border border-dashed border-zinc-300 hover:border-[#000d22] rounded-xl p-3 text-xs font-bold text-zinc-700 cursor-pointer transition-all flex items-center justify-center gap-2 text-center"
                    >
                      <Upload className="w-4 h-4 text-[#775a19]" />
                      <span className="truncate">
                        {selectedFile ? selectedFile.name : 'Choose PDF File from Computer'}
                      </span>
                    </label>
                    <input
                      id={`pdf-file-${cat.replace(/\s+/g, '-')}`}
                      type="file"
                      accept="application/pdf,.pdf"
                      className="hidden"
                      onChange={(e) => handleFileChangeForCat(cat, e.target.files?.[0] || null)}
                    />

                    {selectedFile && (
                      <button
                        type="button"
                        onClick={() => handleFileChangeForCat(cat, null)}
                        className="p-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                        title="Clear file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Manual URL Input Option */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Or enter direct PDF URL (e.g. /catalogues/centurylaminates.pdf)"
                      value={customUrlForCat[cat] || ''}
                      onChange={(e) =>
                        setCustomUrlForCat((prev) => ({ ...prev, [cat]: e.target.value }))
                      }
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#000d22]"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    {hasPdf ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveCategoryPdf(cat)}
                        disabled={deletingCatPdf === cat}
                        className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-rose-200 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{deletingCatPdf === cat ? 'Removing...' : 'Remove PDF'}</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    <button
                      type="button"
                      onClick={() => handleUploadCategoryPdf(cat)}
                      disabled={isUploading}
                      className="px-5 py-2.5 rounded-xl bg-[#000d22] hover:bg-[#0b2240] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50 ml-auto"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#f2b800]" />
                          <span>Uploading PDF...</span>
                        </>
                      ) : (
                        <>
                          <FileUp className="w-4 h-4 text-[#f2b800]" />
                          <span>Save PDF Catalogue</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Laminate Brand Catalogues */}
      {activeTab === 'brands' && (
        <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">Laminate & Hardware Brand Catalogues</h3>
              <p className="text-xs text-zinc-500">
                Manage official brand PDF swatches and digital flipbooks for Century, Greenlam, Merino, FutureLam, etc.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrands.map((brand) => (
              <div
                key={brand.id}
                className="bg-zinc-50/70 border border-zinc-200/90 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:bg-zinc-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={brand.coverImage}
                    alt={brand.name}
                    className="w-12 h-10 object-cover rounded-lg border border-zinc-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900">{brand.name}</h4>
                    <p className="text-[11px] text-zinc-500 line-clamp-1">{brand.shortDescription}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-zinc-700 block">Catalogue Status:</span>
                  {brand.pdfUrl ? (
                    <div className="flex items-center justify-between bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800">
                      <span className="truncate max-w-[140px] font-mono text-[11px] text-emerald-900">
                        {brand.pdfUrl}
                      </span>
                      <a
                        href={brand.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:underline flex items-center gap-1 text-[11px] font-extrabold shrink-0"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-xs font-bold text-amber-800 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>No PDF Catalogue attached</span>
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div className="pt-2 border-t border-zinc-200/80 flex items-center gap-2">
                  <label
                    htmlFor={`brand-pdf-${brand.id}`}
                    className="flex-1 bg-[#000d22] hover:bg-[#0b2240] text-white font-bold text-xs py-2.5 px-3 rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    {uploadingBrandPdf === brand.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#f2b800]" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-[#f2b800]" />
                        <span>{brand.pdfUrl ? 'Replace Brand PDF' : 'Upload Brand PDF'}</span>
                      </>
                    )}
                  </label>
                  <input
                    id={`brand-pdf-${brand.id}`}
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleBrandPdfUpload(brand, file);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Upload,
  Trash2,
  ExternalLink,
  Search,
  Plus,
  FileText,
  Check,
  Edit2,
  AlertCircle,
  Eye,
  CheckCircle2,
  X,
  FileUp,
  Sparkles,
  Layers,
} from 'lucide-react';
import { CategoryCatalogue } from '../../types';
import { authFetch } from '../../utils/api';
import { FlipbookViewer } from '../FlipbookViewer';

export const CataloguesManager: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [catalogues, setCatalogues] = useState<CategoryCatalogue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'missing'>('all');
  const [uploadingForCategory, setUploadingForCategory] = useState<string | null>(null);

  // Modal State for Edit / Add Catalogue
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    category: string;
    title: string;
    brandName: string;
    description: string;
    pdfUrl: string;
    fileSize: string;
  }>({
    category: '',
    title: '',
    brandName: '',
    description: '',
    pdfUrl: '',
    fileSize: '',
  });
  const [modalUploading, setModalUploading] = useState(false);

  // Flipbook Preview Modal State
  const [previewFlipbook, setPreviewFlipbook] = useState<{
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

  const fetchCataloguesData = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/admin/catalogues');
      const data = await res.json();
      setCategories(data.categories || []);
      setCatalogues(data.categoryCatalogues || []);
    } catch (err) {
      console.error('Failed loading category catalogues:', err);
      // Fallback fetch from public data if admin endpoint fails
      try {
        const pubRes = await fetch('/api/public/data');
        const pubData = await pubRes.json();
        setCategories(pubData.categories || []);
        setCatalogues(pubData.categoryCatalogues || []);
      } catch (e) {
        console.error('Fallback fetch error:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCataloguesData();
  }, []);

  // Handle direct 1-click PDF upload for a specific category
  const handleDirectPdfUpload = async (categoryName: string, file: File) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a valid PDF file.');
      return;
    }

    try {
      setUploadingForCategory(categoryName);
      const formData = new FormData();
      formData.append('file', file);

      // Upload file to media server
      const uploadRes = await authFetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || 'PDF upload failed.');

      const uploadedUrl = uploadData.media.url;
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const formattedSize = `${sizeMb} MB PDF`;

      // Existing entry or defaults
      const existing = (catalogues || []).find((c) => (c?.category || '').toLowerCase() === (categoryName || '').toLowerCase());

      const payload = {
        category: categoryName,
        pdfUrl: uploadedUrl,
        title: existing?.title || `${categoryName} Swatch & Technical Catalogue`,
        brandName: existing?.brandName || `${categoryName} Official Partner Brands`,
        description: existing?.description || `Official PDF catalogue & swatch book for ${categoryName}.`,
        fileSize: formattedSize,
      };

      const saveRes = await authFetch('/api/admin/catalogues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData.error || 'Failed saving catalogue assignment.');

      await fetchCataloguesData();
      alert(`PDF Catalogue successfully attached to category "${categoryName}"!`);
    } catch (err: any) {
      alert(`Error uploading catalogue: ${err.message}`);
    } finally {
      setUploadingForCategory(null);
    }
  };

  // Handle Modal PDF upload
  const handleModalPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setModalUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await authFetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || 'PDF upload failed.');

      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setEditingItem((prev) => ({
        ...prev,
        pdfUrl: uploadData.media.url,
        fileSize: `${sizeMb} MB PDF`,
      }));
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setModalUploading(false);
    }
  };

  // Handle Save from Modal
  const handleSaveCatalogue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem.category.trim()) {
      alert('Please select or specify a product category.');
      return;
    }

    try {
      const res = await authFetch('/api/admin/catalogues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed saving catalogue.');

      setIsModalOpen(false);
      await fetchCataloguesData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Handle Delete / Clear Catalogue
  const handleDeleteCatalogue = async (categoryName: string) => {
    if (!confirm(`Are you sure you want to remove the PDF catalogue for "${categoryName}"?`)) return;

    try {
      const res = await authFetch(`/api/admin/catalogues/${encodeURIComponent(categoryName)}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to remove catalogue.');
      await fetchCataloguesData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Open Edit Modal for a Category
  const openEditModal = (catName: string) => {
    const existing = (catalogues || []).find((c) => (c?.category || '').toLowerCase() === (catName || '').toLowerCase());
    if (existing) {
      setEditingItem({
        category: existing.category || catName,
        title: existing.title || `${catName} Swatch Catalogue`,
        brandName: existing.brandName || `${catName} Official Brands`,
        description: existing.description || `Official PDF catalogue for ${catName}.`,
        pdfUrl: existing.pdfUrl || '',
        fileSize: existing.fileSize || 'PDF Book',
      });
    } else {
      setEditingItem({
        category: catName,
        title: `${catName} Swatch & Technical Catalogue`,
        brandName: `${catName} Partner Brands`,
        description: `Official PDF catalogue & product specifications for ${catName}.`,
        pdfUrl: '',
        fileSize: 'PDF Book',
      });
    }
    setIsModalOpen(true);
  };

  // Combine categories list and mapped catalogue items
  const combinedCategoryList = Array.from(
    new Set([...(categories || []), ...(catalogues || []).map((c) => c?.category)])
  ).filter(Boolean);

  const filteredCategories = combinedCategoryList.filter((catName) => {
    const catalogue = (catalogues || []).find((c) => (c?.category || '').toLowerCase() === (catName || '').toLowerCase());
    const hasPdf = Boolean(catalogue?.pdfUrl && catalogue.pdfUrl.trim() !== '');

    const st = (searchTerm || '').toLowerCase();
    const matchesSearch =
      (catName || '').toLowerCase().includes(st) ||
      Boolean(catalogue?.title && catalogue.title.toLowerCase().includes(st)) ||
      Boolean(catalogue?.brandName && catalogue.brandName.toLowerCase().includes(st));

    if (!matchesSearch) return false;

    if (statusFilter === 'active') return hasPdf;
    if (statusFilter === 'missing') return !hasPdf;

    return true;
  });

  const activeCount = combinedCategoryList.filter((c) => {
    const cat = (catalogues || []).find((item) => (item?.category || '').toLowerCase() === (c || '').toLowerCase());
    return Boolean(cat?.pdfUrl && cat.pdfUrl.trim() !== '');
  }).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/90 p-6 rounded-2xl border border-slate-700/80 shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-amber-400" />
            Product Category PDF Catalogues
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Upload and manage official PDF swatch books and technical catalogues for every product category. Attached PDFs are instantly accessible on the public website with interactive 3D flipbook viewing.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem({
              category: '',
              title: '',
              brandName: '',
              description: '',
              pdfUrl: '',
              fileSize: 'PDF Book',
            });
            setIsModalOpen(true);
          }}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Category Catalogue</span>
        </button>
      </div>

      {/* Analytics Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Categories</p>
            <p className="text-2xl font-black text-white mt-0.5">{combinedCategoryList.length}</p>
          </div>
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">PDF Catalogues Active</p>
            <p className="text-2xl font-black text-emerald-400 mt-0.5">{activeCount}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Missing Catalogues</p>
            <p className="text-2xl font-black text-amber-400 mt-0.5">{combinedCategoryList.length - activeCount}</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search category, brand, title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700 text-white text-xs pl-9 pr-3 py-2.5 rounded-lg outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 text-white text-xs p-2.5 rounded-lg outline-none focus:border-amber-500 font-medium"
          >
            <option value="all">All Product Categories ({combinedCategoryList.length})</option>
            <option value="active">Active PDF Catalogues ({activeCount})</option>
            <option value="missing">Missing PDF Catalogues ({combinedCategoryList.length - activeCount})</option>
          </select>
        </div>
      </div>

      {/* Category Catalogues Grid */}
      {loading ? (
        <div className="text-center py-12 bg-slate-800/50 rounded-2xl border border-slate-700">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-xs font-medium">Loading category catalogues...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 rounded-2xl border border-slate-700 space-y-3">
          <FileText className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-white font-bold text-sm">No product categories match your filter</h3>
          <p className="text-slate-400 text-xs">Try clearing your search term or select "All Product Categories".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((catName) => {
            const catalogue = (catalogues || []).find((c) => (c?.category || '').toLowerCase() === (catName || '').toLowerCase());
            const hasPdf = Boolean(catalogue?.pdfUrl && catalogue.pdfUrl.trim() !== '');
            const isUploadingThis = uploadingForCategory === catName;

            return (
              <div
                key={catName}
                className={`bg-slate-800/80 border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-sm relative overflow-hidden ${
                  hasPdf
                    ? 'border-slate-700 hover:border-emerald-500/50'
                    : 'border-slate-700/80 hover:border-amber-500/50'
                }`}
              >
                <div>
                  {/* Top Header & Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                        Category
                      </span>
                      <h3 className="text-lg font-bold text-white leading-snug">{catName}</h3>
                    </div>

                    {hasPdf ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0">
                        <CheckCircle2 className="w-3 h-3" /> PDF Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0">
                        <AlertCircle className="w-3 h-3" /> No Catalogue
                      </span>
                    )}
                  </div>

                  {/* Details Card Content */}
                  {hasPdf ? (
                    <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/50 text-xs mb-4">
                      <div className="flex items-center gap-2 text-white font-semibold">
                        <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="truncate">{catalogue?.title || `${catName} Swatch Catalogue`}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] line-clamp-2">{catalogue?.description}</p>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="text-amber-400 font-medium truncate max-w-[140px]">
                          {catalogue?.brandName || 'Authorized Brand'}
                        </span>
                        <span className="text-slate-400 font-mono">{catalogue?.fileSize || 'PDF Book'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-900/40 border border-dashed border-slate-700 p-4 rounded-xl text-center space-y-2 mb-4">
                      <p className="text-slate-400 text-xs">No PDF swatch book attached for this category.</p>
                      <p className="text-[11px] text-slate-500">
                        Upload a PDF to enable interactive 3D catalogue viewing on the public website.
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-slate-700/80 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {/* Quick Direct Upload Input */}
                    <label
                      className={`flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold py-2 px-3 rounded-lg border border-slate-600 transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        isUploadingThis ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      {isUploadingThis ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5 text-amber-400" />
                          <span>{hasPdf ? 'Replace PDF' : 'Upload PDF'}</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="application/pdf"
                        disabled={isUploadingThis}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleDirectPdfUpload(catName, file);
                        }}
                        className="hidden"
                      />
                    </label>

                    {/* Edit Metadata Modal Trigger */}
                    <button
                      onClick={() => openEditModal(catName)}
                      className="bg-slate-700 hover:bg-slate-600 text-white text-xs p-2 rounded-lg border border-slate-600 transition cursor-pointer"
                      title="Edit Title & Brand Metadata"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Catalogue */}
                    {hasPdf && (
                      <button
                        onClick={() => handleDeleteCatalogue(catName)}
                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs p-2 rounded-lg transition cursor-pointer"
                        title="Remove PDF Catalogue"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Preview Buttons */}
                  {hasPdf && catalogue?.pdfUrl && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() =>
                          setPreviewFlipbook({
                            isOpen: true,
                            pdfUrl: catalogue.pdfUrl,
                            title: catalogue.title || `${catName} Catalogue`,
                            brandName: catalogue.brandName || 'Mahadev Authorized Distributor',
                          })
                        }
                        className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold py-1.5 px-3 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" /> Test 3D Flipbook
                      </button>

                      <a
                        href={catalogue.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg border border-slate-600 transition flex items-center gap-1"
                        title="Open PDF in New Window"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT / ADD CATALOGUE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                Configure PDF Catalogue for Category
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCatalogue} className="space-y-4">
              {/* Category Input or Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Product Category <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  list="categoryList"
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg text-xs outline-none focus:border-amber-500 font-medium"
                  placeholder="e.g. Plywood, Hardware, Veneers, Laminates..."
                />
                <datalist id="categoryList">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              {/* PDF Upload Dropzone / File Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Upload PDF Swatch File
                </label>
                <div className="bg-slate-800/80 border border-dashed border-slate-700 rounded-xl p-4 text-center">
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg transition">
                    {modalUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                        <span>Uploading PDF...</span>
                      </>
                    ) : (
                      <>
                        <FileUp className="w-4 h-4" />
                        <span>Browse PDF File</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="application/pdf"
                      disabled={modalUploading}
                      onChange={handleModalPdfUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Select official PDF swatch catalogue from your device (Max 50MB).
                  </p>
                </div>
              </div>

              {/* PDF URL Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  PDF File URL
                </label>
                <input
                  type="text"
                  value={editingItem.pdfUrl}
                  onChange={(e) => setEditingItem({ ...editingItem, pdfUrl: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg text-xs outline-none focus:border-amber-500 font-mono"
                  placeholder="/catalogues/plywood_swatch.pdf"
                />
              </div>

              {/* Swatch Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Catalogue Title
                </label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg text-xs outline-none focus:border-amber-500"
                  placeholder="CenturyPly & Greenply Marine Plywood Swatch Book"
                />
              </div>

              {/* Brand Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Brand / Manufacturer Name
                </label>
                <input
                  type="text"
                  value={editingItem.brandName}
                  onChange={(e) => setEditingItem({ ...editingItem, brandName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg text-xs outline-none focus:border-amber-500"
                  placeholder="CenturyPly, Greenply & Mahadev Select"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Catalogue Description
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg text-xs outline-none focus:border-amber-500 resize-none"
                  placeholder="Explore official BWR/BWP Marine grade specification sheets and warranty guidelines."
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalUploading}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Catalogue Settings</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3D Flipbook Test Preview Modal */}
      <FlipbookViewer
        pdfUrl={previewFlipbook.pdfUrl}
        title={previewFlipbook.title}
        brandName={previewFlipbook.brandName}
        isOpen={previewFlipbook.isOpen}
        onClose={() => setPreviewFlipbook({ isOpen: false, pdfUrl: undefined, title: '', brandName: '' })}
      />
    </div>
  );
};

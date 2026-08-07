import React, { useState } from 'react';
import { LaminateBrand } from '../../types';
import { cmsApi } from '../../lib/cmsApi';
import {
  Plus,
  Edit2,
  Trash2,
  FileText,
  Upload,
  Check,
  X,
  BookOpen,
  Sparkles,
  Search,
  Eye,
  EyeOff,
  Layers,
  Star,
  Loader2,
} from 'lucide-react';

interface LaminateBrandsManagerProps {
  brands: LaminateBrand[];
  onRefresh: () => void;
}

export const LaminateBrandsManager: React.FC<LaminateBrandsManagerProps> = ({
  brands,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingBrand, setEditingBrand] = useState<Partial<LaminateBrand> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingBrand({
      name: '',
      slug: '',
      logo: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
      bannerImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600',
      shortDescription: '',
      description: '',
      pdfUrl: '',
      availableFinishes: ['High Gloss', 'Matte', 'Suede'],
      availableCollections: ['Woodgrain', 'Solid Colors'],
      applications: ['Modular Kitchen Shutters', 'Wardrobe Doors'],
      benefits: ['100% Phenolic Core', 'Waterproof', 'Scratch Resistant'],
      thickness: '0.8mm - 1.0mm',
      warranty: '10 Years Manufacturer Warranty',
      displayOrder: brands.length + 1,
      active: true,
      isFeatured: false,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (brand: LaminateBrand) => {
    setEditingBrand({ ...brand });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand || !editingBrand.name) {
      setError('Brand name is required.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (editingBrand.id) {
        await cmsApi.updateLaminateBrand(editingBrand.id, editingBrand);
      } else {
        await cmsApi.createLaminateBrand(editingBrand);
      }

      setIsModalOpen(false);
      setEditingBrand(null);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save laminate brand.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the laminate brand "${name}"?`)) return;

    try {
      await cmsApi.deleteLaminateBrand(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete laminate brand.');
    }
  };

  const handleFileUpload = async (file: File, type: 'pdf' | 'cover') => {
    try {
      if (type === 'pdf') setUploadingPdf(true);
      else setUploadingCover(true);

      const res = await cmsApi.uploadMedia(file);
      if (res && res.media && res.media.url) {
        if (type === 'pdf') {
          setEditingBrand((prev) => ({ ...prev, pdfUrl: res.media.url }));
        } else {
          setEditingBrand((prev) => ({ ...prev, coverImage: res.media.url, bannerImage: res.media.url }));
        }
      }
    } catch (err: any) {
      alert(err.message || 'File upload failed.');
    } finally {
      setUploadingPdf(false);
      setUploadingCover(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#f2b800]" />
            <span>Laminate Brands & PDF Catalogues</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Manage Formica/Laminate brands, flipbook PDF catalogues, finishes, and specs.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#000d22] hover:bg-[#775a19] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#f2b800]" />
          <span>Add New Laminate Brand</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Search brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#000d22]"
        />
      </div>

      {/* Brands Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4">Brand</th>
                <th className="py-3.5 px-4">Status & Order</th>
                <th className="py-3.5 px-4">PDF Catalogue</th>
                <th className="py-3.5 px-4">Finishes</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-400">
                    No laminate brands found. Click "Add New Laminate Brand" to create one.
                  </td>
                </tr>
              ) : (
                filteredBrands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-zinc-50/80 transition-colors">
                    {/* Brand Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={brand.coverImage}
                          alt={brand.name}
                          className="w-12 h-10 object-cover rounded-lg border border-zinc-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-zinc-900 text-sm flex items-center gap-1.5">
                            <span>{brand.name}</span>
                            {brand.isFeatured && (
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" title="Featured Brand" />
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 truncate max-w-xs">{brand.shortDescription}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status & Order */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            brand.active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-zinc-100 text-zinc-600'
                          }`}
                        >
                          {brand.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {brand.active ? 'Active' : 'Hidden'}
                        </span>
                        <div className="text-[11px] font-mono text-zinc-400">Order: {brand.displayOrder}</div>
                      </div>
                    </td>

                    {/* PDF Catalogue */}
                    <td className="py-4 px-4">
                      {brand.pdfUrl ? (
                        <a
                          href={brand.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                          <span>View PDF</span>
                        </a>
                      ) : (
                        <span className="text-zinc-400 italic text-[11px]">No PDF (Coming Soon)</span>
                      )}
                    </td>

                    {/* Finishes */}
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {brand.availableFinishes?.slice(0, 3).map((f, i) => (
                          <span key={i} className="bg-zinc-100 text-zinc-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(brand)}
                          className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                          title="Edit Brand"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(brand.id, brand.name)}
                          className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Brand"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && editingBrand && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl border border-zinc-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <h3 className="text-lg font-bold text-zinc-900">
                {editingBrand.id ? 'Edit Laminate Brand' : 'Add New Laminate Brand'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={editingBrand.name || ''}
                    onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#000d22]"
                    placeholder="e.g. Greenlam Laminates"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingBrand.displayOrder || 1}
                    onChange={(e) =>
                      setEditingBrand({ ...editingBrand, displayOrder: parseInt(e.target.value) || 1 })
                    }
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#000d22]"
                  />
                </div>
              </div>

              {/* Short & Detailed Description */}
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={editingBrand.shortDescription || ''}
                  onChange={(e) => setEditingBrand({ ...editingBrand, shortDescription: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#000d22]"
                  placeholder="e.g. 100% Pure Phenolic Bespoke Decor Surfaces."
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={editingBrand.description || ''}
                  onChange={(e) => setEditingBrand({ ...editingBrand, description: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#000d22]"
                  placeholder="Full brand details, quality guarantees, and usage overview."
                />
              </div>

              {/* PDF Upload */}
              <div className="bg-amber-50/50 border border-amber-200/80 p-4 rounded-2xl space-y-2">
                <label className="block font-bold text-amber-900">PDF Catalogue File URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingBrand.pdfUrl || ''}
                    onChange={(e) => setEditingBrand({ ...editingBrand, pdfUrl: e.target.value })}
                    className="flex-1 bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#000d22]"
                    placeholder="/catalogues/greenlam.pdf or https://..."
                  />
                  <label className="bg-[#000d22] hover:bg-[#775a19] text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0">
                    {uploadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-[#f2b800]" />}
                    <span>Upload PDF</span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileUpload(e.target.files[0], 'pdf');
                        }
                      }}
                    />
                  </label>
                </div>
                <p className="text-[10px] text-amber-800">
                  Leave empty if no PDF is available. The system will display a clean "Catalogue Coming Soon" card with contact CTAs.
                </p>
              </div>

              {/* Image URL & Upload */}
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Cover/Banner Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingBrand.coverImage || ''}
                    onChange={(e) => setEditingBrand({ ...editingBrand, coverImage: e.target.value })}
                    className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#000d22]"
                  />
                  <label className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0">
                    {uploadingCover ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-[#f2b800]" />}
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileUpload(e.target.files[0], 'cover');
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Finishes (Comma separated) */}
              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Available Finishes (Comma separated)
                </label>
                <input
                  type="text"
                  value={(editingBrand.availableFinishes || []).join(', ')}
                  onChange={(e) =>
                    setEditingBrand({
                      ...editingBrand,
                      availableFinishes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#000d22]"
                  placeholder="High Gloss, Silky Matt, Stone, Leather, Write On"
                />
              </div>

              {/* Collections (Comma separated) */}
              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Featured Collections (Comma separated)
                </label>
                <input
                  type="text"
                  value={(editingBrand.availableCollections || []).join(', ')}
                  onChange={(e) =>
                    setEditingBrand({
                      ...editingBrand,
                      availableCollections: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#000d22]"
                  placeholder="Abstract Art, Natural Oak, Metallic Gloss"
                />
              </div>

              {/* Applications & Thickness/Warranty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Thickness</label>
                  <input
                    type="text"
                    value={editingBrand.thickness || ''}
                    onChange={(e) => setEditingBrand({ ...editingBrand, thickness: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#000d22]"
                    placeholder="0.8mm - 1.0mm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Warranty</label>
                  <input
                    type="text"
                    value={editingBrand.warranty || ''}
                    onChange={(e) => setEditingBrand({ ...editingBrand, warranty: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#000d22]"
                    placeholder="10 Years Manufacturer Warranty"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingBrand.active !== false}
                    onChange={(e) => setEditingBrand({ ...editingBrand, active: e.target.checked })}
                    className="w-4 h-4 rounded text-[#000d22]"
                  />
                  <span className="font-bold text-zinc-800">Active (Visible on Website)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingBrand.isFeatured)}
                    onChange={(e) => setEditingBrand({ ...editingBrand, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#000d22]"
                  />
                  <span className="font-bold text-zinc-800">Featured Brand</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-bold hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#000d22] hover:bg-[#775a19] text-white font-extrabold px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingBrand.id ? 'Save Changes' : 'Create Brand'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

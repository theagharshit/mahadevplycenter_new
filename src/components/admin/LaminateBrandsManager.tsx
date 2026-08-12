import React, { useState, useEffect } from 'react';
import { authFetch } from '../../utils/api';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  FileText,
  BookOpen,
  CheckCircle,
  X,
  Search,
  ExternalLink,
} from 'lucide-react';
import { LaminateBrand } from '../../types';
import { ImagePicker } from './ImagePicker';

export const LaminateBrandsManager: React.FC = () => {
  const [brands, setBrands] = useState<LaminateBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<LaminateBrand | null>(null);

  const [formData, setFormData] = useState<Partial<LaminateBrand>>({
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    pdfUrl: '',
    logo: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=200',
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
    availableFinishes: ['High Gloss', 'Silky Matt', 'Suede Finish'],
    thickness: '1.0mm',
    warranty: '10 Years Warranty',
    active: true,
    isFeatured: true,
    displayOrder: 1,
  });

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/admin/laminates');
      const data = await res.json();
      setBrands(data.laminateBrands || []);
    } catch (err) {
      console.error('Failed loading laminate brands:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleOpenModal = (brand?: LaminateBrand) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData(brand);
    } else {
      setEditingBrand(null);
      setFormData({
        name: '',
        slug: '',
        shortDescription: '',
        description: '',
        pdfUrl: '',
        logo: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=200',
        coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
        availableFinishes: ['High Gloss', 'Silky Matt', 'Suede Finish'],
        thickness: '1.0mm',
        warranty: '10 Years Warranty',
        active: true,
        isFeatured: true,
        displayOrder: brands.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingBrand
        ? `/api/admin/laminates/${editingBrand.id}`
        : '/api/admin/laminates';
      const method = editingBrand ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed saving brand.');

      setIsModalOpen(false);
      fetchBrands();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this laminate brand?')) return;
    try {
      const res = await authFetch(`/api/admin/laminates/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed deleting brand.');
      fetchBrands();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = (brands || []).filter((b) => {
    const st = (searchTerm || '').toLowerCase();
    return (
      (b?.name || '').toLowerCase().includes(st) ||
      (b?.shortDescription || '').toLowerCase().includes(st)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            Laminate Brands & Catalogues CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage decorative surface brands, 3D flipbook PDF swatches, and finishes.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Laminate Brand
        </button>
      </div>

      <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search laminate brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white pl-9 pr-4 py-2 rounded-lg text-xs outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading laminate brands...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">No laminate brands found.</div>
        ) : (
          filtered.map((brand) => (
            <div
              key={brand.id}
              className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-indigo-500/50 transition"
            >
              <div className="relative h-40 bg-slate-900">
                <img
                  src={brand.coverImage}
                  alt={brand.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-white drop-shadow">{brand.name}</span>
                  {brand.pdfUrl ? (
                    <span className="text-[10px] bg-indigo-500/80 text-white px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> PDF Catalogue
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                      No PDF
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 text-xs text-slate-300">
                <p className="line-clamp-2 text-slate-400">{brand.shortDescription}</p>

                <div className="flex flex-wrap gap-1">
                  {brand.availableFinishes.slice(0, 3).map((f) => (
                    <span
                      key={f}
                      className="bg-slate-700/60 text-slate-200 border border-slate-600/50 px-2 py-0.5 rounded text-[10px]"
                    >
                      {f}
                    </span>
                  ))}
                  {brand.availableFinishes.length > 3 && (
                    <span className="text-[10px] text-slate-400 font-semibold self-center">
                      +{brand.availableFinishes.length - 3} more
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Thickness: {brand.thickness || '1.0mm'}</span>
                  <span>{brand.warranty || 'Guarantee'}</span>
                </div>
              </div>

              <div className="bg-slate-900/60 p-3 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">Slug: /{brand.slug}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(brand)}
                    className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-700 rounded transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-8 text-xs">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white mb-4">
              {editingBrand ? 'Edit Laminate Brand' : 'Add New Laminate Brand'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-indigo-500"
                  placeholder="FutureLam, Greenlam, etc."
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Catalogue PDF URL</label>
                <input
                  type="text"
                  value={formData.pdfUrl || ''}
                  onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-indigo-500 font-mono"
                  placeholder="/catalogues/futurelam.pdf"
                />
              </div>

              <ImagePicker
                label="Cover Banner Image"
                value={formData.coverImage || ''}
                onChange={(url) => setFormData({ ...formData, coverImage: url })}
                helpText="Upload file, paste image from clipboard, or enter URL"
              />

              <ImagePicker
                label="Brand Logo"
                value={formData.logo || ''}
                onChange={(url) => setFormData({ ...formData, logo: url })}
                helpText="Brand icon or emblem photo"
              />

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Short Tagline Description</label>
                <input
                  type="text"
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-indigo-500"
                  placeholder="100% Pure Phenolic Bespoke Surfaces..."
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Overview Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Thickness</label>
                  <input
                    type="text"
                    value={formData.thickness || ''}
                    onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-indigo-500"
                    placeholder="1.0mm"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Warranty</label>
                  <input
                    type="text"
                    value={formData.warranty || ''}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-indigo-500"
                    placeholder="10 Years Warranty"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow"
                >
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

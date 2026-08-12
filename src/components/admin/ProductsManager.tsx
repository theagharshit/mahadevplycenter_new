import React, { useState, useEffect } from 'react';
import { authFetch } from '../../utils/api';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Filter,
  Eye,
  X,
  AlertCircle,
  Check,
  Clock,
} from 'lucide-react';
import { Product, ProductCategory, StockStatus } from '../../types';
import { ImagePicker } from './ImagePicker';

export const ProductsManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStock, setSelectedStock] = useState<string>('All');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Plywood',
    brand: 'CenturyPly',
    grade: 'BWP Marine Grade 710',
    thickness: '18mm',
    material: 'Gurjan Hardwood Core',
    standardSize: '8ft x 4ft (2440mm x 1220mm)',
    properties: 'Boiling Water Proof, 100% Termite Proof, Zero Emission',
    idealUse: 'Kitchen Cabinets, Bathroom Vanities, Wardrobes',
    storeLocation: 'Satdobato Chowk, Lalitpur & Chabahil',
    inStock: true,
    stockStatus: 'in_stock',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
    description: '',
    priceEstimate: 'Contact store for current price per sq.ft.',
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/admin/products');
      const data = await res.json();
      setProducts(data.products || []);
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Failed loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Plywood',
      brand: 'CenturyPly',
      grade: 'BWP Marine Grade 710',
      thickness: '18mm',
      material: 'Gurjan Hardwood Core',
      standardSize: '8ft x 4ft',
      properties: 'Waterproof, Termite Proof',
      idealUse: 'Furniture & Interiors',
      storeLocation: 'Satdobato Chowk, Lalitpur',
      inStock: true,
      stockStatus: 'in_stock',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
      description: '',
      priceEstimate: 'Contact store for current wholesale rate',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormData(prod);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed saving product.');

      showToast(editingProduct ? 'Product updated successfully!' : 'New product published successfully!');
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Error saving product');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await authFetch(`/api/admin/products/duplicate/${id}`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed duplicating product.');
      showToast('Product duplicated successfully!');
      fetchProducts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await authFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed deleting product.');
      showToast('Product removed from catalogue.');
      fetchProducts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Brand', 'Grade', 'Thickness', 'In Stock', 'Price'];
    const rows = products.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.category,
      p.brand,
      p.grade,
      p.thickness || '',
      p.inStock ? 'Yes' : 'No',
      `"${(p.priceEstimate || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mahadev_products_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering
  const filteredProducts = (products || []).filter((p) => {
    const st = (searchTerm || '').toLowerCase();
    const matchesSearch =
      (p.name || '').toLowerCase().includes(st) ||
      (p.brand || '').toLowerCase().includes(st) ||
      (p.category || '').toLowerCase().includes(st);
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStock =
      selectedStock === 'All' ||
      (selectedStock === 'in_stock' && (p.stockStatus === 'in_stock' || (p.inStock && p.stockStatus !== 'out_of_stock' && p.stockStatus !== 'on_demand'))) ||
      (selectedStock === 'out_of_stock' && (p.stockStatus === 'out_of_stock' || (!p.inStock && p.stockStatus !== 'on_demand'))) ||
      (selectedStock === 'on_demand' && p.stockStatus === 'on_demand');
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-medium animate-bounce">
          <Check className="w-5 h-5 text-teal-200" />
          {toastMessage}
        </div>
      )}

      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-teal-400" />
            Products Catalogue CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage all plywood, hardware, veneers, and locks listed on the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-600 transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by name, brand, material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white pl-9 pr-4 py-2 rounded-lg text-xs outline-none focus:border-teal-500"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs outline-none focus:border-teal-500"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs outline-none focus:border-teal-500"
          >
            <option value="All">All Stock Statuses</option>
            <option value="in_stock">In Stock Only</option>
            <option value="on_demand">On Demand Only</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading products database...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No products match your search filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-700/80">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Brand & Grade</th>
                  <th className="py-3.5 px-4">Thickness & Size</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-700/30 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-700 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{prod.name}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{prod.idealUse}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-teal-300">{prod.category}</td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-200">{prod.brand}</p>
                      <p className="text-[11px] text-slate-400">{prod.grade}</p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="text-slate-200">{prod.thickness || '-'}</p>
                      <p className="text-[11px] text-slate-400">{prod.standardSize}</p>
                    </td>

                    <td className="py-3 px-4">
                      {prod.stockStatus === 'on_demand' ? (
                        <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                          <Clock className="w-3 h-3" /> On Demand
                        </span>
                      ) : prod.stockStatus === 'out_of_stock' || (!prod.inStock && !prod.stockStatus) ? (
                        <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                          <XCircle className="w-3 h-3" /> Out of Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                          <CheckCircle className="w-3 h-3" /> In Stock
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleDuplicate(prod.id)}
                          className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-700 rounded-lg transition"
                          title="Duplicate Product"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-1.5 text-slate-400 hover:text-teal-300 hover:bg-slate-700 rounded-lg transition"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white mb-4">
              {editingProduct ? 'Edit Product Details' : 'Add New Product to Store'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-teal-500"
                    placeholder="e.g. CenturyPly Club Prime BWP Plywood"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-teal-500"
                    placeholder="Plywood, Hardware, Veneers, etc."
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={formData.brand || ''}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-teal-500"
                    placeholder="CenturyPly, Greenply, Hafele, etc."
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Grade / Quality Specification</label>
                  <input
                    type="text"
                    value={formData.grade || ''}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-teal-500"
                    placeholder="IS 710 BWP Marine Grade"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Thickness</label>
                  <input
                    type="text"
                    value={formData.thickness || ''}
                    onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-teal-500"
                    placeholder="18mm, 12mm, 6mm, 1.0mm"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Standard Dimension Size</label>
                  <input
                    type="text"
                    value={formData.standardSize || ''}
                    onChange={(e) => setFormData({ ...formData, standardSize: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-teal-500"
                    placeholder="8ft x 4ft (2440mm x 1220mm)"
                  />
                </div>
              </div>

              <ImagePicker
                label="Product Photo"
                value={formData.image || ''}
                onChange={(url) => setFormData({ ...formData, image: url })}
                helpText="Upload file, paste image from clipboard, or enter URL"
              />

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Features & Properties</label>
                <input
                  type="text"
                  value={formData.properties || ''}
                  onChange={(e) => setFormData({ ...formData, properties: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-teal-500"
                  placeholder="100% Waterproof, Borer Proof, ViroKill Tech"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-teal-500"
                  placeholder="Write a clear description for architects and homeowners..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Stock Availability Status
                  </label>
                  <select
                    value={
                      formData.stockStatus ||
                      (formData.inStock === false ? 'out_of_stock' : 'in_stock')
                    }
                    onChange={(e) => {
                      const status = e.target.value as StockStatus;
                      setFormData({
                        ...formData,
                        stockStatus: status,
                        inStock: status !== 'out_of_stock',
                      });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-teal-500 font-medium"
                  >
                    <option value="in_stock">In Stock (In-Store / Ready Delivery)</option>
                    <option value="on_demand">On Demand (Available on Order / Special Import)</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Store Location / Display Hall
                  </label>
                  <input
                    type="text"
                    value={formData.storeLocation || ''}
                    onChange={(e) => setFormData({ ...formData, storeLocation: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-teal-500"
                    placeholder="Satdobato Showroom, Lalitpur"
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
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg shadow"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

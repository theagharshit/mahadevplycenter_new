import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Tag,
  X,
  AlertTriangle,
  FolderPlus,
  FileText,
  Upload,
  ExternalLink,
  BookOpen,
  FileUp,
} from 'lucide-react';
import { Product, StockStatus } from '../../types';
import { CMSData, cmsApi } from '../../lib/cmsApi';

interface ProductsManagerProps {
  data: CMSData;
  onRefreshData: () => void;
  onShowToast: (msg: string) => void;
}

export const ProductsManager: React.FC<ProductsManagerProps> = ({
  data,
  onRefreshData,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [stockFilter, setStockFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatInput, setNewCatInput] = useState('');
  const [newCatPdfFile, setNewCatPdfFile] = useState<File | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Category Catalogue Modal State
  const [isCatalogueModalOpen, setIsCatalogueModalOpen] = useState(false);
  const [selectedFileForCat, setSelectedFileForCat] = useState<Record<string, File | null>>({});
  const [uploadingCat, setUploadingCat] = useState<string | null>(null);
  const [deletingCatPdf, setDeletingCatPdf] = useState<string | null>(null);

  // Delete Confirmation State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Categories derived from database
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

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: categoriesList[0] || 'Plywood',
    grade: 'Premium BWR Grade',
    brand: 'CenturyPly',
    application: ['Kitchen', 'Wardrobe'],
    image: '',
    description: '',
    material: 'Selected Hardwood',
    standardSize: '8ft x 4ft',
    properties: 'Moisture & Termite Resistant',
    idealUse: 'Interior furniture & cabinetry',
    storeLocation: 'Display Hall, Satdobato, Lalitpur',
    inStock: true,
    stockStatus: 'in_stock',
    priceEstimate: 'NPR 3,800 - 4,500 / sheet',
    thickness: '18mm',
  });

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

  const filteredProducts = data.products.filter((p) => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;

    const currentStatus: StockStatus = p.stockStatus || (p.inStock ? 'in_stock' : 'out_of_stock');
    const matchesStock = stockFilter === 'ALL' || currentStatus === stockFilter;

    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesStock && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: categoriesList[0] || 'Plywood',
      grade: 'Premium BWR Grade',
      brand: 'CenturyPly',
      application: ['Kitchen', 'Wardrobe'],
      image: '',
      description: '',
      material: 'Selected Hardwood',
      standardSize: '8ft x 4ft',
      properties: 'Moisture & Termite Resistant',
      idealUse: 'Interior furniture & cabinetry',
      storeLocation: 'Satdobato, Lalitpur',
      inStock: true,
      stockStatus: 'in_stock',
      priceEstimate: 'NPR 3,500 / sheet',
      thickness: '18mm',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    const initialStatus: StockStatus = product.stockStatus || (product.inStock ? 'in_stock' : 'out_of_stock');
    setFormData({
      ...product,
      stockStatus: initialStatus,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      alert('Product Name and Category are required.');
      return;
    }

    const currentStatus = formData.stockStatus || 'in_stock';
    const payload = {
      ...formData,
      stockStatus: currentStatus,
      inStock: currentStatus !== 'out_of_stock',
    };

    try {
      if (editingProduct?.id) {
        await cmsApi.updateProduct(editingProduct.id, payload);
        onShowToast(`Updated product "${formData.name}"`);
      } else {
        await cmsApi.createProduct(payload);
        onShowToast(`Created new product "${formData.name}"`);
      }
      setIsModalOpen(false);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleChangeStockStatus = async (product: Product, newStatus: StockStatus) => {
    try {
      await cmsApi.updateProduct(product.id, {
        stockStatus: newStatus,
        inStock: newStatus !== 'out_of_stock',
      });
      const statusLabels: Record<StockStatus, string> = {
        in_stock: 'In Stock',
        on_demand: 'On Demand',
        out_of_stock: 'Out of Stock',
      };
      onShowToast(`${product.name} set to ${statusLabels[newStatus]}`);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to update stock status');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatInput.trim();
    if (!trimmed) return;

    setIsCreatingCategory(true);
    try {
      await cmsApi.createCategory(trimmed);

      if (newCatPdfFile) {
        await cmsApi.uploadCategoryCatalogue(trimmed, newCatPdfFile);
        onShowToast(`Category "${trimmed}" created with PDF catalogue!`);
      } else {
        onShowToast(`Category "${trimmed}" created successfully!`);
      }

      setFormData((prev) => ({ ...prev, category: trimmed }));
      setNewCatInput('');
      setNewCatPdfFile(null);
      setIsCategoryModalOpen(false);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to create category');
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleFileChangeForCat = (cat: string, file: File | null) => {
    setSelectedFileForCat((prev) => ({ ...prev, [cat]: file }));
  };

  const handleUploadCategoryPdf = async (cat: string) => {
    const file = selectedFileForCat[cat];
    if (!file) {
      alert('Please select a PDF file first.');
      return;
    }

    setUploadingCat(cat);
    try {
      await cmsApi.uploadCategoryCatalogue(cat, file);
      onShowToast(`PDF Catalogue uploaded for category "${cat}"!`);
      setSelectedFileForCat((prev) => ({ ...prev, [cat]: null }));
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to upload category PDF catalogue');
    } finally {
      setUploadingCat(null);
    }
  };

  const handleRemoveCategoryPdf = async (cat: string) => {
    if (
      !confirm(
        `Remove PDF catalogue for category "${cat}"?\n\nThe 3D interactive flipbook button will be hidden on the website for this category until a new catalogue is uploaded.`
      )
    ) {
      return;
    }

    setDeletingCatPdf(cat);
    try {
      await cmsApi.removeCategoryCatalogue(cat);
      onShowToast(`Removed PDF catalogue for "${cat}"`);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to remove category catalogue');
    } finally {
      setDeletingCatPdf(null);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await cmsApi.deleteProduct(deleteId);
      onShowToast('Product deleted successfully');
      setDeleteId(null);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Products & Hardware Catalog</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage plywood grades, laminates, veneers, door locks, availability, and product categories
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsCatalogueModalOpen(true)}
            className="bg-[#f2b800]/15 hover:bg-[#f2b800]/25 text-[#775a19] border border-[#f2b800]/40 font-bold px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            title="Upload and manage PDF catalogues for each category"
          >
            <BookOpen className="w-4 h-4 text-[#775a19]" />
            <span>Category PDF Catalogues</span>
          </button>

          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer border border-zinc-200"
            title="Create a new category"
          >
            <FolderPlus className="w-4 h-4 text-[#775a19]" />
            <span>+ Add Category</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="bg-[#000d22] hover:bg-[#0b2240] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4 text-[#f2b800]" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Category PDF Catalogues Live Status Summary Card */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4.5 h-4.5 text-[#775a19]" />
            <div>
              <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wider">
                Category PDF Catalogues Status
              </h3>
              <p className="text-[11px] text-zinc-600">
                Categories with uploaded PDFs display interactive 3D flipbook catalogues to customers.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCatalogueModalOpen(true)}
            className="text-xs font-extrabold text-[#775a19] hover:text-[#000d22] bg-white px-3 py-1.5 rounded-xl border border-amber-300 shadow-2xs hover:shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-[#f2b800]" />
            <span>Manage & Upload Catalogues</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {categoriesList.map((cat) => {
            const catCat = findCategoryCatalogue(cat);
            const hasPdf = Boolean(catCat && catCat.pdfUrl);

            return (
              <div
                key={cat}
                onClick={() => setIsCatalogueModalOpen(true)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5 group ${
                  hasPdf
                    ? 'bg-emerald-50/90 border-emerald-200/90 hover:bg-emerald-100/80'
                    : 'bg-white/80 border-zinc-200 hover:bg-zinc-100'
                }`}
                title={hasPdf ? `Click to manage catalogue for ${cat}` : `Click to upload PDF for ${cat}`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-xs text-zinc-900 truncate">{cat}</span>
                  {hasPdf ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow-2xs" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold">
                  {hasPdf ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      PDF Uploaded
                    </span>
                  ) : (
                    <span className="text-zinc-400 font-medium flex items-center gap-1">
                      <XCircle className="w-3 h-3 text-zinc-400" />
                      No Catalogue
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col space-y-4">
        {/* Category Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'ALL'
                ? 'bg-[#000d22] text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            All Products ({data.products.length})
          </button>
          {categoriesList.map((cat) => {
            const count = data.products.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#000d22] text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Second Row: Stock Filter + Search Input */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-100">
          {/* Stock Filter Pills */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-zinc-500 shrink-0">Availability:</span>
            <div className="flex gap-1 overflow-x-auto">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'in_stock', label: 'In Stock' },
                { id: 'on_demand', label: 'On Demand' },
                { id: 'out_of_stock', label: 'Out of Stock' },
              ].map((sf) => (
                <button
                  key={sf.id}
                  onClick={() => setStockFilter(sf.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                    stockFilter === sf.id
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {sf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:min-w-[260px] sm:w-auto">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name, grade, brand, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-[#000d22]"
            />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 text-sm">
            No products found matching your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-zinc-50/80 border-b border-zinc-200/80 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Brand & Grade</th>
                  <th className="py-3 px-4">Availability Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredProducts.map((p) => {
                  const currentStatus: StockStatus =
                    p.stockStatus || (p.inStock ? 'in_stock' : 'out_of_stock');

                  return (
                    <tr key={p.id} className="hover:bg-zinc-50/60 transition-colors">
                      {/* Item Name & Image */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image || 'https://via.placeholder.com/100'}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-zinc-200 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://via.placeholder.com/100?text=Ply';
                            }}
                          />
                          <div>
                            <p className="font-bold text-zinc-900 leading-snug">{p.name}</p>
                            <p className="text-xs text-zinc-500 truncate max-w-[200px]">
                              {p.thickness ? `${p.thickness} • ` : ''}
                              {p.standardSize}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 text-xs font-semibold">
                          {p.category}
                        </span>
                      </td>

                      {/* Brand & Grade */}
                      <td className="py-3 px-4">
                        <p className="font-bold text-xs text-[#000d22]">{p.brand}</p>
                        <p className="text-xs text-zinc-500">{p.grade}</p>
                      </td>

                      {/* Availability Stock Status Selector */}
                      <td className="py-3 px-4">
                        <div className="relative inline-block">
                          <select
                            value={currentStatus}
                            onChange={(e) =>
                              handleChangeStockStatus(p, e.target.value as StockStatus)
                            }
                            className={`text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors border focus:outline-none ${
                              currentStatus === 'in_stock'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                : currentStatus === 'on_demand'
                                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                                : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                            }`}
                          >
                            <option value="in_stock">✓ In Stock</option>
                            <option value="on_demand">⏳ On Demand</option>
                            <option value="out_of_stock">✕ Out of Stock</option>
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 text-zinc-600 hover:text-[#000d22] hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(p.id)}
                            className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-zinc-200 shadow-2xl my-8 relative">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6">
              <h2 className="text-xl font-bold text-zinc-900">
                {editingProduct?.id ? 'Edit Product Item' : 'Add New Product to Catalog'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Commercial Plywood 18mm"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#000d22]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-zinc-700">Category *</label>
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="text-[#775a19] hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>New Category</span>
                    </button>
                  </div>
                  <select
                    value={formData.category || categoriesList[0] || 'Plywood'}
                    onChange={(e) => {
                      if (e.target.value === '__ADD_NEW__') {
                        setIsCategoryModalOpen(true);
                      } else {
                        setFormData({ ...formData, category: e.target.value });
                      }
                    }}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#000d22] cursor-pointer"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__ADD_NEW__" className="font-bold text-[#775a19]">
                      + Add New Category...
                    </option>
                  </select>
                </div>
              </div>

              {/* Stock Status Selection (In Stock, On Demand, Out of Stock) */}
              <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
                <label className="block font-bold text-zinc-800 mb-2">
                  Product Stock & Availability Status *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      (formData.stockStatus || 'in_stock') === 'in_stock'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="stockStatusOption"
                      value="in_stock"
                      checked={(formData.stockStatus || 'in_stock') === 'in_stock'}
                      onChange={() => setFormData({ ...formData, stockStatus: 'in_stock' })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <p className="font-bold text-xs flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>In Stock</span>
                      </p>
                      <p className="text-[10px] text-zinc-500">Available immediately</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      formData.stockStatus === 'on_demand'
                        ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="stockStatusOption"
                      value="on_demand"
                      checked={formData.stockStatus === 'on_demand'}
                      onChange={() => setFormData({ ...formData, stockStatus: 'on_demand' })}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <p className="font-bold text-xs flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>On Demand</span>
                      </p>
                      <p className="text-[10px] text-zinc-500">Arranged on request</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      formData.stockStatus === 'out_of_stock'
                        ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-xs'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="stockStatusOption"
                      value="out_of_stock"
                      checked={formData.stockStatus === 'out_of_stock'}
                      onChange={() => setFormData({ ...formData, stockStatus: 'out_of_stock' })}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <div>
                      <p className="font-bold text-xs flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Out of Stock</span>
                      </p>
                      <p className="text-[10px] text-zinc-500">Currently unavailable</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={formData.brand || ''}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. CenturyPly / Greenply"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#000d22]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Grade</label>
                  <input
                    type="text"
                    value={formData.grade || ''}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="e.g. BWR Grade / Marine Grade"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#000d22]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Thickness</label>
                  <input
                    type="text"
                    value={formData.thickness || ''}
                    onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                    placeholder="e.g. 18mm / 12mm / 1mm"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#000d22]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://... or /uploads/..."
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#000d22]"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe material durability, termite resistance, moisture level..."
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-3 focus:outline-none focus:border-[#000d22]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Standard Size</label>
                  <input
                    type="text"
                    value={formData.standardSize || ''}
                    onChange={(e) => setFormData({ ...formData, standardSize: e.target.value })}
                    placeholder="e.g. 8ft x 4ft (8x4)"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#000d22]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Store Location</label>
                  <input
                    type="text"
                    value={formData.storeLocation || ''}
                    onChange={(e) => setFormData({ ...formData, storeLocation: e.target.value })}
                    placeholder="e.g. Display Hall, Satdobato Lalitpur"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#000d22]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-300 text-zinc-600 hover:bg-zinc-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#000d22] hover:bg-[#0b2240] text-white font-bold cursor-pointer shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-zinc-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-[#775a19]" />
                <h3 className="text-base font-bold text-zinc-900">Add New Category</h3>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  placeholder="e.g. Edge Banding, Acoustic Panels, Hardware Accessories..."
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#000d22]"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  This category will immediately become available in forms and category filters across the entire application.
                </p>
              </div>

              <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-200 space-y-1.5">
                <label className="block font-bold text-zinc-800 text-xs">
                  Category PDF Catalogue (Optional)
                </label>
                <p className="text-[11px] text-zinc-500">
                  Upload an official PDF catalogue for this category so users can view interactive 3D swatches. You can also upload or remove this later.
                </p>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setNewCatPdfFile(e.target.files?.[0] || null)}
                  className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#000d22] file:text-white hover:file:bg-[#0b2240] text-zinc-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-300 text-zinc-600 hover:bg-zinc-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingCategory || !newCatInput.trim()}
                  className="px-4 py-2 rounded-xl bg-[#000d22] hover:bg-[#0b2240] text-white font-bold cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isCreatingCategory ? 'Saving...' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category PDF Catalogues Manager Modal */}
      {isCatalogueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 border border-zinc-200 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#f2b800]/20 rounded-2xl text-[#775a19]">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">
                    Category PDF Catalogues Manager
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Manage official PDF catalogues for each category. Categories with PDFs show interactive 3D flipbook swatches to customers.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCatalogueModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-600 rounded-xl hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stats Bar */}
            <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-200 flex items-center justify-between text-xs font-bold text-zinc-700 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>
                  {categoriesList.filter((cat) => {
                    const catCat = findCategoryCatalogue(cat);
                    return Boolean(catCat && catCat.pdfUrl);
                  }).length}{' '}
                  of {categoriesList.length} Categories Have PDF Catalogue Uploaded
                </span>
              </div>
              <span className="text-zinc-400 font-normal">
                Flipbooks are dynamically hidden for categories without PDFs
              </span>
            </div>

            {/* Categories List */}
            <div className="overflow-y-auto space-y-3 pr-1 divide-y divide-zinc-100 flex-1">
              {categoriesList.map((cat) => {
                const catCat = findCategoryCatalogue(cat);
                const hasPdf = Boolean(catCat && catCat.pdfUrl);
                const selectedFile = selectedFileForCat[cat];

                return (
                  <div
                    key={cat}
                    className="pt-3.5 first:pt-0 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50/60 border border-zinc-200/80 hover:bg-zinc-50 transition-all"
                  >
                    {/* Category Title & Status */}
                    <div className="space-y-1.5 max-w-sm">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-extrabold text-base text-zinc-900">{cat}</span>
                        {hasPdf ? (
                          <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold flex items-center gap-1.5 shadow-2xs">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            PDF Catalogue Active
                          </span>
                        ) : (
                          <span className="px-3 py-0.5 rounded-full bg-zinc-200 text-zinc-600 border border-zinc-300 text-xs font-bold flex items-center gap-1.5">
                            <XCircle className="w-3.5 h-3.5 text-zinc-400" />
                            No Catalogue Attached
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-zinc-500 font-mono break-all">
                        {hasPdf
                          ? `URL: ${catCat?.pdfUrl}`
                          : 'No PDF uploaded — 3D interactive flipbook button is currently hidden on the website.'}
                      </p>

                      {hasPdf && (
                        <div className="flex items-center gap-2 pt-1">
                          <a
                            href={catCat!.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-800 text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Preview PDF</span>
                          </a>

                          <button
                            onClick={() => handleRemoveCategoryPdf(cat)}
                            disabled={deletingCatPdf === cat}
                            className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{deletingCatPdf === cat ? 'Deleting...' : 'Delete PDF'}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* File Upload Controls (Custom File Picker - No "No file chosen" browser text) */}
                    <div className="flex flex-col gap-2 shrink-0">
                      {selectedFile ? (
                        <div className="flex items-center gap-2 bg-amber-50 p-2.5 rounded-xl border border-amber-300 shadow-2xs">
                          <FileText className="w-4 h-4 text-amber-700 shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-amber-900 truncate max-w-[150px]" title={selectedFile.name}>
                              {selectedFile.name}
                            </span>
                            <span className="text-[10px] text-amber-700 font-medium">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleFileChangeForCat(cat, null)}
                            className="p-1 hover:bg-amber-200/60 rounded-lg text-amber-800 text-xs font-bold cursor-pointer"
                            title="Cancel selection"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUploadCategoryPdf(cat)}
                            disabled={uploadingCat === cat}
                            className="ml-1 px-3.5 py-2 rounded-xl bg-[#f2b800] hover:bg-[#ffc81a] text-[#000d22] font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap disabled:opacity-50"
                          >
                            <FileUp className="w-4 h-4" />
                            <span>{uploadingCat === cat ? 'Uploading...' : 'Save PDF'}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={`cat-pdf-input-${cat.replace(/\s+/g, '-')}`}
                            className="px-4 py-2.5 rounded-xl bg-[#000d22] hover:bg-[#0b2240] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                          >
                            <Upload className="w-4 h-4 text-[#f2b800]" />
                            <span>{hasPdf ? 'Replace PDF File' : 'Attach PDF File'}</span>
                          </label>
                          <input
                            id={`cat-pdf-input-${cat.replace(/\s+/g, '-')}`}
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={(e) => handleFileChangeForCat(cat, e.target.files?.[0] || null)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between shrink-0">
              <span className="text-xs text-zinc-500">
                Uploaded catalogues update instantly across public store category pages.
              </span>
              <button
                type="button"
                onClick={() => setIsCatalogueModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-[#000d22] hover:bg-[#0b2240] text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Close & Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-zinc-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-50 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Confirm Product Deletion</h3>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Are you sure you want to permanently remove this product from the store catalog? This action will immediately remove it from the public website catalog.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl border border-zinc-300 text-zinc-600 hover:bg-zinc-100 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteProduct}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

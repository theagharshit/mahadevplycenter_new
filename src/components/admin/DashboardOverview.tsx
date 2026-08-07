import React from 'react';
import {
  Package,
  FileText,
  Image as ImageIcon,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { CMSData } from '../../lib/cmsApi';

interface DashboardOverviewProps {
  data: CMSData;
  onNavigateTab: (tab: string) => void;
  onRefreshData: () => void;
  onShowToast: (msg: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  data,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-8">
      {/* Top Banner Greeting */}
      <div className="bg-gradient-to-r from-[#000d22] to-[#0b2240] rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2b800]/20 border border-[#f2b800]/30 text-[#f2b800] text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-[#f2b800] animate-pulse" />
              Live CMS Storefront Connected
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Mahadev Ply Center Dashboard
            </h1>
            <p className="text-zinc-300 text-sm mt-1 max-w-2xl">
              Welcome back! Manage products, website announcements, hero banners, and blogs directly from your CMS.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('products')}
              className="bg-[#f2b800] hover:bg-[#d9a500] text-[#000d22] font-bold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Package className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
            <button
              onClick={() => onNavigateTab('page-content')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Edit Hero & Tagline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Products</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-zinc-900">{data.products.length}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> In Catalog
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => onNavigateTab('blogs')}
          className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Blog Articles</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-zinc-900">{data.blogPosts.length}</span>
            <span className="text-xs text-zinc-500 font-medium">Published</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => onNavigateTab('media')}
          className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Media Assets</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-zinc-900">{data.media.length}</span>
            <span className="text-xs text-zinc-500 font-medium">Uploaded</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Products Overview & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Products Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200/80 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Featured Catalog Products</h2>
                <p className="text-xs text-zinc-500">Live products currently displayed on the storefront</p>
              </div>
              <button
                onClick={() => onNavigateTab('products')}
                className="text-xs font-bold text-[#000d22] hover:text-[#f2b800] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Manage All ({data.products.length})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {data.products.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 text-sm">
                No products added yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-100 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      <th className="pb-3">Product Name</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Grade / Spec</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {data.products.slice(0, 5).map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="py-3.5 pr-2 font-bold text-zinc-900">
                          {p.name}
                        </td>
                        <td className="py-3.5 pr-2">
                          <span className="inline-block px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[11px] font-semibold">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-3.5 text-xs text-zinc-600">
                          {p.grade}
                        </td>
                        <td className="py-3.5 text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              p.inStock
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}
                          >
                            <span>{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Activity Feed */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-zinc-900">Admin Audit Trail</h2>
            <button
              onClick={() => onNavigateTab('activity')}
              className="text-xs font-bold text-[#000d22] hover:text-[#f2b800] transition-colors"
            >
              Full Log
            </button>
          </div>

          <div className="flex-grow space-y-4">
            {data.activityLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="flex items-start gap-3 text-xs border-b border-zinc-100 pb-3 last:border-none">
                <div className="w-2 h-2 rounded-full bg-[#f2b800] mt-1.5 shrink-0" />
                <div className="flex-grow">
                  <div className="flex items-center justify-between font-semibold text-zinc-800">
                    <span>{log.action}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-zinc-600 mt-0.5 leading-tight">{log.details}</p>
                  <p className="text-[10px] text-zinc-400 mt-1">by {log.adminName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

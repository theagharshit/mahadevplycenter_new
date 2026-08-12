import React, { useEffect, useState } from 'react';
import { authFetch } from '../../utils/api';
import {
  MessageSquare,
  Package,
  BookOpen,
  FileText,
  Activity,
  Plus,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { InquiryItem, AuditLog } from '../../types';

interface DashboardOverviewProps {
  onNavigate: (section: string) => void;
  onSelectInquiry?: (inquiry: InquiryItem) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<{
    totalInquiries: number;
    newInquiries: number;
    totalProducts: number;
    inStockProducts: number;
    totalLaminateBrands: number;
    totalCatalogues: number;
    totalBlogs: number;
    recentInquiries: InquiryItem[];
    recentLogs: AuditLog[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch('/api/admin/dashboard/stats')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed fetching stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-[#43474e]">
        <div className="w-8 h-8 border-4 border-[#000d22]/20 border-t-[#000d22] rounded-full animate-spin mr-3" />
        Loading Dashboard Metrics...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#000d22] via-[#001b3c] to-[#002349] border border-[#002349] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#775a19]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">System Control Center</h1>
            <p className="text-sm text-slate-200 mt-1">
              Welcome back. Everything on the website is synchronized and editable in real-time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('products')}
              className="bg-[#775a19] hover:bg-[#5d4201] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-[#e9c176]" />
              Add Product
            </button>
            <button
              onClick={() => onNavigate('inquiries')}
              className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-[#e9c176]" />
              Inquiries ({stats?.newInquiries || 0} New)
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-[#e5e2e1] rounded-2xl p-5 shadow-xs hover:border-[#775a19]/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#43474e]">
              Customer Inquiries
            </span>
            <div className="p-2.5 bg-[#775a19]/10 text-[#775a19] rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#000d22]">{stats?.totalInquiries || 0}</span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" /> {stats?.newInquiries || 0} New
            </span>
          </div>
          <p className="text-xs text-[#43474e] mt-2">Quote & contact submissions</p>
        </div>

        <div className="bg-white border border-[#e5e2e1] rounded-2xl p-5 shadow-xs hover:border-[#775a19]/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#43474e]">
              Products Catalogue
            </span>
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#000d22]">{stats?.totalProducts || 0}</span>
            <span className="text-xs font-medium text-amber-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
              {stats?.inStockProducts || 0} In Stock
            </span>
          </div>
          <p className="text-xs text-[#43474e] mt-2">Plywood, hardware & veneers</p>
        </div>

        <div className="bg-white border border-[#e5e2e1] rounded-2xl p-5 shadow-xs hover:border-[#775a19]/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#43474e]">
              Category Catalogues
            </span>
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#000d22]">{stats?.totalCatalogues || 0}</span>
            <span className="text-xs font-medium text-blue-800 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
              PDF Documents
            </span>
          </div>
          <p className="text-xs text-[#43474e] mt-2">{stats?.totalCatalogues || 0} Category PDF Flipbooks</p>
        </div>

        <div className="bg-white border border-[#e5e2e1] rounded-2xl p-5 shadow-xs hover:border-[#775a19]/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#43474e]">
              Articles & Guides
            </span>
            <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#000d22]">{stats?.totalBlogs || 0}</span>
            <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
              Published
            </span>
          </div>
          <p className="text-xs text-[#43474e] mt-2">Plywood tips & maintenance</p>
        </div>
      </div>

      {/* Recent Inquiries List */}
      <div className="bg-white border border-[#e5e2e1] rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#000d22] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#775a19]" />
              Recent Quote Requests & Inquiries
            </h2>
            <p className="text-xs text-[#43474e]">Latest customer leads from website forms</p>
          </div>
          <button
            onClick={() => onNavigate('inquiries')}
            className="text-xs text-[#775a19] hover:text-[#5d4201] font-semibold flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {stats?.recentInquiries && stats.recentInquiries.length > 0 ? (
            stats.recentInquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-4 bg-[#f8f3f0] border border-[#e5e2e1] rounded-xl flex items-center justify-between gap-4 hover:border-[#775a19]/40 transition"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#000d22] text-sm truncate">{inq.name}</span>
                    <span className="text-xs text-[#43474e]">({inq.city})</span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        inq.status === 'New'
                          ? 'bg-amber-100 border-amber-300 text-amber-900'
                          : inq.status === 'In Progress'
                          ? 'bg-blue-100 border-blue-300 text-blue-900'
                          : 'bg-emerald-100 border-emerald-300 text-emerald-900'
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#1c1b1b] truncate">
                    <span className="text-[#775a19] font-semibold">{inq.category}</span> • {inq.quantity}
                  </p>
                  <p className="text-xs text-[#43474e] line-clamp-1">{inq.message}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg transition"
                    title="Reply via WhatsApp"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => onNavigate('inquiries')}
                    className="p-2 bg-white border border-[#c4c6cf] text-[#000d22] hover:bg-[#eae7e7] rounded-lg transition"
                    title="View Details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#43474e] py-6 text-center">No inquiries logged yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

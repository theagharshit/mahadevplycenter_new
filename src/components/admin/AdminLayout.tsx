import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Building2,
  Users,
  Clock,
  LogOut,
  ExternalLink,
  Menu,
  X,
  RefreshCw,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { Logo } from '../Logo';
import { CMSData, cmsApi } from '../../lib/cmsApi';
import { DashboardOverview } from './DashboardOverview';
import { ProductsManager } from './ProductsManager';
import { CataloguePDFsManager } from './CataloguePDFsManager';
import { PageContentManager } from './PageContentManager';
import { BlogsManager } from './BlogsManager';
import { MediaLibraryManager } from './MediaLibraryManager';
import { TestimonialsFaqsManager } from './TestimonialsFaqsManager';
import { BusinessSettingsManager } from './BusinessSettingsManager';
import { AdminUsersManager } from './AdminUsersManager';
import { ActivityLogsView } from './ActivityLogsView';

interface AdminLayoutProps {
  currentUser: any;
  onLogout: () => void;
  onBackToWebsite: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentUser,
  onLogout,
  onBackToWebsite,
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [cmsData, setCmsData] = useState<CMSData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const loadData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const data = await cmsApi.getAdminData();
      setCmsData(data);
    } catch (err: any) {
      if (
        err?.message?.toLowerCase().includes('unauthorized') ||
        err?.message?.toLowerCase().includes('login')
      ) {
        onLogout();
      } else {
        console.warn('Unable to load CMS data:', err?.message || err);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products & Hardware', icon: Package },
    { id: 'catalogues', label: 'Catalogue PDFs', icon: BookOpen },
    { id: 'page-content', label: 'Hero & Page Content', icon: FileText },
    { id: 'blogs', label: 'Blog & Knowledge', icon: FileText },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'testimonials-faqs', label: 'Reviews & FAQs', icon: MessageSquare },
    { id: 'business-settings', label: 'Business & SEO', icon: Building2 },
    { id: 'admin-users', label: 'Admin Team', icon: Users },
    { id: 'activity', label: 'Audit Activity Logs', icon: Clock },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000d22] flex flex-col items-center justify-center text-white p-4">
        <div className="w-12 h-12 border-4 border-[#f2b800] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-bold text-lg tracking-wide">Connecting to Mahadev CMS Backend...</p>
        <p className="text-xs text-zinc-400 mt-1">Fetching products and settings</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100/80 flex flex-col font-sans text-zinc-800">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#000d22] border border-[#f2b800]/50 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#f2b800]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="bg-[#000d22] border-b border-[#1e3a66] text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 text-zinc-300 hover:text-white rounded-xl focus:outline-none cursor-pointer"
            >
              {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <Logo variant="full" className="h-10" lightText />
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#f2b800]/20 border border-[#f2b800]/40 text-[#f2b800] text-[10px] font-black tracking-widest uppercase">
                CMS ADMIN
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Refresh Data Button */}
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer border border-white/10"
              title="Refresh database records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#f2b800]' : ''}`} />
              <span>{refreshing ? 'Syncing...' : 'Sync Data'}</span>
            </button>

            {/* View Live Website */}
            <button
              onClick={onBackToWebsite}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f2b800] hover:bg-[#d9a500] text-[#000d22] font-bold text-xs rounded-xl transition-all shadow cursor-pointer"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* User Profile Pill */}
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-white/10">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold text-xs">
                {currentUser?.name?.charAt(0) || 'A'}
              </div>
              <div className="text-left text-xs">
                <p className="font-bold text-white leading-tight">{currentUser?.name}</p>
                <p className="text-[10px] text-amber-300 font-mono leading-tight">{currentUser?.role}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer ml-1"
              title="Logout of Admin Panel"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-grow flex max-w-[1600px] w-full mx-auto">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed lg:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-[#03152c] border-r border-[#1e3a66] text-zinc-300 flex flex-col justify-between transition-transform duration-300 ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-4 space-y-1 overflow-y-auto">
            <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500 px-3 pb-2 pt-1">
              Navigation Menu
            </p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#f2b800] text-[#000d22] shadow-md'
                      : 'hover:bg-white/5 hover:text-white text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#000d22]' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-[#1e3a66] text-[11px] text-zinc-400 bg-[#000d22]/50 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Mahadev CMS v2.0</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-zinc-500">Satdobato & Chabahil, Lalitpur</p>
          </div>
        </aside>

        {/* Content View Area */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {cmsData && (
            <>
              {activeTab === 'dashboard' && (
                <DashboardOverview
                  data={cmsData}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onRefreshData={loadData}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'products' && (
                <ProductsManager
                  data={cmsData}
                  onRefreshData={loadData}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'catalogues' && (
                <CataloguePDFsManager
                  data={cmsData}
                  onRefreshData={loadData}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'page-content' && (
                <PageContentManager
                  data={cmsData}
                  onRefreshData={loadData}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'blogs' && (
                <BlogsManager
                  data={cmsData}
                  onRefreshData={loadData}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'media' && (
                <MediaLibraryManager
                  data={cmsData}
                  onRefreshData={loadData}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'testimonials-faqs' && (
                <TestimonialsFaqsManager
                  data={cmsData}
                  onRefreshData={loadData}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'business-settings' && (
                <BusinessSettingsManager
                  data={cmsData}
                  onRefreshData={loadData}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'admin-users' && (
                <AdminUsersManager
                  data={cmsData}
                  currentUser={currentUser}
                  onRefreshData={loadData}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'activity' && <ActivityLogsView data={cmsData} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

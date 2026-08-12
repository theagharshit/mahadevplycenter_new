import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  BookOpen,
  FileText,
  MessageSquare,
  Image as ImageIcon,
  Layout,
  Settings,
  Menu,
  Languages,
  Users,
  Activity,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Shield,
  Bell,
  Search,
} from 'lucide-react';
import { AdminUser } from '../../types';
import { Logo } from '../Logo';

interface AdminLayoutProps {
  user: AdminUser;
  activeSection: string;
  onNavigate: (section: string) => void;
  onLogout: () => void;
  onViewPublicWebsite: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  user,
  activeSection,
  onNavigate,
  onLogout,
  onViewPublicWebsite,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products CMS', icon: Package },
    { id: 'catalogues', label: 'Category Catalogues', icon: BookOpen },
    { id: 'blogs', label: 'Blog & Articles', icon: FileText },
    { id: 'inquiries', label: 'Inquiries & Leads', icon: MessageSquare },
    { id: 'content', label: 'Pages Content', icon: Layout },
    { id: 'settings', label: 'Store Settings', icon: Settings },
    { id: 'navigation', label: 'Menu Builder', icon: Menu },
    { id: 'translations', label: 'Translations', icon: Languages },
  ];

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] flex flex-col md:flex-row antialiased font-sans selection:bg-[#775a19] selection:text-white">
      {/* Sidebar */}
      <aside
        className={`bg-[#000d22] border-r border-[#002349] text-white flex flex-col justify-between shrink-0 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div>
          {/* Sidebar Branding */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-[#002349]">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <Logo variant="light" className="h-7" />
                <span className="text-[10px] uppercase font-extrabold bg-[#775a19]/30 text-[#e9c176] border border-[#775a19]/50 px-1.5 py-0.5 rounded">
                  CMS
                </span>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-[#002349] rounded-lg transition mx-auto"
            >
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-[#775a19] text-white shadow-md shadow-[#775a19]/30'
                      : 'text-slate-300 hover:text-white hover:bg-[#002349]/70'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer in Sidebar */}
        <div className="p-3 border-t border-[#002349]">
          <div className={`flex items-center justify-between gap-2 p-2 rounded-xl bg-[#001b3c] ${collapsed ? 'justify-center' : ''}`}>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-[#e9c176] font-mono capitalize">{user.role.replace('_', ' ')}</p>
              </div>
            )}
            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-[#002349] rounded-lg transition shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-[#fcf9f8]">
        {/* Header Bar */}
        <header className="h-16 bg-white border-b border-[#e5e2e1] px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={onViewPublicWebsite}
              className="flex items-center gap-2 text-xs font-semibold text-[#000d22] bg-[#f6f3f2] border border-[#c4c6cf] hover:bg-[#eae7e7] px-3.5 py-1.5 rounded-xl transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#775a19]" />
              View Storefront
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-medium text-emerald-800">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              Session Protected
            </div>

            <div className="flex items-center gap-2 border-l border-[#e5e2e1] pl-4">
              <div className="w-8 h-8 rounded-full bg-[#000d22] text-white font-bold flex items-center justify-center text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-[#1c1b1b] leading-tight">{user.name}</p>
                <p className="text-[10px] text-[#43474e]">{user.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-6 md:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
};

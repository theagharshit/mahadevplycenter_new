import React, { useState, useEffect } from 'react';
import { AdminUser } from '../../types';
import { authFetch } from '../../utils/api';
import { AdminLogin } from './AdminLogin';
import { AdminLayout } from './AdminLayout';
import { DashboardOverview } from './DashboardOverview';
import { ProductsManager } from './ProductsManager';
import { LaminateBrandsManager } from './LaminateBrandsManager';
import { CataloguesManager } from './CataloguesManager';
import { BlogsManager } from './BlogsManager';
import { InquiriesManager } from './InquiriesManager';
import { MediaManager } from './MediaManager';
import { PageContentManager } from './PageContentManager';
import { SettingsManager } from './SettingsManager';
import { NavigationManager } from './NavigationManager';
import { TranslationsManager } from './TranslationsManager';
import { UsersManager } from './UsersManager';
import { AuditLogsView } from './AuditLogsView';

interface AdminAppProps {
  onBackToWebsite: () => void;
}

export const AdminApp: React.FC<AdminAppProps> = ({ onBackToWebsite }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    // Check existing authentication session
    authFetch('/api/auth/me')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Not authenticated');
      })
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await authFetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('admin_token');
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcf9f8] flex items-center justify-center text-[#000d22]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#000d22]/20 border-t-[#000d22] rounded-full animate-spin" />
          <span className="text-sm font-semibold">Verifying Secure CMS Session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AdminLogin
        onLoginSuccess={(u) => setUser(u)}
        onBackToWebsite={onBackToWebsite}
      />
    );
  }

  return (
    <AdminLayout
      user={user}
      activeSection={activeSection}
      onNavigate={(sec) => setActiveSection(sec)}
      onLogout={handleLogout}
      onViewPublicWebsite={onBackToWebsite}
    >
      {activeSection === 'dashboard' && (
        <DashboardOverview onNavigate={(sec) => setActiveSection(sec)} />
      )}
      {activeSection === 'products' && <ProductsManager />}
      {activeSection === 'laminates' && <LaminateBrandsManager />}
      {activeSection === 'catalogues' && <CataloguesManager />}
      {activeSection === 'blogs' && <BlogsManager />}
      {activeSection === 'inquiries' && <InquiriesManager />}
      {activeSection === 'media' && <MediaManager />}
      {activeSection === 'content' && <PageContentManager />}
      {activeSection === 'settings' && <SettingsManager />}
      {activeSection === 'navigation' && <NavigationManager />}
      {activeSection === 'translations' && <TranslationsManager />}
      {activeSection === 'users' && <UsersManager />}
      {activeSection === 'audit-logs' && <AuditLogsView />}
    </AdminLayout>
  );
};

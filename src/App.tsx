import React, { useState, useEffect } from 'react';
import { ViewType, Language, Product, BlogPost } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { ProductsView } from './views/ProductsView';
import { LaminatesView } from './views/LaminatesView';
import { AboutView } from './views/AboutView';
import { BlogView } from './views/BlogView';
import { ContactView } from './views/ContactView';
import { QuoteModal } from './components/QuoteModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { BlogDetailModal } from './components/BlogDetailModal';
import { Toast } from './components/Toast';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { cmsApi } from './lib/cmsApi';

export default function App() {
  // Determine initial view based on URL path or hash
  const getInitialView = (): ViewType => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.startsWith('/admin') || hash.includes('admin')) {
      return 'admin';
    }
    return 'home';
  };

  const [currentView, setCurrentView] = useState<ViewType>(getInitialView);
  const [lang, setLang] = useState<Language>('EN');

  // Sync URL history on view change
  const handleSetCurrentView = (view: ViewType) => {
    setCurrentView(view);
    if (view === 'admin') {
      if (!window.location.pathname.startsWith('/admin')) {
        window.history.pushState({}, '', '/admin');
      }
    } else {
      if (window.location.pathname.startsWith('/admin')) {
        window.history.pushState({}, '', '/');
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.startsWith('/admin') || hash.includes('admin')) {
        setCurrentView('admin');
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Admin Auth State
  const [adminUser, setAdminUser] = useState<any>(() => {
    const saved = localStorage.getItem('mahadev_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Modals state
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [prefillProduct, setPrefillProduct] = useState<string | undefined>(undefined);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleOpenQuoteModal = (productName?: string) => {
    setPrefillProduct(productName);
    setQuoteModalOpen(true);
  };

  const handleLoginSuccess = (user: any) => {
    setAdminUser(user);
    localStorage.setItem('mahadev_admin_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    cmsApi.logout();
    setAdminUser(null);
    localStorage.removeItem('mahadev_admin_user');
    setCurrentView('admin');
  };

  // If viewing admin route, render admin views separately
  if (currentView === 'admin') {
    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onBackToWebsite={() => handleSetCurrentView('home')}
        />
      );
    }
    return (
      <AdminLayout
        currentUser={adminUser}
        onLogout={handleLogout}
        onBackToWebsite={() => handleSetCurrentView('home')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf9f8] text-[#1c1b1b] font-sans antialiased selection:bg-[#fed488] selection:text-[#785a1a]">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={handleSetCurrentView}
        lang={lang}
        setLang={setLang}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      {/* View Router */}
      <main className="flex-grow flex flex-col w-full">
        {currentView === 'home' && (
          <HomeView
            setCurrentView={handleSetCurrentView}
            lang={lang}
            onOpenQuoteModal={handleOpenQuoteModal}
            onSelectProduct={(product) => setSelectedProduct(product)}
          />
        )}

        {currentView === 'products' && (
          <ProductsView
            lang={lang}
            onOpenQuoteModal={handleOpenQuoteModal}
            onSelectProduct={(product) => setSelectedProduct(product)}
          />
        )}

        {currentView === 'laminates' && (
          <ProductsView
            lang={lang}
            initialCategory="Laminates (Formica)"
            onOpenQuoteModal={handleOpenQuoteModal}
            onSelectProduct={(product) => setSelectedProduct(product)}
          />
        )}

        {currentView === 'about' && (
          <AboutView
            setCurrentView={handleSetCurrentView}
            lang={lang}
            onOpenQuoteModal={() => handleOpenQuoteModal()}
          />
        )}

        {currentView === 'blog' && (
          <BlogView
            lang={lang}
            onSelectPost={(post) => setSelectedPost(post)}
          />
        )}

        {currentView === 'contact' && (
          <ContactView
            lang={lang}
            onSuccessToast={(msg) => setToastMessage(msg)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setCurrentView={handleSetCurrentView} lang={lang} />

      {/* Modals */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => {
          setQuoteModalOpen(false);
          setPrefillProduct(undefined);
        }}
        lang={lang}
        prefillProduct={prefillProduct}
        onSuccess={(msg) => setToastMessage(msg)}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        lang={lang}
        onInquire={(productName) => handleOpenQuoteModal(productName)}
      />

      <BlogDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        lang={lang}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Fixed WhatsApp Floating Action Button */}
      <a
        href="https://wa.me/9779851087456"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center border-2 border-white cursor-pointer"
        aria-label="WhatsApp Inquiry"
        title="Chat on WhatsApp"
      >
        <span className="material-symbols-outlined text-3xl">chat</span>
      </a>
    </div>
  );
}

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
import { AdminApp } from './components/admin/AdminApp';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [lang, setLang] = useState<Language>('EN');
  const [isAdminView, setIsAdminView] = useState<boolean>(
    window.location.hash === '#admin' || window.location.pathname.startsWith('/admin')
  );

  // Modals state
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [prefillProduct, setPrefillProduct] = useState<string | undefined>(undefined);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin' || window.location.pathname.startsWith('/admin')) {
        setIsAdminView(true);
      } else {
        setIsAdminView(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSetCurrentView = (view: ViewType) => {
    setCurrentView(view);
  };

  const handleOpenQuoteModal = (productName?: string) => {
    setPrefillProduct(productName);
    setQuoteModalOpen(true);
  };

  if (isAdminView) {
    return (
      <AdminApp
        onBackToWebsite={() => {
          window.location.hash = '';
          setIsAdminView(false);
        }}
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

import React, { useState } from 'react';
import { ViewType, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Logo } from './Logo';

interface NavbarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenQuoteModal: (prefillProduct?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  lang,
  setLang,
  onOpenQuoteModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  const handleNavClick = (view: ViewType) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLanguage = () => {
    setLang(lang === 'EN' ? 'NE' : 'EN');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fcf9f8] border-b border-[#c4c6cf]">
      {/* Top Utility Bar on Desktop */}
      <div className="hidden md:flex justify-between items-center max-w-[1200px] mx-auto px-6 py-2 text-xs text-[#43474e] border-b border-[#e5e2e1]">
        <div className="flex items-center gap-5 lg:gap-6">
          <a
            href="https://maps.app.goo.gl/MX8aGjqAKF6tUd2o7"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#000d22] transition-colors"
            title="Open showroom location in Google Maps"
          >
            <span className="material-symbols-outlined text-sm text-[#775a19]">location_on</span>
            <span>Satdobato, Lalitpur-15</span>
          </a>
          <a href="tel:+977015400921" className="flex items-center gap-1.5 hover:text-[#000d22] transition-colors">
            <span className="material-symbols-outlined text-sm text-[#775a19]">call</span>
            <span>01-5400921 / 9766383188</span>
          </a>
          <span className="hidden lg:flex items-center gap-1.5 text-[#775a19] font-medium">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span>Sun - Fri: 10:00 AM - 7:00 PM | Sat: 10:00 AM - 12:00 PM</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://wa.me/9779766383188"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#25D366] font-bold hover:opacity-80 transition-opacity"
            title="Chat on WhatsApp"
          >
            <span className="material-symbols-outlined text-sm">chat</span>
            <span>WhatsApp</span>
          </a>
          <span className="text-[#c4c6cf]">|</span>
          <a
            href="https://maps.app.goo.gl/MX8aGjqAKF6tUd2o7"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#000d22] flex items-center gap-1 font-semibold text-[#775a19]"
            title="Open showroom location in Google Maps"
          >
            <span className="material-symbols-outlined text-sm">near_me</span>
            <span>{lang === 'EN' ? 'Store Locator' : 'शोरूम नक्शा'}</span>
          </a>
        </div>
      </div>

      {/* Main Nav Bar */}
      <nav className="max-w-[1200px] mx-auto px-6 flex justify-between items-center h-18 lg:h-20">
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          className="cursor-pointer active:scale-95 transition-transform flex items-center py-1 shrink-0"
          title="Mahadev Ply Center Home"
        >
          <Logo variant="full" className="h-10 md:h-12 lg:h-13" />
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-7 xl:gap-9 h-full text-sm font-medium">
          <button
            onClick={() => handleNavClick('home')}
            className={`transition-colors duration-200 cursor-pointer h-full flex items-center px-1 relative ${
              currentView === 'home'
                ? 'text-[#000d22] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#000d22]'
                : 'text-[#43474e] hover:text-[#775a19]'
            }`}
          >
            {t.home}
          </button>
          <button
            onClick={() => handleNavClick('products')}
            className={`transition-colors duration-200 cursor-pointer h-full flex items-center px-1 relative ${
              currentView === 'products'
                ? 'text-[#000d22] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#000d22]'
                : 'text-[#43474e] hover:text-[#775a19]'
            }`}
          >
            {t.products}
          </button>
          <button
            onClick={() => handleNavClick('blog')}
            className={`transition-colors duration-200 cursor-pointer h-full flex items-center px-1 relative ${
              currentView === 'blog'
                ? 'text-[#000d22] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#000d22]'
                : 'text-[#43474e] hover:text-[#775a19]'
            }`}
          >
            {t.blog}
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`transition-colors duration-200 cursor-pointer h-full flex items-center px-1 relative ${
              currentView === 'about'
                ? 'text-[#000d22] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#000d22]'
                : 'text-[#43474e] hover:text-[#775a19]'
            }`}
          >
            {t.aboutUs}
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`transition-colors duration-200 cursor-pointer h-full flex items-center px-1 relative ${
              currentView === 'contact'
                ? 'text-[#000d22] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#000d22]'
                : 'text-[#43474e] hover:text-[#775a19]'
            }`}
          >
            {t.contact}
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#c4c6cf] hover:border-[#000d22] text-xs font-bold text-[#1c1b1b] transition-colors cursor-pointer bg-white/60"
            title="Toggle Language"
          >
            <span className="material-symbols-outlined text-base text-[#775a19]">language</span>
            <span>{lang === 'EN' ? 'नेपाली' : 'English'}</span>
          </button>

          {/* Get a Quote Button */}
          <button
            onClick={() => onOpenQuoteModal()}
            className="hidden sm:block bg-[#000d22] text-white px-4 py-2.5 text-xs lg:text-sm font-bold rounded-lg hover:bg-[#775a19] transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
          >
            {t.getAQuote}
          </button>

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#000d22] p-2 hover:bg-[#f0eded] rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fcf9f8] border-b border-[#c4c6cf] px-6 py-4 flex flex-col gap-2 animate-fadeIn shadow-lg">
          <button
            onClick={() => handleNavClick('home')}
            className={`text-left py-2.5 px-3 rounded-lg font-semibold text-base ${
              currentView === 'home' ? 'bg-[#000d22] text-white' : 'text-[#1c1b1b] hover:bg-black/5'
            }`}
          >
            {t.home}
          </button>
          <button
            onClick={() => handleNavClick('products')}
            className={`text-left py-2.5 px-3 rounded-lg font-semibold text-base ${
              currentView === 'products' ? 'bg-[#000d22] text-white' : 'text-[#1c1b1b] hover:bg-black/5'
            }`}
          >
            {t.products}
          </button>
          <button
            onClick={() => handleNavClick('blog')}
            className={`text-left py-2.5 px-3 rounded-lg font-semibold text-base ${
              currentView === 'blog' ? 'bg-[#000d22] text-white' : 'text-[#1c1b1b] hover:bg-black/5'
            }`}
          >
            {t.blog}
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`text-left py-2.5 px-3 rounded-lg font-semibold text-base ${
              currentView === 'about' ? 'bg-[#000d22] text-white' : 'text-[#1c1b1b] hover:bg-black/5'
            }`}
          >
            {t.aboutUs}
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`text-left py-2.5 px-3 rounded-lg font-semibold text-base ${
              currentView === 'contact' ? 'bg-[#000d22] text-white' : 'text-[#1c1b1b] hover:bg-black/5'
            }`}
          >
            {t.contact}
          </button>

          <div className="pt-3 border-t border-[#c4c6cf] flex flex-col gap-2.5">
            <a
              href="tel:+977015400921"
              className="w-full flex items-center justify-center gap-2 border border-[#000d22] text-[#000d22] py-2.5 rounded-lg font-bold text-sm"
            >
              <span className="material-symbols-outlined text-base">call</span>
              <span>01-5400921 / 9766383188</span>
            </a>
            <a
              href="https://wa.me/9779766383188"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-lg font-bold text-sm"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              <span>WhatsApp Us</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full bg-[#000d22] text-white py-3 rounded-lg font-bold text-center text-sm shadow-sm"
            >
              {t.getAQuote}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

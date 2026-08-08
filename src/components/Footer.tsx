import React from 'react';
import { ViewType, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Logo } from './Logo';

interface FooterProps {
  setCurrentView: (view: ViewType) => void;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView, lang }) => {
  const t = TRANSLATIONS[lang];

  const navigateTo = (view: ViewType) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#f0eded] border-t border-[#c4c6cf] mt-auto">
      <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Info */}
        <div className="flex flex-col gap-3">
          <div 
            onClick={() => navigateTo('home')} 
            className="cursor-pointer active:scale-95 transition-transform max-w-fit mb-1"
            title="Mahadev Ply Center"
          >
            <Logo variant="full" className="h-16" />
          </div>
          <p className="text-[#43474e] text-sm leading-relaxed max-w-xs">
            {lang === 'EN'
              ? 'Your trusted partner for premium plywood, veneers, laminates, and hardware solutions in Nepal.'
              : 'नेपालमा गुणस्तरीय प्लाइभूड, भेनियर, ल्यामिनेट र हार्डवेयर सामग्रीको भरपर्दो केन्द्र।'}
          </p>
          <div className="flex flex-col gap-2 text-sm text-[#43474e] mt-2">
            <a
              href="https://maps.app.goo.gl/MX8aGjqAKF6tUd2o7"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#775a19] transition-colors"
              title="Open Google Maps"
            >
              <span className="material-symbols-outlined text-[#775a19] text-base">location_on</span>
              Satdobato, Lalitpur-15, Nepal
            </a>
            <a
              href="tel:+977015400921"
              className="flex items-center gap-2 hover:text-[#775a19] transition-colors"
            >
              <span className="material-symbols-outlined text-[#775a19] text-base">call</span>
              01-5400921 / 9766383188
            </a>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#775a19] text-base">mail</span>
              info@mahadevply.com.np
            </span>
            <div className="flex flex-col gap-1 mt-1">
              <a
                href="https://www.facebook.com/p/Mahadev-Ply-Center-61565692444993/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#1877F2] font-semibold text-xs hover:underline max-w-fit"
              >
                <span className="material-symbols-outlined text-sm">share</span>
                <span>{lang === 'EN' ? 'Mahadev Ply Center on Facebook' : 'फेसबुक पेज'}</span>
              </a>
              <a
                href="https://www.instagram.com/mahadevplycenter/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#E4405F] font-semibold text-xs hover:underline max-w-fit"
              >
                <span className="material-symbols-outlined text-sm">photo_camera</span>
                <span>{lang === 'EN' ? '@mahadevplycenter on Instagram' : 'इन्स्टाग्राममा जोडिनुहोस्'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div className="flex flex-col gap-3">
          <h4 className="font-label-lg text-[#000d22] uppercase tracking-wider text-xs">
            {lang === 'EN' ? 'Quick Links' : 'मुख्य लिङ्कहरू'}
          </h4>
          <div className="flex flex-col gap-2 text-sm text-[#43474e]">
            <button
              onClick={() => navigateTo('home')}
              className="text-left hover:text-[#775a19] transition-colors cursor-pointer"
            >
              {t.home}
            </button>
            <button
              onClick={() => navigateTo('products')}
              className="text-left hover:text-[#775a19] transition-colors cursor-pointer"
            >
              {t.products}
            </button>
            <button
              onClick={() => navigateTo('blog')}
              className="text-left hover:text-[#775a19] transition-colors cursor-pointer"
            >
              {t.blog}
            </button>
            <button
              onClick={() => navigateTo('about')}
              className="text-left hover:text-[#775a19] transition-colors cursor-pointer"
            >
              {t.aboutUs}
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className="text-left hover:text-[#775a19] transition-colors cursor-pointer"
            >
              {t.contact}
            </button>
          </div>
        </div>

        {/* Working Hours & Showroom Direction */}
        <div className="flex flex-col gap-3">
          <h4 className="font-label-lg text-[#000d22] uppercase tracking-wider text-xs">
            {lang === 'EN' ? 'Showroom Hours' : 'शोरूम समय'}
          </h4>
          <div className="text-sm text-[#43474e] space-y-1">
            <p><strong>Sun - Fri:</strong> 10:00 AM - 7:00 PM</p>
            <p><strong>Saturday:</strong> 10:00 AM - 12:00 PM</p>
          </div>
          <a
            href="https://maps.app.goo.gl/MX8aGjqAKF6tUd2o7"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 bg-[#000d22] hover:bg-[#775a19] text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer max-w-fit"
          >
            <span className="material-symbols-outlined text-lg">directions</span>
            {t.getDirections}
          </a>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-[#c4c6cf] py-4 px-6 text-center text-xs text-[#43474e]">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>{t.allRightsReserved}</span>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">{lang === 'EN' ? 'Privacy Policy' : 'गोपनीयता नीति'}</a>
            <a href="#" className="hover:underline">{lang === 'EN' ? 'Terms of Service' : 'सेवाका शर्तहरू'}</a>
            <button onClick={() => navigateTo('admin')} className="hover:underline font-semibold text-[#000d22] cursor-pointer">
              Admin CMS Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

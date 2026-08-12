import React, { useState, useEffect } from 'react';
import { Language, ContactPageContent, SiteSettings } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Logo } from '../components/Logo';

interface ContactViewProps {
  lang: Language;
  onSuccessToast: (msg: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({
  lang,
  onSuccessToast,
}) => {
  const t = TRANSLATIONS[lang];

  const [contactData, setContactData] = useState<ContactPageContent | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetch('/api/public/data')
      .then((res) => res.json())
      .then((data) => {
        if (data.contactContent) setContactData(data.contactContent);
        if (data.siteSettings) setSiteSettings(data.siteSettings);
      })
      .catch((err) => console.error('Failed fetching contact page data:', err));
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
    productInterest: 'Plywood Sheets (18mm / BWP)',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/public/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          category: formData.productInterest,
          message: formData.message,
          projectType: 'Contact Page Inquiry',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed submitting inquiry.');
      onSuccessToast(t.successToast);
      setFormData({
        name: '',
        phone: '',
        message: '',
        productInterest: 'Plywood Sheets (18mm / BWP)',
      });
    } catch (err: any) {
      alert(err.message || 'Failed submitting inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#fcf9f8] min-h-screen py-10 pb-20">
      {/* Hero Header */}
      <section className="w-full px-6 py-8 max-w-[1200px] mx-auto text-center md:text-left flex flex-col md:flex-row gap-8 items-center justify-between">
        <div className="flex-1 max-w-2xl">
          <span className="text-xs font-bold text-[#775a19] uppercase tracking-wider block mb-2">
            {lang === 'EN' ? 'Contact Us' : 'सम्पर्क गर्नुहोस्'}
          </span>
          <h1 className="font-display-lg-mobile md:text-5xl font-bold text-[#000d22] mb-4">
            {lang === 'EN' ? 'Get in Touch' : 'हामीलाई सम्पर्क गर्नुहोस्'}
          </h1>
          <p className="text-[#43474e] text-base md:text-lg leading-relaxed">
            {lang === 'EN'
              ? "We're here to help you find the perfect wood products for your project. Reach out to us via phone, WhatsApp, or visit our showroom in Satdobato, Lalitpur."
              : 'तपाईंको परियोजनाका लागि उपयुक्त सामग्री चयन गर्न हामी सहयोग गर्छौं। फोन, व्हाट्सएप वा सोझै हाम्रा सोरुममा सम्पर्क गर्नुहोस्।'}
          </p>
        </div>

        <div className="flex-1 hidden md:flex items-center justify-center rounded-2xl bg-white shadow-sm border border-[#c4c6cf] overflow-hidden relative min-h-[220px]">
          {contactData?.showroomImage ? (
            <img
              src={contactData.showroomImage}
              alt="Mahadev Ply Center Showroom"
              className="w-full h-full object-cover max-h-[260px]"
            />
          ) : (
            <div className="p-8">
              <Logo variant="full" className="h-28" />
            </div>
          )}
        </div>
      </section>

      {/* 5 Big Actions Cards */}
      <section className="w-full px-6 py-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Call Card */}
          <a
            href="tel:+977015400921"
            className="flex flex-col items-center justify-center p-5 bg-[#f6f3f2] rounded-2xl border border-[#c4c6cf] hover:border-[#000d22] transition-all group cursor-pointer shadow-xs min-h-[180px] text-center"
          >
            <div className="w-12 h-12 bg-[#000d22] text-white rounded-full flex items-center justify-center mb-3 group-hover:bg-[#775a19] transition-colors">
              <span className="material-symbols-outlined text-xl">call</span>
            </div>
            <h3 className="font-title-lg text-sm font-bold text-[#000d22] mb-1">
              {t.callUs}
            </h3>
            <p className="text-xs font-semibold text-[#43474e]">01-5400921<br />9766383188</p>
          </a>

          {/* WhatsApp Card */}
          <a
            href="https://wa.me/9779766383188"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-5 bg-[#f6f3f2] rounded-2xl border border-[#c4c6cf] hover:border-[#25D366] transition-all group cursor-pointer shadow-xs min-h-[180px] text-center"
          >
            <div className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center mb-3 group-hover:bg-[#1fbd59] transition-colors">
              <span className="material-symbols-outlined text-xl">chat</span>
            </div>
            <h3 className="font-title-lg text-sm font-bold text-[#000d22] mb-1">
              {t.whatsapp}
            </h3>
            <p className="text-xs font-semibold text-[#43474e]">
              +977 9766383188
            </p>
          </a>

          {/* Instagram Card */}
          <a
            href="https://www.instagram.com/mahadevplycenter/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-5 bg-[#f6f3f2] rounded-2xl border border-[#c4c6cf] hover:border-[#E4405F] transition-all group cursor-pointer shadow-xs min-h-[180px] text-center"
          >
            <div className="w-12 h-12 bg-[#E4405F] text-white rounded-full flex items-center justify-center mb-3 group-hover:bg-[#d02d4c] transition-colors">
              <span className="material-symbols-outlined text-xl">photo_camera</span>
            </div>
            <h3 className="font-title-lg text-sm font-bold text-[#000d22] mb-1">
              {lang === 'EN' ? 'Instagram' : 'इन्स्टाग्राम'}
            </h3>
            <p className="text-xs font-semibold text-[#E4405F]">
              @mahadevplycenter
            </p>
          </a>

          {/* Facebook Page Card */}
          <a
            href="https://www.facebook.com/p/Mahadev-Ply-Center-61565692444993/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-5 bg-[#f6f3f2] rounded-2xl border border-[#c4c6cf] hover:border-[#1877F2] transition-all group cursor-pointer shadow-xs min-h-[180px] text-center"
          >
            <div className="w-12 h-12 bg-[#1877F2] text-white rounded-full flex items-center justify-center mb-3 group-hover:bg-[#115cc4] transition-colors">
              <span className="material-symbols-outlined text-xl">share</span>
            </div>
            <h3 className="font-title-lg text-sm font-bold text-[#000d22] mb-1">
              {lang === 'EN' ? 'Facebook' : 'फेसबुक'}
            </h3>
            <p className="text-xs font-semibold text-[#1877F2]">
              Mahadev Ply Center
            </p>
          </a>

          {/* Location Card */}
          <a
            href="https://maps.app.goo.gl/MX8aGjqAKF6tUd2o7"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-5 bg-[#f6f3f2] rounded-2xl border border-[#000d22] hover:bg-white transition-all group cursor-pointer shadow-xs min-h-[180px] text-center"
          >
            <div className="w-12 h-12 bg-[#000d22] text-white rounded-full flex items-center justify-center mb-3 group-hover:bg-[#775a19] transition-colors">
              <span className="material-symbols-outlined text-xl">location_on</span>
            </div>
            <h3 className="font-title-lg text-sm font-bold text-[#000d22] mb-1">
              {t.visitShowroom}
            </h3>
            <p className="text-xs font-semibold text-[#43474e]">
              Satdobato, Lalitpur-15
            </p>
          </a>
        </div>
      </section>

      {/* Form & Map Section */}
      <section className="w-full px-6 py-10 max-w-[1200px] mx-auto mt-6 bg-[#f6f3f2] rounded-2xl border border-[#c4c6cf]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
          {/* Form */}
          <div className="p-2 md:p-6 flex flex-col justify-center">
            <h2 className="font-headline-md text-2xl font-bold text-[#000d22] mb-6">
              {t.quickInquiry}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#000d22] uppercase tracking-wider mb-1">
                  {t.name} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ram Bahadur Shrestha"
                  className="w-full min-h-[52px] px-4 bg-white border border-[#000d22] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#775a19]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#000d22] uppercase tracking-wider mb-1">
                  {t.phone} *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+977 98XXXXXXXX"
                  className="w-full min-h-[52px] px-4 bg-white border border-[#000d22] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#775a19]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#000d22] uppercase tracking-wider mb-1">
                  {lang === 'EN' ? 'Product Interest' : 'सामग्री रुचि'}
                </label>
                <select
                  value={formData.productInterest}
                  onChange={(e) => setFormData({ ...formData, productInterest: e.target.value })}
                  className="w-full min-h-[52px] px-4 bg-white border border-[#000d22] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#775a19]"
                >
                  <option value="Plywood Sheets (18mm / BWP)">Plywood Sheets (18mm / BWP Marine)</option>
                  <option value="Natural Walnut / Oak Veneers">Natural & Smoked Veneers</option>
                  <option value="1mm Decorative Laminates">1mm High Pressure Laminates</option>
                  <option value="Architectural Door Hardware & Handles">Door Handles & Locks</option>
                  <option value="Smart Biometric Digital Locks">Smart Digital Security Locks</option>
                  <option value="Plain MDF & Particle Boards">MDF & Particle Boards</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#000d22] uppercase tracking-wider mb-1">
                  {t.message}
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={
                    lang === 'EN'
                      ? 'Specify size, required quantity, or delivery requirements...'
                      : 'नाप, आवश्यक संख्या वा अन्य सोधपुछ लेख्नुहोस्...'
                  }
                  className="w-full px-4 py-3 bg-white border border-[#000d22] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#775a19]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[56px] bg-[#000d22] hover:bg-[#775a19] text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer text-base shadow-md"
              >
                {isSubmitting ? (
                  <span>{lang === 'EN' ? 'Sending...' : 'पठाउँदै...'}</span>
                ) : (
                  <>
                    <span>{t.sendInquiry}</span>
                    <span className="material-symbols-outlined text-lg">send</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Map */}
          <div
            id="location-map"
            className="min-h-[380px] md:min-h-full bg-[#e5e2e1] rounded-2xl border border-[#c4c6cf] overflow-hidden relative shadow-md"
          >
            <iframe
              src="https://maps.google.com/maps?q=Mahadev%20Ply%20Center%20Satdobato%20Lalitpur%20Nepal&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mahadev Ply Center Google Maps"
              className="w-full h-full min-h-[380px]"
            ></iframe>
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs p-4 rounded-xl border border-[#c4c6cf] shadow-md z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-[#000d22] text-sm">Mahadev Ply Center</p>
                <p className="text-xs text-[#43474e]">
                  Ring Road Junction, Satdobato, Lalitpur-15, Nepal
                </p>
                <p className="text-xs text-[#775a19] font-semibold mt-0.5">
                  Near Satdobato Swimming Complex
                </p>
              </div>
              <a
                href="https://maps.app.goo.gl/MX8aGjqAKF6tUd2o7"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#000d22] hover:bg-[#775a19] text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">directions</span>
                <span>{lang === 'EN' ? 'Open Google Maps' : 'गुगल नक्शा'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

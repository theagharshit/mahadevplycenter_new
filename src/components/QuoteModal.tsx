import React, { useState } from 'react';
import { Language, QuoteRequest } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Logo } from './Logo';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  prefillProduct?: string;
  onSuccess: (msg: string) => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  lang,
  prefillProduct,
  onSuccess,
}) => {
  const t = TRANSLATIONS[lang];
  const [formData, setFormData] = useState<QuoteRequest>({
    name: '',
    phone: '',
    category: prefillProduct || 'Plywood',
    quantity: '10 Sheets',
    projectType: 'Residential Interior',
    message: '',
    city: 'Lalitpur / Kathmandu',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/public/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed submitting quote inquiry.');
      onSuccess(t.successToast);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed submitting quote inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#fcf9f8] rounded-2xl max-w-lg w-full border border-[#c4c6cf] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#000d22] text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Logo variant="emblem" size="sm" lightText />
            <div>
              <h3 className="font-title-lg font-bold">{t.getAQuote}</h3>
              <p className="text-xs text-[#718bb7] mt-0.5">
                {lang === 'EN'
                  ? 'Fill out your requirements for an immediate tailored price quotation.'
                  : 'तपाईंको आवश्यकता अनुसार तुरुन्तै मूल्य अनुमान लिनुहोस्।'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-[#fed488] p-1 rounded-full cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {prefillProduct && (
            <div className="bg-[#f0eded] border border-[#775a19] p-3 rounded-lg text-sm text-[#000d22] font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[#775a19]">inventory_2</span>
              <span>
                {lang === 'EN' ? 'Inquiring for: ' : 'सोधपुछ सामग्री: '}
                <strong>{prefillProduct}</strong>
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#000d22] uppercase tracking-wider mb-1">
              {t.name} *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={lang === 'EN' ? 'e.g. Ram Shrestha' : 'उदा. राम श्रेष्ठ'}
              className="w-full px-4 py-2.5 bg-white border border-[#000d22] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#775a19]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="w-full px-4 py-2.5 bg-white border border-[#000d22] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#775a19]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#000d22] uppercase tracking-wider mb-1">
                {t.city}
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Lalitpur, Kathmandu, Bhaktapur..."
                className="w-full px-4 py-2.5 bg-white border border-[#000d22] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#775a19]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#000d22] uppercase tracking-wider mb-1">
                {t.categories}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#000d22] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#775a19]"
              >
                <option value="Plywood">Plywood (Commercial / Marine)</option>
                <option value="Hardware">Door Hardware & Handles</option>
                <option value="Locks & Security">Locks & Smart Security</option>
                <option value="Veneers">Natural & Smoked Veneers</option>
                <option value="Laminates">1mm Decorative Laminates</option>
                <option value="MDF & Particle Board">MDF & Particle Board</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#000d22] uppercase tracking-wider mb-1">
                {lang === 'EN' ? 'Approx Quantity' : 'अनुमानित परिमाण'}
              </label>
              <input
                type="text"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="e.g. 15 sheets / 10 pairs"
                className="w-full px-4 py-2.5 bg-white border border-[#000d22] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#775a19]"
              />
            </div>
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
                  ? 'Describe your project (e.g., modular kitchen 18mm BWP, door handles)...'
                  : 'तपाईंको परियोजनाको विवरण दिनुहोस्...'
              }
              className="w-full px-4 py-2.5 bg-white border border-[#000d22] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#775a19]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#000d22] hover:bg-[#775a19] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md text-base"
          >
            {isSubmitting ? (
              <span>{lang === 'EN' ? 'Submitting...' : 'पठाउँदै...'}</span>
            ) : (
              <>
                <span>{t.sendInquiry}</span>
                <span className="material-symbols-outlined text-lg">send</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

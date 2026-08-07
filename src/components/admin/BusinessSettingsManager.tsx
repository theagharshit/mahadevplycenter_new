import React, { useState } from 'react';
import { Save, Building2, Phone, MapPin, Mail, Globe, Share2, Search } from 'lucide-react';
import { CMSData, cmsApi, SiteSettings } from '../../lib/cmsApi';

interface BusinessSettingsManagerProps {
  data: CMSData;
  onRefreshData: () => void;
  onShowToast: (msg: string) => void;
}

export const BusinessSettingsManager: React.FC<BusinessSettingsManagerProps> = ({
  data,
  onRefreshData,
  onShowToast,
}) => {
  const [formData, setFormData] = useState<SiteSettings>({ ...data.siteSettings });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await cmsApi.updateSettings(formData);
      onShowToast('Business details & SEO settings saved successfully!');
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed saving business settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Business & SEO Settings</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure Mahadev Ply Center hotline phone numbers, WhatsApp contact link, Satdobato showroom map, and SEO meta tags
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="bg-[#000d22] hover:bg-[#0b2240] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Save className="w-4 h-4 text-[#f2b800]" />
          <span>{isSaving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Info */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <Phone className="w-5 h-5 text-[#000d22]" />
            <h2 className="text-lg font-bold text-zinc-900">Hotline Phones & WhatsApp Numbers</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Primary Phone / Mobile *</label>
              <input
                type="text"
                required
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+977 9851087456"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 font-mono font-bold focus:outline-none focus:border-[#000d22]"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Secondary Phone / Landline</label>
              <input
                type="text"
                value={formData.altPhone || ''}
                onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                placeholder="+977 01-5543210"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 font-mono font-bold focus:outline-none focus:border-[#000d22]"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">WhatsApp Direct Number *</label>
              <input
                type="text"
                required
                value={formData.whatsappNumber || ''}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="9779851087456"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 font-mono font-bold text-emerald-700 focus:outline-none focus:border-[#000d22]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Official Inquiry Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@mahadevply.com"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#000d22]"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Showroom Opening Hours</label>
              <input
                type="text"
                value={formData.openingHours || ''}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                placeholder="Sun - Fri: 8:00 AM - 7:00 PM"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#000d22]"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Official Facebook Page URL</label>
              <input
                type="text"
                value={formData.facebookUrl || ''}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                placeholder="https://www.facebook.com/p/Mahadev-Ply-Center-61565692444993/"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#000d22]"
              />
            </div>
          </div>
        </div>

        {/* Location & Maps */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <MapPin className="w-5 h-5 text-[#000d22]" />
            <h2 className="text-lg font-bold text-zinc-900">Showroom Address & Google Maps Embed</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Full Showroom Address</label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Satdobato Ringroad, Lalitpur, Nepal"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-[#000d22]"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">City / Region Tag</label>
              <input
                type="text"
                value={formData.storeLocation || ''}
                onChange={(e) => setFormData({ ...formData, storeLocation: e.target.value })}
                placeholder="Satdobato & Chabahil, Kathmandu Valley"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#000d22]"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-zinc-700 mb-1">Google Maps Embed URL</label>
            <input
              type="text"
              value={formData.mapsEmbedUrl || ''}
              onChange={(e) => setFormData({ ...formData, mapsEmbedUrl: e.target.value })}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 font-mono text-[11px] focus:outline-none focus:border-[#000d22]"
            />
          </div>
        </div>

        {/* SEO Meta Tags */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <Search className="w-5 h-5 text-[#000d22]" />
            <h2 className="text-lg font-bold text-zinc-900">Search Engine Optimization (SEO)</h2>
          </div>

          <div className="text-xs space-y-3">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Website Meta Title</label>
              <input
                type="text"
                value={formData.metaTitle || ''}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Website Meta Description</label>
              <textarea
                rows={3}
                value={formData.metaDescription || ''}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-3 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#000d22] hover:bg-[#0b2240] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all cursor-pointer shadow-lg"
          >
            {isSaving ? 'Saving...' : 'Save All Business Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { Save, FileText, Layout, Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import { CMSData, cmsApi, SiteSettings } from '../../lib/cmsApi';

interface PageContentManagerProps {
  data: CMSData;
  onRefreshData: () => void;
  onShowToast: (msg: string) => void;
}

export const PageContentManager: React.FC<PageContentManagerProps> = ({
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
      onShowToast('Page content & hero settings updated successfully!');
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed saving page content');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Hero Section & Page Content</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage public website hero titles, subtitle texts, badge banners, and brand taglines
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="bg-[#000d22] hover:bg-[#0b2240] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Save className="w-4 h-4 text-[#f2b800]" />
          <span>{isSaving ? 'Saving Changes...' : 'Save Page Content'}</span>
        </button>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Hero Banner Settings */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <Layout className="w-5 h-5 text-[#000d22]" />
            <h2 className="text-lg font-bold text-zinc-900">Homepage Hero Banner Controls</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">
                Hero Headline (English)
              </label>
              <input
                type="text"
                value={formData.heroHeadline || ''}
                onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#000d22]"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">
                Hero Headline (Nepali - देवनागरी)
              </label>
              <input
                type="text"
                value={formData.heroHeadlineNe || ''}
                onChange={(e) => setFormData({ ...formData, heroHeadlineNe: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#000d22]"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-zinc-700 mb-1">Hero Subtitle Text</label>
            <textarea
              rows={3}
              value={formData.heroSubtitle || ''}
              onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-3 text-xs leading-relaxed focus:outline-none focus:border-[#000d22]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Badge Banner Pill Text</label>
              <input
                type="text"
                value={formData.heroBadgeText || ''}
                onChange={(e) => setFormData({ ...formData, heroBadgeText: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#000d22]"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Hero Banner Image URL</label>
              <input
                type="text"
                value={formData.bannerImage || ''}
                onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#000d22]"
              />
            </div>
          </div>

          {/* Banner Preview */}
          {formData.bannerImage && (
            <div className="pt-2">
              <span className="block text-[11px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">
                Hero Image Live Preview:
              </span>
              <div className="relative rounded-2xl overflow-hidden h-40 border border-zinc-200">
                <img
                  src={formData.bannerImage}
                  alt="Hero Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                  <span className="text-amber-400 font-bold text-xs">{formData.heroBadgeText}</span>
                  <p className="text-white font-bold text-sm">{formData.heroHeadline}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Taglines & Brand Identity */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <Sparkles className="w-5 h-5 text-[#000d22]" />
            <h2 className="text-lg font-bold text-zinc-900">Brand Name & Tagline Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Brand Name</label>
              <input
                type="text"
                value={formData.brandName || ''}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 font-bold focus:outline-none focus:border-[#000d22]"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Primary Tagline (EN)</label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#000d22]"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Tagline (Nepali)</label>
              <input
                type="text"
                value={formData.taglineNe || ''}
                onChange={(e) => setFormData({ ...formData, taglineNe: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#000d22]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#000d22] hover:bg-[#0b2240] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 text-[#f2b800]" />
            <span>{isSaving ? 'Saving...' : 'Apply & Publish Content'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

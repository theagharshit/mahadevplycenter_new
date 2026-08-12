import React, { useState, useEffect } from 'react';
import { Settings, Save, Shield, Globe, MapPin, Phone, Palette, Layout } from 'lucide-react';
import { SiteSettings } from '../../types';
import { authFetch } from '../../utils/api';

export const SettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    authFetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        setSettings(data.siteSettings);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await authFetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error('Failed updating settings.');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="py-12 text-center text-slate-400">Loading website settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-teal-400" />
            Website Global Settings & Branding
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure store contact information, WhatsApp numbers, SEO metadata, and primary hero text.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium px-5 py-2.5 rounded-xl shadow transition flex items-center gap-2"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {savedSuccess ? 'Settings Saved!' : 'Save All Settings'}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs text-slate-200">
        {/* Section 1: Business Identity */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 text-teal-400 border-b border-slate-700 pb-3">
            <Globe className="w-4 h-4" /> Store Identity & Contact Channels
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Brand Name</label>
              <input
                type="text"
                value={settings.brandName || ''}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">WhatsApp Lead Phone Number</label>
              <input
                type="text"
                value={settings.whatsappNumber || ''}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Primary Store Phone</label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Alternate Phone / Hotline</label>
              <input
                type="text"
                value={settings.altPhone || ''}
                onChange={(e) => setSettings({ ...settings, altPhone: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-teal-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Store Address & Locations</label>
              <input
                type="text"
                value={settings.address || ''}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Hero Banner Customizer */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 text-amber-400 border-b border-slate-700 pb-3">
            <Layout className="w-4 h-4" /> Homepage Hero Banner CMS
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Hero Badge Text</label>
              <input
                type="text"
                value={settings.heroBadgeText || ''}
                onChange={(e) => setSettings({ ...settings, heroBadgeText: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Hero Main Headline (English)</label>
              <input
                type="text"
                value={settings.heroHeadline || ''}
                onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-amber-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Hero Main Headline (Nepali Translation)</label>
              <input
                type="text"
                value={settings.heroHeadlineNe || ''}
                onChange={(e) => setSettings({ ...settings, heroHeadlineNe: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Hero Subtitle Paragraph</label>
              <textarea
                rows={2}
                value={settings.heroSubtitle || ''}
                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: SEO & Search Engine Optimization */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 text-indigo-400 border-b border-slate-700 pb-3">
            <Shield className="w-4 h-4" /> SEO & Google Indexing Metadata
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Meta Title Tag</label>
              <input
                type="text"
                value={settings.metaTitle || ''}
                onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Meta Description</label>
              <textarea
                rows={2}
                value={settings.metaDescription || ''}
                onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Keywords (Comma Separated)</label>
              <input
                type="text"
                value={settings.keywords || ''}
                onChange={(e) => setSettings({ ...settings, keywords: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

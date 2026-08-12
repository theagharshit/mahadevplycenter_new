import React, { useState, useEffect } from 'react';
import { Languages, Save, Search, Plus, Trash2 } from 'lucide-react';
import { authFetch } from '../../utils/api';

export const TranslationsManager: React.FC = () => {
  const [translations, setTranslations] = useState<{ [key: string]: { en: string; ne: string } }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    authFetch('/api/admin/translations')
      .then((res) => res.json())
      .then((data) => {
        setTranslations(data.translations || {});
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleUpdate = (key: string, lang: 'en' | 'ne', val: string) => {
    setTranslations({
      ...translations,
      [key]: {
        ...translations[key],
        [lang]: val,
      },
    });
  };

  const handleAddKey = () => {
    const key = prompt('Enter new translation key string (e.g. "request_quote_now"):');
    if (!key) return;
    setTranslations({
      ...translations,
      [key]: { en: 'Request Quote Now', ne: 'अहिले कोटेशन अनुरोध गर्नुहोस्' },
    });
  };

  const handleDelete = (key: string) => {
    if (!confirm(`Delete translation key "${key}"?`)) return;
    const copy = { ...translations };
    delete copy[key];
    setTranslations(copy);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authFetch('/api/admin/translations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ translations }),
      });
      if (!res.ok) throw new Error('Failed saving translations.');
      alert('Translations dictionary updated!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredKeys = Object.keys(translations || {}).filter((k) => {
    const st = (searchTerm || '').toLowerCase();
    const enVal = (translations[k]?.en || '').toLowerCase();
    const neVal = translations[k]?.ne || '';
    return k.toLowerCase().includes(st) || enVal.includes(st) || neVal.includes(searchTerm || '');
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Languages className="w-6 h-6 text-teal-400" />
            Multilingual Translation CMS (EN / NE)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Translate storefront labels, call-to-actions, and headers between English & Nepali.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddKey}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-600 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Key
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Dictionary
          </button>
        </div>
      </div>

      <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search translation terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white pl-9 pr-4 py-2 rounded-lg text-xs outline-none focus:border-teal-500"
          />
        </div>
      </div>

      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-4">
        {filteredKeys.map((key) => (
          <div
            key={key}
            className="p-3.5 bg-slate-900/80 border border-slate-700/60 rounded-xl grid grid-cols-1 md:grid-cols-7 gap-3 items-center text-xs"
          >
            <div className="md:col-span-2 font-mono text-teal-400 font-bold truncate">{key}</div>
            <div className="md:col-span-2">
              <input
                type="text"
                value={translations[key].en}
                onChange={(e) => handleUpdate(key, 'en', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white p-2 rounded outline-none focus:border-teal-500"
                placeholder="English text"
              />
            </div>
            <div className="md:col-span-2">
              <input
                type="text"
                value={translations[key].ne}
                onChange={(e) => handleUpdate(key, 'ne', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white p-2 rounded outline-none focus:border-teal-500 font-sans"
                placeholder="नेपाली पाठ"
              />
            </div>
            <div className="text-right">
              <button
                onClick={() => handleDelete(key)}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

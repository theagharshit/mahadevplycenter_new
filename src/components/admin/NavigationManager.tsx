import React, { useState, useEffect } from 'react';
import { Menu, Plus, Trash2, Save, MoveUp, MoveDown, Eye, EyeOff } from 'lucide-react';
import { NavigationMenuItem } from '../../types';
import { authFetch } from '../../utils/api';

export const NavigationManager: React.FC = () => {
  const [navMenu, setNavMenu] = useState<NavigationMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    authFetch('/api/admin/navigation')
      .then((res) => res.json())
      .then((data) => {
        setNavMenu(data.navigationMenu || []);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleAdd = () => {
    const newItem: NavigationMenuItem = {
      id: 'nav_' + Date.now(),
      label: 'New Link',
      labelNe: 'नयाँ लिङ्क',
      path: '/new-link',
      targetView: 'home',
      position: 'both',
      displayOrder: navMenu.length + 1,
      visible: true,
    };
    setNavMenu([...navMenu, newItem]);
  };

  const handleUpdate = (index: number, key: keyof NavigationMenuItem, val: any) => {
    const updated = [...navMenu];
    updated[index] = { ...updated[index], [key]: val };
    setNavMenu(updated);
  };

  const handleDelete = (index: number) => {
    if (!confirm('Remove this navigation item?')) return;
    const updated = navMenu.filter((_, i) => i !== index);
    setNavMenu(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authFetch('/api/admin/navigation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ navigationMenu: navMenu }),
      });
      if (!res.ok) throw new Error('Failed saving navigation.');
      alert('Navigation menu updated successfully!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-400">Loading navigation structure...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Menu className="w-6 h-6 text-teal-400" />
            Navigation Menu Builder
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Reorder, add, or hide header and footer navigation links across the website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAdd}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-600 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Link
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Navigation
          </button>
        </div>
      </div>

      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-4">
        {navMenu.map((item, index) => (
          <div
            key={item.id}
            className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl grid grid-cols-1 md:grid-cols-6 gap-3 items-center text-xs"
          >
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] text-slate-400 font-semibold uppercase">Label (English & Nepali)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleUpdate(index, 'label', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white p-2 rounded outline-none focus:border-teal-500 font-medium"
                  placeholder="English"
                />
                <input
                  type="text"
                  value={item.labelNe || ''}
                  onChange={(e) => handleUpdate(index, 'labelNe', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white p-2 rounded outline-none focus:border-teal-500"
                  placeholder="नेपाली"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-semibold uppercase">Target View</label>
              <select
                value={item.targetView}
                onChange={(e) => handleUpdate(index, 'targetView', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white p-2 rounded outline-none focus:border-teal-500"
              >
                <option value="home">Home</option>
                <option value="products">Products</option>
                <option value="laminates">Laminates</option>
                <option value="catalogues">Catalogues</option>
                <option value="blog">Blog</option>
                <option value="about">About Us</option>
                <option value="contact">Contact Us</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-semibold uppercase">Position</label>
              <select
                value={item.position || 'both'}
                onChange={(e) => handleUpdate(index, 'position', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white p-2 rounded outline-none focus:border-teal-500"
              >
                <option value="both">Header & Footer</option>
                <option value="header">Header Only</option>
                <option value="footer">Footer Only</option>
              </select>
            </div>

            <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2 md:pt-0">
              <button
                type="button"
                onClick={() => handleUpdate(index, 'visible', !item.visible)}
                className={`p-2 rounded-lg border transition ${
                  item.visible
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
                title="Toggle Visibility"
              >
                {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => handleDelete(index)}
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

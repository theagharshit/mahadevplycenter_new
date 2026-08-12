import React, { useState, useEffect } from 'react';
import { authFetch } from '../../utils/api';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Calendar,
  User,
  Clock,
  Eye,
} from 'lucide-react';
import { BlogPost } from '../../types';
import { ImagePicker } from './ImagePicker';

export const BlogsManager: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    category: 'Plywood Tips',
    snippet: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
    author: 'Mahadev Technical Team',
    readTime: '4 min read',
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/admin/blogs');
      const data = await res.json();
      setBlogs(data.blogPosts || []);
    } catch (err) {
      console.error('Failed loading blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenModal = (blog?: BlogPost) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData(blog);
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        category: 'Plywood Tips',
        snippet: '',
        content: '',
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
        author: 'Mahadev Technical Team',
        readTime: '4 min read',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingBlog ? `/api/admin/blogs/${editingBlog.id}` : '/api/admin/blogs';
      const method = editingBlog ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed saving article.');

      setIsModalOpen(false);
      fetchBlogs();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await authFetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed deleting article.');
      fetchBlogs();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = (blogs || []).filter((b) => {
    const st = (searchTerm || '').toLowerCase();
    return (
      (b?.title || '').toLowerCase().includes(st) ||
      (b?.category || '').toLowerCase().includes(st)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-rose-400" />
            Blog & Articles CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish educational guides, maintenance tips, and material selection articles.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Article
        </button>
      </div>

      <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search article by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white pl-9 pr-4 py-2 rounded-lg text-xs outline-none focus:border-rose-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading blog posts...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">No blog posts found.</div>
        ) : (
          filtered.map((blog) => (
            <div
              key={blog.id}
              className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-rose-500/50 transition"
            >
              <div className="flex flex-col sm:flex-row h-full">
                <div className="sm:w-2/5 h-40 sm:h-auto bg-slate-900 shrink-0">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between text-xs space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      {blog.category}
                    </span>
                    <h3 className="text-sm font-bold text-white line-clamp-2">{blog.title}</h3>
                    <p className="text-slate-400 line-clamp-2 text-[11px]">{blog.snippet}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" /> {blog.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" /> {blog.readTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/50">
                    <button
                      onClick={() => handleOpenModal(blog)}
                      className="p-1.5 text-slate-300 hover:text-rose-300 hover:bg-slate-700 rounded transition flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Blog Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8 text-xs">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white mb-4">
              {editingBlog ? 'Edit Blog Article' : 'Create New Article'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-rose-500"
                  placeholder="e.g. How to Choose Water Proof Plywood for Kitchen Cabinets"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category || 'Plywood Tips'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-rose-500"
                  >
                    <option value="Plywood Tips">Plywood Tips</option>
                    <option value="Hardware Guide">Hardware Guide</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="New Arrivals">New Arrivals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Author Name</label>
                  <input
                    type="text"
                    value={formData.author || ''}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <ImagePicker
                label="Featured Cover Image"
                value={formData.image || ''}
                onChange={(url) => setFormData({ ...formData, image: url })}
                helpText="Upload file, paste image from clipboard, or enter URL"
              />

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Snippet Summary</label>
                <input
                  type="text"
                  required
                  value={formData.snippet || ''}
                  onChange={(e) => setFormData({ ...formData, snippet: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-rose-500"
                  placeholder="A short 1-2 sentence preview for search & grid..."
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Article Content</label>
                <textarea
                  rows={6}
                  required
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-rose-500 font-mono text-xs"
                  placeholder="Write the article paragraphs here..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg shadow"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

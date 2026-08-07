import React, { useState } from 'react';
import { FileText, Plus, Search, Edit2, Trash2, X, User, Clock, Calendar, AlertTriangle } from 'lucide-react';
import { BlogPost } from '../../types';
import { CMSData, cmsApi } from '../../lib/cmsApi';

interface BlogsManagerProps {
  data: CMSData;
  onRefreshData: () => void;
  onShowToast: (msg: string) => void;
}

export const BlogsManager: React.FC<BlogsManagerProps> = ({ data, onRefreshData, onShowToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    category: 'Plywood Tips',
    snippet: '',
    content: '',
    image: '',
    author: 'Mahadev Technical Advisor',
    readTime: '4 min read',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  });

  const filteredPosts = data.blogPosts.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      category: 'Plywood Tips',
      snippet: '',
      content: '',
      image: '',
      author: 'Mahadev Technical Advisor',
      readTime: '4 min read',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({ ...post });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert('Article title and content are required.');
      return;
    }

    try {
      if (editingPost?.id) {
        await cmsApi.updateBlog(editingPost.id, formData);
        onShowToast(`Updated article "${formData.title}"`);
      } else {
        await cmsApi.createBlog(formData);
        onShowToast(`Published new article "${formData.title}"`);
      }
      setIsModalOpen(false);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed saving blog post');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await cmsApi.deleteBlog(deleteId);
      onShowToast('Article deleted successfully');
      setDeleteId(null);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed deleting article');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Blog & Knowledge Guides</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Publish educational guides on plywood grades, hardware maintenance, and interior trends
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#000d22] hover:bg-[#0b2240] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#f2b800]" />
          <span>Write New Article</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search articles by title, category, author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-[#000d22]"
          />
        </div>
        <span className="text-xs text-zinc-500 font-semibold hidden sm:inline">
          {filteredPosts.length} Articles Total
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div>
              <div className="relative h-44 bg-zinc-100 overflow-hidden">
                <img
                  src={post.image || 'https://via.placeholder.com/600x400'}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Blog+Image';
                  }}
                />
                <span className="absolute top-3 left-3 bg-[#000d22] text-[#f2b800] text-[10px] font-bold px-2.5 py-1 rounded-lg shadow">
                  {post.category}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                </div>
                <h3 className="font-bold text-zinc-900 text-base leading-snug line-clamp-2">{post.title}</h3>
                <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">{post.snippet || post.content}</p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-medium flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-zinc-400" />{post.author}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleOpenEdit(post)} className="p-1.5 text-zinc-600 hover:text-[#000d22] hover:bg-zinc-100 rounded-lg cursor-pointer">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteId(post.id)} className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 border border-zinc-200 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6">
              <h2 className="text-xl font-bold text-zinc-900">
                {editingPost?.id ? 'Edit Article' : 'Write New Knowledge Article'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-[#000d22]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Category</label>
                  <select
                    value={formData.category || 'Plywood Tips'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                  >
                    <option value="Plywood Tips">Plywood Tips</option>
                    <option value="Hardware Guide">Hardware Guide</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="New Arrivals">New Arrivals</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={formData.author || ''}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime || ''}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Short Summary</label>
                <input
                  type="text"
                  value={formData.snippet || ''}
                  onChange={(e) => setFormData({ ...formData, snippet: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Full Content *</label>
                <textarea
                  rows={6}
                  required
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-3 leading-relaxed focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border border-zinc-300 text-zinc-600 font-semibold cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#000d22] text-white font-bold cursor-pointer shadow-md">Publish Article</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-zinc-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-50 rounded-2xl"><AlertTriangle className="w-6 h-6" /></div>
              <h3 className="text-lg font-bold text-zinc-900">Delete Blog Post?</h3>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">Are you sure you want to delete this guide?</p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border border-zinc-300 text-zinc-600 text-xs font-semibold cursor-pointer">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer">Delete Article</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

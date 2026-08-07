import React, { useState } from 'react';
import { Star, Plus, Edit2, Trash2, CheckCircle2, XCircle, MessageSquare, HelpCircle, X } from 'lucide-react';
import { Testimonial, FAQ, CMSData, cmsApi } from '../../lib/cmsApi';

interface TestimonialsFaqsManagerProps {
  data: CMSData;
  onRefreshData: () => void;
  onShowToast: (msg: string) => void;
}

export const TestimonialsFaqsManager: React.FC<TestimonialsFaqsManagerProps> = ({
  data,
  onRefreshData,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'testimonials' | 'faqs'>('testimonials');

  // Testimonial Modal
  const [isTestimonialModal, setIsTestimonialModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [tFormData, setTFormData] = useState<Partial<Testimonial>>({
    name: '',
    role: 'Home Owner / Interior Client',
    comment: '',
    rating: 5,
    active: true,
  });

  // FAQ Modal
  const [isFaqModal, setIsFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Partial<FAQ> | null>(null);
  const [faqFormData, setFaqFormData] = useState<Partial<FAQ>>({
    question: '',
    answer: '',
    category: 'Plywood & Quality',
    active: true,
  });

  // --- Testimonial Actions ---
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tFormData.name || !tFormData.comment) {
      alert('Client Name and Review Comment are required.');
      return;
    }

    try {
      if (editingTestimonial?.id) {
        await cmsApi.updateTestimonial(editingTestimonial.id, tFormData);
        onShowToast(`Updated testimonial by "${tFormData.name}"`);
      } else {
        await cmsApi.createTestimonial(tFormData);
        onShowToast(`Added new review by "${tFormData.name}"`);
      }
      setIsTestimonialModal(false);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed saving review');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Delete this client testimonial?')) return;
    try {
      await cmsApi.deleteTestimonial(id);
      onShowToast('Testimonial removed');
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed deleting review');
    }
  };

  // --- FAQ Actions ---
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqFormData.question || !faqFormData.answer) {
      alert('Question and Answer are required.');
      return;
    }

    try {
      if (editingFaq?.id) {
        await cmsApi.updateFAQ(editingFaq.id, faqFormData);
        onShowToast(`Updated FAQ "${faqFormData.question}"`);
      } else {
        await cmsApi.createFAQ(faqFormData);
        onShowToast(`Added new FAQ question`);
      }
      setIsFaqModal(false);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed saving FAQ');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Delete this FAQ item?')) return;
    try {
      await cmsApi.deleteFAQ(id);
      onShowToast('FAQ question deleted');
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed deleting FAQ');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Testimonials & Customer FAQs</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage customer feedback reviews, contractor star ratings, and website frequently asked questions
          </p>
        </div>

        <div className="flex gap-2">
          {activeTab === 'testimonials' ? (
            <button
              onClick={() => {
                setEditingTestimonial(null);
                setTFormData({ name: '', role: 'Interior Client', comment: '', rating: 5, active: true });
                setIsTestimonialModal(true);
              }}
              className="bg-[#000d22] hover:bg-[#0b2240] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4 text-[#f2b800]" />
              <span>Add Review</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingFaq(null);
                setFaqFormData({ question: '', answer: '', category: 'Plywood & Quality', active: true });
                setIsFaqModal(true);
              }}
              className="bg-[#000d22] hover:bg-[#0b2240] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4 text-[#f2b800]" />
              <span>Add FAQ Item</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('testimonials')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'testimonials'
              ? 'border-[#000d22] text-[#000d22]'
              : 'border-transparent text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Customer Testimonials ({data.testimonials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'faqs'
              ? 'border-[#000d22] text-[#000d22]'
              : 'border-transparent text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Frequently Asked Questions ({data.faqs.length})</span>
        </button>
      </div>

      {/* Testimonials List */}
      {activeTab === 'testimonials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < t.rating ? 'fill-amber-400' : 'text-zinc-200'}`}
                      />
                    ))}
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      t.active !== false
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-zinc-100 text-zinc-500'
                    }`}
                  >
                    {t.active !== false ? 'Published' : 'Hidden'}
                  </span>
                </div>

                <p className="text-xs text-zinc-700 italic leading-relaxed">"{t.comment}"</p>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-zinc-900">{t.name}</p>
                  <p className="text-[11px] text-zinc-500">{t.role}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingTestimonial(t);
                      setTFormData({ ...t });
                      setIsTestimonialModal(true);
                    }}
                    className="p-1.5 text-zinc-600 hover:bg-zinc-100 rounded-lg cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTestimonial(t.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAQs List */}
      {activeTab === 'faqs' && (
        <div className="space-y-3">
          {data.faqs.map((f) => (
            <div
              key={f.id}
              className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold">
                    {f.category}
                  </span>
                  <h3 className="font-bold text-zinc-900 text-sm">{f.question}</h3>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed pl-1">{f.answer}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    setEditingFaq(f);
                    setFaqFormData({ ...f });
                    setIsFaqModal(true);
                  }}
                  className="p-1.5 text-zinc-600 hover:bg-zinc-100 rounded-lg cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteFaq(f.id)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Testimonial Modal */}
      {isTestimonialModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-zinc-200 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-lg font-bold text-zinc-900">
                {editingTestimonial ? 'Edit Review' : 'Add Client Review'}
              </h3>
              <button onClick={() => setIsTestimonialModal(false)} className="p-1 text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={tFormData.name || ''}
                  onChange={(e) => setTFormData({ ...tFormData, name: e.target.value })}
                  placeholder="e.g. Er. Rajesh Maharjan"
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Role / Project Type</label>
                <input
                  type="text"
                  value={tFormData.role || ''}
                  onChange={(e) => setTFormData({ ...tFormData, role: e.target.value })}
                  placeholder="e.g. Interior Designer, Sanepa"
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Rating (1 to 5 Stars)</label>
                <select
                  value={tFormData.rating || 5}
                  onChange={(e) => setTFormData({ ...tFormData, rating: Number(e.target.value) })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Review Comment *</label>
                <textarea
                  rows={4}
                  required
                  value={tFormData.comment || ''}
                  onChange={(e) => setTFormData({ ...tFormData, comment: e.target.value })}
                  placeholder="Write client testimonial..."
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-3 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModal(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#000d22] text-white font-bold rounded-xl">
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {isFaqModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-zinc-200 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-lg font-bold text-zinc-900">
                {editingFaq ? 'Edit FAQ' : 'Add FAQ Question'}
              </h3>
              <button onClick={() => setIsFaqModal(false)} className="p-1 text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={faqFormData.question || ''}
                  onChange={(e) => setFaqFormData({ ...faqFormData, question: e.target.value })}
                  placeholder="e.g. Do you deliver plywood across Kathmandu Valley?"
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Category</label>
                <input
                  type="text"
                  value={faqFormData.category || ''}
                  onChange={(e) => setFaqFormData({ ...faqFormData, category: e.target.value })}
                  placeholder="e.g. Delivery & Service / Plywood Quality"
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={faqFormData.answer || ''}
                  onChange={(e) => setFaqFormData({ ...faqFormData, answer: e.target.value })}
                  placeholder="Detailed answer..."
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-3 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsFaqModal(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#000d22] text-white font-bold rounded-xl">
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

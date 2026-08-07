import React from 'react';
import { BlogPost, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface BlogDetailModalProps {
  post: BlogPost | null;
  onClose: () => void;
  lang: Language;
}

export const BlogDetailModal: React.FC<BlogDetailModalProps> = ({
  post,
  onClose,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#fcf9f8] rounded-2xl max-w-3xl w-full border border-[#c4c6cf] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#000d22] text-white px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#fed488] uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-xs text-[#718bb7]">• {post.readTime}</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-[#fed488] p-1 rounded-full cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          <h1 className="font-headline-md md:text-3xl font-bold text-[#000d22]">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-[#74777f] border-b border-[#c4c6cf] pb-4">
            <span className="flex items-center gap-1 font-semibold text-[#1c1b1b]">
              <span className="material-symbols-outlined text-base text-[#775a19]">person</span>
              {post.author}
            </span>
            <span>•</span>
            <span>{post.date}</span>
          </div>

          <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden bg-[#f0eded]">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-sm md:text-base text-[#1c1b1b] leading-relaxed whitespace-pre-line font-body-md">
            {post.content}
          </div>

          <div className="pt-6 border-t border-[#c4c6cf] flex justify-between items-center">
            <span className="text-xs text-[#74777f]">
              {lang === 'EN' ? 'Share this article:' : 'यो लेख सेयर गर्नुहोस्:'}
            </span>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-[#1fbd59]"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              <span>Share via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

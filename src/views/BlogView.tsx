import React, { useState } from 'react';
import { BlogPost, Language } from '../types';
import { BLOG_POSTS } from '../data/blogs';
import { TRANSLATIONS } from '../data/translations';

interface BlogViewProps {
  lang: Language;
  onSelectPost: (post: BlogPost) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ lang, onSelectPost }) => {
  const t = TRANSLATIONS[lang];
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    'All',
    'Plywood Tips',
    'Hardware Guide',
    'Maintenance',
    'New Arrivals',
  ];

  const filteredPosts =
    activeCategory === 'All'
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === activeCategory);

  return (
    <div className="w-full bg-[#fcf9f8] py-12 pb-20 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display-lg-mobile md:text-5xl font-bold text-[#000d22] mb-3">
            {lang === 'EN' ? 'Our Blog' : 'हाम्रो ब्लग'}
          </h1>
          <p className="text-[#43474e] text-base max-w-xl mx-auto">
            {lang === 'EN'
              ? 'Expert advice on plywood grading, door hardware maintenance, and interior timber trends in Nepal.'
              : 'प्लाईभूड, हार्डवेयर र काठका सामग्री सम्बन्धी उपयोगी जानकारी र सल्लाहहरू।'}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full font-bold text-xs transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#000d22] text-white shadow-md'
                  : 'bg-[#eae7e7] text-[#1c1b1b] hover:bg-[#e5e2e1] border border-[#c4c6cf]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="flex flex-col gap-3 group cursor-pointer bg-white p-4 rounded-2xl border border-[#c4c6cf] hover:border-[#000d22] transition-all hover:shadow-lg"
            >
              <div className="w-full h-64 overflow-hidden rounded-xl bg-[#f0eded]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-[#775a19] font-bold uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span className="text-[#74777f]">{post.readTime}</span>
                </div>
                <h2 className="font-headline-md text-xl md:text-2xl font-bold text-[#000d22] group-hover:text-[#455f88] transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-xs text-[#43474e] mt-2 line-clamp-3 leading-relaxed">
                  {post.snippet}
                </p>
                <div className="mt-4 pt-3 border-t border-[#f0eded] flex justify-between items-center text-xs text-[#74777f]">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => {
              alert(
                lang === 'EN'
                  ? 'Showing all available articles!'
                  : 'सबै उपलब्ध लेखहरू देखाइएको छ!'
              );
            }}
            className="border-2 border-[#000d22] text-[#000d22] font-bold px-8 py-3 hover:bg-[#f0eded] transition-colors rounded-lg cursor-pointer text-sm"
          >
            {t.loadMore}
          </button>
        </div>
      </div>
    </div>
  );
};

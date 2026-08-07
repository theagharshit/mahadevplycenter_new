import React from 'react';
import { Product, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  lang: Language;
  onInquire: (productName: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  lang,
  onInquire,
}) => {
  const t = TRANSLATIONS[lang];

  if (!product) return null;

  const whatsappText = encodeURIComponent(
    `Hello Mahadev Ply Center! I am interested in ${product.name} (${product.grade}). Could you please share more details and availability?`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#fcf9f8] rounded-2xl max-w-4xl w-full border border-[#c4c6cf] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Left Giant Image */}
        <div className="md:w-1/2 bg-[#f0eded] relative min-h-[280px] md:min-h-[450px]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="bg-[#000d22] text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
              {product.grade}
            </span>
            <span className="bg-[#fed488] text-[#785a1a] text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
              {product.brand}
            </span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Right Info Section */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto max-h-[80vh] md:max-h-[90vh]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-[#775a19] uppercase tracking-wider">
              {product.category}
            </span>
            <button
              onClick={onClose}
              className="hidden md:block text-[#74777f] hover:text-[#000d22] p-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-title-lg md:text-2xl font-bold text-[#000d22]">
              {product.name}
            </h2>
          </div>

          {/* Stock Status Badge */}
          <div className="mb-3">
            {product.stockStatus === 'on_demand' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span>{lang === 'EN' ? 'On Demand' : 'माग अनुसार उपलब्ध'}</span>
              </span>
            ) : product.stockStatus === 'out_of_stock' || product.inStock === false ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs">
                <span className="material-symbols-outlined text-sm">cancel</span>
                <span>{lang === 'EN' ? 'Out of Stock' : 'स्टकमा छैन'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>{lang === 'EN' ? 'In Stock' : 'स्टकमा उपलब्ध'}</span>
              </span>
            )}
          </div>

          <p className="text-sm text-[#43474e] leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Specs Table */}
          <div className="bg-[#f6f3f2] rounded-xl p-4 border border-[#c4c6cf] mb-6 space-y-3 text-xs">
            <h4 className="font-bold text-[#000d22] uppercase tracking-wider border-b border-[#c4c6cf] pb-2">
              {lang === 'EN' ? 'Technical Specifications' : 'प्राविधिक विवरणहरू'}
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[#74777f] block">Material:</span>
                <span className="font-semibold text-[#1c1b1b]">{product.material}</span>
              </div>
              <div>
                <span className="text-[#74777f] block">Standard Size:</span>
                <span className="font-semibold text-[#1c1b1b]">{product.standardSize}</span>
              </div>
              <div>
                <span className="text-[#74777f] block">Properties:</span>
                <span className="font-semibold text-[#1c1b1b]">{product.properties}</span>
              </div>
              <div>
                <span className="text-[#74777f] block">Ideal Application:</span>
                <span className="font-semibold text-[#1c1b1b]">{product.idealUse}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#c4c6cf] flex items-center gap-1.5 text-[#000d22] font-semibold">
              <span className="material-symbols-outlined text-[#775a19] text-base">location_on</span>
              <span>{product.storeLocation}</span>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="mt-auto flex flex-col gap-2">
            <a
              href={`https://wa.me/9779766383188?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#25D366] hover:bg-[#1fbd59] text-white font-bold rounded-lg text-sm text-center flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              <span>{lang === 'EN' ? 'WhatsApp for Inquiry' : 'व्हाट्सएपमा सोधपुछ गर्नुहोस्'}</span>
            </a>

            <button
              onClick={() => {
                onInquire(product.name);
                onClose();
              }}
              className="w-full py-3 bg-[#000d22] hover:bg-[#775a19] text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-lg">send</span>
              <span>{t.inquireNow}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

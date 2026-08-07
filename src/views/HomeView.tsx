import React from 'react';
import { ViewType, Language, ProductCategory, Product } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { PRODUCTS } from '../data/products';

interface HomeViewProps {
  setCurrentView: (view: ViewType) => void;
  lang: Language;
  onOpenQuoteModal: (prefillProduct?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setCurrentView,
  lang,
  onOpenQuoteModal,
  onSelectProduct,
}) => {
  const t = TRANSLATIONS[lang];

  const categories: { name: ProductCategory; image: string; alt: string }[] = [
    {
      name: 'Plywood',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDZSj5VQSONONMdx2el49ip_WMBIEVcu_kugoWFuPydu5j0Ox4ozrGZ8aIfDfPDa8zGn7CTS7XBYS9DOrG13HtuZ0VNUXxImu3zUDV6qoUk7I66NlbK9EHtD8nT47I5W3z9fylPJuSVuq6t-88IFXJcyOhwN5tylZpknaje4SZbuB_C4RsXPRlArGvS-CwuCKN4V-ZFAUGhUfAbj9Z220nciW9aC3p4Ib3sKV-hKspCcd0RTuA7CbrESwNrKCxVd7Dk75PW4fwy2LV7',
      alt: 'Close up of uniform plywood edges',
    },
    {
      name: 'Hardware',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC4iYnjcs2QgK-qdqtr-Acu6HeiI-qOSqNE-EIXBa9iJvUsGEAjk6r0DyhcGPuEtkd-OmM9FKogQDuo3g3U0XgR68saK42_PwA2J5ChniyDF5jzN53txvdf5QSIZly--xv3Uq9LlJNyzf2wbbovadCEOR5TRX3Azjbg4XiIskIBs3ZAulcIMcnL0mosB8p1hWZkKok_VdFa0c3Gs9uKSnSqrzcI_xuM7nr50fNMmz1Q96QbjX9s4f3bESf1FXjWd6KZ4N6-YG3lQsvn',
      alt: 'Architectural door handles',
    },
    {
      name: 'Locks & Security',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAGCfHtrgO8fdyAgwfIVPO6qykFPHzR0GnYdBGeXc7ReZA8sgLiLdf0I51ggXuCWx3lZYU2k_oqOMFCvFq5WE5zN7s6IGBAOoDYlhlGlq_sb4JzizoelDJqZyq4fEU3Rf993KKASg0BAq5zLtkF9Z-eOiiKu1BJrJRLAtu7VyQfaPW8ntRph3PPoW5_DJtm0f9k3QuJr5u_A6_bI4amBcsltGrvSFuAkB-sVF-5bX8QIkeuxj8RBsDSKK6B8IRHmEoWJPPyBPfYBwID',
      alt: 'Cylindrical door lock',
    },
    {
      name: 'Veneers',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDCOkg1m0CUw6eQ64s1io7auKi-Av09AzmK9QH_9-Vhw18rGXyYewn1RklAuj42Ymft2MJoK4XiTLUKpW9rFRd4m_pSHk03ml2xuvWToVOKJfX5RZJUL8ewbPbtWXhe3W-xq0QjcUZAVGn5IsupZ8L1Ab1kuEJnE2YPonCmbhpDk4FaAROfPWIYOH3h7fPaRpErbotYv0hqbitVflnSVNQoCAczXWsgJJ6C7tkSc4WiZq3e22nwkms-XwV4DeE0RgsfrkMzX2a-PwFm',
      alt: 'Natural walnut wood veneer',
    },
    {
      name: 'Laminates',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD0xecB4gLuBLbV1rk1w7Og818tHNS7em9EM6Bu1uOvAebGbOeG7WTbOf9NmTBtmR1_ExezCJ5RdEXURoxxnw7KinKupykQYYkPPJrTaQs4rPQg0FFAUUbxnVpD8mNbgedUh1xVZc9Ml4kpUIxYtdHK2zNc25Rzff7xVWgl2B27NzWF65ifUwM4uwgr0V5NeMY3th2RwAElRVLK5glphhHRpsT-IH_Eq2qyBcdjno_WQYXWS3laZAR3m3wKgvuUmXhPH0j0fD0G8nIk',
      alt: 'Matte laminate surface',
    },
    {
      name: 'MDF & Particle Board',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB9XcqdFipfNiz0Ft9yhdyXHTozr7apy_nJE4lqpRYm7oge1jKKnBHKlm6Ro1XRJJyV_f5AXEWy5KXMXF3n6WjItcAp89hxHxmCTvtLf-E8Uy5zQtty_G34toO5f37miD3Q0LPpX5u0cd88B91R_xIlkT6LkoQUonCYARA9F8Qk61l7dQFzrLWx79YEsmWs8iaKf5O7vV7gq_zOU6AjsMt4UYJvjHT_FOsdJpyGmrP16i2Ijjf7jtaLeO2TInnGtRN_kzZlChJLuPm1',
      alt: 'Plain MDF Board',
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[75vh] min-h-[550px] max-h-[750px] flex items-center overflow-hidden bg-[#000d22]">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center opacity-45 mix-blend-overlay"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA3llWq8ystHZF3SZDQ1OHhV3AMqlJhyQy_MK3cWR7gOzzUMmobj3zHWpHtpn-Gcv8TcC-TIi_nrGoKampICAZpIqv2H9lEYqyFBxJ9HJW6_MQYofSiNPcSd6lyb-lH96EFXzSdLBwgTVkpZHH7PFPjB-ITFudi7bkRYGGfz5lNlt7mdoIo6lOSklvtDD0xgCMk0yo-qvc2nfMIwj3etOfE6TIlCPR1SB6e2Y3vYLONMmSp_5irOaqwjDC6Dqa9ymh8Z9dCV-8VTkFV')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#000d22] via-[#000d22]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 w-full text-white">
          <div className="max-w-2xl space-y-4">
            <span className="inline-block bg-[#fed488] text-[#785a1a] text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
              {lang === 'EN' ? 'Lalitpur • Kathmandu • Nepal' : 'ललितपुर • काठमाडौं • नेपाल'}
            </span>
            <h1 className="font-display-lg-mobile md:text-[48px] md:leading-[56px] font-bold leading-tight">
              {t.tagline}
            </h1>
            <p className="text-[#e1e3e4] text-base md:text-xl font-normal leading-relaxed opacity-90">
              {lang === 'EN'
                ? 'Rooted in Lalitpur, we provide the certified structural integrity, marine plywood, and premium door hardware that turns blueprints into reality.'
                : 'ललितपुरको मुटुमा अवस्थित, हामी तपाईंको सपनाको घरका लागि उच्च गुणस्तरीय प्लाइभूड र हार्डवेयर उपलब्ध गराउँछौं।'}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setCurrentView('products')}
                className="bg-[#775a19] hover:bg-[#fed488] hover:text-[#785a1a] text-white px-8 py-3.5 font-bold rounded-lg transition-all shadow-lg active:scale-95 cursor-pointer text-base min-h-[52px]"
              >
                {t.viewProducts}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-[#fcf9f8]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-headline-md text-3xl font-bold text-[#000d22]">
              {t.ourCategories}
            </h2>
            <div className="w-16 h-1 bg-[#775a19] mx-auto mt-2 rounded-full" />
            <p className="text-[#43474e] text-sm mt-3">
              {lang === 'EN'
                ? 'Explore our core building materials certified for high durability and structural excellence.'
                : 'उच्च स्थायित्व र गुणस्तर प्रमाणित हाम्रा मुख्य निर्माण सामग्रीहरू हेर्नुहोस्।'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => setCurrentView('products')}
                className="bg-white rounded-xl overflow-hidden border border-[#c4c6cf] hover:border-[#000d22] transition-all duration-300 group cursor-pointer ambient-shadow hover:-translate-y-1"
              >
                <div className="h-56 w-full bg-[#f0eded] overflow-hidden relative">
                  <img
                    src={cat.image}
                    alt={cat.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>
                <div className="p-5 text-center bg-[#fcf9f8] flex flex-col items-center">
                  <h3 className="font-title-lg text-xl font-bold text-[#000d22]">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-[#775a19] font-bold mt-1 uppercase tracking-wider flex items-center gap-1 group-hover:underline">
                    <span>{lang === 'EN' ? 'Explore Collection' : 'संग्रह हेर्नुहोस्'}</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Teaser */}
      <section className="py-16 bg-[#f6f3f2] border-t border-[#c4c6cf]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-[#775a19] uppercase tracking-wider block">
                {lang === 'EN' ? 'Handpicked Quality' : 'छानिएका सामग्रीहरू'}
              </span>
              <h2 className="font-headline-md text-2xl md:text-3xl font-bold text-[#000d22]">
                {lang === 'EN' ? 'Featured Products' : 'प्रमुख सामग्रीहरू'}
              </h2>
            </div>
            <button
              onClick={() => setCurrentView('products')}
              className="text-[#775a19] font-bold hover:text-[#000d22] flex items-center gap-1 cursor-pointer"
            >
              <span>{t.allProducts}</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.slice(0, 3).map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#c4c6cf] hover:shadow-xl transition-all flex flex-col group"
              >
                <div className="relative aspect-[4/3] bg-[#f0eded] overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#fed488] text-[#785a1a] text-xs font-bold px-3 py-1 rounded-sm shadow-sm">
                    {prod.grade}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-title-lg text-lg font-bold text-[#000d22] mb-2">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-[#43474e] mb-4 line-clamp-2">
                    {prod.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-[#f0eded] flex gap-2">
                    <button
                      onClick={() => onSelectProduct(prod)}
                      className="flex-1 py-2.5 bg-[#f0eded] hover:bg-[#000d22] text-[#000d22] hover:text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      {lang === 'EN' ? 'View Details' : 'विवरण हेर्नुहोस्'}
                    </button>
                    <button
                      onClick={() => onOpenQuoteModal(prod.name)}
                      className="py-2.5 px-3 bg-[#775a19] hover:bg-[#000d22] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      {t.inquireNow}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Mahadev Story & 15+ Years Trust */}
      <section className="py-16 bg-[#fcf9f8]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-[#775a19] uppercase tracking-wider block mb-1">
                {t.storyTitle}
              </span>
              <h2 className="font-headline-md text-2xl md:text-3xl font-bold text-[#000d22] mb-4">
                {lang === 'EN'
                  ? 'Building Trust Through Transparency in Lalitpur'
                  : 'ललितपुरमा विश्वास र पारदर्शिताको जग'}
              </h2>
              <div className="space-y-4 text-[#43474e] text-base leading-relaxed">
                <p>
                  Mahadev Ply Center started with a simple, powerful idea: that every home and commercial project in Nepal deserves access to world-class building materials without the complexity of traditional sourcing.
                </p>
                <p>
                  We noticed a gap in the local market for reliable, graded plywood and timber that architects could trust and homeowners could afford. Since our founding in Satdobato Lalitpur, we have focused on one thing—building long-term trust through transparent grading and honest pricing.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-[#f0eded] rounded-2xl overflow-hidden border border-[#c4c6cf]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV0rVz0kKsuvZhmNg_S9R-bTED--8g2WkZVOudUNwVPDqvQph2rHNgxUSuNMvqjLiN7vFVBIPuQUrtkZ_lWbbIIdyRjmYns655xpsqAug7IQcQpUonJIj8eOVahJWdtrMJFMl8K4SyvhfcJffWzCrp8HM1iq7N46JAqv6L6BNNo_AHMb-xPI5Q3zBcMArLm09GG5GHu6JJqtXfPChGTgJKsx4uo47gbw1OMTXQredrb-5gk_0jZXmPYrOdaNuZWziUo65Qc5DTnyg6"
                  alt="High quality plywood texture"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#775a19] p-6 text-white rounded-xl shadow-2xl hidden sm:block">
                <p className="font-display-lg text-4xl font-bold">15+</p>
                <p className="font-label-lg uppercase tracking-wider text-xs text-[#ffdea5]">
                  {t.yearsOfTrust}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment Pillars */}
      <section className="py-16 bg-[#f6f3f2]">
        <div className="max-w-[1200px] mx-auto px-6 text-center mb-12">
          <h2 className="font-headline-md text-2xl md:text-3xl font-bold text-[#000d22]">
            {t.commitmentTitle}
          </h2>
          <p className="text-[#43474e] text-sm mt-2">
            Built on pillars of reliability, authentic certifications, and local expertise.
          </p>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-[#c4c6cf] text-center shadow-xs">
            <div className="w-16 h-16 bg-[#fed488] rounded-full flex items-center justify-center mx-auto mb-4 text-[#785a1a]">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <h3 className="font-title-lg text-xl font-bold text-[#000d22] mb-2">
              {t.qualityProducts}
            </h3>
            <p className="text-[#43474e] text-sm leading-relaxed">
              We source only IS-marked, high-grade plywood and timber that undergoes rigorous quality checks before reaching your site.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#c4c6cf] text-center shadow-xs">
            <div className="w-16 h-16 bg-[#fed488] rounded-full flex items-center justify-center mx-auto mb-4 text-[#785a1a]">
              <span className="material-symbols-outlined text-3xl">psychology</span>
            </div>
            <h3 className="font-title-lg text-xl font-bold text-[#000d22] mb-2">
              {t.expertAdvice}
            </h3>
            <p className="text-[#43474e] text-sm leading-relaxed">
              Our team provides technical guidance on wood selection, ensuring you use the right material (BWP vs BWR) for the right application.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#c4c6cf] text-center shadow-xs">
            <div className="w-16 h-16 bg-[#fed488] rounded-full flex items-center justify-center mx-auto mb-4 text-[#785a1a]">
              <span className="material-symbols-outlined text-3xl">location_on</span>
            </div>
            <h3 className="font-title-lg text-xl font-bold text-[#000d22] mb-2">
              {t.localService}
            </h3>
            <p className="text-[#43474e] text-sm leading-relaxed">
              Based in the heart of Lalitpur, we understand the local climate and construction needs, offering fast and reliable delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Showroom Location Banner */}
      <section className="py-16 bg-[#000d22] text-white border-t-4 border-[#775a19]" id="location">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#fed488] font-bold block mb-2">
              {t.visitShowroom}
            </span>
            <h2 className="font-display-lg-mobile text-3xl md:text-4xl font-bold mb-4">
              Lalitpur-15, Satdobato
            </h2>
            <p className="text-[#e1e3e4] text-base leading-relaxed mb-6">
              Conveniently located to serve the Kathmandu Valley. Stop by to feel the natural veneer textures and inspect the grade stamps in person.
            </p>

            <div className="space-y-3 text-sm text-[#e1e3e4]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#fed488]">phone</span>
                <a href="tel:+977015400921" className="font-bold hover:underline">
                  01-5400921 / 9766383188
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#fed488]">mail</span>
                <span>info@mahadevply.com.np</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#fed488]">schedule</span>
                <span>Sun - Fri: 10:00 AM - 7:00 PM | Sat: 10:00 AM - 12:00 PM</span>
              </div>
            </div>

            <a
              href="https://maps.app.goo.gl/MX8aGjqAKF6tUd2o7"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 bg-[#775a19] hover:bg-[#fed488] hover:text-[#785a1a] text-white px-8 py-3.5 font-bold rounded-lg transition-all shadow-xl cursor-pointer text-base"
            >
              <span className="material-symbols-outlined text-xl">directions</span>
              <span>{t.getDirections}</span>
            </a>
          </div>

          <div className="rounded-2xl overflow-hidden h-[360px] border border-[#c4c6cf] shadow-2xl relative group">
            <iframe
              src="https://maps.google.com/maps?q=Mahadev%20Ply%20Center%20Satdobato%20Lalitpur%20Nepal&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mahadev Ply Center Google Maps Location"
              className="w-full h-full"
            ></iframe>
            <a
              href="https://maps.app.goo.gl/MX8aGjqAKF6tUd2o7"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 right-4 bg-[#000d22]/95 hover:bg-[#000d22] backdrop-blur-xs p-3.5 rounded-lg text-xs border border-[#775a19] flex items-center justify-between gap-3 transition-colors text-white shadow-lg"
            >
              <div>
                <p className="font-bold text-[#fed488]">Mahadev Ply Center</p>
                <p className="text-[#e1e3e4]">Main Ring Road, Satdobato, Lalitpur-15, Nepal</p>
              </div>
              <span className="bg-[#775a19] hover:bg-[#fed488] hover:text-[#785a1a] text-white px-3 py-1.5 rounded-md font-bold text-xs flex items-center gap-1 shrink-0 transition-colors">
                <span className="material-symbols-outlined text-sm">directions</span>
                {t.getDirections}
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

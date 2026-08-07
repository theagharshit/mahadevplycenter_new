import React from 'react';
import { ViewType, Language, TeamMember } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Logo } from '../components/Logo';

interface AboutViewProps {
  setCurrentView: (view: ViewType) => void;
  lang: Language;
  onOpenQuoteModal: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  setCurrentView,
  lang,
  onOpenQuoteModal,
}) => {
  const t = TRANSLATIONS[lang];

  const teamMembers: TeamMember[] = [
    {
      name: 'Ram Prasad Shrestha',
      role: 'Founder & Managing Director',
      roleNe: 'संस्थापक तथा प्रबन्ध निर्देशक',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCxn2PTgLWU6V-2pPbXzDjvw1dqepAM6TeEA6UeTyVh4fAHAe0HmqGYgBTs3XRtkLnGFd3X50MFIklULdfiLKGXFU-xNIQ92p1nef3orEWufbZbRfWEzhrVgn1wBevxlbtZ4VhIRb_ccxkNodOS3OHkp5-BtM0lnlG61YQpJGCsitSIvqMofZeMerD13UTuqHJRm7cPNtgGzepT14KGGMcO-VrJDfTcSotGrRoB-LgNdg9g6QvFJR0pKMQBYPBaxKo0J3gPnN33KFsH',
      altText: 'Ram Prasad Shrestha headshot',
    },
    {
      name: 'Anjali Maharjan',
      role: 'Head of Customer Relations',
      roleNe: 'ग्राहक सम्बन्ध प्रमुख',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB-miAz7MQxuIt1NPudx_q_jYqD1Y8YagbZt88-X1JIRHhUWuuQxZEFEOKMoRoVFm5xYE9Ob5bnyiLCMkilz3tCE8queBSSHqKztz50r6Qo9yeyiXsfNg9cskm_tM0SOnRrFdpABGGqvHNh5wWlrQrHglm2pJC0JxCQYFQbokmaujq3MByDao9tUV8UyQrLc2gZYzkF_vj3z7S8XO5eyrYZwFWmE7Sr76Mjo0vZv_BHCB8QjtZ-jnU982_n9qAG-dTABxTqmTGyU5oN',
      altText: 'Anjali Maharjan portrait',
    },
    {
      name: 'Bimal Thapa',
      role: 'Technical Advisor',
      roleNe: 'प्राविधिक सल्लाहकार',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD42xy08oQt9N5Hz5qtJT56pnPyqxyDVUrOPhpo8_1Nxgb1_mKd-nG2PUyZs-3GaTMjrkQlSD_c9rsGqA2enSaF34_Cow71HdBQDWZAtVT27jND4NC7uYlNGEezdz79w7YX_KljweiDLlqwaVTXlnq4Gg51-KTB2KuF15lTEFynziKDdu7OR_07SdfNOyeNj9lrq4l7b7wSxwIVvQN_hmOHyTjVeESW3EQT1AJRoQsx2yLqyrUPCz3_4j8hX-zAVR5HCSU5az0NlsxX',
      altText: 'Bimal Thapa headshot',
    },
    {
      name: 'Suresh Karki',
      role: 'Logistics Manager',
      roleNe: 'लजिस्टिक म्यानेजर',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDJBoNcE2C5RUrkUmIfv7DEERGUtqvrvIaMk2O4c6zxzj8X3A_X65p_y2PrVWzAL2EM5rSfTsmLWoMwKP0Zs_7MZlNHf6QMYVdGP5Zt9HHcOILv91i6CCU-DgjQ4fWJluljcuZMzjb5z97UyjMKJrbOyL28rzjM312zi-mTJaVQ6Sg3Hy17KZxsL0tP-Bfe-BpQodMaP7gRI8ZPK_WacE-BcntFyIsTdCn_45Nipa03OAszBCBO78rmBWQoqXlBWaFbjTOCFJYbCOfd',
      altText: 'Suresh Karki portrait',
    },
  ];

  return (
    <div className="w-full bg-[#fcf9f8]">
      {/* Hero Header */}
      <section className="relative w-full h-[60vh] min-h-[450px] flex items-center overflow-hidden bg-[#000d22] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA3llWq8ystHZF3SZDQ1OHhV3AMqlJhyQy_MK3cWR7gOzzUMmobj3zHWpHtpn-Gcv8TcC-TIi_nrGoKampICAZpIqv2H9lEYqyFBxJ9HJW6_MQYofSiNPcSd6lyb-lH96EFXzSdLBwgTVkpZHH7PFPjB-ITFudi7bkRYGGfz5lNlt7mdoIo6lOSklvtDD0xgCMk0yo-qvc2nfMIwj3etOfE6TIlCPR1SB6e2Y3vYLONMmSp_5irOaqwjDC6Dqa9ymh8Z9dCV-8VTkFV')",
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 w-full">
          <div className="max-w-2xl space-y-4">
            <span className="bg-[#fed488] text-[#785a1a] text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider inline-block">
              {lang === 'EN' ? 'About Mahadev Ply Center' : 'हाम्रो परिचय'}
            </span>
            <h1 className="font-display-lg-mobile md:text-5xl font-bold leading-tight">
              {t.tagline}
            </h1>
            <p className="text-[#e1e3e4] text-base md:text-lg">
              {lang === 'EN'
                ? 'Rooted in Satdobato Lalitpur, we provide the structural integrity that turns architectural blueprints into reality.'
                : 'ललितपुर सातदोबाटोमा अवस्थित, हामी गुणस्तरीय सामग्री मार्फत घर तथा व्यावसायिक निर्माणको जग मजबुत बनाउँछौं।'}
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenQuoteModal}
                className="bg-[#775a19] hover:bg-[#fed488] hover:text-[#785a1a] text-white px-8 py-3.5 font-bold rounded-lg transition-all cursor-pointer shadow-lg text-sm"
              >
                {t.getAQuote}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The Mahadev Story */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex justify-center mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c4c6cf] flex flex-col items-center text-center">
              <Logo variant="full" className="h-20 md:h-24" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-headline-md text-3xl font-bold text-[#000d22] mb-6">
                {t.storyTitle}
              </h2>
              <div className="space-y-4 text-[#43474e] text-base leading-relaxed">
                <p>
                  Mahadev Ply Center started with a simple, powerful idea: that every home and commercial project in Nepal deserves access to world-class building materials without the complexity of traditional sourcing.
                </p>
                <p>
                  We noticed a gap in the local market for reliable, graded plywood and timber that architects could trust and homeowners could afford. Since our founding in Lalitpur, we have focused on one thing—building long-term trust through transparency.
                </p>
                <p>
                  Today, we aren't just suppliers; we are partners in your construction journey. From the smallest home renovation to large-scale infrastructure, our commitment to quality remains as sturdy as the wood we sell.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-[#f0eded] rounded-2xl overflow-hidden border border-[#c4c6cf]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV0rVz0kKsuvZhmNg_S9R-bTED--8g2WkZVOudUNwVPDqvQph2rHNgxUSuNMvqjLiN7vFVBIPuQUrtkZ_lWbbIIdyRjmYns655xpsqAug7IQcQpUonJIj8eOVahJWdtrMJFMl8K4SyvhfcJffWzCrp8HM1iq7N46JAqv6L6BNNo_AHMb-xPI5Q3zBcMArLm09GG5GHu6JJqtXfPChGTgJKsx4uo47gbw1OMTXQredrb-5gk_0jZXmPYrOdaNuZWziUo65Qc5DTnyg6"
                  alt="Wood grain texture"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#775a19] p-6 text-white rounded-xl shadow-2xl hidden lg:block">
                <p className="font-display-lg text-4xl font-bold">15+</p>
                <p className="font-label-lg uppercase tracking-widest text-xs text-[#ffdea5]">
                  {t.yearsOfTrust}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Pillars */}
      <section className="py-16 bg-[#f6f3f2]">
        <div className="max-w-[1200px] mx-auto px-6 text-center mb-12">
          <h2 className="font-headline-md text-3xl font-bold text-[#000d22]">
            {t.commitmentTitle}
          </h2>
          <p className="text-[#43474e] text-sm mt-2">
            Built on pillars of reliability and local expertise in Lalitpur & Kathmandu Valley.
          </p>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl border border-[#c4c6cf] text-center shadow-xs">
            <div className="w-16 h-16 bg-[#fed488] rounded-full flex items-center justify-center mx-auto mb-4 text-[#785a1a]">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <h3 className="font-title-lg text-xl font-bold text-[#000d22] mb-2">
              {t.qualityProducts}
            </h3>
            <p className="text-[#43474e] text-sm">
              We source only IS-marked, high-grade plywood and timber that undergoes rigorous quality checks before reaching your site.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-[#c4c6cf] text-center shadow-xs">
            <div className="w-16 h-16 bg-[#fed488] rounded-full flex items-center justify-center mx-auto mb-4 text-[#785a1a]">
              <span className="material-symbols-outlined text-3xl">psychology</span>
            </div>
            <h3 className="font-title-lg text-xl font-bold text-[#000d22] mb-2">
              {t.expertAdvice}
            </h3>
            <p className="text-[#43474e] text-sm">
              Our team provides technical guidance on wood selection, ensuring you use the right material for the right application, every time.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-[#c4c6cf] text-center shadow-xs">
            <div className="w-16 h-16 bg-[#fed488] rounded-full flex items-center justify-center mx-auto mb-4 text-[#785a1a]">
              <span className="material-symbols-outlined text-3xl">location_on</span>
            </div>
            <h3 className="font-title-lg text-xl font-bold text-[#000d22] mb-2">
              {t.localService}
            </h3>
            <p className="text-[#43474e] text-sm">
              Based in the heart of Lalitpur, we understand the local climate and construction needs, offering fast and reliable delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="font-headline-md text-3xl font-bold text-[#000d22] text-center mb-10">
            {t.teamTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="group flex flex-col">
                <div className="aspect-[3/4] rounded-lg overflow-hidden mb-3 border border-[#c4c6cf] grayscale group-hover:grayscale-0 transition-all duration-500 shadow-xs">
                  <img
                    src={member.image}
                    alt={member.altText}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-title-lg text-lg font-bold text-[#000d22]">
                  {member.name}
                </h4>
                <p className="text-xs font-bold text-[#775a19]">
                  {lang === 'EN' ? member.role : member.roleNe}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-[#000d22] text-white border-t-2 border-[#775a19]">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#fed488] font-bold block mb-2">
              {t.visitShowroom}
            </span>
            <h2 className="font-display-lg-mobile text-3xl font-bold mb-4">
              Lalitpur-15, Satdobato
            </h2>
            <p className="text-[#e1e3e4] text-base leading-relaxed mb-6">
              Conveniently located to serve the Kathmandu Valley. Stop by to feel the textures and see the grades of our plywood in person.
            </p>

            <a
              href="https://maps.app.goo.gl/MX8aGjqAKF6tUd2o7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#775a19] text-white px-8 py-3.5 font-bold rounded-lg hover:bg-[#fed488] hover:text-[#785a1a] transition-all cursor-pointer text-sm shadow-xl"
            >
              <span className="material-symbols-outlined text-base">directions</span>
              <span>{t.getDirections}</span>
            </a>
          </div>

          <div className="rounded-2xl overflow-hidden h-[320px] border border-[#c4c6cf] relative">
            <iframe
              src="https://maps.google.com/maps?q=Mahadev%20Ply%20Center%20Satdobato%20Lalitpur%20Nepal&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lalitpur map"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

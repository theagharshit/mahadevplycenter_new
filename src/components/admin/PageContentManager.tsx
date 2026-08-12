import React, { useState, useEffect } from 'react';
import {
  Layout,
  Save,
  Info,
  MapPin,
  Home,
  ShoppingBag,
  Image as ImageIcon,
  Plus,
  Trash2,
  Users,
  Award,
  CheckCircle2,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { HomePageContent, AboutPageContent, ContactPageContent, SiteSettings, TeamMember } from '../../types';
import { authFetch } from '../../utils/api';
import { ImagePicker } from './ImagePicker';

export const PageContentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'contact' | 'products'>('home');
  const [homeData, setHomeData] = useState<HomePageContent | null>(null);
  const [aboutData, setAboutData] = useState<AboutPageContent | null>(null);
  const [contactData, setContactData] = useState<ContactPageContent | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      authFetch('/api/admin/content/home').then((res) => res.json()).catch(() => ({ homeContent: {} })),
      authFetch('/api/admin/content/about').then((res) => res.json()).catch(() => ({ aboutContent: {} })),
      authFetch('/api/admin/content/contact').then((res) => res.json()).catch(() => ({ contactContent: {} })),
      authFetch('/api/admin/settings').then((res) => res.json()).catch(() => ({ siteSettings: {} })),
    ])
      .then(([homeRes, aboutRes, contactRes, settingsRes]) => {
        if (homeRes.homeContent) setHomeData(homeRes.homeContent);
        if (aboutRes.aboutContent) setAboutData(aboutRes.aboutContent);
        if (contactRes.contactContent) setContactData(contactRes.contactContent);
        if (settingsRes.siteSettings) setSiteSettings(settingsRes.siteSettings);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load CMS data:', err);
        setLoading(false);
      });
  }, []);

  const triggerToast = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  // Save Home Page Content
  const handleSaveHome = async () => {
    if (!homeData) return;
    setSaving(true);
    try {
      const res = await authFetch('/api/admin/content/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(homeData),
      });
      if (!res.ok) throw new Error('Failed updating Home page photos & content.');
      triggerToast('Home page content & photos saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Error saving Home content.');
    } finally {
      setSaving(false);
    }
  };

  // Save About Page Content
  const handleSaveAbout = async () => {
    if (!aboutData) return;
    setSaving(true);
    try {
      const res = await authFetch('/api/admin/content/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutData),
      });
      if (!res.ok) throw new Error('Failed updating About Us content.');
      triggerToast('About Us page photos & details saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Error saving About content.');
    } finally {
      setSaving(false);
    }
  };

  // Save Contact Page Content
  const handleSaveContact = async () => {
    if (!contactData) return;
    setSaving(true);
    try {
      const res = await authFetch('/api/admin/content/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });
      if (!res.ok) throw new Error('Failed updating Contact Us content.');
      triggerToast('Contact Us page photos & details saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Error saving Contact content.');
    } finally {
      setSaving(false);
    }
  };

  // Save Products Page Settings
  const handleSaveProducts = async () => {
    if (!siteSettings) return;
    setSaving(true);
    try {
      const res = await authFetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings),
      });
      if (!res.ok) throw new Error('Failed updating Products page settings.');
      triggerToast('Products page banner image saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Error saving Products banner.');
    } finally {
      setSaving(false);
    }
  };

  // Category image updater for Home Page
  const updateCategoryImage = (categoryName: string, url: string) => {
    if (!homeData) return;
    const currentCatImages = homeData.categoryImages || {};
    setHomeData({
      ...homeData,
      categoryImages: {
        ...currentCatImages,
        [categoryName]: url,
      },
    });
  };

  // Team Member helpers
  const handleAddTeamMember = () => {
    if (!aboutData) return;
    const current = aboutData.teamMembers || [];
    const newMember: TeamMember = {
      name: 'New Member',
      role: 'Consultant',
      roleNe: 'सल्लाहकार',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
      altText: 'Team Member Photo',
    };
    setAboutData({
      ...aboutData,
      teamMembers: [...current, newMember],
    });
  };

  const handleUpdateTeamMember = (index: number, field: keyof TeamMember, val: string) => {
    if (!aboutData || !aboutData.teamMembers) return;
    const updated = [...aboutData.teamMembers];
    updated[index] = { ...updated[index], [field]: val };
    setAboutData({ ...aboutData, teamMembers: updated });
  };

  const handleDeleteTeamMember = (index: number) => {
    if (!aboutData || !aboutData.teamMembers) return;
    const updated = aboutData.teamMembers.filter((_, i) => i !== index);
    setAboutData({ ...aboutData, teamMembers: updated });
  };

  // Certificate helpers
  const handleAddCertificate = () => {
    if (!aboutData) return;
    const current = aboutData.certificates || [];
    const newCert = {
      title: 'Authorized Dealer Certificate',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
      issuedBy: 'Official Brand Partner',
    };
    setAboutData({
      ...aboutData,
      certificates: [...current, newCert],
    });
  };

  const handleUpdateCertificate = (index: number, field: 'title' | 'image' | 'issuedBy', val: string) => {
    if (!aboutData || !aboutData.certificates) return;
    const updated = [...aboutData.certificates];
    updated[index] = { ...updated[index], [field]: val };
    setAboutData({ ...aboutData, certificates: updated });
  };

  const handleDeleteCertificate = (index: number) => {
    if (!aboutData || !aboutData.certificates) return;
    const updated = aboutData.certificates.filter((_, i) => i !== index);
    setAboutData({ ...aboutData, certificates: updated });
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-[#43474e] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#775a19]" />
        <span className="text-sm font-semibold">Loading Pages Content CMS...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast Notification */}
      {saveSuccess && (
        <div className="fixed top-5 right-5 z-50 bg-[#000d22] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#775a19] flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#fed488]" />
          <span className="text-sm font-semibold">{saveSuccess}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#c4c6cf] shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-[#000d22] flex items-center gap-2.5">
            <Layout className="w-6 h-6 text-[#775a19]" />
            Webpage Photos & Content Manager
          </h1>
          <p className="text-xs text-[#43474e] mt-1">
            Update hero banners, category images, team photos, certificates, and text across all public pages.
          </p>
        </div>

        {/* Page Nav Sub-Tabs */}
        <div className="flex flex-wrap items-center bg-[#f6f3f2] p-1.5 rounded-xl border border-[#c4c6cf] gap-1">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'home'
                ? 'bg-[#000d22] text-white shadow-xs'
                : 'text-[#43474e] hover:text-[#000d22] hover:bg-white/60'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-[#fed488]" />
            Home Page
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'about'
                ? 'bg-[#000d22] text-white shadow-xs'
                : 'text-[#43474e] hover:text-[#000d22] hover:bg-white/60'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-[#fed488]" />
            About Us Page
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-[#000d22] text-white shadow-xs'
                : 'text-[#43474e] hover:text-[#000d22] hover:bg-white/60'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#fed488]" />
            Contact Page
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#000d22] text-white shadow-xs'
                : 'text-[#43474e] hover:text-[#000d22] hover:bg-white/60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#fed488]" />
            Products Banner
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. HOME PAGE CONTENT & PHOTOS TAB */}
      {/* ======================================================== */}
      {activeTab === 'home' && homeData && (
        <div className="space-y-6">
          <div className="bg-white border border-[#c4c6cf] rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#f0eded] pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#000d22] flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#775a19]" />
                  Home Page Banners & Story Photos
                </h2>
                <p className="text-xs text-[#43474e] mt-0.5">
                  Upload or change photos used on the Home Page hero header and company background.
                </p>
              </div>
              <button
                onClick={handleSaveHome}
                disabled={saving}
                className="px-5 py-2.5 bg-[#775a19] hover:bg-[#000d22] text-white font-bold text-xs rounded-lg shadow transition flex items-center gap-2 cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Home Content</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hero Background Image */}
              <div className="bg-[#fcf9f8] p-4 rounded-xl border border-[#c4c6cf]">
                <ImagePicker
                  label="Hero Header Background Photo"
                  value={homeData.heroBannerImage || siteSettings?.bannerImage || ''}
                  onChange={(url) => setHomeData({ ...homeData, heroBannerImage: url })}
                  aspectRatio="video"
                  helpText="Hero section background photo displayed behind main tagline."
                />
              </div>

              {/* Story Wood Grain Photo */}
              <div className="bg-[#fcf9f8] p-4 rounded-xl border border-[#c4c6cf]">
                <ImagePicker
                  label="Story / Heritage Section Photo"
                  value={homeData.storyImage || ''}
                  onChange={(url) => setHomeData({ ...homeData, storyImage: url })}
                  aspectRatio="square"
                  helpText="Featured image shown next to company heritage story."
                />
              </div>
            </div>

            {/* Category Images Grid */}
            <div className="pt-4 border-t border-[#f0eded]">
              <h3 className="text-sm font-bold text-[#000d22] mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#775a19]" />
                Category Card Photos
              </h3>
              <p className="text-xs text-[#43474e] mb-4">
                Update photos for each product category card on the Home Page grid.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  'Plywood',
                  'Hardware',
                  'Locks & Security',
                  'Veneers',
                  'Laminates',
                  'MDF & Particle Board',
                ].map((catName) => (
                  <div key={catName} className="bg-[#fcf9f8] p-4 rounded-xl border border-[#c4c6cf]">
                    <ImagePicker
                      label={`${catName} Image`}
                      value={homeData.categoryImages?.[catName] || ''}
                      onChange={(url) => updateCategoryImage(catName, url)}
                      aspectRatio="video"
                      helpText={`Thumbnail image for ${catName}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ABOUT US PAGE CONTENT & PHOTOS TAB */}
      {/* ======================================================== */}
      {activeTab === 'about' && aboutData && (
        <div className="space-y-6">
          <div className="bg-white border border-[#c4c6cf] rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#f0eded] pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#000d22] flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#775a19]" />
                  About Us Photos & Content
                </h2>
                <p className="text-xs text-[#43474e] mt-0.5">
                  Update About page hero background, story image, team photos, and certificates.
                </p>
              </div>
              <button
                onClick={handleSaveAbout}
                disabled={saving}
                className="px-5 py-2.5 bg-[#775a19] hover:bg-[#000d22] text-white font-bold text-xs rounded-lg shadow transition flex items-center gap-2 cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save About Page</span>
              </button>
            </div>

            {/* Main Page Photos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#fcf9f8] p-4 rounded-xl border border-[#c4c6cf]">
                <ImagePicker
                  label="About Hero Background Banner"
                  value={aboutData.heroImage || ''}
                  onChange={(url) => setAboutData({ ...aboutData, heroImage: url })}
                  aspectRatio="video"
                  helpText="Background image for About Us hero banner."
                />
              </div>

              <div className="bg-[#fcf9f8] p-4 rounded-xl border border-[#c4c6cf]">
                <ImagePicker
                  label="Company Story Section Photo"
                  value={aboutData.storyImage || ''}
                  onChange={(url) => setAboutData({ ...aboutData, storyImage: url })}
                  aspectRatio="square"
                  helpText="Wood grain or showroom photo next to story text."
                />
              </div>
            </div>

            {/* Story & Statements Text */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#000d22] mb-1">Headline</label>
                  <input
                    type="text"
                    value={aboutData.headline || ''}
                    onChange={(e) => setAboutData({ ...aboutData, headline: e.target.value })}
                    className="w-full bg-[#fcf9f8] border border-[#c4c6cf] text-[#000d22] p-2.5 rounded-lg text-xs font-bold outline-none focus:border-[#775a19]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#000d22] mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={aboutData.subtitle || ''}
                    onChange={(e) => setAboutData({ ...aboutData, subtitle: e.target.value })}
                    className="w-full bg-[#fcf9f8] border border-[#c4c6cf] text-[#000d22] p-2.5 rounded-lg text-xs outline-none focus:border-[#775a19]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#000d22] mb-1">
                  Company Story (English)
                </label>
                <textarea
                  rows={3}
                  value={aboutData.companyStory || ''}
                  onChange={(e) => setAboutData({ ...aboutData, companyStory: e.target.value })}
                  className="w-full bg-[#fcf9f8] border border-[#c4c6cf] text-[#000d22] p-2.5 rounded-lg text-xs outline-none focus:border-[#775a19]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#000d22] mb-1">Mission Statement</label>
                  <textarea
                    rows={2}
                    value={aboutData.mission || ''}
                    onChange={(e) => setAboutData({ ...aboutData, mission: e.target.value })}
                    className="w-full bg-[#fcf9f8] border border-[#c4c6cf] text-[#000d22] p-2.5 rounded-lg text-xs outline-none focus:border-[#775a19]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#000d22] mb-1">Vision Statement</label>
                  <textarea
                    rows={2}
                    value={aboutData.vision || ''}
                    onChange={(e) => setAboutData({ ...aboutData, vision: e.target.value })}
                    className="w-full bg-[#fcf9f8] border border-[#c4c6cf] text-[#000d22] p-2.5 rounded-lg text-xs outline-none focus:border-[#775a19]"
                  />
                </div>
              </div>
            </div>

            {/* Team Members Photos & Info */}
            <div className="pt-6 border-t border-[#f0eded]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#000d22] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#775a19]" />
                    Team Members & Leadership Photos
                  </h3>
                  <p className="text-xs text-[#43474e]">
                    Upload headshot photos and roles for leadership shown on the About Us page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddTeamMember}
                  className="px-3.5 py-1.5 bg-[#000d22] hover:bg-[#775a19] text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Member
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(aboutData.teamMembers || []).map((member, idx) => (
                  <div key={idx} className="bg-[#fcf9f8] p-4 rounded-xl border border-[#c4c6cf] space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => handleDeleteTeamMember(idx)}
                      className="absolute top-3 right-3 text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <ImagePicker
                      label={`Member Photo (${member.name || 'Photo'})`}
                      value={member.image || ''}
                      onChange={(url) => handleUpdateTeamMember(idx, 'image', url)}
                      aspectRatio="square"
                    />

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-[#43474e] mb-0.5">Name</label>
                        <input
                          type="text"
                          value={member.name || ''}
                          onChange={(e) => handleUpdateTeamMember(idx, 'name', e.target.value)}
                          className="w-full bg-white border border-[#c4c6cf] p-2 rounded text-xs font-bold outline-none text-[#000d22]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#43474e] mb-0.5">Role (EN)</label>
                        <input
                          type="text"
                          value={member.role || ''}
                          onChange={(e) => handleUpdateTeamMember(idx, 'role', e.target.value)}
                          className="w-full bg-white border border-[#c4c6cf] p-2 rounded text-xs outline-none text-[#000d22]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#43474e] mb-0.5">Role (Nepali)</label>
                        <input
                          type="text"
                          value={member.roleNe || ''}
                          onChange={(e) => handleUpdateTeamMember(idx, 'roleNe', e.target.value)}
                          className="w-full bg-white border border-[#c4c6cf] p-2 rounded text-xs outline-none text-[#000d22]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#43474e] mb-0.5">Alt Text</label>
                        <input
                          type="text"
                          value={member.altText || ''}
                          onChange={(e) => handleUpdateTeamMember(idx, 'altText', e.target.value)}
                          className="w-full bg-white border border-[#c4c6cf] p-2 rounded text-xs outline-none text-[#000d22]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificates & Partner Badges */}
            <div className="pt-6 border-t border-[#f0eded]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#000d22] flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#775a19]" />
                    Certificates & Authorization Badges
                  </h3>
                  <p className="text-xs text-[#43474e]">
                    Manage official dealer certificates and brand accreditation photos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddCertificate}
                  className="px-3.5 py-1.5 bg-[#000d22] hover:bg-[#775a19] text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Certificate
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(aboutData.certificates || []).map((cert, idx) => (
                  <div key={idx} className="bg-[#fcf9f8] p-4 rounded-xl border border-[#c4c6cf] space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => handleDeleteCertificate(idx)}
                      className="absolute top-3 right-3 text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                      title="Remove Certificate"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <ImagePicker
                      label={`Certificate Photo (${cert.title || 'Certificate'})`}
                      value={cert.image || ''}
                      onChange={(url) => handleUpdateCertificate(idx, 'image', url)}
                      aspectRatio="video"
                    />

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-[#43474e] mb-0.5">Certificate Title</label>
                        <input
                          type="text"
                          value={cert.title || ''}
                          onChange={(e) => handleUpdateCertificate(idx, 'title', e.target.value)}
                          className="w-full bg-white border border-[#c4c6cf] p-2 rounded text-xs font-bold outline-none text-[#000d22]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#43474e] mb-0.5">Issued By Authority</label>
                        <input
                          type="text"
                          value={cert.issuedBy || ''}
                          onChange={(e) => handleUpdateCertificate(idx, 'issuedBy', e.target.value)}
                          className="w-full bg-white border border-[#c4c6cf] p-2 rounded text-xs outline-none text-[#000d22]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. CONTACT US PAGE CONTENT & PHOTOS TAB */}
      {/* ======================================================== */}
      {activeTab === 'contact' && contactData && (
        <div className="space-y-6">
          <div className="bg-white border border-[#c4c6cf] rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#f0eded] pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#000d22] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#775a19]" />
                  Contact Us Page Photos & Information
                </h2>
                <p className="text-xs text-[#43474e] mt-0.5">
                  Update Contact page photos, showroom images, maps embed URL, and branch contacts.
                </p>
              </div>
              <button
                onClick={handleSaveContact}
                disabled={saving}
                className="px-5 py-2.5 bg-[#775a19] hover:bg-[#000d22] text-white font-bold text-xs rounded-lg shadow transition flex items-center gap-2 cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Contact Details</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#fcf9f8] p-4 rounded-xl border border-[#c4c6cf]">
                <ImagePicker
                  label="Contact Page Hero Banner Photo"
                  value={contactData.heroImage || ''}
                  onChange={(url) => setContactData({ ...contactData, heroImage: url })}
                  aspectRatio="video"
                  helpText="Hero background photo for Contact page header."
                />
              </div>

              <div className="bg-[#fcf9f8] p-4 rounded-xl border border-[#c4c6cf]">
                <ImagePicker
                  label="Satdobato Showroom / Storefront Photo"
                  value={contactData.showroomImage || ''}
                  onChange={(url) => setContactData({ ...contactData, showroomImage: url })}
                  aspectRatio="video"
                  helpText="Photo of physical showroom displayed on Contact page."
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#000d22] mb-1">Headline</label>
                  <input
                    type="text"
                    value={contactData.headline || ''}
                    onChange={(e) => setContactData({ ...contactData, headline: e.target.value })}
                    className="w-full bg-[#fcf9f8] border border-[#c4c6cf] text-[#000d22] p-2.5 rounded-lg text-xs font-bold outline-none focus:border-[#775a19]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#000d22] mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={contactData.subtitle || ''}
                    onChange={(e) => setContactData({ ...contactData, subtitle: e.target.value })}
                    className="w-full bg-[#fcf9f8] border border-[#c4c6cf] text-[#000d22] p-2.5 rounded-lg text-xs outline-none focus:border-[#775a19]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#000d22] mb-1">
                  Google Maps Embed URL
                </label>
                <input
                  type="text"
                  value={contactData.googleMapsEmbedUrl || ''}
                  onChange={(e) => setContactData({ ...contactData, googleMapsEmbedUrl: e.target.value })}
                  className="w-full bg-[#fcf9f8] border border-[#c4c6cf] text-[#000d22] p-2.5 rounded-lg text-xs font-mono outline-none focus:border-[#775a19]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#000d22] mb-1">Opening Hours</label>
                  <input
                    type="text"
                    value={contactData.workingDaysHours || contactData.openingHours || ''}
                    onChange={(e) => setContactData({ ...contactData, workingDaysHours: e.target.value })}
                    className="w-full bg-[#fcf9f8] border border-[#c4c6cf] text-[#000d22] p-2.5 rounded-lg text-xs outline-none focus:border-[#775a19]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#000d22] mb-1">Special Notice</label>
                  <input
                    type="text"
                    value={contactData.specialNotice || ''}
                    onChange={(e) => setContactData({ ...contactData, specialNotice: e.target.value })}
                    className="w-full bg-[#fcf9f8] border border-[#c4c6cf] text-[#000d22] p-2.5 rounded-lg text-xs outline-none focus:border-[#775a19]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. PRODUCTS PAGE BANNER TAB */}
      {/* ======================================================== */}
      {activeTab === 'products' && siteSettings && (
        <div className="space-y-6">
          <div className="bg-white border border-[#c4c6cf] rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#f0eded] pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#000d22] flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#775a19]" />
                  Products Catalogue Banner Image
                </h2>
                <p className="text-xs text-[#43474e] mt-0.5">
                  Update the main header banner image on the Products Catalogue page.
                </p>
              </div>
              <button
                onClick={handleSaveProducts}
                disabled={saving}
                className="px-5 py-2.5 bg-[#775a19] hover:bg-[#000d22] text-white font-bold text-xs rounded-lg shadow transition flex items-center gap-2 cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Banner Image</span>
              </button>
            </div>

            <div className="max-w-xl bg-[#fcf9f8] p-5 rounded-xl border border-[#c4c6cf]">
              <ImagePicker
                label="Products Page Header Banner"
                value={siteSettings.productsBannerImage || siteSettings.bannerImage || ''}
                onChange={(url) => setSiteSettings({ ...siteSettings, productsBannerImage: url })}
                aspectRatio="banner"
                helpText="Header banner photo for the main Products catalogue page."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

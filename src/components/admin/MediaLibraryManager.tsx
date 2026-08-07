import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Copy, Check, Trash2, Search, ExternalLink } from 'lucide-react';
import { CMSData, cmsApi } from '../../lib/cmsApi';

interface MediaLibraryManagerProps {
  data: CMSData;
  onRefreshData: () => void;
  onShowToast: (msg: string) => void;
}

export const MediaLibraryManager: React.FC<MediaLibraryManagerProps> = ({
  data,
  onRefreshData,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredMedia = data.media.filter(
    (m) =>
      m.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Only image files (JPEG, PNG, WEBP, SVG) are allowed.');
      return;
    }

    setIsUploading(true);
    try {
      await cmsApi.uploadMedia(file);
      onShowToast(`Uploaded image "${file.name}"`);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed uploading file.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    const fullUrl = url.startsWith('/') ? window.location.origin + url : url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    onShowToast('Image URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteMedia = async (id: string, name: string) => {
    if (!confirm(`Delete image "${name}"?`)) return;
    try {
      await cmsApi.deleteMedia(id);
      onShowToast('Image removed from media library');
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed deleting image');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Media Library & Asset Manager</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Upload product photos, showroom banners, and logos. Copy image links for use in products & hero sections.
          </p>
        </div>

        <label className="bg-[#000d22] hover:bg-[#0b2240] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto">
          <Upload className="w-4 h-4 text-[#f2b800]" />
          <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
          <input
            type="file"
            accept="image/*"
            disabled={isUploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-zinc-200 text-center hover:border-[#000d22] transition-colors group">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl mx-auto flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
          <ImageIcon className="w-6 h-6" />
        </div>
        <p className="text-xs font-bold text-zinc-800">Drag & Drop new product photos or showroom banners here</p>
        <p className="text-[11px] text-zinc-400 mt-0.5">Supports PNG, JPG, WEBP, SVG up to 10MB</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search media by filename or link..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-[#000d22]"
          />
        </div>
        <span className="text-xs text-zinc-500 font-semibold hidden sm:inline">
          {filteredMedia.length} Media Files
        </span>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredMedia.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden group flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div className="relative aspect-square bg-zinc-100 overflow-hidden flex items-center justify-center">
              <img
                src={m.url}
                alt={m.originalName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/300?text=Image+Preview';
                }}
              />
              <a
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                title="View full image in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-3 text-xs space-y-1.5">
              <p className="font-bold text-zinc-800 truncate" title={m.originalName}>
                {m.originalName}
              </p>
              <p className="text-[10px] text-zinc-400 font-mono">
                {(m.size / 1024).toFixed(1)} KB
              </p>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                <button
                  onClick={() => handleCopyUrl(m.url, m.id)}
                  className="px-2 py-1 rounded-lg bg-zinc-100 hover:bg-[#000d22] hover:text-white text-zinc-700 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === m.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDeleteMedia(m.id, m.originalName)}
                  className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete media file"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { authFetch } from '../../utils/api';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  FileText,
  Folder,
  ExternalLink,
} from 'lucide-react';
import { MediaItem } from '../../types';
import { ImagePicker } from './ImagePicker';

export const MediaManager: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/admin/media');
      const data = await res.json();
      setMediaList(data.media || []);
    } catch (err) {
      console.error('Failed loading media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const res = await authFetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed.');

      fetchMedia();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this media file?')) return;
    try {
      const res = await authFetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed deleting media.');
      fetchMedia();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = (mediaList || []).filter((m) =>
    (m?.originalName || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-teal-400" />
            Media & Asset Library
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload images and PDF catalogues up to 50MB for use across the site.
          </p>
        </div>

        <label className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2 cursor-pointer">
          {uploading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          Upload Asset (Image / PDF)
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 text-teal-400">
          <Upload className="w-4 h-4" /> Quick Add Image (Upload File, Paste Image from Clipboard, or Paste URL)
        </h2>
        <ImagePicker
          value=""
          onChange={(_url) => {
            fetchMedia();
          }}
          placeholder="Paste photo URL or click Copy/Paste tab..."
          helpText="Choose any mode: upload local file, paste copied screenshot/image, or paste web image link"
        />
      </div>

      <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search media files by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white pl-9 pr-4 py-2 rounded-lg text-xs outline-none focus:border-teal-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading asset library...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">No media assets found.</div>
        ) : (
          filtered.map((media) => {
            const isPdf = media.mimeType === 'application/pdf' || media.url.endsWith('.pdf');
            return (
              <div
                key={media.id}
                className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden group hover:border-teal-500/50 transition flex flex-col justify-between"
              >
                <div className="h-32 bg-slate-900 relative flex items-center justify-center overflow-hidden">
                  {isPdf ? (
                    <div className="text-center p-3">
                      <FileText className="w-10 h-10 text-rose-400 mx-auto mb-1" />
                      <span className="text-[10px] text-slate-300 font-bold uppercase">PDF Document</span>
                    </div>
                  ) : (
                    <img
                      src={media.url}
                      alt={media.originalName}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  )}
                </div>

                <div className="p-2.5 text-[11px] space-y-1">
                  <p className="font-semibold text-white truncate" title={media.originalName}>
                    {media.originalName}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {(media.size / (1024 * 1024)).toFixed(2)} MB
                  </p>

                  <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between">
                    <button
                      onClick={() => handleCopyUrl(media.url, media.id)}
                      className="p-1 text-slate-300 hover:text-teal-300 rounded flex items-center gap-1 text-[10px]"
                      title="Copy Public Asset Link"
                    >
                      {copiedId === media.id ? (
                        <>
                          <Check className="w-3 h-3 text-teal-400" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy URL
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(media.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

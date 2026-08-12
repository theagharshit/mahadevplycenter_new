import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Clipboard, Image as ImageIcon, X, Check, Loader2, RefreshCw } from 'lucide-react';
import { authFetch } from '../../utils/api';

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  helpText?: string;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  value,
  onChange,
  label = 'Image',
  placeholder = 'https://...',
  aspectRatio = 'square',
  helpText,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'url'>('upload');
  const [uploading, setUploading] = useState(false);
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState(value || '');
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pasteZoneRef = useRef<HTMLDivElement>(null);

  // Sync internal urlInput if value changes externally
  React.useEffect(() => {
    setUrlInput(value || '');
    setImageError(false);
  }, [value]);

  // Upload helper
  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }

    setUploading(true);
    setPasteNotice(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await authFetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Image upload failed.');
      }

      const data = await res.json();
      if (data.media?.url) {
        onChange(data.media.url);
        setUrlInput(data.media.url);
        setPasteNotice('Image uploaded successfully!');
        setTimeout(() => setPasteNotice(null), 3000);
      } else {
        throw new Error('Invalid response from upload server.');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  // File input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  // Handle Drag and Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Clipboard Paste handler
  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement> | ClipboardEvent) => {
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    // 1. Check for image files in clipboard
    const items = clipboardData.items;
    let foundImage = false;

    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            foundImage = true;
            setPasteNotice('Pasted image detected. Uploading...');
            await uploadFile(file);
            return;
          }
        }
      }
    }

    // 2. Check for text URL in clipboard
    const pastedText = clipboardData.getData('text/plain')?.trim();
    if (pastedText && (pastedText.startsWith('http://') || pastedText.startsWith('https://') || pastedText.startsWith('/'))) {
      e.preventDefault();
      onChange(pastedText);
      setUrlInput(pastedText);
      setPasteNotice('Pasted image URL applied!');
      setTimeout(() => setPasteNotice(null), 3000);
    } else if (!foundImage) {
      setPasteNotice('No valid image or image URL found in clipboard.');
      setTimeout(() => setPasteNotice(null), 3000);
    }
  };

  // Apply URL input
  const handleUrlSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onChange(urlInput.trim());
  };

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-[#1c1b1b] font-semibold text-xs">{label}</label>
          {helpText && <span className="text-[11px] text-[#43474e]">{helpText}</span>}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1.5 bg-[#f6f3f2] p-1 rounded-xl border border-[#c4c6cf] text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg font-medium transition flex items-center justify-center gap-1.5 ${
            activeTab === 'upload'
              ? 'bg-[#000d22] text-white shadow-xs'
              : 'text-[#43474e] hover:text-[#000d22] hover:bg-white'
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-[#e9c176]" />
          Upload File
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('paste')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg font-medium transition flex items-center justify-center gap-1.5 ${
            activeTab === 'paste'
              ? 'bg-[#000d22] text-white shadow-xs'
              : 'text-[#43474e] hover:text-[#000d22] hover:bg-white'
          }`}
        >
          <Clipboard className="w-3.5 h-3.5 text-[#e9c176]" />
          Copy / Paste
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg font-medium transition flex items-center justify-center gap-1.5 ${
            activeTab === 'url'
              ? 'bg-[#000d22] text-white shadow-xs'
              : 'text-[#43474e] hover:text-[#000d22] hover:bg-white'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5 text-[#e9c176]" />
          Paste URL
        </button>
      </div>

      {/* Mode 1: Upload File */}
      {activeTab === 'upload' && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#c4c6cf] hover:border-[#775a19] rounded-xl p-4 bg-white hover:bg-[#f8f3f0] transition text-center cursor-pointer group relative"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center space-y-1.5">
            <div className="p-2.5 bg-[#f6f3f2] group-hover:bg-[#775a19]/10 text-[#000d22] group-hover:text-[#775a19] rounded-xl transition">
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#775a19]" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>
            <p className="text-xs font-semibold text-[#000d22]">
              {uploading ? 'Uploading image...' : 'Click or Drag & Drop image file here'}
            </p>
            <p className="text-[11px] text-[#43474e]">Supports JPG, PNG, WEBP, SVG</p>
          </div>
        </div>
      )}

      {/* Mode 2: Copy / Paste Image */}
      {activeTab === 'paste' && (
        <div
          ref={pasteZoneRef}
          tabIndex={0}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-[#775a19]/50 hover:border-[#775a19] rounded-xl p-4 bg-[#f8f3f0] transition text-center focus:outline-none focus:ring-2 focus:ring-[#775a19]/50 cursor-pointer relative"
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-2.5 bg-[#775a19]/10 text-[#775a19] rounded-xl">
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#775a19]" />
              ) : (
                <Clipboard className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-[#000d22]">Click here & press Ctrl+V / Cmd+V</p>
              <p className="text-[11px] text-[#43474e] mt-0.5">
                Paste an image copied from your clipboard, screenshot tool, or an image link
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Paste URL */}
      {activeTab === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleUrlSubmit();
              }
            }}
            placeholder={placeholder}
            className="flex-1 bg-white border border-[#c4c6cf] text-[#1c1b1b] text-xs px-3 py-2 rounded-xl outline-none focus:border-[#000d22] font-mono"
          />
          <button
            type="button"
            onClick={() => handleUrlSubmit()}
            className="px-4 py-2 bg-[#000d22] hover:bg-[#002349] text-white text-xs font-semibold rounded-xl transition shrink-0"
          >
            Apply URL
          </button>
        </div>
      )}

      {/* Notice Message */}
      {pasteNotice && (
        <p className="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          {pasteNotice}
        </p>
      )}

      {/* Image Preview */}
      {value ? (
        <div className="relative group bg-white border border-[#c4c6cf] rounded-xl p-2 flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg bg-[#f6f3f2] overflow-hidden shrink-0 border border-[#e5e2e1] relative">
            {!imageError ? (
              <img
                src={value}
                alt="Preview"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-[10px]">
                <ImageIcon className="w-5 h-5 mb-0.5" />
                Invalid
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-xs font-medium text-[#1c1b1b] truncate font-mono">{value}</p>
            <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" />
              Active Image Selected
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              onChange('');
              setUrlInput('');
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            title="Remove Image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
};

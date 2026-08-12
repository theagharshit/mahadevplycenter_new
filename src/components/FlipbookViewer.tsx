import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PageFlip } from 'page-flip';
import { generateInteractiveCataloguePages } from '../utils/catalogueGenerator';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Download,
  Printer,
  Share2,
  Grid,
  Phone,
  MessageSquare,
  FileText,
  Loader2,
  Check,
  Sparkles,
} from 'lucide-react';

// Configure CDN worker for pdfjs-dist
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

interface FlipbookViewerProps {
  pdfUrl?: string;
  title: string;
  brandName?: string;
  isOpen: boolean;
  onClose: () => void;
  onOpenQuoteModal?: (brandName?: string) => void;
}

export const FlipbookViewer: React.FC<FlipbookViewerProps> = ({
  pdfUrl,
  title,
  brandName = 'Mahadev Ply Center',
  isOpen,
  onClose,
  onOpenQuoteModal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pageFlipInstance = useRef<PageFlip | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [pagesCount, setPagesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isGeneratedFallback, setIsGeneratedFallback] = useState(false);

  // View state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [jumpInput, setJumpInput] = useState('1');
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  const currentPageRef = useRef(currentPage);
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // Preload images into browser memory cache for lag-free page flipping
  useEffect(() => {
    if (pageImages.length === 0) return;
    pageImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [pageImages]);

  // Measure stage dimensions with debouncing and threshold to prevent glitchy re-renders
  useEffect(() => {
    if (!isOpen) return;

    let resizeTimer: NodeJS.Timeout;

    const updateStageSize = () => {
      if (stageRef.current) {
        const rect = stageRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setStageSize((prev) => {
            // Only update if difference is noticeable (>25px) or uninitialized
            if (
              prev.width === 0 ||
              Math.abs(prev.width - rect.width) > 25 ||
              Math.abs(prev.height - rect.height) > 25
            ) {
              return { width: rect.width, height: rect.height };
            }
            return prev;
          });
        }
      }
    };

    updateStageSize();
    const timer1 = setTimeout(updateStageSize, 100);

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateStageSize, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer1);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  // Load PDF or Fallback Catalogue pages when modal opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);
    setLoadingProgress(10);
    setHasError(false);
    setPageImages([]);
    setCurrentPage(1);
    setIsGeneratedFallback(false);

    const loadPages = async () => {
      // Helper for procedural interactive pages
      const loadGeneratedCatalogue = async () => {
        try {
          if (isMounted) setLoadingProgress(50);
          const genPages = await generateInteractiveCataloguePages(brandName, title);
          if (isMounted) {
            setPageImages(genPages);
            setPagesCount(genPages.length);
            setIsGeneratedFallback(true);
            setLoading(false);
          }
        } catch (e) {
          console.error('Failed generating interactive catalogue fallback:', e);
          if (isMounted) {
            setLoading(false);
            setHasError(true);
          }
        }
      };

      if (!pdfUrl || pdfUrl.trim() === '') {
        await loadGeneratedCatalogue();
        return;
      }

      try {
        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
        });
        const pdf = await loadingTask.promise;

        if (!isMounted) return;
        const total = pdf.numPages;
        setPagesCount(total);

        const renderedImages: string[] = [];

        for (let pageNum = 1; pageNum <= total; pageNum++) {
          if (!isMounted) return;
          const page = await pdf.getPage(pageNum);

          const viewport = page.getViewport({ scale: 1.6 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          if (!context) continue;

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: context,
            viewport: viewport,
            canvasFactory: undefined,
          } as any).promise;

          const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
          renderedImages.push(dataUrl);

          if (isMounted) {
            setLoadingProgress(Math.round((pageNum / total) * 100));
          }
        }

        if (isMounted) {
          if (renderedImages.length > 0) {
            setPageImages(renderedImages);
            setLoading(false);
          } else {
            await loadGeneratedCatalogue();
          }
        }
      } catch (err) {
        console.warn('PDF parsing failed or worker blocked, switching to interactive generated catalogue:', err);
        if (isMounted) {
          await loadGeneratedCatalogue();
        }
      }
    };

    loadPages();

    return () => {
      isMounted = false;
    };
  }, [isOpen, pdfUrl, brandName, title]);

  // Initialize PageFlip library when images are ready
  useEffect(() => {
    if (loading || hasError || pageImages.length === 0 || !containerRef.current) return;

    // Calculate optimal single-page dimensions based on current stage viewport size
    const calculatePageDimensions = () => {
      const isMobile = window.innerWidth < 768;
      const stageW = stageSize.width || window.innerWidth;
      const stageH = stageSize.height || (window.innerHeight - 130);

      const availW = Math.max(280, stageW - (isMobile ? 20 : 100));
      const availH = Math.max(300, stageH - (isMobile ? 20 : 30));

      // Standard page aspect ratio (Height / Width)
      const pageRatio = 1.38;

      if (isMobile) {
        let h = Math.min(availH, availW * pageRatio);
        let w = h / pageRatio;
        return { width: Math.round(w), height: Math.round(h), isMobile: true };
      } else {
        // 2-page spread: spread width = 2 * w <= availW => w <= availW / 2
        let wLimit = availW / 2;
        let h = Math.min(availH, wLimit * pageRatio);
        let w = h / pageRatio;
        return { width: Math.round(w), height: Math.round(h), isMobile: false };
      }
    };

    const { width: pageW, height: pageH, isMobile } = calculatePageDimensions();

    // Timer ensures DOM nodes are rendered before PageFlip parses `.page-slide`
    const timer = setTimeout(() => {
      if (!containerRef.current) return;

      // Destroy existing instance if any
      if (pageFlipInstance.current) {
        try {
          pageFlipInstance.current.destroy();
        } catch (e) {
          // ignore
        }
        pageFlipInstance.current = null;
      }

      try {
        const pf = new PageFlip(containerRef.current, {
          width: pageW,
          height: pageH,
          size: 'fixed',
          minWidth: 160,
          maxWidth: 1200,
          minHeight: 220,
          maxHeight: 1600,
          drawShadow: true,
          maxShadowOpacity: 0.4,
          flippingTime: 550,
          showCover: true,
          mobileScrollSupport: false,
          usePortrait: isMobile,
          startPage: Math.max(0, currentPageRef.current - 1),
        });

        const slides = Array.from(containerRef.current.querySelectorAll('.page-slide')) as HTMLElement[];
        slides.forEach((slide) => {
          slide.style.width = `${pageW}px`;
          slide.style.height = `${pageH}px`;
          slide.style.willChange = 'transform';
          slide.style.transform = 'translateZ(0)';
          slide.style.backfaceVisibility = 'hidden';
        });

        if (slides.length > 0) {
          pf.loadFromHTML(slides);

          pf.on('flip', (e) => {
            const p = (e.data as number) + 1;
            setCurrentPage(p);
            setJumpInput(String(p));
          });

          pageFlipInstance.current = pf;
        }
      } catch (err) {
        console.error('PageFlip initialization error:', err);
      }
    }, 80);

    return () => {
      clearTimeout(timer);
      if (pageFlipInstance.current) {
        try {
          pageFlipInstance.current.destroy();
        } catch (e) {
          // ignore
        }
        pageFlipInstance.current = null;
      }
    };
  }, [loading, hasError, pageImages, stageSize]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        pageFlipInstance.current?.flipNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        pageFlipInstance.current?.flipPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Fullscreen listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  if (!isOpen) return null;

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  const handlePrevPage = () => {
    pageFlipInstance.current?.flipPrev();
  };

  const handleNextPage = () => {
    pageFlipInstance.current?.flipNext();
  };

  const handleJumpToPage = (targetNum: number) => {
    if (!pageFlipInstance.current) return;
    const clamped = Math.max(1, Math.min(pagesCount, targetNum));
    pageFlipInstance.current.turnToPage(clamped - 1);
    setCurrentPage(clamped);
    setJumpInput(String(clamped));
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${(brandName || 'catalogue').toLowerCase().replace(/\s+/g, '_')}_catalogue.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (onOpenQuoteModal) {
      onOpenQuoteModal(brandName);
    }
  };

  const handlePrint = () => {
    if (pageImages.length === 0) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${title} - Mahadev Ply Center</title>
          <style>
            body { margin: 0; padding: 20px; font-family: sans-serif; text-align: center; background: #fff; }
            .print-page { page-break-after: always; margin-bottom: 30px; }
            img { max-width: 100%; height: auto; }
          </style>
        </head>
        <body>
          <h2>${title}</h2>
          ${pageImages.map((img, i) => `<div class="print-page"><h3>Page ${i + 1}</h3><img src="${img}" /></div>`).join('')}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${title} - Mahadev Ply Center`,
        text: `Browse the official interactive 3D catalogue for ${brandName} at Mahadev Ply Center Lalitpur!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950/95 backdrop-blur-md text-white select-none animate-fadeIn">
      {/* Top Navigation Header */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-zinc-800 bg-zinc-900/90 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#f2b800] text-[#000d22] flex items-center justify-center font-extrabold text-sm shadow-md">
            MP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm md:text-base font-bold text-white tracking-wide truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {title}
              </h2>
              {isGeneratedFallback && (
                <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  <span>3D Digital Swatches</span>
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 font-medium hidden sm:block">
              Interactive 3D Catalogue Flipbook • Mahadev Ply Center
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Share Catalogue"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden md:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>

          {/* Download PDF */}
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Download PDF Catalogue"
          >
            <Download className="w-4 h-4 text-[#f2b800]" />
            <span className="hidden md:inline">{pdfUrl ? 'Download PDF' : 'Request PDF'}</span>
          </button>

          {/* Print */}
          {pageImages.length > 0 && (
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-semibold"
              title="Print Catalogue"
            >
              <Printer className="w-4 h-4" />
            </button>
          )}

          {/* Fullscreen */}
          <button
            onClick={handleToggleFullscreen}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer hidden sm:block"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer ml-2"
            title="Close Viewer (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Stage */}
      <div ref={stageRef} className="flex-1 relative overflow-hidden flex items-center justify-center p-2 sm:p-6">
        {/* Thumbnail Drawer Sidebar */}
        {showThumbnails && pageImages.length > 0 && (
          <div className="absolute left-0 top-0 bottom-0 z-30 w-64 bg-zinc-900/95 border-r border-zinc-800 p-4 overflow-y-auto flex flex-col gap-3 backdrop-blur-md shadow-2xl animate-slideRight">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Catalogue Thumbnails</span>
              <button
                onClick={() => setShowThumbnails(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {pageImages.map((img, idx) => {
                const pageNum = idx + 1;
                const isActive = currentPage === pageNum;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      handleJumpToPage(pageNum);
                      setShowThumbnails(false);
                    }}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer group ${
                      isActive ? 'border-[#f2b800] ring-2 ring-[#f2b800]/50 scale-105' : 'border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    <img src={img} alt={`Page ${pageNum}`} className="w-full h-auto object-cover" />
                    <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] font-bold px-1.5 py-0.5 rounded text-white">
                      {pageNum}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 text-center p-8 bg-zinc-900/80 rounded-2xl border border-zinc-800 max-w-sm">
            <Loader2 className="w-10 h-10 text-[#f2b800] animate-spin" />
            <div>
              <h3 className="text-base font-bold text-white">Loading Interactive 3D Catalogue...</h3>
              <p className="text-xs text-zinc-400 mt-1">Preparing high-definition laminate swatches</p>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden mt-2">
              <div
                className="bg-gradient-to-r from-[#f2b800] to-amber-500 h-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="text-xs font-mono text-zinc-400">{loadingProgress}% Ready</span>
          </div>
        )}

        {/* Flipbook Container Stage */}
        {!loading && pageImages.length > 0 && (
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Side Navigation Buttons */}
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="absolute left-2 lg:left-6 z-20 w-12 h-12 rounded-full bg-zinc-900/80 hover:bg-[#f2b800] text-white hover:text-[#000d22] border border-zinc-700/80 flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-2xl"
              title="Previous Page (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= pagesCount}
              className="absolute right-2 lg:right-6 z-20 w-12 h-12 rounded-full bg-zinc-900/80 hover:bg-[#f2b800] text-white hover:text-[#000d22] border border-zinc-700/80 flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-2xl"
              title="Next Page (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* PageFlip Container */}
            <div ref={containerRef} className="mx-auto flex items-center justify-center">
              {pageImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="page-slide bg-white shadow-2xl overflow-hidden rounded-md border border-zinc-200 relative"
                  data-density={idx === 0 || idx === pageImages.length - 1 ? 'hard' : 'soft'}
                >
                  <img
                    src={imgUrl}
                    alt={`Page ${idx + 1}`}
                    draggable={false}
                    className="w-full h-full object-contain pointer-events-none will-change-transform"
                  />
                  <div className="absolute bottom-2 right-3 text-[10px] font-bold text-zinc-600 bg-white/90 px-2 py-0.5 rounded shadow-sm border border-zinc-200">
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Interactive Control Toolbar */}
      {!loading && pageImages.length > 0 && (
        <div className="bg-zinc-900/90 border-t border-zinc-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 z-20">
          {/* Left: Thumbnail Toggle */}
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
              showThumbnails
                ? 'bg-[#f2b800] text-[#000d22] border-[#f2b800]'
                : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span className="hidden sm:inline">Thumbnails</span>
          </button>

          {/* Center: Pagination & Navigation */}
          <div className="flex items-center gap-2 bg-zinc-800/90 px-3 py-1.5 rounded-xl border border-zinc-700/80 mx-auto">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span>Page</span>
              <input
                type="number"
                min={1}
                max={pagesCount}
                value={jumpInput}
                onChange={(e) => setJumpInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleJumpToPage(Number(jumpInput));
                  }
                }}
                onBlur={() => handleJumpToPage(Number(jumpInput))}
                className="w-11 bg-zinc-900 border border-zinc-700 rounded px-1.5 py-0.5 text-center text-white font-mono font-bold focus:outline-none focus:border-[#f2b800]"
              />
              <span className="text-zinc-400">of {pagesCount}</span>
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= pagesCount}
              className="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right: Zoom & CTA */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-lg border border-zinc-700">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono font-bold text-zinc-300 px-1">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.25))}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              {zoomLevel !== 1 && (
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1 text-amber-400 hover:text-amber-300 cursor-pointer"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {onOpenQuoteModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenQuoteModal(brandName);
                }}
                className="bg-[#f2b800] hover:bg-amber-400 text-[#000d22] font-bold px-3.5 py-1.5 rounded-lg text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>Request Quote</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

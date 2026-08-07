import React, { useEffect } from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#000d22] text-white px-6 py-3.5 rounded-xl shadow-2xl border border-[#fed488] flex items-center gap-3 animate-slideUp">
      <span className="material-symbols-outlined text-[#fed488]">check_circle</span>
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onClose} className="ml-2 text-white/80 hover:text-white">
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
};

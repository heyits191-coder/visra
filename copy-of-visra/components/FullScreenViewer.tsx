
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface FullScreenViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
}

export const FullScreenViewer: React.FC<FullScreenViewerProps> = ({ isOpen, onClose, imageSrc }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageSrc) return null;

  return (
    <div 
      className="fixed inset-0 z-[700] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300"
      onClick={onClose}
    >
      <button 
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 cursor-pointer z-[701] transition-all"
        title="Close viewer"
      >
        <X size={24} />
      </button>
      
      <div 
        className="relative w-full h-full flex items-center justify-center p-4"
        onClick={onClose}
      >
        <img 
          src={imageSrc} 
          alt="Full Screen visualization" 
          className="max-h-[95vh] max-w-[95vw] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-500 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

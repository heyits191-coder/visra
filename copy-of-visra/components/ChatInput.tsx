
import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, ArrowUp, X, Brush, Square } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string, image?: string, mask?: string) => void;
  isGenerating?: boolean;
  onStop?: () => void;
  pendingEdit?: { image: string; mask: string } | null;
  onClearPendingEdit?: () => void;
  externalImage?: string | null;
  onClearExternalImage?: () => void;
  onEditImage?: (src: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSend, 
  isGenerating, 
  onStop, 
  pendingEdit, 
  onClearPendingEdit,
  externalImage,
  onClearExternalImage,
  onEditImage
}) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 128);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    if (externalImage) {
      setSelectedImage(externalImage);
      onClearExternalImage?.();
    }
  }, [externalImage]);

  useEffect(() => {
    if (pendingEdit) textareaRef.current?.focus();
  }, [pendingEdit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isGenerating) {
      onStop?.();
      return;
    }
    
    if (input.trim() || selectedImage || pendingEdit) {
      onSend(input, pendingEdit?.image || selectedImage || undefined, pendingEdit?.mask);
      setInput('');
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = input.trim() || selectedImage || pendingEdit || isGenerating;

  return (
    <div className="mx-auto max-w-3xl relative">
      {/* Active Selection Indicator */}
      {pendingEdit && (
        <div className="absolute bottom-full left-0 mb-4 px-2 animate-in slide-in-from-bottom-2 duration-300 w-full">
          <div className="flex items-center gap-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-xl p-1.5 pr-4 shadow-2xl w-fit">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
              <img src={pendingEdit.image} alt="Target" className="h-full w-full object-cover opacity-40" />
            </div>
            <span className="text-[9px] font-black text-zinc-900 dark:text-white uppercase tracking-widest flex items-center gap-1.5">
              <Brush size={10} /> Selection Active
            </span>
            <button onClick={onClearPendingEdit} className="h-5 w-5 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400">
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      <div className="relative flex w-full flex-col gap-0 rounded-[28px] bg-white/70 dark:bg-[#1a1a1a]/70 backdrop-blur-2xl px-3 pb-3 pt-2 shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-500 overflow-hidden">
        
        {/* Inline Image Preview Area */}
        {!pendingEdit && selectedImage && (
          <div className="px-3 pt-3 pb-2 animate-in fade-in zoom-in-95 duration-300">
            <div className="relative h-24 w-fit group">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="h-24 w-auto rounded-lg border border-zinc-200 dark:border-zinc-800 object-cover" 
              />
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onEditImage?.(selectedImage)}
                  className="absolute top-2 right-10 p-1 bg-black/60 hover:bg-black text-white rounded-full cursor-pointer transition-colors"
                  title="Edit image"
                >
                  <Brush size={12} />
                </button>
                <button 
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black text-white rounded-full cursor-pointer transition-colors"
                  title="Remove image"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex w-full items-end gap-2 px-1">
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isGenerating}
            className={`mb-1.5 flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition-all ${isGenerating ? 'opacity-20 cursor-not-allowed' : 'hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
          >
            <Paperclip size={18} />
          </button>
          
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={pendingEdit ? "Refine selection details..." : "Describe your vision..."}
            className="max-h-32 flex-1 resize-none bg-transparent py-4 px-1 text-[15px] font-medium text-zinc-800 dark:text-zinc-100 focus:outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-600 leading-relaxed scrollbar-hide"
          />

          <button
            onClick={() => handleSubmit()}
            disabled={!canSend}
            className={`mb-1.5 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
              canSend ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-xl' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <Square size={14} fill="currentColor" />
            ) : (
              <ArrowUp size={20} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};


import React, { useState, useRef, useEffect } from 'react';
import { X, Wand2, RotateCcw, Brush as BrushIcon } from 'lucide-react';

interface ImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onSave: (maskBase64: string) => void;
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ isOpen, onClose, imageSrc, onSave }) => {
  const [prompt, setPrompt] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    // Set canvas dimensions to match the image's natural dimensions
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const context = canvas.getContext('2d');
    if (context) {
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      context.lineWidth = 40;
      setCtx(context);
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = (e as React.TouchEvent).touches[0].clientX;
      clientY = (e as React.TouchEvent).touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    // Map screen coordinates to the actual canvas pixel coordinates (natural width/height)
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!ctx) return;
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!ctx) return;
    ctx.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleGenerate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a final mask: black background with white strokes
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvas.width;
    finalCanvas.height = canvas.height;
    const fctx = finalCanvas.getContext('2d');
    
    if (fctx) {
      fctx.fillStyle = 'black';
      fctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      fctx.drawImage(canvas, 0, 0);
      
      const maskBase64 = finalCanvas.toDataURL('image/png');
      onSave(maskBase64);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[600] bg-black/95 flex flex-col animate-in fade-in duration-300 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-8 py-5">
        <div className="flex items-center gap-3">
          <Wand2 size={20} className="text-white" />
          <h2 className="text-lg font-bold text-white uppercase tracking-[0.2em]">Edit Image</h2>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={clearCanvas}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <RotateCcw size={16} /> Reset
          </button>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white transition-all"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex items-center justify-center overflow-hidden p-4 relative bg-black">
        <div className="relative w-fit h-fit bg-zinc-900 rounded-lg overflow-hidden ring-1 ring-white/10">
          <img 
            ref={imageRef}
            src={imageSrc} 
            alt="Source" 
            className="max-h-[70vh] max-w-[90vw] object-contain pointer-events-none select-none"
            onLoad={handleImageLoad}
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full text-white text-[11px] font-black uppercase tracking-widest pointer-events-none border border-white/10">
          <BrushIcon size={14} /> Brush the area to change
        </div>
      </div>

      {/* Footer Controls */}
      <div className="border-t border-white/10 bg-zinc-900/50 backdrop-blur-xl px-8 py-8">
        <div className="mx-auto max-w-2xl flex flex-col gap-4">
          <div className="relative flex items-center">
            <input 
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe changes (e.g., Make the floor wood)..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-medium text-white focus:border-white focus:outline-none transition-all placeholder:text-zinc-500"
            />
            <button 
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className={`absolute right-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                prompt.trim() 
                ? 'bg-white text-black shadow-xl hover:scale-105 active:scale-95' 
                : 'bg-white/5 text-zinc-600 cursor-not-allowed'
              }`}
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

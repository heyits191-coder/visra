
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { Pencil, Copy, Check, Download, Brush, Maximize2 } from 'lucide-react';
import { useToast } from './ToastContext';

interface ChatMessageProps {
  message: Message;
  onEditImage?: (image: string) => void;
  onViewFullScreen?: (image: string) => void;
  onUpdateMessage?: (newContent: string) => void;
  isStreaming?: boolean;
}

const VisraLogo = () => (
  <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-md bg-black dark:bg-white text-white dark:text-black font-bold text-sm select-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
    V
  </div>
);

const BlinkingCursor = () => (
  <span className="inline-block w-[6px] h-[15px] bg-zinc-900 dark:bg-zinc-100 ml-1 translate-y-0.5 animate-cursor-blink" />
);

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onEditImage, onViewFullScreen, onUpdateMessage, isStreaming }) => {
  const isAssistant = message.role === 'assistant';
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.content);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && editTextareaRef.current) {
      editTextareaRef.current.focus();
      editTextareaRef.current.setSelectionRange(
        editTextareaRef.current.value.length,
        editTextareaRef.current.value.length
      );
    }
  }, [isEditing]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.show("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `visra-render-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.show("Download started");
  };

  const handleSave = () => {
    if (onUpdateMessage) {
      onUpdateMessage(editedText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedText(message.content);
    setIsEditing(false);
  };

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let currentTableRows: string[][] = [];

    const flushTable = (key: number) => {
      if (currentTableRows.length > 0) {
        elements.push(
          <div key={`table-${key}`} className="overflow-x-auto my-6 w-full max-w-full">
            <table>
              <thead>
                <tr>
                  {currentTableRows[0].map((cell, idx) => (
                    <th key={idx}>{cell.trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentTableRows.slice(2).map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx}>{cell.trim()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        currentTableRows = [];
      }
    };

    lines.forEach((line, i) => {
      const isLastLine = i === lines.length - 1;
      
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const cells = line.trim().split('|').filter(c => c !== '');
        currentTableRows.push(cells);
        if (isLastLine) flushTable(i);
        return;
      } else {
        flushTable(i);
      }

      let processed = line;
      processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      if (processed.startsWith('# ')) {
        elements.push(<h3 key={i} className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4 first:mt-0">{processed.replace('# ', '')}</h3>);
        return;
      }

      if (processed.trim().startsWith('- ')) {
        elements.push(
          <div key={i} className="flex gap-3 items-start ml-2 my-2">
            <span className="text-zinc-400 dark:text-zinc-600 mt-2.5 shrink-0 text-[5px]">●</span>
            <span dangerouslySetInnerHTML={{ __html: processed.replace('- ', '') }} />
            {isLastLine && isStreaming && <BlinkingCursor />}
          </div>
        );
        return;
      }

      elements.push(
        <div key={i} className="min-h-[1.5em]">
          <span dangerouslySetInnerHTML={{ __html: processed }} />
          {isLastLine && isStreaming && <BlinkingCursor />}
        </div>
      );
    });

    return elements;
  };

  return (
    <div className={`group w-full py-6 md:py-8 flex ${isAssistant ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
      {/* Outer row container */}
      <div className={`flex w-full max-w-5xl gap-3 md:gap-4 ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar Area */}
        <div className="shrink-0 pt-1">
          {isAssistant ? <VisraLogo /> : <div className="w-8" />}
        </div>
        
        {/* Content Wrapper */}
        <div className={`flex flex-col gap-3 min-w-0 shrink-0 ${isAssistant ? 'w-fit max-w-[90%] md:max-w-[70%]' : 'w-full max-w-[85%] md:max-w-[70%]'}`}>
          
          <div className={`flex flex-col gap-4 w-full ${!isAssistant ? 'items-end' : 'items-start'}`}>
            {message.image && (
              <div className="relative group overflow-hidden rounded-[24px] shadow-md transition-all duration-300 border border-zinc-100 dark:border-zinc-800 w-full">
                <div className="relative inline-block w-full">
                  <img 
                    src={message.image} 
                    alt="Visualization" 
                    className="h-auto w-full object-contain max-h-[512px] cursor-zoom-in" 
                    onClick={() => onViewFullScreen?.(message.image!)} 
                  />
                  
                  {message.mask && !isAssistant && (
                    <div className="absolute inset-0 pointer-events-none">
                      <img src={message.mask} alt="Mask" className="h-auto w-full object-contain opacity-40 mix-blend-screen" />
                    </div>
                  )}

                  {/* Overlay Controls */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {!isAssistant && onEditImage && !message.mask && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onEditImage(message.image!); }}
                        className="p-2 bg-black/60 text-white rounded-full shadow-xl hover:bg-black transition-all cursor-pointer"
                        title="Edit selection"
                      >
                        <Brush size={18} />
                      </button>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onViewFullScreen?.(message.image!); }}
                      className="p-2 bg-black/60 text-white rounded-full shadow-xl hover:bg-black transition-all cursor-pointer"
                      title="View full screen"
                    >
                      <Maximize2 size={18} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDownload(message.image!); }}
                      className="p-2 bg-black/60 text-white rounded-full shadow-xl hover:bg-black transition-all cursor-pointer"
                      title="Download image"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {message.content && (
              <div 
                className={`relative transition-all select-text text-[15.5px] leading-7 
                  ${isAssistant 
                    ? 'text-gray-800 dark:text-zinc-200 bg-transparent w-fit' 
                    : `text-zinc-900 dark:text-zinc-100 ${isEditing ? 'w-full' : 'bg-[#f4f4f4] dark:bg-[#2f2f2f] px-6 py-4 rounded-[26px] shadow-sm ml-auto w-fit'}`
                  }`}
              >
                {isEditing ? (
                  <div className="flex flex-col gap-3 w-full">
                    <textarea
                      ref={editTextareaRef}
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="w-full p-4 bg-zinc-50 dark:bg-[#1a1a1a] rounded-2xl border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-zinc-500 outline-none resize-none min-h-[100px] text-[15.5px]"
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={handleSave}
                        className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl text-xs font-bold hover:scale-105 active:scale-95 transition-all"
                      >
                        Save
                      </button>
                      <button 
                        onClick={handleCancel}
                        className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-xl text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="group/text flex items-start gap-3">
                    <div className="space-y-1">
                      {renderContent(message.content)}
                    </div>
                    {!isAssistant && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="opacity-0 group-hover/text:opacity-100 transition-opacity p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                        title="Edit message"
                      >
                        <Pencil size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {isAssistant && (
              <div className="flex items-center gap-5 px-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <button 
                    onClick={() => handleCopy(message.content)}
                    className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                    title="Copy response"
                  >
                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                  {message.image && (
                     <button 
                      onClick={() => handleDownload(message.image!)}
                      className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                      title="Download render"
                    >
                      <Download size={14} />
                    </button>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

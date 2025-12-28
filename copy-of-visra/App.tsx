
import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatInput } from './components/ChatInput';
import { Greeting } from './components/Greeting';
import { ChatMessage } from './components/ChatMessage';
import { ImageEditorModal } from './components/ImageEditorModal';
import { SettingsModal } from './components/SettingsModal';
import { PricingModal } from './components/PricingModal';
import { LoginScreen } from './components/LoginScreen';
import { FullScreenViewer } from './components/FullScreenViewer';
import { TypingBubble } from './components/TypingBubble';
import LandingPage from './components/LandingPage';
import { ToastProvider, useToast } from './components/ToastContext';
import { Message, PendingEdit, Theme, ChatSession } from './types';
import { PanelLeft, Upload, ArrowDown, Menu, X } from 'lucide-react';
// Import Google GenAI SDK
import { GoogleGenAI } from "@google/genai";

const AppContent: React.FC = () => {
  const toast = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // Mobile Sidebar State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Persistence States
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Image Editor States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorImageSrc, setEditorImageSrc] = useState<string | null>(null);
  const [pendingEdit, setPendingEdit] = useState<PendingEdit | null>(null);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [viewingImageSrc, setViewingImageSrc] = useState<string | null>(null);
  const [stagedImage, setStagedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);
  const typingIntervalRef = useRef<any>(null);

  // 1. Initial Load & Hydration
  useEffect(() => {
    setIsMounted(true);
    
    const savedHistory = localStorage.getItem('visra_history');
    if (savedHistory) setChatSessions(JSON.parse(savedHistory));

    const savedCurrent = localStorage.getItem('visra_current_chat');
    if (savedCurrent) {
      const { sessionId, messages: savedMessages } = JSON.parse(savedCurrent);
      setMessages(savedMessages);
      setCurrentSessionId(sessionId);
    }

    const savedTheme = localStorage.getItem('visra-theme') as Theme;
    if (savedTheme) setTheme(savedTheme);

    const savedLanding = localStorage.getItem('visra_skip_landing');
    if (savedLanding === 'true') setShowLanding(false);
  }, []);

  // 2. Auto-Save Logic
  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('visra_history', JSON.stringify(chatSessions));
  }, [chatSessions, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('visra_current_chat', JSON.stringify({ 
      sessionId: currentSessionId, 
      messages 
    }));

    if (currentSessionId && messages.length > 0) {
      setChatSessions(prev => prev.map(s => 
        s.id === currentSessionId ? { ...s, messages, timestamp: Date.now() } : s
      ));
    }
  }, [messages, currentSessionId, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = (currentTheme: Theme) => {
      if (currentTheme === 'dark' || (currentTheme === 'system' && mediaQuery.matches)) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };
    applyTheme(theme);
    localStorage.setItem('visra-theme', theme);
  }, [theme, isMounted]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (viewingImageSrc) setViewingImageSrc(null);
        else if (isSettingsOpen) setIsSettingsOpen(false);
        else if (isPricingOpen) setIsPricingOpen(false);
        else if (isEditorOpen) setIsEditorOpen(false);
        else if (isGenerating) handleStopGeneration();
        else if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [viewingImageSrc, isSettingsOpen, isPricingOpen, isEditorOpen, isGenerating, isMobileMenuOpen]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 300;
      setShowScrollButton(!isNearBottom);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setStagedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast.show("Only image files are supported");
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current && !showScrollButton) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isTyping, showScrollButton]);

  const handleStopGeneration = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    
    setIsGenerating(false);
    setIsTyping(false);

    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.role === 'assistant') {
        return [...prev.slice(0, -1), { ...last, content: last.content + " [Stopped]" }];
      }
      return prev;
    });
  };

  const handleLoginSuccess = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsTransitioning(false);
      toast.show("Successfully signed in");
    }, 800);
  };

  const handleLogout = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsAuthenticated(false);
      setMessages([]);
      setShowLanding(true);
      localStorage.setItem('visra_skip_landing', 'true');
      setIsTransitioning(false);
    }, 600);
  };

  const handleOpenEditor = (src: string) => {
    setEditorImageSrc(src);
    setIsEditorOpen(true);
  };

  const handleUpdateMessage = (id: string, newContent: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, content: newContent } : msg
    ));
  };

  // Utility to split base64 and mime from data URI
  const extractDataFromUri = (uri: string) => {
    const parts = uri.split(',');
    if (parts.length !== 2) return null;
    const mimeMatch = parts[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    return {
      mimeType: mimeMatch[1],
      data: parts[1]
    };
  };

  const handleSendMessage = async (text: string, image?: string, mask?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      image: image,
      mask: mask,
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    if (!currentSessionId) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: text.length > 30 ? text.slice(0, 30) + '...' : text,
        timestamp: Date.now(),
        messages: updatedMessages
      };
      setChatSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
    }

    setPendingEdit(null);
    setStagedImage(null);
    setIsTyping(true);
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const contentsParts: any[] = [];
      
      if (image) {
        const imgData = extractDataFromUri(image);
        if (imgData) {
          contentsParts.push({
            inlineData: {
              data: imgData.data,
              mimeType: imgData.mimeType,
            },
          });
        }
      }

      if (mask) {
        const maskData = extractDataFromUri(mask);
        if (maskData) {
          contentsParts.push({
            inlineData: {
              data: maskData.data,
              mimeType: maskData.mimeType,
            },
          });
        }
      }

      contentsParts.push({ text: text || "Redesign the following interior space with modern principles." });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: contentsParts },
        config: {
          systemInstruction: "You are Visra, a premium AI interior architect. When provided with an image, you must generate a new visualization part and provide professional design commentary. Focus on high-fidelity realism, spatial flow, and natural lighting. If a mask is provided (the second image part), prioritize editing that specific area.",
        }
      });

      let responseText = "";
      let responseImage = "";

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.text) {
            responseText += part.text;
          } else if (part.inlineData) {
            responseImage = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          }
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        image: responseImage || undefined,
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);

      if (responseText) {
        let currentText = "";
        typingIntervalRef.current = setInterval(() => {
          if (currentText.length < responseText.length) {
            currentText += responseText[currentText.length];
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.role === 'assistant') {
                return [...prev.slice(0, -1), { ...last, content: currentText }];
              }
              return prev;
            });
          } else {
            clearInterval(typingIntervalRef.current);
            setIsGenerating(false);
          }
        }, 15);
      } else {
        setIsGenerating(false);
      }

    } catch (err) {
      console.error("Gemini Generation Error:", err);
      toast.show("Design generation failed. Please try again.");
      setIsGenerating(false);
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    handleStopGeneration();
    setMessages([]);
    setCurrentSessionId(null);
    setPendingEdit(null);
    setEditorImageSrc(null);
    setIsEditorOpen(false);
    setStagedImage(null);
    if (window.innerWidth < 768) setIsMobileMenuOpen(false);
  };

  const handleSelectSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      setCurrentSessionId(sessionId);
      if (window.innerWidth < 768) setIsMobileMenuOpen(false);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      setMessages([]);
      setCurrentSessionId(null);
    }
  };

  const handleRenameSession = (sessionId: string, newTitle: string) => {
    setChatSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, title: newTitle } : s
    ));
  };

  const handleViewFullScreen = (src: string) => {
    setViewingImageSrc(src);
  };

  const handleCloseFullScreen = () => {
    setViewingImageSrc(null);
  };

  const handleStartDesigning = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowLanding(false);
      localStorage.setItem('visra_skip_landing', 'true');
      setIsTransitioning(false);
    }, 600);
  };

  if (!isMounted) return null;

  if (showLanding) {
    return (
      <div className={`w-full bg-white text-black transition-all duration-700 ease-in-out ${isTransitioning ? 'opacity-0 scale-105 blur-lg' : 'opacity-100 scale-100'}`}>
        <LandingPage onStart={handleStartDesigning} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`w-full min-h-screen transition-all duration-700 ease-in-out ${isTransitioning ? 'opacity-0 scale-105 blur-lg' : 'opacity-100 scale-100'}`}>
        <LoginScreen onLogin={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-white dark:bg-[#111111] overflow-hidden relative selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black antialiased font-sans">
      
      {/* MOBILE OVERLAY (Drawer Backdrop) - Highest Z */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden transition-opacity animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR: Fixed position drawer for mobile, Fixed offset for desktop */}
      <div 
        className={`fixed inset-y-0 left-0 z-[70] w-64 bg-zinc-50 dark:bg-black transform transition-transform duration-300 ease-in-out md:translate-x-0 
          ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} 
          ${isSidebarOpen ? 'md:flex' : 'md:hidden md:-translate-x-full'}`}
      >
        <Sidebar 
          isOpen={isSidebarOpen} 
          onToggle={() => {
            if (window.innerWidth < 768) setIsMobileMenuOpen(false);
            else setIsSidebarOpen(false);
          }} 
          onNewChat={handleNewChat}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenPricing={() => setIsPricingOpen(true)}
          onLogout={handleLogout}
          sessions={chatSessions}
          selectedSessionId={currentSessionId}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
          onRenameSession={handleRenameSession}
        />
      </div>

      {/* MAIN CONTENT AREA: NO global margin, relative padding for desktop only */}
      <div 
        className={`flex-1 flex flex-col h-full relative min-w-0 w-full overflow-hidden bg-white dark:bg-[#111111] transition-all duration-300 
          ${isSidebarOpen ? 'md:pl-64' : 'md:pl-0'}`}
      >
        
        {/* HAMBURGER BUTTON (Mobile Only) */}
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="absolute top-4 left-4 z-40 p-2 md:hidden text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* SIDEBAR TOGGLE BUTTON (Desktop Only) */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="hidden md:flex absolute top-6 left-6 z-40 p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all shadow-sm bg-white/80 dark:bg-black/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 pointer-events-auto"
          >
            <PanelLeft size={18} />
          </button>
        )}

        {/* DRAG AND DROP OVERLAY */}
        {isDragging && (
          <div 
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="fixed inset-0 z-[700] flex items-center justify-center bg-zinc-900/60 backdrop-blur-md animate-in fade-in duration-300 pointer-events-auto"
          >
            <div className="flex flex-col items-center justify-center gap-6 p-12 rounded-[40px] border-4 border-dashed border-white/40 bg-black/40 shadow-2xl pointer-events-none transform scale-110 animate-in zoom-in-95 duration-500">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-black shadow-xl animate-bounce">
                <Upload size={32} />
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-black text-white tracking-tight mb-2">Drop to Visualize</h2>
                <p className="text-white/60 font-medium">Upload this photo to your design workspace</p>
              </div>
            </div>
          </div>
        )}

        {/* CHAT DISPLAY AREA */}
        <div 
          ref={scrollRef} 
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-hide pt-16 md:pt-8"
        >
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center w-full">
              <Greeting />
            </div>
          ) : (
            <div className="mx-auto w-full max-w-4xl p-4 md:p-8 md:py-12">
              {messages.map((msg, index) => (
                <ChatMessage 
                  key={msg.id} 
                  message={msg} 
                  onEditImage={handleOpenEditor}
                  onViewFullScreen={handleViewFullScreen}
                  onUpdateMessage={(newContent) => handleUpdateMessage(msg.id, newContent)}
                  isStreaming={index === messages.length - 1 && isGenerating && msg.role === 'assistant'}
                />
              ))}
              {isTyping && <TypingBubble />}
            </div>
          )}
        </div>

        {/* Floating Scroll Button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-zinc-800 text-zinc-500 shadow-xl border border-zinc-200 dark:border-zinc-700 hover:scale-110 active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-4"
          >
            <ArrowDown size={14} />
          </button>
        )}

        {/* INPUT AREA */}
        <div className="w-full bg-gradient-to-t from-white via-white/80 dark:from-[#111111] dark:via-[#111111]/80 to-transparent p-4 pb-6 pt-2 md:px-12 md:pb-10">
          <ChatInput 
            onSend={handleSendMessage} 
            isGenerating={isGenerating}
            onStop={handleStopGeneration}
            pendingEdit={pendingEdit}
            onClearPendingEdit={() => setPendingEdit(null)}
            externalImage={stagedImage}
            onClearExternalImage={() => setStagedImage(null)}
            onEditImage={handleOpenEditor}
          />
        </div>
      </div>

      {/* MODALS */}
      {isEditorOpen && editorImageSrc && (
        <ImageEditorModal 
          isOpen={isEditorOpen}
          imageSrc={editorImageSrc}
          onClose={() => setIsEditorOpen(false)}
          onSave={(mask) => { 
            setPendingEdit({ image: editorImageSrc, mask }); 
            setIsEditorOpen(false); 
          }}
        />
      )}
      
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} theme={theme} onSetTheme={setTheme} />}
      {isPricingOpen && <PricingModal onClose={() => setIsPricingOpen(false)} />}
      <FullScreenViewer 
        isOpen={!!viewingImageSrc} 
        imageSrc={viewingImageSrc} 
        onClose={handleCloseFullScreen} 
      />
    </div>
  );
};

const App: React.FC = () => (
  <ToastProvider>
    <AppContent />
  </ToastProvider>
);

export default App;

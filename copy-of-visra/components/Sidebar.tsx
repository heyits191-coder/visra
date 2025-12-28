
import React, { useState, useRef, useEffect } from 'react';
import { Plus, MessageSquare, MoreHorizontal, Settings, CreditCard, LogOut, PanelLeftClose, Pencil, Trash2 } from 'lucide-react';
import { ChatSession } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  onOpenPricing: () => void;
  onLogout: () => void;
  sessions: ChatSession[];
  selectedSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onToggle, 
  onNewChat, 
  onOpenSettings, 
  onOpenPricing, 
  onLogout,
  sessions,
  selectedSessionId,
  onSelectSession,
  onDeleteSession,
  onRenameSession
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const handleStartRename = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditValue(session.title);
  };

  const handleSaveRename = () => {
    if (!editingId) return;
    onRenameSession(editingId, editValue);
    setEditingId(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this design session?')) {
      onDeleteSession(id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveRename();
    if (e.key === 'Escape') setEditingId(null);
  };

  return (
    <aside
      className={`relative h-full flex flex-col bg-zinc-50 dark:bg-black transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden shrink-0 ${
        isOpen ? 'w-[260px]' : 'w-0'
      }`}
    >
      {/* Top Section */}
      <div className="p-4 flex flex-col gap-6 min-w-[260px]">
        <div className="flex items-center justify-between px-1">
          <span className="flex items-center gap-2 group cursor-default">
             <div className="h-6 w-6 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-black text-[10px] shadow-lg">V</div>
             <span className="text-[10px] font-black tracking-[0.3em] text-zinc-900 dark:text-white uppercase opacity-80">
                VISRA
             </span>
          </span>
          <button 
            onClick={onToggle} 
            className="text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors p-1"
            title="Close Sidebar"
          >
             <PanelLeftClose size={16} />
          </button>
        </div>
        
        <button 
          onClick={onNewChat}
          className="flex w-full items-center gap-3 rounded-xl bg-white dark:bg-zinc-900 p-3 text-sm font-semibold text-zinc-900 dark:text-white transition-all border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-sm"
        >
          <Plus size={16} />
          <span>New Chat</span>
        </button>
      </div>

      {/* History Section */}
      <div className="flex-1 overflow-y-auto px-3 scrollbar-hide pt-2 min-w-[260px]">
        <div className="space-y-0.5">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-all cursor-pointer ${
                selectedSessionId === session.id 
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800' 
                  : 'text-zinc-500 dark:text-zinc-500 hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare size={14} className={`shrink-0 ${selectedSessionId === session.id ? 'opacity-100 text-[#10a37f]' : 'opacity-30 group-hover:opacity-100'}`} />
              
              {editingId === session.id ? (
                <input
                  ref={editInputRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleSaveRename}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-sm outline-none"
                  autoFocus
                />
              ) : (
                <span className="truncate flex-1 pr-12">{session.title}</span>
              )}

              {/* Action Buttons - Visible on hover, but not when editing */}
              {editingId !== session.id && (
                <div className="absolute right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => handleStartRename(e, session)}
                    className="p-1 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  >
                    <Pencil size={12} />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(e, session.id)}
                    className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/20 text-zinc-400 hover:text-red-500"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* User Menu */}
      <div className="p-4 relative mt-auto min-w-[260px]">
        {showUserMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-1 animate-in slide-in-from-bottom-2 duration-200 z-50 overflow-hidden">
            <button 
              onClick={() => { onOpenSettings(); setShowUserMenu(false); }} 
              className="w-full flex items-center gap-3 p-3 text-xs font-bold rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              <Settings size={14} /> Settings
            </button>
            <button 
              onClick={() => { onOpenPricing(); setShowUserMenu(false); }} 
              className="w-full flex items-center gap-3 p-3 text-xs font-bold rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              <CreditCard size={14} /> My Plan
            </button>
            <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800 my-1 mx-2" />
            <button 
              onClick={() => { onLogout(); setShowUserMenu(false); }}
              className="w-full flex items-center gap-3 p-3 text-xs font-bold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-500 uppercase tracking-widest"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        )}
        
        <button 
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={`group flex w-full items-center gap-3 rounded-xl p-2 text-sm font-semibold text-zinc-900 dark:text-white transition-all ${showUserMenu ? 'bg-zinc-200/50 dark:bg-zinc-900/50' : 'hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50'}`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800 text-[10px] font-black text-zinc-500 group-hover:bg-zinc-900 group-hover:text-white transition-all uppercase">
            DP
          </div>
          <div className="flex-1 overflow-hidden text-left">
            <div className="truncate text-xs font-bold tracking-tight">Designer Pro</div>
          </div>
          <MoreHorizontal size={14} className={`transition-colors ${showUserMenu ? 'text-zinc-900 dark:text-white' : 'text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white'}`} />
        </button>
      </div>
    </aside>
  );
};

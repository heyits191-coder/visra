
import React, { useState } from 'react';
import { X, Settings, Database, Globe, Bell } from 'lucide-react';
import { Theme } from '../types';

interface SettingsModalProps {
  onClose: () => void;
  theme: Theme;
  onSetTheme: (theme: Theme) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, theme, onSetTheme }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'data'>('general');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-3xl h-[500px] flex overflow-hidden rounded-[24px] bg-white dark:bg-[#1a1a1a] shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300">
        
        {/* Sidebar */}
        <div className="w-56 bg-zinc-50 dark:bg-black/40 border-r border-zinc-100 dark:border-zinc-800/50 p-4 flex flex-col gap-1">
          <button 
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'general' ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-lg shadow-zinc-200 dark:shadow-none' : 'text-zinc-500 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'}`}
          >
            <Settings size={16} /> General
          </button>
          <button 
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'data' ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-lg shadow-zinc-200 dark:shadow-none' : 'text-zinc-500 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'}`}
          >
            <Database size={16} /> Data Controls
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-6 flex items-center justify-between border-bottom border-zinc-100 dark:border-zinc-800">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Settings</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 pt-2">
            {activeTab === 'general' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between group">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Theme</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Customize the appearance of Visra</p>
                  </div>
                  <select 
                    value={theme} 
                    onChange={(e) => onSetTheme(e.target.value as Theme)}
                    className="bg-zinc-100 dark:bg-zinc-800 text-sm font-bold rounded-xl px-4 py-2 border-none focus:ring-2 focus:ring-zinc-500 transition-all cursor-pointer"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Clear all chats</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Delete all your workspace history permanently</p>
                  </div>
                  <button className="px-5 py-2.5 text-xs font-bold bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors">
                    Delete All
                  </button>
                </div>

                <div className="flex items-center justify-between opacity-50">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">Language <Globe size={14} /></h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">English (US)</p>
                  </div>
                  <button className="px-4 py-2 text-xs font-bold border border-zinc-200 dark:border-zinc-700 rounded-xl cursor-not-allowed">
                    Change
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-8">
                 <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Chat History & Training</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed max-w-xs">Save new chats in this browser to your history and allow them to be used to improve Visra models.</p>
                  </div>
                  <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-zinc-900 dark:bg-white transition-colors duration-200">
                    <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-zinc-900 shadow ring-0 transition duration-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400 dark:text-zinc-500 font-medium tracking-wide flex justify-between">
            <span>VISRA STUDIO v2.5.0</span>
            <span>BUILD 2024.12.01</span>
          </div>
        </div>
      </div>
    </div>
  );
};

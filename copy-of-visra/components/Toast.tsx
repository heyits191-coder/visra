
import React from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, visible }) => {
  return (
    <div className={`fixed bottom-28 left-1/2 -translate-x-1/2 z-[400] transition-all duration-300 pointer-events-none ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
      <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-2.5 rounded-full text-xs font-bold tracking-wide shadow-2xl border border-white/10 dark:border-zinc-200">
        {message}
      </div>
    </div>
  );
};


import React from 'react';

const VisraLogo = () => (
  <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-md bg-black dark:bg-white text-white dark:text-black font-bold text-sm select-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
    V
  </div>
);

export const TypingBubble: React.FC = () => {
  return (
    <div className="group w-full py-6 flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex w-full max-w-5xl gap-3 md:gap-4 flex-row items-center">
        {/* Pulsing Logo */}
        <div className="shrink-0 animate-pulse transition-all">
          <VisraLogo />
        </div>
        
        {/* Shimmering Designing Text */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 animate-pulse">
            Visra is designing...
          </span>
        </div>
      </div>
    </div>
  );
};

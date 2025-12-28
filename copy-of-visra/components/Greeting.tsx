
import React from 'react';

export const Greeting: React.FC = () => {
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 md:px-8 max-w-2xl mx-auto w-full">
      <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-1000 ease-out">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight md:tracking-tighter leading-[1.1] mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-400 dark:from-white dark:via-white dark:to-zinc-600">
            {getGreeting()}, Designer.<br className="hidden md:block"/>Ready to create?
          </span>
        </h1>
        <p className="text-sm md:text-base text-zinc-400 dark:text-zinc-600 max-w-xs leading-relaxed font-medium opacity-60">
          Your focused workspace for interior visualization.
        </p>
      </div>
    </div>
  );
};

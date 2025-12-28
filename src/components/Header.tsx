import React from 'react';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header className={`sticky top-0 z-50 flex items-center justify-between border-b border-solid border-slate-200 dark:border-[#283039] bg-surface-light dark:bg-background-dark px-6 py-3 ${className}`}>
      <div className="flex items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3 text-slate-900 dark:text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
            <span className="material-symbols-outlined text-xl">currency_bitcoin</span>
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-tight">BitDash</h2>
        </div>
        
        {/* Search */}
        <div className="hidden md:flex flex-col min-w-[240px] lg:min-w-[320px]">
          <div className="flex w-full items-center rounded-lg bg-slate-100 dark:bg-surface-dark h-10 px-3 gap-2">
            <span className="material-symbols-outlined text-text-secondary">search</span>
            <input 
              className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none p-0 text-sm text-slate-900 dark:text-white placeholder:text-text-secondary"
              placeholder="Search metrics, tickers..."
            />
            <div className="flex items-center justify-center rounded bg-slate-200 dark:bg-[#3b4754] px-1.5 py-0.5 text-xs font-medium text-text-secondary">
              ⌘K
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 lg:gap-8">
        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <a className="text-sm font-bold text-slate-900 dark:text-white" href="#">Dashboard</a>
          <a className="text-sm font-medium text-text-secondary hover:text-primary transition-colors" href="#">Markets</a>
          <a className="text-sm font-medium text-text-secondary hover:text-primary transition-colors" href="#">On-Chain</a>
          <a className="text-sm font-medium text-text-secondary hover:text-primary transition-colors" href="#">Derivatives</a>
        </nav>
        
        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-surface-dark hover:bg-slate-200 dark:hover:bg-[#3b4754] transition-colors relative group">
            <span className="material-symbols-outlined text-text-secondary group-hover:text-white">notifications</span>
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-danger border-2 border-surface-light dark:border-surface-dark"></span>
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-surface-dark hover:bg-slate-200 dark:hover:bg-[#3b4754] transition-colors group">
            <span className="material-symbols-outlined text-text-secondary group-hover:text-white">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
};

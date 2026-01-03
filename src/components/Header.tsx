import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChart } from '../contexts/ChartContext';
import { LoginModal } from './LoginModal';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { activeTimeframe, setActiveTimeframe } = useChart();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleAccountClick = () => {
    if (isAuthenticated) {
      setIsUserMenuOpen(!isUserMenuOpen);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  return (
    <>
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

        {/* Quick-Access Timeframe Buttons */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-surface-dark rounded-lg">
          <span className="text-xs font-medium text-text-secondary mr-1">Chart:</span>
          {['1M', '1Y', 'MAX'].map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setActiveTimeframe(timeframe)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                activeTimeframe === timeframe
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#3b4754]'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-surface-dark hover:bg-slate-200 dark:hover:bg-[#3b4754] transition-colors relative group">
            <span className="material-symbols-outlined text-text-secondary group-hover:text-white">notifications</span>
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-danger border-2 border-surface-light dark:border-surface-dark"></span>
          </button>
          
          {/* Account Button with User Menu */}
          <div className="relative">
            <button 
              onClick={handleAccountClick}
              className={`flex h-10 items-center justify-center rounded-lg transition-colors group ${
                isAuthenticated 
                  ? 'bg-primary/10 hover:bg-primary/20 px-3 gap-2' 
                  : 'bg-slate-100 dark:bg-surface-dark hover:bg-slate-200 dark:hover:bg-[#3b4754] w-10'
              }`}
            >
              {isLoading ? (
                <span className="material-symbols-outlined text-text-secondary animate-spin">progress_activity</span>
              ) : isAuthenticated ? (
                <>
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white hidden sm:block max-w-[100px] truncate">
                    {user?.name}
                  </span>
                  <span className="material-symbols-outlined text-text-secondary text-sm">expand_more</span>
                </>
              ) : (
                <span className="material-symbols-outlined text-text-secondary group-hover:text-white">account_circle</span>
              )}
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && isAuthenticated && (
              <div className="absolute right-0 top-12 w-56 bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-slate-200 dark:border-[#3b4754] overflow-hidden z-50">
                <div className="p-3 border-b border-slate-200 dark:border-[#3b4754]">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                </div>
                <div className="p-1">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-slate-100 dark:hover:bg-[#3b4754] rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-lg">settings</span>
                    Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>

    {/* Click outside to close user menu */}
    {isUserMenuOpen && (
      <div 
        className="fixed inset-0 z-40" 
        onClick={() => setIsUserMenuOpen(false)}
      />
    )}

    {/* Login Modal */}
    <LoginModal 
      isOpen={isLoginModalOpen} 
      onClose={() => setIsLoginModalOpen(false)} 
    />
  </>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register';

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'register' && !email.includes('@')) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      // Success - close modal
      onClose();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError(null);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl border border-slate-200 dark:border-[#3b4754] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-[#3b4754]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined">account_circle</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-sm text-text-secondary">
                {mode === 'login' ? 'Sign in to your account' : 'Join BitDash today'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-[#3b4754] transition-colors"
          >
            <span className="material-symbols-outlined text-text-secondary">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-900 dark:text-white">
                Name
              </label>
              <div className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-[#202933] border border-slate-200 dark:border-[#3b4754] px-3 h-11 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all">
                <span className="material-symbols-outlined text-text-secondary">person</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm text-slate-900 dark:text-white placeholder:text-text-secondary"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-900 dark:text-white">
              Email or Developer ID
            </label>
            <div className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-[#202933] border border-slate-200 dark:border-[#3b4754] px-3 h-11 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all">
              <span className="material-symbols-outlined text-text-secondary">mail</span>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com or 1111 (dev)"
                required
                className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm text-slate-900 dark:text-white placeholder:text-text-secondary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-900 dark:text-white">
              Password
            </label>
            <div className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-[#202933] border border-slate-200 dark:border-[#3b4754] px-3 h-11 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all">
              <span className="material-symbols-outlined text-text-secondary">lock</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'}
                required
                minLength={mode === 'register' ? 6 : undefined}
                className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm text-slate-900 dark:text-white placeholder:text-text-secondary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 h-11 flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">
                  {mode === 'login' ? 'login' : 'person_add'}
                </span>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-sm text-text-secondary">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button
              type="button"
              onClick={toggleMode}
              className="ml-1 text-primary hover:underline font-medium"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

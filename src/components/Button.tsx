import React from 'react';

interface TimeButtonProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const TimeButton: React.FC<TimeButtonProps> = ({ label, isActive = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`h-8 px-4 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-primary text-white shadow-sm'
          : 'bg-transparent hover:bg-slate-200 dark:hover:bg-[#3b4754] text-text-secondary hover:text-slate-900 dark:hover:text-white'
      }`}
    >
      {label}
    </button>
  );
};

interface IconButtonProps {
  icon: string;
  onClick?: () => void;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`text-text-secondary hover:text-white transition-colors ${className}`}
    >
      <span className="material-symbols-outlined">{icon}</span>
    </button>
  );
};

interface PrimaryButtonProps {
  icon?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ icon, children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary hover:bg-blue-600 text-white gap-2 text-sm font-bold transition-colors shadow-lg shadow-blue-500/20"
    >
      {icon && <span className="material-symbols-outlined text-[20px]">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

interface TextButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const TextButton: React.FC<TextButtonProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-sm text-primary font-bold hover:underline"
    >
      {children}
    </button>
  );
};

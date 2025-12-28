import React from 'react';

interface BadgeProps {
  variant: 'success' | 'danger';
  children: React.ReactNode;
  icon?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, children, icon }) => {
  const variantClasses = {
    success: 'text-success bg-success/10',
    danger: 'text-danger bg-danger/10'
  };

  return (
    <div className={`flex items-center gap-1 text-sm font-bold w-fit px-2 py-0.5 rounded-full mt-1 ${variantClasses[variant]}`}>
      {icon && <span className="material-symbols-outlined text-sm">{icon}</span>}
      <span>{children}</span>
    </div>
  );
};

interface PillProps {
  variant: 'neutral' | 'success' | 'danger';
  children: React.ReactNode;
}

export const Pill: React.FC<PillProps> = ({ variant, children }) => {
  const variantClasses = {
    neutral: 'bg-orange-500/10 text-orange-400',
    success: 'text-success',
    danger: 'text-danger'
  };

  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded mb-1 ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

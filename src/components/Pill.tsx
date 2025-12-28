import React from 'react';

interface PillProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Pill: React.FC<PillProps> = ({ children, icon, className = '' }) => {
  return (
    <div className={`pill bg-surface-2 border border-border text-text ${className}`}>
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </div>
  );
};

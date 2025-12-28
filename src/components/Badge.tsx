import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default',
  className = '' 
}) => {
  const variantStyles = {
    default: 'bg-surface-2 text-muted border border-border',
    success: 'bg-positive-light text-positive border border-positive/20',
    warning: 'bg-orange-light text-orange border border-orange/20',
    danger: 'bg-negative-light text-negative border border-negative/20',
    info: 'bg-accent-light text-accent border border-accent/20',
  };

  return (
    <span className={`badge ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`card p-6 ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, action, className = '' }) => {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <h3 className="text-lg font-semibold text-text">{title}</h3>
      {action && <div className="text-sm">{action}</div>}
    </div>
  );
};

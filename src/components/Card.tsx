import React, { useState } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-col rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm border border-slate-200 dark:border-transparent overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-[#3b4754] p-4 lg:px-6">
      <div className="flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        {subtitle && <p className="text-xs text-text-secondary">{subtitle}</p>}
      </div>
      {action && <div className="flex gap-2">{action}</div>}
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: string;
  iconBgColor: string;
  iconColor: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  iconBgColor,
  iconColor
}) => {
  return (
    <div className="h-full flex flex-col gap-1 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-[#2e3742] dark:to-[#222931] p-5 shadow-[0_4px_0_0_rgba(203,213,225,1)] dark:shadow-[0_4px_0_0_rgba(17,20,24,0.5)] border-t border-l border-white/60 dark:border-white/10 active:translate-y-1 active:shadow-none transition-all duration-150 ease-out hover:brightness-105">
      <div className="flex justify-between items-start">
        <p className="text-text-secondary text-sm font-bold uppercase tracking-wider">{title}</p>
        <div className={`h-8 w-8 rounded-full ${iconBgColor} flex items-center justify-center ${iconColor} shadow-inner`}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
      </div>
      <p className="text-slate-900 dark:text-white text-2xl font-black tracking-tight mt-2">{value}</p>
      <div className={`flex items-center gap-1 text-sm font-bold w-fit px-2 py-0.5 rounded-full mt-1 ${
        changeType === 'positive' 
          ? 'text-success bg-success/10' 
          : 'text-danger bg-danger/10'
      }`}>
        <span className="material-symbols-outlined text-sm">
          {changeType === 'positive' ? 'trending_up' : 'trending_down'}
        </span>
        <span>{change}</span>
      </div>
    </div>
  );
};

interface SmallMetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'neutral';
  barData: number[];
  barColor: string;
  infoText?: string;
}

export const SmallMetricCard: React.FC<SmallMetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  barData,
  barColor,
  infoText
}) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="relative h-full flex flex-col gap-3 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-[#2e3742] dark:to-[#222931] p-5 shadow-[0_4px_0_0_rgba(203,213,225,1)] dark:shadow-[0_4px_0_0_rgba(17,20,24,0.5)] border-t border-l border-white/60 dark:border-white/10 active:translate-y-1 active:shadow-none transition-all duration-150 ease-out hover:brightness-105">
      <div className="flex justify-between items-center">
        <p className="text-text-secondary text-sm font-bold uppercase tracking-wider">{title}</p>
        {infoText ? (
          <button
            type="button"
            aria-label={`About ${title}`}
            className="h-8 w-8 flex items-center justify-center rounded-full text-text-secondary hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            onClick={(e) => {
              e.stopPropagation();
              setShowInfo((prev) => !prev);
            }}
          >
            <span className="material-symbols-outlined text-lg">help</span>
          </button>
        ) : (
          <span className="material-symbols-outlined text-text-secondary text-lg">info</span>
        )}
      </div>
      <div className="flex items-end gap-2">
        <p className="text-slate-900 dark:text-white text-2xl font-black">{value}</p>
        {change && (
          <span className={`text-xs font-bold mb-1 ${
            changeType === 'neutral' 
              ? 'bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded' 
              : 'text-success'
          }`}>
            {change}
          </span>
        )}
      </div>
      <div className="h-8 w-full flex items-end gap-0.5 mt-auto">
        {barData.map((height, index) => (
          <div 
            key={index}
            className={`${barColor} w-full rounded-sm`}
            style={{ height: `${height}%`, opacity: 0.4 + (index * 0.15) }}
          />
        ))}
      </div>

      {infoText && showInfo && (
        <div className="absolute top-3 right-3 z-10 max-w-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg p-3 text-sm text-slate-700 dark:text-slate-200">
          <div className="flex justify-between items-start gap-2">
            <p>{infoText}</p>
            <button
              type="button"
              aria-label="Close info"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-100"
              onClick={(e) => {
                e.stopPropagation();
                setShowInfo(false);
              }}
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

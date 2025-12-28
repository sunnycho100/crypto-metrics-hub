import React from 'react';

export const CompositeHealthCard: React.FC = () => {
  const healthScore = 78;

  return (
    <div className="flex flex-col rounded-xl bg-surface-light dark:bg-surface-dark p-6 shadow-sm border border-slate-200 dark:border-transparent relative overflow-hidden group z-0">
      {/* Gradient bar at top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-danger via-yellow-400 to-success"></div>
      
      <div className="flex justify-between items-end mb-4 relative z-10">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Composite Health</h3>
          <p className="text-sm text-text-secondary">Aggregated market sentiment</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-success">{healthScore}</span>
          <span className="text-sm text-text-secondary font-medium">/100</span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="relative h-4 w-full rounded-full bg-slate-200 dark:bg-[#3b4754] mb-2">
        <div 
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-success/80 to-success"
          style={{ width: `${healthScore}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success"></span>
          Bullish
        </span>
        <span className="text-xs text-text-secondary">Updated 2m ago</span>
      </div>
      
      {/* Background glow effect */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-success/10 rounded-full blur-3xl pointer-events-none group-hover:bg-success/20 transition-all duration-500"></div>
    </div>
  );
};

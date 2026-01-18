import React, { useState } from 'react';
import { FearGreedGauge } from './FearGreedGauge';
import { FearGreedHistoryModal } from './FearGreedHistoryModal';
import { useMetrics } from '../contexts/MetricsContext';

export const FearGreedCard: React.FC = () => {
  const { metrics, isLoading, error } = useMetrics();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const value = metrics?.fearGreedIndex ?? 0;
  const valueClassification = metrics?.fearGreedValue ?? '';
  const loading = isLoading;
  const hasError = error !== null;
  
  // Format update time - shows "Live" since data refreshes every 60s
  const getFormattedTime = () => {
    return 'Live';
  };

  // Get trading suggestion based on value
  const getTradingSuggestion = (val: number): { text: string; icon: string } => {
    if (val <= 24) return { 
      text: 'Strong buy opportunity - Market in extreme fear', 
      icon: 'trending_up' 
    };
    if (val <= 39) return { 
      text: 'Consider buying - Market fearful', 
      icon: 'add_circle' 
    };
    if (val <= 60) return { 
      text: 'Neutral zone - Monitor closely', 
      icon: 'remove_circle' 
    };
    if (val <= 74) return { 
      text: 'Consider taking profits - Market greedy', 
      icon: 'warning' 
    };
    return { 
      text: 'High risk - Extreme greed, potential correction', 
      icon: 'trending_down' 
    };
  };

  const suggestion = getTradingSuggestion(value);

  return (
    <>
      <div 
        className="flex flex-col rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm border border-slate-200 dark:border-transparent overflow-hidden relative group cursor-pointer hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300"
        onClick={() => !loading && !hasError && setIsModalOpen(true)}
      >
        {/* Gradient accent bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-danger via-yellow-400 to-success"></div>
        
        <div className="p-6 flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Fear & Greed Index
                <span className="material-symbols-outlined text-lg text-primary">psychology</span>
              </h3>
              <p className="text-sm text-text-secondary mt-1">Market sentiment indicator</p>
            </div>
            {!loading && !hasError && (
              <span className="text-xs text-text-secondary bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                {getFormattedTime()}
              </span>
            )}
          </div>

          {/* Gauge */}
          <div className="flex justify-center py-4">
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-40 h-40 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                <div className="w-24 h-6 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
              </div>
            ) : hasError ? (
              <div className="flex flex-col items-center gap-3 text-text-secondary">
                <span className="material-symbols-outlined text-4xl">error</span>
                <p className="text-sm">Failed to load data</p>
              </div>
            ) : (
              <FearGreedGauge value={value} size="medium" />
            )}
          </div>

          {/* Trading Suggestion */}
          {!loading && !hasError && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="material-symbols-outlined text-primary flex-shrink-0 mt-0.5">
                {suggestion.icon}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {suggestion.text}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  Extreme fear can signal buying opportunities, while extreme greed suggests caution.
                </p>
              </div>
            </div>
          )}

          {/* Info Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <span className="material-symbols-outlined text-sm">info</span>
                <span>Data aggregated from volatility, momentum, social media, and trends</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                <span>View History</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          </div>
        </div>

        {/* Background glow effect */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-all duration-500"></div>
      </div>

      {/* History Modal */}
      <FearGreedHistoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentValue={value}
        currentClassification={valueClassification}
      />
    </>
  );
};

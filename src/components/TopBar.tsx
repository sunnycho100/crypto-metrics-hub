import React from 'react';
import { Pill } from './Pill';

export const TopBar: React.FC = () => {
  return (
    <header className="h-20 bg-surface border-b border-border flex items-center px-8 gap-8 shadow-sm">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-text">Overview</h1>
        <div className="text-xs text-muted mt-0.5">Real-time performance monitoring</div>
      </div>

      {/* Center search bar */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search metrics, alerts, or notes..."
            className="input-field w-full pl-12"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Market pair pill */}
        <Pill
          icon={
            <span className="w-2 h-2 rounded-full bg-positive animate-pulse" />
          }
        >
          <span className="font-semibold">BTC-USD</span>
          <span className="text-positive font-bold">$54,820</span>
        </Pill>

        {/* Notifications */}
        <button className="relative p-2.5 hover:bg-surface-2 rounded-xl transition-colors">
          <span className="text-xl">🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-negative rounded-full" />
        </button>

        {/* Create Alert button */}
        <button className="px-5 py-2.5 bg-gradient-to-r from-accent to-purple text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2">
          <span className="text-lg">+</span>
          <span>Create Alert</span>
        </button>
      </div>
    </header>
  );
};

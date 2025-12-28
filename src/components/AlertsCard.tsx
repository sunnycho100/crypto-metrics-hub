import React from 'react';
import { Card, CardHeader } from './Card';

interface AlertItem {
  type: 'trigger' | 'alert';
  label: string;
  timestamp: string;
  icon: string;
  color: string;
}

const recentTriggers: AlertItem[] = [
  { type: 'trigger', label: 'RSI crossed above 70', timestamp: '2h ago', icon: '📈', color: '#f59e0b' },
  { type: 'trigger', label: 'Volume spike detected', timestamp: '5h ago', icon: '📊', color: '#5b8ff9' },
  { type: 'trigger', label: 'Price crossed MA200', timestamp: '1d ago', icon: '💹', color: '#10b981' },
];

const activeAlerts: AlertItem[] = [
  { type: 'alert', label: 'BTC < $95,000', timestamp: 'Active', icon: '💰', color: '#ef4444' },
  { type: 'alert', label: 'Funding > 0.1%', timestamp: 'Active', icon: '⚡', color: '#f59e0b' },
  { type: 'alert', label: 'Fear & Greed < 25', timestamp: 'Active', icon: '😰', color: '#8b5cf6' },
];

export const AlertsCard: React.FC = () => {
  return (
    <Card>
      <CardHeader
        title="Alerts & Triggers"
        action={
          <a href="#" className="text-accent hover:text-accent/80 transition-colors text-sm font-medium">
            Manage →
          </a>
        }
      />

      {/* Recent Triggers */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-text">Recent Triggers</h4>
          <span className="text-xs text-muted bg-surface-2 px-2.5 py-1 rounded-lg font-medium">
            {recentTriggers.length} new
          </span>
        </div>
        <div className="space-y-2.5">
          {recentTriggers.map((item, index) => (
            <div
              key={index}
              className="group flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-2 transition-all duration-300 border border-transparent hover:border-border cursor-pointer"
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ backgroundColor: item.color + '20' }}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-text truncate">{item.label}</div>
                <div className="text-xs text-muted">{item.timestamp}</div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-surface rounded-lg">
                <span className="text-muted">×</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Alerts */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-text">Active Alerts</h4>
          <span className="text-xs text-positive bg-positive-light px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
            Monitoring
          </span>
        </div>
        <div className="space-y-2.5">
          {activeAlerts.map((item, index) => (
            <div
              key={index}
              className="group flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-surface to-surface-2 border border-border hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ backgroundColor: item.color + '20' }}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-text truncate">{item.label}</div>
                <div className="text-xs text-muted flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-positive" />
                  {item.timestamp}
                </div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-surface rounded-lg">
                <span className="text-muted text-xs">⋮</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer action */}
      <button className="w-full mt-6 py-3 bg-gradient-to-r from-accent to-purple text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
        <span className="text-lg">+</span>
        <span>Create New Alert</span>
      </button>
    </Card>
  );
};

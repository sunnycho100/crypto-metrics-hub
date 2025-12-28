import React from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
}

interface SavedView {
  id: string;
  name: string;
  color: string;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: '📊', active: true },
  { id: 'price', label: 'Price & Trend', icon: '📈' },
  { id: 'onchain', label: 'On-chain', icon: '⛓️' },
  { id: 'derivatives', label: 'Derivatives', icon: '💹' },
  { id: 'macro', label: 'Macro', icon: '🌐' },
  { id: 'alerts', label: 'Alerts', icon: '🔔' },
  { id: 'watchlist', label: 'Watchlist', icon: '⭐' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

const savedViews: SavedView[] = [
  { id: 'risk', name: 'Risk Dashboard', color: '#ef4444' },
  { id: 'valuation', name: 'Valuation Check', color: '#5b8ff9' },
  { id: 'leverage', name: 'Leverage Monitor', color: '#f59e0b' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-[280px] h-screen bg-surface border-r border-border flex flex-col fixed left-0 top-0 shadow-sm">
      {/* Top section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent to-purple flex items-center justify-center text-white font-bold text-lg shadow-lg">
            ₿
          </div>
          <div>
            <div className="text-text font-bold text-lg">BTC Indicator</div>
            <div className="text-xs text-muted">Performance Monitor</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pt-5 pb-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">🔍</span>
          <input
            type="text"
            placeholder="Search indicators..."
            className="input-field w-full pl-10"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-2">
        <div className="space-y-1.5">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${item.active ? 'active' : ''}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-border" />

        {/* Saved Views */}
        <div>
          <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-3 px-3">
            Saved Views
          </h4>
          <div className="space-y-1.5">
            {savedViews.map((view) => (
              <div
                key={view.id}
                className="nav-item text-sm group"
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: view.color }}
                />
                <span>{view.name}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 px-3 py-2 text-sm text-accent font-medium hover:bg-accent-light rounded-xl transition-colors flex items-center gap-2">
            <span className="text-lg">+</span>
            <span>New View</span>
          </button>
        </div>
      </nav>

      {/* Bottom utility links */}
      <div className="p-4 border-t border-border bg-surface-2">
        <div className="space-y-2">
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-muted hover:text-text hover:bg-surface rounded-xl transition-all">
            <span className="text-base">📚</span>
            <span>Documentation</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-muted hover:text-text hover:bg-surface rounded-xl transition-all">
            <span className="text-base">💬</span>
            <span>Support</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-positive font-medium hover:bg-positive-light rounded-xl transition-all">
            <span className="text-base">✨</span>
            <span>Upgrade to Pro</span>
          </a>
        </div>
      </div>
    </aside>
  );
};

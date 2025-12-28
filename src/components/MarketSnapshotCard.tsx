import React from 'react';
import { Card, CardHeader } from './Card';
import { Badge } from './Badge';
import { LineChart } from './Charts';

interface KPITile {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

const kpiData: KPITile[] = [
  { label: 'Price', value: '$54,820', change: '+2.29%', positive: true },
  { label: '24h Volume', value: '$28.4B', change: '+12.5%', positive: true },
  { label: 'Market Cap', value: '$1.08T', change: '+1.8%', positive: true },
  { label: 'Dominance', value: '52.4%', change: '-0.3%', positive: false },
];

export const MarketSnapshotCard: React.FC = () => {
  return (
    <Card>
      <CardHeader
        title="Market Snapshot"
        action={
          <Badge variant="success">
            <span className="inline-block w-2 h-2 rounded-full bg-positive mr-1.5 animate-pulse" />
            Live
          </Badge>
        }
      />
      
      {/* KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {kpiData.map((kpi, index) => (
          <div key={index} className="stat-card">
            <div className="text-xs text-muted mb-1.5 font-medium">{kpi.label}</div>
            <div className="text-xl font-bold text-text mb-1">{kpi.value}</div>
            <div className={`text-xs font-semibold flex items-center gap-1 ${
              kpi.positive ? 'text-positive' : 'text-negative'
            }`}>
              <span>{kpi.positive ? '↑' : '↓'}</span>
              <span>{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64 bg-gradient-to-br from-surface to-surface-2 rounded-2xl p-4 border border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold text-text">7-Day Trend</div>
            <div className="text-xs text-muted">Bitcoin Price Movement</div>
          </div>
          <div className="flex gap-2">
            {['1D', '7D', '1M', '3M', '1Y', 'ALL'].map((period) => (
              <button
                key={period}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  period === '7D'
                    ? 'bg-accent text-white'
                    : 'text-muted hover:bg-surface-2'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="h-48">
          <LineChart type="gradient" />
        </div>
      </div>
    </Card>
  );
};

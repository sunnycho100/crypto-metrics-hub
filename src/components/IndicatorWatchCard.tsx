import React from 'react';
import { Card, CardHeader } from './Card';
import { Badge } from './Badge';
import { MiniSparkline } from './Charts';

interface Indicator {
  name: string;
  status: 'Normal' | 'Elevated' | 'Extreme';
  value: string;
  sparklineData: number[];
  trend: 'up' | 'down';
}

const indicators: Indicator[] = [
  { 
    name: 'MVRV Z-Score', 
    status: 'Normal', 
    value: '1.84',
    sparklineData: [1.2, 1.5, 1.3, 1.8, 2.1, 1.9, 1.84],
    trend: 'down'
  },
  { 
    name: 'Funding Rate', 
    status: 'Normal', 
    value: '0.015%',
    sparklineData: [0.01, 0.012, 0.011, 0.013, 0.014, 0.016, 0.015],
    trend: 'down'
  },
  { 
    name: 'Realized Vol', 
    status: 'Elevated', 
    value: '68.2%',
    sparklineData: [45, 52, 58, 62, 65, 70, 68],
    trend: 'down'
  },
  { 
    name: 'NVT Ratio', 
    status: 'Normal', 
    value: '42.1',
    sparklineData: [38, 40, 39, 41, 43, 42, 42.1],
    trend: 'up'
  },
  { 
    name: 'OI Change 24h', 
    status: 'Extreme', 
    value: '+18.5%',
    sparklineData: [5, 8, 12, 10, 15, 16, 18.5],
    trend: 'up'
  },
];

const getStatusVariant = (status: Indicator['status']): 'default' | 'warning' | 'danger' => {
  switch (status) {
    case 'Normal':
      return 'default';
    case 'Elevated':
      return 'warning';
    case 'Extreme':
      return 'danger';
  }
};

const getSparklineColor = (status: Indicator['status']): string => {
  switch (status) {
    case 'Normal':
      return '#10b981';
    case 'Elevated':
      return '#f59e0b';
    case 'Extreme':
      return '#ef4444';
  }
};

export const IndicatorWatchCard: React.FC = () => {
  return (
    <Card>
      <CardHeader
        title="Indicator Watch"
        action={
          <a href="#" className="text-accent hover:text-accent/80 transition-colors text-sm font-medium">
            View all →
          </a>
        }
      />

      {/* Indicator list */}
      <div className="space-y-3">
        {indicators.map((indicator, index) => (
          <div
            key={index}
            className="group flex items-center justify-between p-4 bg-gradient-to-r from-surface to-surface-2 rounded-2xl border border-border hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-text">{indicator.name}</span>
                  <Badge variant={getStatusVariant(indicator.status)}>
                    {indicator.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted">On-chain metric</div>
              </div>
              
              {/* Mini sparkline */}
              <div className="w-24 h-12">
                <MiniSparkline 
                  data={indicator.sparklineData} 
                  color={getSparklineColor(indicator.status)}
                />
              </div>
            </div>
            
            <div className="text-right ml-4">
              <div className="text-lg font-bold text-text">{indicator.value}</div>
              <div className={`text-xs font-semibold flex items-center justify-end gap-1 ${
                indicator.trend === 'up' ? 'text-positive' : 'text-negative'
              }`}>
                <span>{indicator.trend === 'up' ? '↑' : '↓'}</span>
                <span>24h</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

import React from 'react';
import { Card, CardHeader } from './Card';
import { DoughnutChart } from './Charts';

interface ScoreComponent {
  name: string;
  value: number;
  color: string;
}

const scoreComponents: ScoreComponent[] = [
  { name: 'Valuation', value: 72, color: '#5b8ff9' },
  { name: 'Momentum', value: 85, color: '#10b981' },
  { name: 'Leverage Risk', value: 45, color: '#f59e0b' },
];

export const CompositeRatingCard: React.FC = () => {
  const overallScore = Math.round(
    scoreComponents.reduce((sum, item) => sum + item.value, 0) / scoreComponents.length
  );

  return (
    <Card>
      <CardHeader
        title="Composite Rating"
        action={
          <a href="#" className="text-accent hover:text-accent/80 transition-colors text-sm font-medium">
            Methodology →
          </a>
        }
      />

      <div className="grid grid-cols-2 gap-6 items-center mb-6">
        {/* Big rating display with doughnut */}
        <div className="relative flex items-center justify-center">
          <div className="w-40 h-40">
            <DoughnutChart />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-text">{overallScore}</div>
            <div className="text-xs text-muted mt-1">/ 100</div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {scoreComponents.map((component, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: component.color }}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-text">{component.name}</div>
                <div className="text-xs text-muted">{component.value}/100</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Component scores with progress bars */}
      <div className="space-y-4 pt-4 border-t border-border">
        {scoreComponents.map((component, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text font-medium">{component.name}</span>
              <span className="text-muted font-semibold">{component.value}/100</span>
            </div>
            <div className="h-2.5 bg-surface-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${component.value}%`,
                  backgroundColor: component.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Last updated */}
      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
        <div className="text-xs text-muted">Last updated: 2 minutes ago</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-positive animate-pulse" />
          <span className="text-xs text-positive font-medium">Live</span>
        </div>
      </div>
    </Card>
  );
};

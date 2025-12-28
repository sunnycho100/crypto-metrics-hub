import React from 'react';
import { MarketSnapshotCard } from './MarketSnapshotCard';
import { CompositeRatingCard } from './CompositeRatingCard';
import { IndicatorWatchCard } from './IndicatorWatchCard';
import { AlertsCard } from './AlertsCard';

export const DashboardGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Top row */}
      <div className="lg:col-span-1">
        <MarketSnapshotCard />
      </div>
      <div className="lg:col-span-1">
        <CompositeRatingCard />
      </div>

      {/* Bottom row */}
      <div className="lg:col-span-1">
        <IndicatorWatchCard />
      </div>
      <div className="lg:col-span-1">
        <AlertsCard />
      </div>
    </div>
  );
};

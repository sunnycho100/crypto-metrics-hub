import { useState, useEffect } from 'react';
import { Card } from './Card';
import {
  getLastVisit,
  saveLastVisit,
  formatTimeSince,
  calculateAllChanges,
  type MetricChange,
} from '../services/lastVisit';
import { useMetrics } from '../contexts/MetricsContext';

export function MetricsSummaryBanner() {
  const { metrics: currentMetrics, isLoading } = useMetrics();
  const [lastVisitTime, setLastVisitTime] = useState<string>('');
  const [metricChanges, setMetricChanges] = useState<MetricChange[]>([]);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Don't process if we don't have current metrics yet
    if (!currentMetrics || hasInitialized) return;

    const lastVisit = getLastVisit();
    
    if (lastVisit) {
      setLastVisitTime(formatTimeSince(lastVisit.timestamp));
      const changes = calculateAllChanges(currentMetrics, lastVisit.metrics);
      setMetricChanges(changes);
      setIsFirstVisit(false);
      
      console.log('🔍 Last Visit Debug:', {
        lastVisitTimestamp: new Date(lastVisit.timestamp).toLocaleString(),
        timeSince: formatTimeSince(lastVisit.timestamp),
        currentPrice: currentMetrics.price,
        previousPrice: lastVisit.metrics.price,
        changes: changes.map(c => ({
          label: c.label,
          change: c.category === 'index' ? c.absoluteChange : c.percentageChange,
          isSignificant: c.isSignificant
        }))
      });
    } else {
      setIsFirstVisit(true);
      console.log('👋 First visit detected');
    }

    // Mark as initialized so we don't recalculate on every metric update
    setHasInitialized(true);
  }, [currentMetrics, hasInitialized]);

  // Save current visit ONLY on component unmount (when user leaves)
  useEffect(() => {
    return () => {
      if (currentMetrics) {
        console.log('💾 Saving visit data on unmount');
        saveLastVisit(currentMetrics);
      }
    };
  }, [currentMetrics]);

  // Show nothing while loading
  if (isLoading || !currentMetrics) {
    return null;
  }

  const formatMetricValue = (change: MetricChange): string => {
    const { category, current } = change;
    
    if (category === 'price') {
      return `$${current.toLocaleString()}`;
    } else if (category === 'volume') {
      return `${current.toFixed(2)}B`;
    } else if (category === 'index') {
      return current.toFixed(0);
    } else if (current > 1000000) {
      return `${(current / 1000000).toFixed(2)}M`;
    } else if (current > 1000) {
      return `${(current / 1000).toFixed(2)}K`;
    }
    return current.toFixed(2);
  };

  const renderChangeIndicator = (change: MetricChange) => {
    const isPositive = change.trend === 'up';
    const isNeutral = change.trend === 'neutral';
    
    if (isNeutral) return null;

    const changeText = change.category === 'index' 
      ? `${change.absoluteChange > 0 ? '+' : ''}${change.absoluteChange.toFixed(0)}`
      : `${change.percentageChange > 0 ? '+' : ''}${change.percentageChange.toFixed(2)}%`;

    return (
      <div className={`flex items-center gap-2 ${isPositive ? 'text-positive' : 'text-negative'}`}>
        <span className="text-2xl font-bold">
          {isPositive ? '↗' : '↘'}
        </span>
        <div className="text-left">
          <div className="text-xs text-muted">{change.label}</div>
          <div className="font-semibold">{changeText}</div>
          <div className="text-xs opacity-75">
            {formatMetricValue({ ...change, current: change.previous })} → {formatMetricValue(change)}
          </div>
        </div>
      </div>
    );
  };

  // Design Variation 1: Compact Horizontal Banner
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const CompactBanner = () => {
    if (metricChanges.length === 0) return null;

    return (
      <div className="bg-gradient-to-r from-accent/10 via-purple/5 to-accent/10 border-l-4 border-accent p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <h3 className="font-semibold text-text">Welcome back!</h3>
              <p className="text-sm text-muted">Last visit: {lastVisitTime}</p>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            {metricChanges.filter(c => c.isSignificant).slice(0, 3).map((change, idx) => (
              <div key={idx}>{renderChangeIndicator(change)}</div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Design Variation 2: Card-Based Summary (Recommended)
  const CardBanner = () => {
    if (metricChanges.length === 0) return null;

    const significantChanges = metricChanges.filter(c => c.isSignificant);
    const upTrends = significantChanges.filter(c => c.trend === 'up').length;
    const downTrends = significantChanges.filter(c => c.trend === 'down').length;

    return (
      <Card className="mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-accent to-purple p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Welcome Back</h2>
              <p className="text-white/80">Since your last visit {lastVisitTime}</p>
            </div>
            <div className="flex gap-2">
              {upTrends > 0 && (
                <div className="bg-white/20 text-white border border-white/30 px-3 py-1 rounded-full text-sm">
                  {upTrends} ↗ Up
                </div>
              )}
              {downTrends > 0 && (
                <div className="bg-white/20 text-white border border-white/30 px-3 py-1 rounded-full text-sm">
                  {downTrends} ↘ Down
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
          {metricChanges.map((change, idx) => (
            <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
              change.isSignificant 
                ? 'bg-surface-2 hover:bg-surface border border-border shadow-sm' 
                : 'bg-surface hover:bg-surface-2 opacity-75'
            }`}>
              {renderChangeIndicator(change)}
            </div>
          ))}
        </div>
      </Card>
    );
  };

  // Design Variation 3: Minimal Inline Banner
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const MinimalBanner = () => {
    if (metricChanges.length === 0) return null;

    const significantChanges = metricChanges.filter(c => c.isSignificant);

    return (
      <div className="mb-6 p-4 rounded-lg border border-border bg-surface hover:shadow-sm transition-shadow">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-accent font-semibold">⏱️ Last visit: {lastVisitTime}</span>
          {significantChanges.length > 0 && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium">
              {significantChanges.length} significant change{significantChanges.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex gap-4 flex-wrap">
          {metricChanges.map((change, idx) => (
            <span key={idx} className="text-sm">
              <span className="text-muted">{change.label}:</span>
              <span className={`ml-1 font-semibold ${change.trend === 'up' ? 'text-positive' : change.trend === 'down' ? 'text-negative' : 'text-muted'}`}>
                {change.category === 'index' 
                  ? `${change.absoluteChange > 0 ? '+' : ''}${change.absoluteChange.toFixed(0)}` 
                  : `${change.percentageChange > 0 ? '+' : ''}${change.percentageChange.toFixed(2)}%`
                }
              </span>
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Design Variation 4: Hero Banner with Stats
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const HeroBanner = () => {
    if (metricChanges.length === 0) return null;

    const significantChanges = metricChanges.filter(c => c.isSignificant);

    return (
      <div className="mb-6 bg-gradient-to-br from-accent/5 via-purple/5 to-orange/5 rounded-xl overflow-hidden border border-accent/20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-text mb-2">
                Markets Since You Left
              </h2>
              <p className="text-muted flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                Last checked {lastVisitTime}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-accent">
                {significantChanges.length}
              </div>
              <div className="text-sm text-muted">Notable Changes</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metricChanges.map((change, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-lg transition-all ${
                  change.isSignificant
                    ? 'bg-white border-2 border-accent/30 shadow-lg'
                    : 'bg-white/50 border border-border'
                }`}
              >
                <div className="text-xs text-muted mb-1">{change.label}</div>
                <div className={`text-2xl font-bold mb-1 ${
                  change.trend === 'up' ? 'text-positive' : 
                  change.trend === 'down' ? 'text-negative' : 
                  'text-muted'
                }`}>
                  {change.category === 'index' 
                    ? `${change.absoluteChange > 0 ? '+' : ''}${change.absoluteChange.toFixed(0)}`
                    : `${change.percentageChange > 0 ? '+' : ''}${change.percentageChange.toFixed(1)}%`
                  }
                  <span className="ml-1">{change.trend === 'up' ? '↗' : change.trend === 'down' ? '↘' : '→'}</span>
                </div>
                <div className="text-xs text-muted">
                  {formatMetricValue(change)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // First Visit Welcome
  const WelcomeBanner = () => (
    <div className="bg-gradient-to-r from-accent/10 via-purple/5 to-orange/10 border border-accent/20 p-6 rounded-lg mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-2xl">
          👋
        </div>
        <div>
          <h2 className="text-xl font-bold text-text mb-1">Welcome to BTC Metrics Hub!</h2>
          <p className="text-muted">
            Track Bitcoin metrics in real-time. We'll show you what's changed since your last visit on your next visit.
          </p>
        </div>
      </div>
    </div>
  );

  // Main render - choose which design variation to use
  if (isFirstVisit) {
    return <WelcomeBanner />;
  }

  // Switch between design variations here:
  // return <CompactBanner />;
  return <CardBanner />; // Recommended default
  // return <MinimalBanner />;
  // return <HeroBanner />;
}

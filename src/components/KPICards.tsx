import React, { useState, useEffect } from 'react';
import { ModalCard, ModalRow } from './ModalCard';
import { MetricCard } from './Card';
import { fetchBTCStats, fetchBTCCandles } from '../services/coinbase';
import type { ProductStats, Candle } from '../types/coinbase';

export const KPICards: React.FC = () => {
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [historicalVolumes, setHistoricalVolumes] = useState<number[]>([]);
  const [useMovingAverage, setUseMovingAverage] = useState(false); // Default to daily volume

  // Calculate 3-day moving average from historical volumes
  const calculateMovingAverage = (volumes: number[], days: number = 3): number => {
    if (volumes.length < days) return volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const recent = volumes.slice(-days);
    return recent.reduce((a, b) => a + b, 0) / recent.length;
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        // Fetch current stats
        const data = await fetchBTCStats();
        
        // Fetch historical daily volume data (7 days to calculate 3-day MA)
        try {
          const end = Date.now();
          const start = end - (7 * 24 * 60 * 60 * 1000); // 7 days ago
          const candles = await fetchBTCCandles(86400, Math.floor(start / 1000), Math.floor(end / 1000));
          
          // Extract volumes (exclude today's incomplete volume)
          const volumes = candles.slice(0, -1).map(candle => candle.volume);
          console.log('✓ Historical volume data fetched:', volumes.length, 'days');
          console.log('Volume values:', volumes);
          
          if (mounted) {
            setHistoricalVolumes(volumes);
            // Don't auto-enable MA, keep it as user preference
          }
        } catch (volumeError) {
          console.warn('Failed to fetch historical volume data, falling back to 30-day average:', volumeError);
          if (mounted) {
            setUseMovingAverage(false);
          }
        }
        
        if (mounted) {
          setStats(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching BTC stats:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Calculate 24h change
  const calculatePriceChange = (): { change: string; changeType: 'positive' | 'negative' } => {
    if (!stats) return { change: '+0.00%', changeType: 'positive' };
    
    const current = parseFloat(stats.last);
    const open = parseFloat(stats.open);
    const changePercent = ((current - open) / open) * 100;
    
    return {
      change: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
      changeType: changePercent >= 0 ? 'positive' : 'negative',
    };
  };

  // Calculate volume change (using yesterday's volume in daily mode or 3-day MA)
  const calculateVolumeChange = (): { change: string; changeType: 'positive' | 'negative' } => {
    if (!stats) return { change: '0.00%', changeType: 'positive' as const };
    
    const volume24h = parseFloat(stats.volume);
    let comparisonVolume: number;
    
    if (useMovingAverage && historicalVolumes.length >= 3) {
      // Use 3-day moving average for smoother comparison
      comparisonVolume = calculateMovingAverage(historicalVolumes, 3);
      console.log('📊 Using 3-day moving average:', comparisonVolume.toFixed(2), 'BTC');
    } else if (historicalVolumes.length >= 1) {
      // Use yesterday's volume for daily comparison
      comparisonVolume = historicalVolumes[historicalVolumes.length - 1];
      console.log('📊 Using yesterday\'s volume:', comparisonVolume.toFixed(2), 'BTC');
    } else {
      // Fallback to 30-day average if no historical data
      const volume30day = parseFloat(stats.volume_30day);
      comparisonVolume = volume30day / 30;
      console.log('📊 Using 30-day average:', comparisonVolume.toFixed(2), 'BTC (fallback)');
    }
    
    const changePercent = ((volume24h - comparisonVolume) / comparisonVolume) * 100;
    console.log('📈 Volume change calculation:', volume24h.toFixed(2), 'vs', comparisonVolume.toFixed(2), '=', changePercent.toFixed(2) + '%');
    
    return {
      change: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
      changeType: changePercent >= 0 ? 'positive' : 'negative',
    };
  };

  // Format currency
  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  // Format volume
  const formatVolume = (volume: string) => {
    const vol = parseFloat(volume);
    if (vol >= 1000000) {
      return `${(vol / 1000000).toFixed(2)}M BTC`;
    } else if (vol >= 1000) {
      return `${(vol / 1000).toFixed(2)}K BTC`;
    }
    return `${vol.toFixed(2)} BTC`;
  };

  const priceChange = calculatePriceChange();
  const volumeChange = calculateVolumeChange();

  const kpiData = [
    {
      id: 'price',
      title: 'Bitcoin Price',
      value: loading || !stats ? 'Loading...' : formatPrice(stats.last),
      change: priceChange.change,
      changeType: priceChange.changeType,
      icon: 'attach_money',
      iconBgColor: 'bg-primary/10',
      iconColor: 'text-primary',
      modalTitle: 'Price Details',
      modalContent: stats ? (
        <>
          <ModalRow label="Current Price" value={formatPrice(stats.last)} />
          <ModalRow label="24h High" value={formatPrice(stats.high)} />
          <ModalRow label="24h Low" value={formatPrice(stats.low)} />
          <ModalRow label="24h Open" value={formatPrice(stats.open)} />
          <ModalRow 
            label="24h Change" 
            value={priceChange.change}
            valueColor={priceChange.changeType === 'positive' ? 'success' : 'danger'} 
          />
        </>
      ) : (
        <ModalRow label="Status" value="Loading..." />
      )
    },
    {
      id: 'volume',
      title: '24h Volume',
      value: loading || !stats ? 'Loading...' : formatVolume(stats.volume),
      change: volumeChange.change,
      changeType: volumeChange.changeType,
      icon: 'bar_chart',
      iconBgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
      modalTitle: 'Volume Analytics',
      modalContent: stats ? (
        <div className="relative">
          <div className="space-y-0">
            <ModalRow label="24h Volume" value={formatVolume(stats.volume)} />
            <ModalRow label="30d Volume" value={formatVolume(stats.volume_30day)} />
            {useMovingAverage && historicalVolumes.length >= 3 ? (
              <>
                <ModalRow 
                  label="3-day Moving Avg" 
                  value={formatVolume(calculateMovingAverage(historicalVolumes, 3).toString())} 
                />
                <ModalRow 
                  label="vs 3-day MA" 
                  value={volumeChange.change}
                  valueColor={volumeChange.changeType === 'positive' ? 'success' : 'danger'} 
                />
                <ModalRow 
                  label="Analysis Method" 
                  value="3-day Moving Average (smoother)" 
                  valueColor="info"
                />
              </>
            ) : (
              <>
                {historicalVolumes.length >= 1 ? (
                  <>
                    <ModalRow 
                      label="Yesterday's Volume" 
                      value={formatVolume(historicalVolumes[historicalVolumes.length - 1].toString())} 
                    />
                    <ModalRow 
                      label="vs Yesterday" 
                      value={volumeChange.change}
                      valueColor={volumeChange.changeType === 'positive' ? 'success' : 'danger'} 
                    />
                  </>
                ) : (
                  <>
                    <ModalRow 
                      label="Avg Daily Volume" 
                      value={formatVolume((parseFloat(stats.volume_30day) / 30).toString())} 
                    />
                    <ModalRow 
                      label="vs 30-day Avg" 
                      value={volumeChange.change}
                      valueColor={volumeChange.changeType === 'positive' ? 'success' : 'danger'} 
                    />
                  </>
                )}
                <ModalRow 
                  label="Analysis Method" 
                  value={historicalVolumes.length >= 1 ? "Daily Comparison" : "30-day Average (fallback)"} 
                  valueColor="info"
                />
              </>
            )}
            <ModalRow 
              label="Note" 
              value={
                useMovingAverage 
                  ? "Using 3-day MA to reduce volatility" 
                  : historicalVolumes.length >= 1 
                    ? "Day-over-day volume change" 
                    : "Historical data unavailable"
              }
              valueColor="neutral"
            />
          </div>
          
          {/* Toggle button at bottom right */}
          {historicalVolumes.length >= 3 && (
            <div className="flex justify-end mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUseMovingAverage(!useMovingAverage);
                }}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">
                  {useMovingAverage ? 'show_chart' : 'timeline'}
                </span>
                {useMovingAverage ? 'Daily Mode' : '3-Day MA'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <ModalRow label="Status" value="Loading..." />
      )
    },
    {
      id: 'mcap',
      title: 'Market Cap',
      value: '$1.24T',
      change: '+1.8%',
      changeType: 'positive' as const,
      icon: 'pie_chart',
      iconBgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      modalTitle: 'Market Dominance',
      modalContent: (
        <>
          <ModalRow label="BTC Dominance" value="54.2%" />
          <ModalRow label="FDV" value="$1.35T" />
          <ModalRow label="Circulating Supply" value="19.7M BTC" />
          <ModalRow label="Data Source" value="Mock Data" valueColor="warning" />
        </>
      )
    },
    {
      id: 'oi',
      title: 'Open Interest',
      value: '$14.8B',
      change: '+4.2%',
      changeType: 'positive' as const,
      icon: 'candlestick_chart',
      iconBgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-500',
      modalTitle: 'Derivatives Data',
      modalContent: (
        <>
          <ModalRow label="Long/Short Ratio" value="1.04" valueColor="success" />
          <ModalRow label="Top Exchange" value="Binance ($4.2B)" />
          <ModalRow label="1h Change" value="+0.5%" valueColor="success" />
          <ModalRow label="Data Source" value="Mock Data" valueColor="warning" />
        </>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-0">
      {kpiData.map((kpi) => (
        <ModalCard
          key={kpi.id}
          id={kpi.id}
          modalTitle={kpi.modalTitle}
          modalContent={kpi.modalContent}
        >
          <MetricCard
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            changeType={kpi.changeType}
            icon={kpi.icon}
            iconBgColor={kpi.iconBgColor}
            iconColor={kpi.iconColor}
          />
        </ModalCard>
      ))}
    </div>
  );
};

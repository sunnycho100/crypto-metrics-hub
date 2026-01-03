import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from './Card';
import { TimeButton } from './Button';
import { fetchBTCCandles } from '../services/coinbase';
import { fetch5YearBTCData, CoinGeckoCandle } from '../services/coingecko';
import { useChart } from '../contexts/ChartContext';
import type { Candle, Granularity } from '../types/coinbase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TimeOption {
  label: string;
  granularity: Granularity | 'coingecko'; // Add CoinGecko for 5Y data
  count: number; // Number of candles to display
}

const TIME_OPTIONS: TimeOption[] = [
  { label: '1H', granularity: 60, count: 60 },      // 1-min candles for 1 hour
  { label: '4H', granularity: 300, count: 48 },     // 5-min candles for 4 hours
  { label: '1D', granularity: 900, count: 96 },     // 15-min candles for 1 day
  { label: '1W', granularity: 3600, count: 168 },   // 1-hour candles for 1 week
  { label: '1M', granularity: 21600, count: 120 },  // 6-hour candles for 1 month
  { label: '1Y', granularity: 86400, count: 365 },  // Daily candles for 1 year
  { label: '5Y', granularity: 'coingecko', count: 1825 }, // 5-year data from CoinGecko
];

export const PriceChartCard: React.FC = () => {
  const { activeTimeframe, setActiveTimeframe } = useChart();
  const [candles, setCandles] = useState<(Candle | CoinGeckoCandle)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'coinbase' | 'coingecko'>('coinbase');

  // Find the active time option by label
  const activeTimeIndex = TIME_OPTIONS.findIndex(option => option.label === activeTimeframe);
  const activeTimeOption = TIME_OPTIONS[activeTimeIndex] || TIME_OPTIONS[2]; // Default to '1D'

  const handleTimeframeChange = (index: number) => {
    setActiveTimeframe(TIME_OPTIONS[index].label);
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let data: (Candle | CoinGeckoCandle)[];
        
        if (activeTimeOption.granularity === 'coingecko') {
          // Use CoinGecko for 5Y data
          data = await fetch5YearBTCData();
          setDataSource('coingecko');
        } else {
          // Use Coinbase for shorter timeframes
          const coinbaseData = await fetchBTCCandles(activeTimeOption.granularity as Granularity);
          data = coinbaseData.reverse().slice(-activeTimeOption.count);
          setDataSource('coinbase');
        }
        
        if (mounted) {
          setCandles(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch data');
          console.error('Error fetching BTC candles:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Auto-refresh interval - longer for historical data
    const refreshInterval = activeTimeOption.granularity === 'coingecko' ? 300000 : 60000; // 5min for 5Y, 1min for others
    const interval = setInterval(fetchData, refreshInterval);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [activeTimeframe]); // Use activeTimeframe instead of individual properties

  // Prepare chart data
  const chartData = {
    labels: candles.map((candle) => {
      const date = new Date(candle.timestamp * 1000);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      if (activeTimeOption.label === '1W') {
        return `${date.getMonth() + 1}/${date.getDate()} ${hours}:${minutes}`;
      }
      if (activeTimeOption.label === '1M') {
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }
      if (activeTimeOption.label === '1Y') {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      }
      if (activeTimeOption.label === '5Y') {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
      return `${hours}:${minutes}`;
    }),
    datasets: [
      {
        label: 'BTC Price',
        data: candles.map((candle) => candle.close),
        borderColor: '#3b82f6',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
          return gradient;
        },
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#3b82f6',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#9ca3af',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: (context: any) => {
            const candle = candles[context[0].dataIndex];
            const date = new Date(candle.timestamp * 1000);
            return date.toLocaleString();
          },
          label: (context: any) => {
            const candle = candles[context.dataIndex];
            return [
              `Price: $${candle.close.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              `High: $${candle.high.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              `Low: $${candle.low.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              `Volume: ${candle.volume.toFixed(2)} BTC`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#6b7280',
          maxRotation: 0,
          autoSkipPadding: 20,
        },
      },
      y: {
        position: 'right' as const,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#6b7280',
          callback: (value: any) => `$${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <Card className="relative z-0">
      <CardHeader
        title="Price Action & Volume"
        subtitle={
          loading
            ? 'Loading data...'
            : error
            ? 'Failed to load data'
            : `BTC/USD - ${dataSource === 'coingecko' ? 'CoinGecko Historical' : 'Live Coinbase'} Data (${candles.length} candles)`
        }
        action={
          <>
            {TIME_OPTIONS.map((option, index) => (
              <TimeButton
                key={option.label}
                label={option.label}
                isActive={activeTimeframe === option.label}
                onClick={() => handleTimeframeChange(index)}
              />
            ))}
          </>
        }
      />
      <div className="relative h-[400px] w-full p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">Loading chart data...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-400">{error}</div>
          </div>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
    </Card>
  );
};

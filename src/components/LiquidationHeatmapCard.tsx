import React, { useEffect, useState, useRef, useMemo } from 'react';
import { fetchLiquidationHeatmap } from '../services/heatmap';
import type { LiquidationHeatmap, LiquidationLevel } from '../types/heatmap';
import { Card } from './Card';

interface TooltipData {
  x: number;
  y: number;
  level: LiquidationLevel;
  ratio: number;
}

// Generate mock heatmap data for fallback
function generateMockHeatmap(currentPrice: number = 95000): LiquidationHeatmap {
  const levels: LiquidationLevel[] = [];
  const priceRange = 10000; // $10k range
  const minPrice = currentPrice - priceRange / 2;
  const maxPrice = currentPrice + priceRange / 2;
  const bucketSize = 100;
  
  for (let price = minPrice; price <= maxPrice; price += bucketSize) {
    // Create clustering effect around key levels
    const distanceFromCurrent = Math.abs(price - currentPrice);
    const baseIntensity = Math.max(0, 1 - distanceFromCurrent / (priceRange / 2));
    
    // Add some randomness and clustering at round numbers
    const isRoundNumber = price % 1000 === 0;
    const clusterMultiplier = isRoundNumber ? 2.5 : 1;
    
    const longLiq = (Math.random() * 2000000 + 500000) * baseIntensity * clusterMultiplier;
    const shortLiq = (Math.random() * 2000000 + 500000) * baseIntensity * clusterMultiplier;
    
    levels.push({
      price: Math.round(price),
      long_usd: Math.round(longLiq),
      short_usd: Math.round(shortLiq),
    });
  }
  
  return {
    symbol: 'BTCUSDT',
    ts: Math.floor(Date.now() / 1000),
    exchange_scope: 'aggregated',
    price_min: Math.round(minPrice),
    price_max: Math.round(maxPrice),
    bucket_size: bucketSize,
    levels,
  };
}

export default function LiquidationHeatmapCard() {
  const [heatmap, setHeatmap] = useState<LiquidationHeatmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch heatmap data
  useEffect(() => {
    let isMounted = true;

    const loadHeatmap = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching liquidation heatmap from API...');
        
        const data = await fetchLiquidationHeatmap({
          symbol: 'BTC',
          scope: 'aggregated',
        });

        console.log('✅ Liquidation heatmap data received from API:', {
          symbol: data.symbol,
          levels_count: data.levels?.length,
          price_range: `${data.price_min} - ${data.price_max}`,
          timestamp: new Date(data.ts * 1000).toISOString(),
        });

        if (isMounted) {
          setHeatmap(data);
          setError(null); // Clear any previous errors
          
          if (data.levels && data.levels.length > 0) {
            const midPrice = (data.price_min + data.price_max) / 2;
            setCurrentPrice(midPrice);
            console.log('📍 Current price set to:', midPrice);
          }
        }
      } catch (apiError) {
        console.error('❌ API Error:', apiError);
        
        if (isMounted) {
          // Use mock data only as fallback
          console.warn('⚠️ Falling back to mock data');
          const mockData = generateMockHeatmap(95000);
          setHeatmap(mockData);
          setCurrentPrice(95000);
          setError('Demo data (API unavailable)');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadHeatmap();

    // Refresh every 60 seconds
    const interval = setInterval(loadHeatmap, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Calculate max intensity for color scaling
  const maxIntensity = useMemo(() => {
    if (!heatmap || heatmap.levels.length === 0) return 1;
    
    return Math.max(
      ...heatmap.levels.map(level => level.long_usd + level.short_usd)
    );
  }, [heatmap]);

  // Render heatmap on canvas
  useEffect(() => {
    if (!heatmap || !canvasRef.current || heatmap.levels.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const levels = heatmap.levels;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate dimensions
    const barWidth = width;
    const barHeight = height / levels.length;

    // Draw heatmap bars
    levels.forEach((level, index) => {
      const totalIntensity = level.long_usd + level.short_usd;
      const intensity = totalIntensity / maxIntensity;
      
      // Color based on intensity (blue to red gradient)
      const hue = 240 - (intensity * 180); // 240 (blue) to 60 (yellow/red)
      const saturation = 70 + (intensity * 30); // 70% to 100%
      const lightness = 50 - (intensity * 20); // 50% to 30%
      
      ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      
      const y = height - ((index + 1) * barHeight); // Draw from bottom up
      ctx.fillRect(0, y, barWidth, barHeight);
    });

    // Draw current price line
    if (currentPrice && currentPrice >= heatmap.price_min && currentPrice <= heatmap.price_max) {
      const priceRange = heatmap.price_max - heatmap.price_min;
      const priceRatio = (currentPrice - heatmap.price_min) / priceRange;
      const lineY = height - (priceRatio * height);

      ctx.strokeStyle = '#fbbf24'; // Yellow
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, lineY);
      ctx.lineTo(width, lineY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw price label
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`$${currentPrice.toLocaleString()}`, 10, lineY - 5);
    }
  }, [heatmap, currentPrice, maxIntensity]);

  // Handle mouse move for tooltip
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!heatmap || !canvasRef.current || heatmap.levels.length === 0) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = canvas.height;
    const barHeight = height / heatmap.levels.length;

    // Find which level was hovered
    const levelIndex = Math.floor((height - y) / barHeight);
    
    if (levelIndex >= 0 && levelIndex < heatmap.levels.length) {
      const level = heatmap.levels[levelIndex];
      const total = level.long_usd + level.short_usd;
      const ratio = total > 0 ? level.long_usd / total : 0.5;

      setTooltip({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        level,
        ratio,
      });
    } else {
      setTooltip(null);
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500 dark:text-gray-400">
            Loading liquidation heatmap...
          </div>
        </div>
      </Card>
    );
  }

  if (error || !heatmap) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-red-500">
            {error || 'No heatmap data available'}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Liquidation Levels Heatmap
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {heatmap.symbol} • {heatmap.exchange_scope} • {heatmap.levels.length} levels
          </p>
          {error && (
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              ⚠️ {error}
            </p>
          )}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Updated: {new Date(heatmap.ts * 1000).toLocaleTimeString()}
        </div>
      </div>

      <div className="relative" ref={containerRef}>
        <div className="flex gap-4">
          {/* Y-axis labels */}
          <div className="flex flex-col justify-between text-xs text-gray-600 dark:text-gray-400 py-2">
            <span>${heatmap.price_max.toLocaleString()}</span>
            <span>${Math.round((heatmap.price_max + heatmap.price_min) / 2).toLocaleString()}</span>
            <span>${heatmap.price_min.toLocaleString()}</span>
          </div>

          {/* Heatmap canvas */}
          <div className="flex-1 relative">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="w-full h-96 border border-gray-200 dark:border-gray-700 rounded cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />

            {/* Tooltip */}
            {tooltip && (
              <div
                className="absolute z-10 bg-gray-900 text-white text-xs rounded px-3 py-2 pointer-events-none shadow-lg"
                style={{
                  left: tooltip.x + 10,
                  top: tooltip.y - 60,
                }}
              >
                <div className="font-bold mb-1">
                  ${tooltip.level.price.toLocaleString()}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between gap-4">
                    <span className="text-green-400">Longs:</span>
                    <span>${(tooltip.level.long_usd / 1_000_000).toFixed(2)}M</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-red-400">Shorts:</span>
                    <span>${(tooltip.level.short_usd / 1_000_000).toFixed(2)}M</span>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-gray-700 pt-1">
                    <span>Ratio:</span>
                    <span>{(tooltip.ratio * 100).toFixed(0)}% / {((1 - tooltip.ratio) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(to right, hsl(240, 70%, 50%), hsl(60, 100%, 30%))' }} />
            <span>Low → High Intensity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-yellow-400" style={{ background: 'repeating-linear-gradient(to right, #fbbf24 0, #fbbf24 5px, transparent 5px, transparent 10px)' }} />
            <span>Current Price</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

import type { LiquidationHeatmap } from '../types/heatmap';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface HeatmapParams {
  symbol?: string;
  scope?: 'binance' | 'aggregated' | 'bybit' | 'okx';
  range?: string;
  bucket?: number;
}

/**
 * Fetch liquidation levels heatmap from backend
 */
export async function fetchLiquidationHeatmap(
  params: HeatmapParams = {}
): Promise<LiquidationHeatmap> {
  const queryParams = new URLSearchParams({
    symbol: params.symbol || 'BTC',
    scope: params.scope || 'aggregated',
    range: params.range || '10pct',
    bucket: String(params.bucket || 50),
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(
      `${API_BASE}/api/heatmap/liquidation-levels?${queryParams}`,
      {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Clear heatmap cache
 */
export async function clearHeatmapCache(): Promise<void> {
  const response = await fetch(`${API_BASE}/api/heatmap/clear-cache`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

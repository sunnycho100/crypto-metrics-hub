/**
 * Normalized liquidation levels heatmap schema
 * Vendor-neutral representation
 */
export interface LiquidationLevel {
  price: number;
  long_usd: number;
  short_usd: number;
}

export interface NormalizedHeatmap {
  symbol: string;
  ts: number; // Unix timestamp
  exchange_scope: 'binance' | 'aggregated' | 'bybit' | 'okx';
  price_min: number;
  price_max: number;
  bucket_size: number;
  levels: LiquidationLevel[];
}

/**
 * CoinGlass API response types
 */
export interface CoinGlassLiquidationData {
  code: string;
  data: {
    time: number;
    price: number;
    data: Array<{
      price: number;
      longLiquidation: number;
      shortLiquidation: number;
    }>;
  };
  msg: string;
}

export interface HeatmapQueryParams {
  symbol?: string;
  scope?: 'binance' | 'aggregated' | 'bybit' | 'okx';
  range?: string; // e.g., "10pct"
  bucket?: number;
}

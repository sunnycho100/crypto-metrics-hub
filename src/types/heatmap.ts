/**
 * Frontend types for liquidation heatmap
 */
export interface LiquidationLevel {
  price: number;
  long_usd: number;
  short_usd: number;
}

export interface LiquidationHeatmap {
  symbol: string;
  ts: number;
  exchange_scope: 'binance' | 'aggregated' | 'bybit' | 'okx';
  price_min: number;
  price_max: number;
  bucket_size: number;
  levels: LiquidationLevel[];
}

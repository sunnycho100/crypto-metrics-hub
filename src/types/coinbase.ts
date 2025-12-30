/**
 * Coinbase Exchange API Types
 */

/**
 * OHLCV candle data structure
 * Coinbase returns: [timestamp, low, high, open, close, volume]
 */
export type CandleRaw = [
  number, // timestamp (unix)
  number, // low
  number, // high
  number, // open
  number, // close
  number  // volume
];

/**
 * Parsed candle data with named properties
 */
export interface Candle {
  timestamp: number;
  low: number;
  high: number;
  open: number;
  close: number;
  volume: number;
}

/**
 * Supported granularities (in seconds)
 */
export type Granularity = 60 | 300 | 900 | 3600 | 21600 | 86400;

/**
 * Product stats response from /products/{id}/stats
 */
export interface ProductStats {
  open: string;           // Opening price (24h ago)
  high: string;           // 24h high
  low: string;            // 24h low
  last: string;           // Last traded price
  volume: string;         // 24h volume in BTC
  volume_30day: string;   // 30-day volume in BTC
}

/**
 * Product ticker response from /products/{id}/ticker
 */
export interface ProductTicker {
  trade_id: number;
  price: string;          // Last traded price
  size: string;           // Last trade size
  time: string;           // Timestamp
  bid: string;            // Best bid
  ask: string;            // Best ask
  volume: string;         // 24h volume
}

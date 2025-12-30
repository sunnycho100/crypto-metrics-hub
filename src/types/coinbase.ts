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

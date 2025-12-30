import type { CandleRaw, Candle, Granularity } from '../types/coinbase';

const BASE_URL = 'https://api.exchange.coinbase.com';

/**
 * Fetches Bitcoin OHLCV candle data from Coinbase Exchange API
 * 
 * @param granularity - Candle interval in seconds (60, 300, 900, 3600, 21600, 86400)
 * @param start - Optional start time (ISO 8601 or Unix timestamp)
 * @param end - Optional end time (ISO 8601 or Unix timestamp)
 * @returns Array of parsed candle data
 * 
 * @example
 * ```ts
 * const hourlyCandles = await fetchBTCCandles(3600);
 * const lastDay = await fetchBTCCandles(3600, Date.now() - 86400000, Date.now());
 * ```
 */
export async function fetchBTCCandles(
  granularity: Granularity = 3600,
  start?: string | number,
  end?: string | number
): Promise<Candle[]> {
  // Build URL with query parameters
  const url = new URL(`${BASE_URL}/products/btc-usd/candles`);
  url.searchParams.set('granularity', granularity.toString());
  
  if (start) {
    url.searchParams.set('start', start.toString());
  }
  
  if (end) {
    url.searchParams.set('end', end.toString());
  }

  // Fetch data
  const response = await fetch(url.toString());

  // Handle non-200 responses
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(
      `Failed to fetch BTC candles from Coinbase API (${response.status}): ${errorText}`
    );
  }

  // Parse response
  const rawCandles: CandleRaw[] = await response.json();

  // Transform to strongly-typed objects
  return rawCandles.map(([timestamp, low, high, open, close, volume]) => ({
    timestamp,
    low,
    high,
    open,
    close,
    volume,
  }));
}

/**
 * Fetches the latest Bitcoin price from Coinbase
 * 
 * @returns Current BTC price in USD
 */
export async function fetchCurrentBTCPrice(): Promise<number> {
  const candles = await fetchBTCCandles(60); // 1-minute candles
  
  if (candles.length === 0) {
    throw new Error('No candle data available');
  }

  // Return the most recent close price
  return candles[0].close;
}

/**
 * CoinGecko API Service for extended historical data
 * Used for 5Y chart data where Coinbase API is insufficient
 */

const BASE_URL = 'https://api.coingecko.com/api/v3';

export interface CoinGeckoMarketData {
  prices: [number, number][]; // [timestamp_ms, price]
  total_volumes: [number, number][]; // [timestamp_ms, volume]
}

export interface CoinGeckoCandle {
  timestamp: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Fetches historical market data from CoinGecko
 * 
 * @param days - Number of days back from now (1-max, use 'max' for all available data)
 * @returns Historical price and volume data
 */
export async function fetchBTCHistoricalData(
  days: number | 'max' = 365
): Promise<CoinGeckoMarketData> {
  const daysNum = typeof days === 'number' ? days : 1825; // Default to 5 years for 'max'
  const url = `${BASE_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=${daysNum > 90 ? 'daily' : 'hourly'}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(
      `Failed to fetch BTC historical data from CoinGecko API (${response.status}): ${errorText}`
    );
  }
  
  return await response.json();
}

/**
 * Converts CoinGecko market data to candle format for chart compatibility
 * 
 * @param marketData - Raw market data from CoinGecko
 * @returns Array of candle data compatible with our chart
 */
export function convertToCandleFormat(marketData: CoinGeckoMarketData): CoinGeckoCandle[] {
  const candles: CoinGeckoCandle[] = [];
  
  for (let i = 0; i < marketData.prices.length; i++) {
    const [timestamp_ms, price] = marketData.prices[i];
    const [, volume] = marketData.total_volumes[i] || [timestamp_ms, 0];
    
    // For daily data, we simulate OHLC from price points
    // In a real implementation, you'd want actual OHLC data
    const candle: CoinGeckoCandle = {
      timestamp: Math.floor(timestamp_ms / 1000), // Convert to seconds
      open: price,
      high: price * 1.02, // Simulate high (2% above close)
      low: price * 0.98,  // Simulate low (2% below close)
      close: price,
      volume: volume
    };
    
    candles.push(candle);
  }
  
  return candles.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Fetches 5-year Bitcoin data from CoinGecko
 * 
 * @returns 5 years of daily candle data
 */
export async function fetch5YearBTCData(): Promise<CoinGeckoCandle[]> {
  const marketData = await fetchBTCHistoricalData(1825); // ~5 years in days
  return convertToCandleFormat(marketData);
}
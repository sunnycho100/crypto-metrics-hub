/**
 * CryptoQuant API Service for on-chain metrics
 * Documentation: https://docs.cryptoquant.com/
 */

const BASE_URL = 'https://api.cryptoquant.com/v1';
const API_KEY = import.meta.env.VITE_CRYPTOQUANT_API_KEY || '';

export interface MVRVData {
  date: string;
  mvrv: number | null;
}

export interface MVRVResponse {
  status: {
    code: number;
    message: string;
  };
  result: {
    window: string;
    data: MVRVData[];
  };
}

export interface RealizedPriceData {
  date: string;
  realized_price: number | null;
}

export interface CapitalizationData {
  date: string;
  market_cap: number | null;
  realized_cap: number | null;
}

/**
 * Fetches MVRV (Market-Value-to-Realized-Value) ratio from CryptoQuant
 * MVRV is a ratio of market_cap divided by realized_cap
 * 
 * @param window - Time window ('day', 'block')
 * @param limit - Number of data points to fetch (default: 30 for last 30 days)
 * @returns MVRV data
 */
export async function fetchMVRV(
  window: 'day' | 'block' = 'day',
  limit: number = 30
): Promise<MVRVResponse> {
  if (!API_KEY) {
    console.warn('CryptoQuant API key not configured. Using demo mode.');
    // Return mock data for demo
    return {
      status: { code: 200, message: 'success' },
      result: {
        window: 'day',
        data: generateMockMVRVData(limit)
      }
    };
  }

  const url = `${BASE_URL}/btc/market-indicator/mvrv?window=${window}&limit=${limit}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`CryptoQuant API Error (${response.status}): ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

/**
 * Fetches Realized Price from CryptoQuant
 * 
 * @param window - Time window ('day', 'block')
 * @param limit - Number of data points to fetch
 * @returns Realized Price data
 */
export async function fetchRealizedPrice(
  window: 'day' | 'block' = 'day',
  limit: number = 30
): Promise<any> {
  if (!API_KEY) {
    console.warn('CryptoQuant API key not configured. Using demo mode.');
    return {
      status: { code: 200, message: 'success' },
      result: {
        window: 'day',
        data: generateMockRealizedPriceData(limit)
      }
    };
  }

  const url = `${BASE_URL}/btc/market-indicator/realized-price?window=${window}&limit=${limit}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`CryptoQuant API Error (${response.status}): ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

/**
 * Fetches Market Capitalization data from CryptoQuant
 * 
 * @param window - Time window ('day', 'block')
 * @param limit - Number of data points to fetch
 * @returns Capitalization data (market_cap, realized_cap, etc.)
 */
export async function fetchCapitalization(
  window: 'day' | 'block' = 'day',
  limit: number = 1
): Promise<any> {
  if (!API_KEY) {
    console.warn('CryptoQuant API key not configured. Using demo mode.');
    return {
      status: { code: 200, message: 'success' },
      result: {
        window: 'day',
        data: generateMockCapitalizationData(limit)
      }
    };
  }

  const url = `${BASE_URL}/btc/market-data/capitalization?window=${window}&limit=${limit}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`CryptoQuant API Error (${response.status}): ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

/**
 * Calculate MVRV Z-Score
 * Z-Score = (Market Cap - Realized Cap) / Standard Deviation of Market Cap
 * 
 * @param mvrv - Current MVRV value
 * @returns Approximate Z-Score
 */
export function calculateMVRVZScore(mvrv: number): number {
  // Simplified Z-Score calculation
  // Typical MVRV ranges: 0.5-3.5, with mean around 1.5
  const mean = 1.5;
  const stdDev = 0.8;
  return (mvrv - mean) / stdDev;
}

// Mock data generators for demo mode
function generateMockMVRVData(limit: number): MVRVData[] {
  const data: MVRVData[] = [];
  const today = new Date();
  
  for (let i = limit - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic MVRV values (typically 0.8 - 2.5)
    const baseValue = 1.5;
    const variation = Math.sin(i / 10) * 0.5 + (Math.random() - 0.5) * 0.2;
    const mvrv = Number((baseValue + variation).toFixed(2));
    
    data.push({
      date: date.toISOString().split('T')[0],
      mvrv
    });
  }
  
  return data;
}

function generateMockRealizedPriceData(limit: number): RealizedPriceData[] {
  const data: RealizedPriceData[] = [];
  const today = new Date();
  
  for (let i = limit - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic realized price (slightly below market price)
    const basePrice = 42000;
    const variation = Math.sin(i / 15) * 2000 + (Math.random() - 0.5) * 1000;
    const realized_price = Number((basePrice + variation).toFixed(2));
    
    data.push({
      date: date.toISOString().split('T')[0],
      realized_price
    });
  }
  
  return data;
}

function generateMockCapitalizationData(limit: number): CapitalizationData[] {
  const data: CapitalizationData[] = [];
  const today = new Date();
  
  for (let i = limit - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      market_cap: 850000000000,
      realized_cap: 465000000000
    });
  }
  
  return data;
}

/**
 * Formats large numbers to human-readable format
 * @param value - Number to format
 * @returns Formatted string (e.g., "1.5T", "500B")
 */
export function formatLargeNumber(value: number): string {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  return `$${value.toFixed(2)}`;
}

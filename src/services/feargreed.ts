/**
 * Alternative.me Fear & Greed Index API Service
 * Free API - No authentication required
 * 
 * Index Scale:
 * 0-24: Extreme Fear
 * 25-49: Fear
 * 50-74: Greed
 * 75-100: Extreme Greed
 */

export interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update?: string;
}

export interface FearGreedResponse {
  name: string;
  data: FearGreedData[];
  metadata: {
    error: string | null;
  };
}

const API_BASE = 'https://api.alternative.me';

/**
 * Fetch current Fear & Greed Index
 * @param limit - Number of historical data points (default: 1 for latest only)
 */
export async function fetchFearGreedIndex(limit: number = 1): Promise<FearGreedResponse> {
  try {
    const response = await fetch(`${API_BASE}/fng/?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`Fear & Greed API error: ${response.status}`);
    }
    
    const data: FearGreedResponse = await response.json();
    
    if (data.metadata.error) {
      throw new Error(`Fear & Greed API returned error: ${data.metadata.error}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching Fear & Greed Index:', error);
    throw error;
  }
}

/**
 * Fetch historical Fear & Greed Index data
 * @param days - Number of days of historical data
 */
export async function fetchFearGreedHistory(days: number = 30): Promise<FearGreedResponse> {
  return fetchFearGreedIndex(days);
}

/**
 * Get color based on Fear & Greed value
 */
export function getFearGreedColor(value: number): string {
  if (value <= 24) return '#ef4444'; // Extreme Fear - Red
  if (value <= 49) return '#f97316'; // Fear - Orange
  if (value <= 74) return '#84cc16'; // Greed - Light Green
  return '#0bda5b'; // Extreme Greed - Success Green
}

/**
 * Get classification label based on value
 */
export function getFearGreedClassification(value: number): string {
  if (value <= 24) return 'Extreme Fear';
  if (value <= 49) return 'Fear';
  if (value <= 74) return 'Greed';
  return 'Extreme Greed';
}

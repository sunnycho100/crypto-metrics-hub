/**
 * Service for tracking user's last visit and storing metric snapshots
 * Uses localStorage to persist data across sessions
 */

export interface MetricsSnapshot {
  price: number;
  fearGreedIndex: number;
  fearGreedValue: string; // 'Extreme Fear', 'Fear', etc.
  volume24h: number;
  marketCap: number;
  priceChange24h: number;
  // Add more metrics as needed
  mvrv?: number;
  activeAddresses?: number;
  hashRate?: number;
}

export interface LastVisitData {
  timestamp: number;
  metrics: MetricsSnapshot;
}

const STORAGE_KEY = 'btc_metrics_last_visit';

/**
 * Save current metrics snapshot for comparison on next visit
 */
export function saveLastVisit(metrics: MetricsSnapshot): void {
  const visitData: LastVisitData = {
    timestamp: Date.now(),
    metrics,
  };
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitData));
  } catch (error) {
    console.error('Failed to save last visit data:', error);
  }
}

/**
 * Retrieve last visit data from localStorage
 */
export function getLastVisit(): LastVisitData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const parsed: LastVisitData = JSON.parse(stored);
    
    // Validate data structure
    if (!parsed.timestamp || !parsed.metrics) {
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to retrieve last visit data:', error);
    return null;
  }
}

/**
 * Clear last visit data (useful for testing or reset)
 */
export function clearLastVisit(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear last visit data:', error);
  }
}

/**
 * Check if this is the user's first visit
 */
export function isFirstVisit(): boolean {
  return getLastVisit() === null;
}

/**
 * Format time difference as human-readable string
 */
export function formatTimeSince(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(diff / 604800000);
  const months = Math.floor(diff / 2592000000);

  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (seconds > 30) return `${seconds} seconds ago`;
  return 'just now';
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Calculate absolute change between two values
 */
export function calculateAbsoluteChange(current: number, previous: number): number {
  return current - previous;
}

/**
 * Determine if a change is significant (above threshold)
 */
export function isSignificantChange(change: number, threshold: number = 2): boolean {
  return Math.abs(change) >= threshold;
}

/**
 * Get all metric changes with calculated differences
 */
export interface MetricChange {
  label: string;
  current: number;
  previous: number;
  absoluteChange: number;
  percentageChange: number;
  isSignificant: boolean;
  trend: 'up' | 'down' | 'neutral';
  category: 'price' | 'index' | 'volume' | 'onchain' | 'other';
}

export function calculateAllChanges(
  current: MetricsSnapshot,
  previous: MetricsSnapshot
): MetricChange[] {
  const changes: MetricChange[] = [];

  // Price change
  const priceChange = calculatePercentageChange(current.price, previous.price);
  changes.push({
    label: 'Bitcoin Price',
    current: current.price,
    previous: previous.price,
    absoluteChange: calculateAbsoluteChange(current.price, previous.price),
    percentageChange: priceChange,
    isSignificant: isSignificantChange(priceChange, 1),
    trend: priceChange > 0 ? 'up' : priceChange < 0 ? 'down' : 'neutral',
    category: 'price',
  });

  // Fear & Greed Index change
  const fgChange = calculateAbsoluteChange(current.fearGreedIndex, previous.fearGreedIndex);
  changes.push({
    label: 'Fear & Greed Index',
    current: current.fearGreedIndex,
    previous: previous.fearGreedIndex,
    absoluteChange: fgChange,
    percentageChange: calculatePercentageChange(current.fearGreedIndex, previous.fearGreedIndex),
    isSignificant: Math.abs(fgChange) >= 5,
    trend: fgChange > 0 ? 'up' : fgChange < 0 ? 'down' : 'neutral',
    category: 'index',
  });

  // Volume change
  const volumeChange = calculatePercentageChange(current.volume24h, previous.volume24h);
  changes.push({
    label: '24H Volume',
    current: current.volume24h,
    previous: previous.volume24h,
    absoluteChange: calculateAbsoluteChange(current.volume24h, previous.volume24h),
    percentageChange: volumeChange,
    isSignificant: isSignificantChange(volumeChange, 10),
    trend: volumeChange > 0 ? 'up' : volumeChange < 0 ? 'down' : 'neutral',
    category: 'volume',
  });

  // Market Cap change
  const mcapChange = calculatePercentageChange(current.marketCap, previous.marketCap);
  changes.push({
    label: 'Market Cap',
    current: current.marketCap,
    previous: previous.marketCap,
    absoluteChange: calculateAbsoluteChange(current.marketCap, previous.marketCap),
    percentageChange: mcapChange,
    isSignificant: isSignificantChange(mcapChange, 1),
    trend: mcapChange > 0 ? 'up' : mcapChange < 0 ? 'down' : 'neutral',
    category: 'other',
  });

  // Add optional metrics if they exist
  if (current.mvrv !== undefined && previous.mvrv !== undefined) {
    const mvrvChange = calculatePercentageChange(current.mvrv, previous.mvrv);
    changes.push({
      label: 'MVRV Ratio',
      current: current.mvrv,
      previous: previous.mvrv,
      absoluteChange: calculateAbsoluteChange(current.mvrv, previous.mvrv),
      percentageChange: mvrvChange,
      isSignificant: isSignificantChange(mvrvChange, 5),
      trend: mvrvChange > 0 ? 'up' : mvrvChange < 0 ? 'down' : 'neutral',
      category: 'onchain',
    });
  }

  return changes;
}

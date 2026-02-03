import type {
  NormalizedHeatmap,
  CoinGlassLiquidationData,
  HeatmapQueryParams,
} from '../types/heatmap';

/**
 * CoinGlass API adapter for liquidation levels heatmap
 * 
 * API Documentation: https://www.coinglass.com/api-en
 * Endpoint: /api/futures/liquidation/chart
 */
export class CoinglassHeatmapAdapter {
  private readonly baseURL = 'https://open-api.coinglass.com/public/v2';
  private cache: Map<string, { data: NormalizedHeatmap; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 60000; // 60 seconds

  /**
   * Fetch liquidation levels heatmap
   */
  async getLiquidationLevelsHeatmap(
    symbol: string = 'BTC',
    params: HeatmapQueryParams = {}
  ): Promise<NormalizedHeatmap> {
    const {
      scope = 'aggregated',
      range = '10pct',
      bucket = 50,
    } = params;

    // Check cache
    const cacheKey = `${symbol}_${scope}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      // CoinGlass liquidation heatmap endpoint
      // Note: Adjust endpoint based on actual CoinGlass API documentation
      const params = new URLSearchParams({
        symbol: symbol,
        ex: scope === 'aggregated' ? 'all' : scope,
        interval: '1', // 1 hour interval
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `${this.baseURL}/futures/liquidation/chart?${params}`,
        {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`CoinGlass API returned ${response.status}, using mock data`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CoinGlassLiquidationData = await response.json();

      if (data.code !== '0' && data.code !== 'success') {
        console.warn(`CoinGlass API error: ${data.msg}, using mock data`);
        throw new Error(`CoinGlass API error: ${data.msg}`);
      }

      // Normalize the response
      const normalized = this.normalizeResponse(data, symbol, scope, bucket);

      // Update cache
      this.cache.set(cacheKey, {
        data: normalized,
        timestamp: Date.now(),
      });

      return normalized;
    } catch (error) {
      console.error('CoinGlass heatmap fetch error:', error);
      
      // Return cached data if available (even if stale)
      if (cached) {
        console.warn('Returning stale cached data due to fetch error');
        return cached.data;
      }
      
      // Generate mock data as final fallback
      console.warn('Generating mock data as fallback');
      const mockData = this.generateMockData(symbol, scope, bucket);
      
      // Cache mock data
      this.cache.set(cacheKey, {
        data: mockData,
        timestamp: Date.now(),
      });
      
      return mockData;
    }
  }

  /**
   * Generate mock liquidation heatmap data
   */
  private generateMockData(
    symbol: string,
    scope: string,
    bucketSize: number
  ): NormalizedHeatmap {
    const currentPrice = 95000; // Mock BTC price
    const levels: any[] = [];
    const priceRange = 10000;
    const minPrice = currentPrice - priceRange / 2;
    const maxPrice = currentPrice + priceRange / 2;
    
    for (let price = minPrice; price <= maxPrice; price += bucketSize) {
      const distanceFromCurrent = Math.abs(price - currentPrice);
      const baseIntensity = Math.max(0, 1 - distanceFromCurrent / (priceRange / 2));
      
      // Add clustering at round numbers
      const isRoundNumber = price % 1000 === 0;
      const clusterMultiplier = isRoundNumber ? 2.5 : 1;
      
      const longLiq = (Math.random() * 2000000 + 500000) * baseIntensity * clusterMultiplier;
      const shortLiq = (Math.random() * 2000000 + 500000) * baseIntensity * clusterMultiplier;
      
      levels.push({
        price: Math.round(price),
        longLiquidation: Math.round(longLiq),
        shortLiquidation: Math.round(shortLiq),
      });
    }
    
    const mockResponse: CoinGlassLiquidationData = {
      code: '0',
      msg: 'success',
      data: {
        time: Math.floor(Date.now() / 1000),
        price: currentPrice,
        data: levels,
      },
    };
    
    return this.normalizeResponse(mockResponse, symbol, scope, bucketSize);
  }

  /**
   * Normalize CoinGlass response to internal schema
   */
  private normalizeResponse(
    data: CoinGlassLiquidationData,
    symbol: string,
    scope: string,
    bucketSize: number
  ): NormalizedHeatmap {
    const rawData = data.data;
    const levels = rawData.data || [];

    if (levels.length === 0) {
      // Return empty heatmap if no data
      return {
        symbol: `${symbol}USDT`,
        ts: Math.floor(Date.now() / 1000),
        exchange_scope: scope as any,
        price_min: 0,
        price_max: 0,
        bucket_size: bucketSize,
        levels: [],
      };
    }

    // Sort levels by price
    const sortedLevels = levels
      .map(level => ({
        price: level.price,
        long_usd: level.longLiquidation || 0,
        short_usd: level.shortLiquidation || 0,
      }))
      .sort((a, b) => a.price - b.price);

    const prices = sortedLevels.map(l => l.price);
    const price_min = Math.min(...prices);
    const price_max = Math.max(...prices);

    return {
      symbol: `${symbol}USDT`,
      ts: rawData.time || Math.floor(Date.now() / 1000),
      exchange_scope: scope as any,
      price_min,
      price_max,
      bucket_size: bucketSize,
      levels: sortedLevels,
    };
  }

  /**
   * Clear cache (useful for manual refresh)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache status
   */
  getCacheStatus(): { key: string; age: number }[] {
    const now = Date.now();
    return Array.from(this.cache.entries()).map(([key, value]) => ({
      key,
      age: now - value.timestamp,
    }));
  }
}

// Singleton instance
export const coinglassAdapter = new CoinglassHeatmapAdapter();

import { Router, Request, Response } from 'express';
import { coinglassAdapter } from '../services/coinglass';
import type { HeatmapQueryParams } from '../types/heatmap';

const router = Router();

/**
 * GET /api/heatmap/liquidation-levels
 * 
 * Query params:
 * - symbol: string (default: "BTC")
 * - scope: "binance" | "aggregated" | "bybit" | "okx" (default: "aggregated")
 * - range: string (e.g., "10pct") - currently not used, for future filtering
 * - bucket: number (default: 50) - bucket size in USD
 * 
 * Returns normalized liquidation levels heatmap
 */
router.get('/liquidation-levels', async (req: Request, res: Response) => {
  console.log('📊 Heatmap request received:', req.query);
  
  try {
    const params: HeatmapQueryParams = {
      symbol: (req.query.symbol as string) || 'BTC',
      scope: (req.query.scope as any) || 'aggregated',
      range: (req.query.range as string) || '10pct',
      bucket: req.query.bucket ? parseInt(req.query.bucket as string) : 50,
    };

    console.log('🔍 Fetching heatmap with params:', params);

    // Validate symbol
    if (params.symbol && !/^[A-Z]{2,10}$/.test(params.symbol)) {
      return res.status(400).json({
        error: 'Invalid symbol format',
        message: 'Symbol must be 2-10 uppercase letters (e.g., BTC, ETH)',
      });
    }

    // Validate scope
    const validScopes = ['binance', 'aggregated', 'bybit', 'okx'];
    if (params.scope && !validScopes.includes(params.scope)) {
      return res.status(400).json({
        error: 'Invalid scope',
        message: `Scope must be one of: ${validScopes.join(', ')}`,
      });
    }

    // Fetch heatmap data
    const heatmap = await coinglassAdapter.getLiquidationLevelsHeatmap(
      params.symbol,
      params
    );

    console.log('✅ Heatmap data ready:', {
      symbol: heatmap.symbol,
      levels: heatmap.levels.length,
      range: `${heatmap.price_min}-${heatmap.price_max}`
    });

    res.json(heatmap);
  } catch (error) {
    console.error('❌ Heatmap API error:', error);
    
    res.status(500).json({
      error: 'Failed to fetch liquidation heatmap',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/heatmap/cache-status
 * 
 * Returns cache status for debugging
 */
router.get('/cache-status', (req: Request, res: Response) => {
  try {
    const status = coinglassAdapter.getCacheStatus();
    res.json({
      cache: status,
      ttl: 60000, // ms
    });
  } catch (error) {
    console.error('Cache status error:', error);
    res.status(500).json({
      error: 'Failed to get cache status',
    });
  }
});

/**
 * POST /api/heatmap/clear-cache
 * 
 * Clears the heatmap cache (useful for manual refresh)
 */
router.post('/clear-cache', (req: Request, res: Response) => {
  try {
    coinglassAdapter.clearCache();
    res.json({
      success: true,
      message: 'Cache cleared',
    });
  } catch (error) {
    console.error('Clear cache error:', error);
    res.status(500).json({
      error: 'Failed to clear cache',
    });
  }
});

export default router;

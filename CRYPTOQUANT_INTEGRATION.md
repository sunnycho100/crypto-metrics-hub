# CryptoQuant MVRV Integration

## Overview
Successfully integrated CryptoQuant API to provide real-time MVRV (Market-Value-to-Realized-Value) data for the Bitcoin metrics dashboard.

## What Was Implemented

### 1. CryptoQuant API Service (`src/services/cryptoquant.ts`)
- **MVRV Endpoint**: Fetches MVRV ratio data from CryptoQuant
- **Realized Price Endpoint**: Gets the realized price metric
- **Capitalization Endpoint**: Retrieves market cap and realized cap data
- **Demo Mode**: Includes mock data generation when API key is not configured
- **Helper Functions**: 
  - `calculateMVRVZScore()` - Calculates Z-Score for MVRV
  - `formatLargeNumber()` - Formats large numbers (e.g., $1.5T)

### 2. Updated Components
- **OnChainMetrics.tsx**: Now fetches live data from CryptoQuant API
  - Real-time MVRV value with automatic updates every 5 minutes
  - Z-Score calculation
  - Realized Price display
  - STH MVRV (Short-Term Holder MVRV) approximation
  - Dynamic change indicators (↑/↓ with percentage)

### 3. Environment Configuration
- **`.env.example`**: Added `VITE_CRYPTOQUANT_API_KEY` configuration
- **`vite-env.d.ts`**: Added TypeScript definitions for the new env variable

## API Documentation
Based on CryptoQuant's official documentation:

**MVRV Endpoint**:
```
GET https://api.cryptoquant.com/v1/btc/market-indicator/mvrv
```

**Parameters**:
- `window`: 'day' or 'block' (default: 'day')
- `limit`: Number of data points (default: 100, max: 100,000)
- `from`: Start date (format: YYYYMMDD or YYYYMMDDTHHMMSS)
- `to`: End date (format: YYYYMMDD or YYYYMMDDTHHMMSS)

**Response Format**:
```json
{
  "status": {
    "code": 200,
    "message": "success"
  },
  "result": {
    "window": "day",
    "data": [
      {
        "date": "2024-01-08",
        "mvrv": 1.84
      }
    ]
  }
}
```

## How to Use

### Without API Key (Demo Mode)
The integration works out of the box with mock data:
```bash
npm run dev
```

### With CryptoQuant API Key

1. **Get API Key**:
   - Visit: https://cryptoquant.com/
   - Sign up for a free account
   - Navigate to API settings to get your key

2. **Configure Environment**:
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Edit .env and add your key
   VITE_CRYPTOQUANT_API_KEY=your_actual_api_key_here
   ```

3. **Start the App**:
   ```bash
   npm run dev
   ```

## Features

### Current Implementation
- ✅ Live MVRV ratio from CryptoQuant
- ✅ Z-Score calculation
- ✅ Realized Price display
- ✅ STH MVRV estimation
- ✅ Automatic data refresh (every 5 minutes)
- ✅ Demo mode with mock data
- ✅ Error handling and fallback
- ✅ Change percentage indicators

### MVRV Interpretation
- **MVRV > 3.5**: Market potentially overvalued (sell signal)
- **MVRV 1.0 - 3.5**: Normal range
- **MVRV < 1.0**: Market potentially undervalued (buy signal)

### Z-Score Interpretation
- **Z-Score > 2**: Overvalued zone
- **Z-Score 0 - 2**: Normal range
- **Z-Score < 0**: Undervalued zone

## API Rate Limits

### CryptoQuant Free Tier
- Limited historical data access
- Rate limits apply (check their documentation)
- Real-time data available

### Paid Tiers
- Extended historical data
- Higher rate limits
- More endpoints and metrics

## Next Steps

### Potential Enhancements
1. **Chart Integration**: Add MVRV historical chart in modal
2. **More Metrics**: Integrate additional CryptoQuant metrics:
   - SOPR (Spent Output Profit Ratio)
   - NVT (Network Value to Transactions)
   - Hash Rate
   - Miner Flows
3. **Alerts**: Set up alerts when MVRV crosses key thresholds
4. **Data Caching**: Implement caching to reduce API calls

### Other On-Chain Metrics Available
From CryptoQuant API:
- Exchange Flows (inflow/outflow)
- Miner Flows
- Network Indicators (NVT, NVT Golden Cross)
- Hash Rate & Difficulty
- Active Addresses
- SOPR variations

## Files Modified

1. **New Files**:
   - `src/services/cryptoquant.ts` - CryptoQuant API service

2. **Modified Files**:
   - `src/components/OnChainMetrics.tsx` - Updated to use live data
   - `src/vite-env.d.ts` - Added TypeScript definitions
   - `.env.example` - Added CryptoQuant API key configuration

## Testing

### Test with Mock Data
The app works without an API key using realistic mock data.

### Test with Real API
1. Add valid API key to `.env`
2. Check browser console for API responses
3. Verify MVRV card updates with real data
4. Check that data refreshes every 5 minutes

## Troubleshooting

### API Key Issues
- Ensure `VITE_CRYPTOQUANT_API_KEY` is set in `.env`
- Verify the key is valid (test on CryptoQuant's website)
- Check browser console for error messages

### CORS Issues
If encountering CORS errors:
- CryptoQuant API should support CORS for browser requests
- If issues persist, may need to proxy requests through backend

### Rate Limiting
If hitting rate limits:
- Increase refresh interval (currently 5 minutes)
- Implement caching layer
- Upgrade to paid CryptoQuant plan

## Resources

- **CryptoQuant Docs**: https://docs.cryptoquant.com/
- **CryptoQuant API**: https://cryptoquant.com/
- **MVRV Guide**: https://dataguide.cryptoquant.com/market-indicators/mvrv-ratio
- **API Endpoint List**: https://api.cryptoquant.com/v1/discovery/endpoints

## Support

For issues or questions:
1. Check CryptoQuant documentation
2. Review browser console errors
3. Verify API key configuration
4. Check CryptoQuant API status

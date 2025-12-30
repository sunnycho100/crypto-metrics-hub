# BTC Metrics Hub

A modern React + TypeScript dashboard for Bitcoin metrics monitoring with live data integration from Coinbase Exchange API. Features real-time price tracking, interactive Chart.js visualizations, and a clean, responsive design.

## 🌐 Live Demo

**Production URL**: https://3000-i1hvjqf2g5rywornix0nr-5634da27.sandbox.novita.ai

## ✨ Features Implemented

### Current Features
- ✅ **Live Coinbase API Integration**
  - Real-time Bitcoin price data
  - 24-hour trading statistics (high, low, open, close)
  - 24-hour and 30-day volume metrics
  - Auto-refresh every 30-60 seconds
- ✅ **Interactive Price Chart**
  - Live OHLCV candlestick data from Coinbase
  - Multiple timeframes: 1H, 4H, 1D, 1W
  - Chart.js with smooth animations and gradients
  - Responsive tooltips with detailed price info
- ✅ **KPI Cards with Live Data**
  - Bitcoin Price (live from Coinbase)
  - 24H Volume (live from Coinbase)
  - Market Cap (mock data - requires external API)
  - Open Interest (mock data - requires derivatives API)
- ✅ **Dashboard Components**
  - Composite Health Card
  - Alerts & Triggers Card
  - Market Pulse Card
  - On-Chain Metrics (mock data)
  - Derivatives Table (mock data)
- ✅ **Modern UI/UX**
  - Responsive layout with grid system
  - Clean light/dark theme support
  - Reusable component library
  - Smooth hover effects and transitions
  - Modal cards with detailed metrics

### Features Not Yet Implemented
- ⏳ Market Cap live data (needs CoinGecko/CoinMarketCap API)
- ⏳ Open Interest live data (needs derivatives exchange APIs)
- ⏳ On-chain metrics integration (needs Glassnode/CryptoQuant)
- ⏳ User authentication
- ⏳ Real-time WebSocket updates
- ⏳ Data export functionality (CSV, PDF)
- ⏳ Customizable dashboard widgets
- ⏳ Alert creation and notifications

## 🎨 Theme

The dashboard uses a **clean modern** color scheme with smooth gradients:

```css
--bg: #f8f9fb              /* Light gray background */
--surface: #ffffff          /* White cards */
--surface-2: #f5f6f8        /* Light gray secondary */
--border: rgba(0, 0, 0, 0.08)
--text: #1a1d29             /* Dark text */
--muted: #6b7280            /* Gray secondary text */
--accent: #5b8ff9           /* Blue accent */
--accent-light: #e8f0fe     /* Light blue background */
--positive: #10b981         /* Green for gains */
--positive-light: #d1fae5   /* Light green background */
--negative: #ef4444         /* Red for losses */
--negative-light: #fee2e2   /* Light red background */
--purple: #8b5cf6           /* Purple accent */
--orange: #f59e0b           /* Orange accent */
```

## 📁 Project Structure

```
btc_metrics_hub/
├── src/
│   ├── components/
│   │   ├── AlertsCard.tsx           # Alerts & Triggers card
│   │   ├── Badge.tsx                # Status badge component
│   │   ├── Button.tsx               # Button components
│   │   ├── Card.tsx                 # Reusable card containers
│   │   ├── Charts.tsx               # Chart.js components
│   │   ├── CompositeHealthCard.tsx  # Health rating card
│   │   ├── DerivativesTable.tsx     # Derivatives data table
│   │   ├── Header.tsx               # Top header bar
│   │   ├── KPICards.tsx             # Live KPI metrics (Price, Volume)
│   │   ├── MarketPulseCard.tsx      # Market pulse indicators
│   │   ├── ModalCard.tsx            # Modal overlay component
│   │   ├── OnChainMetrics.tsx       # On-chain data cards
│   │   ├── PriceChartCard.tsx       # Live price chart with Coinbase data
│   │   └── index.ts                 # Component exports
│   ├── services/
│   │   └── coinbase.ts              # Coinbase API service
│   ├── types/
│   │   └── coinbase.ts              # TypeScript type definitions
│   ├── App.tsx                      # Main app component
│   ├── index.css                    # Global styles + Tailwind
│   └── main.tsx                     # React entry point
├── tailwind.config.js               # Tailwind configuration
├── vite.config.ts                   # Vite configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd btc_metrics_hub

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development Commands

```bash
npm run dev          # Start Vite dev server (usually on localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Interactive charts and graphs
- **react-chartjs-2** - React wrapper for Chart.js
- **Coinbase Exchange API** - Live Bitcoin market data (public API, no key required)

## 📊 API Integration

### Coinbase Exchange API

The app uses the public Coinbase Exchange API endpoints:

- `/products/btc-usd/candles` - OHLCV candlestick data
- `/products/btc-usd/stats` - 24-hour statistics
- `/products/btc-usd/ticker` - Current ticker data

**No API key required** - these are public endpoints with rate limiting.

### Available Functions

```typescript
import { fetchBTCCandles, fetchBTCStats, fetchBTCTicker } from './services/coinbase';

// Fetch candle data with different granularities
const hourlyData = await fetchBTCCandles(3600); // 1-hour candles
const dailyData = await fetchBTCCandles(86400); // 1-day candles

// Get 24-hour stats
const stats = await fetchBTCStats();
console.log(stats.last, stats.volume, stats.high, stats.low);

// Get current ticker
const ticker = await fetchBTCTicker();
console.log(ticker.price, ticker.bid, ticker.ask);
```

## 📋 Recommended Next Steps

1. **Additional Data Sources**
   - Integrate CoinGecko API for Market Cap and dominance
   - Add Binance/Deribit API for Open Interest data
   - Connect Glassnode or CryptoQuant for on-chain metrics
   - Add multiple exchange aggregation

2. **Enhanced Charting**
   - Add candlestick chart view (not just line charts)
   - Implement technical indicators (RSI, MACD, Bollinger Bands)
   - Add chart zoom and pan capabilities
   - Volume bars overlay on price chart

3. **User Features**
   - Price alerts and notifications
   - Watchlist functionality
   - Portfolio tracking
   - Historical data comparison

4. **Performance Optimization**
   - Implement data caching with React Query
   - Add WebSocket for real-time updates
   - Optimize chart rendering
   - Add loading skeletons

5. **Mobile Optimization**
   - Responsive mobile layout improvements
   - Touch-optimized chart interactions
   - Mobile-friendly modals and tooltips

## 📝 Component Usage

### Using the Price Chart

```tsx
import { PriceChartCard } from './components/PriceChartCard';

// The component automatically fetches and displays live data
<PriceChartCard />
```

### Using KPI Cards

```tsx
import { KPICards } from './components/KPICards';

// Displays live price and volume, mock data for others
<KPICards />
```

### Creating Custom Cards

```tsx
import { Card, CardHeader } from './components/Card';
import { Badge } from './components/Badge';

const MyCard = () => (
  <Card>
    <CardHeader
      title="My Card Title"
      subtitle="Card description"
      action={<Badge variant="success">Live</Badge>}
    />
    <div className="p-6">
      {/* Your content */}
    </div>
  </Card>
);
```

## 🎯 Design Principles

- **Data-First**: Real-time data integration with graceful fallbacks
- **Clean & Modern**: Light theme with smooth gradients and rounded shapes
- **Responsive**: Mobile-first design with grid layouts
- **Type-Safe**: Full TypeScript coverage for reliability
- **Component-Based**: Reusable, composable UI components
- **Performance**: Efficient data fetching with auto-refresh
- **User Experience**: Loading states, error handling, and smooth interactions

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to fork and customize for your needs.

---

**Last Updated**: 2025-12-31  
**Status**: ✅ Active (Live Coinbase API integration)  
**Version**: 1.0

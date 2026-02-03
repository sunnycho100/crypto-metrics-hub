# Changelog

All notable changes to the BTC Metrics Hub project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## Example Format
```
## [X.Y.Z] - YYYY-MM-DD
### Category
- **Brief summary** - Detailed description of the change
- **Another feature** - What it does and why it matters
```

**Categories:** Added, Changed, Improved, Fixed, Removed, Deprecated, Security

---

## [1.10.0] - 2026-02-02
### Added
- **Liquidation Levels Heatmap** - Complete implementation of real-time liquidation levels visualization using CoinGlass API
  - Backend CoinGlass adapter service with vendor-neutral normalization schema
  - Intelligent 60-second caching system for optimal API usage and performance
  - RESTful API endpoints: `/api/heatmap/liquidation-levels`, `/api/heatmap/cache-status`, `/api/heatmap/clear-cache`
  - Interactive canvas-based heatmap visualization with price buckets on Y-axis
  - Color intensity gradient (blue to red) showing liquidation concentration at each price level
  - Real-time BTC price overlay as yellow dashed horizontal line
  - Hover tooltips displaying long/short liquidation amounts and ratios at each price level
  - Auto-refresh every 60 seconds for live data updates
  - Supports multiple exchange scopes: Binance, aggregated, Bybit, OKX
  - Error handling with graceful fallbacks and stale cache recovery
  - Integrated into main dashboard between Price Chart and On-Chain Metrics sections

### Technical
- **TypeScript interfaces** - Created normalized heatmap schema with vendor-neutral design pattern for future provider swapping
- **Native fetch API** - Used browser's native fetch instead of axios to avoid additional dependencies
- **Canvas rendering** - High-performance canvas-based visualization with smart scaling and color mapping
- **Cache management** - Built-in cache status monitoring and manual cache clearing capabilities

## [1.9.5] - 2026-01-20
### Improved
- **Welcome Back banner visual enhancement** - Significantly enlarged "Welcome Back" heading from text-2xl to text-4xl/5xl for better prominence and professional appearance
- **Professional landing animations** - Implemented smooth, staggered entrance animations with time delays for banner, text, badges, and metric cards using custom CSS keyframes
- **Animation system** - Added fadeIn, fadeInUp, slideDown, and slideUp animations with cubic-bezier easing for polished, modern feel
- **Metric card cascade effect** - Each metric card animates in sequentially with individual delays (0.1s increments) creating a professional cascade effect

### Fixed
- **Infinite animation loop** - Fixed banner animations re-triggering on every render by adding hasAnimated state flag
- **Empty metrics display** - Smart display logic now shows "Markets are relatively stable" message when no significant changes detected instead of forcing empty metric cards
- **Animation performance** - Animations play only once on initial load and are removed from DOM after completion to prevent re-triggering

### Changed
- **Banner padding and spacing** - Increased header padding (p-6 → p-8) and text sizes for better visual hierarchy
- **Badge styling** - Enhanced Up/Down trend badges with larger padding and font-weight for improved readability
- **Conditional metrics rendering** - Metric cards only display when significant changes exist, providing cleaner UX for recent visits

## [1.9.4] - 2026-01-19
### Fixed
- **MetricsSummaryBanner dark mode visibility** - Fixed "Welcome Back" text being invisible in light mode by using theme-aware text colors (text-slate-900 dark:text-white) instead of hardcoded text-white
- **Banner badge visibility** - Updated Up/Down trend badges to use proper theme-aware colors and borders for both light and dark modes

### Added
- **Tailwind color definitions** - Added missing accent (#5b8ff9), purple (#9b59b6), and orange (#f39c12) colors to Tailwind config
- **Explicit gradient colors** - Updated banner gradient to use explicit hex values for consistent rendering across themes

### In Progress
- **SQLite database migration** - Converting from JSON file storage to SQLite database for user authentication and data persistence
  - Created database service with schema for users, sessions, and preferences
  - Updated userStore to use database queries instead of file I/O
  - Modified auth routes to handle database operations with proper field name conversions (snake_case to camelCase)
  - Added database initialization and graceful shutdown handlers
  - Database file location: `server/data/btc_metrics.db`
  - Note: Implementation not yet complete, server initialization pending fixes

## [1.9.2] - 2026-01-18
### Fixed

### Improved

## [1.9.3] - 2026-01-18
### Fixed
- **Fear & Greed Card rendering** - Fixed JSX and logic errors causing the card to break; restored correct conditional rendering and closing tags
- **MetricsContext integration** - Refactored Fear & Greed Card to use MetricsContext for data, eliminating duplicate API calls and improving consistency
- **Code cleanup** - Removed legacy fetch logic and duplicate sections from Fear & Greed Card; simplified error handling and UI state
- **Live indicator** - Added green pulse dot and "Live" label for real-time data freshness

### Fixed
## [1.9.3] - 2026-01-18
### Fixed
- Fear & Greed Card rendering: Fixed JSX and logic errors causing the card to break; restored correct conditional rendering and closing tags
- MetricsContext integration: Refactored Fear & Greed Card to use MetricsContext for data, eliminating duplicate API calls and improving consistency

### Improved
- Code cleanup: Removed legacy fetch logic and duplicate sections from Fear & Greed Card; simplified error handling and UI state
- Live indicator: Added green pulse dot and "Live" label for real-time data freshness
- **Last visit timestamp accuracy** - Banner now correctly maintains last visit time across sessions instead of resetting every 60 seconds

### Added
- **Initialization guard** - Prevents unnecessary recalculation of changes when metrics auto-refresh



## [1.9.0] - 2026-01-18
### Fixed
- **MetricsSummaryBanner persistence** - Fixed banner disappearing issue by changing save behavior to only persist data on component unmount instead of every metric update
- **Last visit timestamp accuracy** - Banner now correctly maintains last visit time across sessions instead of resetting every 60 seconds
- **Change detection reliability** - Metrics comparison now calculates only once on initialization, preventing constant recalculation

### Added
- **Debug utilities** - Added browser console test functions for testing banner with different time scenarios (2 hours ago, 3 days ago, 1 week ago, etc.)
- **Debug logging** - Console logs show last visit data, calculated changes, and save events for easier troubleshooting
- **Initialization guard** - Prevents unnecessary recalculation of changes when metrics auto-refresh

### Improved
- **Component lifecycle** - Uses proper React cleanup pattern (useEffect return) for saving visit data
- **Testing workflow** - Created comprehensive testing guide with multiple scenarios and expected behaviors

---

## [1.9.0] - 2026-01-18
### Added
- **Metrics Summary Banner** - Personalized landing page showing changes since last visit with 4 design variations (Card, Compact, Minimal, Hero)
- **Last visit tracking** - localStorage-based system tracks user visits and creates metric snapshots for comparison
- **Change detection** - Automatically calculates and displays price, Fear & Greed, volume, and market cap changes
- **Time formatting** - Human-readable time since last visit ("2 hours ago", "3 days ago", etc.)
- **Significant change highlighting** - Emphasizes important changes with visual indicators (arrows, colors, borders)
- **First visit welcome** - Dedicated welcome banner for new users explaining the feature
- **MetricsContext** - Centralized React Context for managing real-time metrics across all components
- **Real-time data integration** - Connected banner to live Coinbase and Fear & Greed APIs with 60-second auto-refresh
- **Trend indicators** - Visual up/down arrows with percentage/absolute changes for each metric
- **Multiple design options** - 4 switchable UI variations from minimal to hero banner style

### Improved
- **Data flow architecture** - Implemented context-based data management for easy consumption by any component
- **Type safety** - Full TypeScript coverage for metrics snapshots and change calculations
- **Error handling** - Graceful fallback to mock data if APIs fail
- **Loading states** - Banner hidden during initial data fetch for cleaner UX

### Changed
- **README emojis** - Replaced all emojis with text-based alternatives like [V], [TODO], [API] for better compatibility

---

## [1.8.4] - 2026-01-15
### Fixed
- **Volume tab spacing** - Fixed inconsistent spacing between metric rows in 24H Volume Analytics modal to match other popups

---

## [1.8.3] - 2026-01-15
### Improved
- **Collapsible contact footer** - Contact form now starts collapsed as small "Contact Us" button and expands when clicked
- **Simplified footer** - Removed unnecessary tagline text, keeping just copyright notice

---

## [1.8.2] - 2026-01-15
### Added
- **Contact & Support footer** - Interactive feedback form at page bottom with name, email, and message fields
- **Email integration** - Submissions open default email client with pre-filled message to such4283@gmail.com
- **Success feedback** - Visual confirmation message shown after form submission
- **Footer branding** - Copyright notice and community message at page bottom

---

## [1.8.1] - 2026-01-14
### Fixed
- **Syntax error** - Resolved JSX parsing issue in FearGreedCard component return statement
- **TypeScript errors** - Fixed type safety issues in FearGreedHistoryModal (null checks, unused imports, Chart.js API compatibility)
- **TimeButton props** - Corrected component prop names for proper type checking

---

## [1.8.0] - 2026-01-14
### Added
- **Crypto Fear & Greed Index** - Live sentiment indicator from Alternative.me API with custom animated SVG gauge component
- **Custom gauge visualization** - 270° circular gauge with gradient background, glow effects, and smooth animations matching site theme
- **Trading suggestions** - Context-aware buy/sell recommendations based on current Fear & Greed value
- **Market sentiment card** - New dashboard card displaying real-time index (0-100), classification labels, and educational tooltips
- **Historical chart modal** - Click card to view Fear & Greed history with Chart.js line chart, multiple timeframes (7D/30D/90D/1Y), and period statistics
- **Interactive analytics** - Modal shows average, peak, low values and extreme days count with draggable interface

### Improved
- **Right column layout** - Added Fear & Greed card at top for immediate visibility of market sentiment
- **Theme consistency** - Gauge colors dynamically adapt to dark/light mode with matching glow effects
- **Clickable interaction** - Card hover states and click-to-expand functionality for deeper analysis

---

## [1.7.0] - 2026-01-13
### Added
- **Theme toggle button** - Switch between light and dark modes with animated icon button in header
- **Theme persistence** - User theme preference saved to localStorage and restored on page load
- **System theme detection** - Automatically detects and applies OS dark/light mode preference on first visit

### Improved
- **Scrollbar styling** - Better contrast in light mode with adaptive colors for both themes
- **Icon button accessibility** - Added disabled states and aria-labels for better UX
- **Color consistency** - Refined hover states and transitions for seamless theme switching

---

## [1.5.3] - 2026-01-09

### Added - Market Cap & Open Interest (CryptoQuant)
- Wired Market Cap and Open Interest KPI cards to live CryptoQuant endpoints with 5-minute refresh
- Show 24h change indicators plus detail modals with realized cap, window, and data source context
- Preserve demo mode fallback when no CryptoQuant API key is configured

---

## [1.5.4] - 2026-01-09

### Added - Developer Mode Login
- Added environment-gated developer login (credentials configured in server .env) that issues a developer-mode session
- Login modal accepts dev ID/password path while keeping registration email validation
- Server `/me` endpoint now returns the dev user when in developer mode

---

## [1.5.2] - 2026-01-09

### Added - Active Addresses & Hashrate (CryptoQuant)
- Connected Active Addresses and Hashrate cards to live CryptoQuant endpoints with 5-minute refresh
- Added concise in-card tooltips sourced from CryptoQuant docs for both metrics
- Show 24h change indicators with positive/negative coloring

---

## [1.5.1] - 2026-01-09

### Added - MVRV Help Tooltip
- Added in-card help popover on the MVRV Ratio card with CryptoQuant-sourced definition
- Made the info button togglable and dismissible for concise in-context guidance

---

## [1.5.0] - 2026-01-08

### Added - CryptoQuant MVRV Integration 🎯
- **Live MVRV Data** - Integrated CryptoQuant API for real-time MVRV (Market-Value-to-Realized-Value) ratio
- **On-Chain Metrics** - Added Z-Score calculation, Realized Price, and STH MVRV metrics
- **Auto-refresh** - MVRV data updates automatically every 5 minutes
- **Demo Mode** - Works without API key using realistic mock data
- **Environment Config** - Added `VITE_CRYPTOQUANT_API_KEY` to .env.example

### Technical
- Created `src/services/cryptoquant.ts` service with MVRV, Realized Price, and Capitalization endpoints
- Updated `OnChainMetrics.tsx` component to fetch and display live data
- Added comprehensive documentation in CRYPTOQUANT_INTEGRATION.md

---

## [1.4.3] - 2026-01-06

### Fixed - News API Integration
- **Config Loading** - Fixed async config loading to ensure search terms load before API calls
- **Enhanced Logging** - Added detailed console logging for debugging news fetching
- **Query Building** - Improved search query construction with proper term loading
- **Article Count** - Increased NewsAPI fetch from 5 to 10 articles for better selection

### Technical
- Added `ensureConfigLoaded()` to guarantee config loads before searches
- Moved config file to `public/` folder for proper Vite serving
- Enhanced error handling with fallback to mock news
- Improved console debugging output

---

## [1.4.2] - 2026-01-06

### Added - Market Pulse News Integration 📰
- **Live Bitcoin News** - Integrated dual news sources (CryptoPanic + NewsAPI) for real-time Bitcoin news
- **Configurable Search Terms** - Created public/crypto-news-terms.json for easy customization of news search queries
  - 15 pre-configured crypto-related search terms (Bitcoin, BTC, cryptocurrency, blockchain, etc.)
  - Exclude terms filter to remove unwanted content
  - Auto-loaded on news fetch with console logging for transparency
  - Search query uses OR logic to match any configured term
- **Smart Categorization** - Auto-categorizes news into News, Regulation, and Analysis
- **Auto-refresh** - News updates every 5 minutes with manual refresh option
- **External Links** - Click articles to open in new tab
- **Fallback System** - Graceful degradation to mock news if APIs unavailable
- **Environment Configuration** - NewsAPI key configured in .env (gitignored for security)

---

## [1.4.1] - 2026-01-06

### Changed - Volume Comparison Mode
- **Daily Volume Default** - Changed 24h volume to compare against yesterday's volume (day-over-day) instead of 3-day moving average
- **Toggle Option** - Added button in volume modal to switch between Daily Mode and 3-Day MA Mode
- **Dynamic Comparison** - Volume modal now shows "Yesterday's Volume" in daily mode and "3-day Moving Avg" in MA mode

---

## [1.4.0] - 2026-01-04

### Enhanced - Volume Analysis 📊
- **3-Day Moving Average** - Enhanced 24H volume analysis with intelligent smoothing
  - Fetches 7 days of historical daily candle data from Coinbase API
  - Calculates 3-day moving average from recent complete trading days  
  - Compares current 24H volume against smoothed baseline (reduces volatility)
  - Smart fallback to 30-day average if historical data unavailable
  
- **Enhanced Volume Modal** - Improved user experience with detailed methodology
  - Shows both 3-day moving average and 30-day average values
  - Color-coded analysis method indicators (info/warning/success)
  - Explanatory note about volatility reduction benefits
  - Transparent methodology display for user understanding

- **Robust Error Handling** - Comprehensive fallback system
  - Graceful degradation if API calls fail
  - Console logging for debugging and monitoring
  - State management to track active calculation method

### Technical Improvements
- **Smart Volume Calculation** - `calculateMovingAverage()` function for statistical smoothing
- **Historical Data Integration** - Extended Coinbase API usage for volume trend analysis  
- **Enhanced Modal Components** - Added `info` and `neutral` color options to ModalRow
- **Developer Documentation** - Added VOLUME_ANALYSIS_ENHANCEMENT.md with detailed explanation

### UI Polish
- **Professional Color Scheme** - Changed analysis method indicator from blue to subtle gray for more professional appearance (eliminates hyperlink-like styling)

---

## [1.3.3] - 2026-01-03

### Fixed
- **CoinGecko API Limitation** - Changed 5Y timeframe to "MAX" (365 days) to comply with free API limits
- **Dynamic Port Detection** - Enhanced start.sh script to open browser on correct port when 3000 is busy

## [1.3.2] - 2026-01-03

### Added
- **Header Quick-Access Buttons** - Added 1M, 1Y, MAX timeframe buttons in header
- **1M Timeframe** - Added 1-month chart view with 6-hour candles
- **Global Chart State** - Implemented React Context for timeframe synchronization

## [1.3.0] - 2026-01-03

### Added
- **1Y Timeframe** - Added 1-year chart view using Coinbase daily candles
- **5Y Timeframe** - Added 5-year historical chart view using CoinGecko API
- **Dual API Support** - Automatic switching between Coinbase and CoinGecko for different timeframes
- **1Y Timeframe** - Added 1-year chart view using Coinbase daily candles
  - 365 days of daily OHLCV data from Coinbase Exchange API
  - Auto-refresh every 60 seconds
  - Date format: YYYY-MM-DD for readability
  
- **5Y Timeframe** - Added 5-year historical chart view using CoinGecko API
  - ~1,825 days of historical Bitcoin price data
  - CoinGecko API integration for extended historical coverage
  - Auto-refresh every 5 minutes (optimized for historical data)
  - Date format: YYYY-MM for multi-year view
  
- **CoinGecko API Service** (`/src/services/coingecko.ts`)
  - `fetch5YearBTCData()` - Fetches 5 years of historical Bitcoin data
  - `fetchBTCHistoricalData(days)` - Flexible historical data fetching
  - `convertToCandleFormat()` - Converts CoinGecko format to chart-compatible candles
  - Rate limit: 30 calls/minute (free tier)
  
### Changed - Chart Enhancements
- **Automatic API Switching** - Chart intelligently uses Coinbase for recent data (1H-1Y) and CoinGecko for historical data (5Y)
- **Data Source Indicator** - Chart subtitle shows "Live Coinbase Data" or "CoinGecko Historical Data"
- **Smart Date Formatting** - Different date formats optimized for each timeframe
- **Enhanced Time Options** - Updated button array with 6 total timeframes: 1H, 4H, 1D, 1W, 1Y, 5Y

### Technical
- **Mixed Data Type Support** - Chart component now handles both Coinbase and CoinGecko data formats
- **Optimized Refresh Intervals** - Different refresh rates based on data source (1min for live, 5min for historical)
- **TypeScript Types** - Added CoinGeckoCandle interface and updated TimeOption type

---

## [1.2.1] - 2026-01-02

### Added - Security & Documentation
- **Security Checklist** (`SECURITY.md`)
  - Comprehensive security review and checklist
  - Production deployment security requirements
  - Safe GitHub push verification steps
  
- **Root .gitignore** file
  - Protection for all `.env` files
  - Server directory security
  - User data protection (`server/data/users.json`)
  - System files and build artifacts

### Changed - Security Hardening
- **Server .env** - Replaced actual secret with clearly marked dev-only placeholder
- **README.md** - Added security section with link to SECURITY.md
- **Server .gitignore** - Enhanced to protect user data and environment files

### Security
- ✅ **Verified safe for GitHub** - No sensitive data will be committed
- ✅ **Environment variables protected** - All `.env` files ignored
- ✅ **User data secured** - Temporary JSON storage ignored
- ✅ **No hardcoded secrets** - All secrets use environment variables

---

## [1.2.0] - 2026-01-02

### Added - Authentication System
- **Backend Server** (`/server`)
  - Express.js server with TypeScript
  - JWT (jsonwebtoken) authentication with configurable expiry
  - Password hashing using bcryptjs (12 rounds)
  - User registration and login endpoints (`/api/auth/register`, `/api/auth/login`)
  - Current user endpoint (`/api/auth/me`) with token verification
  - Logout endpoint (`/api/auth/logout`)
  - Temporary JSON file storage for users (`/server/data/users.json`)
  - Environment configuration with dotenv
  - CORS enabled for frontend origins

- **Frontend Authentication**
  - `LoginModal` component with login/register toggle
  - `AuthContext` for global auth state management
  - `auth.ts` service for API calls (login, register, logout, getCurrentUser)
  - Token storage in localStorage
  - Header integration with user dropdown menu

- **Technologies Used**
  - Express.js v4.18
  - jsonwebtoken v9.0
  - bcryptjs v2.4
  - uuid v9.0 for user IDs
  - tsx for TypeScript execution in dev

### Changed
- Updated `Header.tsx` to show login button or user menu based on auth state
- Updated `main.tsx` to wrap App with `AuthProvider`
- Added `LoginModal` export to `components/index.ts`

### Documentation
- Added authentication section to README with TODO table for production
- Updated project structure in README
- Added server installation instructions

---

## [1.1.0] - 2026-01-02

### Added - Progress Indicators
- Added "(IN PROGRESS)" labels to cards not connected to backend APIs:
  - Market Pulse (IN PROGRESS)
  - MVRV Ratio (IN PROGRESS)
  - Active Addresses (IN PROGRESS)
  - Hash Rate (IN PROGRESS)
  - Top Derivatives Markets (IN PROGRESS)
  - Composite Health (IN PROGRESS)
  - Alerts Configuration (IN PROGRESS)

### Notes
- Cards connected to Coinbase API: KPICards (price, volume), PriceChartCard
- Visual indicator helps identify components needing API integration

---

## [1.0.0] - 2025-12-31

### Added - Initial Release
- **Coinbase Exchange API Integration**
  - `fetchBTCCandles()` - OHLCV candlestick data with granularity options
  - `fetchBTCStats()` - 24-hour trading statistics
  - `fetchBTCTicker()` - Current ticker data
  - Auto-refresh intervals (30-60 seconds)

- **Dashboard Components**
  - `KPICards` - Live price and volume from Coinbase
  - `PriceChartCard` - Interactive Chart.js line chart with timeframes
  - `CompositeHealthCard` - Health score visualization
  - `AlertsCard` - Alert configuration UI
  - `MarketPulseCard` - Market updates feed
  - `OnChainMetrics` - MVRV, Active Addresses, Hash Rate cards
  - `DerivativesTable` - Exchange derivatives data table
  - `Header` - Navigation and search bar
  - `ModalCard` - Expandable detail modals

- **UI Components**
  - `Card`, `MetricCard`, `SmallMetricCard` - Card containers
  - `Button`, `IconButton`, `PrimaryButton`, `TextButton`, `TimeButton`
  - `Badge`, `Pill` - Status indicators
  - `PriceChart`, `MiniBarChart` - Chart.js wrappers

- **Technologies Used**
  - React 18 with TypeScript
  - Vite 5 for build tooling
  - Tailwind CSS 3.3 for styling
  - Chart.js 4.4 with react-chartjs-2
  - Coinbase Exchange API (public endpoints, no key required)

- **Features**
  - Responsive grid layout (mobile to desktop)
  - Light/dark theme support
  - Smooth animations and transitions
  - Loading states and error handling

---

## Upcoming Features (Roadmap)

### High Priority
- [ ] Database integration (PostgreSQL/MongoDB) for user storage
- [ ] HTTPS/TLS for production
- [ ] JWT secret management with secrets manager

### Medium Priority
- [ ] Market Cap API integration (CoinGecko/CoinMarketCap)
- [ ] Open Interest from derivatives exchanges
- [ ] On-chain metrics (Glassnode/CryptoQuant)
- [ ] WebSocket for real-time updates
- [ ] Email verification and password reset

### Low Priority
- [ ] OAuth login (Google, GitHub)
- [ ] Two-factor authentication
- [ ] Data export (CSV, PDF)
- [ ] Customizable dashboard widgets
- [ ] Alert notifications (push, email)

---

## API Reference

### Coinbase Exchange API (Public)
| Endpoint | Function | Description |
|----------|----------|-------------|
| `/products/btc-usd/candles` | `fetchBTCCandles()` | OHLCV data |
| `/products/btc-usd/stats` | `fetchBTCStats()` | 24h statistics |
| `/products/btc-usd/ticker` | `fetchBTCTicker()` | Current price |

### Auth Server API
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Create new user |
| `/api/auth/login` | POST | Login user |
| `/api/auth/me` | GET | Get current user (requires Bearer token) |
| `/api/auth/logout` | POST | Logout user |
| `/api/health` | GET | Server health check |

---

*This changelog is maintained manually. Last updated: 2026-01-02*

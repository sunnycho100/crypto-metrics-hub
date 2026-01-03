# Changelog

All notable changes to the BTC Metrics Hub project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.3.1] - 2026-01-03

### Added - Quick-Access Timeframe Controls
- **Header Timeframe Buttons** - Added prominent quick-access buttons in the header for popular timeframes
  - 1M, 1Y, and 5Y buttons for instant chart switching
  - Integrated with chart state management via React Context
  - Responsive design (hidden on mobile, visible on medium screens and up)
  - Clean UI with active state highlighting

- **1M Timeframe** - Added 1-month chart view using 6-hour candles
  - 120 candles (6-hour intervals) covering approximately 1 month
  - Optimized granularity for medium-term analysis
  - Date format: MM/DD for readability

### Enhanced
- **Chart State Management** - Implemented React Context for global chart timeframe state
  - Shared state between chart component and header controls
  - Centralized timeframe management for better user experience

### Fixed
- **Dynamic Port Detection** - Enhanced start.sh script to automatically detect Vite's port
  - Script now opens browser on the actual port Vite uses (e.g., 3001, 3002) instead of hardcoded 3000
  - Automatic port detection when port 3000 is busy
  - Real-time feedback and improved error handling
  - Graceful cleanup on script termination

- **CoinGecko API Limitation** - Fixed 5Y timeframe failing due to API restrictions
  - Changed 5Y timeframe to "MAX" (365 days) to comply with CoinGecko free API limits
  - Updated CoinGecko service to use maximum allowed historical data (365 days)
  - Improved error handling with specific API limitation detection
  - Better user feedback for API constraints

## [1.3.0] - 2026-01-03

### Added - Extended Chart Timeframes
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

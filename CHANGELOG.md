# Changelog

All notable changes to the BTC Metrics Hub project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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

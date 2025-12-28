# BTC Investment Performance Indicator Dashboard

A modern, clean-themed React + TypeScript dashboard for Bitcoin investment performance monitoring. Features a professional light design with smooth rounded shapes and interactive Chart.js visualizations.

## 🌐 Live Demo

**Production URL**: https://3000-i1hvjqf2g5rywornix0nr-5634da27.sandbox.novita.ai

## ✨ Features Implemented

### Current Features
- ✅ **Full responsive layout** with fixed sidebar (280px) and main content area
- ✅ **Clean light theme** with smooth gradients and modern design
- ✅ **Sidebar navigation** with 8 emoji-based nav items and 3 color-coded saved views
- ✅ **Enhanced top bar** with advanced search, live BTC price, and notifications
- ✅ **Four interactive dashboard cards with real Chart.js graphs**:
  - **Market Snapshot**: 4 animated KPI tiles + gradient area chart with 7-day trend
  - **Composite Rating**: Doughnut chart + progress bars showing component scores
  - **Indicator Watch**: 5 indicators with mini sparklines and status badges
  - **Alerts & Triggers**: Icon-based alert cards with color coding
- ✅ **Reusable components**: Card, Badge, Pill, Charts (Line, Doughnut, Sparkline)
- ✅ **Chart.js integration** with example data and smooth animations
- ✅ **Large rounded corners** (14-24px), smooth shadows, and hover effects
- ✅ **Gradient buttons** and interactive elements

### Features Not Yet Implemented
- ⏳ Live data integration / API calls
- ⏳ Interactive filters and search functionality
- ⏳ Alert creation modal/form
- ⏳ Responsive mobile sidebar (hamburger menu)
- ⏳ User authentication
- ⏳ Real-time WebSocket updates
- ⏳ Data export functionality
- ⏳ Customizable dashboard widgets

## 🎨 Theme

The dashboard uses a **clean light** color scheme with smooth gradients:

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
webapp/
├── src/
│   ├── components/
│   │   ├── AlertsCard.tsx           # Alerts & Triggers card with icons
│   │   ├── AppShell.tsx             # Main layout wrapper
│   │   ├── Badge.tsx                # Status badge component
│   │   ├── Card.tsx                 # Reusable card container
│   │   ├── Charts.tsx               # Chart.js components (Line, Doughnut, Sparkline)
│   │   ├── CompositeRatingCard.tsx  # Rating with doughnut chart
│   │   ├── DashboardGrid.tsx        # 2-column grid layout
│   │   ├── IndicatorWatchCard.tsx   # Indicators with sparklines
│   │   ├── MarketSnapshotCard.tsx   # Market data with area chart
│   │   ├── Pill.tsx                 # Pill-shaped tag
│   │   ├── Sidebar.tsx              # Left navigation sidebar
│   │   └── TopBar.tsx               # Top header bar
│   ├── App.tsx                      # Main app component
│   ├── index.css                    # Global styles + Tailwind
│   └── main.tsx                     # React entry point
├── ecosystem.config.cjs             # PM2 configuration
├── tailwind.config.js               # Tailwind configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd webapp

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### PM2 Commands (Sandbox Environment)

```bash
pm2 start ecosystem.config.cjs    # Start server
pm2 logs webapp --nostream        # View logs
pm2 restart webapp                # Restart server
pm2 delete webapp                 # Stop and remove
pm2 list                          # List all processes
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Interactive charts and graphs
- **react-chartjs-2** - React wrapper for Chart.js
- **PM2** - Process manager (sandbox only)

## 📋 Recommended Next Steps

1. **Connect Real Data APIs**
   - Integrate CoinGecko or CoinMarketCap API for live BTC prices
   - Add Glassnode or CryptoQuant for on-chain metrics
   - Connect exchange APIs for derivatives data

2. **Enhance Interactivity**
   - Make search bars functional with fuzzy search
   - Add time range selectors for charts (1D, 7D, 1M, etc.)
   - Implement alert creation modal with form validation
   - Add chart zoom and pan capabilities

3. **Mobile Optimization**
   - Convert sidebar to collapsible hamburger menu
   - Stack cards vertically on mobile
   - Optimize touch interactions and gestures
   - Reduce chart complexity on small screens

4. **Advanced Features**
   - Add data export (CSV, JSON, PDF)
   - Implement dashboard customization (drag & drop widgets)
   - Create multi-timeframe analysis views
   - Add portfolio tracking integration

5. **Performance & State**
   - Implement Zustand or Redux for state management
   - Add React Query for data caching
   - Optimize chart rendering with virtualization
   - Add loading skeletons and error boundaries

## 📝 Component Usage

### Creating a New Card with Chart

```tsx
import { Card, CardHeader } from './components/Card';
import { LineChart } from './components/Charts';
import { Badge } from './components/Badge';

const MyCard = () => (
  <Card>
    <CardHeader
      title="My Card Title"
      action={<Badge variant="info">Live</Badge>}
    />
    <div className="h-64">
      <LineChart type="gradient" />
    </div>
  </Card>
);
```

### Using Charts

```tsx
// Gradient area chart
<LineChart type="gradient" />

// Multi-line chart
<LineChart type="multi" />

// Simple sparkline
<MiniSparkline data={[1, 2, 3, 4, 5]} color="#10b981" />

// Doughnut chart
<DoughnutChart />
```

### Using Status Badges

```tsx
<Badge variant="default">Normal</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>
```

## 🎯 Design Principles

- **Clean & Modern**: Light theme with smooth gradients and rounded shapes
- **Visual Hierarchy**: Clear information structure with proper spacing
- **Consistent Spacing**: 24-32px padding, 8px gap rhythm
- **Smooth Interactions**: Hover effects, transitions, and animations
- **Data-First**: Charts and visualizations take center stage
- **Professional Polish**: Attention to details like shadows, borders, and colors
- **Accessible**: High contrast text and clear visual indicators

## 📄 License

MIT

## 🤝 Contributing

This is a UI skeleton project. Feel free to fork and customize for your needs!

---

**Last Updated**: 2025-12-28  
**Status**: ✅ Active (UI complete with Chart.js integration and example visualizations)  
**Version**: 2.0 (Light Theme Redesign)

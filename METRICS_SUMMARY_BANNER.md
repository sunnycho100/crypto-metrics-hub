# Metrics Summary Banner - Landing Page Feature

## Overview

The **MetricsSummaryBanner** component provides a personalized welcome message that shows users what changed in Bitcoin metrics since their last visit. It uses localStorage to track visits and displays meaningful changes in an engaging, visual format.

## Features

- ✅ **First Visit Detection**: Shows a welcome message for new users
- ✅ **Time Since Last Visit**: Human-readable format (e.g., "2 hours ago", "3 days ago")
- ✅ **Metric Change Tracking**: Compares current vs last visit data
- ✅ **Significant Change Detection**: Highlights important changes
- ✅ **Multiple Design Variations**: 4 different UI styles to choose from
- ✅ **Responsive Design**: Mobile-friendly layouts
- ✅ **Automatic Data Persistence**: Uses localStorage

## Technical Stack

### Frontend Component
- **File**: `/src/components/MetricsSummaryBanner.tsx`
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State**: React Hooks (useState, useEffect)

### Data Service
- **File**: `/src/services/lastVisit.ts`
- **Storage**: localStorage API
- **Functions**:
  - `saveLastVisit()` - Save current metrics snapshot
  - `getLastVisit()` - Retrieve last visit data
  - `formatTimeSince()` - Human-readable time formatting
  - `calculateAllChanges()` - Compute metric differences
  - `isSignificantChange()` - Determine importance of changes

### Data Structure

```typescript
interface MetricsSnapshot {
  price: number;
  fearGreedIndex: number;
  fearGreedValue: string;
  volume24h: number;
  marketCap: number;
  priceChange24h: number;
  mvrv?: number;              // Optional on-chain metrics
  activeAddresses?: number;
  hashRate?: number;
}

interface LastVisitData {
  timestamp: number;
  metrics: MetricsSnapshot;
}

interface MetricChange {
  label: string;
  current: number;
  previous: number;
  absoluteChange: number;
  percentageChange: number;
  isSignificant: boolean;
  trend: 'up' | 'down' | 'neutral';
  category: 'price' | 'index' | 'volume' | 'onchain' | 'other';
}
```

## Design Variations

### 1. Card Banner (Recommended - Default)

**Style**: Premium card with gradient header and grid layout  
**Best For**: Maximum visibility and engagement  
**Mobile**: Stacks vertically on small screens

```tsx
return <CardBanner />;
```

**Features**:
- Gradient header (accent → purple)
- "Welcome Back" heading with timestamp
- Badge showing up/down trend counts
- 4-column grid for metric changes
- Highlighted significant changes with borders

**Visual Example**:
```
┌─────────────────────────────────────────────────┐
│ [Gradient Header: Accent → Purple]             │
│ Welcome Back                     ↗ 2 Up ↘ 1 Down │
│ Since your last visit 2 hours ago               │
├─────────────────────────────────────────────────┤
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐       │
│ │ ↗     │ │ ↘     │ │ ↗     │ │ →     │       │
│ │ Price │ │ F&G   │ │ Volume│ │ MCap  │       │
│ │ +2.5% │ │ -4    │ │ +12.3%│ │ +0.8% │       │
│ └───────┘ └───────┘ └───────┘ └───────┘       │
└─────────────────────────────────────────────────┘
```

### 2. Compact Banner

**Style**: Single-line horizontal banner  
**Best For**: Minimal space usage while showing key changes  
**Mobile**: Wraps content on small screens

```tsx
return <CompactBanner />;
```

**Features**:
- Left-aligned icon and text
- Right-aligned metric indicators
- Accent left border
- Shows top 3 significant changes only

**Visual Example**:
```
┌────────────────────────────────────────────────────────┐
│ 📊 Welcome back!            ↗ Price +2.5%  ↘ F&G -4   │
│    Last visit: 2 hours ago  ↗ Volume +12.3%           │
└────────────────────────────────────────────────────────┘
```

### 3. Minimal Banner

**Style**: Inline text with subtle styling  
**Best For**: Clean, unobtrusive presentation  
**Mobile**: Text wraps naturally

```tsx
return <MinimalBanner />;
```

**Features**:
- Inline time display
- Badge for significant changes
- Text-only metric changes
- Minimal visual weight

**Visual Example**:
```
┌────────────────────────────────────────────────────────┐
│ ⏱️ Last visit: 2 hours ago  [2 significant changes]   │
│ Price: +2.5%  F&G: -4  Volume: +12.3%  MCap: +0.8%   │
└────────────────────────────────────────────────────────┘
```

### 4. Hero Banner

**Style**: Large, prominent banner with stats grid  
**Best For**: Maximum impact, ideal for landing page  
**Mobile**: 2-column grid on small screens

```tsx
return <HeroBanner />;
```

**Features**:
- Large heading "Markets Since You Left"
- Animated pulse indicator
- Big number showing total changes
- 4-column grid with card-style metrics
- Emphasized significant changes with shadows

**Visual Example**:
```
┌─────────────────────────────────────────────────────┐
│ Markets Since You Left                    3          │
│ ● Last checked 2 hours ago             Notable       │
│                                         Changes       │
├─────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│ │ Price    │ │ F&G Index│ │ Volume   │ │ Mkt Cap  ││
│ │ +2.5% ↗  │ │ -4 ↘     │ │ +12.3% ↗ │ │ +0.8% ↗  ││
│ │ $102,450 │ │ 43       │ │ 28.5B    │ │ $1.98T   ││
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘│
└─────────────────────────────────────────────────────┘
```

### 5. Welcome Banner (First Visit)

**Style**: Friendly welcome message  
**Shown**: Only on first visit (no localStorage data)

```tsx
if (isFirstVisit) {
  return <WelcomeBanner />;
}
```

**Visual Example**:
```
┌─────────────────────────────────────────────────────┐
│ 👋  Welcome to BTC Metrics Hub!                     │
│     Track Bitcoin metrics in real-time.             │
│     We'll show you what's changed since your        │
│     last visit on your next visit.                  │
└─────────────────────────────────────────────────────┘
```

## Usage

### Basic Integration

The component is already integrated into the main App at the top of the dashboard:

```tsx
// src/App.tsx
import { MetricsSummaryBanner } from './components';

function App() {
  return (
    <main>
      <MetricsSummaryBanner />
      <KPICards />
      {/* ... rest of dashboard */}
    </main>
  );
}
```

### Switching Design Variations

Edit `/src/components/MetricsSummaryBanner.tsx` and change the return statement:

```tsx
// Main render - choose which design variation to use
if (isFirstVisit) {
  return <WelcomeBanner />;
}

// Switch between design variations here:
// return <CompactBanner />;     // Option 1: Minimal space
return <CardBanner />;           // Option 2: Default (Recommended)
// return <MinimalBanner />;     // Option 3: Ultra minimal
// return <HeroBanner />;        // Option 4: Maximum impact
```

## Connecting Real Data (Next Steps)

Currently, the component uses mock data. To connect real live data:

### Option 1: Pass Props

```tsx
// App.tsx
<MetricsSummaryBanner 
  currentMetrics={{
    price: livePrice,
    fearGreedIndex: liveFearGreed,
    volume24h: liveVolume,
    marketCap: liveMarketCap,
    priceChange24h: livePriceChange,
  }}
/>
```

### Option 2: Use Context (Recommended)

```tsx
// Create MetricsContext
export const MetricsContext = createContext<MetricsSnapshot | null>(null);

// In App.tsx
<MetricsContext.Provider value={currentMetrics}>
  <MetricsSummaryBanner />
</MetricsContext.Provider>

// In MetricsSummaryBanner.tsx
const currentMetrics = useContext(MetricsContext);
```

### Option 3: Custom Hook

```tsx
// hooks/useMetrics.ts
export function useCurrentMetrics() {
  const [metrics, setMetrics] = useState<MetricsSnapshot | null>(null);
  
  useEffect(() => {
    // Fetch live data from APIs
    fetchLiveMetrics().then(setMetrics);
  }, []);
  
  return metrics;
}

// In MetricsSummaryBanner.tsx
const currentMetrics = useCurrentMetrics();
```

## Configuration

### Significance Thresholds

Adjust what constitutes a "significant" change:

```tsx
// src/services/lastVisit.ts

// Price changes
isSignificant: isSignificantChange(priceChange, 1), // 1% threshold

// Fear & Greed Index
isSignificant: Math.abs(fgChange) >= 5, // 5 point threshold

// Volume changes
isSignificant: isSignificantChange(volumeChange, 10), // 10% threshold
```

### Time Format Customization

Modify the time display format in `/src/services/lastVisit.ts`:

```typescript
export function formatTimeSince(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(diff / 604800000);
  const months = Math.floor(diff / 2592000000);

  // Customize these messages:
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  // ... etc
}
```

## Testing the Feature

### Manual Testing Steps

1. **First Visit Test**:
   - Clear localStorage: `localStorage.clear()`
   - Refresh page
   - Should see "Welcome to BTC Metrics Hub!" banner

2. **Change Detection Test**:
   - Visit the page once
   - Manually edit localStorage:
     ```javascript
     const data = JSON.parse(localStorage.getItem('btc_metrics_last_visit'));
     data.metrics.price = 95000; // Change price
     data.timestamp = Date.now() - 7200000; // 2 hours ago
     localStorage.setItem('btc_metrics_last_visit', JSON.stringify(data));
     ```
   - Refresh page
   - Should see price change indicator

3. **Time Display Test**:
   - Edit timestamp to different values:
     ```javascript
     // Just now
     data.timestamp = Date.now();
     
     // 5 minutes ago
     data.timestamp = Date.now() - 300000;
     
     // 2 hours ago
     data.timestamp = Date.now() - 7200000;
     
     // 3 days ago
     data.timestamp = Date.now() - 259200000;
     ```

### Console Commands for Testing

```javascript
// View current stored data
JSON.parse(localStorage.getItem('btc_metrics_last_visit'))

// Clear all visit data (reset to first visit)
localStorage.removeItem('btc_metrics_last_visit')

// Manually set last visit to 1 day ago with different prices
localStorage.setItem('btc_metrics_last_visit', JSON.stringify({
  timestamp: Date.now() - 86400000,
  metrics: {
    price: 98000,
    fearGreedIndex: 50,
    fearGreedValue: 'Neutral',
    volume24h: 25.0,
    marketCap: 1.90,
    priceChange24h: 1.2
  }
}))
```

## Future Enhancements

### Planned Features

1. **Animation on Load**: Add smooth fade-in animation
2. **Dismiss Functionality**: Allow users to minimize/dismiss banner
3. **Settings Panel**: Let users choose preferred design variation
4. **More Metrics**: Add support for tracking more on-chain metrics
5. **Historical Comparison**: Compare against 1 week ago, 1 month ago
6. **Export Changes**: Download report of changes since last visit
7. **Notifications**: Optional browser notifications for major changes
8. **Mobile Optimization**: Swipeable cards on mobile devices

### Integration Opportunities

- **Email Digest**: Send summary email when significant changes occur
- **Alerts System**: Connect with AlertsCard for personalized alerts
- **Social Sharing**: Share interesting changes on social media
- **Portfolio Tracking**: Compare changes against user's portfolio

## Performance Considerations

- **localStorage Limits**: ~5-10MB limit, current usage <1KB
- **Render Performance**: Memoize expensive calculations if needed
- **Mobile Data**: All data stored locally, no extra API calls
- **Update Frequency**: Currently saves on every visit, consider throttling

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **localStorage**: Required (available since IE8+)
- **Fallback**: Shows welcome message if localStorage unavailable

## Accessibility

- **Semantic HTML**: Uses proper heading hierarchy
- **Color Contrast**: Meets WCAG AA standards
- **Screen Readers**: All metrics properly labeled
- **Keyboard Navigation**: Fully accessible without mouse

---

**Created**: 2026-01-18  
**Status**: ✅ Implemented with 4 design variations  
**Next Step**: Connect real-time data from existing API services

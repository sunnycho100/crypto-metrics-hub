/**
 * Debug utilities for testing the MetricsSummaryBanner
 * Open browser console and use these functions to test different scenarios
 */

// Test 1: Simulate a visit from 2 hours ago with different metrics
window.testLastVisit2HoursAgo = () => {
  const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000); // 2 hours in milliseconds
  
  const mockLastVisit = {
    timestamp: twoHoursAgo,
    metrics: {
      price: 99500,
      fearGreedIndex: 50,
      fearGreedValue: 'Neutral',
      volume24h: 25.0,
      marketCap: 1.95,
      priceChange24h: 1.2
    }
  };
  
  localStorage.setItem('btc_metrics_last_visit', JSON.stringify(mockLastVisit));
  console.log('✅ Set last visit to 2 hours ago with price $99,500');
  console.log('🔄 Refresh the page to see the changes');
};

// Test 2: Simulate a visit from 3 days ago with bigger changes
window.testLastVisit3DaysAgo = () => {
  const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
  
  const mockLastVisit = {
    timestamp: threeDaysAgo,
    metrics: {
      price: 95000,
      fearGreedIndex: 65,
      fearGreedValue: 'Greed',
      volume24h: 22.0,
      marketCap: 1.85,
      priceChange24h: -2.5
    }
  };
  
  localStorage.setItem('btc_metrics_last_visit', JSON.stringify(mockLastVisit));
  console.log('✅ Set last visit to 3 days ago with price $95,000');
  console.log('🔄 Refresh the page to see the changes');
};

// Test 3: Simulate a visit from 1 week ago with major changes
window.testLastVisit1WeekAgo = () => {
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  
  const mockLastVisit = {
    timestamp: oneWeekAgo,
    metrics: {
      price: 88000,
      fearGreedIndex: 25,
      fearGreedValue: 'Fear',
      volume24h: 18.5,
      marketCap: 1.72,
      priceChange24h: -5.8
    }
  };
  
  localStorage.setItem('btc_metrics_last_visit', JSON.stringify(mockLastVisit));
  console.log('✅ Set last visit to 1 week ago with price $88,000');
  console.log('🔄 Refresh the page to see the changes');
};

// Test 4: Reset to first visit (clear localStorage)
window.testFirstVisit = () => {
  localStorage.removeItem('btc_metrics_last_visit');
  console.log('✅ Cleared last visit data');
  console.log('🔄 Refresh the page to see the welcome banner');
};

// Test 5: View current stored data
window.viewLastVisit = () => {
  const stored = localStorage.getItem('btc_metrics_last_visit');
  if (stored) {
    const data = JSON.parse(stored);
    console.log('📊 Current Last Visit Data:', {
      timestamp: new Date(data.timestamp).toLocaleString(),
      timeSince: formatTimeSince(data.timestamp),
      metrics: data.metrics
    });
  } else {
    console.log('❌ No last visit data stored (first visit)');
  }
};

// Helper function
function formatTimeSince(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(diff / 604800000);

  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (seconds > 30) return `${seconds} seconds ago`;
  return 'just now';
}

// Print instructions
console.log(`
╔════════════════════════════════════════════════════════╗
║  🧪 MetricsSummaryBanner Test Utilities Loaded        ║
╚════════════════════════════════════════════════════════╝

Available test functions:

1. testLastVisit2HoursAgo()  - Set last visit to 2 hours ago
2. testLastVisit3DaysAgo()   - Set last visit to 3 days ago  
3. testLastVisit1WeekAgo()   - Set last visit to 1 week ago
4. testFirstVisit()          - Clear data (first visit)
5. viewLastVisit()           - View current stored data

Example usage:
  testLastVisit2HoursAgo()   // Then refresh page
  viewLastVisit()            // See what's stored

`);

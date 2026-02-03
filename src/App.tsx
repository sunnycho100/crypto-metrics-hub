import { useEffect } from 'react';
import {
  Header,
  KPICards,
  PriceChartCard,
  OnChainMetrics,
  DerivativesTable,
  CompositeHealthCard,
  AlertsCard,
  MarketPulseCard,
  FearGreedCard,
  ContactFooter,
  MetricsSummaryBanner
} from './components';
import LiquidationHeatmapCard from './components/LiquidationHeatmapCard';
import { MetricsProvider, useMetrics } from './contexts/MetricsContext';
import { fetchBTCStats } from './services/coinbase';
import { fetchFearGreedIndex } from './services/feargreed';
import type { MetricsSnapshot } from './services/lastVisit';

function DashboardContent() {
  const { updateMetrics } = useMetrics();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Fetch BTC stats first (faster API)
        const btcStats = await fetchBTCStats();
        
        // Parse BTC stats
        const price = parseFloat(btcStats.last);
        const volume24h = parseFloat(btcStats.volume);
        const priceChange24h = ((parseFloat(btcStats.last) - parseFloat(btcStats.open)) / parseFloat(btcStats.open)) * 100;
        const estimatedMarketCap = (21000000 * price) / 1000000000000;

        // Try to fetch Fear & Greed with timeout
        let fgValue = 43; // Default fallback
        let fgClassification = 'Fear';
        
        try {
          const fearGreedPromise = fetchFearGreedIndex(1);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Fear & Greed API timeout')), 5000)
          );
          
          const fearGreedData = await Promise.race([fearGreedPromise, timeoutPromise]) as any;
          fgValue = parseInt(fearGreedData.data[0].value);
          fgClassification = fearGreedData.data[0].value_classification;
          console.log('✅ Fear & Greed data fetched:', { fgValue, fgClassification });
        } catch (fgError) {
          console.warn('⚠️ Fear & Greed API slow/failed, using fallback:', fgError);
          // Continue with fallback values
        }

        const metricsSnapshot: MetricsSnapshot = {
          price,
          fearGreedIndex: fgValue,
          fearGreedValue: fgClassification,
          volume24h: volume24h / 1000000000, // Convert to billions
          marketCap: estimatedMarketCap,
          priceChange24h,
        };

        updateMetrics(metricsSnapshot);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        // Fallback to mock data if APIs fail
        const fallbackMetrics: MetricsSnapshot = {
          price: 102450,
          fearGreedIndex: 43,
          fearGreedValue: 'Fear',
          volume24h: 28.5,
          marketCap: 1.98,
          priceChange24h: 2.5,
        };
        updateMetrics(fallbackMetrics);
      }
    };

    // Fetch immediately
    fetchMetrics();

    // Refresh every 60 seconds
    const interval = setInterval(fetchMetrics, 60000);

    return () => clearInterval(interval);
  }, [updateMetrics]);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased selection:bg-primary selection:text-white overflow-x-hidden">
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header />
        
        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 xl:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6 relative z-0">
          {/* Welcome Back / Summary Banner */}
          <MetricsSummaryBanner />
          
          {/* KPI Cards Row */}
          <KPICards />
          
          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 relative z-0">
            {/* Left Column - 8 cols */}
            <div className="xl:col-span-8 flex flex-col gap-6 relative z-0">
              {/* Price Chart */}
              <PriceChartCard />
              
              {/* Liquidation Heatmap */}
              <LiquidationHeatmapCard />
              
              {/* On-Chain Metrics Row */}
              <OnChainMetrics />
              
              {/* Derivatives Table */}
              <DerivativesTable />
            </div>
            
            {/* Right Column - 4 cols */}
            <div className="xl:col-span-4 flex flex-col gap-6 relative z-0">
              {/* Fear & Greed Index */}
              <FearGreedCard />
              
              {/* Composite Health */}
              <CompositeHealthCard />
              
              {/* Alerts */}
              <AlertsCard />
              
              {/* Market Pulse */}
              <MarketPulseCard />
            </div>
          </div>
          
          {/* Contact & Support Footer */}
          <ContactFooter />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <MetricsProvider>
      <DashboardContent />
    </MetricsProvider>
  );
}

export default App;

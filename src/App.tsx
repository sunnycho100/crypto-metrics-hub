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

function App() {
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

export default App;

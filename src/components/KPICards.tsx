import React from 'react';
import { ModalCard, ModalRow } from './ModalCard';
import { MetricCard } from './Card';

export const KPICards: React.FC = () => {
  const kpiData = [
    {
      id: 'price',
      title: 'Bitcoin Price',
      value: '$64,231.50',
      change: '+2.45%',
      changeType: 'positive' as const,
      icon: 'attach_money',
      iconBgColor: 'bg-primary/10',
      iconColor: 'text-primary',
      modalTitle: 'Price Details',
      modalContent: (
        <>
          <ModalRow label="24h High" value="$65,102.40" />
          <ModalRow label="24h Low" value="$63,200.15" />
          <ModalRow label="All Time High" value="$73,750.07" subValue="-12.8%" />
        </>
      )
    },
    {
      id: 'volume',
      title: '24h Volume',
      value: '$34.1B',
      change: '-5.2%',
      changeType: 'negative' as const,
      icon: 'bar_chart',
      iconBgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
      modalTitle: 'Volume Analytics',
      modalContent: (
        <>
          <ModalRow label="Spot Volume" value="$12.1B" />
          <ModalRow label="Derivatives Vol" value="$22.0B" />
          <ModalRow label="Binance Share" value="45.2%" valueColor="success" />
        </>
      )
    },
    {
      id: 'mcap',
      title: 'Market Cap',
      value: '$1.24T',
      change: '+1.8%',
      changeType: 'positive' as const,
      icon: 'pie_chart',
      iconBgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      modalTitle: 'Market Dominance',
      modalContent: (
        <>
          <ModalRow label="BTC Dominance" value="54.2%" />
          <ModalRow label="FDV" value="$1.35T" />
          <ModalRow label="Circulating Supply" value="19.7M BTC" />
        </>
      )
    },
    {
      id: 'oi',
      title: 'Open Interest',
      value: '$14.8B',
      change: '+4.2%',
      changeType: 'positive' as const,
      icon: 'candlestick_chart',
      iconBgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-500',
      modalTitle: 'Derivatives Data',
      modalContent: (
        <>
          <ModalRow label="Long/Short Ratio" value="1.04" valueColor="success" />
          <ModalRow label="Top Exchange" value="Binance ($4.2B)" />
          <ModalRow label="1h Change" value="+0.5%" valueColor="success" />
        </>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-0">
      {kpiData.map((kpi) => (
        <ModalCard
          key={kpi.id}
          id={kpi.id}
          modalTitle={kpi.modalTitle}
          modalContent={kpi.modalContent}
        >
          <MetricCard
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            changeType={kpi.changeType}
            icon={kpi.icon}
            iconBgColor={kpi.iconBgColor}
            iconColor={kpi.iconColor}
          />
        </ModalCard>
      ))}
    </div>
  );
};

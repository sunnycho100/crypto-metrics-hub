import React from 'react';
import { ModalCard, ModalRow } from './ModalCard';
import { SmallMetricCard } from './Card';

export const OnChainMetrics: React.FC = () => {
  const metricsData = [
    {
      id: 'mvrv',
      title: 'MVRV Ratio',
      value: '1.84',
      change: 'Neutral',
      changeType: 'neutral' as const,
      barData: [40, 60, 30, 70, 50],
      barColor: 'bg-primary',
      modalTitle: 'On-Chain Valuation',
      modalContent: (
        <>
          <ModalRow label="Z-Score" value="1.2" />
          <ModalRow label="Realized Price" value="$29,500" />
          <ModalRow label="STH MVRV" value="1.02" />
        </>
      )
    },
    {
      id: 'active',
      title: 'Active Addresses',
      value: '892K',
      change: '↑ 5%',
      changeType: 'positive' as const,
      barData: [20, 30, 25, 45, 60],
      barColor: 'bg-success',
      modalTitle: 'Network Activity',
      modalContent: (
        <>
          <ModalRow label="New Addresses" value="340K" />
          <ModalRow label="Zero Balance" value="45M" />
          <ModalRow label="Tx Count (24h)" value="450K" valueColor="success" />
        </>
      )
    },
    {
      id: 'hash',
      title: 'Hash Rate',
      value: '580 EH/s',
      change: '↑ 1%',
      changeType: 'positive' as const,
      barData: [70, 75, 72, 80, 85],
      barColor: 'bg-purple-500',
      modalTitle: 'Mining Stats',
      modalContent: (
        <>
          <ModalRow label="Difficulty" value="84.02 T" />
          <ModalRow label="Next Adjustment" value="+2.1% (Est)" valueColor="success" />
          <ModalRow label="Miner Rev (24h)" value="$34.2M" />
        </>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-0">
      {metricsData.map((metric) => (
        <ModalCard
          key={metric.id}
          id={metric.id}
          modalTitle={metric.modalTitle}
          modalContent={metric.modalContent}
        >
          <SmallMetricCard
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
            barData={metric.barData}
            barColor={metric.barColor}
          />
        </ModalCard>
      ))}
    </div>
  );
};

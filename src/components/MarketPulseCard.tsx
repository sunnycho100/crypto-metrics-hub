import React from 'react';
import { Card } from './Card';
import { IconButton } from './Button';

interface PulseItem {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  time: string;
  category: string;
}

export const MarketPulseCard: React.FC = () => {
  const pulseItems: PulseItem[] = [
    {
      icon: 'water',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      title: 'Whale Alert: 5,000 BTC transferred from Coinbase to unknown wallet.',
      time: '10 mins ago',
      category: 'On-Chain'
    },
    {
      icon: 'psychology',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
      title: 'Long Liquidations spike to $45M in last hour as price dips.',
      time: '32 mins ago',
      category: 'Derivatives'
    },
    {
      icon: 'newspaper',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-500',
      title: 'SEC delays decision on Bitcoin ETF options trading.',
      time: '1 hour ago',
      category: 'News'
    }
  ];

  return (
    <Card className="flex-1 relative z-0">
      <div className="p-4 lg:px-6 border-b border-slate-200 dark:border-[#3b4754] flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Market Pulse (IN PROGRESS)</h3>
        <IconButton icon="refresh" />
      </div>
      
      <div className="flex flex-col divide-y divide-slate-200 dark:divide-[#3b4754]">
        {pulseItems.map((item, index) => (
          <div key={index} className="p-4 flex gap-3 hover:bg-slate-50 dark:hover:bg-[#202933]/50 transition-colors cursor-pointer">
            <div className={`h-10 w-10 shrink-0 rounded ${item.iconBg} flex items-center justify-center ${item.iconColor}`}>
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">{item.title}</p>
              <p className="text-xs text-text-secondary">{item.time} • {item.category}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 mt-auto">
        <button className="w-full text-center text-sm font-medium text-text-secondary hover:text-slate-900 dark:hover:text-white transition-colors">
          View All Updates
        </button>
      </div>
    </Card>
  );
};

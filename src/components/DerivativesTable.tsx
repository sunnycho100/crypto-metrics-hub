import React from 'react';
import { Card } from './Card';
import { TextButton } from './Button';

interface Exchange {
  name: string;
  letter: string;
  letterBg: string;
  letterColor: string;
  pair: string;
  price: string;
  volume: string;
  fundingRate: string;
  fundingColor: string;
  openInterest: string;
}

export const DerivativesTable: React.FC = () => {
  const exchanges: Exchange[] = [
    {
      name: 'Binance',
      letter: 'B',
      letterBg: 'bg-yellow-500/20',
      letterColor: 'text-yellow-500',
      pair: 'BTCUSDT',
      price: '$64,240.00',
      volume: '$12.4B',
      fundingRate: '0.0100%',
      fundingColor: 'text-success',
      openInterest: '$4.2B'
    },
    {
      name: 'OKX',
      letter: 'O',
      letterBg: 'bg-slate-500/20',
      letterColor: 'text-slate-400',
      pair: 'BTC-USDT-SWAP',
      price: '$64,235.50',
      volume: '$5.1B',
      fundingRate: '0.0098%',
      fundingColor: 'text-success',
      openInterest: '$1.8B'
    },
    {
      name: 'Deribit',
      letter: 'D',
      letterBg: 'bg-primary/20',
      letterColor: 'text-primary',
      pair: 'BTC-PERPETUAL',
      price: '$64,250.00',
      volume: '$1.2B',
      fundingRate: '0.0102%',
      fundingColor: 'text-success',
      openInterest: '$890M'
    },
    {
      name: 'Bybit',
      letter: 'B',
      letterBg: 'bg-green-500/20',
      letterColor: 'text-green-500',
      pair: 'BTCUSDT',
      price: '$64,238.10',
      volume: '$3.8B',
      fundingRate: '0.0089%',
      fundingColor: 'text-success',
      openInterest: '$2.1B'
    }
  ];

  return (
    <Card className="relative z-0">
      <div className="flex items-center justify-between p-4 lg:px-6 border-b border-slate-200 dark:border-[#3b4754]">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Derivatives Markets (IN PROGRESS)</h3>
        <TextButton>View All</TextButton>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-[#202933] text-text-secondary font-medium">
            <tr>
              <th className="px-6 py-3">Exchange</th>
              <th className="px-6 py-3">Pair</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">24h Vol</th>
              <th className="px-6 py-3">Funding Rate</th>
              <th className="px-6 py-3 text-right">Open Interest</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-[#3b4754]">
            {exchanges.map((exchange, index) => (
              <tr key={index} className="hover:bg-slate-50 dark:hover:bg-[#202933]/50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${exchange.letterBg} flex items-center justify-center ${exchange.letterColor} text-xs font-bold`}>
                    {exchange.letter}
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white">{exchange.name}</span>
                </td>
                <td className="px-6 py-4 text-text-secondary">{exchange.pair}</td>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{exchange.price}</td>
                <td className="px-6 py-4 text-text-secondary">{exchange.volume}</td>
                <td className={`px-6 py-4 ${exchange.fundingColor}`}>{exchange.fundingRate}</td>
                <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-white">{exchange.openInterest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

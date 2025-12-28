import React, { useState } from 'react';
import { Card, CardHeader } from './Card';
import { TimeButton } from './Button';
import { PriceChart } from './Charts';

export const PriceChartCard: React.FC = () => {
  const [activeTime, setActiveTime] = useState('1D');
  const timeOptions = ['1H', '4H', '1D', '1W'];

  return (
    <Card className="relative z-0">
      <CardHeader
        title="Price Action & Volume"
        subtitle="BTC/USD - Aggregated Spot"
        action={
          <>
            {timeOptions.map((time) => (
              <TimeButton
                key={time}
                label={time}
                isActive={activeTime === time}
                onClick={() => setActiveTime(time)}
              />
            ))}
          </>
        }
      />
      <PriceChart />
    </Card>
  );
};

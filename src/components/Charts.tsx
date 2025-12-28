import React from 'react';

export const PriceChart: React.FC = () => {
  return (
    <div className="relative h-[400px] w-full p-6 bg-gradient-to-b from-transparent to-primary/5">
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 300">
        {/* Grid lines */}
        <line stroke="#3b4754" strokeDasharray="4 4" strokeWidth="0.5" x1="0" x2="800" y1="50" y2="50" />
        <line stroke="#3b4754" strokeDasharray="4 4" strokeWidth="0.5" x1="0" x2="800" y1="125" y2="125" />
        <line stroke="#3b4754" strokeDasharray="4 4" strokeWidth="0.5" x1="0" x2="800" y1="200" y2="200" />
        <line stroke="#3b4754" strokeDasharray="4 4" strokeWidth="0.5" x1="0" x2="800" y1="275" y2="275" />
        
        {/* Volume bars */}
        <g opacity="0.2">
          <rect fill="#0bda5b" height="80" width="10" x="10" y="220" />
          <rect fill="#ef4444" height="50" width="10" x="30" y="250" />
          <rect fill="#0bda5b" height="100" width="10" x="50" y="200" />
          <rect fill="#0bda5b" height="60" width="10" x="70" y="240" />
          <rect fill="#ef4444" height="40" width="10" x="90" y="260" />
          <rect fill="#0bda5b" height="120" width="10" x="110" y="180" />
          <rect fill="#ef4444" height="70" width="10" x="130" y="230" />
          <rect fill="#0bda5b" height="50" width="10" x="150" y="250" />
          <rect fill="#0bda5b" height="90" width="10" x="170" y="210" />
          <rect fill="#ef4444" height="110" width="10" x="190" y="190" />
          <path d="M210 300 L210 240 L790 240 L790 300 Z" fill="#3b4754" opacity="0.5" />
        </g>
        
        {/* Price line */}
        <path
          d="M0,250 C50,240 100,200 150,220 S250,150 300,180 S400,100 450,120 S550,50 600,80 S700,20 800,40"
          fill="none"
          stroke="#137fec"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        
        {/* Gradient fill */}
        <defs>
          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#137fec" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#137fec" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,250 C50,240 100,200 150,220 S250,150 300,180 S400,100 450,120 S550,50 600,80 S700,20 800,40 V300 H0 Z"
          fill="url(#chartGradient)"
        />
        
        {/* Current price dot */}
        <circle cx="800" cy="40" fill="#137fec" r="4" stroke="white" strokeWidth="2" />
      </svg>
      
      {/* Tooltip */}
      <div className="absolute top-10 left-[60%] bg-surface-dark border border-[#3b4754] rounded-lg p-3 shadow-lg pointer-events-none">
        <p className="text-xs text-text-secondary mb-1">Oct 12, 14:00</p>
        <p className="text-sm font-bold text-white">$63,840.20</p>
        <p className="text-xs text-success">+1.2%</p>
      </div>
      
      {/* Time label */}
      <div className="absolute bottom-4 right-6 text-xs text-text-secondary font-medium">Local Time</div>
    </div>
  );
};

interface MiniBarChartProps {
  data: number[];
  color: string;
}

export const MiniBarChart: React.FC<MiniBarChartProps> = ({ data, color }) => {
  return (
    <div className="h-8 w-full flex items-end gap-0.5 mt-auto">
      {data.map((height, index) => (
        <div
          key={index}
          className={`${color} w-full rounded-sm`}
          style={{ height: `${height}%`, opacity: 0.4 + (index * 0.15) }}
        />
      ))}
    </div>
  );
};

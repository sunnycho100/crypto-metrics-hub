import React from 'react';

interface PlaceholderChartProps {
  height?: string;
  className?: string;
}

export const PlaceholderChart: React.FC<PlaceholderChartProps> = ({ 
  height = '200px',
  className = '' 
}) => {
  return (
    <div 
      className={`relative rounded-lg border border-border bg-[rgba(255,255,255,0.02)] ${className}`}
      style={{ height }}
    >
      {/* Grid lines */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-4">
        {[...Array(32)].map((_, i) => (
          <div 
            key={i}
            className="border-r border-b border-[rgba(255,255,255,0.03)]"
          />
        ))}
      </div>
      
      {/* Placeholder text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-muted text-sm">Chart Placeholder</span>
      </div>
    </div>
  );
};

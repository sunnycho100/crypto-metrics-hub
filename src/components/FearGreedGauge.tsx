import React from 'react';

interface FearGreedGaugeProps {
  value: number; // 0-100
  size?: 'small' | 'medium' | 'large';
  showValue?: boolean;
  showLabel?: boolean;
}

export const FearGreedGauge: React.FC<FearGreedGaugeProps> = ({ 
  value, 
  size = 'medium',
  showValue = true,
  showLabel = true
}) => {
  // Clamp value between 0-100
  const clampedValue = Math.max(0, Math.min(100, value));
  
  // Size configurations
  const sizeConfig = {
    small: { diameter: 120, strokeWidth: 12, fontSize: '18px', labelSize: 'text-xs' },
    medium: { diameter: 180, strokeWidth: 16, fontSize: '32px', labelSize: 'text-sm' },
    large: { diameter: 240, strokeWidth: 20, fontSize: '42px', labelSize: 'text-base' }
  };
  
  const config = sizeConfig[size];
  const radius = (config.diameter - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = config.diameter / 2;
  
  // Calculate arc length (we use 270 degrees, leaving 90 degrees gap at bottom)
  const arcLength = (circumference * 270) / 360;
  const valueOffset = arcLength - (clampedValue / 100) * arcLength;
  
  // Start angle: -225 degrees (bottom left)
  const startAngle = -225;
  
  // Determine color and classification
  const getColorAndLabel = (val: number): { color: string; label: string; glow: string } => {
    if (val <= 24) return { 
      color: '#ef4444', 
      label: 'Extreme Fear',
      glow: 'rgba(239, 68, 68, 0.4)'
    };
    if (val <= 49) return { 
      color: '#f97316', 
      label: 'Fear',
      glow: 'rgba(249, 115, 22, 0.4)'
    };
    if (val <= 74) return { 
      color: '#84cc16', 
      label: 'Greed',
      glow: 'rgba(132, 204, 22, 0.4)'
    };
    return { 
      color: '#0bda5b', 
      label: 'Extreme Greed',
      glow: 'rgba(11, 218, 91, 0.4)'
    };
  };
  
  const { color, label, glow } = getColorAndLabel(clampedValue);
  
  // Create gradient for arc background
  const gradientId = `gauge-gradient-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: config.diameter, height: config.diameter }}>
        <svg 
          width={config.diameter} 
          height={config.diameter}
          className="transform -rotate-90"
        >
          <defs>
            {/* Gradient for background arc */}
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
              <stop offset="25%" stopColor="#f97316" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#eab308" stopOpacity="0.3" />
              <stop offset="75%" stopColor="#84cc16" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0bda5b" stopOpacity="0.3" />
            </linearGradient>
            
            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Background arc (gray) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            className="text-slate-200 dark:text-slate-700"
            transform={`rotate(${startAngle} ${center} ${center})`}
          />
          
          {/* Colorful gradient background arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={config.strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            transform={`rotate(${startAngle} ${center} ${center})`}
          />
          
          {/* Value arc with glow */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={config.strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={valueOffset}
            strokeLinecap="round"
            transform={`rotate(${startAngle} ${center} ${center})`}
            filter="url(#glow)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Center value display */}
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div 
              className="font-black tracking-tight transition-colors duration-500"
              style={{ fontSize: config.fontSize, color }}
            >
              {clampedValue}
            </div>
            <div className="text-xs text-text-secondary font-medium uppercase tracking-wider mt-1">
              / 100
            </div>
          </div>
        )}
        
        {/* Decorative glow effect */}
        <div 
          className="absolute inset-0 rounded-full blur-2xl pointer-events-none transition-all duration-500"
          style={{ 
            background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
            transform: 'scale(0.8)'
          }}
        />
      </div>
      
      {/* Label */}
      {showLabel && (
        <div className="flex flex-col items-center gap-1">
          <div 
            className={`font-bold ${config.labelSize} px-3 py-1 rounded-full transition-all duration-500`}
            style={{ 
              color,
              backgroundColor: `${color}15`,
              border: `1.5px solid ${color}40`
            }}
          >
            {label}
          </div>
        </div>
      )}
    </div>
  );
};

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { MetricsSnapshot } from '../services/lastVisit';

interface MetricsContextValue {
  metrics: MetricsSnapshot | null;
  isLoading: boolean;
  error: string | null;
  updateMetrics: (metrics: MetricsSnapshot) => void;
}

const MetricsContext = createContext<MetricsContextValue | undefined>(undefined);

interface MetricsProviderProps {
  children: ReactNode;
}

export function MetricsProvider({ children }: MetricsProviderProps) {
  const [metrics, setMetrics] = useState<MetricsSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateMetrics = (newMetrics: MetricsSnapshot) => {
    setMetrics(newMetrics);
    setIsLoading(false);
    setError(null);
  };

  return (
    <MetricsContext.Provider value={{ metrics, isLoading, error, updateMetrics }}>
      {children}
    </MetricsContext.Provider>
  );
}

export function useMetrics() {
  const context = useContext(MetricsContext);
  if (context === undefined) {
    throw new Error('useMetrics must be used within a MetricsProvider');
  }
  return context;
}

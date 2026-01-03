import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChartContextType {
  activeTimeframe: string;
  setActiveTimeframe: (timeframe: string) => void;
}

const ChartContext = createContext<ChartContextType | undefined>(undefined);

export const useChart = () => {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used within a ChartProvider');
  }
  return context;
};

interface ChartProviderProps {
  children: ReactNode;
}

export const ChartProvider: React.FC<ChartProviderProps> = ({ children }) => {
  const [activeTimeframe, setActiveTimeframe] = useState('1D'); // Default timeframe

  const value = {
    activeTimeframe,
    setActiveTimeframe,
  };

  return (
    <ChartContext.Provider value={value}>
      {children}
    </ChartContext.Provider>
  );
};
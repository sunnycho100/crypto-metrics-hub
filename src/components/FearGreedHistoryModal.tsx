import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchFearGreedHistory, type FearGreedData } from '../services/feargreed';
import { TimeButton } from './Button';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface FearGreedHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentValue: number;
  currentClassification: string;
}

const TIME_OPTIONS = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: '1Y', days: 365 },
];

export const FearGreedHistoryModal: React.FC<FearGreedHistoryModalProps> = ({
  isOpen,
  onClose,
  currentValue,
  currentClassification,
}) => {
  const [activeTimeIndex, setActiveTimeIndex] = useState(1); // Default to 30D
  const [historyData, setHistoryData] = useState<FearGreedData[]>([]);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 });
      fetchHistory();
    }
  }, [isOpen, activeTimeIndex]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const days = TIME_OPTIONS[activeTimeIndex].days;
      const response = await fetchFearGreedHistory(days);
      setHistoryData(response.data);
    } catch (error) {
      console.error('Failed to fetch Fear & Greed history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!modalRef.current) return;
    const rect = modalRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      setPosition({
        x: e.clientX - centerX - dragOffset.x + (modalRef.current?.offsetWidth || 0) / 2,
        y: e.clientY - centerY - dragOffset.y + (modalRef.current?.offsetHeight || 0) / 2,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Prepare chart data
  const chartData = {
    labels: historyData.map((d) => {
      const date = new Date(parseInt(d.timestamp) * 1000);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }).reverse(),
    datasets: [
      {
        label: 'Fear & Greed Index',
        data: historyData.map((d) => parseInt(d.value)).reverse(),
        borderColor: '#137fec',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(19, 127, 236, 0.2)');
          gradient.addColorStop(1, 'rgba(19, 127, 236, 0)');
          return gradient;
        },
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#137fec',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(28, 34, 41, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#9dabb9',
        borderColor: '#3b4754',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            if (value === null || value === undefined) return '';
            let classification = '';
            if (value <= 24) classification = 'Extreme Fear';
            else if (value <= 49) classification = 'Fear';
            else if (value <= 74) classification = 'Greed';
            else classification = 'Extreme Greed';
            return `${value} - ${classification}`;
          },
        },
      },
    },
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          color: 'rgba(59, 71, 84, 0.3)',
        },
        ticks: {
          color: '#9dabb9',
          maxRotation: 0,
          autoSkipPadding: 20,
        },
      },
      y: {
        min: 0,
        max: 100,
        border: {
          display: false,
        },
        grid: {
          color: 'rgba(59, 71, 84, 0.3)',
        },
        ticks: {
          color: '#9dabb9',
          stepSize: 25,
        },
      },
    },
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-default"
        style={{ zIndex: 99998 }}
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className="fixed w-[90%] max-w-4xl max-h-[85vh] overflow-y-auto"
        style={{
          zIndex: 99999,
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        <div className="relative bg-white dark:bg-[#1c2229] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
          {/* Header - Draggable */}
          <div
            className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 cursor-move select-none"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">psychology</span>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Fear & Greed Index History
                </h3>
                <p className="text-sm text-text-secondary mt-0.5">
                  Current: {currentValue} ({currentClassification})
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">close</span>
            </button>
          </div>

          {/* Timeframe Buttons */}
          <div className="flex gap-2 px-6 pt-4">
            {TIME_OPTIONS.map((option, index) => (
              <TimeButton
                key={option.label}
                label={option.label}
                isActive={activeTimeIndex === index}
                onClick={() => setActiveTimeIndex(index)}
              />
            ))}
          </div>

          {/* Chart */}
          <div className="p-6">
            {loading ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-text-secondary">Loading historical data...</p>
                </div>
              </div>
            ) : (
              <div className="h-[400px] relative">
                <Line data={chartData} options={chartOptions} />
                
                {/* Reference lines overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="relative h-full">
                    {/* Extreme Fear zone */}
                    <div className="absolute top-[75%] left-0 text-xs text-danger/60 font-medium">
                      Extreme Fear
                    </div>
                    {/* Fear zone */}
                    <div className="absolute top-[50%] left-0 text-xs text-orange-500/60 font-medium">
                      Fear
                    </div>
                    {/* Greed zone */}
                    <div className="absolute top-[25%] left-0 text-xs text-lime-500/60 font-medium">
                      Greed
                    </div>
                    {/* Extreme Greed zone */}
                    <div className="absolute top-[5%] left-0 text-xs text-success/60 font-medium">
                      Extreme Greed
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          {!loading && historyData.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-t border-slate-200 dark:border-slate-700">
              {(() => {
                const values = historyData.map((d) => parseInt(d.value));
                const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
                const max = Math.max(...values);
                const min = Math.min(...values);
                const extremeFearDays = values.filter((v) => v <= 24).length;
                const extremeGreedDays = values.filter((v) => v >= 75).length;

                return (
                  <>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-text-secondary uppercase tracking-wider">Average</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{avg}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-text-secondary uppercase tracking-wider">Peak</p>
                      <p className="text-2xl font-bold text-success">{max}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-text-secondary uppercase tracking-wider">Low</p>
                      <p className="text-2xl font-bold text-danger">{min}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-text-secondary uppercase tracking-wider">Extreme Days</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        <span className="text-danger">{extremeFearDays}</span> /{' '}
                        <span className="text-success">{extremeGreedDays}</span>
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
};

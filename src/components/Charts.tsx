import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineChartProps {
  type?: 'default' | 'gradient' | 'multi';
}

export const LineChart: React.FC<LineChartProps> = ({ type = 'default' }) => {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  
  if (type === 'gradient') {
    const data = {
      labels,
      datasets: [
        {
          label: 'BTC Price',
          data: [42000, 45000, 43000, 48000, 52000, 49000, 54000],
          borderColor: '#10b981',
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
            return gradient;
          },
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#1a1d29',
          bodyColor: '#6b7280',
          borderColor: 'rgba(0, 0, 0, 0.08)',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function(context: any) {
              return '$' + context.parsed.y.toLocaleString();
            }
          }
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          ticks: {
            color: '#9ca3af',
            font: {
              size: 11,
            },
          },
        },
        y: {
          grid: {
            color: 'rgba(0, 0, 0, 0.04)',
            drawBorder: false,
          },
          border: {
            display: false,
          },
          ticks: {
            color: '#9ca3af',
            font: {
              size: 11,
            },
            callback: function(value: any) {
              return '$' + (value / 1000) + 'k';
            }
          },
        },
      },
      interaction: {
        intersect: false,
        mode: 'index' as const,
      },
    };

    return <Line data={data} options={options} />;
  }

  if (type === 'multi') {
    const data = {
      labels,
      datasets: [
        {
          label: 'MVRV',
          data: [1.2, 1.5, 1.3, 1.8, 2.1, 1.9, 2.3],
          borderColor: '#5b8ff9',
          backgroundColor: 'rgba(91, 143, 249, 0.1)',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
        },
        {
          label: 'NVT',
          data: [2.5, 2.3, 2.8, 2.4, 2.6, 2.2, 2.7],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
        },
        {
          label: 'Funding',
          data: [0.5, 0.8, 0.6, 1.2, 1.4, 1.1, 1.6],
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#1a1d29',
          bodyColor: '#6b7280',
          borderColor: 'rgba(0, 0, 0, 0.08)',
          borderWidth: 1,
          padding: 12,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          ticks: {
            color: '#9ca3af',
            font: {
              size: 11,
            },
          },
        },
        y: {
          grid: {
            color: 'rgba(0, 0, 0, 0.04)',
            drawBorder: false,
          },
          border: {
            display: false,
          },
          ticks: {
            color: '#9ca3af',
            font: {
              size: 11,
            },
          },
        },
      },
    };

    return <Line data={data} options={options} />;
  }

  // Default sparkline
  const data = {
    labels: ['', '', '', '', '', '', ''],
    datasets: [
      {
        data: [30, 35, 33, 38, 42, 40, 45],
        borderColor: '#10b981',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export const DoughnutChart: React.FC = () => {
  const data = {
    labels: ['Valuation', 'Momentum', 'Leverage Risk'],
    datasets: [
      {
        data: [35, 45, 20],
        backgroundColor: [
          '#5b8ff9',
          '#10b981',
          '#f59e0b',
        ],
        borderWidth: 0,
        cutout: '75%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1a1d29',
        bodyColor: '#6b7280',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        borderWidth: 1,
        padding: 12,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export const MiniSparkline: React.FC<{ data: number[]; color?: string }> = ({ 
  data, 
  color = '#10b981' 
}) => {
  const chartData = {
    labels: data.map((_, i) => i.toString()),
    datasets: [
      {
        data,
        borderColor: color,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return <Line data={chartData} options={options} />;
};

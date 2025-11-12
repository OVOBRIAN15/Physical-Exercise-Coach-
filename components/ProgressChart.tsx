
import React, { useState } from 'react';
import { ProgressEntry } from '../types';

interface ProgressChartProps {
  data: ProgressEntry[];
  metric: 'weight' | 'workoutDuration';
  title: string;
  color: string;
  unit: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data, metric, title, color, unit }) => {
  const [tooltip, setTooltip] = useState<{ x: number, y: number, value: string, date: string } | null>(null);

  const chartData = data
    .filter(d => d[metric] != null && d[metric]! > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  if (chartData.length < 2) {
    return (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg h-80 flex flex-col border border-gray-200 dark:border-transparent">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-light-text mb-2">{title}</h3>
        <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-text">Not enough data to display a chart. Log at least two entries for this metric.</p>
        </div>
      </div>
    );
  }

  const width = 500;
  const height = 300;
  const padding = 40;
  
  const values = chartData.map(d => d[metric]!);
  const dates = chartData.map(d => new Date(d.date));

  const minVal = Math.min(...values) * 0.95;
  const maxVal = Math.max(...values) * 1.05;
  const minDate = Math.min(...dates.map(d => d.getTime()));
  const maxDate = Math.max(...dates.map(d => d.getTime()));
  
  const getX = (date: Date) => {
    if (maxDate === minDate) return padding;
    return padding + (date.getTime() - minDate) / (maxDate - minDate) * (width - padding * 2);
  };

  const getY = (value: number) => {
    if (maxVal === minVal) return height / 2;
    return (height - padding) - (value - minVal) / (maxVal - minVal) * (height - padding * 2);
  };
  
  const path = chartData
    .map((d, i) => {
      const x = getX(new Date(d.date));
      const y = getY(d[metric]!);
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ');
    
  const yAxisLabels = () => {
    const labels = [];
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
        const value = minVal + (maxVal - minVal) * (i / steps);
        labels.push({
            value: value.toFixed(1),
            y: getY(value)
        });
    }
    return labels;
  };

  const xAxisLabels = () => {
    const labels = [];
    if (chartData.length < 2) return [];
    
    const first = chartData[0];
    const last = chartData[chartData.length - 1];

    labels.push({ value: new Date(first.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), x: getX(new Date(first.date)) });
    
    if (chartData.length > 2) {
        const midIndex = Math.floor(chartData.length / 2);
        const mid = chartData[midIndex];
        labels.push({ value: new Date(mid.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), x: getX(new Date(mid.date)) });
    }

    if (first.date !== last.date) {
       labels.push({ value: new Date(last.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), x: getX(new Date(last.date)) });
    }

    return labels;
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-transparent">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-light-text mb-4">{title}</h3>
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Y Axis */}
          <line x1={padding} y1={padding/2} x2={padding} y2={height - padding} className="stroke-gray-300 dark:stroke-gray-700" strokeWidth="1" />
          {yAxisLabels().map(({ value, y }) => (
            <g key={y}>
              <text x={padding - 8} y={y} textAnchor="end" alignmentBaseline="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">{value}</text>
              <line x1={padding} y1={y} x2={width - padding} y2={y} className="stroke-gray-200 dark:stroke-gray-800" strokeWidth="0.5" strokeDasharray="2,2" />
            </g>
          ))}

          {/* X Axis */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} className="stroke-gray-300 dark:stroke-gray-700" strokeWidth="1" />
          {xAxisLabels().map(({ value, x }) => (
             <text key={x} x={x} y={height - padding + 15} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">{value}</text>
          ))}
          
          {/* Line Chart Path */}
          <path d={path} fill="none" stroke={color} strokeWidth="2" />

          {/* Data points and tooltips */}
          {chartData.map((d, i) => {
            const x = getX(new Date(d.date));
            const y = getY(d[metric]!);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill={color}
                className="cursor-pointer"
                onMouseEnter={() => setTooltip({ x, y, value: `${d[metric]!.toFixed(1)} ${unit}`, date: new Date(d.date).toLocaleDateString() })}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          })}
        </svg>

        {tooltip && (
            <div className="absolute p-2 text-xs bg-white dark:bg-dark-bg text-gray-900 dark:text-light-text rounded-md shadow-lg pointer-events-none border border-gray-200 dark:border-gray-700" style={{ left: `${(tooltip.x / width) * 100}%`, top: `${(tooltip.y / height) * 100}%`, transform: 'translate(-50%, -120%)' }}>
                <div><strong>{tooltip.value}</strong></div>
                <div className="text-gray-600 dark:text-gray-text">{tooltip.date}</div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProgressChart;
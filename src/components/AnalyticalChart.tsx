// src/components/AnalyticalChart.tsx
import React, { FC } from 'react';
import { 
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { ChartSuggestion } from '../types';

interface AnalyticalChartProps {
  suggestion: ChartSuggestion;
  data: any[];
}

const COLORS = ['#EF4444', '#22D3EE', '#F59E0B', '#10B981', '#8B5CF6', '#F97316'];

export const AnalyticalChart: FC<AnalyticalChartProps> = ({ suggestion, data }) => {
  const { chart, x, y, title } = suggestion;

  // --- Data Processing Logic ---

  const processData = () => {
    switch (chart) {
      case 'pie':
        // Groups data by category and counts occurrences.
        const counts = data.reduce((acc, item) => {
          const key = item[x];
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).map(([name, value]) => ({ name, value }));

      case 'line':
        // FIX: Groups by date and creates a cumulative count for growth charts.
        const growthData = data.reduce((acc, item) => {
          const date = item[x].split('T')[0]; // Use date part only
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        let cumulativeSum = 0;
        return Object.entries(growthData)
          .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
          .map(([date, count]) => {
            cumulativeSum += count;
            return { date, "Total Members": cumulativeSum };
          });

      case 'bar':
         // FIX: Sorts by the y-axis value and takes the top 10 to prevent clutter.
         return [...data]
            .sort((a, b) => b[y] - a[y])
            .slice(0, 10);

      default:
        return data;
    }
  };

  const chartData = processData();

  // --- Chart Rendering Logic ---

  const renderChart = () => {
    switch (chart) {
      case 'pie':
        return (
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name">
              {chartData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      
      case 'bar':
        return (
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={x} tick={{ fontSize: 12 }} angle={-45} textAnchor="end" interval={0} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={y} fill="#EF4444" />
          </BarChart>
        );
      
      case 'line':
        return (
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Total Members" stroke="#22D3EE" strokeWidth={2} />
          </LineChart>
        );
      
      default:
        return <div>Chart type "{chart}" not supported</div>;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">{title}</h3>
      <div className="h-80">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No data available for this chart</p>
          </div>
        )}
      </div>
    </div>
  );
};

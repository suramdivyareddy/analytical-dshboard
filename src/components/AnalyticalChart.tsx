import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartSuggestion } from '../types';

interface AnalyticalChartProps {
  suggestion: ChartSuggestion;
  data: any[];
}

const COLORS = ['#EF4444', '#22D3EE', '#F59E0B', '#10B981', '#8B5CF6', '#F97316'];

export const AnalyticalChart: React.FC<AnalyticalChartProps> = ({ suggestion, data }) => {
  const processDataForChart = () => {
    switch (suggestion.type) {
      case 'pie':
        // Group by source_platform for pie chart
        const sourceCount = data.reduce((acc, item) => {
          const source = item.source_platform || 'Unknown';
          acc[source] = (acc[source] || 0) + 1;
          return acc;
        }, {});
        
        return Object.entries(sourceCount).map(([name, value]) => ({ name, value }));
      
      case 'bar':
        // Group by month for bar chart
        const monthlyJoins = data.reduce((acc, item) => {
          if (item.join_date) {
            const date = new Date(item.join_date);
            const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            acc[month] = (acc[month] || 0) + 1;
          }
          return acc;
        }, {});
        
        return Object.entries(monthlyJoins)
          .map(([month, count]) => ({ month, count }))
          .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
      
      case 'line':
        // Activity over time
        const activityData = data.reduce((acc, item) => {
          if (item.last_active) {
            const date = new Date(item.last_active);
            const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            acc[month] = (acc[month] || 0) + 1;
          }
          return acc;
        }, {});
        
        return Object.entries(activityData)
          .map(([month, active]) => ({ month, active }))
          .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
      
      default:
        return [];
    }
  };

  const chartData = processDataForChart();

  const renderChart = () => {
    switch (suggestion.type) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="active" stroke="#22D3EE" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div>Chart type not supported</div>;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">{suggestion.title}</h3>
      <div className="h-64">
        {chartData.length > 0 ? renderChart() : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No data available for this chart</p>
          </div>
        )}
      </div>
    </div>
  );
};
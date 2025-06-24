// src/components/ChartSuggestions.tsx
import React, { FC } from 'react';
import { BarChart3, TrendingUp, PieChart, Plus, Sparkles, Loader2 } from 'lucide-react';
import { ChartSuggestion } from '../types';

interface ChartSuggestionsProps {
  suggestions: ChartSuggestion[];
  loading: boolean;
  onSuggestCharts: () => void;
  onAddChart: (suggestion: ChartSuggestion) => void;
  hasData: boolean;
}

// FIX: Helper function to get the correct icon based on chart type
const getChartIcon = (type: string) => {
  switch (type) {
    case 'bar': return BarChart3;
    case 'line': return TrendingUp;
    case 'pie': return PieChart;
    default: return BarChart3;
  }
};

export const ChartSuggestions: FC<ChartSuggestionsProps> = ({
  suggestions,
  loading,
  onSuggestCharts,
  onAddChart,
  hasData
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-50 rounded-lg">
            <Sparkles className="h-5 w-5 text-cyan-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">Smart Chart Suggestions</h3>
        </div>
        
        {hasData && (
          <button
            onClick={onSuggestCharts}
            disabled={loading}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span>Suggest Charts</span>
          </button>
        )}
      </div>
      
      <div className="space-y-3">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => {
            // FIX: Use the helper function to get the dynamic icon
            const Icon = getChartIcon(suggestion.chart);
            return (
              <div
                key={`${suggestion.title}-${index}`}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-cyan-300 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-700">{suggestion.title}</h4>
                  </div>
                </div>
                <button
                  onClick={() => onAddChart(suggestion)}
                  className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            {loading ? (
                <div className="flex items-center justify-center h-full"><Loader2 className="h-5 w-5 animate-spin mr-2" /><span>Generating...</span></div>
            ) : (
                <p>Click "Suggest Charts" to get AI recommendations.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

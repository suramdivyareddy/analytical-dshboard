import React from 'react';
import { BarChart3, TrendingUp, PieChart, Plus, Sparkles } from 'lucide-react';
import { ChartSuggestion } from '../types';

interface ChartSuggestionsProps {
  suggestions: ChartSuggestion[];
  loading: boolean;
  onSuggestCharts: () => void;
  onAddChart: (suggestion: ChartSuggestion) => void;
  hasData: boolean;
}

const getChartIcon = (type: string) => {
  switch (type) {
    case 'bar': return BarChart3;
    case 'line': return TrendingUp;
    case 'pie': return PieChart;
    default: return BarChart3;
  }
};

export const ChartSuggestions: React.FC<ChartSuggestionsProps> = ({
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
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Suggest Charts</span>
              </>
            )}
          </button>
        )}
      </div>
      
      <div className="space-y-3">
        {!hasData ? (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Upload data to get intelligent chart suggestions</p>
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((suggestion) => {
            const Icon = getChartIcon(suggestion.type);
            return (
              <div
                key={suggestion.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-cyan-300 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-700">{suggestion.title}</h4>
                    <p className="text-sm text-gray-600">{suggestion.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => onAddChart(suggestion)}
                  className="px-3 py-1.5 bg-coral-500 text-white text-sm rounded-lg hover:bg-coral-600 transition-colors duration-200 flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>
            );
          })
        ) : loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-3"></div>
            <p className="text-gray-500">Generating chart suggestions...</p>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Click "Suggest Charts" to get AI-powered visualization recommendations</p>
          </div>
        )}
      </div>
    </div>
  );
};
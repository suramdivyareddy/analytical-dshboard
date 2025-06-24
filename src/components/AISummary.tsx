// src/components/AISummary.tsx
import React from 'react';
import { Brain, Loader2 } from 'lucide-react';

interface AISummaryProps {
  summary: string | null;
  loading: boolean;
}

export const AISummary: React.FC<AISummaryProps> = ({ summary, loading }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-purple-50 rounded-lg">
          <Brain className="h-5 w-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700">AI Community Insights</h3>
      </div>
      
      <div className="min-h-[120px]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center space-x-3 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing...</span>
            </div>
          </div>
        ) : summary ? (
          // FIX: The backend sends pre-formatted HTML. 
          // We use dangerouslySetInnerHTML to render it correctly.
          // The 'prose' classes from Tailwind ensure the list has proper styling.
          <div 
            className="text-gray-700 leading-relaxed prose prose-sm max-w-none prose-li:my-0" 
            dangerouslySetInnerHTML={{ __html: summary }} 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Upload data to see AI-generated insights.</p>
          </div>
        )}
      </div>
    </div>
  );
};

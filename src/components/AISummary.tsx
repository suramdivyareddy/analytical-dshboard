import React from 'react';
import { Brain, Loader2 } from 'lucide-react';

interface AISummaryProps {
  summary: string | null;
  loading: boolean;
}

export const AISummary: React.FC<AISummaryProps> = ({ summary, loading }) => {
  const formatSummary = (text: string) => {
    return text.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null;
      
      // Handle bullet points
      if (paragraph.trim().startsWith('•') || paragraph.trim().startsWith('-')) {
        return (
          <li key={index} className="ml-4 text-gray-700">
            {paragraph.trim().substring(1).trim()}
          </li>
        );
      }
      
      // Handle bold text
      const boldFormatted = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      return (
        <p 
          key={index} 
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: boldFormatted }}
        />
      );
    }).filter(Boolean);
  };

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
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center space-x-3 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing community data...</span>
            </div>
          </div>
        ) : summary ? (
          <div className="space-y-3">
            {formatSummary(summary)}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <p>Upload community data to see AI-generated insights</p>
          </div>
        )}
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Users, UserCheck, UserPlus, Target } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { KPICard } from './components/KPICard';
import { AISummary } from './components/AISummary';
import { ChartSuggestions } from './components/ChartSuggestions';
import { AnalyticalChart } from './components/AnalyticalChart';
import { generateAISummary, generateChartSuggestions } from './utils/dataAnalysis';
import { KPIData, ChartSuggestion } from './types';

function App() {
  const [data, setData] = useState<any[]>([]);
  const [kpis, setKPIs] = useState<KPIData | null>(null);
  const [aiSummary, setAISummary] = useState<string | null>(null);
  const [chartSuggestions, setChartSuggestions] = useState<ChartSuggestion[]>([]);
  const [activeCharts, setActiveCharts] = useState<ChartSuggestion[]>([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [dataSummary, setDataSummary] = useState<string>('');
  const [columns, setColumns] = useState<string[]>([]);

  const handleFileUpload = async (uploadedData: any[], uploadedKPIs: KPIData, uploadedDataSummary: string, uploadedColumns: string[]) => {
    setUploadLoading(true);
    setData(uploadedData);
    setKPIs(uploadedKPIs);
    setDataSummary(uploadedDataSummary);
    setColumns(uploadedColumns);
    
    // Generate AI summary using real backend
    setLoadingSummary(true);
    try {
      const summary = await generateAISummary(uploadedDataSummary, uploadedKPIs);
      setAISummary(summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      setAISummary('Unable to generate AI summary. Please check your backend connection and API key configuration.');
    } finally {
      setLoadingSummary(false);
    }
    
    setUploadLoading(false);
  };

  const handleSuggestCharts = async () => {
    setLoadingSuggestions(true);
    try {
      const suggestions = await generateChartSuggestions(columns, data.slice(0, 5));
      setChartSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      // Fallback suggestions if backend fails
      const fallbackSuggestions: ChartSuggestion[] = [
        {
          id: 'source-breakdown',
          title: 'Member Acquisition Sources',
          type: 'pie',
          description: 'Shows distribution of where your members are coming from',
          dataKey: 'source_platform'
        },
        {
          id: 'growth-trend',
          title: 'Monthly Growth Trend',
          type: 'bar',
          description: 'Visualizes member join patterns over time',
          dataKey: 'join_date'
        }
      ];
      setChartSuggestions(fallbackSuggestions);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleAddChart = (suggestion: ChartSuggestion) => {
    if (!activeCharts.find(chart => chart.id === suggestion.id)) {
      setActiveCharts([...activeCharts, suggestion]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-coral-50 rounded-lg">
              <Target className="h-8 w-8 text-coral-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-700">Analytical Storytelling Dashboard</h1>
              <p className="text-gray-600">Transform your community data into actionable insights with AI</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* File Upload Section */}
        {!data.length && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-700 mb-4">
                Get Started with Your Community Data
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload your CSV file and instantly discover key insights about your community's growth, 
                engagement, and acquisition patterns powered by AI.
              </p>
            </div>
            <FileUpload onFileUpload={handleFileUpload} loading={uploadLoading} />
          </div>
        )}

        {/* Dashboard Section */}
        {data.length > 0 && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            {kpis && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                  title="Total Members"
                  value={kpis.totalMembers}
                  icon={Users}
                  color="coral"
                  description="All-time community size"
                  trend={{ value: 12.5, isPositive: true }}
                />
                <KPICard
                  title="Active Members"
                  value={kpis.activeMembers}
                  icon={UserCheck}
                  color="cyan"
                  description="Active in last 30 days"
                  trend={{ value: 8.3, isPositive: true }}
                />
                <KPICard
                  title="New Members"
                  value={kpis.newMembers}
                  icon={UserPlus}
                  color="orange"
                  description="Joined in last 30 days"
                  trend={{ value: 15.2, isPositive: true }}
                />
                <KPICard
                  title="Top Source"
                  value={kpis.topAcquisitionSource}
                  icon={Target}
                  color="slate"
                  description="Primary acquisition channel"
                />
              </div>
            )}

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <AISummary summary={aiSummary} loading={loadingSummary} />
                <ChartSuggestions
                  suggestions={chartSuggestions}
                  loading={loadingSuggestions}
                  onSuggestCharts={handleSuggestCharts}
                  onAddChart={handleAddChart}
                  hasData={data.length > 0}
                />
              </div>

              {/* Right Column - Charts */}
              <div className="space-y-6">
                {activeCharts.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-slate-700">Analytical Dashboard</h3>
                      <span className="text-sm text-gray-500">
                        {activeCharts.length} chart{activeCharts.length !== 1 ? 's' : ''} active
                      </span>
                    </div>
                    {activeCharts.map((chart) => (
                      <AnalyticalChart
                        key={chart.id}
                        suggestion={chart}
                        data={data}
                      />
                    ))}
                  </>
                ) : (
                  <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 text-center">
                    <div className="text-gray-400 mb-4">
                      <Target className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Ready for Deep Analysis
                    </h3>
                    <p className="text-gray-500">
                      Use "Suggest Charts" to add AI-powered visualizations to your dashboard
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload New Data Button */}
            <div className="text-center pt-8 border-t border-gray-200">
              <button
                onClick={() => {
                  setData([]);
                  setKPIs(null);
                  setAISummary(null);
                  setChartSuggestions([]);
                  setActiveCharts([]);
                  setDataSummary('');
                  setColumns([]);
                }}
                className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
              >
                Upload New Dataset
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
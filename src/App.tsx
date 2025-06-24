// src/App.tsx
import React, { useState } from 'react';
import { Users, Activity, TrendingUp, Mic, Target, BarChart3, Menu, X, Upload } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { KPICard } from './components/KPICard';
import { AISummary } from './components/AISummary';
import { ChartSuggestions } from './components/ChartSuggestions';
import { AnalyticalChart } from './components/AnalyticalChart';
import { generateChartSuggestions } from './utils/dataAnalysis';
import { KPIData, ChartSuggestion, UploadResponse } from './types';

function App() {
  const [data, setData] = useState<any[]>([]);
  const [kpis, setKPIs] = useState<KPIData | null>(null);
  const [aiSummary, setAISummary] = useState<string | null>(null);
  const [chartSuggestions, setChartSuggestions] = useState<ChartSuggestion[]>([]);
  const [activeCharts, setActiveCharts] = useState<ChartSuggestion[]>([]);
  
  const [uploadLoading, setUploadLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [error, setError] = useState('');
  const [columns, setColumns] = useState<string[]>([]);
  
  // New state for sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleFileUpload = (response: UploadResponse) => {
    setData(response.rows);
    setColumns(response.columns);
    setKPIs(response.kpis);
    setAISummary(response.summary);
  };

  const handleSuggestCharts = async () => {
    setSuggestionsLoading(true);
    setError('');
    try {
      const suggestions = await generateChartSuggestions(columns);
      setChartSuggestions(suggestions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleAddChart = (suggestion: ChartSuggestion) => {
    const chartToAdd = { ...suggestion, id: `${suggestion.title}-${Date.now()}` };
    if (!activeCharts.find(chart => chart.title === chartToAdd.title)) {
      setActiveCharts([...activeCharts, chartToAdd]);
    }
  };

  const resetDashboard = () => {
    setData([]);
    setKPIs(null);
    setAISummary(null);
    setChartSuggestions([]);
    setActiveCharts([]);
    setColumns([]);
    setError('');
    // Close sidebar after resetting
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- Sidebar and Overlay --- */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen bg-slate-800 text-white p-6 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Menu</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded-full hover:bg-slate-700">
                <X className="h-6 w-6"/>
            </button>
        </div>
        <nav>
            <ul>
                <li>
                    <button onClick={resetDashboard} className="w-full flex items-center px-4 py-3 text-left rounded-lg bg-slate-700 hover:bg-red-500 transition-colors">
                        <Upload className="h-5 w-5 mr-3"/>
                        Upload New Dataset
                    </button>
                </li>
            </ul>
        </nav>
      </aside>
      {/* Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsSidebarOpen(false)}></div>}


      {/* --- Header --- */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            {/* Menu Button */}
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-100">
              <Menu className="h-6 w-6 text-slate-600"/>
            </button>
            
            {/* FIX: Replaced complex logo with a simpler, styled icon */}
            <div className="flex-shrink-0 p-2 bg-slate-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-slate-600"/>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Community Insights Engine</h1>
              <p className="text-sm text-gray-500">An AI-Powered Dashboard</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert"><p className="font-bold">Error:</p><p>{error}</p></div>}
        
        {!kpis ? (
          <div className="mt-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-700 mb-2">Get Started in Seconds</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Upload your community data CSV to instantly generate a dashboard with KPIs and AI-powered insights.</p>
            </div>
            <FileUpload onFileUpload={handleFileUpload} loading={uploadLoading} setLoading={setUploadLoading} setError={setError} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard title="Total Members" value={kpis.totalMembers} icon={Users} color="cyan" />
              <KPICard title="Active Members (30d)" value={kpis.activeMembers} icon={Activity} color="coral" />
              <KPICard title="New Members (30d)" value={kpis.newMembers} icon={TrendingUp} color="orange" />
              <KPICard title="Top Acquisition Source" value={kpis.topAcquisitionSource} icon={Mic} color="slate" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-1 space-y-6">
                <AISummary summary={aiSummary} loading={uploadLoading} />
                <ChartSuggestions
                  suggestions={chartSuggestions}
                  loading={suggestionsLoading}
                  onSuggestCharts={handleSuggestCharts}
                  onAddChart={handleAddChart}
                  hasData={data.length > 0}
                />
              </div>

              <div className="lg:col-span-2 space-y-8">
                {activeCharts.length > 0 ? (
                  activeCharts.map(chart => <AnalyticalChart key={chart.id || chart.title} suggestion={chart} data={data} />)
                ) : (
                  <div className="bg-white p-12 rounded-xl shadow-md border border-gray-200 text-center text-gray-500 h-full flex flex-col justify-center items-center">
                    <BarChart3 className="mx-auto h-16 w-16 text-gray-300" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-800">Your Analytical Dashboard</h3>
                    <p className="mt-2">Select suggested charts to build your view.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

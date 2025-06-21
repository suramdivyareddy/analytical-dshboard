import { KPIData, ChartSuggestion } from '../types';
import { uploadFile, generateSummary, generateSuggestions } from './api';

export const processFileUpload = async (file: File) => {
  try {
    const response = await uploadFile(file);
    if (!response.success) {
      throw new Error(response.error || 'Upload failed');
    }
    return response;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const generateAISummary = async (dataSummary: string, kpis: KPIData): Promise<string> => {
  try {
    const response = await generateSummary(dataSummary, kpis);
    if (!response.success) {
      throw new Error(response.error || 'Summary generation failed');
    }
    return response.summary;
  } catch (error) {
    console.error('Summary generation error:', error);
    throw error;
  }
};

export const generateChartSuggestions = async (columns: string[], sampleData: any[]): Promise<ChartSuggestion[]> => {
  try {
    const response = await generateSuggestions(columns, sampleData);
    if (!response.success) {
      throw new Error(response.error || 'Suggestions generation failed');
    }
    return response.suggestions;
  } catch (error) {
    console.error('Suggestions generation error:', error);
    throw error;
  }
};

// Fallback KPI calculation for frontend-only mode
export const calculateKPIs = (data: any[]): KPIData => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const totalMembers = data.length;
  
  const activeMembers = data.filter(member => {
    if (!member.last_active) return false;
    const lastActiveDate = new Date(member.last_active);
    return lastActiveDate >= thirtyDaysAgo;
  }).length;

  const newMembers = data.filter(member => {
    if (!member.join_date) return false;
    const joinDate = new Date(member.join_date);
    return joinDate >= thirtyDaysAgo;
  }).length;

  const sourceCounts = data.reduce((acc, member) => {
    const source = member.source_platform || 'Unknown';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topAcquisitionSource = Object.entries(sourceCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown';

  return {
    totalMembers,
    activeMembers,
    newMembers,
    topAcquisitionSource
  };
};
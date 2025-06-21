export interface CommunityData {
  id: string;
  name: string;
  email: string;
  join_date: string;
  last_active: string;
  source_platform: string;
  engagement_score: number;
  location: string;
}

export interface KPIData {
  totalMembers: number;
  activeMembers: number;
  newMembers: number;
  topAcquisitionSource: string;
}

export interface ChartSuggestion {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'area';
  description: string;
  xAxis?: string;
  yAxis?: string;
  dataKey?: string;
}

export interface AIResponse {
  summary: string;
  suggestions: ChartSuggestion[];
}
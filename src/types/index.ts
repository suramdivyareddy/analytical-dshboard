// src/types.ts

// Represents the Key Performance Indicators calculated by the backend.
export interface KPIData {
  totalMembers: number;
  activeMembers: number;
  newMembers: number;
  topAcquisitionSource: string;
}

// Represents an AI-generated chart suggestion from the backend.
// This structure matches the JSON the AI is prompted to create.
export interface ChartSuggestion {
  id?: string; // A unique ID added on the frontend for React keys
  title: string;
  chart: 'bar' | 'line' | 'pie'; // The chart type
  x: string; // The column name for the X-axis or Pie chart categories
  y: string; // The column name for the Y-axis
}

// Represents the entire data payload received from the backend's /api/upload endpoint.
export interface UploadResponse {
  rows: any[];
  columns: string[];
  kpis: KPIData;
  summary: string;
}

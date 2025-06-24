// src/utils/dataAnalysis.ts
import axios from 'axios';
import { ChartSuggestion, UploadResponse, KPIData } from '../types';

const API_BASE_URL = 'http://localhost:5001';

/**
 * Uploads a file and gets the initial dashboard data.
 * This is the primary function to call on file upload.
 * It now returns the entire payload from the backend.
 */
export const uploadAndAnalyzeFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post<UploadResponse>(`${API_BASE_URL}/api/upload`, formData);
    if (response.data && response.data.kpis) {
      return response.data;
    } else {
      throw new Error("Incomplete data received from server.");
    }
  } catch (err: any) {
    console.error("API Error in uploadAndAnalyzeFile:", err);
    throw new Error(err.response?.data?.error || err.message || "An unknown upload error occurred.");
  }
};

/**
 * Gets chart suggestions from the backend based on the data columns.
 */
export const generateChartSuggestions = async (columns: string[]): Promise<ChartSuggestion[]> => {
  try {
    // The backend now sends pre-validated JSON, which axios will parse automatically.
    const response = await axios.post<ChartSuggestion[]>(`${API_BASE_URL}/api/suggest`, { columns });
    return response.data;
  } catch (err: any) {
    console.error("API Error in generateChartSuggestions:", err);
    throw new Error(err.response?.data?.error || 'Could not get AI suggestions.');
  }
};

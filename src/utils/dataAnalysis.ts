import axios from 'axios';
import { ChartSuggestion, UploadResponse, KPIData } from '../types';

// This is the key change.
// It reads the environment variable you set in Render.
// The `|| 'http://localhost:5001'` part is a fallback,
// so your code will still work perfectly for local development.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

/**
 * Uploads a file and gets the initial dashboard data.
 * This is the primary function to call on file upload.
 * It now returns the entire payload from the backend.
 */
export const uploadAndAnalyzeFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    // We now use the dynamic API_BASE_URL constant
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
    // We also use the dynamic API_BASE_URL here
    const response = await axios.post<ChartSuggestion[]>(`${API_BASE_URL}/api/suggest`, { columns });
    return response.data;
  } catch (err: any) {
    console.error("API Error in generateChartSuggestions:", err);
    throw new Error(err.response?.data?.error || 'Could not get AI suggestions.');
  }
};
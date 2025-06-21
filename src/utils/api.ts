const API_BASE_URL = 'http://localhost:5001/api';

export interface UploadResponse {
  success: boolean;
  data: any[];
  kpis: {
    totalMembers: number;
    activeMembers: number;
    newMembers: number;
    topAcquisitionSource: string;
  };
  dataSummary: string;
  columns: string[];
  error?: string;
}

export interface SummaryResponse {
  success: boolean;
  summary: string;
  error?: string;
}

export interface SuggestionsResponse {
  success: boolean;
  suggestions: Array<{
    id: string;
    title: string;
    type: 'bar' | 'line' | 'pie' | 'area';
    description: string;
    dataKey: string;
  }>;
  error?: string;
}

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  return response.json();
};

export const generateSummary = async (dataSummary: string, kpis: any): Promise<SummaryResponse> => {
  const response = await fetch(`${API_BASE_URL}/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ dataSummary, kpis }),
  });

  return response.json();
};

export const generateSuggestions = async (columns: string[], sampleData: any[]): Promise<SuggestionsResponse> => {
  const response = await fetch(`${API_BASE_URL}/suggest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ columns, sampleData }),
  });

  return response.json();
};
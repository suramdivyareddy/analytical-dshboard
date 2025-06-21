import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { processFileUpload } from '../utils/dataAnalysis';

interface FileUploadProps {
  onFileUpload: (data: any[], kpis: any, dataSummary: string, columns: string[]) => void;
  loading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, loading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    try {
      const response = await processFileUpload(file);
      onFileUpload(response.data, response.kpis, response.dataSummary, response.columns);
    } catch (err) {
      setError(`Error processing file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [onFileUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'border-cyan-400 bg-cyan-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleChange}
          disabled={loading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            {loading ? (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-500"></div>
            ) : (
              <Upload className="h-12 w-12 text-gray-400" />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              {loading ? 'Processing your data...' : 'Upload Community Data'}
            </h3>
            <p className="text-gray-600">
              Drag and drop your CSV file here, or click to select
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports CSV files with community member data
            </p>
          </div>
          
          {!loading && (
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <FileText className="h-4 w-4" />
              <span>CSV files only</span>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};
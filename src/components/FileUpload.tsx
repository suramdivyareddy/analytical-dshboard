// src/components/FileUpload.tsx
import React, { useState, FC, useCallback } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { uploadAndAnalyzeFile } from '../utils/dataAnalysis'; // FIX: Corrected the import name
import { UploadResponse } from '../types';

interface FileUploadProps {
  onFileUpload: (response: UploadResponse) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  setError: (error: string) => void;
}

export const FileUpload: FC<FileUploadProps> = ({ onFileUpload, setLoading, loading, setError }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFile = useCallback(async (file: File) => {
    setError('');
    
    if (!file || !file.name.toLowerCase().endsWith('.csv')) {
      setError('Invalid file type. Please upload a CSV file.');
      return;
    }

    setLoading(true);
    try {
      // Use the correctly named function
      const response = await uploadAndAnalyzeFile(file);
      onFileUpload(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [onFileUpload, setLoading, setError]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setFileName(e.dataTransfer.files[0].name);
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files?.[0]) {
        setFileName(e.target.files[0].name);
        handleFile(e.target.files[0]);
    }
  };

  return (
     <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <label htmlFor="file-upload" className={`flex-grow w-full flex items-center px-4 py-3 bg-white text-blue-500 rounded-lg shadow-sm tracking-wide border-2 border-dashed  cursor-pointer hover:border-blue-500 hover:text-blue-600 transition-colors ${dragActive ? 'border-blue-500' : 'border-gray-300'}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
          <Upload className="w-6 h-6 mr-3" />
          <span className="text-base leading-normal">{fileName || "Select or drop your CSV file"}</span>
        </label>
        <input id="file-upload" type="file" className="hidden" accept=".csv" onChange={handleChange} disabled={loading} />
      </div>
      {loading && (
         <div className="flex items-center justify-center text-gray-500 mt-4">
            <Loader2 className="animate-spin mr-2 h-5 w-5" />
            <span>Analyzing your community... This may take a moment.</span>
         </div>
      )}
    </div>
  );
};

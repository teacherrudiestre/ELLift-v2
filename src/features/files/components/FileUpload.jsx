// src/features/files/components/FileUpload.jsx
import React from 'react';
import { Upload, File, CheckCircle } from 'lucide-react';
import { useAdaptationStore, useUIStore } from '../../../store';
import { useFileUpload } from '../hooks/useFileUpload';
import Button from '../../../components/ui/Button';

const FileUpload = () => {
  const { uploadedFile, extractedText } = useAdaptationStore();
  const { handleFileUpload, removeFile } = useFileUpload();

  return (
    <div className="mb-4">
      <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center bg-blue-50">
        {uploadedFile ? (
          <div className="space-y-2">
            <File className="w-8 h-8 text-green-500 mx-auto" />
            <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
            <p className="text-xs text-gray-600">
              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-8 h-8 text-blue-400 mx-auto" />
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileUpload} 
              className="hidden" 
              id="pdf-upload" 
            />
            <label htmlFor="pdf-upload">
              <Button
                variant="primary"
                size="sm"
                as="span"
                className="cursor-pointer"
              >
                Choose PDF
              </Button>
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Maximum file size: 10MB
            </p>
          </div>
        )}
      </div>
      {uploadedFile && extractedText && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-xs text-green-800 font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Text extracted and added below
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
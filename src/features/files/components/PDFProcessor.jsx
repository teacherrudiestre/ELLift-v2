// src/features/files/components/PDFProcessor.jsx
import React, { useState } from 'react';
import { File, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useFileUpload } from '../hooks/useFileUpload';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const PDFProcessor = ({ 
  file, 
  onTextExtracted, 
  onError, 
  onRemove 
}) => {
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState('');

  const { processFile } = useFileUpload();

  const handleProcess = async () => {
    if (!file) return;

    setProcessingStatus('processing');
    setError('');

    try {
      const text = await processFile(file, (step) => {
        // Could show processing steps here
        console.log('Processing step:', step);
      });
      
      setExtractedText(text);
      setProcessingStatus('success');
      onTextExtracted?.(text);
    } catch (err) {
      setError(err.message);
      setProcessingStatus('error');
      onError?.(err);
    }
  };

  const getFileSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <File className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-gray-900">{file.name}</h3>
            <p className="text-sm text-gray-500">
              {getFileSize(file.size)} • PDF Document
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          icon={X}
          className="text-gray-400 hover:text-red-600"
          aria-label="Remove file"
        />
      </div>

      {/* Processing Status */}
      {processingStatus === 'idle' && (
        <div className="flex items-center gap-2 mb-3">
          <Button
            variant="primary"
            size="sm"
            onClick={handleProcess}
          >
            Extract Text
          </Button>
          <span className="text-sm text-gray-500">
            Ready to process
          </span>
        </div>
      )}

      {processingStatus === 'processing' && (
        <div className="flex items-center gap-2 mb-3 text-blue-600">
          <LoadingSpinner size="sm" color="blue" />
          <span className="text-sm">Processing PDF...</span>
        </div>
      )}

      {processingStatus === 'success' && (
        <div className="mb-3">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Text extracted successfully</span>
          </div>
          <div className="text-xs text-gray-500">
            {extractedText.length} characters extracted
          </div>
        </div>
      )}

      {processingStatus === 'error' && (
        <div className="flex items-center gap-2 mb-3 text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Preview of extracted text */}
      {extractedText && (
        <div className="mt-3 p-3 bg-gray-50 rounded border">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Text Preview:</h4>
          <div className="text-xs text-gray-600 max-h-20 overflow-y-auto">
            {extractedText.substring(0, 200)}
            {extractedText.length > 200 && '...'}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFProcessor;
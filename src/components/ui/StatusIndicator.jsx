// src/components/ui/StatusIndicator.jsx
import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const StatusIndicator = ({ processingStep, error, success }) => {
  if (error) {
    return (
      <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md text-sm font-medium flex items-center gap-2">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        {error}
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md text-sm font-medium flex items-center gap-2">
        <CheckCircle className="w-4 h-4 flex-shrink-0" />
        {success}
      </div>
    );
  }
  
  if (processingStep) {
    return (
      <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded-md text-sm font-medium flex items-center gap-2">
        <LoadingSpinner size="sm" color="blue" className="flex-shrink-0" />
        {processingStep}
      </div>
    );
  }
  
  return null;
};

export default StatusIndicator;
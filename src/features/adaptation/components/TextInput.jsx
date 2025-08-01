// src/features/adaptation/components/TextInput.jsx
import React from 'react';
import { CheckCircle } from 'lucide-react';

const TextInput = ({ 
  value, 
  onChange, 
  placeholder, 
  hasFile, 
  validation 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Material Content *
        {hasFile && (
          <span className="text-blue-600 text-xs ml-2">(from PDF)</span>
        )}
        {!value.trim() && <span className="text-red-500 text-xs ml-1">(Required)</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field h-96 resize-none custom-scrollbar"
      />
      <div className="mt-2 text-xs text-gray-500">
        Character count: {value.length}
        {value.length > 10000 && (
          <span className="text-amber-600 ml-2">
            ⚠️ Large content may take longer to process
          </span>
        )}
      </div>
      {hasFile && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-xs text-green-800 font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Text extracted and added above
          </p>
        </div>
      )}
    </div>
  );
};

export default TextInput;
// src/features/adaptation/components/InputMethodSelector.jsx
import React from 'react';
import { FileText, Upload } from 'lucide-react';

const InputMethodSelector = ({ inputMethod, onInputMethodChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        How would you like to add your material?
      </label>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onInputMethodChange('text')}
          className={`p-3 rounded-lg border-2 transition-all ${
            inputMethod === 'text'
              ? 'border-blue-500 bg-blue-100 text-blue-700'
              : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
          }`}
        >
          <FileText className="w-5 h-5 mx-auto mb-1" />
          <div className="text-sm font-medium">Type/Paste Text</div>
        </button>
        <button
          onClick={() => onInputMethodChange('upload')}
          className={`p-3 rounded-lg border-2 transition-all ${
            inputMethod === 'upload'
              ? 'border-blue-500 bg-blue-100 text-blue-700'
              : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
          }`}
        >
          <Upload className="w-5 h-5 mx-auto mb-1" />
          <div className="text-sm font-medium">Upload PDF</div>
        </button>
      </div>
    </div>
  );
};

export default InputMethodSelector;
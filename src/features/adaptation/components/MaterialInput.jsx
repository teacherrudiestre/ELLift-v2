// src/features/adaptation/components/MaterialInput.jsx
import React from 'react';
import { useAdaptationStore } from '../../../store';
import InputMethodSelector from './InputMethodSelector';
import FileUpload from '../../files/components/FileUpload';
import TextInput from './TextInput';

const MaterialInput = () => {
  const {
    inputMethod,
    originalMaterial,
    uploadedFile,
    extractedText,
    validationStatus,
    setInputMethod,
    setOriginalMaterial
  } = useAdaptationStore();

  const validation = validationStatus();

  return (
    <div className="card bg-gray-50 border-gray-200">
      <h2 className="section-header text-gray-800">Original Material</h2>
      
      <InputMethodSelector
        inputMethod={inputMethod}
        onInputMethodChange={setInputMethod}
      />
      
      {inputMethod === 'upload' && (
        <FileUpload />
      )}
      
      <TextInput
        value={originalMaterial}
        onChange={setOriginalMaterial}
        placeholder={
          inputMethod === 'upload' 
            ? "Upload a PDF above to extract text here..." 
            : "Enter your lesson material, quiz questions, worksheet content..."
        }
        hasFile={!!uploadedFile && !!extractedText}
        validation={validation}
      />
    </div>
  );
};

export default MaterialInput;
// src/features/files/hooks/useFileUpload.js
import { useCallback } from 'react';
import { useAdaptationStore, useUIStore } from '../../../store';
import { extractTextFromPDF } from '../../../services/files/pdfProcessor';

export const useFileUpload = () => {
  const { 
    setUploadedFile, 
    setExtractedText, 
    setOriginalMaterial, 
    extractedText, 
    originalMaterial,
    removeFile: removeFileFromStore 
  } = useAdaptationStore();
  
  const { 
    setLoading, 
    setProcessingStep, 
    setError, 
    setSuccessWithAutoClear 
  } = useUIStore();

  const handleFileUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file only.');
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('PDF file is too large. Please upload a file smaller than 10MB.');
      return;
    }

    setUploadedFile(file);
    setLoading(true);
    setError('');
    setProcessingStep('Starting PDF processing...');

    try {
      const text = await extractTextFromPDF(file, setProcessingStep);
      setOriginalMaterial(text);
      setExtractedText(text);
      setSuccessWithAutoClear('PDF text extracted successfully!');
      setProcessingStep('');
    } catch (error) {
      console.error('Error processing PDF:', error);
      setError(`Failed to process PDF: ${error.message}`);
      setUploadedFile(null);
      setProcessingStep('');
    } finally {
      setLoading(false);
    }
  }, [setUploadedFile, setExtractedText, setOriginalMaterial, setLoading, setProcessingStep, setError, setSuccessWithAutoClear]);

  const removeFile = useCallback(() => {
    removeFileFromStore();
    setSuccessWithAutoClear('File removed successfully');
  }, [removeFileFromStore, setSuccessWithAutoClear]);

  return {
    handleFileUpload,
    removeFile
  };
};

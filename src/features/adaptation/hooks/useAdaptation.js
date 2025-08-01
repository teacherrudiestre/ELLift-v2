// src/features/adaptation/hooks/useAdaptation.js
import { useCallback } from 'react';
import { useAdaptationStore, useResultsStore, useUIStore } from '../../../store';
import { adaptMaterialWithClaude } from '../../../services/api/claude';
import { getWidaDescriptors } from '../../../utils/constants/widaData';

export const useAdaptation = () => {
  const adaptationStore = useAdaptationStore();
  const { setResults } = useResultsStore();
  const { 
    setLoading, 
    setProcessingStep, 
    setError, 
    setSuccessWithAutoClear,
    clearMessages 
  } = useUIStore();

  const adaptMaterial = useCallback(async () => {
    // Clear previous messages
    clearMessages();
    
    // Validate form
    const validation = adaptationStore.validationStatus();
    if (!validation.isValid) {
      setError(`Please fill in required fields: ${validation.missingFields.join(', ')}`);
      return;
    }

    setLoading(true);
    setProcessingStep('Preparing material adaptation...');

    try {
      const params = {
        contentToAdapt: adaptationStore.originalMaterial,
        materialType: adaptationStore.materialType,
        subject: adaptationStore.subject,
        gradeLevel: adaptationStore.gradeLevel,
        proficiencyLevel: adaptationStore.proficiencyLevel,
        learningObjectives: adaptationStore.learningObjectives,
        includeBilingualSupport: adaptationStore.includeBilingualSupport,
        nativeLanguage: adaptationStore.nativeLanguage,
        translateSummary: adaptationStore.translateSummary,
        translateInstructions: adaptationStore.translateInstructions,
        listCognates: adaptationStore.listCognates,
        worksheetLength: adaptationStore.worksheetLength,
        addStudentChecklist: adaptationStore.addStudentChecklist,
        useMultipleChoice: adaptationStore.useMultipleChoice
      };

      const adaptedData = await adaptMaterialWithClaude(params, setProcessingStep);
      
      // Get general WIDA descriptors
      const generalDescriptors = getWidaDescriptors(
        adaptationStore.proficiencyLevel, 
        adaptationStore.subject, 
        adaptationStore.gradeLevel
      );

      // Store results
      setResults({
        ...adaptedData,
        widaDescriptors: generalDescriptors,
        params
      });

      setSuccessWithAutoClear('Material successfully adapted for ELL students!');
      setProcessingStep('');

      // Scroll to results after a brief delay
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 500);

    } catch (error) {
      console.error('Error adapting material:', error);
      setError(error.message || 'Sorry, there was an error adapting your material. Please try again.');
      setProcessingStep('');
    } finally {
      setLoading(false);
    }
  }, [adaptationStore, setResults, setLoading, setProcessingStep, setError, setSuccessWithAutoClear, clearMessages]);

  const clearAll = useCallback(() => {
    const hasContent = adaptationStore.originalMaterial || 
                      useResultsStore.getState().studentWorksheet || 
                      useResultsStore.getState().teacherGuide;
    
    if (hasContent && !window.confirm('Are you sure you want to clear all fields and results? This action cannot be undone.')) {
      return;
    }

    adaptationStore.clearAll();
    useResultsStore.getState().clearResults();
    clearMessages();
    setSuccessWithAutoClear('All fields cleared successfully!');
  }, [adaptationStore, clearMessages, setSuccessWithAutoClear]);

  return {
    adaptMaterial,
    clearAll
  };
};
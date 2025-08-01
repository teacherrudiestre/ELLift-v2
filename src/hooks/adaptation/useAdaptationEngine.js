// src/hooks/adaptation/useAdaptationEngine.js
import { useCallback, useRef } from 'react';
import { useAdaptationStore, useResultsStore, useProcessingStore, useValidationStore } from '../../store';
import { AdaptationEngine } from '../../services/adaptation/engine/AdaptationEngine';
import { useUIStore } from '../../store';

export const useAdaptationEngine = (config = {}) => {
  const engineRef = useRef(null);
  
  // Store hooks
  const adaptationStore = useAdaptationStore();
  const { setResults, clearResults } = useResultsStore();
  const { 
    startProcessing, 
    updateProgress, 
    completeProcessing, 
    failProcessing 
  } = useProcessingStore();
  const { 
    startValidation, 
    setValidationResults, 
    setValidationError 
  } = useValidationStore();
  const { setError, setSuccessWithAutoClear } = useUIStore();

  // Initialize engine
  const getEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = new AdaptationEngine({
        qualityThreshold: 0.8,
        enableValidation: true,
        enableQualityCheck: true,
        ...config
      });

      // Set up event listeners
      engineRef.current.on('adaptation:started', ({ jobId, params }) => {
        startProcessing(jobId, params);
      });

      engineRef.current.on('adaptation:completed', ({ jobId, result }) => {
        completeProcessing(result);
        setResults(result);
        setSuccessWithAutoClear('Material successfully adapted for ELL students!');
      });

      engineRef.current.on('adaptation:error', ({ jobId, error }) => {
        failProcessing(error);
        setError(error.message || 'Adaptation failed. Please try again.');
      });
    }
    return engineRef.current;
  }, [config, startProcessing, completeProcessing, failProcessing, setResults, setError, setSuccessWithAutoClear]);

  // Main adaptation function
  const adaptMaterial = useCallback(async () => {
    try {
      // Validate form
      const validation = adaptationStore.validationStatus();
      if (!validation.isValid) {
        setError(`Please fill in required fields: ${validation.missingFields.join(', ')}`);
        return;
      }

      // Clear previous results
      clearResults();

      // Prepare parameters
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

      // Progress callback
      const progressCallback = (step) => {
        const stepMapping = {
          'Analyzing content structure and complexity...': { step, progress: 10, total: 100 },
          'Determining optimal processing strategy...': { step, progress: 20, total: 100 },
          'Initializing adaptation pipeline...': { step, progress: 30, total: 100 },
          'Executing content adaptation...': { step, progress: 50, total: 100 },
          'Validating output quality...': { step, progress: 80, total: 100 },
          'Finalizing adaptation...': { step, progress: 95, total: 100 }
        };

        const mapped = stepMapping[step] || { step, progress: 50, total: 100 };
        updateProgress(mapped.step, mapped.progress, mapped.total);
      };

      // Execute adaptation
      const engine = getEngine();
      const result = await engine.adaptMaterial(params, progressCallback);

      return result;

    } catch (error) {
      console.error('Adaptation failed:', error);
      throw error;
    }
  }, [adaptationStore, clearResults, setError, updateProgress, getEngine]);

  // Content analysis function
  const analyzeContent = useCallback(async (content, params = {}) => {
    try {
      const engine = getEngine();
      return await engine.analyzeContent(content, params);
    } catch (error) {
      console.error('Content analysis failed:', error);
      throw error;
    }
  }, [getEngine]);

  // Validation function
  const validateOutput = useCallback(async (result, params) => {
    try {
      startValidation();
      const engine = getEngine();
      const validation = await engine.validateOutput(result, params);
      setValidationResults(validation);
      return validation;
    } catch (error) {
      setValidationError(error);
      throw error;
    }
  }, [getEngine, startValidation, setValidationResults, setValidationError]);

  // Get engine status
  const getEngineStatus = useCallback(() => {
    const engine = engineRef.current;
    return engine ? engine.getStatus() : null;
  }, []);

  return {
    adaptMaterial,
    analyzeContent,
    validateOutput,
    getEngineStatus,
    engine: engineRef.current
  };
};

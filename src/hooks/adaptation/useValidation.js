// src/hooks/adaptation/useValidation.js
import { useState, useCallback } from 'react';
import { useValidationStore } from '../../store';
import { OutputValidator } from '../../services/adaptation/validators/OutputValidator';

export const useValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const validationStore = useValidationStore();
  
  const outputValidator = new OutputValidator();

  const validateContent = useCallback(async (result, params, options = {}) => {
    setIsValidating(true);
    validationStore.startValidation();

    try {
      const validation = await outputValidator.validate(result, params, {
        checkPrintReadiness: true,
        checkVocabularyIntegration: true,
        checkStructuralIntegrity: true,
        checkWidaCompliance: true,
        checkQuality: true,
        qualityThreshold: 0.8,
        ...options
      });

      validationStore.setValidationResults(validation);
      return validation;

    } catch (error) {
      validationStore.setValidationError(error);
      throw error;
    } finally {
      setIsValidating(false);
    }
  }, [outputValidator, validationStore]);

  const validatePrintReadiness = useCallback(async (content) => {
    try {
      const printValidator = outputValidator.printValidator;
      return await printValidator.validate(content);
    } catch (error) {
      console.error('Print validation failed:', error);
      throw error;
    }
  }, [outputValidator]);

  const validateVocabulary = useCallback(async (content) => {
    try {
      const vocabularyValidator = outputValidator.vocabularyValidator;
      return await vocabularyValidator.validate(content);
    } catch (error) {
      console.error('Vocabulary validation failed:', error);
      throw error;
    }
  }, [outputValidator]);

  return {
    validateContent,
    validatePrintReadiness,
    validateVocabulary,
    isValidating: isValidating || validationStore.isValidating,
    validationResults: validationStore.validationResults,
    validationError: validationStore.validationError,
    qualityScore: validationStore.qualityScore,
    clearValidation: validationStore.clearValidation
  };
};

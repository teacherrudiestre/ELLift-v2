// src/features/adaptation/hooks/useFormValidation.js
import { useMemo } from 'react';
import { useAdaptationStore } from '../../../store';

export const useFormValidation = () => {
  const {
    originalMaterial,
    materialType,
    subject,
    proficiencyLevel,
    includeBilingualSupport,
    nativeLanguage
  } = useAdaptationStore();

  const validation = useMemo(() => {
    const errors = {};
    const missingFields = [];
    
    // Required field validation
    if (!originalMaterial?.trim()) {
      errors.originalMaterial = 'Material content is required';
      missingFields.push('Material Content');
    }
    
    if (!materialType) {
      errors.materialType = 'Material type is required';
      missingFields.push('Material Type');
    }
    
    if (!subject) {
      errors.subject = 'Subject is required';
      missingFields.push('Subject');
    }
    
    if (!proficiencyLevel) {
      errors.proficiencyLevel = 'WIDA proficiency level is required';
      missingFields.push('WIDA Proficiency Level');
    }
    
    // Conditional validation
    if (includeBilingualSupport && !nativeLanguage) {
      errors.nativeLanguage = 'Native language is required when bilingual support is enabled';
      missingFields.push('Native Language');
    }
    
    // Content length validation
    if (originalMaterial && originalMaterial.length > 50000) {
      errors.originalMaterial = 'Content is too long (maximum 50,000 characters)';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      missingFields,
      hasErrors: Object.keys(errors).length > 0
    };
  }, [originalMaterial, materialType, subject, proficiencyLevel, includeBilingualSupport, nativeLanguage]);

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'originalMaterial':
        if (!value?.trim()) return 'Material content is required';
        if (value.length > 50000) return 'Content is too long (maximum 50,000 characters)';
        return null;
        
      case 'materialType':
        return !value ? 'Material type is required' : null;
        
      case 'subject':
        return !value ? 'Subject is required' : null;
        
      case 'proficiencyLevel':
        return !value ? 'WIDA proficiency level is required' : null;
        
      case 'nativeLanguage':
        return (includeBilingualSupport && !value) ? 'Native language is required when bilingual support is enabled' : null;
        
      default:
        return null;
    }
  };

  return {
    validation,
    validateField,
    isValid: validation.isValid,
    errors: validation.errors,
    missingFields: validation.missingFields
  };
};
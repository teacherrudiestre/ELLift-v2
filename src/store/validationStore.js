// src/store/validationStore.js - Validation results and feedback
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useValidationStore = create()(
  devtools(
    (set, get) => ({
      // Current validation state
      validationResults: null,
      isValidating: false,
      validationError: null,
      
      // Quality metrics
      qualityScore: null,
      qualityBreakdown: null,
      
      // Validation history
      validationHistory: [],
      
      // Validation settings
      settings: {
        enablePrintValidation: true,
        enableVocabularyValidation: true,
        enableStructureValidation: true,
        enableWidaValidation: true,
        qualityThreshold: 0.8
      },
      
      // Actions
      startValidation: () => set({
        isValidating: true,
        validationError: null
      }),
      
      setValidationResults: (results) => set((state) => ({
        validationResults: results,
        isValidating: false,
        qualityScore: results.qualityScore,
        qualityBreakdown: results.breakdown,
        validationHistory: [
          {
            timestamp: new Date().toISOString(),
            results,
            qualityScore: results.qualityScore
          },
          ...state.validationHistory.slice(0, 9) // Keep last 10
        ]
      })),
      
      setValidationError: (error) => set({
        validationError: error,
        isValidating: false
      }),
      
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      
      clearValidation: () => set({
        validationResults: null,
        validationError: null,
        qualityScore: null,
        qualityBreakdown: null
      })
    }),
    { name: 'validation-store' }
  )
);
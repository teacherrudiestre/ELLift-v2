// src/store/uiStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useUIStore = create()(
  devtools(
    (set, get) => ({
      // Processing state
      isLoading: false,
      processingStep: '',
      error: '',
      successMessage: '',
      
      // UI state
      showImageFeatures: false,
      
      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setProcessingStep: (step) => set({ processingStep: step }),
      setError: (error) => set({ error, successMessage: '' }),
      setSuccessMessage: (message) => set({ successMessage: message, error: '' }),
      setShowImageFeatures: (show) => set({ showImageFeatures: show }),
      
      // Clear all messages
      clearMessages: () => set({ 
        error: '', 
        successMessage: '', 
        processingStep: '' 
      }),
      
      // Auto-clear success messages after delay
      setSuccessWithAutoClear: (message, delay = 3000) => {
        set({ successMessage: message, error: '' });
        setTimeout(() => {
          const currentMessage = get().successMessage;
          if (currentMessage === message) {
            set({ successMessage: '' });
          }
        }, delay);
      },
      
      // Auto-clear processing step when not loading
      clearProcessingStep: (delay = 3000) => {
        setTimeout(() => {
          const isLoading = get().isLoading;
          if (!isLoading) {
            set({ processingStep: '' });
          }
        }, delay);
      }
    }),
    { name: 'ui-store' }
  )
);
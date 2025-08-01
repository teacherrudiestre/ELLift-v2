// src/store/processingStore.js - Enhanced processing state management
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useProcessingStore = create()(
  devtools(
    (set, get) => ({
      // Processing state
      isProcessing: false,
      currentStep: '',
      progress: 0,
      totalSteps: 0,
      processingStartTime: null,
      
      // Current job
      currentJob: null,
      jobHistory: [],
      
      // Processing queue
      queue: [],
      
      // Error state
      processingError: null,
      lastError: null,
      
      // Performance metrics
      metrics: {
        totalJobs: 0,
        successfulJobs: 0,
        failedJobs: 0,
        averageProcessingTime: 0,
        totalProcessingTime: 0
      },
      
      // Actions
      startProcessing: (jobId, params) => set((state) => ({
        isProcessing: true,
        currentJob: {
          id: jobId,
          params,
          startTime: Date.now(),
          status: 'running'
        },
        processingStartTime: Date.now(),
        progress: 0,
        totalSteps: 0,
        currentStep: 'Initializing...',
        processingError: null
      })),
      
      updateProgress: (step, progress, totalSteps) => set({
        currentStep: step,
        progress,
        totalSteps
      }),
      
      completeProcessing: (result) => set((state) => {
        const processingTime = Date.now() - state.processingStartTime;
        const newMetrics = {
          ...state.metrics,
          totalJobs: state.metrics.totalJobs + 1,
          successfulJobs: state.metrics.successfulJobs + 1,
          totalProcessingTime: state.metrics.totalProcessingTime + processingTime,
          averageProcessingTime: (state.metrics.totalProcessingTime + processingTime) / (state.metrics.totalJobs + 1)
        };
        
        return {
          isProcessing: false,
          currentJob: null,
          currentStep: '',
          progress: 100,
          jobHistory: [
            {
              ...state.currentJob,
              endTime: Date.now(),
              processingTime,
              status: 'completed',
              result
            },
            ...state.jobHistory.slice(0, 9) // Keep last 10
          ],
          metrics: newMetrics
        };
      }),
      
      failProcessing: (error) => set((state) => {
        const processingTime = Date.now() - state.processingStartTime;
        const newMetrics = {
          ...state.metrics,
          totalJobs: state.metrics.totalJobs + 1,
          failedJobs: state.metrics.failedJobs + 1,
          totalProcessingTime: state.metrics.totalProcessingTime + processingTime,
          averageProcessingTime: (state.metrics.totalProcessingTime + processingTime) / (state.metrics.totalJobs + 1)
        };
        
        return {
          isProcessing: false,
          currentJob: null,
          currentStep: '',
          processingError: error,
          lastError: error,
          jobHistory: [
            {
              ...state.currentJob,
              endTime: Date.now(),
              processingTime,
              status: 'failed',
              error
            },
            ...state.jobHistory.slice(0, 9) // Keep last 10
          ],
          metrics: newMetrics
        };
      }),
      
      clearError: () => set({ processingError: null }),
      
      addToQueue: (job) => set((state) => ({
        queue: [...state.queue, { ...job, queuedAt: Date.now() }]
      })),
      
      removeFromQueue: (jobId) => set((state) => ({
        queue: state.queue.filter(job => job.id !== jobId)
      })),
      
      clearQueue: () => set({ queue: [] }),
      
      resetMetrics: () => set({
        metrics: {
          totalJobs: 0,
          successfulJobs: 0,
          failedJobs: 0,
          averageProcessingTime: 0,
          totalProcessingTime: 0
        }
      })
    }),
    { name: 'processing-store' }
  )
);

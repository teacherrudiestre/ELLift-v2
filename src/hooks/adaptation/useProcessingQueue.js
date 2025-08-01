// src/hooks/adaptation/useProcessingQueue.js
import { useState, useCallback, useRef } from 'react';
import { useProcessingStore } from '../../store';

export const useProcessingQueue = (config = {}) => {
  const [queueStatus, setQueueStatus] = useState({
    pending: [],
    active: [],
    completed: [],
    failed: []
  });

  const processingStore = useProcessingStore();
  const queueRef = useRef([]);
  const processingRef = useRef(false);

  // Add job to queue
  const addToQueue = useCallback(async (jobFn, options = {}) => {
    const {
      priority = 'normal',
      id = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timeout = 300000, // 5 minutes
      retries = 3
    } = options;

    const job = {
      id,
      jobFn,
      priority,
      timeout,
      retries,
      attempts: 0,
      status: 'pending',
      createdAt: Date.now(),
      ...options
    };

    // Add to queue with priority ordering
    const priorityOrder = { critical: 0, high: 1, normal: 2, low: 3 };
    const insertIndex = queueRef.current.findIndex(
      existingJob => priorityOrder[existingJob.priority] > priorityOrder[priority]
    );

    if (insertIndex === -1) {
      queueRef.current.push(job);
    } else {
      queueRef.current.splice(insertIndex, 0, job);
    }

    updateQueueStatus();
    
    // Start processing if not already running
    if (!processingRef.current) {
      processQueue();
    }

    // Return a promise that resolves when the job completes
    return new Promise((resolve, reject) => {
      job.resolve = resolve;
      job.reject = reject;
    });
  }, []);

  // Process the queue
  const processQueue = useCallback(async () => {
    if (processingRef.current || queueRef.current.length === 0) {
      return;
    }

    processingRef.current = true;

    while (queueRef.current.length > 0) {
      const job = queueRef.current.shift();
      
      try {
        // Update job status
        job.status = 'active';
        job.startedAt = Date.now();
        updateQueueStatus();

        // Execute the job with timeout
        const result = await executeWithTimeout(job.jobFn(), job.timeout);
        
        // Job completed successfully
        job.status = 'completed';
        job.completedAt = Date.now();
        job.duration = job.completedAt - job.startedAt;
        job.result = result;
        
        updateQueueStatus();
        
        if (job.resolve) {
          job.resolve(result);
        }

      } catch (error) {
        job.attempts++;
        
        if (job.attempts < job.retries) {
          // Retry the job
          job.status = 'retrying';
          job.lastError = error;
          
          // Add back to queue with delay
          setTimeout(() => {
            queueRef.current.unshift(job); // Add to front for retry
            updateQueueStatus();
          }, 1000 * job.attempts); // Exponential backoff
          
        } else {
          // Job failed permanently
          job.status = 'failed';
          job.completedAt = Date.now();
          job.duration = job.completedAt - job.startedAt;
          job.error = error;
          
          updateQueueStatus();
          
          if (job.reject) {
            job.reject(error);
          }
        }
      }
    }

    processingRef.current = false;
  }, []);

  // Execute job with timeout
  const executeWithTimeout = (promise, timeout) => {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Job timeout')), timeout)
      )
    ]);
  };

  // Update queue status
  const updateQueueStatus = useCallback(() => {
    const allJobs = [...queueRef.current];
    
    setQueueStatus({
      pending: allJobs.filter(job => job.status === 'pending'),
      active: allJobs.filter(job => job.status === 'active'),
      retrying: allJobs.filter(job => job.status === 'retrying'),
      completed: allJobs.filter(job => job.status === 'completed').slice(0, 10), // Keep last 10
      failed: allJobs.filter(job => job.status === 'failed').slice(0, 10) // Keep last 10
    });
  }, []);

  // Clear completed and failed jobs
  const clearHistory = useCallback(() => {
    // Keep only pending and active jobs
    queueRef.current = queueRef.current.filter(job => 
      job.status === 'pending' || job.status === 'active' || job.status === 'retrying'
    );
    updateQueueStatus();
  }, [updateQueueStatus]);

  // Cancel a specific job
  const cancelJob = useCallback((jobId) => {
    const jobIndex = queueRef.current.findIndex(job => job.id === jobId);
    if (jobIndex !== -1) {
      const job = queueRef.current[jobIndex];
      
      if (job.status === 'pending' || job.status === 'retrying') {
        // Remove from queue
        queueRef.current.splice(jobIndex, 1);
        job.status = 'cancelled';
        
        if (job.reject) {
          job.reject(new Error('Job cancelled'));
        }
        
        updateQueueStatus();
        return true;
      }
    }
    return false;
  }, [updateQueueStatus]);

  // Clear all pending jobs
  const clearQueue = useCallback(() => {
    const pendingJobs = queueRef.current.filter(job => job.status === 'pending');
    
    // Cancel all pending jobs
    pendingJobs.forEach(job => {
      job.status = 'cancelled';
      if (job.reject) {
        job.reject(new Error('Queue cleared'));
      }
    });

    // Keep only active jobs
    queueRef.current = queueRef.current.filter(job => job.status === 'active');
    updateQueueStatus();
  }, [updateQueueStatus]);

  // Get queue statistics
  const getQueueStats = useCallback(() => {
    const allJobs = [...queueRef.current];
    const stats = {
      total: allJobs.length,
      pending: allJobs.filter(job => job.status === 'pending').length,
      active: allJobs.filter(job => job.status === 'active').length,
      completed: allJobs.filter(job => job.status === 'completed').length,
      failed: allJobs.filter(job => job.status === 'failed').length,
      retrying: allJobs.filter(job => job.status === 'retrying').length
    };

    // Calculate average processing time
    const completedJobs = allJobs.filter(job => job.status === 'completed' && job.duration);
    if (completedJobs.length > 0) {
      stats.averageProcessingTime = completedJobs.reduce((sum, job) => sum + job.duration, 0) / completedJobs.length;
    }

    // Calculate success rate
    const finishedJobs = allJobs.filter(job => job.status === 'completed' || job.status === 'failed');
    if (finishedJobs.length > 0) {
      stats.successRate = stats.completed / finishedJobs.length;
    }

    return stats;
  }, []);

  return {
    addToQueue,
    cancelJob,
    clearQueue,
    clearHistory,
    queueStatus,
    queueStats: getQueueStats(),
    isProcessing: processingRef.current
  };
};
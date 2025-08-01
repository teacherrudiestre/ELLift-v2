// src/hooks/api/useAPIQueue.js
import { useState, useCallback, useRef } from 'react';
import { RequestQueue } from '../../services/api/base/RequestQueue';

export const useAPIQueue = (config = {}) => {
  const [queueStatus, setQueueStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const queueRef = useRef(null);

  // Initialize queue
  const getQueue = useCallback(() => {
    if (!queueRef.current) {
      queueRef.current = new RequestQueue({
        maxConcurrent: 2,
        maxRetries: 3,
        retryDelay: 1000,
        ...config
      });
    }
    return queueRef.current;
  }, [config]);

  // Add request to queue
  const addRequest = useCallback(async (requestFn, options = {}) => {
    const queue = getQueue();
    setIsProcessing(true);
    
    try {
      const result = await queue.add(requestFn, options);
      return result;
    } finally {
      setQueueStatus(queue.getQueueStatus());
      setIsProcessing(queue.activeRequests.size > 0);
    }
  }, [getQueue]);

  // Get queue status
  const getStatus = useCallback(() => {
    const queue = queueRef.current;
    if (!queue) return null;
    
    const status = queue.getQueueStatus();
    setQueueStatus(status);
    return status;
  }, []);

  // Clear queue
  const clearQueue = useCallback(() => {
    const queue = queueRef.current;
    if (queue) {
      queue.clear();
      setQueueStatus(queue.getQueueStatus());
      setIsProcessing(false);
    }
  }, []);

  return {
    addRequest,
    getStatus,
    clearQueue,
    queueStatus,
    isProcessing
  };
};
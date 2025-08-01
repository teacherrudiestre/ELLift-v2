// src/hooks/api/useClaudeAPI.js
import { useState, useCallback, useRef } from 'react';
import { ClaudeClient } from '../../services/api/claude/ClaudeClient';

export const useClaudeAPI = (config = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  
  const clientRef = useRef(null);

  // Initialize client
  const getClient = useCallback(() => {
    if (!clientRef.current) {
      clientRef.current = new ClaudeClient({
        maxRetries: 3,
        timeout: 60000,
        rateLimit: {
          requestsPerMinute: 50,
          tokensPerMinute: 40000
        },
        ...config
      });
    }
    return clientRef.current;
  }, [config]);

  // Generate adaptation
  const generateAdaptation = useCallback(async (prompt, options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const client = getClient();
      const result = await client.generateAdaptation(prompt, options);
      
      // Update stats
      setStats(client.getStats());
      
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getClient]);

  // Generate JSON response
  const generateJSON = useCallback(async (prompt, options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const client = getClient();
      const result = await client.generateJSON(prompt, options);
      
      // Update stats
      setStats(client.getStats());
      
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getClient]);

  // Get rate limit status
  const getRateLimitStatus = useCallback(() => {
    const client = clientRef.current;
    return client ? client.rateLimiter.getStatus() : null;
  }, []);

  // Reset client stats
  const resetStats = useCallback(() => {
    const client = clientRef.current;
    if (client) {
      client.resetStats();
      setStats(client.getStats());
    }
  }, []);

  return {
    generateAdaptation,
    generateJSON,
    getRateLimitStatus,
    resetStats,
    isLoading,
    error,
    stats,
    client: clientRef.current
  };
};
// src/utils/constants/adaptationConstants.js
export const adaptationConstants = {
  // Processing strategies
  STRATEGIES: {
    DIRECT: 'direct',
    STANDARD: 'standard', 
    CHUNKED: 'chunked',
    TWO_STEP: 'two_step',
    MULTI_STEP: 'multi_step'
  },

  // Complexity thresholds
  COMPLEXITY: {
    VERY_SIMPLE: { min: 0, max: 3 },
    SIMPLE: { min: 3, max: 6 },
    MODERATE: { min: 6, max: 9 },
    COMPLEX: { min: 9, max: 12 },
    VERY_COMPLEX: { min: 12, max: 20 }
  },

  // Token limits
  TOKENS: {
    DEFAULT_MAX: 4096,
    EXTENDED_MAX: 8192,
    CHUNK_SIZE: 2000,
    SAFETY_MARGIN: 500
  },

  // Quality thresholds
  QUALITY: {
    MINIMUM_ACCEPTABLE: 0.6,
    GOOD: 0.8,
    EXCELLENT: 0.9
  },

  // Processing timeouts
  TIMEOUTS: {
    ANALYSIS: 30000,      // 30 seconds
    ADAPTATION: 120000,   // 2 minutes
    VALIDATION: 60000,    // 1 minute
    TOTAL: 300000         // 5 minutes
  },

  // Retry configuration
  RETRIES: {
    MAX_ATTEMPTS: 3,
    BACKOFF_DELAY: 1000,
    BACKOFF_MULTIPLIER: 2
  }
};
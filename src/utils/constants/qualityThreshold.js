// src/utils/constants/qualityThresholds.js
export const qualityThresholds = {
  // Overall quality levels
  QUALITY_LEVELS: {
    EXCELLENT: 0.9,
    GOOD: 0.8,
    ACCEPTABLE: 0.7,
    NEEDS_IMPROVEMENT: 0.6,
    POOR: 0.0
  },

  // Component-specific thresholds
  COMPONENT_THRESHOLDS: {
    print_readiness: {
      minimum: 0.8,
      target: 0.95
    },
    vocabulary_integration: {
      minimum: 0.7,
      target: 0.9
    },
    structure_validity: {
      minimum: 0.8,
      target: 0.95
    },
    wida_compliance: {
      minimum: 0.8,
      target: 0.9
    },
    overall_quality: {
      minimum: 0.7,
      target: 0.85
    }
  },

  // Severity levels for issues
  ISSUE_SEVERITY: {
    CRITICAL: {
      weight: 1.0,
      threshold: 0.0,
      description: 'Must be fixed before use'
    },
    MAJOR: {
      weight: 0.5,
      threshold: 0.3,
      description: 'Should be addressed'
    },
    MINOR: {
      weight: 0.2,
      threshold: 0.7,
      description: 'Nice to fix'
    }
  },

  // Auto-fix capabilities
  AUTO_FIX_PATTERNS: {
    placeholders: {
      fixable: true,
      confidence: 0.9
    },
    formatting: {
      fixable: true,
      confidence: 0.95
    },
    numbering: {
      fixable: true,
      confidence: 0.8
    },
    vocabulary: {
      fixable: false,
      confidence: 0.0
    }
  }
};
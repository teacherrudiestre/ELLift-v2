// src/hooks/adaptation/useContentAnalysis.js
import { useState, useCallback } from 'react';
import { ContentAnalyzer } from '../../services/adaptation/analyzers/ContentAnalyzer';
import { ComplexityAnalyzer } from '../../services/adaptation/analyzers/ComplexityAnalyzer';

export const useContentAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  const contentAnalyzer = new ContentAnalyzer();
  const complexityAnalyzer = new ComplexityAnalyzer();

  const analyzeContent = useCallback(async (content, params = {}) => {
    if (!content || content.trim().length === 0) {
      throw new Error('Content is required for analysis');
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // Perform comprehensive analysis
      const [contentAnalysis, complexityAnalysis] = await Promise.all([
        contentAnalyzer.analyze(content),
        complexityAnalyzer.analyze(content, params.subject, params.gradeLevel)
      ]);

      const result = {
        content: contentAnalysis,
        complexity: complexityAnalysis,
        recommendations: generateAnalysisRecommendations(contentAnalysis, complexityAnalysis),
        timestamp: new Date().toISOString()
      };

      setAnalysisResult(result);
      return result;

    } catch (error) {
      setAnalysisError(error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, [contentAnalyzer, complexityAnalyzer]);

  const clearAnalysis = useCallback(() => {
    setAnalysisResult(null);
    setAnalysisError(null);
  }, []);

  return {
    analyzeContent,
    clearAnalysis,
    isAnalyzing,
    analysisResult,
    analysisError
  };
};

// Helper function for analysis recommendations
const generateAnalysisRecommendations = (contentAnalysis, complexityAnalysis) => {
  const recommendations = [];

  // Content type recommendations
  if (contentAnalysis.contentType.confidence < 0.7) {
    recommendations.push({
      type: 'content_structure',
      priority: 'medium',
      message: 'Content type detection uncertain - consider adding clearer structure',
      suggestion: 'Add headers, organize sections, or clarify the material type'
    });
  }

  // Complexity recommendations
  if (complexityAnalysis.overall.needsExtensiveSimplification) {
    recommendations.push({
      type: 'complexity',
      priority: 'high',
      message: 'Content is highly complex and needs extensive simplification',
      suggestion: 'Consider breaking into smaller chunks or using two-step processing'
    });
  } else if (complexityAnalysis.overall.needsSimplification) {
    recommendations.push({
      type: 'complexity',
      priority: 'medium',
      message: 'Content complexity is above grade level',
      suggestion: 'Standard adaptation should handle this appropriately'
    });
  }

  // Length recommendations
  if (contentAnalysis.metrics.wordCount > 2000) {
    recommendations.push({
      type: 'length',
      priority: 'medium',
      message: 'Content is quite long and may benefit from chunked processing',
      suggestion: 'Consider the two-step or chunked processing strategy'
    });
  }

  // Math content recommendations
  if (contentAnalysis.mathematical.isMathematical) {
    recommendations.push({
      type: 'subject_specific',
      priority: 'low',
      message: 'Mathematical content detected',
      suggestion: 'Math-specific adaptations will be applied automatically'
    });
  }

  return recommendations;
};
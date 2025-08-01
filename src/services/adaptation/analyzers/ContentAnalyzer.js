// src/services/adaptation/analyzers/ContentAnalyzer.js
import { contentPatterns } from '../../../utils/adaptation/contentPatterns';
import { StructureAnalyzer } from './StructureAnalyzer';
import { LanguageAnalyzer } from './LanguageAnalyzer';

export class ContentAnalyzer {
  constructor() {
    this.structureAnalyzer = new StructureAnalyzer();
    this.languageAnalyzer = new LanguageAnalyzer();
  }

  /**
   * Comprehensive content analysis
   */
  async analyze(content) {
    const results = await Promise.all([
      this.analyzeBasicMetrics(content),
      this.analyzeStructure(content),
      this.analyzeLanguage(content),
      this.analyzeContentType(content),
      this.analyzeQuestionTypes(content),
      this.analyzeMathematicalContent(content)
    ]);

    return {
      metrics: results[0],
      structure: results[1],
      language: results[2],
      contentType: results[3],
      questionTypes: results[4],
      mathematical: results[5],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Basic content metrics
   */
  analyzeBasicMetrics(content) {
    const words = content.split(/\s+/).filter(word => word.length > 0);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      characterCount: content.length,
      characterCountNoSpaces: content.replace(/\s/g, '').length,
      averageWordsPerSentence: words.length / Math.max(sentences.length, 1),
      averageSentencesPerParagraph: sentences.length / Math.max(paragraphs.length, 1),
      estimatedReadingTime: Math.ceil(words.length / 200) // Average reading speed
    };
  }

  /**
   * Document structure analysis
   */
  analyzeStructure(content) {
    return this.structureAnalyzer.analyze(content);
  }

  /**
   * Language complexity analysis
   */
  analyzeLanguage(content) {
    return this.languageAnalyzer.analyze(content);
  }

  /**
   * Content type detection
   */
  analyzeContentType(content) {
    const lowerContent = content.toLowerCase();
    const patterns = contentPatterns.getPatterns();
    
    const scores = {};
    
    // Score each content type
    Object.entries(patterns).forEach(([type, pattern]) => {
      scores[type] = this.calculatePatternScore(content, pattern);
    });
    
    // Find the highest scoring type
    const primaryType = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    return {
      primaryType,
      scores,
      confidence: scores[primaryType],
      isMultiType: Object.values(scores).filter(score => score > 0.3).length > 1
    };
  }

  /**
   * Question type analysis
   */
  analyzeQuestionTypes(content) {
    const questionPatterns = {
      multipleChoice: /^\s*[A-D][\.\)]/gm,
      fillInBlank: /_{3,}|\(\s*\)|\[\s*\]/g,
      shortAnswer: /\?\s*$/gm,
      essay: /(explain|describe|analyze|discuss|compare|contrast).*\?/gi,
      trueFalse: /(true|false).*\?/gi,
      matching: /(match|pair|connect).*with/gi
    };

    const results = {};
    let totalQuestions = 0;

    Object.entries(questionPatterns).forEach(([type, pattern]) => {
      const matches = content.match(pattern) || [];
      results[type] = matches.length;
      totalQuestions += matches.length;
    });

    return {
      types: results,
      totalQuestions,
      hasQuestions: totalQuestions > 0,
      dominantType: Object.entries(results)
        .sort(([,a], [,b]) => b - a)[0][0]
    };
  }

  /**
   * Mathematical content analysis
   */
  analyzeMathematicalContent(content) {
    const mathPatterns = {
      numbers: /\b\d+(?:\.\d+)?\b/g,
      operations: /[+\-×÷*/=<>≤≥]/g,
      fractions: /\d+\/\d+/g,
      percentages: /\d+%/g,
      equations: /[a-zA-Z]\s*[=<>]/g,
      coordinates: /\(\s*[\d\-]+\s*,\s*[\d\-]+\s*\)/g,
      measurements: /\d+\s*(cm|mm|m|km|in|ft|yd|mi|g|kg|lb|oz|ml|l|gal)/gi
    };

    const results = {};
    let totalMathElements = 0;

    Object.entries(mathPatterns).forEach(([type, pattern]) => {
      const matches = content.match(pattern) || [];
      results[type] = matches.length;
      totalMathElements += matches.length;
    });

    return {
      elements: results,
      totalElements: totalMathElements,
      isMathematical: totalMathElements > 5,
      mathDensity: totalMathElements / Math.max(content.split(/\s+/).length, 1)
    };
  }

  /**
   * Calculate pattern matching score
   */
  calculatePatternScore(content, pattern) {
    let score = 0;
    const lowerContent = content.toLowerCase();

    // Check keywords
    if (pattern.keywords) {
      const keywordMatches = pattern.keywords.filter(keyword => 
        lowerContent.includes(keyword.toLowerCase())
      ).length;
      score += (keywordMatches / pattern.keywords.length) * 0.4;
    }

    // Check structures
    if (pattern.structures) {
      const structureMatches = pattern.structures.filter(regex => 
        regex.test(content)
      ).length;
      score += (structureMatches / pattern.structures.length) * 0.6;
    }

    return Math.min(score, 1.0);
  }
}
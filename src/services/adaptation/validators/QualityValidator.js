// src/services/adaptation/validators/QualityValidator.js
export class QualityValidator {
  constructor() {
    this.qualityMetrics = {
      completeness: 0.25,
      accuracy: 0.25,
      appropriateness: 0.20,
      usability: 0.15,
      alignment: 0.15
    };
  }

  async validate(result, params) {
    const scores = {
      completeness: await this.assessCompleteness(result, params),
      accuracy: await this.assessAccuracy(result, params),
      appropriateness: await this.assessAppropriateness(result, params),
      usability: await this.assessUsability(result),
      alignment: await this.assessWidaAlignment(result, params)
    };

    const overallScore = Object.entries(scores)
      .reduce((total, [metric, score]) => total + (score.value * this.qualityMetrics[metric]), 0);

    const issues = Object.values(scores)
      .flatMap(score => score.issues || []);

    return {
      isValid: overallScore >= 0.7,
      score: overallScore,
      weight: 0.3,
      breakdown: scores,
      issues,
      recommendations: this.generateQualityRecommendations(scores, overallScore),
      summary: this.generateQualitySummary(overallScore, issues.length)
    };
  }

  async assessCompleteness(result, params) {
    let score = 1.0;
    const issues = [];

    // Check for essential components
    if (!result.studentWorksheet || result.studentWorksheet.length < 100) {
      score -= 0.5;
      issues.push({
        type: 'completeness',
        severity: 'critical',
        message: 'Student worksheet is missing or too short',
        suggestion: 'Ensure complete student worksheet is generated'
      });
    }

    if (!result.teacherGuide || result.teacherGuide.length < 50) {
      score -= 0.3;
      issues.push({
        type: 'completeness',
        severity: 'major',
        message: 'Teacher guide is missing or inadequate',
        suggestion: 'Generate comprehensive teacher guide'
      });
    }

    // Check content preservation
    const originalWordCount = params.contentToAdapt.split(/\s+/).length;
    const adaptedWordCount = result.studentWorksheet.split(/\s+/).length;
    
    if (adaptedWordCount < originalWordCount * 0.5) {
      score -= 0.2;
      issues.push({
        type: 'completeness',
        severity: 'major',
        message: 'Significant content loss detected',
        suggestion: 'Ensure all original content is preserved and adapted'
      });
    }

    return {
      value: Math.max(0, score),
      issues,
      details: {
        hasStudentWorksheet: !!result.studentWorksheet,
        hasTeacherGuide: !!result.teacherGuide,
        contentPreservation: Math.round((adaptedWordCount / originalWordCount) * 100)
      }
    };
  }

  async assessAccuracy(result, params) {
    let score = 1.0;
    const issues = [];

    // Check for placeholder text
    const placeholders = [
      '[content continues]', '[insert passage]', '...', 'placeholder',
      '{{CONTENT_PLACEHOLDER}}', '[Complete the remaining items]'
    ];

    placeholders.forEach(placeholder => {
      if (result.studentWorksheet.toLowerCase().includes(placeholder.toLowerCase())) {
        score -= 0.3;
        issues.push({
          type: 'accuracy',
          severity: 'critical',
          message: `Contains placeholder text: ${placeholder}`,
          suggestion: 'Remove all placeholder text and provide complete content'
        });
      }
    });

    // Check for proper vocabulary formatting
    if (!/\*\*.*?\*\*/.test(result.studentWorksheet)) {
      score -= 0.1;
      issues.push({
        type: 'accuracy',
        severity: 'minor',
        message: 'No vocabulary bolding detected',
        suggestion: 'Bold key vocabulary terms using **term** format'
      });
    }

    // Check for sequential numbering
    const numberedItems = result.studentWorksheet.match(/^\s*(\d+)\./gm) || [];
    if (numberedItems.length > 1) {
      const numbers = numberedItems.map(item => parseInt(item.match(/\d+/)[0]));
      for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] !== numbers[i-1] + 1) {
          score -= 0.1;
          issues.push({
            type: 'accuracy',
            severity: 'major',
            message: `Numbering error: Found ${numbers[i-1]} followed by ${numbers[i]}`,
            suggestion: 'Fix sequential numbering of questions/items'
          });
          break;
        }
      }
    }

    return {
      value: Math.max(0, score),
      issues,
      details: {
        placeholderCount: placeholders.filter(p => 
          result.studentWorksheet.toLowerCase().includes(p.toLowerCase())
        ).length,
        hasVocabularyFormatting: /\*\*.*?\*\*/.test(result.studentWorksheet),
        numberingSequential: true // Would be calculated above
      }
    };
  }

  async assessAppropriateness(result, params) {
    let score = 1.0;
    const issues = [];

    // Check sentence length appropriateness
    const sentences = result.studentWorksheet.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length;

    const expectedLengths = {
      'entering': 8,
      'emerging': 12,
      'developing': 16,
      'expanding': 20,
      'bridging': 24,
      'reaching': 28
    };

    const expected = expectedLengths[params.proficiencyLevel] || 16;
    const lengthDifference = Math.abs(avgSentenceLength - expected) / expected;

    if (lengthDifference > 0.5) {
      score -= 0.3;
      issues.push({
        type: 'appropriateness',
        severity: 'major',
        message: `Average sentence length (${Math.round(avgSentenceLength)}) not appropriate for ${params.proficiencyLevel} level`,
        suggestion: `Adjust sentence complexity to target ~${expected} words per sentence`
      });
    }

    // Check vocabulary complexity
    const complexWords = this.identifyComplexVocabulary(result.studentWorksheet);
    if (complexWords.length > sentences.length * 0.2) {
      score -= 0.2;
      issues.push({
        type: 'appropriateness',
        severity: 'medium',
        message: 'High density of complex vocabulary detected',
        suggestion: 'Simplify vocabulary or provide more definitions'
      });
    }

    return {
      value: Math.max(0, score),
      issues,
      details: {
        averageSentenceLength: Math.round(avgSentenceLength),
        expectedSentenceLength: expected,
        complexVocabularyCount: complexWords.length,
        appropriatenessScore: score
      }
    };
  }

  async assessUsability(result) {
    let score = 1.0;
    const issues = [];

    // Check for clear structure
    const hasHeaders = /^#+\s+/gm.test(result.studentWorksheet);
    if (!hasHeaders) {
      score -= 0.2;
      issues.push({
        type: 'usability',
        severity: 'minor',
        message: 'No clear section headers found',
        suggestion: 'Add section headers to improve organization'
      });
    }

    // Check for instructions
    const hasInstructions = /(directions?|instructions?):/i.test(result.studentWorksheet);
    if (!hasInstructions) {
      score -= 0.3;
      issues.push({
        type: 'usability',
        severity: 'major',
        message: 'No clear instructions found',
        suggestion: 'Include clear directions for students'
      });
    }

    // Check for consistent formatting
    const formatConsistency = this.checkFormatConsistency(result.studentWorksheet);
    if (formatConsistency < 0.8) {
      score -= 0.2;
      issues.push({
        type: 'usability',
        severity: 'minor',
        message: 'Inconsistent formatting detected',
        suggestion: 'Ensure consistent use of formatting throughout'
      });
    }

    return {
      value: Math.max(0, score),
      issues,
      details: {
        hasHeaders,
        hasInstructions,
        formatConsistency: Math.round(formatConsistency * 100)
      }
    };
  }

  async assessWidaAlignment(result, params) {
    let score = 1.0;
    const issues = [];

    // Check for appropriate supports based on proficiency level
    const supports = this.identifyWidaSupports(result.studentWorksheet);
    const expectedSupports = this.getExpectedSupports(params.proficiencyLevel);

    const missingSupports = expectedSupports.filter(support => !supports.includes(support));
    if (missingSupports.length > 0) {
      score -= 0.4;
      issues.push({
        type: 'alignment',
        severity: 'major',
        message: `Missing expected WIDA supports: ${missingSupports.join(', ')}`,
        suggestion: 'Include appropriate supports for the proficiency level'
      });
    }

    // Check subject alignment
    if (params.subject) {
      const subjectTerms = this.getSubjectTerms(params.subject);
      const hasSubjectContent = subjectTerms.some(term => 
        result.studentWorksheet.toLowerCase().includes(term.toLowerCase())
      );
      
      if (!hasSubjectContent) {
        score -= 0.3;
        issues.push({
          type: 'alignment',
          severity: 'major',
          message: `Content doesn't align with ${params.subject} subject`,
          suggestion: 'Ensure content includes subject-specific vocabulary and concepts'
        });
      }
    }

    return {
      value: Math.max(0, score),
      issues,
      details: {
        identifiedSupports: supports,
        expectedSupports,
        missingSupports,
        subjectAlignment: !!params.subject
      }
    };
  }

  identifyComplexVocabulary(content) {
    const complexPatterns = [
      /\b\w{10,}\b/g, // Long words
      /\b\w+(?:tion|sion|ment|ance|ence|ity|ness)\b/g, // Nominalizations
      /\b(?:analyze|synthesize|evaluate|hypothesis|phenomenon)\b/gi // Academic terms
    ];

    const complexWords = new Set();
    complexPatterns.forEach(pattern => {
      const matches = content.match(pattern) || [];
      matches.forEach(word => complexWords.add(word.toLowerCase()));
    });

    return Array.from(complexWords);
  }

  checkFormatConsistency(content) {
    // Simple consistency check
    const bulletFormats = [
      content.match(/^\s*-\s+/gm) || [],
      content.match(/^\s*\*\s+/gm) || [],
      content.match(/^\s*•\s+/gm) || []
    ];

    const numberedFormats = [
      content.match(/^\s*\d+\.\s+/gm) || [],
      content.match(/^\s*\d+\)\s+/gm) || []
    ];

    // Check if multiple formats are used inconsistently
    const usedBulletFormats = bulletFormats.filter(f => f.length > 0).length;
    const usedNumberedFormats = numberedFormats.filter(f => f.length > 0).length;

    return 1.0 - (Math.max(0, usedBulletFormats - 1) + Math.max(0, usedNumberedFormats - 1)) * 0.2;
  }

  identifyWidaSupports(content) {
    const supports = [];
    
    if (/\*\*.*?\*\*/.test(content)) supports.push('vocabulary_highlighting');
    if (/\[ \]/.test(content)) supports.push('checkboxes');
    if (/(directions?|instructions?):/i.test(content)) supports.push('clear_instructions');
    if (/^\s*\d+\.\s+/gm.test(content)) supports.push('numbered_sequence');
    if (/^#+\s+/gm.test(content)) supports.push('section_headers');

    return supports;
  }

  getExpectedSupports(proficiencyLevel) {
    const levelSupports = {
      'entering': ['vocabulary_highlighting', 'clear_instructions', 'visual_supports'],
      'emerging': ['vocabulary_highlighting', 'clear_instructions', 'sentence_frames'],
      'developing': ['vocabulary_highlighting', 'numbered_sequence', 'section_headers'],
      'expanding': ['vocabulary_highlighting', 'section_headers'],
      'bridging': ['section_headers'],
      'reaching': []
    };

    return levelSupports[proficiencyLevel] || levelSupports['developing'];
  }

  getSubjectTerms(subject) {
    const subjectTerms = {
      'Mathematics': ['equation', 'solve', 'calculate', 'graph', 'number', 'problem'],
      'Science': ['experiment', 'hypothesis', 'observe', 'data', 'conclusion', 'analysis'],
      'English Language Arts': ['character', 'plot', 'theme', 'evidence', 'analyze', 'text'],
      'Social Studies': ['culture', 'government', 'history', 'society', 'geography', 'community']
    };

    return subjectTerms[subject] || [];
  }

  generateQualityRecommendations(scores, overallScore) {
    const recommendations = [];

    Object.entries(scores).forEach(([metric, score]) => {
      if (score.value < 0.8) {
        recommendations.push({
          category: metric,
          priority: score.value < 0.6 ? 'high' : 'medium',
          score: score.value,
          suggestions: score.issues.map(issue => issue.suggestion)
        });
      }
    });

    if (overallScore < 0.7) {
      recommendations.unshift({
        category: 'overall',
        priority: 'high',
        score: overallScore,
        suggestions: ['Consider regenerating with adjusted parameters']
      });
    }

    return recommendations;
  }

  generateQualitySummary(score, issueCount) {
    if (score >= 0.9) return `Excellent quality (${Math.round(score * 100)}%)`;
    if (score >= 0.8) return `Good quality (${Math.round(score * 100)}%)`;
    if (score >= 0.7) return `Acceptable quality (${Math.round(score * 100)}%)`;
    if (score >= 0.6) return `Needs improvement (${Math.round(score * 100)}%) - ${issueCount} issues found`;
    return `Poor quality (${Math.round(score * 100)}%) - ${issueCount} issues found`;
  }
}
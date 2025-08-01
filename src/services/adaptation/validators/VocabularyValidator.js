// src/services/adaptation/validators/VocabularyValidator.js
export class VocabularyValidator {
  constructor() {
    this.vocabularyPatterns = {
      bolded: /\*\*(.*?)\*\*/g,
      definitions: /^(.+):\s*(.+)$/gm,
      academic: /\b(?:analyze|synthesize|evaluate|compare|contrast|explain|describe|identify|classify|summarize)\b/gi
    };
  }

  async validate(content) {
    const analysis = this.analyzeVocabulary(content);
    const score = this.calculateVocabularyScore(analysis);
    const issues = this.identifyVocabularyIssues(analysis, content);

    return {
      isValid: score >= 0.7,
      score,
      weight: 0.25,
      issues,
      analysis,
      summary: this.generateVocabularySummary(analysis, score)
    };
  }

  analyzeVocabulary(content) {
    const boldedTerms = content.match(this.vocabularyPatterns.bolded) || [];
    const definitions = content.match(this.vocabularyPatterns.definitions) || [];
    const academicTerms = content.match(this.vocabularyPatterns.academic) || [];
    
    const words = content.split(/\s+/).length;
    const uniqueBoldedTerms = new Set(boldedTerms.map(term => 
      term.replace(/\*\*/g, '').toLowerCase()
    ));

    return {
      totalWords: words,
      boldedTerms: boldedTerms.length,
      uniqueBoldedTerms: uniqueBoldedTerms.size,
      definitions: definitions.length,
      academicTerms: academicTerms.length,
      vocabularyDensity: boldedTerms.length / Math.max(words / 100, 1),
      hasVocabularySection: /(?:key\s+)?vocabulary|important\s+terms/i.test(content)
    };
  }

  calculateVocabularyScore(analysis) {
    let score = 0;

    // Base score for having vocabulary support
    if (analysis.boldedTerms > 0) score += 0.4;
    if (analysis.hasVocabularySection) score += 0.2;
    if (analysis.definitions > 0) score += 0.2;

    // Density scoring
    if (analysis.vocabularyDensity >= 2 && analysis.vocabularyDensity <= 8) {
      score += 0.2; // Good density
    } else if (analysis.vocabularyDensity > 0) {
      score += 0.1; // Some vocabulary support
    }

    return Math.min(score, 1.0);
  }

  identifyVocabularyIssues(analysis, content) {
    const issues = [];

    if (analysis.boldedTerms === 0) {
      issues.push({
        type: 'vocabulary',
        severity: 'major',
        message: 'No vocabulary terms are bolded or highlighted',
        suggestion: 'Bold key vocabulary terms using **term** format'
      });
    }

    if (analysis.vocabularyDensity < 1) {
      issues.push({
        type: 'vocabulary',
        severity: 'minor',
        message: 'Low vocabulary density - may need more key terms highlighted',
        suggestion: 'Consider highlighting more subject-specific vocabulary'
      });
    }

    if (analysis.vocabularyDensity > 10) {
      issues.push({
        type: 'vocabulary',
        severity: 'minor',
        message: 'High vocabulary density - may overwhelm students',
        suggestion: 'Consider reducing the number of highlighted terms'
      });
    }

    if (!analysis.hasVocabularySection && analysis.boldedTerms > 5) {
      issues.push({
        type: 'vocabulary',
        severity: 'minor',
        message: 'Many vocabulary terms but no vocabulary section',
        suggestion: 'Consider adding a "Key Vocabulary" section with definitions'
      });
    }

    return issues;
  }

  generateVocabularySummary(analysis, score) {
    const summary = `${analysis.uniqueBoldedTerms} unique vocabulary terms highlighted`;
    
    if (score >= 0.8) return `Excellent vocabulary support - ${summary}`;
    if (score >= 0.7) return `Good vocabulary support - ${summary}`;
    if (score >= 0.5) return `Adequate vocabulary support - ${summary}`;
    return `Insufficient vocabulary support - ${summary}`;
  }
}
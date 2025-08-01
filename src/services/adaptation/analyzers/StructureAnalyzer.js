// src/services/adaptation/analyzers/LanguageAnalyzer.js
export class LanguageAnalyzer {
  constructor() {
    this.complexityIndicators = {
      // Sentence complexity markers
      subordinatingConjunctions: ['because', 'although', 'since', 'while', 'whereas', 'unless'],
      coordinatingConjunctions: ['and', 'but', 'or', 'nor', 'for', 'so', 'yet'],
      transitionalPhrases: ['however', 'therefore', 'moreover', 'furthermore', 'consequently'],
      
      // Academic language markers
      academicVocabulary: ['analyze', 'synthesize', 'evaluate', 'compare', 'contrast', 'justify'],
      nominalizations: ['tion', 'sion', 'ment', 'ance', 'ence', 'ity', 'ness'],
      
      // Complexity indicators
      passiveVoice: /\b(?:was|were|is|are|am|be|been|being)\s+\w+ed\b/gi,
      conditionals: /\bif\s+.*\s+(?:would|could|should|might)\b/gi,
      modalVerbs: /\b(?:might|could|should|would|may|can|must|ought)\b/gi
    };
  }

  async analyze(content) {
    const sentences = this.extractSentences(content);
    const words = this.extractWords(content);
    
    return {
      sentenceComplexity: this.analyzeSentenceComplexity(sentences),
      vocabularyComplexity: this.analyzeVocabularyComplexity(words, content),
      syntacticComplexity: this.analyzeSyntacticComplexity(content),
      cohesionMarkers: this.analyzeCohesionMarkers(content),
      overallComplexity: this.calculateOverallLanguageComplexity(sentences, words, content)
    };
  }

  extractSentences(content) {
    return content.split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  extractWords(content) {
    return content.toLowerCase()
      .split(/\s+/)
      .map(w => w.replace(/[^\w]/g, ''))
      .filter(w => w.length > 0);
  }

  analyzeSentenceComplexity(sentences) {
    const analysis = sentences.map(sentence => {
      const words = sentence.split(/\s+/).length;
      const clauses = sentence.split(/[,;:]/).length;
      const subordinating = this.complexityIndicators.subordinatingConjunctions
        .filter(conj => sentence.toLowerCase().includes(conj)).length;
      
      return {
        wordCount: words,
        clauseCount: clauses,
        subordinatingCount: subordinating,
        complexityScore: (words * 0.1) + (clauses * 0.3) + (subordinating * 0.5)
      };
    });

    return {
      averageWordsPerSentence: analysis.reduce((sum, s) => sum + s.wordCount, 0) / sentences.length,
      averageClausesPerSentence: analysis.reduce((sum, s) => sum + s.clauseCount, 0) / sentences.length,
      averageComplexityScore: analysis.reduce((sum, s) => sum + s.complexityScore, 0) / sentences.length,
      sentenceVariety: this.calculateSentenceVariety(analysis)
    };
  }

  analyzeVocabularyComplexity(words, content) {
    const uniqueWords = new Set(words);
    const academicWords = words.filter(word => 
      this.complexityIndicators.academicVocabulary.some(av => word.includes(av))
    );
    
    const nominalizations = words.filter(word =>
      this.complexityIndicators.nominalizations.some(suffix => word.endsWith(suffix))
    );

    return {
      totalWords: words.length,
      uniqueWords: uniqueWords.size,
      lexicalDiversity: uniqueWords.size / words.length,
      academicVocabularyCount: academicWords.length,
      nominalizationCount: nominalizations.length,
      averageWordLength: words.reduce((sum, word) => sum + word.length, 0) / words.length
    };
  }

  analyzeSyntacticComplexity(content) {
    const passiveVoiceMatches = content.match(this.complexityIndicators.passiveVoice) || [];
    const conditionalMatches = content.match(this.complexityIndicators.conditionals) || [];
    const modalMatches = content.match(this.complexityIndicators.modalVerbs) || [];
    
    return {
      passiveVoiceCount: passiveVoiceMatches.length,
      conditionalCount: conditionalMatches.length,
      modalVerbCount: modalMatches.length,
      syntacticComplexityScore: passiveVoiceMatches.length * 0.3 + 
                               conditionalMatches.length * 0.4 + 
                               modalMatches.length * 0.2
    };
  }

  analyzeCohesionMarkers(content) {
    const transitions = this.complexityIndicators.transitionalPhrases
      .filter(phrase => content.toLowerCase().includes(phrase));
    
    const coordinators = this.complexityIndicators.coordinatingConjunctions
      .filter(conj => content.toLowerCase().includes(conj));

    return {
      transitionalPhrases: transitions,
      coordinatingConjunctions: coordinators,
      cohesionScore: (transitions.length * 0.4) + (coordinators.length * 0.2)
    };
  }

  calculateOverallLanguageComplexity(sentences, words, content) {
    // Weighted complexity calculation
    const sentenceComplexity = this.analyzeSentenceComplexity(sentences);
    const vocabularyComplexity = this.analyzeVocabularyComplexity(words, content);
    const syntacticComplexity = this.analyzeSyntacticComplexity(content);
    
    const score = 
      (sentenceComplexity.averageComplexityScore * 0.4) +
      (vocabularyComplexity.lexicalDiversity * 10 * 0.3) +
      (syntacticComplexity.syntacticComplexityScore * 0.3);

    return {
      score,
      level: this.getComplexityLevel(score),
      recommendations: this.generateLanguageRecommendations(score, sentenceComplexity, vocabularyComplexity)
    };
  }

  getComplexityLevel(score) {
    if (score < 2) return 'very_simple';
    if (score < 4) return 'simple';
    if (score < 6) return 'moderate';
    if (score < 8) return 'complex';
    return 'very_complex';
  }

  generateLanguageRecommendations(score, sentenceComplexity, vocabularyComplexity) {
    const recommendations = [];
    
    if (sentenceComplexity.averageWordsPerSentence > 20) {
      recommendations.push('Consider breaking long sentences into shorter ones');
    }
    
    if (vocabularyComplexity.academicVocabularyCount > vocabularyComplexity.totalWords * 0.1) {
      recommendations.push('High academic vocabulary density - provide definitions');
    }
    
    if (score > 6) {
      recommendations.push('Language complexity is high - consider simplification');
    }
    
    return recommendations;
  }

  calculateSentenceVariety(analysis) {
    const lengths = analysis.map(s => s.wordCount);
    const mean = lengths.reduce((sum, len) => sum + len, 0) / lengths.length;
    const variance = lengths.reduce((sum, len) => sum + Math.pow(len - mean, 2), 0) / lengths.length;
    return Math.sqrt(variance) / mean; // Coefficient of variation
  }
}
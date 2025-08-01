// src/services/adaptation/analyzers/ComplexityAnalyzer.js
export class ComplexityAnalyzer {
  constructor() {
    this.readabilityCalculator = new ReadabilityCalculator();
    this.vocabularyAnalyzer = new VocabularyAnalyzer();
  }

  /**
   * Comprehensive complexity analysis
   */
  async analyze(content, subject = null, gradeLevel = null) {
    const results = await Promise.all([
      this.analyzeReadability(content),
      this.analyzeVocabulary(content, subject),
      this.analyzeStructuralComplexity(content),
      this.analyzeCognitiveLoad(content),
      this.analyzeSubjectSpecificComplexity(content, subject)
    ]);

    const complexity = this.calculateOverallComplexity(results, gradeLevel);

    return {
      readability: results[0],
      vocabulary: results[1],
      structural: results[2],
      cognitive: results[3],
      subjectSpecific: results[4],
      overall: complexity,
      recommendations: this.generateRecommendations(complexity, gradeLevel)
    };
  }

  /**
   * Readability analysis (Flesch-Kincaid, etc.)
   */
  analyzeReadability(content) {
    return this.readabilityCalculator.calculate(content);
  }

  /**
   * Vocabulary complexity analysis
   */
  analyzeVocabulary(content, subject) {
    return this.vocabularyAnalyzer.analyze(content, subject);
  }

  /**
   * Structural complexity (sentence structure, paragraph organization)
   */
  analyzeStructuralComplexity(content) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    // Analyze sentence complexity
    const sentenceComplexity = sentences.map(sentence => {
      const words = sentence.split(/\s+/).length;
      const clauses = sentence.split(/[,;:]/).length;
      const conjunctions = (sentence.match(/\b(and|but|or|because|although|however|therefore|moreover)\b/gi) || []).length;
      
      return {
        wordCount: words,
        clauseCount: clauses,
        conjunctionCount: conjunctions,
        complexity: (words * 0.1) + (clauses * 0.3) + (conjunctions * 0.2)
      };
    });

    const avgSentenceComplexity = sentenceComplexity.reduce((sum, s) => sum + s.complexity, 0) / sentences.length;
    
    return {
      averageSentenceLength: sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length,
      averageClausesPerSentence: sentenceComplexity.reduce((sum, s) => sum + s.clauseCount, 0) / sentences.length,
      averageParagraphLength: sentences.length / paragraphs.length,
      sentenceComplexityScore: avgSentenceComplexity,
      structuralVariety: this.calculateStructuralVariety(sentences),
      organizationScore: this.calculateOrganizationScore(paragraphs)
    };
  }

  /**
   * Cognitive load analysis
   */
  analyzeCognitiveLoad(content) {
    const concepts = this.extractConcepts(content);
    const abstractConcepts = concepts.filter(c => c.isAbstract).length;
    const concreteConcepts = concepts.filter(c => !c.isAbstract).length;
    
    return {
      totalConcepts: concepts.length,
      abstractConcepts,
      concreteConcepts,
      conceptDensity: concepts.length / Math.max(content.split(/\s+/).length / 100, 1),
      cognitiveLoadScore: this.calculateCognitiveLoad(concepts, content),
      processingDemand: this.calculateProcessingDemand(content)
    };
  }

  /**
   * Subject-specific complexity analysis
   */
  analyzeSubjectSpecificComplexity(content, subject) {
    if (!subject) return { score: 0, factors: [] };

    const subjectAnalyzers = {
      'Mathematics': () => this.analyzeMathComplexity(content),
      'Science': () => this.analyzeScienceComplexity(content),
      'English Language Arts': () => this.analyzeELAComplexity(content),
      'Social Studies': () => this.analyzeSocialStudiesComplexity(content),
      'History': () => this.analyzeHistoryComplexity(content)
    };

    const analyzer = subjectAnalyzers[subject] || (() => ({ score: 0, factors: [] }));
    return analyzer();
  }

  /**
   * Calculate overall complexity score
   */
  calculateOverallComplexity(results, gradeLevel) {
    const [readability, vocabulary, structural, cognitive, subjectSpecific] = results;
    
    const weights = {
      readability: 0.25,
      vocabulary: 0.25,
      structural: 0.20,
      cognitive: 0.20,
      subjectSpecific: 0.10
    };

    const score = 
      (readability.fleschKincaidGrade * weights.readability) +
      (vocabulary.complexityScore * weights.vocabulary) +
      (structural.sentenceComplexityScore * weights.structural) +
      (cognitive.cognitiveLoadScore * weights.cognitive) +
      (subjectSpecific.score * weights.subjectSpecific);

    return {
      score,
      level: this.getComplexityLevel(score),
      gradeEquivalent: Math.round(score),
      needsSimplification: gradeLevel ? score > this.getGradeTarget(gradeLevel) + 1 : score > 8,
      needsExtensiveSimplification: gradeLevel ? score > this.getGradeTarget(gradeLevel) + 3 : score > 12,
      processingStrategy: this.recommendProcessingStrategy(score, results)
    };
  }

  getComplexityLevel(score) {
    if (score < 3) return 'very_simple';
    if (score < 6) return 'simple';
    if (score < 9) return 'moderate';
    if (score < 12) return 'complex';
    return 'very_complex';
  }

  recommendProcessingStrategy(score, results) {
    if (score < 6) return 'direct';
    if (score < 10) return 'standard';
    if (score < 15) return 'chunked';
    return 'multi_step';
  }
}
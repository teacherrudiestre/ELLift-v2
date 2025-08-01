// src/utils/adaptation/adaptationHelpers.js
export const adaptationHelpers = {
  
  // Content splitting utilities
  splitContentIntoChunks(content, maxChunkSize = 1500) {
    const paragraphs = content.split(/\n\s*\n/);
    const chunks = [];
    let currentChunk = '';
    
    for (const paragraph of paragraphs) {
      if ((currentChunk + paragraph).length > maxChunkSize && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = paragraph;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  },

  // Content cleaning utilities
  cleanContent(content) {
    return content
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .replace(/[ \t]+/g, ' ') // Normalize spaces
      .replace(/\r\n/g, '\n') // Normalize line endings
      .trim();
  },

  // Extract key elements from content
  extractElements(content) {
    return {
      questions: this.extractQuestions(content),
      instructions: this.extractInstructions(content),
      vocabulary: this.extractVocabulary(content),
      passages: this.extractPassages(content)
    };
  },

  extractQuestions(content) {
    const patterns = [
      /^\s*\d+[\.\)]\s+(.+\?)/gm, // Numbered questions
      /^(.+\?)$/gm // Standalone questions
    ];
    
    const questions = [];
    patterns.forEach(pattern => {
      const matches = content.match(pattern) || [];
      questions.push(...matches);
    });
    
    return [...new Set(questions)];
  },

  extractInstructions(content) {
    const patterns = [
      /(directions?|instructions?):\s*(.*?)(?=\n\s*\n|\n\s*\d+\.)/gsi,
      /^(read|complete|answer|solve|write).*$/gmi
    ];
    
    const instructions = [];
    patterns.forEach(pattern => {
      const matches = content.match(pattern) || [];
      instructions.push(...matches);
    });
    
    return instructions;
  },

  extractVocabulary(content) {
    const boldTerms = content.match(/\*\*(.*?)\*\*/g) || [];
    const definitionTerms = content.match(/^(.+):\s*(.+)$/gm) || [];
    
    return {
      boldTerms: boldTerms.map(term => term.replace(/\*\*/g, '')),
      definitionTerms: definitionTerms.map(def => def.split(':')[0].trim()),
      totalTerms: boldTerms.length + definitionTerms.length
    };
  },

  extractPassages(content) {
    const paragraphs = content.split(/\n\s*\n/);
    return paragraphs.filter(p => {
      const wordCount = p.split(/\s+/).length;
      const hasQuestions = /\?/.test(p);
      const hasInstructions = /(directions?|instructions?|complete|answer)/i.test(p);
      
      return wordCount > 50 && !hasQuestions && !hasInstructions;
    });
  },

  // Validation utilities
  validateContent(content, requirements = {}) {
    const {
      minLength = 10,
      maxLength = 50000,
      requiredElements = [],
      forbiddenPatterns = []
    } = requirements;

    const issues = [];

    // Length validation
    if (content.length < minLength) {
      issues.push(`Content too short (${content.length} < ${minLength} characters)`);
    }
    if (content.length > maxLength) {
      issues.push(`Content too long (${content.length} > ${maxLength} characters)`);
    }

    // Required elements
    requiredElements.forEach(element => {
      if (!content.includes(element)) {
        issues.push(`Missing required element: ${element}`);
      }
    });

    // Forbidden patterns
    forbiddenPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        issues.push(`Contains forbidden pattern: ${pattern}`);
      }
    });

    return {
      isValid: issues.length === 0,
      issues
    };
  },

  // Text analysis utilities
  analyzeReadability(content) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const syllables = words.reduce((total, word) => total + this.countSyllables(word), 0);

    // Flesch Reading Ease
    const avgSentenceLength = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;
    const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);

    // Flesch-Kincaid Grade Level
    const gradeLevel = (0.39 * avgSentenceLength) + (11.8 * avgSyllablesPerWord) - 15.59;

    return {
      fleschScore: Math.max(0, Math.min(100, fleschScore)),
      gradeLevel: Math.max(0, gradeLevel),
      avgSentenceLength,
      avgSyllablesPerWord,
      readingLevel: this.getReadingLevel(fleschScore)
    };
  },

  countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    let syllables = word.match(/[aeiouy]+/g) || [];
    if (word.endsWith('e')) syllables.pop();
    
    return Math.max(1, syllables.length);
  },

  getReadingLevel(fleschScore) {
    if (fleschScore >= 90) return 'very_easy';
    if (fleschScore >= 80) return 'easy';
    if (fleschScore >= 70) return 'fairly_easy';
    if (fleschScore >= 60) return 'standard';
    if (fleschScore >= 50) return 'fairly_difficult';
    if (fleschScore >= 30) return 'difficult';
    return 'very_difficult';
  },

  // Format utilities
  formatForPrint(content) {
    return content
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
      .replace(/#{1,6}\s+/g, '') // Remove markdown headers
      .replace(/\[ \]/g, '☐') // Convert checkboxes
      .replace(/\[x\]/g, '☑') // Convert checked boxes
      .replace(/\n{3,}/g, '\n\n'); // Normalize spacing
  },

  // WIDA level utilities
  getWidaLevelNumber(level) {
    const levelMap = {
      'entering': 1,
      'emerging': 2,
      'developing': 3,
      'expanding': 4,
      'bridging': 5,
      'reaching': 6
    };
    
    return levelMap[level.toLowerCase()] || 3;
  },

  getWidaLevelName(levelNumber) {
    const nameMap = {
      1: 'entering',
      2: 'emerging',
      3: 'developing',
      4: 'expanding',
      5: 'bridging',
      6: 'reaching'
    };
    
    return nameMap[levelNumber] || 'developing';
  }
};
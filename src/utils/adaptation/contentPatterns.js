// src/utils/adaptation/contentPatterns.js
export const contentPatterns = {
  getPatterns() {
    return {
      reading_comprehension: {
        keywords: ['passage', 'story', 'text', 'reading', 'according to'],
        structures: [
          /read the (?:passage|story|text)/i,
          /according to the (?:passage|text|story)/i,
          /in the (?:passage|text|story)/i,
          /the author (?:says|writes|mentions)/i
        ]
      },
      
      mathematics: {
        keywords: ['solve', 'calculate', 'equation', 'graph', 'formula'],
        structures: [
          /\d+\s*[+\-×÷*/]\s*\d+/,
          /solve\s+(?:for\s+)?[a-zA-Z]/i,
          /graph\s+the\s+(?:equation|function)/i,
          /find\s+the\s+(?:value|solution)/i
        ]
      },
      
      science: {
        keywords: ['experiment', 'hypothesis', 'observe', 'conclude', 'data'],
        structures: [
          /form\s+a\s+hypothesis/i,
          /conduct\s+(?:an\s+)?experiment/i,
          /record\s+(?:your\s+)?observations/i,
          /what\s+do\s+you\s+conclude/i
        ]
      },
      
      worksheet: {
        keywords: ['complete', 'fill in', 'answer', 'practice', 'exercise'],
        structures: [
          /^\s*\d+[\.\)]\s+/gm,
          /fill\s+in\s+the\s+blank/i,
          /complete\s+the\s+(?:sentence|table|chart)/i,
          /answer\s+the\s+(?:following\s+)?questions/i
        ]
      },
      
      quiz: {
        keywords: ['test', 'quiz', 'assessment', 'choose', 'select'],
        structures: [
          /^\s*[A-D][\.\)]\s+/gm,
          /choose\s+the\s+(?:best\s+)?answer/i,
          /select\s+(?:all\s+that\s+apply|the\s+correct)/i,
          /true\s+or\s+false/i
        ]
      }
    };
  },

  analyzeContentType(content) {
    const patterns = this.getPatterns();
    const scores = {};
    
    Object.entries(patterns).forEach(([type, pattern]) => {
      scores[type] = this.calculatePatternScore(content, pattern);
    });
    
    const sortedScores = Object.entries(scores)
      .sort(([,a], [,b]) => b - a);
    
    return {
      primaryType: sortedScores[0][0],
      confidence: sortedScores[0][1],
      allScores: scores,
      isAmbiguous: sortedScores[0][1] - sortedScores[1][1] < 0.2
    };
  },

  calculatePatternScore(content, pattern) {
    let score = 0;
    const lowerContent = content.toLowerCase();
    
    // Keyword matching
    if (pattern.keywords) {
      const keywordHits = pattern.keywords.filter(keyword => 
        lowerContent.includes(keyword.toLowerCase())
      ).length;
      score += (keywordHits / pattern.keywords.length) * 0.6;
    }
    
    // Structure matching
    if (pattern.structures) {
      const structureHits = pattern.structures.filter(regex => 
        regex.test(content)
      ).length;
      score += (structureHits / pattern.structures.length) * 0.4;
    }
    
    return Math.min(score, 1.0);
  }
};
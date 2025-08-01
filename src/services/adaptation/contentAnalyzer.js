// src/services/adaptation/contentAnalyzer.js
export const analyzeContentStructure = (content) => {
  const analysis = {
    // Basic metrics
    wordCount: content.split(/\s+/).length,
    lineCount: content.split('\n').length,
    
    // Structural elements
    numberedItems: (content.match(/^\s*\d+[\.\)]/gm) || []).length,
    letterItems: (content.match(/^\s*[a-z][\.\)]/gim) || []).length,
    bulletPoints: (content.match(/^\s*[-•*]/gm) || []).length,
    
    // Question types
    fillInBlanks: (content.match(/_{3,}|\(\s*\)|\[\s*\]/g) || []).length,
    multipleChoice: (content.match(/^\s*[A-D][\.\)]/gm) || []).length,
    openEnded: (content.match(/\?/g) || []).length,
    
    // Content types
    hasMath: /[\d\+\-\*\/\=\<\>\(\)\[\]]/g.test(content),
    hasCoordinates: /\(\s*[\d\-]+\s*,\s*[\d\-]+\s*\)/g.test(content),
    hasFormulas: /[a-zA-Z]\s*=|=\s*[a-zA-Z]|\^|\√|∫|∑/g.test(content),
    
    // Text analysis
    paragraphs: content.split(/\n\s*\n/).filter(p => p.trim()).length,
    sentences: (content.match(/[.!?]+/g) || []).length,
    
    // Special patterns
    measurements: (content.match(/\d+\s*(cm|mm|m|km|in|ft|yd|mi|g|kg|lb|oz|ml|l|gal)/gi) || []).length,
    percentages: (content.match(/\d+%/g) || []).length,
    dates: (content.match(/\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}|\d{4}|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/gi) || []).length,
    
    // Sections and headers
    sections: (content.match(/^\s*[A-Z][^.!?]*:?\s*$/gm) || []).length,
    chapters: (content.match(/chapter|section|part|unit/gi) || []).length
  };
  
  // Determine content type
  analysis.contentType = determineContentType(analysis, content);
  
  // Calculate complexity
  analysis.totalItems = analysis.numberedItems + analysis.letterItems + analysis.bulletPoints;
  analysis.complexity = calculateComplexity(analysis);
  
  return analysis;
};

const determineContentType = (analysis, content) => {
  const lowerContent = content.toLowerCase();
  
  if (analysis.hasMath || analysis.hasCoordinates || analysis.hasFormulas) {
    return 'mathematics';
  }
  
  if (lowerContent.includes('read') && lowerContent.includes('passage')) {
    return 'reading_comprehension';
  }
  
  if (analysis.multipleChoice > analysis.openEnded) {
    return 'multiple_choice_quiz';
  }
  
  if (analysis.fillInBlanks > 5) {
    return 'fill_in_blank';
  }
  
  if (analysis.paragraphs > analysis.totalItems) {
    return 'text_analysis';
  }
  
  if (analysis.totalItems > analysis.paragraphs) {
    return 'problem_set';
  }
  
  return 'mixed_content';
};

const calculateComplexity = (analysis) => {
  const complexityScore = 
    (analysis.wordCount / 100) +
    (analysis.totalItems * 2) +
    (analysis.openEnded * 1.5) +
    (analysis.paragraphs * 0.5);
    
  return {
    score: complexityScore,
    level: complexityScore < 20 ? 'simple' : complexityScore < 50 ? 'moderate' : 'complex',
    needsChunking: complexityScore > 60 || analysis.totalItems > 15 || analysis.wordCount > 2000,
    needsExtendedTokens: complexityScore > 40 || analysis.wordCount > 1500
  };
};

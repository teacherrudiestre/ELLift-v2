// src/services/adaptation/validators.js
export const validateAdaptationParams = (params) => {
  const required = ['subject', 'proficiencyLevel', 'contentToAdapt'];
  const missing = required.filter(field => !params[field]);
  
  if (missing.length > 0) {
    throw new APIError(`Missing required parameters: ${missing.join(', ')}`);
  }
};

export const validatePrintReadiness = (studentWorksheet) => {
  const issues = [];
  
  // Check for placeholder text
  const placeholders = [
    '[Original passage preserved exactly as written]',
    '[Content continues...]',
    '...',
    '[Add more questions here]',
    '[Insert passage here]',
    '[Passage text here]',
    '[Complete the remaining items]',
    'from "Charles Dickens Visits America" through',
    'waiting for audiences.]',
    '[Insert full passage text here]',
    '[Include complete passage]',
    '[Full text goes here]',
    '[Replace with actual passage]'
  ];
  
  placeholders.forEach(placeholder => {
    if (studentWorksheet.includes(placeholder)) {
      issues.push(`Contains placeholder: ${placeholder}`);
    }
  });
  
  // Check for proper sequential numbering
  const numberedItems = studentWorksheet.match(/^\s*(\d+)\./gm) || [];
  if (numberedItems.length > 1) {
    const numbers = numberedItems.map(item => parseInt(item.match(/\d+/)[0]));
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] !== numbers[i-1] + 1) {
        issues.push(`Numbering error: Found ${numbers[i-1]} followed by ${numbers[i]}`);
      }
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues: issues,
    message: issues.length === 0 
      ? 'Worksheet is print-ready' 
      : `Found ${issues.length} print-readiness issues`
  };
};

export const validateVocabularyIntegration = (studentWorksheet) => {
  const vocabularySection = studentWorksheet.match(/## Key Vocabulary(.*?)##/s);
  if (!vocabularySection) return { isValid: true, message: 'No vocabulary section found' };
  
  const boldWords = (studentWorksheet.match(/\*\*(.*?)\*\*/g) || [])
    .map(word => word.replace(/\*\*/g, '').toLowerCase());
  
  const uniqueBoldWords = [...new Set(boldWords)];
  
  return {
    isValid: boldWords.length > 0,
    totalBoldedTerms: boldWords.length,
    uniqueTerms: uniqueBoldWords.length,
    message: boldWords.length > 0 
      ? `${uniqueBoldWords.length} unique vocabulary terms bolded ${boldWords.length} times throughout worksheet`
      : 'No vocabulary terms found bolded in worksheet'
  };
};
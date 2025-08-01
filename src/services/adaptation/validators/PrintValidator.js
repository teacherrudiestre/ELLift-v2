// src/services/adaptation/validators/PrintValidator.js
export class PrintValidator {
  constructor() {
    this.placeholderPatterns = [
      '[Original passage preserved exactly as written]',
      '[Content continues...]',
      '...',
      '[Add more questions here]',
      '[Insert passage here]',
      '[Passage text here]',
      '[Complete the remaining items]',
      '[Insert full passage text here]',
      '[Include complete passage]',
      '[Full text goes here]',
      '[Replace with actual passage]',
      '{{CONTENT_PLACEHOLDER}}',
      '{{READING_PASSAGE_PLACEHOLDER}}'
    ];

    this.problematicChars = ['□', '✓', '○', '●', '◯', '◉'];
  }

  async validate(content) {
    const issues = [];
    let score = 1.0;

    // Check for placeholders
    const placeholderIssues = this.checkPlaceholders(content);
    issues.push(...placeholderIssues);

    // Check numbering
    const numberingIssues = this.checkNumbering(content);
    issues.push(...numberingIssues);

    // Check for problematic characters
    const charIssues = this.checkProblematicCharacters(content);
    issues.push(...charIssues);

    // Check for missing content
    const contentIssues = this.checkMissingContent(content);
    issues.push(...contentIssues);

    // Calculate score based on issues
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const majorIssues = issues.filter(i => i.severity === 'major').length;
    const minorIssues = issues.filter(i => i.severity === 'minor').length;

    score = Math.max(0, 1.0 - (criticalIssues * 0.5) - (majorIssues * 0.2) - (minorIssues * 0.1));

    return {
      isValid: issues.filter(i => i.severity === 'critical').length === 0,
      score,
      weight: 0.3,
      issues,
      summary: this.generateSummary(issues),
      autoFixable: issues.filter(i => i.autoFixable).length > 0
    };
  }

  checkPlaceholders(content) {
    const issues = [];
    
    this.placeholderPatterns.forEach(placeholder => {
      if (content.includes(placeholder)) {
        issues.push({
          type: 'placeholder',
          severity: 'critical',
          message: `Contains placeholder: ${placeholder}`,
          location: content.indexOf(placeholder),
          autoFixable: true,
          suggestion: 'Remove or replace placeholder with actual content'
        });
      }
    });

    return issues;
  }

  checkNumbering(content) {
    const issues = [];
    const numberedItems = content.match(/^\s*(\d+)\./gm) || [];
    
    if (numberedItems.length > 1) {
      const numbers = numberedItems.map(item => parseInt(item.match(/\d+/)[0]));
      
      // Check for sequential numbering
      for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] !== numbers[i-1] + 1) {
          issues.push({
            type: 'numbering',
            severity: 'major',
            message: `Numbering error: Found ${numbers[i-1]} followed by ${numbers[i]}`,
            autoFixable: true,
            suggestion: 'Fix sequential numbering'
          });
        }
      }

      // Check for duplicate numbers
      const duplicates = numbers.filter((num, index) => numbers.indexOf(num) !== index);
      duplicates.forEach(num => {
        issues.push({
          type: 'numbering',
          severity: 'major',
          message: `Duplicate number: ${num}`,
          autoFixable: true,
          suggestion: 'Remove duplicate numbering'
        });
      });
    }

    return issues;
  }

  checkProblematicCharacters(content) {
    const issues = [];
    
    this.problematicChars.forEach(char => {
      if (content.includes(char)) {
        issues.push({
          type: 'formatting',
          severity: 'minor',
          message: `Contains problematic character: ${char}`,
          autoFixable: true,
          suggestion: `Replace ${char} with standard formatting`
        });
      }
    });

    return issues;
  }

  checkMissingContent(content) {
    const issues = [];
    
    // Check for reading comprehension without passage
    const hasReadingSection = /reading passage|passage|story|text to read/i.test(content);
    const hasReadingQuestions = /according to the passage|in the text|the author|the story/i.test(content);
    
    if (hasReadingSection || hasReadingQuestions) {
      const potentialPassages = content.split('\n')
        .filter(line => line.trim().length > 100 && !line.includes('#') && !line.includes('*'))
        .filter(line => !line.includes('Answer') && !line.includes('Question') && !line.includes('Direction'));
      
      if (potentialPassages.length === 0) {
        issues.push({
          type: 'content',
          severity: 'critical',
          message: 'Reading comprehension worksheet missing the actual reading passage',
          autoFixable: false,
          suggestion: 'Ensure the complete reading passage is included'
        });
      }
    }

    return issues;
  }

  generateSummary(issues) {
    if (issues.length === 0) {
      return 'Content is print-ready';
    }

    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    const majorCount = issues.filter(i => i.severity === 'major').length;
    const minorCount = issues.filter(i => i.severity === 'minor').length;

    let summary = `Found ${issues.length} print-readiness issue(s)`;
    if (criticalCount > 0) summary += ` (${criticalCount} critical)`;
    if (majorCount > 0) summary += ` (${majorCount} major)`;
    if (minorCount > 0) summary += ` (${minorCount} minor)`;

    return summary;
  }
}
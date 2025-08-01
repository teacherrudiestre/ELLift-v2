// src/services/adaptation/validators/StructureValidator.js
export class StructureValidator {
  constructor() {
    this.structureRequirements = {
      hasHeaders: 0.2,
      hasSequentialNumbering: 0.3,
      hasInstructions: 0.2,
      hasLogicalFlow: 0.2,
      hasConsistentFormatting: 0.1
    };
  }

  async validate(result) {
    const content = result.studentWorksheet;
    const checks = {
      hasHeaders: this.checkHeaders(content),
      hasSequentialNumbering: this.checkNumbering(content),
      hasInstructions: this.checkInstructions(content),
      hasLogicalFlow: this.checkLogicalFlow(content),
      hasConsistentFormatting: this.checkFormatting(content)
    };

    const score = Object.entries(checks)
      .reduce((total, [check, passed]) => 
        total + (passed ? this.structureRequirements[check] : 0), 0);

    const issues = Object.entries(checks)
      .filter(([check, passed]) => !passed)
      .map(([check, passed]) => ({
        type: 'structure',
        severity: 'major',
        message: this.getCheckMessage(check),
        suggestion: this.getCheckSuggestion(check)
      }));

    return {
      isValid: score >= 0.7,
      score,
      weight: 0.2,
      issues,
      checks,
      summary: this.generateStructureSummary(score, issues.length)
    };
  }

  checkHeaders(content) {
    return /^#+\s+|\*\*[^*]+\*\*\s*$/gm.test(content);
  }

  checkNumbering(content) {
    const numberedItems = content.match(/^\s*(\d+)\./gm) || [];
    if (numberedItems.length <= 1) return true;

    const numbers = numberedItems.map(item => parseInt(item.match(/\d+/)[0]));
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] !== numbers[i-1] + 1) {
        return false;
      }
    }
    return true;
  }

  checkInstructions(content) {
    return /(directions?|instructions?):/i.test(content);
  }

  checkLogicalFlow(content) {
    // Simple heuristic: instructions should come before questions
    const instructionIndex = content.search(/(directions?|instructions?):/i);
    const questionIndex = content.search(/\d+\.\s+.+\?/);
    
    if (instructionIndex === -1 || questionIndex === -1) return true;
    return instructionIndex < questionIndex;
  }

  checkFormatting(content) {
    // Check for consistent bullet points and numbering
    const bulletFormats = [
      (content.match(/^\s*-\s+/gm) || []).length,
      (content.match(/^\s*\*\s+/gm) || []).length,
      (content.match(/^\s*•\s+/gm) || []).length
    ];
    
    const numberedFormats = [
      (content.match(/^\s*\d+\.\s+/gm) || []).length,
      (content.match(/^\s*\d+\)\s+/gm) || []).length
    ];

    // Consistent if only one format type is used predominantly
    const usedBulletFormats = bulletFormats.filter(count => count > 0).length;
    const usedNumberedFormats = numberedFormats.filter(count => count > 0).length;

    return usedBulletFormats <= 1 && usedNumberedFormats <= 1;
  }

  getCheckMessage(check) {
    const messages = {
      hasHeaders: 'No section headers found',
      hasSequentialNumbering: 'Numbering sequence issues detected',
      hasInstructions: 'No clear instructions provided',
      hasLogicalFlow: 'Content organization could be improved',
      hasConsistentFormatting: 'Inconsistent formatting detected'
    };
    return messages[check] || `Structure check failed: ${check}`;
  }

  getCheckSuggestion(check) {
    const suggestions = {
      hasHeaders: 'Add clear section headers to organize content',
      hasSequentialNumbering: 'Ensure questions are numbered sequentially (1, 2, 3...)',
      hasInstructions: 'Include clear directions for students',
      hasLogicalFlow: 'Reorganize content with instructions before activities',
      hasConsistentFormatting: 'Use consistent formatting for similar elements'
    };
    return suggestions[check] || `Fix ${check} issue`;
  }

  generateStructureSummary(score, issueCount) {
    if (score >= 0.9) return 'Excellent structure and organization';
    if (score >= 0.8) return 'Good structure with minor issues';
    if (score >= 0.7) return 'Acceptable structure';
    return `Structure needs improvement - ${issueCount} issues found`;
  }
}
// src/services/adaptation/engine/ContentProcessor.js
export class ContentProcessor {
  constructor() {
    this.processingRules = {
      // Text normalization rules
      whitespace: /\s+/g,
      lineBreaks: /\n{3,}/g,
      
      // Formatting fixes
      bullets: /[•◦▪▫]/g,
      checkboxes: /[□☐✓☑]/g,
      
      // Content patterns
      placeholders: /\[(.*?)\]/g,
      emphasis: /\*\*(.*?)\*\*/g
    };
  }

  async preprocess(content, params) {
    let processedContent = content;
    const changes = [];
    
    // Step 1: Normalize whitespace
    const originalWhitespace = processedContent;
    processedContent = processedContent.replace(this.processingRules.whitespace, ' ');
    processedContent = processedContent.replace(this.processingRules.lineBreaks, '\n\n');
    if (processedContent !== originalWhitespace) {
      changes.push('normalized whitespace');
    }
    
    // Step 2: Fix formatting
    const originalFormatting = processedContent;
    processedContent = processedContent.replace(this.processingRules.bullets, '-');
    processedContent = processedContent.replace(/□/g, '[ ]');
    processedContent = processedContent.replace(/☐/g, '[ ]');
    processedContent = processedContent.replace(/✓/g, '[x]');
    processedContent = processedContent.replace(/☑/g, '[x]');
    if (processedContent !== originalFormatting) {
      changes.push('fixed formatting characters');
    }
    
    // Step 3: Clean up content
    processedContent = processedContent.trim();
    
    // Step 4: Validate content integrity
    this.validateContentIntegrity(content, processedContent);
    
    return {
      content: processedContent,
      changes,
      originalLength: content.length,
      processedLength: processedContent.length
    };
  }

  validateContentIntegrity(original, processed) {
    // Check that we haven't lost significant content
    const originalWords = original.split(/\s+/).length;
    const processedWords = processed.split(/\s+/).length;
    
    const wordLossPercentage = (originalWords - processedWords) / originalWords;
    
    if (wordLossPercentage > 0.05) { // More than 5% word loss
      console.warn(`Content processing resulted in ${(wordLossPercentage * 100).toFixed(1)}% word loss`);
    }
  }

  extractKeyElements(content) {
    return {
      questions: this.extractQuestions(content),
      instructions: this.extractInstructions(content),
      vocabulary: this.extractVocabulary(content),
      passages: this.extractPassages(content)
    };
  }

  extractQuestions(content) {
    const patterns = [
      /^\s*\d+[\.\)]\s+(.+\?)/gm,
      /^(.+\?)$/gm
    ];
    
    const questions = [];
    patterns.forEach(pattern => {
      const matches = content.match(pattern) || [];
      questions.push(...matches);
    });
    
    return [...new Set(questions)]; // Remove duplicates
  }

  extractInstructions(content) {
    const instructionPatterns = [
      /(directions?|instructions?):\s*(.*?)(?=\n\s*\n|\n\s*\d+\.)/gsi,
      /^(read|complete|answer|solve|write).*$/gmi
    ];
    
    const instructions = [];
    instructionPatterns.forEach(pattern => {
      const matches = content.match(pattern) || [];
      instructions.push(...matches);
    });
    
    return instructions;
  }

  extractVocabulary(content) {
    // Extract bolded terms and terms in definitions
    const boldTerms = content.match(/\*\*(.*?)\*\*/g) || [];
    const definitionTerms = content.match(/^(.+):\s*(.+)$/gm) || [];
    
    return {
      boldTerms: boldTerms.map(term => term.replace(/\*\*/g, '')),
      definitionTerms: definitionTerms.map(def => def.split(':')[0].trim()),
      totalTerms: boldTerms.length + definitionTerms.length
    };
  }

  extractPassages(content) {
    // Find potential reading passages (long paragraphs without questions)
    const paragraphs = content.split(/\n\s*\n/);
    const passages = paragraphs.filter(p => {
      const wordCount = p.split(/\s+/).length;
      const hasQuestions = /\?/.test(p);
      const hasInstructions = /(directions?|instructions?|complete|answer)/i.test(p);
      
      return wordCount > 50 && !hasQuestions && !hasInstructions;
    });
    
    return passages;
  }
}
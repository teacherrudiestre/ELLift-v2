// src/services/adaptation/universalAdapter.js
import { getUniversalProficiencyAdaptations } from './widaAdapter';
import { analyzeContentStructure } from './contentAnalyzer';
import { validateAdaptationParams, validatePrintReadiness } from './validators';

export class UniversalAdapter {
  constructor(config = {}) {
    this.config = {
      maxTokens: 4096,
      retryAttempts: 3,
      ...config
    };
  }

  async adaptContent(params, progressCallback) {
    // Validate parameters
    validateAdaptationParams(params);
    
    progressCallback?.('Analyzing content structure...');
    
    // Analyze the content
    const contentAnalysis = analyzeContentStructure(params.contentToAdapt);
    
    progressCallback?.('Determining adaptation strategy...');
    
    // Get proficiency adaptations
    const adaptations = getUniversalProficiencyAdaptations(params.proficiencyLevel);
    
    // Determine processing strategy based on content complexity
    const strategy = this.determineStrategy(contentAnalysis, params);
    
    progressCallback?.(`Using ${strategy} strategy for adaptation...`);
    
    // Execute adaptation based on strategy
    let result;
    switch (strategy) {
      case 'simple':
        result = await this.simpleAdaptation(params, adaptations, progressCallback);
        break;
      case 'chunked':
        result = await this.chunkedAdaptation(params, adaptations, progressCallback);
        break;
      case 'two-step':
        result = await this.twoStepAdaptation(params, adaptations, progressCallback);
        break;
      default:
        result = await this.standardAdaptation(params, adaptations, progressCallback);
    }
    
    // Validate the result
    progressCallback?.('Validating adaptation quality...');
    const validation = validatePrintReadiness(result.studentWorksheet);
    
    return {
      ...result,
      contentAnalysis,
      strategy,
      validation,
      adaptations
    };
  }

  determineStrategy(analysis, params) {
    const { complexity, wordCount, totalItems } = analysis;
    
    // Very simple content
    if (complexity.level === 'simple' && wordCount < 500) {
      return 'simple';
    }
    
    // Complex content that needs chunking
    if (complexity.needsChunking || totalItems > 20) {
      return 'chunked';
    }
    
    // Reading comprehension with long passages
    if (analysis.contentType === 'reading_comprehension' && wordCount > 800) {
      return 'two-step';
    }
    
    // Standard processing for most content
    return 'standard';
  }

  async simpleAdaptation(params, adaptations, progressCallback) {
    progressCallback?.('Processing simple content...');
    
    // Direct, single-pass adaptation for simple content
    const prompt = this.buildSimplePrompt(params, adaptations);
    
    // Make API call (this would integrate with your Claude API)
    const result = await this.callAdaptationAPI(prompt);
    
    return {
      studentWorksheet: result.studentWorksheet,
      teacherGuide: result.teacherGuide,
      processingMethod: 'simple'
    };
  }

  async standardAdaptation(params, adaptations, progressCallback) {
    progressCallback?.('Processing standard content...');
    
    const prompt = this.buildStandardPrompt(params, adaptations);
    const result = await this.callAdaptationAPI(prompt);
    
    return {
      studentWorksheet: result.studentWorksheet,
      teacherGuide: result.teacherGuide,
      processingMethod: 'standard'
    };
  }

  async chunkedAdaptation(params, adaptations, progressCallback) {
    progressCallback?.('Breaking content into chunks...');
    
    // Split content into manageable chunks
    const chunks = this.splitContent(params.contentToAdapt);
    const adaptedChunks = [];
    
    for (let i = 0; i < chunks.length; i++) {
      progressCallback?.(`Processing chunk ${i + 1}/${chunks.length}...`);
      
      const chunkParams = { ...params, contentToAdapt: chunks[i] };
      const chunkResult = await this.standardAdaptation(chunkParams, adaptations);
      adaptedChunks.push(chunkResult);
    }
    
    progressCallback?.('Combining chunks...');
    
    // Combine the chunks back together
    return this.combineChunks(adaptedChunks);
  }

  async twoStepAdaptation(params, adaptations, progressCallback) {
    progressCallback?.('Step 1: Creating structure...');
    
    // Step 1: Create structure with placeholder for passage
    const structurePrompt = this.buildStructurePrompt(params, adaptations);
    const structure = await this.callAdaptationAPI(structurePrompt);
    
    progressCallback?.('Step 2: Inserting content...');
    
    // Step 2: Insert the actual content
    const finalWorksheet = this.insertContentIntoStructure(
      structure.studentWorksheet, 
      params.contentToAdapt
    );
    
    return {
      studentWorksheet: finalWorksheet,
      teacherGuide: structure.teacherGuide,
      processingMethod: 'two-step'
    };
  }

  buildSimplePrompt(params, adaptations) {
    return `Adapt this simple ${params.materialType} for ${params.proficiencyLevel} level students:
    
Content: ${params.contentToAdapt}
Subject: ${params.subject}
Adaptations needed: ${adaptations.sentences}

Create a simplified version maintaining all original content.`;
  }

  buildStandardPrompt(params, adaptations) {
    return `Create an adapted ${params.materialType} for ${params.proficiencyLevel} level ELL students.

Original Content:
${params.contentToAdapt}

Adaptations:
- Sentence structure: ${adaptations.sentences}
- Vocabulary: ${adaptations.vocabulary}
- Support: ${adaptations.support}

Generate both student worksheet and teacher guide.`;
  }

  buildStructurePrompt(params, adaptations) {
    return `Create the structure and questions for a ${params.materialType} adapted for ${params.proficiencyLevel} students.

Where the reading passage should go, write: {{CONTENT_PLACEHOLDER}}

Subject: ${params.subject}
Adaptations: ${adaptations.sentences}

Create complete structure with questions but use placeholder for main content.`;
  }

  splitContent(content) {
    // Simple splitting by paragraphs or sentences
    // Could be more sophisticated based on content type
    const paragraphs = content.split(/\n\s*\n/);
    const chunks = [];
    let currentChunk = '';
    
    for (const paragraph of paragraphs) {
      if ((currentChunk + paragraph).length > 2000) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = paragraph;
        } else {
          chunks.push(paragraph);
        }
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  }

  combineChunks(chunks) {
    const studentWorksheet = chunks.map(chunk => chunk.studentWorksheet).join('\n\n');
    const teacherGuide = chunks.map(chunk => chunk.teacherGuide).join('\n\n');
    
    return {
      studentWorksheet,
      teacherGuide,
      processingMethod: 'chunked',
      chunkCount: chunks.length
    };
  }

  insertContentIntoStructure(structure, content) {
    return structure.replace('{{CONTENT_PLACEHOLDER}}', content);
  }

  async callAdaptationAPI(prompt) {
    // This would integrate with your actual Claude API
    // Placeholder for now
    throw new Error('API integration needed');
  }
}

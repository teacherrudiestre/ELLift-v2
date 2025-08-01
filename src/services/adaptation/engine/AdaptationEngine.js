// src/services/adaptation/engine/AdaptationEngine.js
import { EventEmitter } from 'events';
import { ContentProcessor } from './ContentProcessor';
import { AdaptationPipeline } from './AdaptationPipeline';
import { OutputValidator } from './OutputValidator';
import { ContentAnalyzer } from '../analyzers/ContentAnalyzer';
import { ComplexityAnalyzer } from '../analyzers/ComplexityAnalyzer';
import { WidaAdapter } from '../adapters/WidaAdapter';
import { BilingualAdapter } from '../adapters/BilingualAdapter';
import { IEPAdapter } from '../adapters/IEPAdapter';
import { ClaudeClient } from '../../api/claude/ClaudeClient';
import { adaptationConstants } from '../../../utils/constants/adaptationConstants';

export class AdaptationEngine extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      maxRetries: 3,
      qualityThreshold: 0.8,
      timeoutMs: 60000,
      enableValidation: true,
      enableQualityCheck: true,
      ...config
    };

    // Initialize components
    this.contentProcessor = new ContentProcessor();
    this.contentAnalyzer = new ContentAnalyzer();
    this.complexityAnalyzer = new ComplexityAnalyzer();
    this.outputValidator = new OutputValidator();
    this.claudeClient = new ClaudeClient();
    
    // Initialize adapters
    this.widaAdapter = new WidaAdapter();
    this.bilingualAdapter = new BilingualAdapter();
    this.iepAdapter = new IEPAdapter();
    
    // Processing state
    this.isProcessing = false;
    this.currentJob = null;
    this.processingQueue = [];
  }

  /**
   * Main adaptation method - orchestrates the entire process
   */
  async adaptMaterial(params, progressCallback = null) {
    const jobId = this.generateJobId();
    
    try {
      this.emit('adaptation:started', { jobId, params });
      this.isProcessing = true;
      this.currentJob = { id: jobId, params, startTime: Date.now() };

      // Phase 1: Content Analysis
      progressCallback?.('Analyzing content structure and complexity...');
      const analysisResult = await this.analyzeContent(params.contentToAdapt, params);
      
      // Phase 2: Determine Processing Strategy
      progressCallback?.('Determining optimal processing strategy...');
      const strategy = this.determineProcessingStrategy(analysisResult, params);
      
      // Phase 3: Create Adaptation Pipeline
      progressCallback?.('Initializing adaptation pipeline...');
      const pipeline = new AdaptationPipeline(strategy, this.config);
      
      // Phase 4: Execute Adaptation
      progressCallback?.('Executing content adaptation...');
      const adaptationResult = await this.executeAdaptation(
        pipeline, 
        analysisResult, 
        params, 
        progressCallback
      );
      
      // Phase 5: Validation & Quality Check
      if (this.config.enableValidation) {
        progressCallback?.('Validating output quality...');
        const validationResult = await this.validateOutput(adaptationResult, params);
        adaptationResult.validation = validationResult;
      }
      
      // Phase 6: Post-processing
      progressCallback?.('Finalizing adaptation...');
      const finalResult = await this.postProcessResult(adaptationResult, analysisResult, params);
      
      this.emit('adaptation:completed', { jobId, result: finalResult });
      return finalResult;

    } catch (error) {
      this.emit('adaptation:error', { jobId, error });
      throw this.enhanceError(error, jobId, params);
    } finally {
      this.isProcessing = false;
      this.currentJob = null;
    }
  }

  /**
   * Comprehensive content analysis
   */
  async analyzeContent(content, params) {
    const results = await Promise.all([
      this.contentAnalyzer.analyze(content),
      this.complexityAnalyzer.analyze(content, params.subject, params.gradeLevel)
    ]);

    return {
      structure: results[0],
      complexity: results[1],
      metadata: {
        wordCount: content.split(/\s+/).length,
        characterCount: content.length,
        estimatedReadingTime: Math.ceil(content.split(/\s+/).length / 200),
        contentType: results[0].contentType,
        subject: params.subject,
        gradeLevel: params.gradeLevel,
        proficiencyLevel: params.proficiencyLevel
      }
    };
  }

  /**
   * Determine the best processing strategy based on content analysis
   */
  determineProcessingStrategy(analysis, params) {
    const { complexity, structure, metadata } = analysis;
    
    // Strategy decision matrix
    const strategies = {
      simple: {
        condition: complexity.score < 20 && metadata.wordCount < 500,
        pipeline: ['preprocess', 'adapt', 'validate'],
        maxTokens: 2048,
        chunkSize: null
      },
      standard: {
        condition: complexity.score < 60 && metadata.wordCount < 2000,
        pipeline: ['preprocess', 'adapt', 'enhance', 'validate'],
        maxTokens: 4096,
        chunkSize: null
      },
      chunked: {
        condition: complexity.score >= 60 || metadata.wordCount >= 2000,
        pipeline: ['preprocess', 'chunk', 'adapt', 'merge', 'validate'],
        maxTokens: 4096,
        chunkSize: 1500
      },
      twoStep: {
        condition: structure.contentType === 'reading_comprehension' && metadata.wordCount > 1000,
        pipeline: ['preprocess', 'createStructure', 'insertContent', 'validate'],
        maxTokens: 4096,
        chunkSize: null
      }
    };

    // Find matching strategy
    for (const [name, strategy] of Object.entries(strategies)) {
      if (strategy.condition) {
        return { name, ...strategy, analysis };
      }
    }

    // Default to standard strategy
    return { name: 'standard', ...strategies.standard, analysis };
  }

  /**
   * Execute the adaptation using the determined strategy
   */
  async executeAdaptation(pipeline, analysis, params, progressCallback) {
    const steps = pipeline.strategy.pipeline;
    let currentContent = params.contentToAdapt;
    let result = {
      studentWorksheet: '',
      teacherGuide: '',
      dynamicDescriptors: null,
      metadata: {
        strategy: pipeline.strategy.name,
        processingSteps: steps,
        tokensUsed: 0,
        processingTime: 0
      }
    };

    const startTime = Date.now();

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepProgress = Math.round(((i + 1) / steps.length) * 100);
      
      progressCallback?.(`Executing ${step} (${stepProgress}%)...`);
      
      try {
        switch (step) {
          case 'preprocess':
            currentContent = await this.contentProcessor.preprocess(currentContent, params);
            break;
            
          case 'adapt':
            const adaptResult = await this.performAdaptation(currentContent, params, analysis);
            result.studentWorksheet = adaptResult.studentWorksheet;
            result.teacherGuide = adaptResult.teacherGuide;
            result.metadata.tokensUsed += adaptResult.tokensUsed || 0;
            break;
            
          case 'enhance':
            result = await this.enhanceAdaptation(result, params, analysis);
            break;
            
          case 'chunk':
            // Handle chunked processing
            result = await this.processInChunks(currentContent, params, analysis, progressCallback);
            break;
            
          case 'createStructure':
            // Two-step processing: create structure first
            result = await this.createStructureOnly(currentContent, params, analysis);
            break;
            
          case 'insertContent':
            // Two-step processing: insert actual content
            result = await this.insertActualContent(result, currentContent, params);
            break;
            
          case 'merge':
            // Merge chunked results
            result = await this.mergeChunkedResults(result, params);
            break;
            
          case 'validate':
            // Basic validation during processing
            await this.validateStep(result, step);
            break;
        }
      } catch (error) {
        throw new Error(`Step '${step}' failed: ${error.message}`);
      }
    }

    result.metadata.processingTime = Date.now() - startTime;
    return result;
  }

  /**
   * Core adaptation logic using Claude API
   */
  async performAdaptation(content, params, analysis) {
    // Build context-aware prompt
    const prompt = await this.buildAdaptationPrompt(content, params, analysis);
    
    // Execute Claude API call with retries
    const response = await this.claudeClient.generateAdaptation(prompt, {
      maxTokens: analysis.complexity.needsExtendedTokens ? 8192 : 4096,
      temperature: 0.3,
      retries: this.config.maxRetries
    });

    // Parse and validate response
    return this.parseAdaptationResponse(response, params);
  }

  /**
   * Build comprehensive adaptation prompt
   */
  async buildAdaptationPrompt(content, params, analysis) {
    const promptBuilder = this.claudeClient.promptBuilder;
    
    // Get WIDA adaptations
    const widaAdaptations = await this.widaAdapter.getAdaptations(params.proficiencyLevel);
    
    // Get subject-specific adaptations
    const subjectAdaptations = await this.getSubjectAdaptations(params.subject, analysis);
    
    // Build bilingual adaptations if needed
    let bilingualInstructions = '';
    if (params.includeBilingualSupport) {
      bilingualInstructions = await this.bilingualAdapter.buildInstructions(params);
    }
    
    // Build IEP accommodations if needed
    let iepInstructions = '';
    if (params.addStudentChecklist || params.useMultipleChoice || params.worksheetLength !== 'Medium') {
      iepInstructions = await this.iepAdapter.buildInstructions(params);
    }

    return promptBuilder.build({
      content,
      params,
      analysis,
      widaAdaptations,
      subjectAdaptations,
      bilingualInstructions,
      iepInstructions
    });
  }

  /**
   * Validate the complete output
   */
  async validateOutput(result, params) {
    return await this.outputValidator.validate(result, params, {
      checkPrintReadiness: true,
      checkVocabularyIntegration: true,
      checkStructuralIntegrity: true,
      checkWidaCompliance: true,
      qualityThreshold: this.config.qualityThreshold
    });
  }

  /**
   * Post-process the result with additional enhancements
   */
  async postProcessResult(result, analysis, params) {
    // Generate dynamic WIDA descriptors
    if (!result.dynamicDescriptors) {
      result.dynamicDescriptors = await this.generateDynamicDescriptors(result, params, analysis);
    }
    
    // Add processing metadata
    result.processingMetadata = {
      ...result.metadata,
      analysisResults: analysis,
      processingTimestamp: new Date().toISOString(),
      engineVersion: '2.0.0',
      qualityScore: result.validation?.qualityScore || null
    };
    
    return result;
  }

  /**
   * Generate dynamic WIDA descriptors based on actual content
   */
  async generateDynamicDescriptors(result, params, analysis) {
    const descriptorPrompt = `Based on the adapted material, generate specific WIDA descriptors:

Student Material: ${result.studentWorksheet.substring(0, 1000)}...
Subject: ${params.subject}
Proficiency Level: ${params.proficiencyLevel}
Content Type: ${analysis.structure.contentType}

Generate JSON with:
- title: Specific title for this adaptation
- descriptors: Array of specific learning objectives
- contentSpecificSupports: Array of supports included
- vocabularySupports: Array of key vocabulary terms
- assessmentSuggestions: Array of assessment ideas`;

    try {
      const response = await this.claudeClient.generateJSON(descriptorPrompt);
      return response;
    } catch (error) {
      console.warn('Failed to generate dynamic descriptors:', error);
      return this.createFallbackDescriptors(params, analysis);
    }
  }

  /**
   * Create fallback descriptors if generation fails
   */
  createFallbackDescriptors(params, analysis) {
    return {
      title: `${params.subject} - ${params.proficiencyLevel} Level`,
      descriptors: [
        `Students can engage with ${params.subject.toLowerCase()} content at their language level`,
        `Students can complete adapted activities with appropriate support`,
        `Students can use academic vocabulary with scaffolding`
      ],
      contentSpecificSupports: [
        'Simplified sentence structure',
        'Visual supports and organizers',
        'Vocabulary definitions and examples'
      ],
      vocabularySupports: ['Key terms bolded throughout'],
      assessmentSuggestions: [
        { type: 'Formative', description: 'Exit ticket with key concepts' },
        { type: 'Summative', description: 'Modified assessment with supports' }
      ]
    };
  }

  /**
   * Enhanced error handling with context
   */
  enhanceError(error, jobId, params) {
    const enhancedError = new Error(`Adaptation failed: ${error.message}`);
    enhancedError.jobId = jobId;
    enhancedError.params = params;
    enhancedError.originalError = error;
    enhancedError.timestamp = new Date().toISOString();
    enhancedError.engineVersion = '2.0.0';
    return enhancedError;
  }

  /**
   * Generate unique job ID
   */
  generateJobId() {
    return `adapt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current processing status
   */
  getStatus() {
    return {
      isProcessing: this.isProcessing,
      currentJob: this.currentJob,
      queueLength: this.processingQueue.length,
      uptime: Date.now() - (this.startTime || Date.now())
    };
  }
}

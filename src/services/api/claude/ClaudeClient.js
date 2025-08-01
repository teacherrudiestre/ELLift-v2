// src/services/api/claude/ClaudeClient.js
import { RateLimiter } from './RateLimiter';
import { PromptBuilder } from './PromptBuilder';
import { ResponseParser } from './ResponseParser';
import { ErrorHandler } from './ErrorHandler';
import { apiRequest } from '../base/APIClient';

export class ClaudeClient {
  constructor(config = {}) {
    this.config = {
      maxTokens: 4096,
      temperature: 0.3,
      maxRetries: 3,
      retryDelay: 1000,
      timeout: 60000,
      rateLimit: {
        requestsPerMinute: 50,
        tokensPerMinute: 40000
      },
      ...config
    };

    this.rateLimiter = new RateLimiter(this.config.rateLimit);
    this.promptBuilder = new PromptBuilder();
    this.responseParser = new ResponseParser();
    this.errorHandler = new ErrorHandler();
    
    // Request tracking
    this.requestCount = 0;
    this.totalTokensUsed = 0;
    this.requestHistory = [];
  }

  /**
   * Main adaptation generation method
   */
  async generateAdaptation(prompt, options = {}) {
    const requestOptions = { ...this.config, ...options };
    const requestId = this.generateRequestId();

    try {
      // Rate limiting check
      await this.rateLimiter.checkLimit();

      // Estimate token usage
      const estimatedTokens = this.estimateTokens(prompt);
      await this.rateLimiter.checkTokenLimit(estimatedTokens);

      // Track request start
      this.trackRequestStart(requestId, prompt, requestOptions);

      // Make the API call with retries
      const response = await this.makeRequestWithRetries(prompt, requestOptions, requestId);

      // Parse and validate response
      const parsedResponse = await this.responseParser.parseAdaptationResponse(response);

      // Track success
      this.trackRequestSuccess(requestId, response, parsedResponse);

      return parsedResponse;

    } catch (error) {
      this.trackRequestError(requestId, error);
      throw this.errorHandler.enhance(error, requestId, prompt);
    }
  }

  /**
   * Generate JSON response (for dynamic descriptors, etc.)
   */
  async generateJSON(prompt, options = {}) {
    const enhancedPrompt = `${prompt}

CRITICAL: Respond ONLY with valid JSON. No explanations, no markdown, no additional text. Just the JSON object.`;

    const response = await this.generateAdaptation(enhancedPrompt, {
      ...options,
      temperature: 0.1 // Lower temperature for structured output
    });

    try {
      return JSON.parse(response.content);
    } catch (parseError) {
      // Try to extract JSON from response
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (secondParseError) {
          throw new Error(`Failed to parse JSON response: ${parseError.message}`);
        }
      }
      throw new Error('No valid JSON found in response');
    }
  }

  /**
   * Make API request with retry logic
   */
  async makeRequestWithRetries(prompt, options, requestId) {
    let lastError;
    
    for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
      try {
        const response = await this.makeAPICall(prompt, options);
        
        // Validate response
        if (!response || !response.content || !Array.isArray(response.content)) {
          throw new Error('Invalid response structure from Claude API');
        }

        return response;

      } catch (error) {
        lastError = error;
        
        // Don't retry on certain errors
        if (this.shouldNotRetry(error)) {
          throw error;
        }

        // Log retry attempt
        console.warn(`Claude API attempt ${attempt}/${options.maxRetries} failed:`, error.message);

        // Wait before retry (exponential backoff)
        if (attempt < options.maxRetries) {
          const delay = options.retryDelay * Math.pow(2, attempt - 1);
          await this.delay(delay);
        }
      }
    }

    throw lastError;
  }

  /**
   * Make the actual API call
   */
  async makeAPICall(prompt, options) {
    const messages = Array.isArray(prompt) ? prompt : [{ role: 'user', content: prompt }];
    
    return await apiRequest('/api/claude', {
      method: 'POST',
      body: {
        messages,
        max_tokens: options.maxTokens,
        temperature: options.temperature
      },
      timeout: options.timeout
    });
  }

  /**
   * Check if error should not be retried
   */
  shouldNotRetry(error) {
    // Don't retry on authentication, rate limit, or validation errors
    return error.status === 401 || 
           error.status === 403 || 
           error.status === 429 || 
           error.message.includes('validation');
  }

  /**
   * Estimate token usage for rate limiting
   */
  estimateTokens(content) {
    if (Array.isArray(content)) {
      return content.reduce((total, msg) => total + this.estimateTokens(msg.content), 0);
    }
    
    // Rough estimation: ~4 characters per token
    return Math.ceil(content.length / 4);
  }

  /**
   * Track request start
   */
  trackRequestStart(requestId, prompt, options) {
    this.requestCount++;
    const request = {
      id: requestId,
      startTime: Date.now(),
      promptLength: typeof prompt === 'string' ? prompt.length : JSON.stringify(prompt).length,
      maxTokens: options.maxTokens,
      status: 'pending'
    };
    
    this.requestHistory.unshift(request);
    
    // Keep only last 50 requests
    if (this.requestHistory.length > 50) {
      this.requestHistory = this.requestHistory.slice(0, 50);
    }
  }

  /**
   * Track successful request
   */
  trackRequestSuccess(requestId, response, parsedResponse) {
    const request = this.requestHistory.find(r => r.id === requestId);
    if (request) {
      request.endTime = Date.now();
      request.duration = request.endTime - request.startTime;
      request.tokensUsed = this.estimateTokens(response.content[0].text);
      request.status = 'success';
      
      this.totalTokensUsed += request.tokensUsed;
    }
  }

  /**
   * Track failed request
   */
  trackRequestError(requestId, error) {
    const request = this.requestHistory.find(r => r.id === requestId);
    if (request) {
      request.endTime = Date.now();
      request.duration = request.endTime - request.startTime;
      request.status = 'error';
      request.error = error.message;
    }
  }

  /**
   * Generate unique request ID
   */
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Delay utility
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get client statistics
   */
  getStats() {
    const successfulRequests = this.requestHistory.filter(r => r.status === 'success');
    const failedRequests = this.requestHistory.filter(r => r.status === 'error');
    
    return {
      totalRequests: this.requestCount,
      successfulRequests: successfulRequests.length,
      failedRequests: failedRequests.length,
      successRate: successfulRequests.length / Math.max(this.requestCount, 1),
      totalTokensUsed: this.totalTokensUsed,
      averageResponseTime: successfulRequests.length > 0 
        ? successfulRequests.reduce((sum, r) => sum + r.duration, 0) / successfulRequests.length 
        : 0,
      recentRequests: this.requestHistory.slice(0, 10)
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.requestCount = 0;
    this.totalTokensUsed = 0;
    this.requestHistory = [];
  }
}
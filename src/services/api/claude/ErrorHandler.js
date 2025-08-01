// src/services/api/claude/ErrorHandler.js
export class ErrorHandler {
  constructor() {
    this.errorPatterns = {
      rateLimit: /rate limit|too many requests/i,
      authentication: /unauthorized|invalid api key/i,
      validation: /validation|invalid input/i,
      timeout: /timeout|timed out/i,
      serverError: /internal server error|500/i,
      networkError: /network|connection|fetch/i
    };
  }

  enhance(error, requestId, context = {}) {
    const enhancedError = new Error(this.generateErrorMessage(error, context));
    
    enhancedError.originalError = error;
    enhancedError.requestId = requestId;
    enhancedError.timestamp = new Date().toISOString();
    enhancedError.errorType = this.categorizeError(error);
    enhancedError.retryable = this.isRetryable(error);
    enhancedError.userMessage = this.generateUserMessage(error);
    enhancedError.troubleshooting = this.generateTroubleshooting(error);

    return enhancedError;
  }

  categorizeError(error) {
    const message = error.message.toLowerCase();
    
    for (const [type, pattern] of Object.entries(this.errorPatterns)) {
      if (pattern.test(message)) {
        return type;
      }
    }

    if (error.status) {
      if (error.status >= 400 && error.status < 500) return 'client_error';
      if (error.status >= 500) return 'server_error';
    }

    return 'unknown';
  }

  isRetryable(error) {
    const nonRetryableTypes = ['authentication', 'validation'];
    const errorType = this.categorizeError(error);
    
    if (nonRetryableTypes.includes(errorType)) {
      return false;
    }

    if (error.status === 429) return true; // Rate limit
    if (error.status >= 500) return true; // Server errors
    
    return false;
  }

  generateErrorMessage(error, context) {
    const baseMessage = error.message || 'Unknown error occurred';
    const errorType = this.categorizeError(error);
    
    const typeMessages = {
      rateLimit: 'API rate limit exceeded. Please try again in a moment.',
      authentication: 'Authentication failed. Please check your API configuration.',
      validation: 'Request validation failed. Please check your input.',
      timeout: 'Request timed out. Please try again.',
      serverError: 'Server error occurred. Please try again later.',
      networkError: 'Network connection failed. Please check your internet connection.',
      client_error: 'Request failed due to client error.',
      server_error: 'Request failed due to server error.',
      unknown: baseMessage
    };

    return typeMessages[errorType] || baseMessage;
  }

  generateUserMessage(error) {
    const errorType = this.categorizeError(error);
    
    const userMessages = {
      rateLimit: 'We\'re processing too many requests right now. Please wait a moment and try again.',
      authentication: 'There\'s an issue with our API connection. Please contact support if this persists.',
      validation: 'There\'s an issue with your input. Please check your content and try again.',
      timeout: 'The request is taking longer than expected. Please try again.',
      serverError: 'Our servers are experiencing issues. Please try again in a few minutes.',
      networkError: 'Unable to connect to our servers. Please check your internet connection.',
      unknown: 'An unexpected error occurred. Please try again or contact support if the issue persists.'
    };

    return userMessages[errorType] || userMessages.unknown;
  }

  generateTroubleshooting(error) {
    const errorType = this.categorizeError(error);
    
    const troubleshooting = {
      rateLimit: [
        'Wait 1-2 minutes before trying again',
        'Consider reducing the amount of content being processed',
        'Try again during off-peak hours'
      ],
      authentication: [
        'Check API key configuration',
        'Verify API permissions',
        'Contact administrator if using shared credentials'
      ],
      validation: [
        'Check that all required fields are filled',
        'Verify content format and length',
        'Try with simpler content first'
      ],
      timeout: [
        'Try with shorter content',
        'Check internet connection stability',
        'Retry the request'
      ],
      serverError: [
        'Wait a few minutes and try again',
        'Try with different content',
        'Contact support if problem persists'
      ],
      networkError: [
        'Check internet connection',
        'Try refreshing the page',
        'Disable VPN if using one'
      ],
      unknown: [
        'Try refreshing the page',
        'Try with different content',
        'Contact support with error details'
      ]
    };

    return troubleshooting[errorType] || troubleshooting.unknown;
  }

  logError(error, context = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        type: this.categorizeError(error),
        status: error.status,
        stack: error.stack
      },
      context,
      requestId: error.requestId
    };

    console.error('Claude API Error:', logEntry);
    
    // In production, you might want to send this to an error tracking service
    if (typeof window !== 'undefined' && window.reportError) {
      window.reportError(logEntry);
    }
  }
}
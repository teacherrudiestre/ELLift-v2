// src/services/api/claude/RateLimiter.js
export class RateLimiter {
  constructor(config = {}) {
    this.config = {
      requestsPerMinute: 50,
      tokensPerMinute: 40000,
      burstLimit: 10,
      ...config
    };

    this.requestHistory = [];
    this.tokenHistory = [];
  }

  /**
   * Check if request is within rate limits
   */
  async checkLimit() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Clean old entries
    this.requestHistory = this.requestHistory.filter(time => time > oneMinuteAgo);
    
    // Check request limit
    if (this.requestHistory.length >= this.config.requestsPerMinute) {
      const oldestRequest = Math.min(...this.requestHistory);
      const waitTime = oldestRequest + 60000 - now;
      
      if (waitTime > 0) {
        console.log(`Rate limit reached. Waiting ${waitTime}ms...`);
        await this.delay(waitTime);
      }
    }

    // Record this request
    this.requestHistory.push(now);
  }

  /**
   * Check token usage limits
   */
  async checkTokenLimit(estimatedTokens) {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Clean old entries
    this.tokenHistory = this.tokenHistory.filter(entry => entry.time > oneMinuteAgo);
    
    const currentTokenUsage = this.tokenHistory.reduce((sum, entry) => sum + entry.tokens, 0);
    
    if (currentTokenUsage + estimatedTokens > this.config.tokensPerMinute) {
      const oldestEntry = this.tokenHistory.reduce((oldest, entry) => 
        !oldest || entry.time < oldest.time ? entry : oldest, null);
      
      if (oldestEntry) {
        const waitTime = oldestEntry.time + 60000 - now;
        if (waitTime > 0) {
          console.log(`Token limit reached. Waiting ${waitTime}ms...`);
          await this.delay(waitTime);
        }
      }
    }

    // Record token usage
    this.tokenHistory.push({ time: now, tokens: estimatedTokens });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStatus() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    const recentRequests = this.requestHistory.filter(time => time > oneMinuteAgo).length;
    const recentTokens = this.tokenHistory
      .filter(entry => entry.time > oneMinuteAgo)
      .reduce((sum, entry) => sum + entry.tokens, 0);

    return {
      requestsInLastMinute: recentRequests,
      requestsRemaining: Math.max(0, this.config.requestsPerMinute - recentRequests),
      tokensInLastMinute: recentTokens,
      tokensRemaining: Math.max(0, this.config.tokensPerMinute - recentTokens),
      isLimited: recentRequests >= this.config.requestsPerMinute || 
                 recentTokens >= this.config.tokensPerMinute
    };
  }
}
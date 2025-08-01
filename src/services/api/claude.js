// src/services/api/claude.js
import { apiRequest, APIError } from './base';

const CONFIG = {
  DELAYS: {
    BETWEEN_CALLS: 1000,
    RETRY_DELAY: 2000
  },
  TOKENS: {
    DEFAULT_MAX: 4096,
    EXTENDED_MAX: 8192,
    CHUNK_MAX: 4096
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const sanitizeInput = (text) => {
  if (typeof text !== 'string') return text;
  
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const callClaudeAPI = async (messages, maxTokens = CONFIG.TOKENS.DEFAULT_MAX) => {
  const formattedMessages = messages.map(msg => {
    if (typeof msg.content === 'string') {
      return { role: msg.role, content: sanitizeInput(msg.content) };
    }
    return msg;
  });

  return await apiRequest('/api/claude', {
    method: 'POST',
    body: {
      messages: formattedMessages,
      max_tokens: maxTokens
    }
  });
};

export const adaptMaterialWithClaude = async (params, setProcessingStep) => {
  try {
    // Import the full adaptation logic from the original service
    // This is a placeholder - you'll move the actual logic here
    const { adaptMaterialWithClaude: originalAdaptFunction } = await import('../claudeService');
    return await originalAdaptFunction(params, setProcessingStep);
  } catch (error) {
    throw new APIError(`Failed to adapt material: ${error.message}`, null, error);
  }
};
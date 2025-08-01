// src/services/api/base.js
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000' 
  : window.location.origin;

export class APIError extends Error {
  constructor(message, status = null, details = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

export const apiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = 30000,
    maxRetries = 3,
    retryDelay = 2000,
    ...fetchOptions
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const requestOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    signal: controller.signal,
    ...fetchOptions
  };

  if (body && method !== 'GET') {
    requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new APIError(
          errorData.error || `Request failed: ${response.status} - ${response.statusText}`,
          response.status,
          errorData
        );
      }

      return await response.json();

    } catch (error) {
      console.warn(`API request failed (attempt ${attempt}/${maxRetries}):`, error.message);
      
      if (error.name === 'AbortError') {
        throw new APIError('Request timeout', 408, error);
      }
      
      if (error.status === 401 || error.status === 403) {
        throw error;
      }
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
    }
  }
};
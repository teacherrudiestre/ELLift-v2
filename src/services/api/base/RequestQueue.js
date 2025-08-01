// src/services/api/base/APIClient.js
export class APIClient {
  constructor(baseURL = '', config = {}) {
    this.baseURL = baseURL;
    this.config = {
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      ...config
    };
    
    this.interceptors = {
      request: [],
      response: []
    };
  }

  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  }

  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
  }

  async request(url, options = {}) {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    // Apply request interceptors
    let requestOptions = { ...this.config, ...options };
    for (const interceptor of this.interceptors.request) {
      requestOptions = await interceptor(requestOptions);
    }

    // Set up timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), requestOptions.timeout);

    try {
      const response = await fetch(fullURL, {
        ...requestOptions,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Apply response interceptors
      let processedResponse = response;
      for (const interceptor of this.interceptors.response) {
        processedResponse = await interceptor(processedResponse);
      }

      if (!processedResponse.ok) {
        throw new Error(`HTTP ${processedResponse.status}: ${processedResponse.statusText}`);
      }

      return processedResponse;

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  async post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  }

  async put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  }

  async delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }
}
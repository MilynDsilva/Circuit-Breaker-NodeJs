const CircuitBreaker = require('opossum');
const axios = require('axios');

class CustomCircuitBreaker {
  constructor(action, options) {
    this.breaker = new CircuitBreaker(action, options);

    // Attach event listeners
    this.breaker.on('open', () => console.log('Circuit breaker opened'));
    this.breaker.on('halfOpen', () => console.log('Circuit breaker half-open'));
    this.breaker.on('close', () => console.log('Circuit breaker closed'));
    this.breaker.on('fallback', (result) => console.log('Fallback executed', result));
    this.breaker.on('reject', (result) => console.log('Execution rejected', result));
    this.breaker.on('timeout', () => console.log('Execution timed out'));
    this.breaker.on('success', (result) => console.log('Execution succeeded', result));
    this.breaker.on('failure', (error) => console.log('Execution failed', error));
  }

  async fire(...args) {
    try {
      return await this.breaker.fire(...args);
    } catch (error) {
      console.error('Error in circuit breaker execution', error);
      throw error;
    }
  }

  // Additional methods to configure or query the breaker can be added here
}

module.exports = CustomCircuitBreaker;

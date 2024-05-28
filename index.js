const CustomCircuitBreaker = require('./circuit-breaker');
const axios = require('axios');

// Define the action that the circuit breaker will wrap
const action = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Define the options for the circuit breaker
const options = {
  timeout: 30000, // If the action takes longer than 3 seconds, it will timeout
  errorThresholdPercentage: 50, // When 50% of requests fail, the circuit breaker will open
  resetTimeout: 5000 // After 5 seconds, the circuit breaker will try again (half-open state)
};

// Create an instance of the custom circuit breaker
const breaker = new CustomCircuitBreaker(action, options);

// Use the circuit breaker to call an API with a delay
const delayedApiUrl = 'https://httpbin.org/delay/5'; // This endpoint will delay the response for 5 seconds

breaker.fire(delayedApiUrl)
  .then(result => console.log('API call result:', result))
  .catch(error => console.error('API call error:', error));

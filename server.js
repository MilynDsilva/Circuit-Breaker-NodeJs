const express = require('express');
const CustomCircuitBreaker = require('./circuit-breaker');

const app = express();
const port = 6000;

// Define the action that the circuit breaker will wrap
const action = async (url) => {
  const axios = require('axios');
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Define the options for the circuit breaker
const options = {
  timeout: 60000, // If the action takes longer than 3 seconds, it will timeout
  errorThresholdPercentage: 50, // When 50% of requests fail, the circuit breaker will open
  resetTimeout: 5000 // After 5 seconds, the circuit breaker will try again (half-open state)
};

// Create an instance of the custom circuit breaker
const breaker = new CustomCircuitBreaker(action, options);

// Define a route that uses the circuit breaker to call an API with a delay
app.get('/delayed-api', async (req, res) => {
  const delayedApiUrl = 'https://httpbin.org/delay/5'; // This endpoint will delay the response for 5 seconds

  try {
    const result = await breaker.fire(delayedApiUrl);
    res.json({ message: 'API call result', data: result });
  } catch (error) {
    res.status(500).json({ message: 'API call error', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

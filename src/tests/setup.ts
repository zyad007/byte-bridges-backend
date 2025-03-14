// This file contains setup code that will be executed before Jest runs tests

// Set test environment variables if needed
process.env.NODE_ENV = 'test';

// Add global mocks or setup code here
jest.setTimeout(30000); // Increase timeout for tests

// Clean up function to run after all tests
afterAll(async () => {
  // Any cleanup code here
}); 
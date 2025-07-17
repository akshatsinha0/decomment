module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'bin/**/*.js',
    'scripts/**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/test/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
    'html',
    'json'
  ],
  // Coverage thresholds disabled for CLI tools that run as separate processes
  // coverageThreshold: {
  //   global: {
  //     branches: 70,
  //     functions: 70,
  //     lines: 70,
  //     statements: 70
  //   }
  // },
  testMatch: [
    '**/test/**/*.test.js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/dist/'
  ],
  verbose: true,
  testTimeout: 10000,
  setupFilesAfterEnv: [],
  clearMocks: true,
  restoreMocks: true,
  errorOnDeprecated: true,
  maxWorkers: '50%',
  collectCoverage: false,
  bail: false,
  forceExit: true,
  detectOpenHandles: true
};

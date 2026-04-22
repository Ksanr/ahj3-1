module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/assets/**',
  ],
  coverageThreshold: {
    global: {
      branches: 85,  // повышаем порог
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  moduleNameMapper: {
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.css$': '<rootDir>/__mocks__/styleMock.js',
  },
  transform: {
    '^.+\\.js$': ['babel-jest', { configFile: './.babelrc' }],
  },
  transformIgnorePatterns: [
    '/node_modules/',
  ],
  verbose: true,
  testTimeout: 10000,
};

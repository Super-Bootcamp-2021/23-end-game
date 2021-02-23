module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'service',
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*'],
  coverageDirectory: '<rootDir>/coverage',
  coveragePathIgnorePatterns: ['<rootDir>/src/config'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  testRegex: '\\.(spec)\\.(ts|tsx|js)$',
  testPathIgnorePatterns: ['<rootDir>/dist/'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json'
    }
  }
};

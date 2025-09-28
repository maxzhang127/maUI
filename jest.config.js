module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/*.(test|spec).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testPathIgnorePatterns: ['\\.d\\.ts$'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/demo/**/*'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss|sass)\\?inline$': '<rootDir>/src/utils/__mocks__/styleMock.js',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    '\\.(html)$': '<rootDir>/src/utils/__mocks__/htmlMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/src/utils/setupTests.ts']
};
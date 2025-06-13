module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // Correct mapping for aliases
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy' // Mock for all stylesheet types
  },
  transform: {
    '^.+\\.(ts|tsx)?$': ['ts-jest', {
      tsconfig: 'tsconfig.jest.json',
      diagnostics: {
        ignoreCodes: ['TS151001'] // Ignore "experimental decorators" warning if not using them
      }
    }],
  },
  // No `globals` section for ts-jest needed as per new best practices
};

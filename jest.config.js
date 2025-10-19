module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest-setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo|@expo|@unimodules|react-native-gesture-handler|react-native-safe-area-context|react-native-screens|react-native-vector-icons|@testing-library)',
  ],
  testMatch: ['**/__tests__/**/*.(test|spec).{ts,tsx}', '**/*.(test|spec).{ts,tsx}'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/index.ts',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup-after-env.js'],
};
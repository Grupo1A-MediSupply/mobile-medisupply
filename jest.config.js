module.exports = {
  preset: 'react-native',
  rootDir: __dirname,
  setupFiles: ['<rootDir>/jest-setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo|@expo|@unimodules|react-native-gesture-handler|react-native-safe-area-context|react-native-screens|react-native-vector-icons|@testing-library)',
  ],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.{ts,tsx}', '<rootDir>/src/**/__tests__/**/*.spec.{ts,tsx}', '<rootDir>/src/**/*.test.{ts,tsx}', '<rootDir>/src/**/*.spec.{ts,tsx}'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.git/',
    '/dist/',
    '/build/',
  ],
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
  testTimeout: 30000, // 30 segundos por test
  maxWorkers: process.env.CI ? 2 : '50%', // Limitar workers en CI para evitar problemas de recursos
  // Configuración para mejorar el rendimiento
  bail: false, // No detener en el primer error
  cache: true, // Usar caché para acelerar ejecuciones subsecuentes
};
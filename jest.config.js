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
  coverageReporters: process.env.CI 
    ? ['text', 'lcov'] // Solo text y lcov en CI para ser más rápido
    : ['text', 'lcov', 'html'], // Incluir HTML solo en local
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup-after-env.js'],
  testTimeout: process.env.CI ? 15000 : 30000, // 15 segundos en CI, 30 en local
  maxWorkers: process.env.CI ? 1 : '50%', // 1 worker en CI para evitar problemas de recursos y cuelgues
  // Configuración para mejorar el rendimiento y evitar cuelgues
  bail: false, // No detener en el primer error
  cache: process.env.CI ? false : true, // Desactivar caché en CI para evitar problemas
  forceExit: process.env.CI ? true : false, // Forzar salida en CI para evitar cuelgues
  detectOpenHandles: false, // Desactivar detección de handles abiertos (más rápido)
  // Optimizaciones para CI
  logHeapUsage: false, // No mostrar uso de heap (más rápido)
  verbose: false, // No mostrar output detallado (más rápido)
  // Optimizaciones adicionales para CI
  maxConcurrency: process.env.CI ? 2 : 5, // Limitar concurrencia en CI
};
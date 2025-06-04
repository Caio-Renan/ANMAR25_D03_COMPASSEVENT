module.exports = {
  rootDir: '.',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/entities/**',
    '!src/**/dtos/**',
    '!src/**/mocks/**',
    '!src/**/constants/**',
    '!src/main.ts',
    '!**/*.module.ts',
  ],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/coverage/', '/scripts/', '/.husky/'],
  testEnvironment: 'node',
  forceExit: true,
  detectOpenHandles: true,
  maxWorkers: '50%',
  testTimeout: 10000,
  verbose: true,
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};

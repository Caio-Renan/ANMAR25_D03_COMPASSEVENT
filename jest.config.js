module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/interfaces/**',
    '!**/dtos/**',
    '!**/mocks/**',
    '!**/constants/**',
  ],
  coverageDirectory: '../coverage',
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

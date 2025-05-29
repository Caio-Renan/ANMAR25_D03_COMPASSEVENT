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
};

module.exports = {
  rootDir: 'src',
  testTimeout: 60000,
  testRegex: '.spec.(ts|tsx)$',
  transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
  moduleFileExtensions: ['js', 'ts'],
  coverageDirectory: '../reports/coverage'
};

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
  ],
  moduleNameMapper: {
    '@/tests/(.*)': '<rootDir>/tests/$1',
    '@/(.*)': '<rootDir>/src/$1'
  },
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  "moduleFileExtensions": [ "js", "ts" ],
  "coveragePathIgnorePatterns": [
    "node_modules",
    "jestGlobalMocks.ts",
    ".module.ts",
    ".mock.ts"
  ],
};

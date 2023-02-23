module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
  ],
  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ["html", "text"],
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
  // This option allows the use of a custom results processor
  testResultsProcessor: "jest-sonar-reporter",
};

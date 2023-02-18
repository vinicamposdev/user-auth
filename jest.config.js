module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['**/src/**/*'],
  "moduleFileExtensions": [ "js", "ts" ],
  "coveragePathIgnorePatterns": [
    "node_modules",
    "jestGlobalMocks.ts",
    ".module.ts",
    ".mock.ts"
  ],
};

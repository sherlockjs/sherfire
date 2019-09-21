const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
    // A preset that is used as a base for Jest's configuration
    preset: 'ts-jest',
    testEnvironment: 'node',
    // An array of glob patterns indicating a set of files for which coverage information should be collected
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.spec.ts',
    ],
    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage',
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
    // Automatically restore mock state between every test
    restoreMocks: true,
    // A list of paths to directories that Jest should use to search for files in
    roots: [
        "<rootDir>/src",
    ],
    // A map from regular expressions to module names that allow to stub out resources with a single module
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: `<rootDir>/${compilerOptions.baseUrl}/` }),
};

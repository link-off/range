/* eslint-disable @typescript-eslint/no-var-requires */
const merge = require('merge');

module.exports = merge.recursive({
    preset: 'ts-jest',
    globals: {
        'ts-jest': {
            babelConfig: true,
        }
    }
}, {
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/src'],
    testMatch: ['**/*.test.+(ts|js)'],
    setupFiles: ['./setup-jest.js'],
});
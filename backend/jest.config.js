// backend/jest.config.js
export default {
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/tests/**/*.js',
    ],
};
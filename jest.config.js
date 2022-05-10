// jest.config.js
module.exports = {
    testEnvironment: 'jsdom',
    verbose: true,
    transform: {
        "\\.[jt]sx?$": "babel-jest"
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'jsx', 'tsx'],
    collectCoverageFrom: [
        'lib/**/*.{js,jsx,ts,tsx}',
        '!**/node_modules/**'
    ],
    coveragePathIgnorePatterns: [],
    coverageReporters: ['lcov', 'text'],
    testMatch: [
        '**/?(*.)+(spec|test|pact).[tj]s?(x)'
    ]
};

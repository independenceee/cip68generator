/** @type {import('ts-jest').JestConfigWithTsJest} **/

const jestConfig = {
    testTimeout: 60000,
    testEnvironment: "node",
    setupFiles: ["dotenv/config"],
    transform: {
        "^.+.tsx?$": ["ts-jest", {}],
    },
};

export default jestConfig;

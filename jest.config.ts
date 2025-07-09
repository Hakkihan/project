module.exports = {
  testMatch: [
    "**/?(*.)+(test).[jt]s?(x)",     // supports *.test.ts and *.test.tsx
  ],
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // if using fetch mocks, etc.
  testEnvironment: "node" // or "jsdom" if React DOM tests
};

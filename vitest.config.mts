import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    clearMocks: true,
    restoreMocks: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    exclude: [...configDefaults.exclude, "tests/e2e/**"],
  },
});

// vitest.config.ts or vitest.config.js
import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        coverage: {
            // Exclude src/index.ts from coverage
            exclude: ["src/index.ts"],
        },
    },
})

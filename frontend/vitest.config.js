import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./test/setupTests.ts",
    },
    resolve: {
        alias: {
            components: path.resolve(__dirname, "./src/components/"),
            utils: path.resolve(__dirname, "./src/utils/"),
            hooks: path.resolve(__dirname, "./src/hooks/"),
            types: path.resolve(__dirname, "./src/types/"),
            css: path.resolve(__dirname, "./src/css/"),
        },
    },
});

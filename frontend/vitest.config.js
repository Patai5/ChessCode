import path from "path";

export default {
    test: { environment: "jsdom", globals: true },
    resolve: {
        alias: {
            components: path.resolve(__dirname, "./src/components/"),
            utils: path.resolve(__dirname, "./src/utils/"),
            hooks: path.resolve(__dirname, "./src/hooks/"),
            types: path.resolve(__dirname, "./src/types/"),
            css: path.resolve(__dirname, "./src/css/"),
        },
    },
};

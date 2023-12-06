import { viteStaticCopy } from "vite-plugin-static-copy";

const moduleName = "globe";

export default { // eslint-disable-line import/no-default-export
    root: "./src/",
    server: {
        port: 8081,
    },
    build: {
        sourcemap: false,
        target: 'es2020',
        lib: { // lib omits index.hml
            entry: "./Globe/looker/index.ts",
            name: "dev",
            fileName: `${moduleName}`,
        },
        outDir: `../dist`,
        minify: true,
        assetsInlineLimit: 0,
        cssCodeSplit: false,
        emptyOutDir: true,
        rollupOptions: {
            output: {
                entryFileNames: `${moduleName}.js`,
                assetFileNames: `${moduleName}[extname]`,
            },
        },
    },
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: "./Globe/assets/looker-studio/*",
                    dest: "./",
                },
                {
                    src: "./Globe/assets/icons/*",
                    dest: "./icons",
                }
            ],
        }),
    ],
};


import { viteStaticCopy } from "vite-plugin-static-copy";

const moduleName = "Globe";

export default { // eslint-disable-line import/no-default-export
    root: "./src/",
    server: {
        port: 8081,
    },
    build: {
        sourcemap: true,
        target: 'es2020',
        lib: { // lib omits index.hml
            entry: "index.ts",
            name: "dev",
            fileName: `${moduleName}`,
        },
        outDir: `../dist/${moduleName}/`,
        minify: false,
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
                    src: "./",
                    dest: "./",
                }
            ],
        }),
    ],
};


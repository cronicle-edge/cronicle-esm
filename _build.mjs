
import ESBuild from 'esbuild'

ESBuild.build({

    entryPoints: ["./_main.mjs"],
    platform: "node",
    format: 'esm',
    outfile: './cronicle.mjs',
    bundle: true,
    logLevel: "info",
    minify: true,
    // minifyIdentifiers: true,
    // minifySyntax: true,
    // minifyWhitespace: true,
    banner: {
     js: `
        import { createRequire as topLevelCreateRequire } from 'module';
        const require = topLevelCreateRequire(import.meta.url);
        const __dirname = new URL(import.meta.url).pathname.split('/').slice(0,-1).join('/');       
        process.chdir(__dirname)
    `},
    external: ["couchbase"]

})


// build plugins

ESBuild.build({

    entryPoints: [
       "./plugins/shell-plugin.js",
       "./plugins/ssh-plugin.js",
       "./plugins/test-plugin.js",
       "./plugins/url-plugin.js",
       "./plugins/workflow.js"
    ],
    loader: {'.node': 'file'},
    outdir: "bin",
    bundle: true,
    external: ['node:process', 'node:os', 'node:tty'],
    minify: false,
    platform: "node"

})
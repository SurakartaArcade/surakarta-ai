import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import ts from 'rollup-plugin-typescript2';
import typescript from 'typescript';

export default {
    input: 'src/index.ts',
    output: {
        dir: 'output',
        format: 'cjs'
    },
    plugins: [
        peerDepsExternal(),
        ts({ typescript })
    ]
}

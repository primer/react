import inject from '@rollup/plugin-inject'
import replace from '@rollup/plugin-replace'
import esbuild from 'rollup-plugin-esbuild'
import typescript from 'rollup-plugin-typescript2'

/**
 * @type {import('rollup').RollupOptions}
 */
const config = [
  {
    input: ['./src/index.ts'],
    external: ['@lit-labs/ssr-dom-shim'],
    plugins: [typescript({tsconfig: 'tsconfig.build.json'}), esbuild()],
    output: {
      dir: './dist/esm',
      format: 'esm',
    },
  },
  {
    input: ['./src/index.ts'],
    external: ['@lit-labs/ssr-dom-shim'],
    plugins: [typescript({tsconfig: 'tsconfig.build.json'}), esbuild()],
    output: {
      dir: './dist/cjs',
      format: 'commonjs',
      entryFileNames: '[name].cjs',
    },
  },
  {
    input: ['./src/index.ts'],
    external: ['@lit-labs/ssr-dom-shim'],
    plugins: [
      esbuild(),
      // Reference:
      // https://github.com/lit/lit/blob/5c8b142552542ffa775b74074b8bd16f427a00fa/rollup-common.js#L260-L276
      inject({
        HTMLElement: ['@lit-labs/ssr-dom-shim', 'HTMLElement'],
        customElements: ['@lit-labs/ssr-dom-shim', 'customElements'],
      }),
      replace({
        preventAssignment: true,
        values: {
          'extends HTMLElement': 'extends (globalThis.HTMLElement ?? HTMLElement)',
        },
      }),
    ],
    output: {
      dir: './dist/esm/node',
      format: 'esm',
    },
  },
  {
    input: ['./src/index.ts'],
    external: ['@lit-labs/ssr-dom-shim'],
    plugins: [
      esbuild(),
      // Reference:
      // https://github.com/lit/lit/blob/5c8b142552542ffa775b74074b8bd16f427a00fa/rollup-common.js#L260-L276
      inject({
        HTMLElement: ['@lit-labs/ssr-dom-shim', 'HTMLElement'],
        customElements: ['@lit-labs/ssr-dom-shim', 'customElements'],
      }),
      replace({
        preventAssignment: true,
        values: {
          'extends HTMLElement': 'extends (globalThis.HTMLElement ?? HTMLElement)',
        },
      }),
    ],
    output: {
      dir: './dist/cjs/node',
      format: 'commonjs',
      entryFileNames: '[name].cjs',
    },
  },
]

export default config

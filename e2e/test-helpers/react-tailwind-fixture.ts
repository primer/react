import path from 'node:path'
import {build} from 'vite'

export const reactTailwindPackageRoot = path.resolve(__dirname, '../../packages/react-tailwind')

/**
 * Hand-authored host utilities for caller-owned fixture classes. Load it after the package stylesheet, as a host app
 * loads its own unprefixed Tailwind build.
 */
export const reactTailwindHostUtilities = path.resolve(__dirname, 'react-tailwind-host-utilities.css')

export async function buildReactTailwindFixture(entry: string, alternateBaseUi?: string) {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    root: reactTailwindPackageRoot,
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: alternateBaseUi ? [{find: /^@base-ui\/react\/(.+)$/, replacement: `${alternateBaseUi}/$1/index.mjs`}] : [],
    },
    define: {'process.env.NODE_ENV': JSON.stringify('production')},
    oxc: {jsx: {runtime: 'automatic'}},
    build: {
      write: false,
      minify: false,
      lib: {
        entry: path.join(reactTailwindPackageRoot, entry),
        formats: ['iife'],
        name: 'ReactTailwindFixture',
      },
    },
  })
  const outputs = Array.isArray(result) ? result : [result]
  const script = outputs
    .flatMap(output => ('output' in output ? output.output : []))
    .find(file => file.type === 'chunk')
  if (!script) throw new Error(`React Tailwind fixture build did not return a script: ${entry}`)
  if (alternateBaseUi && !script.moduleIds.some(id => id.startsWith(`${alternateBaseUi}/`))) {
    throw new Error('The alternate Base UI package was not included in the fixture')
  }
  return script.code
}

'use strict'

const fs = require('node:fs/promises')
const path = require('node:path')
const commonjs = require('@rollup/plugin-commonjs')
const {nodeResolve} = require('@rollup/plugin-node-resolve')
const virtual = require('@rollup/plugin-virtual')
const gzip = require('gzip-size')
const {rollup} = require('rollup')
const {minify} = require('terser')

async function main() {
  const packageJsonPath = path.resolve(__dirname, '..', 'package.json')
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
  const external = [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
    ...Object.keys(packageJson.peerDependencies ?? {})
  ]
  const entrypoint = path.resolve(__dirname, '..', packageJson.exports['.'].import)
  const bundle = await rollup({
    input: entrypoint,
    external,
    plugins: [
      nodeResolve(),
      commonjs({
        include: [/node_modules/]
      })
    ]
  })
  const {output} = await bundle.generate({
    format: 'esm'
  })
  const minified = await minify(output[0].code)
  const exports = await Promise.all(
    output[0].exports.map(async id => {
      const exportBundle = await rollup({
        input: '__entrypoint__',
        external,
        plugins: [
          nodeResolve(),
          commonjs({
            include: /node_modules/
          }),
          virtual({
            __entrypoint__: `export { ${id} } from '${entrypoint}';`
          })
        ]
      })
      const {output} = await exportBundle.generate({
        format: 'esm'
      })
      const minified = await minify(output[0].code)

      return {
        id,
        unminified: Buffer.byteLength(output[0].code),
        minified: Buffer.byteLength(minified.code),
        gzipUnminified: gzip.sync(output[0].code),
        gzipMinified: gzip.sync(minified.code)
      }
    })
  )

  const artifact = {
    entrypoints: [
      {
        entrypoint: '.',
        unminified: Buffer.byteLength(output[0].code),
        minified: Buffer.byteLength(minified.code),
        gzipUnminified: gzip.sync(output[0].code),
        gzipMinified: gzip.sync(minified.code),
        exports
      }
    ]
  }

  const header = `
| Export | Gzip minified | Gzip unminified | Minified | Unminified |
| :----- | :--------- | :------- | :-------------- | :------------ |
`
  const rows = artifact.entrypoints[0].exports
    .sort((a, b) => {
      return b.gzipMinified - a.gzipMinified
    })
    .map(({id, minified, gzipMinified, unminified, gzipUnminified}) => {
      return `| ${id} | ${gzipMinified} | ${gzipUnminified} | ${minified} | ${unminified} |`
    })

  return `<details>
<summary>Sizes</summary>

${header}
${rows.join('\n')}
</detials>
`
}

main().catch(error => {
  console.log(error)
  process.exit(1)
})

import * as TypeDoc from 'typedoc'
import glob from 'fast-glob'

const pluginPath = glob.sync(['script/prop-docs/typedoc-plugin-react-components.ts'], {
  absolute: true,
})

// const files = glob.sync(
//   // Glob for testing
//   // [
//   //   './packages/react/src/Avatar/*.tsx',f
//   //   './packages/react/src/ActionMenu/*.tsx',
//   //   './packages/react/src/DataTable/*.tsx',
//   //   '!./packages/react/src/**/*.stories.tsx',
//   //   '!./packages/react/src/**/*.test.tsx',
//   // ],
//   ['src/**/*.tsx', '!src/**/*.stories.tsx', '!src/**/*.test.tsx'],
//   {
//     absolute: true,
//   },
// )

// These are skipped anyway because they're not in the entryPoints,
// but I can't exclude exact component files either
const excludeFiles = glob.sync(['src/**/*.stories.tsx', 'src/**/*.test.tsx'], {
  absolute: true,
})

async function main() {
  // Application.bootstrap also exists, which will not load plugins
  // Also accepts an array of option readers if you want to disable
  // TypeDoc's tsconfig.json/package.json/typedoc.json option readers
  const app = await TypeDoc.Application.bootstrapWithPlugins({
    entryPoints: ['src/index.ts'],
    exclude: excludeFiles,
    plugin: pluginPath,
  })

  const project = await app.convert()

  if (project) {
    // Project may not have converted correctly
    const outputDir = 'script/prop-docs/typedoc-test/'

    // Rendered docs
    // await app.generateDocs(project, outputDir)
    // Alternatively generate JSON output
    await app.generateJson(project, outputDir + '/documentation.json')
  }
}

main().catch(console.error)

import fs from 'node:fs'
import glob from 'fast-glob'
import semver from 'semver'

const versions = new Map([
  ['@types/react', '^19.2.2'],
  ['@types/react-dom', '^19.2.2'],
  ['@types/react-is', '^19.2.0'],
  ['react', '^19.2.0'],
  ['react-dom', '^19.2.0'],
  ['react-is', '^19.2.0'],
])

const packageJsonPaths = glob.sync('{examples,packages}/**/package.json', {
  ignore: ['**/node_modules/**', '**/dist/**', '**/lib/**', '**/lib-esm/**', '**/.next/**', '**/storybook-static/**'],
})

const dependencyTypes = new Set(['dependencies', 'devDependencies', 'peerDependencies'])

for (const packageJsonPath of packageJsonPaths) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  for (const dependencyType of dependencyTypes) {
    const dependencies = packageJson[dependencyType]

    if (!dependencies) {
      continue
    }

    for (const [pkg, targetRange] of versions) {
      const range = dependencies[pkg]
      if (!range) {
        continue
      }

      if (!semver.subset(targetRange, range)) {
        dependencies[pkg] = targetRange
      }
    }
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8')
}

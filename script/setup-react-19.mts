import {execSync} from 'node:child_process'
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

execSync('npm install', {stdio: 'inherit'})

// Strip files of ts-expect-error comments that are no longer needed
const comment = `// @ts-expect-error [react-19] [TS2322]`

const files = glob.sync('packages/react/src/**/*.tsx', {
  ignore: ['**/node_modules/**', '**/dist/**', '**/lib/**', '**/lib-esm/**', '**/.next/**', '**/storybook-static/**'],
})

for (const filepath of files) {
  const contents = fs.readFileSync(filepath, 'utf8')
  const updated = contents.replaceAll(comment, '')
  fs.writeFileSync(filepath, updated, 'utf8')
}

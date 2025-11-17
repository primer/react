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

// eslint-disable-next-line no-console
console.log('Removing patches for @types/react...')
execSync('rm ./patches/@types+react+18.3.11.patch', {
  stdio: 'inherit',
})

// eslint-disable-next-line no-console
console.log('Installing updated dependencies...')
execSync('npm install', {
  stdio: 'inherit',
})

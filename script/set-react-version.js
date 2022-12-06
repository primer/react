'use strict'

const fs = require('node:fs/promises')
const os = require('node:os')
const path = require('node:path')

const versions = new Map([
  [
    '17',
    {
      dependencies: [
        {
          name: 'react',
          version: '17.0.2',
        },
        {
          name: 'react-dom',
          version: '17.0.2',
        },
        {
          name: 'react-test-renderer',
          version: '17.0.2',
        },
        {
          name: '@testing-library/react',
          version: '12.1.5',
        },
      ],
    },
  ],
  [
    '18',
    {
      dependencies: [
        {
          name: 'react',
          version: '18.2.0',
        },
        {
          name: 'react-dom',
          version: '18.2.0',
        },
        {
          name: 'react-test-renderer',
          version: '18.2.0',
        },
        {
          name: '@testing-library/react',
          version: '13.4.0',
        },
      ],
    },
  ],
])

async function main(version = 17) {
  if (!versions.has(version)) {
    throw new Error(`No React version defined for input: ${version}`)
  }

  const {dependencies} = versions.get(version)
  const packageJsonPath = path.resolve(__dirname, '..', 'package.json')
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))

  for (const dependency of dependencies) {
    if (!packageJson.devDependencies[dependency.name]) {
      throw new Error(`Dependency: ${dependency.name} was not found in devDependencies in ${packageJsonPath}`)
    }

    packageJson.devDependencies[dependency.name] = dependency.version
  }

  const contents = `${JSON.stringify(packageJson, null, 2)}${os.EOL}`
  await fs.writeFile(packageJsonPath, contents)
}

const [version] = process.argv.slice(2)

main(version).catch(error => {
  console.log(error)
  process.exit(1)
})

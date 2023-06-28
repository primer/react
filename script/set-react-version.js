'use strict'

const fs = require('node:fs/promises')
const os = require('node:os')
const path = require('node:path')

const versions = new Map([
  [
    '17',
    {
      devDependencies: [
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
          name: '@testing-library/dom',
          version: '^8.0.0',
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
      devDependencies: [
        {
          name: '@types/react',
          version: '18.0.28',
        },
        {
          name: '@types/react-dom',
          version: '18.2.6',
        },
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
          version: '14.0.0',
        },
      ],
    },
  ],
])

async function main(version = 17) {
  if (!versions.has(version)) {
    throw new Error(`No React version defined for input: ${version}`)
  }

  const {devDependencies} = versions.get(version)
  const packageJsonPath = path.resolve(__dirname, '..', 'package.json')
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))

  for (const dependency of devDependencies) {
    packageJson.devDependencies[dependency.name] = dependency.version
  }

  const contents = `${JSON.stringify(packageJson, null, 2)}${os.EOL}`
  await fs.writeFile(packageJsonPath, contents)
}

const [version] = process.argv.slice(2)

// eslint-disable-next-line github/no-then
main(version).catch(error => {
  // eslint-disable-next-line no-console
  console.log(error)
  process.exit(1)
})

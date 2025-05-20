import fs from 'node:fs'
import {spawn as spawnCallback} from 'node:child_process'
import path from 'node:path'
import {promisify} from 'node:util'

const spawn = promisify(spawnCallback)
const ROOT_DIRECTORY = path.resolve(import.meta.dirname, '../')
const workspaces = ['examples/codesandbox', 'examples/nextjs', 'examples/theming', 'packages/react']

async function main() {
  const overrides = {
    react: '19.1.0',
    'react-dom': '19.1.0',
    'react-test-renderer': '19.1.0',
    '@types/react': '19.1.4',
    '@types/react-dom': '19.1.5',
  } as const

  for (const workspace of workspaces) {
    const packageJsonPath = path.join(ROOT_DIRECTORY, workspace, 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

    for (const [key, value] of Object.entries(overrides)) {
      if (packageJson.devDependencies?.[key]) {
        packageJson.devDependencies[key] = value
      }

      if (packageJson.dependencies?.[key]) {
        packageJson.dependencies[key] = value
      }

      if (packageJson.peerDependencies?.[key]) {
        packageJson.peerDependencies[key] = value
      }
    }

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
  }

  await spawn('npm', ['install'], {
    cwd: ROOT_DIRECTORY,
    stdio: 'inherit',
  })
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})

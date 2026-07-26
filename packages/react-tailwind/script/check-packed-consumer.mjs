import {access, mkdir, mkdtemp, readFile, rm, stat, writeFile} from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import {createRequire} from 'node:module'
import {spawn} from 'node:child_process'

const packageRoot = path.resolve(import.meta.dirname, '..')
const distDirectory = path.join(packageRoot, 'dist')
const requiredStyles = ['styles.css', 'theme.css', 'tailwind.css', 'base.css', 'components.css']
const reactVersions = ['19.2.0']
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function run(command, args, {cwd, label}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let stdout = ''
    let stderr = ''

    child.stdout.on('data', chunk => {
      stdout += chunk
    })
    child.stderr.on('data', chunk => {
      stderr += chunk
    })
    child.on('error', error => {
      reject(new Error(`${label} could not start: ${error.message}`))
    })
    child.on('close', code => {
      if (code === 0) {
        resolve(stdout)
        return
      }

      const details = `${stdout}${stderr}`.trim().slice(-4000)
      reject(new Error(`${label} failed with exit code ${code}.${details ? `\n${details}` : ''}`))
    })
  })
}

async function assertBuiltArtifact() {
  const requiredFiles = [
    path.join(distDirectory, 'index.js'),
    ...requiredStyles.map(file => path.join(distDirectory, file)),
  ]

  for (const file of requiredFiles) {
    try {
      await access(file)
    } catch {
      throw new Error(`Built package artifact is missing ${path.relative(packageRoot, file)}. Run npm run build first.`)
    }
  }
}

async function packArtifact(packDirectory) {
  const output = await run(npmCommand, ['pack', '--json', '--pack-destination', packDirectory], {
    cwd: packageRoot,
    label: 'npm pack',
  })
  const [packed] = JSON.parse(output)

  if (!packed?.filename) {
    throw new Error('npm pack did not report a package tarball.')
  }

  return path.join(packDirectory, packed.filename)
}

function consumerProgram() {
  return `
import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'

const browserGlobals = [
  'window',
  'document',
  'navigator',
  'location',
  'history',
  'localStorage',
  'sessionStorage',
  'HTMLElement',
  'Element',
  'Node',
  'CustomEvent',
  'MutationObserver',
  'ResizeObserver',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'matchMedia',
  'getComputedStyle',
  'CSS',
]

for (const name of browserGlobals) {
  delete globalThis[name]
}

const failures = []
async function check(label, callback) {
  try {
    await callback()
  } catch (error) {
    failures.push(new Error(\`\${label}: \${error.message}\`, {cause: error}))
  }
}

let packageRoot
await check('Root package import', async () => {
  packageRoot = await import('@primer/react-tailwind')
})

if (packageRoot) {
  await check('Root package exports and server render', async () => {
    for (const name of ['BaseStyles', 'Button', 'TextInput', 'Overlay']) {
      const component = packageRoot[name]
      if (typeof component !== 'object' && typeof component !== 'function') {
        throw new Error(\`Missing \${name} export.\`)
      }
    }

    const markup = renderToStaticMarkup(
      React.createElement(
        packageRoot.BaseStyles,
        null,
        React.createElement(packageRoot.Button, {type: 'button'}, 'Consumer button'),
        React.createElement(packageRoot.TextInput, {
          'aria-label': 'Consumer input',
          defaultValue: 'Consumer value',
        }),
        React.createElement(packageRoot.Overlay, null, 'Consumer overlay'),
      ),
    )

    for (const component of ['BaseStyles', 'Button', 'TextInput', 'Overlay']) {
      if (!markup.includes(\`data-component="\${component}"\`)) {
        throw new Error(\`Server render did not produce \${component} markup.\`)
      }
    }
  })
}

for (const [name, expectedExport] of [
  ['Button', 'Button'],
  ['TextInput', 'TextInput'],
  ['Overlay', 'Overlay'],
]) {
  await check(\`\${name} subpath import\`, async () => {
    const module = await import(\`@primer/react-tailwind/\${name}\`)
    if (typeof module[expectedExport] !== 'object' && typeof module[expectedExport] !== 'function') {
      throw new Error(\`Missing \${expectedExport} export.\`)
    }
  })
}

if (failures.length > 0) {
  process.stderr.write(
    \`Packed package import and server render validation failed:\n\${failures.map(error => error.message).join('\\n')}\n\`,
  )
  process.exitCode = 1
}
`
}

function getErrorMessage(error) {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

async function validateStyles(consumerDirectory) {
  const resolveFromConsumer = createRequire(path.join(consumerDirectory, 'resolve.cjs'))

  for (const style of requiredStyles) {
    let resolvedStyle
    try {
      resolvedStyle = resolveFromConsumer.resolve(`@primer/react-tailwind/${style}`)
    } catch (error) {
      throw new Error(`Packed style export ${style} could not be resolved: ${error.message}`, {cause: error})
    }

    if ((await stat(resolvedStyle)).size === 0) {
      throw new Error(`Packed style export ${style} is empty.`)
    }
  }
}

async function findTailwindCli() {
  const binaryName = process.platform === 'win32' ? 'tailwindcss.cmd' : 'tailwindcss'

  for (let directory = packageRoot; ; directory = path.dirname(directory)) {
    const candidate = path.join(directory, 'node_modules', '.bin', binaryName)
    try {
      await access(candidate)
      return candidate
    } catch {
      if (directory === path.dirname(directory)) {
        throw new Error('Could not find the Tailwind v4 CLI from this package or the repository root.')
      }
    }
  }
}

async function compileTailwindConsumer(consumerDirectory, name, source) {
  const inputPath = path.join(consumerDirectory, `${name}.css`)
  const outputPath = path.join(consumerDirectory, `${name}.output.css`)
  const tailwindCli = await findTailwindCli()

  await writeFile(inputPath, source)
  await run(tailwindCli, ['--input', inputPath, '--output', outputPath], {
    cwd: consumerDirectory,
    label: `Tailwind v4 ${name} consumer compilation`,
  })

  const css = await readFile(outputPath, 'utf8')
  if (!css.includes('.rounded-md')) {
    throw new Error(`Tailwind v4 ${name} mode did not emit utilities discovered in the packed package dist.`)
  }
  if (!css.includes('@keyframes primer-skeleton-shimmer') || !css.includes('data-token-kind')) {
    throw new Error(`Tailwind v4 ${name} mode did not emit the package component CSS contract.`)
  }
}

async function validateTailwindConsumer(consumerDirectory) {
  await compileTailwindConsumer(
    consumerDirectory,
    'explicit',
    `@import 'tailwindcss';
@import '@primer/tailwind-config';
@import '@primer/react-tailwind/components.css';
@source './node_modules/@primer/react-tailwind/dist';
`,
  )
  await compileTailwindConsumer(
    consumerDirectory,
    'convenience',
    `@import 'tailwindcss';
@import '@primer/react-tailwind/tailwind.css';
`,
  )
}

async function validateConsumer(temporaryRoot, tarball, reactVersion) {
  const consumerDirectory = path.join(temporaryRoot, `react-${reactVersion}`)
  await mkdir(consumerDirectory, {recursive: true})
  await writeFile(
    path.join(consumerDirectory, 'package.json'),
    JSON.stringify({
      name: `packed-consumer-react-${reactVersion}`,
      private: true,
      type: 'module',
    }),
  )
  await run(
    npmCommand,
    [
      'install',
      '--no-package-lock',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
      `react@${reactVersion}`,
      `react-dom@${reactVersion}`,
      tarball,
    ],
    {cwd: consumerDirectory, label: `React ${reactVersion} consumer install`},
  )
  await writeFile(path.join(consumerDirectory, 'consumer.mjs'), consumerProgram())
  await validateStyles(consumerDirectory)
  await validateTailwindConsumer(consumerDirectory)
  await run(process.execPath, [path.join(consumerDirectory, 'consumer.mjs')], {
    cwd: consumerDirectory,
    label: `React ${reactVersion} packed package import and server render`,
  })
}

async function main() {
  await assertBuiltArtifact()
  const temporaryRoot = await mkdtemp(path.join(packageRoot, '.packed-consumer-'))
  const failures = []

  try {
    const tarball = await packArtifact(temporaryRoot)

    for (const reactVersion of reactVersions) {
      try {
        await validateConsumer(temporaryRoot, tarball, reactVersion)
      } catch (error) {
        failures.push(new Error(`React ${reactVersion} validation failed: ${getErrorMessage(error)}`, {cause: error}))
      }
    }
  } finally {
    await rm(temporaryRoot, {force: true, recursive: true})
  }

  if (failures.length > 0) {
    process.stderr.write(`Packed consumer validation failed:\n${failures.map(error => error.message).join('\n')}\n`)
    process.exitCode = 1
    return
  }

  process.stdout.write(
    `Packed consumer validation passed (React ${reactVersions.join(', ')}; root and Button/TextInput/Overlay subpaths; SSR; styles; Tailwind v4).\n`,
  )
}

await main()

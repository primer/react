import {access, copyFile, mkdir, mkdtemp, readFile, rm, stat, writeFile} from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import {createRequire} from 'node:module'
import {spawn} from 'node:child_process'
import {transform} from 'lightningcss'

const packageRoot = path.resolve(import.meta.dirname, '..')
const distDirectory = path.join(packageRoot, 'dist')
const requiredStyles = ['styles.css', 'theme.css', 'tailwind.css', 'base.css', 'components.css']
const reactVersions = ['19.2.0']
const tailwindVersions = ['4.2.2', '4.3.3']
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const packageRequire = createRequire(import.meta.url)

function run(command, args, {cwd, env, label}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env,
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

async function validateAgentDocs(consumerDirectory) {
  const resolveFromConsumer = createRequire(path.join(consumerDirectory, 'resolve.cjs'))

  for (const file of ['llms.txt', 'api-inventory.json']) {
    let resolved
    try {
      resolved = resolveFromConsumer.resolve(`@primer/react-tailwind/${file}`)
    } catch (error) {
      throw new Error(`Packed export ${file} could not be resolved: ${error.message}`, {cause: error})
    }

    if ((await stat(resolved)).size === 0) {
      throw new Error(`Packed export ${file} is empty.`)
    }
  }

  const packageDirectory = path.dirname(resolveFromConsumer.resolve('@primer/react-tailwind/package.json'))
  const guidance = await readFile(path.join(packageDirectory, 'llms.txt'), 'utf8')
  const buttonGuidance = await readFile(path.join(packageDirectory, 'llms/Button.md'), 'utf8')
  const themeGuidance = await readFile(path.join(packageDirectory, 'llms/ThemeProvider.md'), 'utf8')
  if (!guidance.includes('does not generate arbitrary app-owned Tailwind classes')) {
    throw new Error('Packed agent guidance does not explain the compiled CSS boundary.')
  }
  if (!buttonGuidance.includes('Use `submit` to submit a form.')) {
    throw new Error('Packed Button guidance does not explain explicit form submission.')
  }
  if (
    !guidance.includes('[ThemeProvider and useTheme](llms/ThemeProvider.md)') ||
    !themeGuidance.includes("resolvedColorMode === 'night'") ||
    !themeGuidance.includes("resolvedColorMode === 'dark'") ||
    !themeGuidance.includes('useTheme must be used within a ThemeProvider')
  ) {
    throw new Error(
      'Packed theme guidance must include discovery, legacy/modern image comparisons and context ownership.',
    )
  }
}

async function validateDeclarations(consumerDirectory) {
  const fixtures = [
    'navigation-consumer.tsx',
    'portal-foundation-consumer.tsx',
    'select-panel-consumer.tsx',
    'stack-consumer.tsx',
    'token-consumer.tsx',
  ]
  await Promise.all(
    fixtures.map(file => copyFile(path.join(packageRoot, 'fixtures', file), path.join(consumerDirectory, file))),
  )
  await writeFile(
    path.join(consumerDirectory, 'tsconfig.json'),
    JSON.stringify({
      extends: path.join(packageRoot, 'fixtures/tsconfig.json'),
      include: fixtures,
    }),
  )
  await run(process.execPath, [packageRequire.resolve('typescript/bin/tsc'), '-p', consumerDirectory], {
    cwd: consumerDirectory,
    label: 'Packed navigation, portal foundation, SelectPanel, Stack, Text, and Token declarations',
  })
}

async function findTailwindCli(consumerDirectory) {
  const binaryName = process.platform === 'win32' ? 'tailwindcss.cmd' : 'tailwindcss'

  for (let directory = consumerDirectory; ; directory = path.dirname(directory)) {
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

/** Escapes a class name the way Tailwind serializes it in a selector. */
function classSelector(className) {
  return `.${className.replace(/[^\w-]/g, character => `\\${character}`)}`
}

async function compileTailwindConsumer(consumerDirectory, name, source) {
  const inputPath = path.join(consumerDirectory, 'src', `${name}.css`)
  const outputPath = path.join(consumerDirectory, `${name}.output.css`)
  const tailwindCli = await findTailwindCli(consumerDirectory)

  await writeFile(inputPath, source)
  await run(tailwindCli, ['--input', inputPath, '--output', outputPath], {
    cwd: consumerDirectory,
    label: `Tailwind v4 ${name} consumer compilation`,
  })

  const css = await readFile(outputPath, 'utf8')
  try {
    transform({filename: outputPath, code: Buffer.from(css)})
  } catch (error) {
    throw new Error(`Tailwind v4 ${name} mode emitted invalid CSS: ${getErrorMessage(error)}`, {cause: error})
  }
  return css
}

const packageUtilities = [
  'primer:rounded-md',
  'primer:[position:absolute]',
  'primer:[visibility:hidden]',
  'primer:grid-cols-[fit-content(var(--available-width,100vw))]',
  'primer:min-w-[min(--spacing(48),var(--available-width,100vw))]',
  'primer:w-[min(30rem,var(--available-width,100vw))]',
]
const appUtilities = ['min-h-screen', 'max-w-[28rem]', 'gap-5', 'py-12']

/** The standalone entry generates only the package's `primer:`-prefixed utilities and component CSS. */
function assertStandalonePackageCss(css) {
  for (const className of packageUtilities) {
    if (!css.includes(classSelector(className))) {
      throw new Error(`Tailwind v4 standalone package stylesheet did not emit the package utility ${className}.`)
    }
  }
  for (const className of [...appUtilities, 'rounded-md']) {
    if (css.includes(`${classSelector(className)}{`) || css.includes(`${classSelector(className)} {`)) {
      throw new Error(`Tailwind v4 standalone package stylesheet emitted the unprefixed utility ${className}.`)
    }
  }
  // `@primer/tailwind-config/border` is referenced, not imported, so its static unprefixed focus rules stay out.
  for (const selector of ['.outline-focus', '.focus\\:outline-focus', '.focus-within\\:outline-focus']) {
    if (css.includes(selector)) {
      throw new Error(`Tailwind v4 standalone package stylesheet emitted the unprefixed static rule ${selector}.`)
    }
  }
  if (!css.includes('@keyframes primer-skeleton-shimmer') || !css.includes('data-token-kind')) {
    throw new Error('Tailwind v4 standalone package stylesheet did not emit the package component CSS contract.')
  }
  for (const fragment of [
    "[data-component='Dialog.CloseButton']",
    "[data-component='FormControl.Caption']",
    "[data-component='SegmentedControl.Divider']",
    "grid-template-areas: 'context context context context context'",
    "grid-template-areas: 'badge body' '. actions'",
  ]) {
    if (!css.includes(fragment)) {
      throw new Error(`Tailwind v4 standalone package stylesheet did not emit the expected utility for ${fragment}.`)
    }
  }
}

/** The app's own Tailwind build keeps unprefixed utilities and must not generate package classes. */
function assertAppCss(css) {
  for (const className of appUtilities) {
    if (!css.includes(classSelector(className))) {
      throw new Error(`Tailwind v4 app stylesheet did not emit the app-owned utility ${className}.`)
    }
  }
  if (css.includes('.primer\\:')) {
    throw new Error('Tailwind v4 app stylesheet emitted package-prefixed utilities.')
  }
}

async function validateTailwindConsumer(consumerDirectory) {
  const sourceDirectory = path.join(consumerDirectory, 'src')
  await mkdir(sourceDirectory, {recursive: true})
  await writeFile(
    path.join(sourceDirectory, 'App.jsx'),
    // Static source fixture for Tailwind's scanner, not rendered as HTML.
    // eslint-disable-next-line github/unescaped-html-literal
    '<main className="min-h-screen max-w-[28rem] gap-5 py-12">Consumer layout</main>\n',
  )
  // A Tailwind build has a single prefix, so the package stylesheet is generated separately from the app's.
  assertStandalonePackageCss(
    await compileTailwindConsumer(
      consumerDirectory,
      'standalone-package',
      `@import '@primer/react-tailwind/tailwind.css';
`,
    ),
  )
  assertAppCss(
    await compileTailwindConsumer(
      consumerDirectory,
      'app',
      `@import 'tailwindcss';
@import '@primer/tailwind-config';
@source './';
`,
    ),
  )
}

async function validateConsumer(temporaryRoot, tarball, reactVersion, tailwindVersion) {
  const consumerDirectory = path.join(temporaryRoot, `react-${reactVersion}-tailwind-${tailwindVersion}`)
  await mkdir(consumerDirectory, {recursive: true})
  await writeFile(
    path.join(consumerDirectory, 'package.json'),
    JSON.stringify({
      name: `packed-consumer-react-${reactVersion}-tailwind-${tailwindVersion}`,
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
      `tailwindcss@${tailwindVersion}`,
      `@tailwindcss/cli@${tailwindVersion}`,
      tarball,
    ],
    {cwd: consumerDirectory, label: `React ${reactVersion}, Tailwind ${tailwindVersion} consumer install`},
  )
  await copyFile(
    path.join(packageRoot, 'script/packed-consumer-entry.mjs'),
    path.join(consumerDirectory, 'consumer.mjs'),
  )
  await validateStyles(consumerDirectory)
  await validateAgentDocs(consumerDirectory)
  await validateDeclarations(consumerDirectory)
  await validateTailwindConsumer(consumerDirectory)
  for (const mode of ['production', 'development']) {
    await run(process.execPath, [path.join(consumerDirectory, 'consumer.mjs')], {
      cwd: consumerDirectory,
      env: {...process.env, NODE_ENV: mode},
      label: `React ${reactVersion} packed package import and server render (${mode})`,
    })
  }
}

async function main() {
  await assertBuiltArtifact()
  const temporaryRoot = await mkdtemp(path.join(packageRoot, '.packed-consumer-'))
  const failures = []

  try {
    const tarball = await packArtifact(temporaryRoot)

    for (const reactVersion of reactVersions) {
      for (const tailwindVersion of tailwindVersions) {
        try {
          await validateConsumer(temporaryRoot, tarball, reactVersion, tailwindVersion)
        } catch (error) {
          failures.push(
            new Error(
              `React ${reactVersion}, Tailwind ${tailwindVersion} validation failed: ${getErrorMessage(error)}`,
              {
                cause: error,
              },
            ),
          )
        }
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
    `Packed consumer validation passed (React ${reactVersions.join(', ')}; root, component, base, and behaviors subpaths; navigation, portal foundation, Stack, Text, and Token declarations; production and development SSR; styles; agent docs; Tailwind ${tailwindVersions.join(', ')}).\n`,
  )
}

await main()

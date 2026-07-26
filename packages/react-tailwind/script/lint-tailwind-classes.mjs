import {access, mkdir, mkdtemp, readFile, rm, writeFile} from 'node:fs/promises'
import {execFile} from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import {promisify} from 'node:util'
import glob from 'fast-glob'

const run = promisify(execFile)
const packageRoot = path.resolve(import.meta.dirname, '..')

// Tokens that are legitimately not Tailwind utilities but often share a class list.
const ALLOWED_NON_UTILITIES = new Set(['group', 'peer', 'sr-only', 'not-sr-only', 'dark', 'light', 'contents'])

// A token is only worth checking when it could plausibly be a utility.
const UTILITY_SHAPE = /^[a-z][a-z0-9]*(?:-[a-z0-9[\]()#%./,_-]+)*$/i
const VARIANT_SPLIT = /(?<!\\):(?![^[]*\])/

function countOf(value, character) {
  let total = 0
  for (const current of value) if (current === character) total += 1
  return total
}

function looksLikeUtility(token) {
  if (token.length < 2 || token.length > 120) return false
  if (token.startsWith('--') || token.startsWith('#') || token.startsWith('/')) return false
  // Arbitrary values may contain quotes, so a quoted literal can yield a truncated fragment.
  if (countOf(token, '[') !== countOf(token, ']') || countOf(token, '(') !== countOf(token, ')')) return false
  if (/[A-Z]/.test(token) && !token.includes('[')) return false
  if (/^(?:https?|data|aria|role)$/.test(token.split('-')[0]) && !token.includes('[')) return false
  const base = token.split(VARIANT_SPLIT).pop() ?? token
  return UTILITY_SHAPE.test(base)
}

/** Serializes a class name the way CSS does, including hex escapes for leading digits. */
function escapeSelector(token) {
  let result = ''
  for (let index = 0; index < token.length; index += 1) {
    const character = token[index]
    const code = token.codePointAt(index)
    const isDigit = code >= 0x30 && code <= 0x39
    const needsHexEscape = (index === 0 && isDigit) || (index === 1 && isDigit && token[0] === '-')

    if (needsHexEscape) {
      result += `\\${code.toString(16)} `
    } else if (code >= 0x80 || character === '-' || character === '_' || /[a-zA-Z0-9]/.test(character)) {
      result += character
    } else {
      result += `\\${character}`
    }
  }
  return result
}

/** The Tailwind CLI may be hoisted to the repository root. */
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

// Prefixes that only ever start a utility, used to judge single-class strings such as
// `max-sm:text-base` where there are no sibling classes to corroborate.
const UTILITY_PREFIX =
  /^(?:bg|text|border|rounded|shadow|outline|ring|font|leading|tracking|opacity|flex|grid|gap|inline|block|hidden|size|min|max|w|h|p[xytrbl]?|m[xytrbl]?|inset|top|right|bottom|left|z|items|justify|self|place|order|col|row|overflow|cursor|select|pointer|whitespace|align|table|list|object|transition|duration|ease|animate|translate|rotate|scale|origin|fill|stroke|underline|uppercase|lowercase|capitalize|truncate|sr|not)(?:-|$)/

function isUnambiguousUtility(token) {
  // Without sibling classes to corroborate, only a variant separator reliably distinguishes
  // a class from ordinary strings such as TypeScript union members.
  if (!token.includes(':')) return false
  if (!looksLikeUtility(token)) return false
  const base = token.split(VARIANT_SPLIT).pop() ?? token
  return UTILITY_PREFIX.test(base)
}

const sourceFiles = await glob('src/**/*.{ts,tsx}', {
  cwd: packageRoot,
  absolute: true,
  ignore: ['**/*.d.ts', '**/*.test.*', '**/*.stories.*', '**/*.storyHelpers.*', '**/test-setup.ts'],
})

/** Every string literal in the package, with the location that produced it. */
const literals = []
for (const file of sourceFiles) {
  const source = await readFile(file, 'utf8')
  const lines = source.split('\n')
  lines.forEach((line, index) => {
    for (const match of line.matchAll(/['"]([^'"\n]{2,2000})['"]/g)) {
      const value = match[1].trim()
      if (!value || !value.includes('-') || value.includes('${')) continue
      literals.push({file: path.relative(packageRoot, file), line: index + 1, value})
    }
  })
}

const candidates = new Set()
for (const literal of literals) {
  for (const token of literal.value.split(/\s+/)) {
    if (looksLikeUtility(token)) candidates.add(token)
  }
}

// Ask Tailwind to compile exactly these candidates, then see which produced a rule.
// The probe must live inside the package so that `tailwindcss` and `@primer/tailwind-config` resolve.
const cacheRoot = path.join(packageRoot, 'node_modules', '.cache')
await mkdir(cacheRoot, {recursive: true})
const workingDirectory = await mkdtemp(path.join(cacheRoot, 'tailwind-classes-'))
try {
  const candidateList = [...candidates].sort()
  await writeFile(path.join(workingDirectory, 'candidates.txt'), candidateList.join('\n'))
  await writeFile(
    path.join(workingDirectory, 'probe.css'),
    [
      '@layer theme, base, components, utilities;',
      "@import 'tailwindcss/theme.css' layer(theme);",
      "@import 'tailwindcss/utilities.css' layer(utilities);",
      `@import '${path.join(packageRoot, 'src/styles/theme.css')}';`,
      "@import '@primer/tailwind-config';",
      "@source './candidates.txt';",
    ].join('\n'),
  )

  const binary = await findTailwindCli()
  await run(binary, [
    '-i',
    path.join(workingDirectory, 'probe.css'),
    '-o',
    path.join(workingDirectory, 'probe.out.css'),
  ])

  const compiledCss = await readFile(path.join(workingDirectory, 'probe.out.css'), 'utf8')
  const compiles = token => ALLOWED_NON_UTILITIES.has(token) || compiledCss.includes(`.${escapeSelector(token)}`)

  // A literal is a class list when several of its tokens compile. Any token in such a
  // literal that produces no CSS is a typo or a utility that does not exist. Short literals
  // have no corroborating siblings, so they are judged on the token's own shape.
  const failures = []
  for (const literal of literals) {
    const tokens = literal.value.split(/\s+/).filter(looksLikeUtility)
    if (tokens.length === 0) continue
    const valid = tokens.filter(compiles)
    if (valid.length === tokens.length) continue

    const corroborated = valid.length >= 2
    for (const token of tokens.filter(token => !compiles(token))) {
      if (!corroborated && !isUnambiguousUtility(token)) continue
      failures.push({...literal, token})
    }
  }

  // Colors must come from Primer tokens so themes and high-contrast schemes keep working.
  const RAW_PALETTE =
    /\b(?:bg|text|border|fill|stroke|ring|outline|shadow|decoration|divide|accent|caret|from|via|to)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/
  const RAW_COLOR_VALUE =
    /\b(?:bg|text|border|fill|stroke|ring|outline|shadow|decoration|divide|accent|caret)-\[(?:#[0-9a-fA-F]{3,8}|(?:rgb|rgba|hsl|hsla|oklch|lab|color)\()/

  const tokenViolations = []
  for (const literal of literals) {
    for (const token of literal.value.split(/\s+/)) {
      if (RAW_PALETTE.test(token) || RAW_COLOR_VALUE.test(token)) {
        tokenViolations.push({...literal, token})
      }
    }
  }

  if (failures.length > 0 || tokenViolations.length > 0) {
    const seen = new Set()
    for (const failure of failures) {
      const key = `${failure.file}:${failure.line}:${failure.token}`
      if (seen.has(key)) continue
      seen.add(key)
      // eslint-disable-next-line no-console
      console.error(`${failure.file}:${failure.line} \`${failure.token}\` generates no CSS.`)
    }
    for (const violation of tokenViolations) {
      // eslint-disable-next-line no-console
      console.error(
        `${violation.file}:${violation.line} \`${violation.token}\` hardcodes a color. Use a Primer semantic utility or token.`,
      )
    }
    // eslint-disable-next-line no-console
    console.error(`\n${seen.size + tokenViolations.length} invalid class name(s).`)
    process.exitCode = 1
  } else {
    // eslint-disable-next-line no-console
    console.log(`Tailwind class check passed (${candidates.size} distinct classes across ${literals.length} literals).`)
  }
} finally {
  await rm(workingDirectory, {recursive: true, force: true})
}

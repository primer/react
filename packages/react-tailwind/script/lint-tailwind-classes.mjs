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

/** Package-owned utilities carry this Tailwind prefix so they cannot match host or legacy class names. */
const PACKAGE_PREFIX = 'primer:'
const unprefixed = token => (token.startsWith(PACKAGE_PREFIX) ? token.slice(PACKAGE_PREFIX.length) : token)

// A token is only worth checking when it could plausibly be a utility.
const UTILITY_SHAPE = /^[a-z][a-z0-9]*(?:-[a-z0-9[\]()#%./,_-]+)?$/i
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
  const base = unprefixed(token).split(VARIANT_SPLIT).pop() ?? token
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
  if (!unprefixed(token).includes(':')) return false
  if (!looksLikeUtility(token)) return false
  const base = token.split(VARIANT_SPLIT).pop() ?? token
  return UTILITY_PREFIX.test(base)
}

const sourceFiles = await glob('src/**/*.{ts,tsx}', {
  cwd: packageRoot,
  absolute: true,
  ignore: [
    '**/*.d.ts',
    '**/*.test.*',
    '**/test-setup.ts',
    // Configures tailwind-merge class groups rather than emitting class names.
    'src/internal/cn.ts',
  ],
})

/** Markers that indicate a string literal is being used as a class name. */
const CLASS_CONTEXT =
  /(?:className|classNames|\bcn\(|\bcva\(|\bclsx\(|\bmergeClassName\(|ClassName\b|Classes\b|twMerge\()/

/** Attributes and props whose values are never class names, even beside a `className`. */
const NON_CLASS_VALUE =
  /\b(?:id|\w+Id|htmlFor|aria-[\w-]+|data-[\w-]+|title|label|name|role|key|href|placeholder|alt|type|description|value|defaultValue|children)\s*[=:]\s*\{?\s*$/

/** Sentence punctuation never appears in a class list, so its presence marks prose. */
const PROSE_PUNCTUATION = /[.!?](?:\s|$)/

/** Mirrors `stylelint-disable-next-line`, for fixtures that intentionally copy upstream values. */
const DISABLE_NEXT_LINE = 'lint-tailwind-disable-next-line'

/**
 * Stories and their helpers stand in for host code, so the classes they pass to components are unprefixed and
 * Storybook generates them in a separate build.
 */
const CALLER_OWNED_FILE = /\.(?:stories|stories\.helpers|storyHelpers)\.tsx?$/

/** Every string literal that sits in a class-name context, with the location that produced it. */
const literals = []
for (const file of sourceFiles) {
  const source = await readFile(file, 'utf8')
  const callerOwned = CALLER_OWNED_FILE.test(file)
  const usesResponsiveLookup = source.includes('responsiveClasses(')
  const sourceLines = source.split('\n')
  const lineStarts = []
  let offset = 0
  for (const line of sourceLines) {
    lineStarts.push(offset)
    offset += line.length + 1
  }
  const lineFor = index => {
    let low = 0
    let high = lineStarts.length - 1
    while (low < high) {
      const mid = Math.ceil((low + high) / 2)
      if (lineStarts[mid] <= index) low = mid
      else high = mid - 1
    }
    return low + 1
  }

  for (const match of source.matchAll(/'([^'\n]{2,2000})'|"([^"\n]{2,2000})"/g)) {
    const value = (match[1] ?? match[2]).trim()
    if (!value || (!value.includes('-') && value !== 'border') || value.includes('${') || PROSE_PUNCTUATION.test(value))
      continue
    // A class list is always near the call or attribute that consumes it, including in
    // multi-line cn() and cva() expressions.
    const preceding = source.slice(Math.max(0, match.index - 600), match.index)
    if (!CLASS_CONTEXT.test(preceding) || NON_CLASS_VALUE.test(preceding)) continue
    const line = lineFor(match.index)
    if (sourceLines[line - 2]?.includes(DISABLE_NEXT_LINE)) continue
    literals.push({file: path.relative(packageRoot, file), line, value, callerOwned, usesResponsiveLookup})
  }
}

// `responsiveClasses()` maps take unprefixed lookup names that `responsiveUtilityClasses` resolves to prefixed
// utilities, and an unknown name throws at runtime.
const responsiveSource = await readFile(path.join(packageRoot, 'src/utils/responsive.ts'), 'utf8')
const RESPONSIVE_LOOKUP_NAMES = new Set(
  [...responsiveSource.matchAll(/^\s*'?([\w-]+)'?:\s*\{\s*narrow:/gm)].map(match => match[1]),
)

/** A literal made only of lookup names, in a file that resolves them with `responsiveClasses()`. */
function isResponsiveLookup(literal) {
  if (!literal.usesResponsiveLookup && literal.file !== path.join('src', 'utils', 'responsive.ts')) return false
  const tokens = literal.value.split(/\s+/)
  return tokens.every(token => RESPONSIVE_LOOKUP_NAMES.has(token))
}

const packageCandidates = new Set()
const callerCandidates = new Set()
for (const literal of literals) {
  for (const token of literal.value.split(/\s+/)) {
    if (!looksLikeUtility(token)) continue
    if (literal.callerOwned) {
      callerCandidates.add(token)
    } else {
      packageCandidates.add(token)
      // Lets an unprefixed token be reported as a missing prefix rather than as an unknown class.
      if (!token.startsWith(PACKAGE_PREFIX)) packageCandidates.add(PACKAGE_PREFIX + token)
    }
  }
}

// Ask Tailwind to compile exactly these candidates, then see which produced a rule.
// The probe must live inside the package so that `tailwindcss` and `@primer/tailwind-config` resolve.
const cacheRoot = path.join(packageRoot, 'node_modules', '.cache')
await mkdir(cacheRoot, {recursive: true})
const workingDirectory = await mkdtemp(path.join(cacheRoot, 'tailwind-classes-'))
try {
  const binary = await findTailwindCli()

  /** Compiles exactly these candidates with the package's theme, then returns the generated CSS. */
  async function compileCandidates(name, candidateSet, themeImport) {
    await writeFile(path.join(workingDirectory, `${name}.txt`), [...candidateSet].sort().join('\n'))
    await writeFile(
      path.join(workingDirectory, `${name}.css`),
      [
        '@layer theme, base, components, utilities;',
        themeImport,
        "@import 'tailwindcss/utilities.css' layer(utilities);",
        `@import '${path.join(packageRoot, 'src/styles/theme.css')}';`,
        "@import '@primer/tailwind-config';",
        `@source './${name}.txt';`,
      ].join('\n'),
    )
    await run(binary, [
      '-i',
      path.join(workingDirectory, `${name}.css`),
      '-o',
      path.join(workingDirectory, `${name}.out.css`),
    ])
    return readFile(path.join(workingDirectory, `${name}.out.css`), 'utf8')
  }

  // A Tailwind build has a single prefix, so package and caller-owned classes are compiled separately.
  const packageCss = await compileCandidates(
    'package',
    packageCandidates,
    "@import 'tailwindcss/theme.css' layer(theme) prefix(primer);",
  )
  const callerCss = await compileCandidates('caller', callerCandidates, "@import 'tailwindcss/theme.css' layer(theme);")

  const generatesCss = (css, token) => css.includes(`.${escapeSelector(token)}`)
  const compilesForPackage = token =>
    token.startsWith(PACKAGE_PREFIX) &&
    (ALLOWED_NON_UTILITIES.has(unprefixed(token)) || generatesCss(packageCss, token))
  const compilesForCaller = token => ALLOWED_NON_UTILITIES.has(token) || generatesCss(callerCss, token)

  // A literal is a class list when several of its tokens compile. Any token in such a
  // literal that produces no CSS is a typo or a utility that does not exist. Short literals
  // have no corroborating siblings, so they are judged on the token's own shape.
  const failures = []
  for (const literal of literals) {
    if (isResponsiveLookup(literal)) continue
    const tokens = literal.value.split(/\s+/).filter(looksLikeUtility)
    if (tokens.length === 0) continue
    const compiles = literal.callerOwned ? compilesForCaller : compilesForPackage
    const valid = tokens.filter(compiles)
    if (valid.length === tokens.length) continue
    // Several words with no compiling class and no variant or arbitrary syntax are copy, such
    // as a hyphenated phrase rendered beside a styled element.
    if (tokens.length >= 2 && valid.length === 0 && !tokens.some(token => /[:[]/.test(token))) continue

    for (const token of tokens.filter(token => !compiles(token))) {
      const base = unprefixed(token).split(VARIANT_SPLIT).pop() ?? token
      // A token sitting beside a class that compiles is almost certainly meant to be one too,
      // provided it also starts with a utility prefix.
      if (UTILITY_PREFIX.test(base) || valid.length >= 2 || isUnambiguousUtility(token)) {
        failures.push({...literal, token})
      }
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

  // `@primer/tailwind-config` ships these unprefixed classes as a static preset rule (2px solid, -2px offset)
  // rather than as generated utilities, so they bypass the package prefix and their cascade against package
  // utilities depends on stylesheet import order.
  const STATIC_FOCUS_PRESETS = new Set(['outline-focus', 'focus:outline-focus', 'focus-within:outline-focus'])
  const presetConflicts = literals.flatMap(literal =>
    literal.value
      .split(/\s+/)
      .filter(token => STATIC_FOCUS_PRESETS.has(token))
      .map(token => ({...literal, token})),
  )

  const legacyBorderConflicts = literals.flatMap(literal =>
    literal.value
      .split(/\s+/)
      .filter(token => unprefixed(token).split(VARIANT_SPLIT).pop() === 'border')
      .map(token => ({...literal, token})),
  )

  if (
    failures.length > 0 ||
    tokenViolations.length > 0 ||
    presetConflicts.length > 0 ||
    legacyBorderConflicts.length > 0
  ) {
    const seen = new Set()
    for (const failure of failures) {
      const key = `${failure.file}:${failure.line}:${failure.token}`
      if (seen.has(key)) continue
      seen.add(key)
      const missingPrefix =
        !failure.callerOwned &&
        !failure.token.startsWith(PACKAGE_PREFIX) &&
        compilesForPackage(PACKAGE_PREFIX + failure.token)
      // eslint-disable-next-line no-console
      console.error(
        missingPrefix
          ? `${failure.file}:${failure.line} \`${failure.token}\` is missing the package prefix. Use \`${PACKAGE_PREFIX}${failure.token}\`.`
          : `${failure.file}:${failure.line} \`${failure.token}\` generates no CSS.`,
      )
    }
    for (const violation of tokenViolations) {
      // eslint-disable-next-line no-console
      console.error(
        `${violation.file}:${violation.line} \`${violation.token}\` hardcodes a color. Use a Primer semantic utility or token.`,
      )
    }
    for (const conflict of presetConflicts) {
      // eslint-disable-next-line no-console
      console.error(
        `${conflict.file}:${conflict.line} \`${conflict.token}\` is an unprefixed static @primer/tailwind-config preset. Use \`${PACKAGE_PREFIX}focus-visible:outline-focus\` with explicit outline width and offset utilities.`,
      )
    }
    for (const conflict of legacyBorderConflicts) {
      // eslint-disable-next-line no-console
      console.error(
        `${conflict.file}:${conflict.line} \`${conflict.token}\` collides with the important legacy @primer/css border shorthand. Use \`${PACKAGE_PREFIX}border-thin\` (with the same variants).`,
      )
    }
    // eslint-disable-next-line no-console
    console.error(
      `\n${seen.size + tokenViolations.length + presetConflicts.length + legacyBorderConflicts.length} invalid class name(s).`,
    )
    process.exitCode = 1
  } else {
    // eslint-disable-next-line no-console
    console.log(
      `Tailwind class check passed (${packageCandidates.size + callerCandidates.size} distinct classes across ${literals.length} literals).`,
    )
  }
} finally {
  await rm(workingDirectory, {recursive: true, force: true})
}

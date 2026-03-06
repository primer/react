import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import {spawn} from 'child_process'
import baseMotion from '@primer/primitives/dist/docs/base/motion/motion.json' with {type: 'json'}
import baseSize from '@primer/primitives/dist/docs/base/size/size.json' with {type: 'json'}
import baseTypography from '@primer/primitives/dist/docs/base/typography/typography.json' with {type: 'json'}
import functionalSizeBorder from '@primer/primitives/dist/docs/functional/size/border.json' with {type: 'json'}
import functionalSizeCoarse from '@primer/primitives/dist/docs/functional/size/size-coarse.json' with {type: 'json'}
import functionalSizeFine from '@primer/primitives/dist/docs/functional/size/size-fine.json' with {type: 'json'}
import functionalSize from '@primer/primitives/dist/docs/functional/size/size.json' with {type: 'json'}
import light from '@primer/primitives/dist/docs/functional/themes/light.json' with {type: 'json'}
import functionalTypography from '@primer/primitives/dist/docs/functional/typography/typography.json' with {type: 'json'}

// radius.json may not exist in all versions of @primer/primitives
let functionalSizeRadius: Record<string, {name: string; type: string; value: string}> = {}
try {
  const require = createRequire(import.meta.url)
  const radiusPath = require.resolve('@primer/primitives/dist/docs/functional/size/radius.json')
  functionalSizeRadius = JSON.parse(readFileSync(radiusPath, 'utf-8'))
} catch {
  // radius.json not available in this version of @primer/primitives
}

const categories = {
  base: {
    motion: Object.values(baseMotion).map(token => {
      return {
        name: token.name,
        type: token.type,
        value: token.value,
      }
    }),
    size: Object.values(baseSize).map(token => {
      return {
        name: token.name,
        type: token.type,
        value: token.value,
      }
    }),
    typography: Object.values(baseTypography).map(token => {
      return {
        name: token.name,
        type: token.type,
        value: token.value,
      }
    }),
  },
  functional: {
    border: Object.values(functionalSizeBorder).map(token => {
      return {
        name: token.name,
        type: token.type,
        value: token.value,
      }
    }),
    radius: Object.values(functionalSizeRadius).map(token => {
      return {
        name: token.name,
        type: token.type,
        value: token.value,
      }
    }),
    sizeCoarse: Object.values(functionalSizeCoarse).map(token => {
      return {
        name: token.name,
        type: token.type,
        value: token.value,
      }
    }),
    sizeFine: Object.values(functionalSizeFine).map(token => {
      return {
        name: token.name,
        type: token.type,
        value: token.value,
      }
    }),
    size: Object.values(functionalSize).map(token => {
      return {
        name: token.name,
        type: token.type,
        value: token.value,
      }
    }),
    themes: {
      light: Object.values(light).map(token => {
        return {
          name: token.name,
          type: token.type,
          value: token.value,
        }
      }),
    },
    typography: Object.values(functionalTypography).map(token => {
      return {
        name: token.name,
        type: token.type,
        value: token.value,
      }
    }),
  },
} as const

const tokens = [
  ...categories.base.motion,
  ...categories.base.size,
  ...categories.base.typography,
  ...categories.functional.border,
  ...categories.functional.radius,
  ...categories.functional.sizeCoarse,
  ...categories.functional.sizeFine,
  ...categories.functional.size,
  ...categories.functional.themes.light,
  ...categories.functional.typography,
]

function serialize(value: typeof tokens): string {
  return value
    .map(token => {
      return `<token name="${token.name}" value="${token.value}" type="${token.type}"></token>`
    })
    .join('\n')
}

// Semantic group prefixes that apply to any element
const SEMANTIC_PREFIXES = [
  'bgColor',
  'fgColor',
  'border',
  'borderColor',
  'shadow',
  'focus',
  'color',
  'animation',
  'duration',
]

type TokenGroup = {
  name: string
  count: number
  subGroups?: string[]
}

type TokenGroups = {
  semantic: TokenGroup[]
  component: TokenGroup[]
}

function listTokenGroups(): TokenGroups {
  // Use the full token set so non-theme groups (stack, text, borderRadius, etc.) are included
  const allTokens = tokens

  // Group tokens by their first segment
  const groupMap = new Map<string, {count: number; subGroups: Set<string>}>()

  for (const token of allTokens) {
    const parts = token.name.split('-')
    const prefix = parts[0]

    if (!groupMap.has(prefix)) {
      groupMap.set(prefix, {count: 0, subGroups: new Set()})
    }

    const group = groupMap.get(prefix)!
    group.count++

    // For component tokens, track sub-groups (e.g., button-bgColor -> bgColor)
    if (!SEMANTIC_PREFIXES.includes(prefix) && parts.length > 1) {
      const subGroup = parts[1]
      if (SEMANTIC_PREFIXES.includes(subGroup)) {
        group.subGroups.add(subGroup)
      }
    }
  }

  const semantic: TokenGroup[] = []
  const component: TokenGroup[] = []

  for (const [name, data] of groupMap.entries()) {
    const group: TokenGroup = {
      name,
      count: data.count,
    }

    if (data.subGroups.size > 0) {
      group.subGroups = Array.from(data.subGroups).sort()
    }

    if (SEMANTIC_PREFIXES.includes(name)) {
      semantic.push(group)
    } else {
      component.push(group)
    }
  }

  // Sort by count descending
  semantic.sort((a, b) => b.count - a.count)
  component.sort((a, b) => b.count - a.count)

  return {semantic, component}
}

export {categories, tokens, serialize, listTokenGroups, type TokenGroups}

// Token with guidelines from markdown
type TokenWithGuidelines = {
  name: string
  value: string
  useCase: string
  rules: string
  group: string
}

// Parse design tokens spec from new DESIGN_TOKENS_SPEC.md format
function parseDesignTokensSpec(markdown: string): TokenWithGuidelines[] {
  const results: TokenWithGuidelines[] = []
  const lines = markdown.split('\n')

  let currentGroup = ''
  let currentToken: Partial<TokenWithGuidelines> | null = null
  let descriptionLines: string[] = []

  for (const line of lines) {
    // Match group headings (## heading)
    const groupMatch = line.match(/^## (.+)$/)
    if (groupMatch) {
      // Save previous token if exists
      if (currentToken?.name) {
        results.push({
          name: currentToken.name,
          value: getTokenValue(currentToken.name),
          useCase: currentToken.useCase || descriptionLines.join(' '),
          rules: currentToken.rules || '',
          group: currentToken.group || '',
        })
        descriptionLines = []
      }
      currentGroup = groupMatch[1].trim()
      currentToken = null
      continue
    }

    // Match token name (### tokenName)
    const tokenMatch = line.match(/^### (.+)$/)
    if (tokenMatch) {
      // Save previous token if exists
      if (currentToken?.name) {
        results.push({
          name: currentToken.name,
          value: getTokenValue(currentToken.name),
          useCase: currentToken.useCase || descriptionLines.join(' '),
          rules: currentToken.rules || '',
          group: currentToken.group || '',
        })
      }
      descriptionLines = []
      currentToken = {
        name: tokenMatch[1].trim(),
        group: currentGroup,
      }
      continue
    }

    // Match new format usage line (**U:**)
    const newUsageMatch = line.match(/^\*\*U:\*\*\s*(.+)$/)
    if (newUsageMatch && currentToken) {
      currentToken.useCase = newUsageMatch[1].trim()
      continue
    }

    // Match new format rules line (**R:**)
    const newRulesMatch = line.match(/^\*\*R:\*\*\s*(.+)$/)
    if (newRulesMatch && currentToken) {
      currentToken.rules = newRulesMatch[1].trim()
      continue
    }

    // Description line (line after token name, before U:/R:)
    if (currentToken && !currentToken.useCase && !line.startsWith('**') && line.trim() && !line.startsWith('#')) {
      descriptionLines.push(line.trim())
    }
  }

  // Don't forget the last token
  if (currentToken?.name) {
    results.push({
      name: currentToken.name,
      value: getTokenValue(currentToken.name),
      useCase: currentToken.useCase || descriptionLines.join(' '),
      rules: currentToken.rules || '',
      group: currentToken.group || '',
    })
  }

  return results
}

// Get token value from the loaded tokens
function getTokenValue(tokenName: string): string {
  const found = tokens.find(token => token.name === tokenName)
  return found ? String(found.value) : ''
}

// Human-readable display labels for canonical group prefixes
const GROUP_LABELS: Record<string, string> = {
  bgColor: 'Background Color',
  fgColor: 'Foreground Color',
  borderColor: 'Border Color',
  border: 'Border',
  shadow: 'Shadow',
  focus: 'Focus',
  color: 'Color',
  borderWidth: 'Border Width',
  borderRadius: 'Border Radius',
  boxShadow: 'Box Shadow',
  controlStack: 'Control Stack',
  fontStack: 'Font Stack',
  outline: 'Outline',
  text: 'Text',
  control: 'Control',
  overlay: 'Overlay',
  stack: 'Stack',
  spinner: 'Spinner',
}

// Get canonical group prefix from token name
function getGroupFromName(name: string): string {
  return name.split('-')[0]
}

// Build complete token list from JSON (includes all tokens, not just those with guidelines)
function buildAllTokens(guidelinesTokens: TokenWithGuidelines[]): TokenWithGuidelines[] {
  const guidelinesMap = new Map(guidelinesTokens.map(t => [t.name, t]))

  // Include theme tokens AND size/typography/border tokens
  const allSourceTokens = [
    ...categories.base.motion,
    ...categories.base.size,
    ...categories.base.typography,
    ...categories.functional.themes.light,
    ...categories.functional.size,
    ...categories.functional.sizeCoarse,
    ...categories.functional.sizeFine,
    ...categories.functional.border,
    ...categories.functional.radius,
    ...categories.functional.typography,
  ]

  const allTokens: TokenWithGuidelines[] = []
  const seen = new Set<string>()

  for (const token of allSourceTokens) {
    if (seen.has(token.name)) continue
    seen.add(token.name)

    const existing = guidelinesMap.get(token.name)
    if (existing) {
      allTokens.push(existing)
    } else {
      allTokens.push({
        name: token.name,
        value: String(token.value),
        useCase: '',
        rules: '',
        group: getGroupFromName(token.name),
      })
    }
  }

  return allTokens
}

// Find tokens matching query and optional group filter
function findTokens(allTokens: TokenWithGuidelines[], query: string, group?: string): TokenWithGuidelines[] {
  const lowerQuery = query.toLowerCase()
  const lowerGroup = group?.toLowerCase()

  return allTokens.filter(token => {
    // Filter by group if provided - exact match only
    if (lowerGroup && token.group.toLowerCase() !== lowerGroup) {
      return false
    }

    // Fuzzy match against name, useCase, and rules
    const searchText = `${token.name} ${token.useCase} ${token.rules}`.toLowerCase()
    return searchText.includes(lowerQuery)
  })
}

// Expand token patterns like [accent, danger] into multiple tokens
function expandTokenPattern(token: TokenWithGuidelines): TokenWithGuidelines[] {
  const bracketRegex = /\[(.*?)\]/
  const match = token.name.match(bracketRegex)

  if (!match) return [token]

  const variants = match[1].split(',').map((s: string) => s.trim())
  return variants.map(variant => ({
    ...token,
    name: token.name.replace(bracketRegex, variant),
  }))
}

// Load and parse token guidelines, then build complete token list
function loadAllTokensWithGuidelines(): TokenWithGuidelines[] {
  try {
    const specMarkdown = loadDesignTokensSpec()
    const specTokens = parseDesignTokensSpec(specMarkdown)
    return buildAllTokens(specTokens)
  } catch {
    // DESIGN_TOKENS_SPEC.md not available in this version of @primer/primitives
    return buildAllTokens([])
  }
}

// Load the design tokens guide (logic, rules, patterns, golden examples)
function loadDesignTokensGuide(): string {
  const require = createRequire(import.meta.url)
  const guidePath = require.resolve('@primer/primitives/DESIGN_TOKENS_GUIDE.md')
  return readFileSync(guidePath, 'utf-8')
}

// Load the design tokens spec (token dictionary with use cases and rules)
function loadDesignTokensSpec(): string {
  const require = createRequire(import.meta.url)
  const specPath = require.resolve('@primer/primitives/DESIGN_TOKENS_SPEC.md')
  return readFileSync(specPath, 'utf-8')
}

// Get design token specifications text with dynamic group information
function getDesignTokenSpecsText(groups: TokenGroups): string {
  return `
# Design Token Specifications

## 1. Core Rule & Enforcement
* **Expert Mode**: CSS expert. NEVER use raw values (hex, px, etc.). Tokens only.
* **Motion & Transitions:** Every interactive state change (Hover, Active) MUST include a transition. NEVER use raw values like 200ms or ease-in. Use var(--base-duration-...) and var(--base-easing-...).
* **Shorthand**: MUST use \`font: var(...)\`. NEVER split size/weight. 
* **Shorthand Fallback**: If no shorthand exists (e.g. Monospace), use individual tokens for font-size, family, and line-height. NEVER raw 1.5.
* **States**: Define 5: Rest, Hover, Focus-visible, Active, Disabled.
* **Focus**: \`:focus-visible\` MUST use \`outline: var(--focus-outline)\` AND \`outline-offset: var(--outline-focus-offset)\`.
* **Validation**: CALL \`lint_css\` after any CSS change. Task is incomplete without a success message.
* **Self-Correction**: Adopt autofixes immediately. Report unfixable errors to the user.

## 2. Typography Constraints (STRICT)
- **Body Only**: Only \`body\` group supports size suffixes (e.g., \`body-small\`).
- **Static Shorthands**: NEVER add suffixes to \`caption\`, \`display\`, \`codeBlock\`, or \`codeInline\`.

## 3. Logic Matrix: Color & Semantic Mapping
| Input Color/Intent | Semantic Role | Background Suffix | Foreground Requirement |
| :--- | :--- | :--- | :--- |
| Blue / Interactive | \`accent\` | \`-emphasis\` (Solid) | \`fgColor-onEmphasis\` |
| Green / Positive | \`success\` | \`-muted\` (Light) | \`fgColor-{semantic}\` |
| Red / Danger | \`danger\` | \`-emphasis\` | \`fgColor-onEmphasis\` |
| Yellow / Warning | \`attention\` | \`-muted\` | \`fgColor-attention\` |
| Orange / Critical | \`severe\` | \`-emphasis\` | \`fgColor-onEmphasis\` |
| Purple / Done | \`done\` | Any | Match intent |
| Pink / Sponsors | \`sponsors\` | Any | Match intent |
| Grey / Neutral | \`default\` | \`bgColor-muted\` | \`fgColor-default\` (Not muted) |

## 4. Optimization & Recipes (MANDATORY)
**Strategy**: STOP property-by-property searching. Use \`get_token_group_bundle\` for these common patterns:
- **Forms**: \`["control", "focus", "outline", "text", "borderRadius", "stack", "animation"]\`
- **Modals/Cards**: \`["overlay", "shadow", "outline", "borderRadius", "bgColor", "stack", "animation"]\`
- **Tables/Lists**: \`["stack", "borderColor", "text", "bgColor", "control"]\`
- **Nav/Sidebars**: \`["control", "text", "accent", "stack", "focus", "animation"]\`
- **Status/Badges**: \`["text", "success", "danger", "attention", "severe", "stack"]\`

## 5. Available Groups
- **Semantic**: ${groups.semantic.map(g => `${g.name}\``).join(', ')}
- **Components**: ${groups.component.map(g => `\`${g.name}\``).join(', ')}
`.trim()
}

// Get token usage patterns text (static golden examples)
function getTokenUsagePatternsText(): string {
  return `
# Design Token Reference Examples

> **CRITICAL FOR AI**: To implement the examples below, DO NOT search for tokens one-by-one. 
> Use \`get_token_group_bundle(groups: ["control", "stack", "focus", "borderRadius"])\` to fetch the required token values in a single call.

---

## 1. Interaction Pattern: The Primary Button
*Demonstrates: 5 states, color pairing, typography shorthand, and motion.*

\`\`\`css
.btn-primary {
  /* Logic: Use control tokens for interactive elements */
  background-color: var(--control-bgColor-rest);
  color: var(--fgColor-default);
  font: var(--text-body-shorthand-medium); /* MUST use shorthand */
  
  /* Scale: DEFAULT is medium/normal */
  padding-block: var(--control-medium-paddingBlock);
  padding-inline: var(--control-medium-paddingInline-normal);
  border: none;
  border-radius: var(--borderRadius-medium);
  cursor: pointer;

  /* Motion: MUST be <300ms */
  transition: background-color 150ms ease, transform 100ms ease;
}

.btn-primary:hover {
  background-color: var(--control-bgColor-hover);
}

.btn-primary:focus-visible {
  outline: var(--focus-outline);
  outline-offset: var(--outline-focus-offset);
}

.btn-primary:active {
  background-color: var(--control-bgColor-active);
  transform: scale(0.98);
}

.btn-primary:disabled {
  /* Logic: MUST pair bgColor-disabled with fgColor-disabled */
  background-color: var(--bgColor-disabled);
  color: var(--fgColor-disabled);
  cursor: not-allowed;
}
\`\`\`

---

## 2. Layout Pattern: Vertical Stack
*Demonstrates: Layout spacing rules and matching padding density.*

\`\`\`css
.card-stack {
  display: flex;
  flex-direction: column;

  /* Logic: Use stack tokens for layout spacing */
  gap: var(--stack-gap-normal);
  padding: var(--stack-padding-normal);
  
  background-color: var(--bgColor-default);
  border: 1px solid var(--borderColor-default);
  border-radius: var(--borderRadius-large);
}

/* Logic: Matching padding density to purpose */
.card-header {
  padding-block-end: var(--stack-gap-condensed);
  border-bottom: 1px solid var(--borderColor-muted);
}
\`\`\`

---

## Implementation Rules for AI:
1. **Shorthand First**: Always use \`font: var(...)\` rather than splitting size/weight.
2. **States**: Never implement a button without all 5 states.
3. **Spacing**: Use \`control-\` tokens for the component itself and \`stack-\` tokens for the container/layout.
4. **Motion**: Always include the \`prefers-reduced-motion\` media query to set transitions to \`none\`.
\`\`\`css
@media (prefers-reduced-motion: reduce) {
  .btn-primary {
    transition: none;
  }
}
\`\`\`
`.trim()
}

// Search tokens with keyword matching and optional group filter
// Returns expanded tokens (patterns like [accent, danger] are expanded) filtered by query
function searchTokens(allTokens: TokenWithGuidelines[], query: string, group?: string): TokenWithGuidelines[] {
  // 1. Flatten and expand all patterns first (e.g., [accent, danger])
  const expandedTokens = allTokens.flatMap(expandTokenPattern)

  // 2. Prepare keywords and group filter
  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter(k => k.length > 0)

  // 3. Perform filtered search with keyword splitting (Logical AND)
  return expandedTokens.filter(token => {
    // Combine all relevant metadata into one searchable string
    const searchableText = `${token.name} ${token.useCase} ${token.rules} ${token.group}`.toLowerCase()

    // Ensure EVERY keyword in the query exists somewhere in this token's metadata
    const matchesKeywords = keywords.every(word => searchableText.includes(word))

    const matchesGroup = !group || tokenMatchesGroup(token, group)

    return matchesKeywords && matchesGroup
  })
}

// Alias map: fuzzy/human-readable names → canonical token name prefix
const GROUP_ALIASES: Record<string, string> = {
  // Identity mappings (canonical prefixes, lowercased key)
  bgcolor: 'bgColor',
  fgcolor: 'fgColor',
  bordercolor: 'borderColor',
  border: 'border',
  shadow: 'shadow',
  focus: 'focus',
  color: 'color',
  button: 'button',
  control: 'control',
  overlay: 'overlay',
  borderradius: 'borderRadius',
  boxshadow: 'boxShadow',
  fontstack: 'fontStack',
  spinner: 'spinner',

  // Fuzzy aliases
  background: 'bgColor',
  backgroundcolor: 'bgColor',
  bg: 'bgColor',
  foreground: 'fgColor',
  foregroundcolor: 'fgColor',
  textcolor: 'fgColor',
  fg: 'fgColor',
  radius: 'borderRadius',
  rounded: 'borderRadius',
  elevation: 'overlay',
  depth: 'overlay',
  btn: 'button',
  typography: 'text',
  font: 'text',
  text: 'text',
  'line-height': 'text',
  lineheight: 'text',
  leading: 'text',

  // Layout & Spacing
  stack: 'stack',
  controlstack: 'controlStack',
  padding: 'stack',
  margin: 'stack',
  gap: 'stack',
  spacing: 'stack',
  layout: 'stack',

  // State & Interaction
  offset: 'focus',
  outline: 'outline',
  ring: 'focus',

  // Decoration & Borders
  borderwidth: 'borderWidth',
  line: 'borderColor',
  stroke: 'borderColor',
  separator: 'borderColor',

  // Color-to-Semantic Intent Mapping
  red: 'danger',
  green: 'success',
  yellow: 'attention',
  orange: 'severe',
  blue: 'accent',
  purple: 'done',
  pink: 'sponsors',
  grey: 'neutral',
  gray: 'neutral',

  // Descriptive Aliases
  light: 'muted',
  subtle: 'muted',
  dark: 'emphasis',
  strong: 'emphasis',
  intense: 'emphasis',
  bold: 'emphasis',
  vivid: 'emphasis',
  highlight: 'emphasis',
}

// Match a token against a resolved group by checking both the token name prefix and the group label
function tokenMatchesGroup(token: TokenWithGuidelines, resolvedGroup: string): boolean {
  const rg = resolvedGroup.toLowerCase()
  const tokenPrefix = token.name.split('-')[0].toLowerCase()
  const tokenGroup = token.group.toLowerCase()
  return tokenPrefix === rg || tokenGroup === rg
}

// Group tokens by their group property and format as Markdown
function formatBundle(bundleTokens: TokenWithGuidelines[]): string {
  const grouped = bundleTokens.reduce<Record<string, TokenWithGuidelines[]>>((acc, token) => {
    const group = GROUP_LABELS[token.group] || token.group || 'Ungrouped'
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!acc[group]) acc[group] = []
    acc[group].push(token)
    return acc
  }, {})

  return Object.entries(grouped)
    .map(([group, groupTokens]) => {
      const tokenList = groupTokens
        .map(t => {
          const nameLabel = t.value ? `\`${t.name}\` → \`${t.value}\`` : `\`${t.name}\``
          return `- ${nameLabel}\n  - **U**: ${t.useCase || '(none)'}\n  - **R**: ${t.rules || '(none)'}`
        })
        .join('\n')
      return `## ${group}\n\n${tokenList}`
    })
    .join('\n\n---\n\n')
}

/**
 * Generates a sorted, unique list of group names from the current token cache.
 * Used for "Healing" error messages and the Design System Search Map.
 */
function getValidGroupsList(validTokens: TokenWithGuidelines[]): string {
  if (validTokens.length === 0) {
    return 'No groups available.'
  }

  // 1. Extract unique group names
  const uniqueGroups = Array.from(new Set(validTokens.map(t => t.group)))

  // 2. Sort alphabetically for consistency
  uniqueGroups.sort((a, b) => a.localeCompare(b))

  // 3. Return as a formatted Markdown string with backticks
  return uniqueGroups.map(g => `\`${g}\``).join(', ')
}

// Usage Guidance Hints
const groupHints: Record<string, string> = {
  control: '`control` tokens are for form inputs/checkboxes. For buttons, use the `button` group.',
  button: '`button` tokens are for standard triggers. For form-fields, see the `control` group.',
  text: 'STRICT: The following typography groups do NOT support size suffixes (-small, -medium, -large): `caption`, `display`, `codeBlock`, and `codeInline`. STRICT: Use shorthand tokens where possible. If splitting, you MUST fetch line-height tokens (e.g., --text-body-lineHeight-small) instead of using raw numbers.',
  fgColor: 'Use `fgColor` for text. For borders, use `borderColor`.',
  borderWidth:
    '`borderWidth` only has sizing values (thin, thick, thicker). For border *colors*, use the `borderColor` or `border` group.',
  animation:
    'TRANSITION RULE: Apply duration and easing to the base class, not the :hover state. Standard pairing: `transition: background-color var(--base-duration-200) var(--base-easing-easeInOut);`',
}

// -----------------------------------------------------------------------------
// Stylelint runner
// -----------------------------------------------------------------------------
function runStylelint(css: string): Promise<{stdout: string; stderr: string}> {
  return new Promise((resolve, reject) => {
    const proc = spawn('npx', ['stylelint', '--stdin', '--fix'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
    })

    let stdout = ''
    let stderr = ''

    proc.stdout.on('data', (data: Buffer) => {
      stdout += data.toString()
    })

    proc.stderr.on('data', (data: Buffer) => {
      stderr += data.toString()
    })

    proc.on('close', code => {
      if (code === 0) {
        resolve({stdout, stderr})
      } else {
        const error = new Error(`Stylelint exited with code ${code}`) as Error & {stdout: string; stderr: string}
        error.stdout = stdout
        error.stderr = stderr
        reject(error)
      }
    })

    proc.on('error', reject)

    proc.stdin.write(css)
    proc.stdin.end()
  })
}

export {
  parseDesignTokensSpec,
  findTokens,
  buildAllTokens,
  expandTokenPattern,
  loadAllTokensWithGuidelines,
  loadDesignTokensGuide,
  loadDesignTokensSpec,
  getDesignTokenSpecsText,
  getTokenUsagePatternsText,
  getValidGroupsList,
  searchTokens,
  formatBundle,
  groupHints,
  GROUP_ALIASES,
  GROUP_LABELS,
  tokenMatchesGroup,
  runStylelint,
  type TokenWithGuidelines,
}

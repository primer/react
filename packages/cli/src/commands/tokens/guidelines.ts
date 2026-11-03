import {tablemark} from 'tablemark'
import {listTokenGroups, loadTokenGuide} from '../../token-metadata'

export function getTokenSpecs(): string {
  return `# Design Token Specifications

## Core Rules

- Use design tokens instead of raw colors, dimensions, durations, or easing values.
- Use typography shorthand tokens where available. Otherwise use individual font-size, font-family, and line-height tokens.
- Define rest, hover, focus-visible, active, and disabled states for interactive elements.
- Apply transitions to the base class and respect \`prefers-reduced-motion\`.
- Use \`outline: var(--focus-outline)\` and \`outline-offset: var(--outline-focus-offset)\` for focus-visible.
- Validate CSS with the project's linting tools. The Primer MCP server also provides \`lint_css\`.

## Typography Constraints

Do not add size suffixes to \`caption\`, \`display\`, \`codeBlock\`, or \`codeInline\` shorthands. Fetch an existing token with \`primer tokens get\` instead of inventing a name.

## Color and Semantic Mapping

| Color or intent | Semantic role | Background | Foreground |
| --- | --- | --- | --- |
| Blue / Interactive | accent | emphasis | fgColor-onEmphasis |
| Green / Positive | success | muted | fgColor-success |
| Red / Danger | danger | emphasis | fgColor-onEmphasis |
| Yellow / Warning | attention | muted | fgColor-attention |
| Orange / Critical | severe | emphasis | fgColor-onEmphasis |
| Purple / Done | done | Match intent | Match intent |
| Pink / Sponsors | sponsors | Match intent | Match intent |
| Grey / Neutral | default | bgColor-muted | fgColor-default |

## Group Recipes

Use \`primer tokens group list <groups...>\` instead of searching property by property:

- Forms: \`control focus outline text borderRadius stack base\`
- Modals and cards: \`overlay shadow outline borderRadius bgColor stack base\`
- Tables and lists: \`stack borderColor text bgColor control\`
- Navigation and sidebars: \`control text accent stack focus base\`
- Status and badges: \`text success danger attention severe stack\`

## Available Groups

${tablemark(
  listTokenGroups().map(group => {
    return {name: group.name, count: group.count}
  }),
  {columns: ['Group', 'Tokens']},
).trimEnd()}

---

${loadTokenGuide().trimEnd()}`
}

export function getTokenUsage(): string {
  const guide = loadTokenGuide()
  const goldenExample = guide.match(/## Golden Example[\s\S]*?(?=\n## |$)/)?.[0].trim()
  if (!goldenExample) {
    throw new Error('The design token guide is missing its Golden Example section')
  }

  return `# Design Token Reference Examples

Fetch the tokens for a pattern together with \`primer tokens group list button control stack focus outline borderRadius text base\`.

## Interaction Pattern: Button

\`\`\`css
.button {
  background-color: var(--control-bgColor-rest);
  color: var(--fgColor-default);
  font: var(--text-body-shorthand-medium);
  padding-block: var(--control-medium-paddingBlock);
  padding-inline: var(--control-medium-paddingInline-normal);
  border: none;
  border-radius: var(--borderRadius-medium);
  cursor: pointer;
  transition: background-color var(--base-duration-100) var(--base-easing-ease);
}

.button:hover {
  background-color: var(--control-bgColor-hover);
}

.button:focus-visible {
  outline: var(--focus-outline);
  outline-offset: var(--outline-focus-offset);
}

.button:active {
  background-color: var(--control-bgColor-active);
}

.button:disabled {
  background-color: var(--bgColor-disabled);
  color: var(--fgColor-disabled);
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;
  }
}
\`\`\`

## Layout Pattern: Vertical Stack

\`\`\`css
.card-stack {
  display: flex;
  flex-direction: column;
  gap: var(--stack-gap-normal);
  padding: var(--stack-padding-normal);
  background-color: var(--bgColor-default);
  border: var(--borderWidth-thin) solid var(--borderColor-default);
  border-radius: var(--borderRadius-large);
}

.card-header {
  padding-block-end: var(--stack-gap-condensed);
  border-bottom: var(--borderWidth-thin) solid var(--borderColor-muted);
}
\`\`\`

## Implementation Rules

- Prefer typography shorthand tokens.
- Include all five interactive states and support reduced motion.
- Use control spacing for controls and stack spacing for layout.
- Use tokens for motion durations, easing, and border widths.

## Upstream Reference

The following is the reference example supplied by \`@primer/primitives\`.

${goldenExample}`
}

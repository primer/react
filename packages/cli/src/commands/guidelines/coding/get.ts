import {defineCommand} from 'citty'
import {log} from '../../../console'

export const get = defineCommand({
  meta: {
    name: 'get',
    description: 'Get guidelines for writing code that uses Primer',
  },
  run() {
    log(`When writing code that uses Primer, follow these guidelines:

## Design Tokens

- Prefer design tokens over hard-coded values. For example, use \`var(--fgColor-default)\` instead of \`#24292f\`. Use the Primer MCP \`find_tokens\` tool to search for a design token by keyword or group, \`get_design_token_specs\` to browse available token groups, and \`get_token_group_bundle\` to retrieve all tokens within a specific group.
- Prefer design tokens in the same group for related CSS properties. For example, when styling background and border color, use tokens from the same group/category.

## Authoring & Using Components

- Prefer re-using a component from Primer when possible over writing a new component.
- Prefer using existing props for a component for styling instead of adding styling to a component.
- Prefer using icons from Primer instead of creating new icons. Use \`primer icons list\` to find the icon you need.
- Follow patterns from Primer when creating new components. Prefer a scenario pattern when one fits the task, and fall back to generic UI patterns otherwise. Use \`primer scenarios list\` and \`primer patterns list\` to find the pattern you need.
- When using a component from Primer, follow its usage and accessibility guidelines. Use \`primer components usage get <id|name>\` and \`primer components accessibility get <id|name>\` to retrieve them.

## Coding guidelines

The following list of coding guidelines must be followed:

- Do not use the sx prop for styling components. Instead, use CSS Modules.
- Do not use the Box component for styling components. Instead, use CSS Modules.`)
  },
})

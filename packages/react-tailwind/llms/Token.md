# Token

`Token` displays compact filter or selection content with optional leading visuals, selection state, and removal behavior. `IssueLabelToken` provides the same token interaction model with a custom label color.

Import: `import {Token} from '@primer/react-tailwind/Token'`

## Props

- `as`: `"a" | "button" | "span"` — Default `'span'`. Element to render. Use `a` or `button` when the token is interactive.
- `disabled`: `boolean` — Prevents interaction with the token and its remove button.
- `hideRemoveButton`: `boolean` — Default `false`. Hides the remove button while `onRemove` still handles removal by keyboard.
- `href`: `string` — Makes the token a link to the given URL.
- `id`: `string | number` — Identifier passed back to `onRemove`, so a caller can tell which token was removed.
- `isSelected`: `boolean` — Marks the token as the current one in a list of tokens.
- `leadingVisual`: `React.ElementType` — Icon shown before the token's text.
- `onRemove`: `(() => void)` — Shows a remove button and is called when it is activated.
- `size`: `TokenSize` — Default `'medium'`. Height and text size of the token.
- `text`: `React.ReactNode` — Label shown on the token.

## Differences from `@primer/react`

- Do not nest a remove button inside a link/button token.

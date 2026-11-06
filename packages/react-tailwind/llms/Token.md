# Token

`Token` displays compact filter or selection content with optional leading visuals, selection state, and removal behavior. `IssueLabelToken` provides the same token interaction model with a custom label color.

Import: `import {Token, IssueLabelToken, TokenBase} from '@primer/react-tailwind/Token'`

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `"a" | "button" | "span"` — Default `'span'`. Element to render. Use `a` or `button` when the token is interactive.
- `disabled`: `boolean` — Prevents interaction with the token and its remove button.
- `hideRemoveButton`: `boolean` — Default `false`. Hides the remove button while `onRemove` still handles removal by keyboard.
- `href`: `string` — Makes the token a link to the given URL.
- `id`: `string | number` — Identifier applied to the root element.
- `isSelected`: `boolean` — Marks the token as the current one in a list of tokens.
- `leadingVisual`: `React.ElementType` — Icon shown before the token's text.
- `onRemove`: `(() => void)` — Shows a remove button and is called when it is activated.
- `size`: `TokenSize` — Default `'medium'`. Height and text size of the token.
- `text` (required): `React.ReactNode` — Label shown on the token.
- `type`: `"button" | "reset" | "submit"` — Button behavior when `as="button"`. Defaults to `button`.

## IssueLabelToken

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `"a" | "button" | "span"` — Default `'span'`. Element to render. Use `a` or `button` when the token is interactive.
- `disabled`: `boolean` — Prevents interaction with the token and its remove button.
- `fillColor`: `string` — Default `'#999999'`. Custom hex colour for the token, matching the label it represents.
- `hideRemoveButton`: `boolean` — Default `false`. Hides the remove button while `onRemove` still handles removal by keyboard.
- `href`: `string` — Makes the token a link to the given URL.
- `id`: `string | number` — Identifier applied to the root element.
- `isSelected`: `boolean` — Marks the token as the current one in a list of tokens.
- `onRemove`: `(() => void)` — Shows a remove button and is called when it is activated.
- `size`: `TokenSize` — Height and text size of the token.
- `text` (required): `React.ReactNode` — Label shown on the token.
- `type`: `"button" | "reset" | "submit"` — Button behavior when `as="button"`. Defaults to `button`.

## TokenBase

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `"a" | "button" | "span"` — Default `'span'`. Element to render. Use `a` or `button` when the token is interactive.
- `disabled`: `boolean` — Prevents interaction with the token and its remove button.
- `hideRemoveButton`: `boolean` — Default `false`. Hides the remove button while `onRemove` still handles removal by keyboard.
- `href`: `string` — Makes the token a link to the given URL.
- `id`: `string | number` — Identifier applied to the root element.
- `isSelected`: `boolean` — Marks the token as the current one in a list of tokens.
- `onRemove`: `(() => void)` — Shows a remove button and is called when it is activated.
- `size`: `TokenSize` — Default `'medium'`. Height and text size of the token.
- `text` (required): `React.ReactNode` — Label shown on the token.
- `type`: `"button" | "reset" | "submit"` — Button behavior when `as="button"`. Defaults to `button`.

## Differences from `@primer/react`

- Do not nest a remove button inside a link/button token.
- Use `onRemove` and the documented composition for keyboard removal.
- `as="button"` defaults to `type="button"`; pass `type="submit"` or `type="reset"` explicitly for form actions.
- Keep non-interactive token remove controls visibly and programmatically named; interactive tokens include keyboard-removal instructions in the primary action's accessible name.
- `sx` and styled-system props are unsupported; use `className`.

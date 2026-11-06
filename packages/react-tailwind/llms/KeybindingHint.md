# KeybindingHint

`KeybindingHint` renders a compact, screen-reader-friendly keyboard shortcut using the local key formatting rules.

Import: `import {KeybindingHint} from '@primer/react-tailwind/KeybindingHint'`

## Props

- `className`: `string`
- `format`: `"condensed" | "full"` — Default `'condensed'`. Whether modifiers render as symbols or as full words.
- `keys` (required): `string` — Shortcut to render, written in the platform-independent chord syntax such as `Mod+s`.
- `size`: `"medium" | "small"` — Default `'medium'`. Text size of the hint.
- `variant`: `"default" | "onEmphasis" | "onPrimary"` — Default `'default'`. Colour treatment, for hints shown on an emphasized or primary background.

## Differences from `@primer/react`

- Pass the documented key tokens through `keys`; do not depend on a story platform override.
- Use `format`, `variant`, and `size` rather than legacy styling props.
- `size="normal"` is now `size="medium"` and `variant="normal"` is now `variant="default"`, matching the size and variant vocabulary used across the package.
- Keep the shortcut hint supplemental to the control's accessible name.
- `sx` and styled-system props are unsupported; use `className`.

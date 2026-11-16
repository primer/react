# KeybindingHint

`KeybindingHint` renders a compact, screen-reader-friendly keyboard shortcut using the local key formatting rules.

Import: `import {KeybindingHint} from '@primer/react-tailwind/KeybindingHint'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {KeybindingHint} from '@primer/react-tailwind/KeybindingHint'
;<KeybindingHint keys="Mod+k g" format="full" />
```

Separate chords with spaces. Use `+` inside a chord for simultaneous keys.

## Composition

Place the hint beside the action it describes, such as a button or action-list item. Use `format="full"` when the shortcut needs maximum clarity; use `condensed` in dense controls.

## Accessibility

The component renders a `kbd` element. Sequence separators include visually hidden “then” text, while the visible plus signs are hidden from assistive technology. Keep the action's visible label separate so the shortcut is not its only accessible name.

## Animation and reduced motion

`KeybindingHint` has no animation and does not need reduced-motion handling.

## Theming and Tailwind

Use `variant` for the intended text context and `className` for local alignment. Import package styles or compile Tailwind v4 with the package `dist` path in `@source`; the component does not provide a theme-extension prop.

### Data attributes

The root exposes `data-component="KeybindingHint"` and the stable `data-testid="keybinding-hint"`.

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

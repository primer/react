# Checkbox

`Checkbox` is a form-associated binary control. Pair it with a native label or `FormControl.Label`.

Import: `import {Checkbox} from '@primer/react-tailwind/Checkbox'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## API notes

The table is generated from the attached default story and `CheckboxProps`, which forwards Base UI checkbox props except implementation-owned children and `data-component`.

## Import

```tsx
import {Checkbox} from '@primer/react-tailwind/Checkbox'
import {FormControl} from '@primer/react-tailwind/FormControl'
;<FormControl layout="horizontal">
  <Checkbox name="notifications" defaultChecked />
  <FormControl.Label>Email me about updates</FormControl.Label>
</FormControl>
```

## Controlled and uncontrolled

Use `checked` with `onCheckedChange` when application state owns the value; use `defaultChecked` for initial-only state.

## Accessibility, forms, and validation

Give the checkbox an accessible name with a `<label>` or `aria-label`. `name` and `value` participate in native form submission when checked. Use `FormControl` to associate captions or validation messages; disabled controls cannot be changed.

The forwarded `ref` targets the focusable checkbox; `inputRef` targets Base UI's separate, accessibility-hidden form input. Custom focus traversal must skip `aria-hidden` elements.

## Keyboard, events, and state

Space toggles a focused checkbox. `onCheckedChange` receives the next checked state and Base UI event details. The root exposes `data-component="Checkbox"` and Base UI state attributes including `data-checked`, `data-indeterminate`, and `data-disabled`; `className` may be a string or state callback.

`onCheckedChange` receives a native event in its details rather than a React change event. When an ancestor's React `onChange` must not receive the checkbox change, intercept that event on a wrapper around the checkbox and call `stopPropagation()` there.

Forwards unrecognized props to Base UI's [`Checkbox.Root`](https://base-ui.com/react/components/checkbox#root), so it also accepts that part's props.

## Props

- `className`: `string | ((state: CheckboxRootState) => string | undefined)`

## Differences from `@primer/react`

- Keep a native label or FormControl label associated with each checkbox.
- Migrate controlled state to `checked`/`defaultChecked`/`onCheckedChange`; do not duplicate Base UI state.
- The forwarded ref targets the focusable Base UI checkbox; `inputRef` targets its separate hidden form input. Custom focus traversal must ignore `aria-hidden` elements.
- `onCheckedChange` exposes a native event, not the legacy React `onChange` event. To stop React change propagation, intercept `onChange` on a wrapper around the checkbox.
- Use standard form events where native submission behavior is needed.
- Use `className`, not `sx` or styled-system props.

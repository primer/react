# Checkbox

`Checkbox` is a form-associated binary control. Pair it with a native label or `FormControl.Label`.

Import: `import {Checkbox} from '@primer/react-tailwind/Checkbox'`

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

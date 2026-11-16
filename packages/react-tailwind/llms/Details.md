# Details

`Details` is a native disclosure element with a styled summary.

Import: `import {Details} from '@primer/react-tailwind/Details'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## API notes

`DetailsProps` forwards native `<details>` attributes, including `open` and `onToggle`. `Details.Summary` forwards summary attributes. The summary must be the first child.

## Import and composition

```tsx
import {Details} from '@primer/react-tailwind/Details'
;<Details>
  <Details.Summary>More information</Details.Summary>
  <p>This content is revealed when the disclosure is open.</p>
</Details>
```

Place `Details.Summary` first, followed by the disclosure content.

Compose `Button` with `block`, `nativeButton={false}`, and `render={<Details.Summary />}` when the disclosure summary should use the legacy full-width Primer button styling. A direct native `<summary>` is also supported and has its browser marker removed.

## Controlled and uncontrolled

Use `open` with `onToggle` to synchronize the native disclosure state, or set the initial `open` attribute and let the browser manage it.

## Accessibility, validation, and keyboard

Native details/summary semantics expose expanded state and keyboard behavior. Enter or Space activates the focused summary. This is not a form field; use a nearby form control for validation or disabled field behavior.

## Events and state attributes

`onToggle` receives the native event after the `open` state changes. Stable selectors are `data-component="Details"` and `data-component="Details.Summary"`; use the native `[open]` attribute and `className` for state-dependent styles.

Renders a [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Details.Summary

Renders a [`<summary>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Differences from `@primer/react`

- Remove `useDetails`; use the native `open` attribute/event behavior or normal React state around Details when needed.
- Keep the first summary as the disclosure control and avoid nesting interactive controls in it.
- Build custom summaries with `Details.Summary` rather than legacy hook wiring.
- Compose `Button` with `block`, `nativeButton={false}`, and `render={<Details.Summary />}` to reproduce the legacy full-width button-summary presentation without adding polymorphism to the disclosure API.
- Direct native `<summary>` children retain native disclosure behavior and receive the same marker reset as `Details.Summary`.
- `sx` and styled-system props are unsupported; use `className`.

# Alignment

## From: `@primer/react`

`VisuallyHidden` hides content visually while keeping it available to assistive technology. Legacy CSS modules supply the visually-hidden rules, and the component supports a `focusable` option so content can become visible when focused. It is a presentational accessibility utility with the legacy shared styling surface.

## To: `@primer/react-tailwind`

Tailwind `VisuallyHidden` keeps the hidden-content and `focusable` semantics, but expresses them with Tailwind utilities and native HTML composition. Focusable content uses the package's focus-visible treatment rather than legacy CSS-module selectors. It remains a small utility and does not use Base UI. React 19-compatible props and refs are supported, while `sx` and styled-system styling are intentionally omitted.

## Migration notes

- Existing `focusable` usage can be retained.
- Recheck custom selectors that target legacy visually-hidden classes.
- Remove `sx` and styled-system props.

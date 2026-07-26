# Alignment

## From: `@primer/react`

`ButtonBase` is the low-level button primitive behind legacy button components. It supports polymorphic rendering, disabled and loading states, leading/trailing visual children, and the shared button props used by the legacy styled-system implementation. It is also exposed through the experimental entry point as part of the promoted button API. Its styling is CSS-module and styled-system based.

## To: `@primer/react-tailwind`

Tailwind `ButtonBase` is the promoted low-level primitive and is re-exported from the Button package. It uses Base UI's button primitive for button semantics and React 19-compatible composition, while Tailwind classes and Primer tokens provide presentation. Common button content, disabled, loading, and polymorphic usage remain available, but the implementation does not carry legacy styled-system behavior or deprecated styling aliases. Use Base UI's `render` prop to compose button behavior onto a non-button element.

## Migration notes

- The component is a stable replacement for the experimental legacy export.
- Preserve behavioral props, but remove `sx` and styled-system props.
- Recheck custom selectors tied to legacy CSS-module class names.

# Alignment

## From: `@primer/react`

`Spinner` exposes `size`, `srText`, and delayed display behavior, and renders an animated SVG spinner with legacy CSS-module styling. The legacy component places presentation and some accessibility attributes on the SVG and coordinates animation with media-query behavior. It also accepts legacy shared styling props and deprecated styling conventions.

## To: `@primer/react-tailwind`

Tailwind `Spinner` preserves size, screen-reader text, delayed display, and synchronized animation phases, but places the status semantics on the root (`role="status"`) and uses Tailwind animation classes with `motion-reduce:animate-none`. The SVG and hidden text are composed with Primer tokens and native HTML props. CSS-module class names are not retained. Spinner is presentational and is not Base UI-backed.

## Migration notes

- Keep `size`, `srText`, and delay usage, but recheck selectors targeting the legacy SVG root.
- Respect the new root status semantics when composing surrounding live regions.
- Remove `sx`, styled-system props, and legacy animation overrides.

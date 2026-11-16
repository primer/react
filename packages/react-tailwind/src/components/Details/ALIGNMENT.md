# Alignment

## From: `@primer/react`

Legacy Details uses a Details/Summary composition and offered the deprecated `useDetails` outside-click hook in custom-summary examples.

## To: `@primer/react-tailwind`

Details is a native disclosure element with `Details.Summary` composition. It uses the platform `details`/`summary` semantics rather than Base UI, supports native open behavior, and forwards valid DOM props to the disclosure root. This keeps keyboard and accessibility behavior browser-native without an outside-click abstraction.

## Migration notes

- Remove `useDetails`; use the native `open` attribute/event behavior or normal React state around Details when needed.
- Keep the first summary as the disclosure control and avoid nesting interactive controls in it.
- Build custom summaries with `Details.Summary` rather than legacy hook wiring.
- Compose `Button` with `block`, `nativeButton={false}`, and `render={<Details.Summary />}` to reproduce the legacy full-width button-summary presentation without adding polymorphism to the disclosure API.
- Direct native `<summary>` children retain native disclosure behavior and receive the same marker reset as `Details.Summary`.
- `sx` and styled-system props are unsupported; use `className`.

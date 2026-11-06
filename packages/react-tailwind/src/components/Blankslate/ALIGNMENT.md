# Alignment

## From: `@primer/react`

`Blankslate` is a styled-system component with `border`, `narrow`, and `spacious` options, plus `Blankslate.Visual`, `Blankslate.Heading`, `Blankslate.Description`, `Blankslate.PrimaryAction`, and `Blankslate.SecondaryAction`. Its legacy CSS module supplies the centered layout, responsive spacing, and variant-specific borders and padding. Legacy `sx` and styled-system props are accepted through the component's shared prop types.

## To: `@primer/react-tailwind`

The same `Blankslate`, `Blankslate.Visual`, `Blankslate.Heading`, `Blankslate.Description`, `Blankslate.PrimaryAction`, and `Blankslate.SecondaryAction` composition is implemented with Tailwind classes and Primer semantic tokens. `border`, `narrow`, and `spacious` retain their meaning, and the content regions remain ordinary children. The implementation uses React 19-compatible components rather than the legacy styled-system layer; it does not introduce a new behavioral primitive.

## Migration notes

- Existing composition and variant props can be retained.
- Remove `sx`, styled-system props, and legacy style overrides.
- Prefer the named subcomponents instead of relying on ad hoc region markup.

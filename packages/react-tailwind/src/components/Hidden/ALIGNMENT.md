# Alignment

## From: `@primer/react`

Legacy Hidden suppresses content across named narrow, regular, and wide viewport ranges. It renders a div with children, `className`, and inline style support, and accepts styled-system presentation props.

## To: `@primer/react-tailwind`

Hidden is a presentational responsive wrapper with a required `when` range. Static Tailwind utilities map narrow to below `md` (48rem/768px), regular to `md` through below `2xl` (87.5rem/1400px), and wide to `2xl` and above. Multiple requested ranges are additive, so hiding narrow and wide leaves content visible only in the regular range.

It renders a `div` and forwards its ref and DOM props. It does not use Base UI or need a behavior hook because it has no state or interaction.

## Migration notes

- Keep range decisions in `when`; add visual styling with `className` on the wrapper.
- Treat multiple ranges as an additive hide set.
- `wide` maps to Tailwind `2xl`, not `lg`; `lg` remains Primer's separate 63.25rem/1012px size breakpoint.
- Do not expect a styled-system or `sx` compatibility surface.
- The Tailwind component forwards native `style`, but does not reproduce legacy responsive CSS custom properties.
- Use semantic content order; Hidden changes display, and selected content is unavailable to assistive technology.

# Primer react

[Primer](https://primer.github.io/) React components built with [styled-components](https://www.styled-components.com/) 💅 and [styled-system](http://jxnblk.com/styled-system/) 💙.

## Status

⚠️ This project is WIP and not ready for production use yet!

Currently we link to the latest built Primer CSS so that we may use current Primer styles to start to build components. This does not include `primer-base` so as to avoid unwanted base overrides. Eventually we'll remove CSS from Primer in favor of CSS-in-JS (using styled-components) to ensure styles are encapsulated.

## Getting started

`npm install`

Run app with:

`npm run start`

Build with:

`npm run build`


## Principles

- Everything is a component.
- Aim for total style encapsulation, don't rely on inheritance to provide default styles.
- Build small building blocks with minimal props to keep complexity low.
- Keep system constrained by only including props needed per component.
- Favor extending or wrapping components for more complex operations.
- Maintain design system consistency with utilities as props (for spacing, color, font-size, line-height, widths, and radii).


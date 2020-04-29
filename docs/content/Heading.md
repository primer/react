---
title: Heading
---

Our suite of heading components render headings with default font sizes for each level. If you'd like to change the font size while keeping the markup semantically correct, use the `fontSize` prop.

Please reference the [w3 recommendations for headings](https://www.w3.org/WAI/tutorials/page-structure/headings/) to ensure your headings provide an accessible experience for screen reader users.

Due to the nature of these components, the `as` prop is not allowed.

**Note:** The old `Heading` component will be deprecated soon, use the named `H1, `H2`, `H3`, `H4`, `H5`, `H6` components instead.

## Default example
```jsx live
<H1>Heading level one</H1>
<H2>Heading level two</H2>
<H3>Heading level three</H3>
<H4>Heading level four</H4>
<H5>Heading level five</H5>
<H6>Heading level six</H6>
```

## System props

Heading components get `TYPOGRAPHY` and `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.
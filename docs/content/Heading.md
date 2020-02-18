---
title: Heading
---

The Heading component will render an html `h1-6` tag without any default styling. Please reference the [w3 recommendations for headings](https://www.w3.org/WAI/tutorials/page-structure/headings/) to ensure your headings provide an accessible experience for screen reader users.

## Default example

```jsx live
<Heading fontSize={2} mb={2}>With fontSize={2}</Heading>
```

## Different heading levels

Use the `as` prop to render a different heading level

```jsx live
<Heading as="h5" fontSize={1} mb={2}>Renders as a h5</Heading>
```

## System props

Heading components get `TYPOGRAPHY` and `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

Heading does not get any additional props other than the system props mentioned above.

---
title: Heading
---

The Heading component will render an html `h2` tag without any default styling. Other heading level elements `h1-h6` are available through use of the `as` prop (see [System Props](/system-props) for additional explanation). Please reference the [w3 recommendations for headings](https://www.w3.org/WAI/tutorials/page-structure/headings/) to ensure your headings provide an accessible experience for screen reader users.

**Attention:** Make sure to include a valid heading element to render a Heading component other than `h2` (`<Heading as="h1">H1 Element</Heading>`).

## Default example
```jsx live
<Heading fontSize={1} mb={2}>H2 heading with fontSize={1}</Heading>
```

## System props

Heading components get `TYPOGRAPHY` and `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Prop name | Type    | Description                                      |
| :-------- | :------ | :----------------------------------------------- |
| as        | String  | sets the HTML tag for the component              |

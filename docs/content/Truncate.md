---
title: Truncate
---

The Truncate component will shorten text with an ellipsis. Always add a `title` attribute to the truncated element so the full text remains accessible.

## Default example

Truncate will prevent text that overflows from wrapping. The default max-width is 125px.

```jsx live
<Truncate title="Some text with a branch-name-that-is-really-long">
  Some text with a branch-name-that-is-really-long
</Truncate>
```

## Custom max-width example

You can override the maximum width of the truncated text with the `maxWidth` prop.

```jsx live
<Truncate maxWidth={250} title="Some text with a branch-name-that-is-really-long">
  Some text with a branch-name-that-is-really-long
</Truncate>
```

## Inline example

You can use the `inline` boolean prop for inline (or inline-block) elements with a fixed maximum width (default: 125px).

```jsx live
  Some text with a{' '}
  <Truncate as="strong" inline title="branch-name-that-is-really-long">
    branch-name-that-is-really-long
  </Truncate>
```

## Expandable example

You can use the `expandable` boolean prop to display the truncated text on hover.

```jsx live
<Truncate expandable title="Some text with a branch-name-that-is-really-long">
  Some text with a branch-name-that-is-really-long
</Truncate>
```

## System props

Truncate components get `TYPOGRAPHY` and `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Name       | Type    | Default | Description                                                  |
| :--------- | :------ | :-----: | :----------------------------------------------------------- |
| as         | String  |  `div`  | Sets the HTML tag for the component                          |
| maxWidth   | Number  |   125   | Sets the max-width of the text                               |
| inline     | Boolean |  false  | displays text as inline block and vertical aligns to the top |
| expandable | Boolean |  false  | allows the truncated text to be displayed on hover           |

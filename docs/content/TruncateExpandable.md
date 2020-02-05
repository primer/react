---
title: TruncateExpandable
---

## Default example

TruncateExpandable is an extension of [Truncate](/Truncate) that allows you to show and hide text on hover.

```jsx live
<TruncateExpandable title="Some text with a branch-name-that-is-really-long">
  Some text with a branch-name-that-is-really-long
</TruncateExpandable>
```

## Custom max-width example

You can override the maximum width of the truncated text with the `maxWidth` prop.

```jsx live
<TruncateExpandable maxWidth={250} title="Some text with a branch-name-that-is-really-long">
  Some text with a branch-name-that-is-really-long
</TruncateExpandable>
```

## Target example

```jsx live
  Some text with a{' '}
  <TruncateExpandable as="strong" title="branch-name-that-is-really-long" variant="target">
    branch-name-that-is-really-long
  </TruncateExpandable>
```

## Component props

| Name     | Type   | Default | Description                         |
| :------- | :----- | :-----: | :---------------------------------- |
| as       | String |  `div`  | Sets the HTML tag for the component |
| maxWidth | Number |   125   | Sets the max-width of the text      |
| variant  | String |         | `target`                            |

---
title: Text
status: Alpha
---

The Text component is a wrapper component that will apply typography styles to the text inside.

## Default example

```jsx live
<>
  <Text as="p" fontWeight="bold">
    bold
  </Text>
  <Text as="p" color="danger.fg">
    danger color
  </Text>
  <Text as="p" color="fg.onEmphasis" bg="neutral.emphasis" p={2}>
    inverse colors
  </Text>
</>
```

## System props

<Note variant="warning">

System props are deprecated in all components except [Box](/Box). Please use the [`sx` prop](/overriding-styles) instead.

</Note>

Text components get `TYPOGRAPHY` and `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Name | Type   | Default | Description                         |
| :--- | :----- | :-----: | :---------------------------------- |
| as   | String | `span`  | Sets the HTML tag for the component |

---
title: Text
---
The Text component is a wrapper component that will apply typography styles to the text inside.

## Default example
```jsx live
<Text as='p' fontWeight="bold">bold</Text>
<Text as='p' color="red.6">red color</Text>
<Text as='p' color="white" bg="gray.9" p={2}>white on black</Text>
```

## System props

Text components get `TYPOGRAPHY` and `COMMON` system props. Read our [System Props](/components/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| as | String | `span` | Sets the HTML tag for the component|

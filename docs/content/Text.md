---
title: Text
---

The Text component is a wrapper component that will apply typography styles to the text inside.

## Default example

```jsx live
<Text as='p' fontWeight="bold">bold</Text>
<Text as='p' color="text.danger">danger color</Text>
<Text as='p' color="text.inverse" bg="bg.canvasInverse" p={2}>inverse colors</Text>
```

## Component props

| Name | Type   | Default | Description                         |
| :--- | :----- | :-----: | :---------------------------------- |
| as   | String | `span`  | Sets the HTML tag for the component |

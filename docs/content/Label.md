---
title: Label
---

The Label component is used to add contextual metadata to a design. Visually it styles text, adds padding, and rounded corners.

## Default example

```jsx live
<Label m={1}>Default label</Label>
<Label m={1} dropshadow bg='red.4'>Label with custom background</Label>
<Label m={1} outline>Default outline label</Label>
```

## System props

Label components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| outline | Boolean | | Creates an outline style label |
| variant | String | 'medium' | Can be one of `small`, `medium` (default), `large` or `xl` .
| dropshadow | Boolean | | Adds a dropshadow to the label |
| bg | String | 'gray.5' | Part of the `COMMON` system props, used to change the background of the label.

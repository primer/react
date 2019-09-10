---
title: Label
---

The Label component is used to add contextual metadata to a design. Visually it styles text, adds padding, and rounded corners.

## Default example

```.jsx live
<Label m={1}>Default label</Label>
<Label m={1} scheme="gray-darker">Darker gray label</Label>
<Label m={1} outline>Default outline label</Label>
```

## System props

Label components get `COMMON` system props. Read our [System Props](/components/docs/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| outline | Boolean | | Creates an outline style label |
| size | String | 'medium' | Can be one of `small`, `medium` (default), `large` or `xl` .
| dropshadow | Boolean | | Adds a dropshadow to the label |

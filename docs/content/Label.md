---
title: Label
---

The Label component is used to add contextual metadata to a design. Visually it styles text, adds padding, and rounded corners.

## Default example

```jsx live
  <Label variant="small" outline borderColor="red.2" mr={2} color="red.4">small</Label>
  <Label variant="medium" mr={2}>medium (default)</Label>
  <Label variant="large" mr={2}>large</Label>
  <Label variant="xl">xl label</Label>
  
  <Box mt={4}/>
  <Label variant="medium" bg="#A575FF" m={1}>good first issue</Label>
  <Label variant="medium" bg="#FF75C8" m={1}>🚂 deploy: train</Label>
  <Label variant="medium" bg="#1C90FA" m={1}>css</Label>
  <Label variant="medium" bg=" #FFF06C" color="#24292E" m={1}>documentation</Label>
  <Label variant="medium" bg="#656BFE" m={1}>primer</Label>
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

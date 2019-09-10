---
title: BorderBox
---


BorderBox is a Box component with a border. When no `borderColor` is present, the component defaults to a gray border.

## Default example

```jsx live live
<BorderBox>This is a BorderBox</BorderBox>
```

## System props

BorderBox components get `COMMON` and `LAYOUT` system props. Read our [System Props](/components/docs/system-props) doc page for a full list of available props.

## Component props

| Prop name | Type | Default | Description |
| :- | :- | :-: | :- |
| border | String | 'borders.1' (from theme) | Sets the border, use theme values or provide your own. |
| borderColor | String | 'gray.2' (from theme) | Sets the border color, use theme values or provide your own. |
| borderRadius | String or Number| 'radii.1' (from theme)| Sets the border radius, use theme values or provide your own. |
| boxShadow | String | | Sets box shadow, use theme values or provide your own. |

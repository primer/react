---
title: BorderBox
---


BorderBox is a Box component with a border. When no `borderColor` is present, the component defaults to a gray border.

## Default example

```jsx live
<BorderBox>This is a BorderBox</BorderBox>
```

Note that `BorderBox` has default props set for `borderWidth`, `borderStyle`, and `borderColor`. This means that you cannot use `border={0} borderBottom={1}` or similar patterns; instead, use individual properties like `borderWidth={0} borderBottomWidth={1}`.

## System props

BorderBox components get `COMMON`, `LAYOUT`, `BORDER`, and `FLEX` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Prop name | Type | Default | Description |
| :- | :- | :-: | :- |
| borderWidth | String | '1px' | Sets the border, use theme values or provide your own. |
| borderStyle | String | 'solid' | Sets the border style, use theme values or provide your own. |
| borderColor | String | 'gray.2' (from theme) | Sets the border color, use theme values or provide your own. |
| borderRadius | String or Number| 2 (from theme)| Sets the border radius, use theme values or provide your own. |
| boxShadow | String | | Sets box shadow, use theme values or provide your own. |

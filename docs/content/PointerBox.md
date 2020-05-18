---
title: PointerBox
---

PointerBox is a [BorderBox](./BorderBox) component with a caret added to it.

## Default example

```jsx live
<PointerBox p={2} m={4} minHeight={100} bg="green.1" borderColor="green.5">
  PointerBox
</PointerBox>


<PointerBox p={2} m={4} minHeight={100} bg="green.1" borderColor="green.5" caret="top">
  PointerBox
</PointerBox>

<PointerBox p={2} m={4} minHeight={100} bg="green.1" borderColor="green.5" caret="left">
  PointerBox
</PointerBox>

<PointerBox p={2} m={4} minHeight={100} bg="green.1" borderColor="green.5" caret="right">
  PointerBox
</PointerBox>
```

## System props

PointerBox components get `COMMON`, `LAYOUT`, `BORDER`, and `FLEX` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| caret | String | bottom | Sets the location of the caret. The format is `[edge]-[position on edge]`. For example, `right-top` will position the caret on the top of the right edge of the box. Use `top`, `right`, `bottom`, or `left` to position a caret in the center of that edge. |

---
componentId: label_group
title: LabelGroup
status: Alpha
---

The LabelGroup component is used to add commonly used margins and wrapping for groups of Labels.

## Default example

```jsx live
<LabelGroup>
  <Label>Default label</Label>
  <Label sx={{color: 'fg.onEmphasis', bg: 'danger.emphasis'}}>Label with background indicating a closed PR state</Label>
  <Label outline>Default outline label</Label>
</LabelGroup>
```

## Component props

| Name | Type              | Default | Description                          |
| :--- | :---------------- | :-----: | :----------------------------------- |
| sx   | SystemStyleObject |   {}    | Style to be applied to the component |

---
title: LabelGroup
---

The LabelGroup component is used to add commonly used margins and wrapping for groups of Labels.

## Default example

```jsx live
<LabelGroup>
  <Label>Default label</Label>
  <Label sx={{color: 'prState.closed.text', bg: 'prState.closed.bg'}}>
    Label with background indicating a closed PR state
  </Label>
  <Label outline>Default outline label</Label>
</LabelGroup>
```

## System props

<Note variant="warning">

System props are deprecated in all components except [Box](/Box). Please use the [`sx` prop](/overriding-styles) instead.

</Note>

LabelGroup components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

LabelGroup does not get any additional props.

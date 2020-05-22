---
title: Tooltip
---

The Tooltip component adds a tooltip to add context to elements on the page. The Tooltip has a black background by default.

***⚠️ Usage warning! ⚠️***

Tooltips as a UI pattern should be our last resort for conveying information because it is hidden by default and often with zero or little visual indicator of its existence.

Before adding a tooltip, please consider: Is this information essential and necessary? Can the UI be made clearer? Can the information be shown on the page by default?

**Attention:** we use aria-label for tooltip contents, because it is crucial that they are accessible to screen reader users. However, aria-label replaces the text content of an element in screen readers, so only use Tooltip on elements with no existing text content, or consider using `title` for supplemental information.



## Default example

```jsx live
<BorderBox p={3}>
  <Tooltip aria-label="Hello, Tooltip!">Text with a tooltip</Tooltip>
</BorderBox>
```

## System props

Tooltip components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| align | String | | Can be either `left` or `right`.|
| direction | String | | Can be one of `n`, `ne`, `e`, `se`, `s`, `sw`, `w`, `nw` | Sets where the tooltip renders in relation to the target. |
| noDelay | Boolean | | When set to `true`, tooltip appears without any delay |
| aria-label | String | | Text used in `aria-label` (for accessibility).
| wrap | Boolean | | Use `true` to allow text within tooltip to wrap.

---
title: CircleOcticon
status: Alpha
---

CircleOcticon renders any Octicon with a circle background. CircleOcticons are most commonly used to represent the status of a pull request in the comment timeline.

## Default example

```jsx live
<CircleOcticon icon={CheckIcon} size={32} sx={{bg: 'success.fg', color: 'fg.onEmphasis'}} />
```

## Component props

| Name | Type    | Default | Description                                       |
| :--- | :------ | :-----: | :------------------------------------------------ |
| icon | Octicon |         | Octicon component used in the component           |
| size | Number  |   32    | used to set the width and height of the component |

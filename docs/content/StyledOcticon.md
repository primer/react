---
title: StyledOcticon
tags: icon
---

StyledOcticon renders an [Octicon](https://octicons.github.com) with common system props, including `color`, margin, and padding.

## Default example

```jsx live
<>
  <StyledOcticon icon={CheckIcon} size={32} color="success.fg" mr={2} />
  <StyledOcticon icon={XIcon} size={32} color="danger.fg" />
</>
```

## Component props

StyledOcticon passes all of its props except the common system props down to the [Octicon component](https://github.com/primer/octicons/tree/master/lib/octicons_react#usage), including:

| Name          | Type              |    Default    | Description                                                                                                  |
| :------------ | :---------------- | :-----------: | :----------------------------------------------------------------------------------------------------------- |
| ariaLabel     | String            |               | Specifies the `aria-label` attribute, which is read verbatim by screen readers                               |
| icon          | Component         |               | [Octicon component](https://github.com/primer/octicons/tree/master/lib/octicons_react) used in the component |
| size          | Number            |      16       | Sets the uniform `width` and `height` of the SVG element                                                     |
| verticalAlign | String            | `text-bottom` | Sets the `vertical-align` CSS property                                                                       |
| sx            | SystemStyleObject |      {}       | Style to be applied to the component                                                                         |

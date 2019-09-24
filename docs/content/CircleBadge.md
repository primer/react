---
title: CircleBadge
---


Use CircleBadge to visually connect logos of third party services like in marketplace. Use CircleBadge.Icon to add an Octicon to the CircleBadge.

## Default example

```jsx live
<CircleBadge>
  <CircleBadge.Icon icon={Zap} />
</CircleBadge>
```

## System props

CircleBadge and CircleBadge.Icon components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

### CircleBadge
| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| as | String | `div` | sets the HTML tag for the component |
| size | String or Number | | Use `small`, `medium`, or `large` for default sizes, or provide a custom size |

### CircleBadge.Icon
CircleBadge.Icon components do not receive any additional props besides `COMMON` system props.

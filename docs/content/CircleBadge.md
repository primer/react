---
title: CircleBadge
---


Use CircleBadge to visually connect logos of third party services like in marketplace. Use CircleBadge.Icon to add an Octicon to the CircleBadge.

## Default example

```jsx live
<CircleBadge>
  <CircleBadge.Icon icon={ZapIcon} />
</CircleBadge>
```

## System props

CircleBadge and CircleBadge.Icon components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

### CircleBadge
| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| as | String | `div` | sets the HTML tag for the component |
| inline | Boolean | false | Styles the badge to display inline |
| size | Number | | sets the size of the badge in pixels; overrides any value for `variant` prop when set |
| variant | String | 'medium' | a value of `small`, `medium`, or `large` creates a smaller or larger badge; no effect if `size` prop is set |

### CircleBadge.Icon
CircleBadge.Icon components do not receive any additional props besides `COMMON` system props.

---
title: Timeline
---

The TimelineItem component is used to display items on a vertical timeline, connected by TimelineItem-badge elements.

## Default example

```jsx live
<Timeline>
  <Timeline.Item badgeContent={<StyledOcticon icon={Zap} />}>Default badge color</Timeline.Item>
</Timeline>
```

## System props

Timeline and Timeline.Item components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

### Timeline.Item

| Prop name  | Type   | Description                                                    |
| :--------- | :----- | :------------------------------------------------------------- |
| aria-label | String | Used to set the `aria-label` on the top level `<nav>` element. |

### Timeline.Badge

| Prop name | Type    | Description                                      |
| :-------- | :------ | :----------------------------------------------- |
| as        | String  | sets the HTML tag for the component              |
| href      | String  | URL to be used for the Link                      |
| selected  | Boolean | Used to style the link as selected or unselected |

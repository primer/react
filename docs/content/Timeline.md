---
title: Timeline
---

The Timeline.Item component is used to display items on a vertical timeline, connected by Timeline.Badge elements.

## Example with in-line links

```jsx live
<Timeline>
  <Timeline.Item>
    <Timeline.Badge>
      <StyledOcticon icon={Flame} />
    </Timeline.Badge>
    <Timeline.Body>
      <Link href="#" fontWeight="bold" color="gray.8" mr={1} muted>
        Monalisa
      </Link>
      created one <Link href="#" fontWeight="bold" color="gray.8" mr={1} muted>
        hot potato
      </Link>
      <Link href="#" color="gray.7" muted>
        Just now
      </Link>
    </Timeline.Body>
  </Timeline.Item>
</Timeline>
```

## Default Color example

```jsx live
<Timeline>
  <Timeline.Item>
    <Timeline.Badge>
      <StyledOcticon icon={Flame} />
    </Timeline.Badge>
    <Timeline.Body>Default badge color</Timeline.Body>
  </Timeline.Item>
</Timeline>
```

## Adding color to a Badge

```jsx live
<Timeline>
  <Timeline.Item>
    <Timeline.Badge bg="red.5">
      <StyledOcticon icon={Flame} color="white" />
    </Timeline.Badge>
    <Timeline.Body>Red background used when closed events occur</Timeline.Body>
  </Timeline.Item>
  <Timeline.Item>
    <Timeline.Badge bg="green.5">
      <StyledOcticon icon={Flame} color="white" />
    </Timeline.Badge>
    <Timeline.Body>Green background when opened or passed events occur</Timeline.Body>
  </Timeline.Item>
  <Timeline.Item>
    <Timeline.Badge bg="purple.5">
      <StyledOcticon icon={Flame} color="white" />
    </Timeline.Badge>
    <Timeline.Body>Purple background used when pull requests are merged</Timeline.Body>
  </Timeline.Item>
  <Timeline.Item>
    <Timeline.Badge bg="blue.5">
      <StyledOcticon icon={Flame} color="white" />
    </Timeline.Badge>
    <Timeline.Body>Blue background to indicate new events below</Timeline.Body>
  </Timeline.Item>
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

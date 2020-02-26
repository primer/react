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

The default Timeline.Badge color is dark text on a light grey background.

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

To have color variants, use the `bg` prop on the `Timeline.Badge`. If an icon is being used, set the `color` prop
of the child `StyledOcticon` if necessary.

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

## Condensed items

Timeline has a condensed prop that will reduce the vertical padding and remove the background from the badge item. These are most commonly used in commits. To condense a single item, remove the top or bottom padding with the `pt={0}` or `pb={0}` prop.

```jsx live
<Timeline>
  <Timeline.Item condensed>
    <Timeline.Badge>
      <StyledOcticon icon={GitCommit} />
    </Timeline.Badge>
    <Timeline.Body>This is the message of a condensed TimelineItem</Timeline.Body>
  </Timeline.Item>
  <Timeline.Item condensed>
    <Timeline.Badge>
      <StyledOcticon icon={GitCommit} />
    </Timeline.Badge>
    <Timeline.Body>This is the message of a condensed TimelineItem</Timeline.Body>
  </Timeline.Item>
</Timeline>
```

## Timeline Break

To create a visual break in the timeline, use Timeline.Break. This adds a horizontal bar across the timeline to show that something has disrupted it. Usually this happens when a close or merged event occurs.

```jsx live
<Timeline>
  <Timeline.Item>
    <Timeline.Badge bg="red.5">
      <StyledOcticon icon={Flame} color="white" />
    </Timeline.Badge>
    <Timeline.Body>Red background used when closed events occur</Timeline.Body>
  </Timeline.Item>
  <Timeline.Break />
  <Timeline.Item>
    <Timeline.Badge bg="green.5">
      <StyledOcticon icon={Flame} color="white" />
    </Timeline.Badge>
    <Timeline.Body>Green background when opened or passed events occur</Timeline.Body>
  </Timeline.Item>
</Timeline>
```

## System props

Timeline and Timeline.Item components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

### Timeline.Item

| Prop name   | Type    | Description                                                                       |
| :---------- | :------ | :-------------------------------------------------------------------------------- |
| clipSidebar | Boolean | Hides the sidebar above the first Timeline.Item and below the last Timeline.Item. |

### Timeline.Badge

| Prop name | Type    | Description                                                 |
| :-------- | :------ | :---------------------------------------------------------- |
| condensed | Boolean | Reduces vertical padding and removes background from badge. |

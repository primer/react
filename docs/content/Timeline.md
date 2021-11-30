---
title: Timeline
status: Alpha
---

The Timeline.Item component is used to display items on a vertical timeline, connected by Timeline.Badge elements.

## Example with in-line links

```jsx live
<Timeline>
  <Timeline.Item>
    <Timeline.Badge>
      <StyledOcticon icon={FlameIcon} />
    </Timeline.Badge>
    <Timeline.Body>
      <Link href="#" sx={{fontWeight: 'bold', color: 'fg.default', mr: 1}} muted>
        Monalisa
      </Link>
      created one <Link href="#" sx={{fontWeight: 'bold', color: 'fg.default', mr: 1}} muted>
        hot potato
      </Link>
      <Link href="#" color="fg.muted" muted>
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
      <StyledOcticon icon={FlameIcon} />
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
    <Timeline.Badge sx={{bg: 'danger.emphasis'}}>
      <StyledOcticon icon={FlameIcon} sx={{color: 'fg.onEmphasis'}} />
    </Timeline.Badge>
    <Timeline.Body>Background used when closed events occur</Timeline.Body>
  </Timeline.Item>
  <Timeline.Item>
    <Timeline.Badge sx={{bg: 'danger.emphasis'}}>
      <StyledOcticon icon={FlameIcon} color="fg.onEmphasis" />
    </Timeline.Badge>
    <Timeline.Body>Background when opened or passed events occur</Timeline.Body>
  </Timeline.Item>
  <Timeline.Item>
    <Timeline.Badge sx={{bg: 'danger.emphasis'}}>
      <StyledOcticon icon={FlameIcon} sx={{color: 'fg.onEmphasis'}} />
    </Timeline.Badge>
    <Timeline.Body>Background used when pull requests are merged</Timeline.Body>
  </Timeline.Item>
</Timeline>
```

## Condensed items

Timeline has a condensed prop that will reduce the vertical padding and remove the background from the badge item. These are most commonly used in commits. To condense a single item, remove the top or bottom padding with the `pt={0}` or `pb={0}` prop.

```jsx live
<Timeline>
  <Timeline.Item condensed>
    <Timeline.Badge>
      <StyledOcticon icon={GitCommitIcon} />
    </Timeline.Badge>
    <Timeline.Body>This is the message of a condensed TimelineItem</Timeline.Body>
  </Timeline.Item>
  <Timeline.Item condensed>
    <Timeline.Badge>
      <StyledOcticon icon={GitCommitIcon} />
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
    <Timeline.Badge sx={{bg: 'danger.emphasis'}}>
      <StyledOcticon icon={FlameIcon} color="fg.onEmphasis" />
    </Timeline.Badge>
    <Timeline.Body>Background used when closed events occur</Timeline.Body>
  </Timeline.Item>
  <Timeline.Break />
  <Timeline.Item>
    <Timeline.Badge sx={{bg: 'success.emphasis'}}>
      <StyledOcticon icon={FlameIcon} sx={{color: 'fg.onEmphasis'}} />
    </Timeline.Badge>
    <Timeline.Body>Background when opened or passed events occur</Timeline.Body>
  </Timeline.Item>
</Timeline>
```

## Component props

### Timeline

| Name        | Type              | Default | Description                                                                       |
| :---------- | :---------------- | :-----: | :-------------------------------------------------------------------------------- |
| clipSidebar | Boolean           |         | Hides the sidebar above the first Timeline.Item and below the last Timeline.Item. |
| sx          | SystemStyleObject |   {}    | Style to be applied to the component                                              |

### Timeline.Item

| Name      | Type              | Default | Description                                                           |
| :-------- | :---------------- | :-----: | :-------------------------------------------------------------------- |
| condensed | Boolean           |         | Reduces vertical padding and removes background from an item's badge. |
| sx        | SystemStyleObject |   {}    | Style to be applied to the component                                  |

### Timeline.Badge

| Name | Type              | Default | Description                          |
| :--- | :---------------- | :-----: | :----------------------------------- |
| sx   | SystemStyleObject |   {}    | Style to be applied to the component |

### Timeline.Body

| Name | Type              | Default | Description                          |
| :--- | :---------------- | :-----: | :----------------------------------- |
| sx   | SystemStyleObject |   {}    | Style to be applied to the component |

### Timeline.Break

| Name | Type              | Default | Description                          |
| :--- | :---------------- | :-----: | :----------------------------------- |
| sx   | SystemStyleObject |   {}    | Style to be applied to the component |

---
title: Flash
---

The Flash component informs users of successful or pending actions.

## Default example

```jsx live
<Flash>Default Flash</Flash>
<Flash variant="success">Success Flash</Flash>
<Flash variant="warning">Warning Flash</Flash>
<Flash variant="danger">Danger Flash</Flash>
```

## With an icon

Flash components with icons inside of them will automatically set the correct color for the icon depending on the type of Flash, as well as applying the correct right margin.

```jsx live
<Flash variant="success">
  <StyledOcticon icon={Check}/>
  Success!
</Flash>
```

## System props

Flash components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| full | Boolean | | Creates a full width Flash component|
| variant | String | default | Can be one of `default`, `success`, `warning`, or `danger` - sets the background color and border of the Flash component |

# Donut

## Default example
```.jsx
<Donut mr={1} data={{error: 2, pending: 3, success: 5}} />
<Donut mr={1}>
  <Donut.Slice value={1} state="pending" />
  <Donut.Slice value={1} state="success" />
  <Donut.Slice value={1} state="error" />
</Donut>
```

## System props

Donut components get `space` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Prop name | Type | Description |
| :- | :- | :- |
| data | Object | Use the keys `error`, `pending`, and `success` to set values used to generate slices in the chart |
| size | Number | Used to set the width and height of the component

export const meta = {displayName: 'Donut'}

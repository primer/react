# DonutChart

The DonutChart component is used to represent build status in a pull request.

## Default example
```.jsx
<DonutChart mr={1} data={{error: 2, pending: 3, success: 5}} />
<DonutChart mr={1}>
  <DonutSlice value={1} state="pending" />
  <DonutSlice value={1} state="success" />
  <DonutSlice value={1} state="error" />
</DonutChart>
```

## System props

DonutChart components get `space` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| data | Object | | Use the keys `error`, `pending`, and `success` to set values used to generate slices in the chart |
| size | Number | 30 | Used to set the width and height of the component

export const meta = {displayName: 'DonutChart'}

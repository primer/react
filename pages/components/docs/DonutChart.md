# DonutChart

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

export const meta = {displayName: 'DonutChart'}

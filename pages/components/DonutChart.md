### DonutChart
```.jsx
<Box mb={2}>
  <ExampleHeading>
    With <Text fontFamily="mono">data</Text> prop
  </ExampleHeading>

  <DonutChart mr={1} data={{error: 2, pending: 3, success: 5}} />
  <DonutChart mr={1} data={{error: 1, pending: 4, success: 2}} />
  <DonutChart mr={1} data={{pending: 2, success: 6}} />
  <DonutChart mr={1} data={{pending: 0, success: 1}} />
  <DonutChart mr={1} data={{pending: 1, queued: 1}} />
  <DonutChart mr={1} data={{unknown: 1}} />
</Box>
<Box mb={2}>
  <ExampleHeading>
    With <Text fontFamily="mono">DonutSlice</Text> children
  </ExampleHeading>

  <DonutChart mr={1}>
    <DonutSlice value={1} state="pending" />
    <DonutSlice value={1} state="success" />
    <DonutSlice value={1} state="error" />
  </DonutChart>

  <DonutChart mr={1}>
    <DonutSlice value={1} state="error" />
    <DonutSlice value={4} state="pending" />
    <DonutSlice value={2} state="success" />
  </DonutChart>

  <DonutChart mr={1}>
    <DonutSlice value={2} state="pending" />
    <DonutSlice value={6} state="success" />
  </DonutChart>

  <DonutChart mr={1}>
    <DonutSlice value={0} state="pending" />
    <DonutSlice value={1} state="success" />
  </DonutChart>

  <DonutChart mr={1}>
    <DonutSlice value={1} state="pending" />
    <DonutSlice value={1} state="queued" />
  </DonutChart>

  <DonutChart>
    <DonutSlice value={1} state="queued" />
  </DonutChart>
</Box>

<Box mb={2}>
  <ExampleHeading>
    With <Text fontFamily="mono">DonutSlice</Text> children
  </ExampleHeading>

  <DonutChart>
    <DonutSlice value={1} fill={theme.colors.purple[0]} />
    <DonutSlice value={1} fill={theme.colors.purple[1]} />
    <DonutSlice value={1} fill={theme.colors.purple[2]} />
    <DonutSlice value={1} fill={theme.colors.purple[3]} />
    <DonutSlice value={1} fill={theme.colors.purple[4]} />
  </DonutChart>
</Box>
```
export const meta = {displayName: 'DonutChart'}

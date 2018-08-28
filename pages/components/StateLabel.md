### StateLabel

```.jsx
<Box mb={2}>
  <StateLabel state="open">Open</StateLabel>
</Box>
<Box mb={2}>
  <StateLabel state="closed">Closed</StateLabel>
</Box>
<Box mb={4}>
  <StateLabel state="merged">Merged</StateLabel>
</Box>

<ExampleHeading>By state (Octicons built in)</ExampleHeading>
<Box mb={2}>
  <StateLabel>Unknown</StateLabel>
</Box>
<Box mb={2}>
  <StateLabel state="open">Open</StateLabel>
</Box>
<Box mb={2}>
  <StateLabel state="closed">Closed</StateLabel>
</Box>
<Box mb={2}>
  <StateLabel state="merged">Merged</StateLabel>
</Box>
<Box mb={2}>
  <StateLabel state="reopened">Reopened</StateLabel>
</Box>

<ExampleHeading>By color</ExampleHeading>
<Box mb={2}>
  <StateLabel scheme="invalid">Invalid</StateLabel>
</Box>
<Box mb={2}>
  <StateLabel scheme="green">Green</StateLabel>
</Box>
<Box mb={2}>
  <StateLabel scheme="red">Red</StateLabel>
</Box>
<Box mb={2}>
  <StateLabel scheme="purple">Purple</StateLabel>
</Box>

<ExampleHeading>Small, by state</ExampleHeading>
<Box mb={2}>
  <StateLabel mr={2} small>Unknown</StateLabel>
  <StateLabel mr={2} small state="open">
    Open
  </StateLabel>
  <StateLabel mr={2} small state="closed">
    Closed
  </StateLabel>
  <StateLabel mr={2} small state="merged">
    Merged
  </StateLabel>
  <StateLabel mr={2} small state="reopened">
    Reopened
  </StateLabel>
</Box>

<ExampleHeading>Small, by color</ExampleHeading>
<Box mb={2}>
  <StateLabel mr={2} small scheme="invalid">
    Invalid
  </StateLabel>
  <StateLabel mr={2} small scheme="green">
    Green
  </StateLabel>
  <StateLabel mr={2} small scheme="red">
    Red
  </StateLabel>
  <StateLabel mr={2} small scheme="purple">
    Purple
  </StateLabel>
  <StateLabel mr={2} small scheme="green" icon={<Octicon icon={GitBranch} />}>
    Custom Octicon
  </StateLabel>
</Box>
```
export const meta = {displayName: 'StateLabel'}

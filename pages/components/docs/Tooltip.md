# Tooltip

```.jsx
<ExampleHeading mt={3}>Basic Tooltip</ExampleHeading>
<BorderBox p={3}>
  <Tooltip text="Hello, Tooltip!">Text with a tooltip</Tooltip>
</BorderBox>

<ExampleHeading mt={3}>Directions</ExampleHeading>
{Tooltip.directions.map(dir => (
  <BorderBox p={3} my={2} key="top">
    <Tooltip text="Hello, Tooltip!" direction="${dir}">
      Tooltip direction="${dir}"
    </Tooltip>
  </BorderBox>
))}


<ExampleHeading mt={3}>Word wrap</ExampleHeading>
<BorderBox p={3} my={2}>
  <Tooltip
    text="Hello, Tooltip! This tooltip has a sentence that will wrap to a newline."
    wrap
    direction="ne"
    align="left"
  >
    Word wrapping tooltip
  </Tooltip>
</BorderBox>

<ExampleHeading mt={3}>Alignment</ExampleHeading>
{Tooltip.alignments.map(align => (
  <BorderBox p={3} my={2} key="${align}">
    <Tooltip text="Hello, Tooltip!" direction="ne" align="${align}">
      Tooltip align="${align}"
    </Tooltip>
  </BorderBox>
))}


<ExampleHeading mt={3}>No Delay</ExampleHeading>
<BorderBox p={3} my={2}>
  <Tooltip noDelay text="Hello, Tooltip!">
    Text with a tooltip
  </Tooltip>
</BorderBox>`
```

export const meta = {displayName: 'Tooltip'}

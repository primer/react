
# Dropdown
---
```.jsx
<Box mb={4}>
  <ExampleHeading>Dropdown Primary</ExampleHeading>
  <Dropdown scheme="primary" minWidth="5em">
    <Box is="ul" m={0} p={0} className="list-style-none">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </Box>
  </Dropdown>
</Box>

<Box mb={4}>
  <ExampleHeading>Dropdown</ExampleHeading>
  <Dropdown minWidth="5em">
    <Box is="ul" m={0} p={0} className="list-style-none">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </Box>
  </Dropdown>
</Box>

<Box mb={4}>
  <ExampleHeading>Dropdown with title</ExampleHeading>
  <Dropdown title="Options" minWidth="5em">
    <Box is="ul" m={0} p={0} className="list-style-none">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </Box>
  </Dropdown>
</Box>
```

export const meta = {displayName: 'Dropdown'}

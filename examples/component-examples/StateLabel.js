import React from 'react'
import Octicon, {GitBranch} from '@githubprimer/octicons-react'
import {LiveEditor} from '@compositor/kit'
import {Box, StateLabel} from '../../src'
import {ExampleHeading} from '../doc-components'

const example1 = `<Box mb={2}>
  <StateLabel state="open">Open</StateLabel>
</Box>
<Box mb={2}>
  <StateLabel state="closed">Closed</StateLabel>
</Box>
<Box mb={4}>
  <StateLabel state="merged">Merged</StateLabel>
</Box>`

const example2 = `<Box mb={2}>
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
`

const example3 = `<Box mb={2}>
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
</Box>`

const example4 = `<Box mb={2}>
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
</Box>`

const example5 = `<Box mb={2}>
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
</Box>`

export default {
  name: 'StateLabel',
  element: (
    <div>
      <LiveEditor code={example1} scope={{Box, StateLabel}} />
      <Box mb={4}>
        <ExampleHeading>By state (Octicons built in)</ExampleHeading>
        <LiveEditor code={example2} scope={{Box, StateLabel}} />
      </Box>
      <Box mb={4}>
        <ExampleHeading>By color</ExampleHeading>
        <LiveEditor code={example3} scope={{Box, StateLabel}} />
      </Box>
      <Box mb={4}>
        <ExampleHeading>Small, by state</ExampleHeading>
        <LiveEditor code={example4} scope={{Box, StateLabel}} />
      </Box>
      <Box mb={4}>
        <ExampleHeading>Small, by color</ExampleHeading>
        <LiveEditor code={example5} scope={{Box, StateLabel, Octicon, GitBranch}} />
      </Box>
    </div>
  )
}

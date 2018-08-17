import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {BorderBox, Box, Tooltip} from '../../src'
import {ExampleHeading} from '../doc-components'

const basicExample = `<BorderBox p={3}>
  <Tooltip text="Hello, Tooltip!">Text with a tooltip</Tooltip>
</BorderBox>`

const directionExample = dir =>
  `<BorderBox p={3} my={2} key="${dir}">
  <Tooltip text="Hello, Tooltip!" direction="${dir}">
    Tooltip direction="${dir}"
  </Tooltip>
</BorderBox>
`

const wrapExample = `<BorderBox p={3} my={2}>
  <Tooltip
    text="Hello, Tooltip! This tooltip has a sentence that will wrap to a newline."
    wrap
    direction="ne"
    align="left"
  >
    Word wrapping tooltip
  </Tooltip>
</BorderBox>`

const alignmentExample = align =>
  `<BorderBox p={3} my={2} key="${align}">
  <Tooltip text="Hello, Tooltip!" direction="ne" align="${align}">
    Tooltip align="${align}"
  </Tooltip>
</BorderBox>`

const noDelayExample = `<BorderBox p={3} my={2}>
  <Tooltip noDelay text="Hello, Tooltip!">
    Text with a tooltip
  </Tooltip>
</BorderBox>`

export default {
  name: 'Tooltip',
  element: (
    <div>
      <ExampleHeading mt={3}>Basic Tooltip</ExampleHeading>
      <LiveEditor code={basicExample} scope={{Tooltip, BorderBox}} />
      <Box p={2} my={2}>
        <ExampleHeading mt={3}>Directions</ExampleHeading>
        {Tooltip.directions.map(dir => (
          <LiveEditor key={dir} code={directionExample(dir)} scope={{Tooltip, BorderBox, dir}} />
        ))}
        <ExampleHeading mt={3}>Alignment</ExampleHeading>
        {Tooltip.alignments.map(align => (
          <LiveEditor key={align} code={alignmentExample(align)} scope={{BorderBox, Tooltip, align}} />
        ))}
        <ExampleHeading mt={3}>Word wrap</ExampleHeading>
        <LiveEditor code={wrapExample} scope={{Tooltip, BorderBox}} />
        <ExampleHeading mt={3}>No Delay</ExampleHeading>
        <LiveEditor code={noDelayExample} scope={{Tooltip, BorderBox}} />
      </Box>
    </div>
  )
}

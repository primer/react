import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Box, Block, Tooltip} from '../../src'
import ExampleHeading from '../doc-components/ExampleHeading'

const basicExample = `<Box p={3}>
  <Tooltip text="Hello, Tooltip!">Text with a tooltip</Tooltip>
</Box>`

const directionExample = dir =>
  `<Box p={3} my={2} key="${dir}">
  <Tooltip text="Hello, Tooltip!" direction="${dir}">
    Tooltip direction="${dir}"
  </Tooltip>
</Box>
`

const wrapExample = `<Box p={3} my={2}>
  <Tooltip
    text="Hello, Tooltip! This tooltip has a sentence that will wrap to a newline."
    wrap
    direction="ne"
    align="left"
  >
    Word wrapping tooltip
  </Tooltip>
</Box>`

const alignmentExample = align =>
  `<Box p={3} my={2} key="${align}">
  <Tooltip text="Hello, Tooltip!" direction="ne" align="${align}">
    Tooltip align="${align}"
  </Tooltip>
</Box>`

const noDelayExample = `<Box p={3} my={2}>
  <Tooltip noDelay text="Hello, Tooltip!">
    Text with a tooltip
  </Tooltip>
</Box>`

const TooltipExample = {
  name: 'Tooltip',
  element: (
    <div>
      <ExampleHeading mt={3}>Basic Tooltip</ExampleHeading>
      <LiveEditor code={basicExample} scope={{Tooltip, Box}} />
      <Block p={2} my={2}>
        <ExampleHeading mt={3}>Directions</ExampleHeading>
        {Tooltip.directions.map(dir => (
          <LiveEditor key={dir} code={directionExample(dir)} scope={{Tooltip, Box, dir}} />
        ))}
        <ExampleHeading mt={3}>Alignment</ExampleHeading>
        {Tooltip.alignments.map(align => (
          <LiveEditor key={align} code={alignmentExample(align)} scope={{Box, Tooltip, align}} />
        ))}
        <ExampleHeading mt={3}>Word wrap</ExampleHeading>
        <LiveEditor code={wrapExample} scope={{Tooltip, Box}} />
        <ExampleHeading mt={3}>No Delay</ExampleHeading>
        <LiveEditor code={noDelayExample} scope={{Tooltip, Box}} />
      </Block>
    </div>
  )
}

export default TooltipExample

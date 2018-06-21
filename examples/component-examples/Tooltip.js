import React from 'react'
import { Box, Block, Tooltip } from '../../src'
import ExampleHeading from '../ExampleHeading'

const TooltipExample =
  {
    name: 'Tooltip',
    element: (
      <div>
        <Box p={3}>
          <Tooltip text='Hello, Tooltip!'>Text with a tooltip</Tooltip>
        </Box>
        <Block p={2}>
          <ExampleHeading mt={3}>Directions</ExampleHeading>
          {Tooltip.directions.map((d, i) => (
            <Box p={3} key={i}>
              <Tooltip text='Hello, Tooltip!' direction={d}>Tooltip direction={d}</Tooltip>
            </Box>
          ))}
          <ExampleHeading mt={3}>Alignment</ExampleHeading>
          <Box p={3}>
            <Tooltip text='Hello, Tooltip!' direction='ne' align='left'>Tooltip align left</Tooltip>
          </Box>
          <ExampleHeading mt={3}>Word wrap</ExampleHeading>
          <Box p={3}>
            <Tooltip text='Hello, Tooltip! This tooltip has a sentence that will wrap to a newline.' wrap  direction='ne' align='left'>Word wrapping tooltip</Tooltip>
          </Box>
          <ExampleHeading mt={3}>No Delay</ExampleHeading>
          <Box p={3}>
            <Tooltip noDelay text='Hello, Tooltip!'>Text with a tooltip</Tooltip>
          </Box>
        </Block>
      </div>
    )
  }

export default TooltipExample

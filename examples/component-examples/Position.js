import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Box, Position, Absolute, Relative, Fixed, Sticky} from '../../src'
import ExampleHeading from '../doc-components/ExampleHeading'

const scope = {Relative, Box, Absolute, Fixed, Sticky}

export default {
  name: 'Position',
  element: (
    <Box p={2} mb={200}>

      <ExampleHeading mb={2}>Relative + Absolute</ExampleHeading>
      <LiveEditor code={`
<Relative size={128} mx={128} my={6}>
  <Box border={1} borderColor="gray.2" size="100%">
    <Absolute left="100%" top={0} bg="red.1" p={1}>rt</Absolute>
    <Absolute right="100%" top={0} bg="green.1" p={1}>lt</Absolute>
    <Absolute left="100%" bottom={0} bg="blue.1" p={1}>rb</Absolute>
    <Absolute right="100%" bottom={0} bg="purple.1" p={1}>lb</Absolute>
    <Absolute left={0} top="100%" bg="orange.1" p={1}>bl</Absolute>
    <Absolute right={0} top="100%" bg="yellow.3" p={1}>br</Absolute>
    <Absolute left={0} bottom="100%" bg="red.1" p={1}>tl</Absolute>
    <Absolute right={0} bottom="100%" bg="blue.1" p={1}>tr</Absolute>
  </Box>
</Relative>
        `.trim()} scope={scope} />

      <ExampleHeading my={2}>Sticky</ExampleHeading>
      <LiveEditor code={`
<Box border={1} borderColor="green.5" height={1000}>
  <Sticky top={0} bg="green.2" p={4}>
    I'm sticky!
  </Sticky>
</Box>
        `.trim()} scope={scope} />

      <ExampleHeading my={2}>Fixed</ExampleHeading>
      <p>(see the bottom right of the screen)</p>
      <LiveEditor code={`
<Fixed bottom={0} right={0} bg="red.2" p={2}>
  I'm fixed to the bottom right.
</Fixed>
        `.trim()} scope={scope} />

    </Box>
  )
}

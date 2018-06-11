import React from 'react'
import {Block, Box, Caret, Text} from '../src'

export default () => (
  <Block p={4}>
    {['top', 'right', 'bottom', 'left'].map((edge, i) => (
      <Box p={2} mb={4} position='relative' maxWidth={400} key={i}>
        <Text mono>edge='{edge}'</Text>
        <Caret edge={edge} />
      </Box>
    ))}
    {['top', 'right', 'bottom', 'left'].map((edge, i) => (
      <Box shadow='medium' p={2} mb={4} position='relative' maxWidth={400} key={i}>
        <Text mono>edge='{edge}' in shadow='medium'</Text>
        <Caret edge={edge} />
      </Box>
    ))}
  </Block>
)

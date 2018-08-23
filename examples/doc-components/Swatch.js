import React from 'react'
import PropTypes from 'prop-types'
import {Box, Heading, Text} from '../../src'

export default function Swatch({name, index, color}) {
  return (
    <Box>
      <Box m={1} mt={3} p={6} bg={color} />
      <Heading is="h3" fontSize={2} px={1}>
        {name}.{index}
      </Heading>
      <Text px={1}>{color}</Text>
    </Box>
  )
}

Swatch.propTypes = {
  color: PropTypes.string,
  index: PropTypes.number,
  name: PropTypes.string
}

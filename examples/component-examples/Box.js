import React from 'react'
import { Box } from '../../src'

const BoxExample =
  {
    name: 'Box',
    element: (
      <div>
        <Box m={2}>This is a box</Box>
        <Box p={2} m={2}>This is a box with padding.</Box>
        <Box shadow='small' p={2} m={2}>This is a box with a small shadow.</Box>
        <Box shadow='medium' p={2} m={2}>This is a box with a medium shadow.</Box>
        <Box shadow='large' p={2} m={2}>This is a box with a large shadow.</Box>
        <Box shadow='extra-large' p={2} m={2}>This is a box with an extra-large shadow.</Box>
        <Box border={[true, 'green']} p={2} m={2}>This is a box with a green border.</Box>
      </div>
    )
  }

export default BoxExample

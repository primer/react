import React from 'react'
import {Box, theme} from '../../src'
import {Swatch} from '../doc-components'

const ColorsExample = {
  name: 'Colors',
  element: (
    <div>
      {['gray', 'blue', 'green', 'purple', 'yellow', 'orange'].map(hue => (
        <div className="d-flex" key={hue}>
          {theme.colors[hue].map((color, j) => <Swatch name={hue} index={j} key={color} color={color} />)}
        </div>
      ))}
      <div className="d-flex">
        <Box bg="blue.5" p={4} m={1} />
        <Box bg="green.5" p={4} m={1} />
        <Box bg="purple.5" p={4} m={1} />
        <Box bg="yellow.5" p={4} m={1} />
        <Box bg="red.5" p={4} m={1} />
        <Box bg="white" p={4} m={1} border={1} />
        <Box bg="gray.5" p={4} m={1} />
        <Box bg="gray.0" p={4} m={1} />
        <Box bg="blue.0" p={4} m={1} />
        <Box bg="purple.0" p={4} m={1} />
        <Box bg="red.0" p={4} m={1} />
      </div>
    </div>
  )
}

export default ColorsExample

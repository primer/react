import React from 'react'
import {Block, theme} from '../../src'
import Swatch from '../doc-components/Swatch'

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
        <Block bg="blue.5" p={4} m={1}/>
        <Block bg="green.5" p={4} m={1} />
        <Block bg="purple.5" p={4} m={1} />
        <Block bg="yellow.5" p={4} m={1} />
        <Block bg="red.5" p={4} m={1} />
        <Block bg="white" p={4} m={1} border={1} />
        <Block bg="gray.5" p={4} m={1} />
        <Block bg="gray.0" p={4} m={1} />
        <Block bg="blue.0" p={4} m={1} />
        <Block bg="purple.0" p={4} m={1} />
        <Block bg="red.0" p={4} m={1} />
      </div>
    </div>
  )
}

export default ColorsExample

import React from 'react'
import {Block, Text, theme} from '../src'
import {ExampleHeading} from '../lib'

function Swatch({name, index, color, ...rest}) {
  return (
    <div {...rest}>
      <div className='m-1 mt-3 p-6' style={{background: color}} />
      <ExampleHeading px={1}>
        {name}.{index}
      </ExampleHeading>
      <Text px={1}>
        {color}
      </Text>
    </div>
  )
}

export default () => (
  <Block>
    {['gray', 'blue', 'green', 'purple', 'yellow', 'orange'].map((hue, i) => (
      <div className='d-flex' key={i}>
        {theme.colors[hue].map((color, j) => (
          <Swatch name={hue} index={j} key={j} color={color}/>
        ))}
      </div>
    ))}
    <div className='d-flex'>
      <Block bg='blue' p={4} m={1} />
      <Block bg='green' p={4} m={1} />
      <Block bg='purple' p={4} m={1} />
      <Block bg='yellow' p={4} m={1} />
      <Block bg='red' p={4} m={1} />
      <Block bg='white' p={4} m={1} border />
      <Block bg='gray' p={4} m={1} />
      <Block bg='gray-light' p={4} m={1} />
      <Block bg='blue-light' p={4} m={1} />
      <Block bg='purple-light' p={4} m={1} />
      <Block bg='red-light' p={4} m={1} />
    </div>
  </Block>
)

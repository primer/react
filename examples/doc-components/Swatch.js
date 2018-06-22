import React from 'react'
import {Heading, Text} from '../../src'

export default function Swatch({name, index, color, ...rest}) {
  return (
    <div {...rest}>
      <div className='m-1 mt-3 p-6' style={{background: color}} />
      <Heading tag='h3' fontSize={2} px={1}>
        {name}.{index}
      </Heading>
      <Text px={1}>
        {color}
      </Text>
    </div>
  )
}

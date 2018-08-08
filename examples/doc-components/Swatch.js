import React from 'react'
import PropTypes from 'prop-types'
import {Heading, Text} from '../../src'

export default function Swatch({name, index, color}) {
  return (
    <div>
      <div className="m-1 mt-3 p-6" style={{background: color}} />
      <Heading is="h3" fontSize={2} px={1}>
        {name}.{index}
      </Heading>
      <Text px={1}>{color}</Text>
    </div>
  )
}

Swatch.propTypes = {
  color: PropTypes.string,
  index: PropTypes.number,
  name: PropTypes.string
}

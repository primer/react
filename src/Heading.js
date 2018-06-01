import React from 'react'
import chameleon from './chameleon'
import {mapTextProps} from './Text'

const Heading = chameleon('h1', mapTextProps)

Heading.defaultProps = {
  fontSize: 5,
  m: 0
}

export default Heading

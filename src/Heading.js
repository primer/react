import React from 'react'
import Text from './Text'

const Heading = Text.withComponent('h1', true)

Heading.defaultProps = {
  fontSize: 5,
  m: 0
}

export default Heading

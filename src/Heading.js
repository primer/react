import React from 'react'
import Text from './Text'

const Heading = Text.withComponent('h1', true)

Heading.defaultProps = {
  fontSize: 5,
  m: 0
}

const {defaultProps} = Heading
Heading.h1 = Heading // .withComponent('h1') is redundant
Heading.h2 = Heading.withComponent('h2', {defaultProps})
Heading.h3 = Heading.withComponent('h3', {defaultProps})
Heading.h4 = Heading.withComponent('h4', {defaultProps})
Heading.h5 = Heading.withComponent('h5', {defaultProps})
Heading.h6 = Heading.withComponent('h6', {defaultProps})

export default Heading

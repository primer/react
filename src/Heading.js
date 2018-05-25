import React from 'react'
import Text from './Text'

const Heading = Text.withComponent('h1')

Heading.defaultProps = {
  fontSize: 5,
  m: 0
}

Heading.h1 = Heading // .withComponent('h1') is redundant
Heading.h2 = Heading.withComponent('h2')
Heading.h3 = Heading.withComponent('h3')
Heading.h4 = Heading.withComponent('h4')
Heading.h5 = Heading.withComponent('h5')
Heading.h6 = Heading.withComponent('h6')

export default Heading

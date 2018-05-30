import React from 'react'
import Text from './Text'

const Heading = Text.withComponent('h1', true)

Heading.h1 = Heading
Heading.h2 = Heading.withComponent('h2')
Heading.h3 = Heading.withComponent('h3')
Heading.h4 = Heading.withComponent('h4')
Heading.h5 = Heading.withComponent('h5')
Heading.h6 = Heading.withComponent('h6')

Heading.h1.defaultProps = {m: 0, fontSize: 5}
Heading.h2.defaultProps = {m: 0, fontSize: 4}
Heading.h3.defaultProps = {m: 0, fontSize: 3}
Heading.h4.defaultProps = {m: 0, fontSize: 2}
Heading.h5.defaultProps = {m: 0, fontSize: 1}
Heading.h6.defaultProps = {m: 0, fontSize: 0}

export default Heading

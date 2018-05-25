import React from 'react'
import Text from './Text'

const Heading = Text.withComponent('h1', true)
Heading.defaultProps = {m: 0, fontSize: 5}

Heading.h1 = Heading
Heading.h2 = Heading.withComponent('h2', true, {defaultProps: {m: 0, fontSize: 4}})
Heading.h3 = Heading.withComponent('h3', true, {defaultProps: {m: 0, fontSize: 3}})
Heading.h4 = Heading.withComponent('h4', true, {defaultProps: {m: 0, fontSize: 2}})
Heading.h5 = Heading.withComponent('h5', true, {defaultProps: {m: 0, fontSize: 1}})
Heading.h6 = Heading.withComponent('h6', true, {defaultProps: {m: 0, fontSize: 0}})

export default Heading

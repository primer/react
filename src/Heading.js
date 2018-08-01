import React from 'react'
import Text from './Text'

export default function Heading(props) {
  return <Text {...props} />
}

Heading.defaultProps = {
  tag: 'h1',
  fontSize: 5,
  m: 0
}

Heading.propTypes = {
  ...Text.propTypes
}
